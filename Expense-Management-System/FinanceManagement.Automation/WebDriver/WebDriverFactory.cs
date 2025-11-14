using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace FinanceManagement.Automation.WebDriver
{
    public static class WebDriverFactory
    {
        public static IWebDriver CreateChrome(bool headless)
        {
            var options = new ChromeOptions();
            if (headless)
            {
                options.AddArgument("--headless=new");
                options.AddArgument("--disable-gpu");
            }
            options.AddArgument("--window-size=1920,1080");
            options.AddArgument("--no-sandbox");
            return new ChromeDriver(options);
        }
    }
}


