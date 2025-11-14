Feature: Finance Admin
  Finance admin verifies submissions, downloads reimbursements, and logs out

  @ui @finance @smoke
  Scenario: Finance approves with credited remark
    Given I navigate to the login page
    When I login as "finance"
    Then I should land on the finance dashboard
    When I approve the first submission with remark "Credited"

  @ui @finance
  Scenario: Finance rejects a submission
    Given I navigate to the login page
    When I login as "finance"
    Then I should land on the finance dashboard
    When I reject the first submission with remark "Invalid bill"

  @ui @finance
  Scenario: Finance downloads reimbursements PDF and Excel, then logs out
    Given I navigate to the login page
    When I login as "finance"
    Then I should land on the finance dashboard
    When I open reimbursements list
    And I download reimbursements as PDF
    And I download reimbursements as Excel
    And I logout from the finance dashboard


