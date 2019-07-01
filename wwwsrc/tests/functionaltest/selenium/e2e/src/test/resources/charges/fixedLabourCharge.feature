@ignore
Feature: Fixed Labour Charge SLO Prime

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label

  Scenario: Complete Task and check standard labour charge applied
    When I click on the Charges tab
    Then I wait for the Charges tab to display "There are no charges to apply"
    And Tabs - I click "Activities" button
    When Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    Then I see activity charge price equals £79.00 for Labour
    And I see charge total including VAT equals £79.00

  Scenario: Make Charges tab invalid
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    And Tabs - I click "Activities" button
    Then I verify that the charges mustashe tab is red

  Scenario: Make Charges valid when selecting Charge OK
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    When Charges - I click on "CHARGE OK"
    And Tabs - I click "Activities" button
    Then I verify that the charges mustashe tab is green

  Scenario: Make Charges NOT OK
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    When Charges - I click on "CHARGE NOT OK"
    And I see a warning marker - Input is Required
    And Remarks - I type in "More than originally quoted" in the Remarks textbox
    And Tabs - I click "Activities" button
    And I click on the Charges tab
    Then I verify that the charges mustashe tab is green

  Scenario: Make charges Incomplete - Mustache goes amber
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    When Charges - I click on "CHARGE NOT OK"
    And I see a warning marker - Input is Required
    And Remarks - I type in "More than originally quoted" in the Remarks textbox
    And Tabs - I click "Activities" button
    And I click on the Charges tab
    Then I verify that the charges mustashe tab is green

  Scenario: Add Employee Discount
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    And Activity Description - I click the chevron
    And Select Discount - I select "EMPLOYEE" from the dropdown
    Then I verify that discount "25% applied" is shown
    And I verify that the discount amount is "-£16.46"
    And I verify that the total amount is "£59.24"
    And I verify total charge including VAT is "£59.24"