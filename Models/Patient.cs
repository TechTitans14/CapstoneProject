using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthcareAPI.Models
{
   

        public class Patient
        {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PatientID { get; set; }
        public string Name { get; set; }
            public string IDNumber { get; set; }
            public string Contact { get; set; }
            public string MedicalHistory { get; set; }
            public DateTime DateRegistered { get; set; }
            public string Gender { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public string Email { get; set; }

            public ICollection<Appointment> Appointments { get; set; }
            public ICollection<MedicalRecord> MedicalRecords { get; set; }
        }

    }

