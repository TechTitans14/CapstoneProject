using System.ComponentModel.DataAnnotations;

namespace HealthcareAPI.DTOs
{
    public class AppointmentDTO
    {
        [Required]
        public int PatientID { get; set; }

        [Required]
        public int DoctorID { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public TimeSpan AppointmentTime { get; set; }

        [MaxLength(255)]
        public string Reason { get; set; } = string.Empty;
    }
}
