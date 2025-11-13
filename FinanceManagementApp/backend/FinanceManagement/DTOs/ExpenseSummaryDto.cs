namespace FinanceManagement.DTOs
{
    public class ExpenseSummaryDto
    {
        public decimal PendingTotal { get; set; }
        public decimal ApprovedTotal { get; set; }
        public int SubmissionsCount { get; set; }
    }
}
