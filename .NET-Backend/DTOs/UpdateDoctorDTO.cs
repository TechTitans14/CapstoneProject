using System.ComponentModel.DataAnnotations;

namespace HealthcareAPI.DTOs
{
    public class UpdateDoctorDTO
    {
        [MaxLength(50)]
        public string? Name { get; set; }

        [MaxLength(50)]
        public string? Username { get; set; }

        // Optional — only update if provided
        [MinLength(6)]
        public string? Password { get; set; }

        [MaxLength(50)]
        public string? Specialization { get; set; }

        [MaxLength(50)]
        public string? Contact { get; set; }

        [MaxLength(20)]
        public string? Availability { get; set; }
    }
}
