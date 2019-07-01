@ignore
Feature: Risks

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000141"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Gas Job - I click on the Go en-route button and click Arrive Label
    And I click on first customer info on the Job List

  Scenario: Verify Engineer can add New Risk to Customer Property
    When I click on Risk Tab
    And I click Got it button
    And I click New Task Button
    And Risk - Reason - I select Animal
    And Risk - I type Report "This appliance is HIGH Risk"
    And New Appliance - I OK Button
    Then I verify New Risk - Reason "Animal" Report "This appliance is HIGH Risk" are displayed

  Scenario: Verify engineer can delete a Risk at Customer Property
    And I click on Risk Tab
    And I click Got it button
    And I click New Task Button
    And Risk - Reason - I select Animal
    And Risk - I type Report "This appliance is HIGH Risk"
    And New Appliance - I OK Button
    When Risks - I click Delete button
    And Dialog Box - I see a warning message displaying "Are you sure you want to delete the 'risk' ?"
    And Dialog box - I click Yes button
    Then I see that the risk delete is deleted