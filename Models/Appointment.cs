using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HealthcareAPI.Models
{
    public class Appointment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AppointmentID { get; set; }

        [Required]
        public int PatientID { get; set; }

        [Required]
        public int DoctorID { get; set; }

        [Required]
        public int BookedBy { get; set; }

        public DateTime? BookedDate { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public TimeSpan AppointmentTime { get; set; }

        [MaxLength(20)]
        public string Status { get; set; } = "Scheduled";

        [MaxLength(255)]
        public string Reason { get; set; }

        // ============================================
        // NAVIGATION PROPERTIES
        // REMOVE [JsonIgnore] FROM THESE:
        // ============================================

        [ForeignKey(nameof(PatientID))]
        // ✅ REMOVE [JsonIgnore] - Patient data needs to be visible
        public virtual Patient Patient { get; set; }

        [ForeignKey(nameof(DoctorID))]
        // ✅ REMOVE [JsonIgnore] - Doctor data needs to be visible
        public virtual Doctor Doctor { get; set; }

        [ForeignKey(nameof(BookedBy))]
        // ✅ REMOVE [JsonIgnore] - Receptionist data needs to be visible
        public virtual Receptionist BookedByReceptionist { get; set; }

      
       
        [JsonIgnore]
        public virtual MedicalRecord MedicalRecord { get; set; }
    }
}
