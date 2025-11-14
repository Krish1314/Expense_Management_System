using OpenQA.Selenium;
using FinanceManagement.Automation.Helpers;

namespace FinanceManagement.Automation.PageObjects
{
    public class FinanceDashboardPage
    {
        private readonly IWebDriver _driver;
        public FinanceDashboardPage(IWebDriver driver) { _driver = driver; }

        private By Header => By.XPath("//h1[contains(.,'Finance Dashboard')] | //h2[contains(.,'Submissions') or contains(.,'Team Summary')]");
        private By FirstApprove => By.XPath("(//button[contains(.,'Approve')])[1]");
        private By FirstReject => By.XPath("(//button[contains(.,'Reject')])[1]");
        private By RemarkInput => By.XPath("//textarea | //input[@type='text' or @name='remark']");
        private By ReimbursementsTab => By.XPath("//a[contains(.,'Reimbursements')] | //button[contains(.,'Reimbursements')]");
        private By LogoutButton => By.XPath("//button[normalize-space()='Logout'] | //a[normalize-space()='Logout']");

        public bool IsLoaded()
        {
            return WaitFunctions.WaitForVisible(_driver, Header, TimeSpan.FromSeconds(10)) != null;
        }

        private void SafeClick(By locator)
        {
            var el = WaitFunctions.WaitForVisible(_driver, locator, TimeSpan.FromSeconds(10));
            ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView({block:'center'});", el);
            System.Threading.Thread.Sleep(120);
            try { el.Click(); }
            catch (OpenQA.Selenium.ElementClickInterceptedException)
            {
                ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", el);
            }
            DismissAnyAlertIfPresent();
        }

        private void DismissAnyAlertIfPresent()
        {
            try
            {
                var alert = _driver.SwitchTo().Alert();
                // brief pause to let text settle for some UIs
                System.Threading.Thread.Sleep(100);
                alert.Accept();
            }
            catch (OpenQA.Selenium.NoAlertPresentException) { }
            catch { }
        }

        public void ApproveFirstWithRemark(string remark)
        {
            SafeClick(FirstApprove);
            var input = _driver.FindElements(RemarkInput).FirstOrDefault();
            if (input != null)
            {
                input.Clear();
                input.SendKeys(remark);
            }
            // Try to confirm if a modal has a submit/ok
            var confirm = _driver.FindElements(By.XPath("//button[normalize-space()='OK' or normalize-space()='Submit' or normalize-space()='Confirm']")).FirstOrDefault();
            if (confirm != null) ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", confirm);
            DismissAnyAlertIfPresent();
        }

        public void RejectFirstWithRemark(string remark)
        {
            SafeClick(FirstReject);
            var input = _driver.FindElements(RemarkInput).FirstOrDefault();
            if (input != null)
            {
                input.Clear();
                input.SendKeys(remark);
            }
            var confirm = _driver.FindElements(By.XPath("//button[normalize-space()='OK' or normalize-space()='Submit' or normalize-space()='Confirm']")).FirstOrDefault();
            if (confirm != null) ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", confirm);
            DismissAnyAlertIfPresent();
        }

        public void OpenReimbursementsTab() => SafeClick(ReimbursementsTab);
        public void Logout() => SafeClick(LogoutButton);
    }
}


