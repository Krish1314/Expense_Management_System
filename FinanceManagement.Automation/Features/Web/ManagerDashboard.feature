Feature: Manager Dashboard
  Validate manager can log in and view team expenses and receipts

  @ui @manager @smoke
  Scenario: Manager logs in and views a receipt
    Given I navigate to the login page
    When I login as "manager"
    Then I should land on the manager dashboard
    When I open the first receipt if available
    Then a receipt viewer should be visible

  @ui @manager
  Scenario: Manager approves first expense
    Given I navigate to the login page
    When I login as "manager"
    Then I should land on the manager dashboard
    When I approve the first expense

  @ui @manager
  Scenario: Manager rejects first expense
    Given I navigate to the login page
    When I login as "manager"
    Then I should land on the manager dashboard
    When I reject the first expense

  @ui @manager
  Scenario: Manager requests info on first expense
    Given I navigate to the login page
    When I login as "manager"
    Then I should land on the manager dashboard
    When I request info on the first expense with comment "Please attach original bill"

  @ui @manager
  Scenario: Manager exports to Excel and logs out
    Given I navigate to the login page
    When I login as "manager"
    Then I should land on the manager dashboard
    When I export the manager dashboard to Excel
    When I logout from the manager dashboard


