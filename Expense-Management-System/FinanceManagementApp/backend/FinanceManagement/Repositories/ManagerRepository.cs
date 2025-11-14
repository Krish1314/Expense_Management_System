using System.Collections.Generic;

namespace FinanceManagement.Repositories
{
    public class ManagerRepository
    {
        public List<string> FetchAllTeamExpenses()
        {
            // Database query here
            return new List<string>();
        }

        public string FetchExpenseDetailById(int id)
        {
            // DB query to get a single expense
            return "Expense detail";
        }

        public bool UpdateExpenseStatus(int expenseId, string status)
        {
            // DB update for expense status "Approved" or "Rejected"
            return true;
        }
    }
}
