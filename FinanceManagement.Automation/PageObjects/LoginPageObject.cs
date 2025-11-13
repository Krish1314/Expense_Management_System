using OpenQA.Selenium;
using FinanceManagement.Automation.Helpers;

namespace FinanceManagement.Automation.PageObjects
{
    public class LoginPageObject
    {
        private readonly IWebDriver _driver;
        public LoginPageObject(IWebDriver driver)
        {
            _driver = driver;
        }

        // Be resilient to markup changes - select by nearby label/placeholder
        private By Email => By.XPath("//label[contains(.,'Username') or contains(.,'Email')]/following::input[1] | //input[contains(@placeholder,'username') or contains(@placeholder,'email')][1]");
        private By Password => By.XPath("//label[normalize-space()='Password']/following::input[1] | //input[@type='password']");
        private By Submit => By.XPath("//button[contains(@class,'login-btn') or @type='submit' or normalize-space()='Login']");

        public void NavigateTo(string baseUrl)
        {
            // App shows login on home route
            _driver.Navigate().GoToUrl(baseUrl);
        }

        public void Login(string email, string password)
        {
            WaitFunctions.WaitForVisible(_driver, Email, TimeSpan.FromSeconds(15)).Clear();
            _driver.FindElement(Email).SendKeys(email);
            WaitFunctions.WaitForVisible(_driver, Password, TimeSpan.FromSeconds(10)).Clear();
            _driver.FindElement(Password).SendKeys(password);
            _driver.FindElement(Submit).Click();
        }
    }
}


