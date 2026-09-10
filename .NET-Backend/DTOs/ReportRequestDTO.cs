using System.ComponentModel.DataAnnotations;

using System.ComponentModel.DataAnnotations;

namespace HealthcareAPI.DTOs
{
    public class ReportRequestDTO
    {
        [Required]
        [MaxLength(50)]
        public string ReportType { get; set; } = string.Empty;

        public string Department { get; set; } = string.Empty;

        public int? DoctorID { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
