using OpenQA.Selenium;
using FinanceManagement.Automation.Helpers;

namespace FinanceManagement.Automation.PageObjects
{
    public class FinanceReimbursementsPage
    {
        private readonly IWebDriver _driver;
        public FinanceReimbursementsPage(IWebDriver driver) { _driver = driver; }

        private By PdfButton => By.XPath("//button[contains(.,'Download PDF') or contains(.,'PDF')]");
        private By ExcelButton => By.XPath("//button[contains(.,'Download Excel') or contains(.,'Excel')]");

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
                System.Threading.Thread.Sleep(80);
                alert.Accept();
            }
            catch (OpenQA.Selenium.NoAlertPresentException) { }
            catch { }
        }

        public void DownloadPdf() => SafeClick(PdfButton);
        public void DownloadExcel() => SafeClick(ExcelButton);
    }
}


