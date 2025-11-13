using OpenQA.Selenium;

namespace FinanceManagement.Automation.WebDriver
{
    public static class Driver
    {
        private static readonly AsyncLocal<IWebDriver?> _current = new();
        public static IWebDriver Instance => _current.Value!;

        public static void Set(IWebDriver driver) => _current.Value = driver;
        public static void Quit()
        {
            try { _current.Value?.Quit(); } finally { _current.Value?.Dispose(); _current.Value = null; }
        }
    }
}


