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
    public class MedicalRecordController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicalRecordController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================
        // GET: api/MedicalRecord/patient/5
        // ============================================
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecordsByPatient(int patientId)
        {
            try
            {
                var records = await _context.MedicalRecords
                    .Include(mr => mr.Patient)
                    .Include(mr => mr.Doctor)
                    .Where(mr => mr.PatientID == patientId)
                    .OrderByDescending(mr => mr.VisitDate)
                    .ToListAsync();

                return Ok(records);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // GET: api/MedicalRecord/5
        // ============================================
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalRecord>> GetMedicalRecord(int id)
        {
            try
            {
                var record = await _context.MedicalRecords
                    .Include(mr => mr.Patient)
                    .Include(mr => mr.Doctor)
                    .FirstOrDefaultAsync(mr => mr.RecordID == id);

                if (record == null)
                {
                    return NotFound($"Medical record with ID {id} not found");
                }

                return Ok(record);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // POST: api/MedicalRecord
        // ============================================
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<MedicalRecord>> CreateMedicalRecord([FromBody] MedicalRecordDTO dto)
        {
            try
            {
                Console.WriteLine("========================================");
                Console.WriteLine("📝 Creating Medical Record");
                Console.WriteLine("========================================");
                Console.WriteLine($"   PatientID: {dto.PatientID}");
                Console.WriteLine($"   DoctorID: {dto.DoctorID}");
                Console.WriteLine($"   AppointmentID: {dto.AppointmentID}");
                Console.WriteLine($"   Diagnosis: {dto.Diagnosis}");
                Console.WriteLine($"   Treatment: {dto.Treatment}");

                // Validate patient exists
                var patient = await _context.Patients.FindAsync(dto.PatientID);
                if (patient == null)
                {
                    return BadRequest($"Patient with ID {dto.PatientID} not found");
                }
                Console.WriteLine($"✅ Patient found: {patient.Name}");

                // Validate doctor exists
                var doctor = await _context.Doctors.FindAsync(dto.DoctorID);
                if (doctor == null)
                {
                    return BadRequest($"Doctor with ID {dto.DoctorID} not found");
                }
                Console.WriteLine($"✅ Doctor found: {doctor.Name}");

                // Create medical record
                var medicalRecord = new MedicalRecord
                {
                    PatientID = dto.PatientID,
                    DoctorID = dto.DoctorID,
                    AppointmentID = dto.AppointmentID,
                    Diagnosis = dto.Diagnosis ?? "",
                    Treatment = dto.Treatment ?? "",
                    VisitDate = dto.VisitDate ?? DateTime.Now
                };

                Console.WriteLine("💾 Saving to database...");
                _context.MedicalRecords.Add(medicalRecord);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Medical record created with ID: {medicalRecord.RecordID}");

                var createdRecord = await _context.MedicalRecords
                    .Include(mr => mr.Patient)
                    .Include(mr => mr.Doctor)
                    .FirstOrDefaultAsync(mr => mr.RecordID == medicalRecord.RecordID);

                return CreatedAtAction(nameof(GetMedicalRecord), new { id = medicalRecord.RecordID }, createdRecord);
            }
            catch (DbUpdateException dbEx)
            {
                // ✅ This will show the actual database error
                var innerMessage = dbEx.InnerException?.Message ?? dbEx.Message;
                Console.WriteLine($"❌ Database error: {innerMessage}");

                // Try to get more details
                if (dbEx.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception Type: {dbEx.InnerException.GetType().Name}");
                    Console.WriteLine($"Inner Exception: {dbEx.InnerException.Message}");

                    // If it's a MySqlException, we can get the error code
                    if (dbEx.InnerException is MySqlConnector.MySqlException mysqlEx)
                    {
                        Console.WriteLine($"MySQL Error Code: {mysqlEx.ErrorCode}");
                        Console.WriteLine($"MySQL SQL State: {mysqlEx.SqlState}");
                    }
                }

                return StatusCode(500, new
                {
                    error = "Database error occurred",
                    details = innerMessage,
                    fullError = dbEx.InnerException?.ToString()
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating medical record: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace });
            }
        }
    }
}








