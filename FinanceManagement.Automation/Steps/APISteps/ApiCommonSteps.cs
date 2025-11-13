using System.Net;
using System.Text.Json;
using FluentAssertions;
using RestSharp;
using TechTalk.SpecFlow;

namespace FinanceManagement.Automation.Steps.APISteps
{
    [Binding]
    public class ApiCommonSteps
    {
        private readonly ScenarioContext _ctx;
        private readonly RestClient _client;
        private RestResponse? _response;

        public ApiCommonSteps(ScenarioContext ctx)
        {
            _ctx = ctx;
            var config = JsonSerializer.Deserialize<JsonElement>(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Config", "appsettings.json")));
            var env = config.GetProperty("runSettings").GetProperty("environment").GetString()!;
            var baseUrl = config.GetProperty("environments").GetProperty(env).GetProperty("apiBaseUrl").GetString()!;
            _client = new RestClient(baseUrl);
        }

        [When("I GET \"(.*)\"")]
        public async Task WhenIGet(string resource)
        {
            var req = new RestRequest(resource, Method.Get);
            _response = await _client.ExecuteAsync(req);
            _ctx["response"] = _response;
        }

        [Then("the response status should be (.*)")]
        public void ThenTheStatusShouldBe(int status)
        {
            _response.Should().NotBeNull();
            ((int)_response!.StatusCode).Should().Be(status);
        }
    }
}


