using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Client
    {
        [Key]
        public int ClientId { get; set; }

        [Required]
        public string ClientName { get; set; }

        public string Phone { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public string Address { get; set; }
    }
}