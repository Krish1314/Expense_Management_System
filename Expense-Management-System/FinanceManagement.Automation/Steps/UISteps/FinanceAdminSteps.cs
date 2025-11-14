using FluentAssertions;
using OpenQA.Selenium;
using TechTalk.SpecFlow;
using FinanceManagement.Automation.PageObjects;
using FinanceManagement.Automation.WebDriver;

namespace FinanceManagement.Automation.Steps.UISteps
{
    [Binding]
    public class FinanceAdminSteps
    {
        private readonly IWebDriver _driver;
        private readonly FinanceDashboardPage _dashboard;
        private readonly FinanceReimbursementsPage _reimbursements;

        public FinanceAdminSteps()
        {
            _driver = Driver.Instance;
            _dashboard = new FinanceDashboardPage(_driver);
            _reimbursements = new FinanceReimbursementsPage(_driver);
        }

        [Then("I should land on the finance dashboard")]
        public void ThenOnFinanceDashboard()
        {
            _dashboard.IsLoaded().Should().BeTrue();
        }

        [When("I approve the first submission with remark \"(.*)\"")]
        public void WhenApproveWithRemark(string remark)
        {
            _dashboard.ApproveFirstWithRemark(remark);
        }

        [When("I reject the first submission with remark \"(.*)\"")]
        public void WhenRejectWithRemark(string remark)
        {
            _dashboard.RejectFirstWithRemark(remark);
        }

        [When("I open reimbursements list")]
        public void WhenOpenReimbursements()
        {
            _dashboard.OpenReimbursementsTab();
        }

        [When("I download reimbursements as PDF")]
        public void WhenDownloadPdf()
        {
            _reimbursements.DownloadPdf();
        }

        [When("I download reimbursements as Excel")]
        public void WhenDownloadExcel()
        {
            _reimbursements.DownloadExcel();
        }

        [When("I logout from the finance dashboard")]
        public void WhenLogout()
        {
            _dashboard.Logout();
        }
    }
}


