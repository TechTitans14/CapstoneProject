using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthcareAPI.Models
{
    public class Prescription
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PrescriptionID { get; set; }
        public int RecordID { get; set; }
        public string Medication { get; set; }
        public string Dosage { get; set; }
        public string Duration { get; set; }

        public MedicalRecord MedicalRecord { get; set; }
    }
}
