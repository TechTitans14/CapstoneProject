using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HealthcareAPI.Models
{
    public class MedicalRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RecordID { get; set; }

        [Required]
        public int PatientID { get; set; }

        [Required]
        public int DoctorID { get; set; }

        [Required]
        public int AppointmentID { get; set; }

        public string Diagnosis { get; set; }

        public string Treatment { get; set; }

        public DateTime? VisitDate { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(PatientID))]
        [JsonIgnore]
        public virtual Patient Patient { get; set; }

        [ForeignKey(nameof(DoctorID))]
        [JsonIgnore]
        public virtual Doctor Doctor { get; set; }

        [ForeignKey(nameof(AppointmentID))]
        [JsonIgnore]
        public virtual Appointment Appointment { get; set; }

        [JsonIgnore]
        public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    }
}

