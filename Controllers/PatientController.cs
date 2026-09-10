using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareAPI.Models;
using HealthcareAPI.Data;
using Microsoft.AspNetCore.Authorization;

namespace HealthcareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================
        // GET: api/Patient
        // ============================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            try
            {
                var patients = await _context.Patients
                    .OrderBy(p => p.Name)
                    .ToListAsync();

                return Ok(patients);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching patients: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // GET: api/Patient/5
        // ============================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            try
            {
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.PatientID == id);

                if (patient == null)
                {
                    return NotFound($"Patient with ID {id} not found");
                }

                return Ok(patient);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching patient: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // POST: api/Patient/register
        // ============================================
        [HttpPost("register")]
        [Authorize(Roles = "Receptionist,Admin")]
        public async Task<ActionResult<Patient>> RegisterPatient([FromBody] Patient patient)
        {
            try
            {
                Console.WriteLine($"📝 Registering patient: {patient.Name}");
                Console.WriteLine($"   ID Number: {patient.IDNumber}");
                Console.WriteLine($"   Contact: {patient.Contact}");
                Console.WriteLine($"   Gender: {patient.Gender}");
                Console.WriteLine($"   Email: {patient.Email}");
                Console.WriteLine($"   DOB: {patient.DateOfBirth}");

                // ✅ Check if patient already exists
                var existingPatient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.IDNumber == patient.IDNumber);

                if (existingPatient != null)
                {
                    return BadRequest("Patient with this ID number already exists");
                }

                // ✅ Set DateRegistered
                patient.DateRegistered = DateTime.Now;

                // ✅ Add patient
                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Patient registered successfully with ID: {patient.PatientID}");

                return Ok(patient);
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
                Console.WriteLine($"❌ Error creating patient: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}