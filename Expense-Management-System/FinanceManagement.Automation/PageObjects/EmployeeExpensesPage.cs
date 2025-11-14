using OpenQA.Selenium;
using FinanceManagement.Automation.Helpers;

namespace FinanceManagement.Automation.PageObjects
{
    public class EmployeeExpensesPage
    {
        private readonly IWebDriver _driver;
        public EmployeeExpensesPage(IWebDriver driver) { _driver = driver; }

        // Route helpers
        public void NavigateTo(string baseUrl)
        {
            _driver.Navigate().GoToUrl(baseUrl + "/employee/expenses");
        }

        // Form controls (match labels/placeholders and known ids/names)
        private By Title => By.XPath("//label/span[contains(.,'Title')]/../input | //input[@name='Title']");
        private By Date => By.XPath("//input[@type='date' and @name='Date']");
        private By Currency => By.XPath("//select[@name='Currency']");
        private By Amount => By.XPath("//input[@name='Amount' and @type='number']");
        private By Category => By.XPath("//select[@name='Category']");
        private By Description => By.XPath("//textarea[@name='Description']");
        private By ReceiptFile => By.Id("receipt-file");
        private By Submit => By.XPath("//button[contains(@class,'submit-btn') or normalize-space()='Submit Expense']");
        private By SuccessModal => By.XPath("//div[contains(@class,'modal-content')]//h2[contains(.,'Successfully Submitted')]");
        private By SuccessOk => By.XPath("//div[contains(@class,'modal-content')]//button[normalize-space()='OK']");

        public void FillExpenseForm(string title, string dateIso, string currency, string amount, string category, string description, string? receiptPath)
        {
            WaitFunctions.WaitForVisible(_driver, Title, TimeSpan.FromSeconds(10)).Clear();
            _driver.FindElement(Title).SendKeys(title);

            _driver.FindElement(Date).Clear();
            _driver.FindElement(Date).SendKeys(dateIso);

            _driver.FindElement(Currency).SendKeys(currency);

            _driver.FindElement(Amount).Clear();
            _driver.FindElement(Amount).SendKeys(amount);

            _driver.FindElement(Category).SendKeys(category);
            _driver.FindElement(Description).Clear();
            _driver.FindElement(Description).SendKeys(description);

            if (!string.IsNullOrWhiteSpace(receiptPath))
            {
                var fileInput = _driver.FindElement(ReceiptFile);
                fileInput.SendKeys(receiptPath);
            }
        }

        public void SubmitForm()
        {
            var btn = _driver.FindElement(Submit);
            ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView({block:'center'});", btn);
            System.Threading.Thread.Sleep(100);
            try { btn.Click(); }
            catch (OpenQA.Selenium.ElementClickInterceptedException)
            {
                ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", btn);
            }
        }

        public bool IsSuccessModalVisible()
        {
            try { return WaitFunctions.WaitForVisible(_driver, SuccessModal, TimeSpan.FromSeconds(5)) != null; }
            catch { return false; }
        }

        public void DismissSuccessModalIfPresent()
        {
            var buttons = _driver.FindElements(SuccessOk);
            if (buttons.Count > 0)
            {
                try { buttons[0].Click(); }
                catch { ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", buttons[0]); }
            }
        }
    }
}


