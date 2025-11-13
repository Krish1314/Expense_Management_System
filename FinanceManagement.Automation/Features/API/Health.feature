Feature: API Health
  Basic API availability check

  @api @smoke
  Scenario: Weather endpoint responds
    When I GET "/weatherforecast"
    Then the response status should be 200


