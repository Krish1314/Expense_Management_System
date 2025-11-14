using OpenQA.Selenium;
using FinanceManagement.Automation.Helpers;

namespace FinanceManagement.Automation.PageObjects
{
    public class EmployeeDashboardPage
    {
        private readonly IWebDriver _driver;
        public EmployeeDashboardPage(IWebDriver driver) { _driver = driver; }

        private By Header => By.XPath("//h1[contains(.,'Employee Dashboard')] | //h2[contains(.,'My Expenses')]");
        private By ExportButton => By.XPath("//button[contains(.,'Export to Excel')]");

        public void NavigateTo(string baseUrl)
        {
            _driver.Navigate().GoToUrl(baseUrl + "/employee/dashboard");
        }

        public bool IsLoaded()
        {
            return WaitFunctions.WaitForVisible(_driver, Header, TimeSpan.FromSeconds(8)) != null;
        }

        public void ExportToExcel()
        {
            var btn = WaitFunctions.WaitForVisible(_driver, ExportButton, TimeSpan.FromSeconds(5));
            ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView({block:'center'});", btn);
            System.Threading.Thread.Sleep(100);
            try { btn.Click(); }
            catch (OpenQA.Selenium.ElementClickInterceptedException)
            {
                ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", btn);
            }
        }
    }
}


