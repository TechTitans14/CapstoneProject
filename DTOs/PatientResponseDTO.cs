namespace HealthcareAPI.DTOs
{
    public class PatientResponseDTO
    {
        public int PatientID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IDNumber { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public DateTime? DateRegistered { get; set; }
    }
}
