namespace HealthcareAPI.DTOs
{
    public class AppointmentResponseDTO
    {
        public int AppointmentID { get; set; }
        public int PatientID { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public int DoctorID { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
    }
}
