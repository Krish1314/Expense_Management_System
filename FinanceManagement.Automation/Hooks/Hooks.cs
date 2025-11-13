using System.Text.Json;
using NUnit.Framework;
using OpenQA.Selenium;
using TechTalk.SpecFlow;
using FinanceManagement.Automation.WebDriver;

namespace FinanceManagement.Automation.Hooks
{
    [Binding]
    public class Hooks
    {
        private readonly ScenarioContext _scenarioContext;
        private dynamic _config = default!;

        public Hooks(ScenarioContext scenarioContext)
        {
            _scenarioContext = scenarioContext;
        }

        [BeforeTestRun]
        public static void BeforeTestRun()
        {
            // no-op for now
        }

        [BeforeScenario]
        public void BeforeScenario()
        {
            var configText = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Config", "appsettings.json"));
            _config = JsonSerializer.Deserialize<dynamic>(configText)!;

            string environment = _config.GetProperty("runSettings").GetProperty("environment").GetString()!;
            bool headless = _config.GetProperty("runSettings").GetProperty("headless").GetBoolean();

            IWebDriver driver = WebDriverFactory.CreateChrome(headless);
            Driver.Set(driver);
            _scenarioContext["webBaseUrl"] = _config.GetProperty("environments").GetProperty(environment).GetProperty("webBaseUrl").GetString();
        }

        [AfterScenario]
        public void AfterScenario()
        {
            if (TestContext.CurrentContext.Result.FailCount > 0)
            {
                try
                {
                    var screenshot = ((ITakesScreenshot)Driver.Instance).GetScreenshot();
                    var file = Path.Combine(TestContext.CurrentContext.WorkDirectory, $"screenshot_{Guid.NewGuid()}.png");
                    screenshot.SaveAsFile(file);
                    TestContext.AddTestAttachment(file);
                }
                catch { }
            }
            Driver.Quit();
        }
    }
}


