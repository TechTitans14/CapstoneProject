using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HealthcareAPI.Models
{
    [Table("patients")]
    public class Patient
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("patientID")]
        public int PatientID { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("name")]
        public string Name { get; set; }

        [Required]
        [MaxLength(13)]
        [Column("IDNumber")]
        public string IDNumber { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("contact")]
        public string Contact { get; set; }

        [Column("medicalHistory")]
        public string MedicalHistory { get; set; }

        [Column("dateRegistered")]
        public DateTime? DateRegistered { get; set; }

        [MaxLength(10)]
        [Column("gender")]
        public string Gender { get; set; }

        [Column("dateOfBirth")]
        public DateTime? DateOfBirth { get; set; }

        [MaxLength(100)]
        [Column("email")]
        public string Email { get; set; }

        // Navigation Properties
        [JsonIgnore]
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

        [JsonIgnore]
        public virtual ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
    }
}

