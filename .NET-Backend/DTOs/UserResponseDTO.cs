namespace HealthcareAPI.DTOs.User
{
    public class UserResponseDTO
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public string Contact { get; set; }
        public string Specialization { get; set; }
    }
}
