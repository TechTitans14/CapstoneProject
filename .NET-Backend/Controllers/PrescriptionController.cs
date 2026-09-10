using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareAPI.Models;
using HealthcareAPI.Data;
using HealthcareAPI.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace HealthcareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PrescriptionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrescriptionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================
        // GET: api/Prescription/patient/5
        // ============================================
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetPrescriptionsByPatient(int patientId)
        {
            try
            {
                Console.WriteLine($"🔍 Fetching prescriptions for patient: {patientId}");

                var prescriptions = await _context.Prescriptions
                    .Include(p => p.MedicalRecord)
                    .ThenInclude(mr => mr.Patient)
                    .Where(p => p.MedicalRecord.PatientID == patientId)
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => new
                    {
                        p.PrescriptionID,
                        p.RecordID,
                        p.Medication,
                        p.Dosage,
                        p.Duration,
                        p.Instructions,
                        p.CreatedAt,
                        VisitDate = p.MedicalRecord.VisitDate,
                        Diagnosis = p.MedicalRecord.Diagnosis,
                        PatientName = p.MedicalRecord.Patient.Name,
                        PatientID = p.MedicalRecord.Patient.PatientID
                    })
                    .ToListAsync();

                Console.WriteLine($"✅ Found {prescriptions.Count} prescriptions");
                return Ok(prescriptions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // POST: api/Prescription - USING YOUR EXISTING DTO
        // ============================================
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CreatePrescription([FromBody] PrescriptionDTO dto)
        {
            try
            {
                Console.WriteLine("========================================");
                Console.WriteLine("💊 Creating Prescription");
                Console.WriteLine("========================================");
                Console.WriteLine($"   RecordID: {dto.RecordID}");
                Console.WriteLine($"   Medication: {dto.Medication}");
                Console.WriteLine($"   Dosage: {dto.Dosage}");
                Console.WriteLine($"   Duration: {dto.Duration}");

                // ✅ Validate medical record exists
                var medicalRecord = await _context.MedicalRecords
                    .FirstOrDefaultAsync(mr => mr.RecordID == dto.RecordID);

                if (medicalRecord == null)
                {
                    Console.WriteLine($"❌ Medical record with ID {dto.RecordID} NOT found");
                    return BadRequest($"Medical record with ID {dto.RecordID} not found. Please create a consultation first.");
                }
                Console.WriteLine($"✅ Medical record found: {medicalRecord.RecordID}");

                // ✅ Create prescription from DTO
                var prescription = new Prescription
                {
                    RecordID = dto.RecordID,
                    Medication = dto.Medication,
                    Dosage = dto.Dosage,
                    Duration = dto.Duration,
                    Instructions = string.Empty,  // Instructions is optional
                    CreatedAt = DateTime.Now
                };

                // ✅ Add prescription
                _context.Prescriptions.Add(prescription);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Prescription created with ID: {prescription.PrescriptionID}");
                Console.WriteLine("========================================");

                return Ok(new
                {
                    message = "Prescription created successfully",
                    prescriptionID = prescription.PrescriptionID,
                    prescription = prescription
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"❌ Database error: {dbEx.Message}");
                Console.WriteLine($"Inner exception: {dbEx.InnerException?.Message}");
                return StatusCode(500, new
                {
                    error = "Database error occurred",
                    details = dbEx.InnerException?.Message
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating prescription: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // GET: api/Prescription/5
        // ============================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPrescription(int id)
        {
            try
            {
                var prescription = await _context.Prescriptions
                    .Include(p => p.MedicalRecord)
                    .ThenInclude(mr => mr.Patient)
                    .FirstOrDefaultAsync(p => p.PrescriptionID == id);

                if (prescription == null)
                {
                    return NotFound($"Prescription with ID {id} not found");
                }

                return Ok(prescription);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}

