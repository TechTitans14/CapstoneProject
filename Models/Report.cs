using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HealthcareAPI.Models
{
    public class Report
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReportID { get; set; }

        [Required]
        public int GeneratedBy { get; set; }

        [Required]
        [MaxLength(50)]
        public string Type { get; set; }

        public DateTime? GeneratedAt { get; set; }

        public string Summary { get; set; }

        // Navigation Properties
        [ForeignKey("GeneratedBy")]
        [JsonIgnore]
        public Admin Admin { get; set; }
    }
}
