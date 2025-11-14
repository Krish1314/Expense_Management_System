using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FinanceManagement.Controllers
{
    [Route("api/reimbursement")]
    [ApiController]
    public class ReimbursementController : ControllerBase
    {
        // GET: api/reimbursement
        [HttpGet]
        public IActionResult GetReimbursements()
        {
            // Sample reimbursement list data
            var reimbursements = new List<ReimbursementModel>
            {
                new ReimbursementModel { Id = 12345, DateSubmitted = "12/12/2023", Description = "Team Lunch", Amount = 50, Status = "Approved", CreditedMonth = "Jan 2024" },
                new ReimbursementModel { Id = 12346, DateSubmitted = "12/11/2023", Description = "Client Dinner", Amount = 120, Status = "Pending", CreditedMonth = "Jan 2024" },
                new ReimbursementModel { Id = 12347, DateSubmitted = "11/20/2023", Description = "Software Subscription", Amount = 25, Status = "Rejected", CreditedMonth = "N/A" },
                new ReimbursementModel { Id = 12348, DateSubmitted = "10/15/2023", Description = "Office Supplies", Amount = 75, Status = "Credited", CreditedMonth = "Nov 2023" }
            };
            return Ok(reimbursements);
        }

        // GET: api/reimbursement/{id}
        [HttpGet("{id}")]
        public IActionResult GetReimbursementDetail(int id)
        {
            // Sample single reimbursement detail
            var reimbursement = new ReimbursementModel
            {
                Id = id,
                DateSubmitted = "12/12/2023",
                Description = "Team Lunch",
                Amount = 50,
                Status = "Approved",
                CreditedMonth = "Jan 2024"
            };
            return Ok(reimbursement);
        }
    }

    // Simple reimbursement model
    public class ReimbursementModel
    {
        public int Id { get; set; }
        public string DateSubmitted { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string CreditedMonth { get; set; }
    }
}
