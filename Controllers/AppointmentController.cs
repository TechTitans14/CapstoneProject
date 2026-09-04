using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareAPI.Models;
using HealthcareAPI.Data;

namespace HealthcareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointment/doctor/1
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetDoctorAppointments(int doctorId)
        {
            try
            {
                Console.WriteLine($"🔍 Fetching appointments for doctor: {doctorId}");

                var appointments = await _context.Appointments
                    .Include(a => a.Patient)
                    .Include(a => a.Doctor)
                    .Where(a => a.DoctorID == doctorId)
                    .OrderBy(a => a.AppointmentDate)
                    .ThenBy(a => a.AppointmentTime)
                    .ToListAsync();

                Console.WriteLine($"✅ Found {appointments.Count} appointments");

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
