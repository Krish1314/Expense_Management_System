using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace FinanceManagement.Automation.Helpers
{
    public static class WaitFunctions
    {
        public static IWebElement WaitForVisible(IWebDriver driver, By locator, TimeSpan? timeout = null)
        {
            var wait = new WebDriverWait(new SystemClock(), driver, timeout ?? TimeSpan.FromSeconds(10), TimeSpan.FromMilliseconds(250));
            return wait.Until(drv =>
            {
                var el = drv.FindElement(locator);
                return el.Displayed ? el : null;
            });
        }
    }
}


