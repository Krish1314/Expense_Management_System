using System;

namespace FinanceManagement.DTOs
{
    public class ExpenseFilterDto
    {
        public string Team { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string Status { get; set; }
    }
}
