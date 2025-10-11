using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models;

public class Client
{
    [Key]
    public int ClientId { get; set; }

    [Required]
    public string ClientName { get; set; }

    [Required] [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Phone { get; set; }

    [Required]
    public string Address { get; set; }

}