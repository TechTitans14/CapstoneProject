using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthcareAPI.Models
{
    public class Doctor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DoctorID { get; set; }
        public string Name { get; set; }
        public string Specialization { get; set; }
        public string Availability { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }

        public ICollection<Appointment> Appointments { get; set; }
        public ICollection<MedicalRecord> MedicalRecords { get; set; }
    }
}
