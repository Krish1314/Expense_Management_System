using System.Text.Json;

namespace FinanceManagement.Automation.Helpers
{
    public static class BaseConfig
    {
        private static JsonElement _root;

        static BaseConfig()
        {
            var configPath = Path.Combine(AppContext.BaseDirectory, "Config", "appsettings.json");
            _root = JsonSerializer.Deserialize<JsonElement>(File.ReadAllText(configPath));
        }

        public static string GetWebBaseUrl()
        {
            var env = _root.GetProperty("runSettings").GetProperty("environment").GetString()!;
            return _root.GetProperty("environments").GetProperty(env).GetProperty("webBaseUrl").GetString()!;
        }
    }
}


