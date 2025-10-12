using System.Text.Json.Serialization; // for [JsonIgnore]

namespace WebApplication2.Models
{
    public class Vendor
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string ContactPerson { get; set; }
        public string Phone { get; set; }

        // 1:N Relationship
        [JsonIgnore] // Ignore during POST/PUT serialization
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    }
}