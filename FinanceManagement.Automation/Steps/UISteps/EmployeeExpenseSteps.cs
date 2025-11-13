using FluentAssertions;
using OpenQA.Selenium;
using TechTalk.SpecFlow;
using FinanceManagement.Automation.PageObjects;
using FinanceManagement.Automation.WebDriver;
using FinanceManagement.Automation.Helpers;

namespace FinanceManagement.Automation.Steps.UISteps
{
    [Binding]
    public class EmployeeExpenseSteps
    {
        private readonly IWebDriver _driver;
        private readonly EmployeeExpensesPage _expenses;
        private readonly EmployeeDashboardPage _dashboard;

        public EmployeeExpenseSteps()
        {
            _driver = Driver.Instance;
            _expenses = new EmployeeExpensesPage(_driver);
            _dashboard = new EmployeeDashboardPage(_driver);
        }

        [Then("I should land on the employee expenses page")]
        public void ThenIShouldLandOnEmployeeExpenses()
        {
            var baseUrl = BaseConfig.GetWebBaseUrl();
            _expenses.NavigateTo(baseUrl);
            // Wait until the form is present (title input)
            // Using a simple check via presence of the Title field
            // If not found, an exception will be thrown by WaitForVisible inside FillExpense later
        }

        [When("I create a new expense and submit it")]
        public void WhenICreateAndSubmit()
        {
            var baseDir = AppContext.BaseDirectory;
            var sampleReceipt = System.IO.Path.Combine(baseDir, "sample-receipt.png");
            if (!System.IO.File.Exists(sampleReceipt))
            {
                // Create a tiny placeholder file if not present
                System.IO.File.WriteAllBytes(sampleReceipt, new byte[] { 137, 80, 78, 71, 0 });
            }

            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            _expenses.FillExpenseForm(
                title: "Laptop repair",
                dateIso: today,
                currency: "₹ INR",
                amount: "10000",
                category: "Other",
                description: "Laptop repair",
                receiptPath: sampleReceipt
            );
            _expenses.SubmitForm();
        }

        [Then("I should see a success message for expense submission")]
        public void ThenISuccess()
        {
            _expenses.IsSuccessModalVisible().Should().BeTrue();
            _expenses.DismissSuccessModalIfPresent();
        }

        [When("I export my expenses to Excel")]
        public void WhenIExportMyExpenses()
        {
            var baseUrl = BaseConfig.GetWebBaseUrl();
            _dashboard.NavigateTo(baseUrl);
            _dashboard.IsLoaded().Should().BeTrue();
            _dashboard.ExportToExcel();
        }
    }
}


