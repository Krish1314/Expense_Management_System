using OpenQA.Selenium;
using FinanceManagement.Automation.Helpers;

namespace FinanceManagement.Automation.PageObjects
{
    public class HomePageObject
    {
        private readonly IWebDriver _driver;
        public HomePageObject(IWebDriver driver) { _driver = driver; }

        private By Header => By.CssSelector("h1, h2, [data-testid='home-header']");

        public bool IsLoaded() => WaitFunctions.WaitForVisible(_driver, Header, TimeSpan.FromSeconds(10)) != null;
    }
}


