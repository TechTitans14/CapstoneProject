using System.ComponentModel.DataAnnotations;

namespace HealthcareAPI.DTOs.User
{
    public class UserCreateDTO
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; } // Admin, Doctor, Receptionist

        [MaxLength(50)]
        public string Contact { get; set; }

        public string Specialization { get; set; } // Only for Doctors
    }
}
