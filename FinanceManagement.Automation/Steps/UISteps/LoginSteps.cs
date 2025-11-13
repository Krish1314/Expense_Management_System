using FluentAssertions;
using NUnit.Framework;
using OpenQA.Selenium;
using TechTalk.SpecFlow;
using FinanceManagement.Automation.Helpers;
using FinanceManagement.Automation.PageObjects;
using FinanceManagement.Automation.WebDriver;
using System.Text.Json;

namespace FinanceManagement.Automation.Steps.UISteps
{
    [Binding]
    public class LoginSteps
    {
        private readonly ScenarioContext _ctx;
        private readonly IWebDriver _driver;
        private readonly LoginPageObject _login;
        private readonly HomePageObject _home;
        private readonly JsonElement _config;

        public LoginSteps(ScenarioContext ctx)
        {
            _ctx = ctx;
            _driver = Driver.Instance;
            _login = new LoginPageObject(_driver);
            _home = new HomePageObject(_driver);

            var configText = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Config", "appsettings.json"));
            _config = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(configText);
        }

        [Given("I navigate to the login page")]
        public void GivenINavigateToLogin()
        {
            var baseUrl = BaseConfig.GetWebBaseUrl();
            _login.NavigateTo(baseUrl);
        }

        [When("I login as \"(.*)\"")]
        public void WhenILoginAs(string role)
        {
            var account = _config.GetProperty("accounts").GetProperty(role);
            var email = account.GetProperty("email").GetString();
            var password = account.GetProperty("password").GetString();
            _login.Login(email!, password!);
        }

        [Then("I should land on the home page")]
        public void ThenIShouldLandOnHome()
        {
            _home.IsLoaded().Should().BeTrue("home page header should be visible after login");
        }
    }
}


