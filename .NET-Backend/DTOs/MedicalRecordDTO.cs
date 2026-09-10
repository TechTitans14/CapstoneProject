namespace HealthcareAPI.DTOs
{
    public class MedicalRecordDTO
    {
        public int PatientID { get; set; }
        public int DoctorID { get; set; }
        public int? AppointmentID { get; set; }
        public string Diagnosis { get; set; }
        public string Treatment { get; set; }
        public DateTime? VisitDate { get; set; }
    }
}
