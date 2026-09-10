using System.ComponentModel.DataAnnotations;

namespace HealthcareAPI.DTOs
{
    public class RescheduleDTO
    {
        [Required]
        public DateTime NewDate { get; set; }

        [Required]
        public TimeSpan NewTime { get; set; }
    }
}
