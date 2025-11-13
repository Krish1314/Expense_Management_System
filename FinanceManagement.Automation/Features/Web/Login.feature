Feature: Login
  Verify a user can log in to Finance Management UI

  @ui @smoke
  Scenario: Employee logs in successfully
    Given I navigate to the login page
    When I login as "employee"
    Then I should land on the home page


