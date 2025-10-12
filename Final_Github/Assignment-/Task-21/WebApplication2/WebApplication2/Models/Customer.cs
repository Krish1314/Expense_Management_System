namespace WebApplication2.Models
{public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        // Foreign key for Vendor
        public int VendorId { get; set; }
        public Vendor Vendor { get; set; }
    }
}