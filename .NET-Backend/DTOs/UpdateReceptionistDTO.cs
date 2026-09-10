using System.ComponentModel.DataAnnotations;

namespace HealthcareAPI.DTOs
{
    public class UpdateReceptionistDTO
    {
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Contact { get; set; } = string.Empty;
    }
}
