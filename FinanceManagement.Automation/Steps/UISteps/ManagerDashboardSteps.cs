using FluentAssertions;
using OpenQA.Selenium;
using TechTalk.SpecFlow;
using FinanceManagement.Automation.PageObjects;
using FinanceManagement.Automation.WebDriver;

namespace FinanceManagement.Automation.Steps.UISteps
{
    [Binding]
    public class ManagerDashboardSteps
    {
        private readonly IWebDriver _driver;
        private readonly ManagerDashboardPage _page;

        public ManagerDashboardSteps()
        {
            _driver = Driver.Instance;
            _page = new ManagerDashboardPage(_driver);
        }

        [Then("I should land on the manager dashboard")]
        public void ThenIShouldLandOnManagerDashboard()
        {
            _page.IsLoaded().Should().BeTrue("manager dashboard header should be visible");
        }

        [When("I open the first receipt if available")]
        public void WhenIOpenFirstReceipt()
        {
            _page.OpenFirstReceiptIfAvailable();
        }

        [Then("a receipt viewer should be visible")]
        public void ThenReceiptViewerShouldBeVisible()
        {
            _page.IsReceiptViewerVisible().Should().BeTrue("receipt viewer should appear when a receipt is opened");
        }

        [When("I approve the first expense")]
        public void WhenIApproveFirst()
        {
            _page.ApproveFirstExpense();
        }

        [When("I reject the first expense")]
        public void WhenIRejectFirst()
        {
            _page.RejectFirstExpense();
        }

        [When("I request info on the first expense with comment \"(.*)\"")]
        public void WhenIRequestInfo(string comment)
        {
            _page.RequestInfoOnFirstExpense(comment);
        }

        [When("I export the manager dashboard to Excel")]
        public void WhenIExport()
        {
            _page.ExportToExcel();
        }

        [When("I logout from the manager dashboard")]
        public void WhenILogout()
        {
            _page.Logout();
        }
    }
}


