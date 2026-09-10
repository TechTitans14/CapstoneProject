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
    public class DoctorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================
        // GET: api/Doctor
        // Get all doctors
        // ============================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDoctors()
        {
            try
            {
                var doctors = await _context.Doctors
                    .OrderBy(d => d.Name)
                    .Select(d => new
                    {
                        d.DoctorID,
                        d.Name,
                        d.Specialization,
                        d.Availability,
                        d.Username
                    })
                    .ToListAsync();

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching doctors: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // GET: api/Doctor/{id}
        // Get a specific doctor
        // ============================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            try
            {
                var doctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.DoctorID == id);

                if (doctor == null)
                {
                    return NotFound($"Doctor with ID {id} not found");
                }

                return Ok(doctor);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching doctor: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // GET: api/Doctor/available
        // Get all available doctors
        // ============================================
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableDoctors()
        {
            try
            {
                var doctors = await _context.Doctors
                    .Where(d => d.Availability == "Available")
                    .OrderBy(d => d.Name)
                    .Select(d => new
                    {
                        d.DoctorID,
                        d.Name,
                        d.Specialization,
                        d.Availability,
                        d.Username
                    })
                    .ToListAsync();

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching available doctors: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // PUT: api/Doctor/{id}/availability
        // Update doctor availability
        // ============================================
        [HttpPut("{id}/availability")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAvailability(int id, [FromBody] string availability)
        {
            try
            {
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor == null)
                {
                    return NotFound($"Doctor with ID {id} not found");
                }

                doctor.Availability = availability;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Availability updated successfully", availability = doctor.Availability });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating availability: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
