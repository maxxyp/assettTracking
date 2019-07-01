@ignore
Feature: Job Details

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000141"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P1" and Region "1 - Scotland"
    And I click Customer Details Tab

  Scenario: Check each section header in Annual Service Visit Job
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1319414267" on the Job List
    When Tabs - I click "Activities" button
    Then I confirm that form has "active" class state
    When I click Gas Property Safety button
    Then I confirm that form has "active" class state
    When Tabs - I click "Appliances" button
    Then I confirm that form has "active" class state
    When I click Previous Activities button
    Then I confirm that form has "active" class state
    When Tabs - I click "Parts" button
    Then I confirm that form has "active" class state

  Scenario: Click each section header in Annual Service Visit Job - Ready to Work
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1319414267" on the Job List
    And Job List - I click on the Go en-route button
    And I see Error message pop up