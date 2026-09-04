using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareAPI.DTOs;  // ← Using DTOs namespace only
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

        [HttpPost("register")]
        [Authorize(Roles = "Receptionist,Admin")]
        public async Task<ActionResult<PatientResponseDTO>> RegisterPatient(PatientRegistrationDTO registrationDTO)
        {
            // Check if patient already exists
            var existingPatient = await _context.Patients
                .FirstOrDefaultAsync(p => p.IDNumber == registrationDTO.IDNumber);

            if (existingPatient != null)
                return BadRequest("Patient with this ID number already exists");

            var patient = new Patient
            {
                Name = registrationDTO.Name,
                IDNumber = registrationDTO.IDNumber,
                Contact = registrationDTO.Contact,
                Gender = registrationDTO.Gender,
                DateOfBirth = registrationDTO.DateOfBirth,
                Email = registrationDTO.Email,
                DateRegistered = DateTime.Now
            };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            var response = new PatientResponseDTO
            {
                PatientID = patient.PatientID,
                Name = patient.Name,
                IDNumber = patient.IDNumber,
                Contact = patient.Contact,
                Gender = patient.Gender,
                DateOfBirth = patient.DateOfBirth,
                Email = patient.Email,
                DateRegistered = patient.DateRegistered
            };

            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientResponseDTO>>> GetAllPatients()
        {
            var patients = await _context.Patients
                .Select(p => new PatientResponseDTO
                {
                    PatientID = p.PatientID,
                    Name = p.Name,
                    IDNumber = p.IDNumber,
                    Contact = p.Contact,
                    Gender = p.Gender,
                    DateOfBirth = p.DateOfBirth,
                    Email = p.Email,
                    DateRegistered = p.DateRegistered
                })
                .ToListAsync();

            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientResponseDTO>> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound();

            var response = new PatientResponseDTO
            {
                PatientID = patient.PatientID,
                Name = patient.Name,
                IDNumber = patient.IDNumber,
                Contact = patient.Contact,
                Gender = patient.Gender,
                DateOfBirth = patient.DateOfBirth,
                Email = patient.Email,
                DateRegistered = patient.DateRegistered
            };

            return Ok(response);
        }
    }
}