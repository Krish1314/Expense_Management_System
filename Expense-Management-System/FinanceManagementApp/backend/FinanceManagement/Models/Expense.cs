using System;

namespace FinanceManagement.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public decimal Amount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime DateSubmitted { get; set; }
        public int EmployeeId { get; set; }
        public string? receiptUrl { get; set; }    // Nullable
        //public User Employee { get; set; }
        public string Role { get; set; } = "";
        public string Category { get; set; } = "";
        public string Currency { get; set; } = "";
        public string Description { get; set; } = "";
    }
}
