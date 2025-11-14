Feature: Employee Expense
  Employee logs in, creates an expense with receipt, submits it, and exports

  @ui @employee @smoke
  Scenario: Employee creates and submits a new expense and exports
    Given I navigate to the login page
    When I login as "employee"
    Then I should land on the employee expenses page
    When I create a new expense and submit it
    Then I should see a success message for expense submission
    When I export my expenses to Excel


