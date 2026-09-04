namespace HealthcareAPI.DTOs
{
    public class LoginResponseDTO
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }
}
