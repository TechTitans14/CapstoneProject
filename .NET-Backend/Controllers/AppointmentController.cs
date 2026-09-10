using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareAPI.Models;
using HealthcareAPI.Data;
using HealthcareAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace HealthcareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================
        // GET: api/Appointment/doctor/1
        // ============================================
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetDoctorAppointments(int doctorId)
        {
            try
            {
                var appointments = await _context.Appointments
                    .Include(a => a.Patient)
                    .Include(a => a.Doctor)
                    .Where(a => a.DoctorID == doctorId)
                    .OrderBy(a => a.AppointmentDate)
                    .ThenBy(a => a.AppointmentTime)
                    .ToListAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching doctor appointments: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // GET: api/Appointment/5
        // ============================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments
                    .Include(a => a.Patient)
                    .Include(a => a.Doctor)
                    .FirstOrDefaultAsync(a => a.AppointmentID == id);

                if (appointment == null)
                {
                    return NotFound($"Appointment with ID {id} not found");
                }

                return Ok(appointment);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching appointment: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // GET: api/Appointment
        // ============================================
        [HttpGet]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAllAppointments()
        {
            try
            {
                var appointments = await _context.Appointments
                    .Include(a => a.Patient)
                    .Include(a => a.Doctor)
                    .OrderByDescending(a => a.AppointmentDate)
                    .ToListAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching all appointments: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // POST: api/Appointment/book - WITH DOUBLE-BOOKING CHECK
        // ============================================
        [HttpPost("book")]
        [Authorize(Roles = "Receptionist,Admin")]
        public async Task<ActionResult<Appointment>> BookAppointment([FromBody] AppointmentDTO appointmentDTO)
        {
            try
            {
                Console.WriteLine($"📝 Booking appointment for patient: {appointmentDTO.PatientID}");
                Console.WriteLine($"   Doctor: {appointmentDTO.DoctorID}");
                Console.WriteLine($"   Date: {appointmentDTO.AppointmentDate}");
                Console.WriteLine($"   Time: {appointmentDTO.AppointmentTime}");

                // ✅ Check if doctor exists
                var doctor = await _context.Doctors.FindAsync(appointmentDTO.DoctorID);
                if (doctor == null)
                {
                    return BadRequest("Doctor not found");
                }

                // ✅ Check if patient exists
                var patient = await _context.Patients.FindAsync(appointmentDTO.PatientID);
                if (patient == null)
                {
                    return BadRequest("Patient not found");
                }

                // ✅ DOUBLE-BOOKING CHECK
                var existingAppointment = await _context.Appointments
                    .AnyAsync(a => a.DoctorID == appointmentDTO.DoctorID &&
                                  a.AppointmentDate == appointmentDTO.AppointmentDate &&
                                  a.AppointmentTime == appointmentDTO.AppointmentTime &&
                                  a.Status != "Cancelled");

                if (existingAppointment)
                {
                    Console.WriteLine($"❌ Doctor {appointmentDTO.DoctorID} already booked at {appointmentDTO.AppointmentTime} on {appointmentDTO.AppointmentDate}");
                    return Conflict(new
                    {
                        message = "Doctor is not available at this time. Please select a different time or date.",
                        conflict = true
                    });
                }

                // ✅ Get the current user ID from the token
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                var appointment = new Appointment
                {
                    PatientID = appointmentDTO.PatientID,
                    DoctorID = appointmentDTO.DoctorID,
                    BookedBy = userId,
                    BookedDate = DateTime.Now,
                    AppointmentDate = appointmentDTO.AppointmentDate,
                    AppointmentTime = appointmentDTO.AppointmentTime,
                    Reason = appointmentDTO.Reason,
                    Status = "Scheduled"
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Appointment booked successfully: {appointment.AppointmentID}");

                var createdAppointment = await _context.Appointments
                    .Include(a => a.Patient)
                    .Include(a => a.Doctor)
                    .FirstOrDefaultAsync(a => a.AppointmentID == appointment.AppointmentID);

                return Ok(createdAppointment);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error booking appointment: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // PUT: api/Appointment/cancel/5
        // ============================================
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                    return NotFound($"Appointment with ID {id} not found");

                if (appointment.Status == "Cancelled")
                    return BadRequest("Appointment is already cancelled");

                if (appointment.Status == "Completed")
                    return BadRequest("Cannot cancel a completed appointment");

                appointment.Status = "Cancelled";
                await _context.SaveChangesAsync();

                return Ok(new { message = "Appointment cancelled successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error cancelling appointment: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // PUT: api/Appointment/reschedule/5
        // ============================================
        [HttpPut("reschedule/{id}")]
        public async Task<IActionResult> RescheduleAppointment(int id, [FromBody] RescheduleDTO rescheduleDTO)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                    return NotFound($"Appointment with ID {id} not found");

                if (appointment.Status == "Cancelled")
                    return BadRequest("Cannot reschedule a cancelled appointment");

                if (appointment.Status == "Completed")
                    return BadRequest("Cannot reschedule a completed appointment");

                // ✅ Check if new slot is available
                var conflict = await _context.Appointments
                    .AnyAsync(a => a.DoctorID == appointment.DoctorID &&
                                  a.AppointmentDate == rescheduleDTO.NewDate &&
                                  a.AppointmentTime == rescheduleDTO.NewTime &&
                                  a.Status != "Cancelled" &&
                                  a.AppointmentID != id);

                if (conflict)
                    return BadRequest("Time slot is not available");

                appointment.AppointmentDate = rescheduleDTO.NewDate;
                appointment.AppointmentTime = rescheduleDTO.NewTime;
                appointment.Status = "Rescheduled";

                await _context.SaveChangesAsync();

                return Ok(new { message = "Appointment rescheduled successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error rescheduling appointment: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}

