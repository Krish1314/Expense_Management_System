using System;

namespace FinanceManagement.DTOs
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime DateSubmitted { get; set; }
        public string EmployeeName { get; set; }
        public string Role { get; set; }
        public string ReceiptUrl { get; set; }
        public string Category { get; set; }
    }
}
