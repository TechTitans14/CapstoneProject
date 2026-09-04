using System.ComponentModel.DataAnnotations;

namespace HealthcareAPI.DTOs
{
    public class PatientRegistrationDTO
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(13)]
        public string IDNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string Contact { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string Gender { get; set; } = string.Empty;

        public DateTime? DateOfBirth { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}
