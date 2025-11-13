using OpenQA.Selenium;
using FinanceManagement.Automation.Helpers;

namespace FinanceManagement.Automation.PageObjects
{
    public class ManagerDashboardPage
    {
        private readonly IWebDriver _driver;
        public ManagerDashboardPage(IWebDriver driver) { _driver = driver; }

        private By Header => By.XPath("//h1[contains(.,'Manager Dashboard')] | //h2[contains(.,'Team Requests')] ");
        private By FirstReceiptButton => By.XPath("(//button[contains(.,'View Receipt')])[1]");
        private By ReceiptViewer => By.XPath("//*[contains(.,'Receipt Viewer') or @data-testid='receipt-viewer']");
        private By FirstApprove => By.XPath("(//table//tr[td]//button[normalize-space()='Approve'])[1]");
        private By FirstReject => By.XPath("(//table//tr[td]//button[normalize-space()='Reject'])[1]");
        private By FirstRequestInfo => By.XPath("(//table//tr[td]//button[contains(normalize-space(),'Request Info')])[1]");
        private By RequestInfoTextarea => By.XPath("//textarea[@rows='4' or @name='comment' or @placeholder]");
        private By RequestInfoSubmit => By.XPath("//div[contains(@class,'modal-content')]//button[normalize-space()='Submit']");
        private By SuccessModalOk => By.XPath("//div[contains(@class,'modal-content')]//button[normalize-space()='OK']");
        private By ExportButton => By.XPath("//button[contains(.,'Export to Excel')]");
        private By LogoutButton => By.XPath("//button[normalize-space()='Logout'] | //a[normalize-space()='Logout']");

        public bool IsLoaded()
        {
            return WaitFunctions.WaitForVisible(_driver, Header, TimeSpan.FromSeconds(10)) != null;
        }

        public void OpenFirstReceiptIfAvailable()
        {
            var buttons = _driver.FindElements(FirstReceiptButton);
            if (buttons.Count == 0) return;

            var btn = buttons[0];
            try
            {
                // Scroll into view
                ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView({block:'center'});", btn);
                // Small wait for layout/overlay animations
                System.Threading.Thread.Sleep(200);
                // Try a regular click first
                btn.Click();
            }
            catch (OpenQA.Selenium.ElementClickInterceptedException)
            {
                // Fallback to JS click if intercepted by sticky elements
                ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", btn);
            }
        }

        public bool IsReceiptViewerVisible()
        {
            try
            {
                return WaitFunctions.WaitForVisible(_driver, ReceiptViewer, TimeSpan.FromSeconds(5)) != null;
            }
            catch { return false; }
        }

        private void SafeClick(By locator)
        {
            var el = WaitFunctions.WaitForVisible(_driver, locator, TimeSpan.FromSeconds(10));
            ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView({block:'center'});", el);
            System.Threading.Thread.Sleep(150);
            try { el.Click(); }
            catch (OpenQA.Selenium.ElementClickInterceptedException)
            {
                ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", el);
            }
        }

        public void ApproveFirstExpense() => SafeClick(FirstApprove);
        public void RejectFirstExpense() => SafeClick(FirstReject);
        public void RequestInfoOnFirstExpense(string comment)
        {
            SafeClick(FirstRequestInfo);
            var ta = WaitFunctions.WaitForVisible(_driver, RequestInfoTextarea, TimeSpan.FromSeconds(5));
            ta.Clear();
            ta.SendKeys(comment);
            SafeClick(RequestInfoSubmit);
            // Dismiss success modal if shown
            var okButtons = _driver.FindElements(SuccessModalOk);
            if (okButtons.Count > 0)
            {
                ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", okButtons[0]);
            }
        }

        public void ExportToExcel() => SafeClick(ExportButton);
        public void Logout() => SafeClick(LogoutButton);
    }
}


