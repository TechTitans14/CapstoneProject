using System.ComponentModel.DataAnnotations;

namespace HealthcareAPI.DTOs
{
    public class CreateDoctorDTO
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Specialization { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Contact { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Availability { get; set; } = "Available";
    }
}
