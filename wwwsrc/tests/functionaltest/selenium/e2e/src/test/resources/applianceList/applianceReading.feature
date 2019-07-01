@ignore
Feature: Appliance Reading

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000141"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work

  Scenario: Complete Appliance Readings Page
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Appliances" button
    And Appliance Details - I click the first appliance
    And I click appliance Reading Tab
    And Appliance Reading - I type Burner Pressure "0.5"
    And Appliance Reading - I type Reading Final Ratio "0.007"
    Then I verify that form has "state-valid" value

  Scenario: Add Supplementary Burner
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Appliances" button
    And Appliance Details - I click the first appliance
    And I click appliance Reading Tab
    And Appliance Reading - I type Burner Pressure "0.5"
    And Appliance Reading - I type Reading Final Ratio "0.007"
    And Appliance Reading - I click Supplementary Button
    And Appliance Reading - I type Supplementary Burner Pressure "0.4"
    And Appliance Reading - I type Supplementary Reading Final Ratio "0.005"
    Then I verify that form has "state-valid" value

  Scenario: Clear Out Readings
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Appliances" button
    And Appliance Details - I click the first appliance
    And I click appliance Reading Tab
    And Appliance Reading - I type Burner Pressure "0.5"
    And Appliance Reading - I type Reading Final Ratio "0.007"
    And Appliance Reading - I click Supplementary Button
    And Appliance Reading - I type Supplementary Burner Pressure "0.4"
    And Appliance Reading - I type Supplementary Reading Final Ratio "0.005"
    And I click Clear Button
    And Dialog Box - I see a warning message displaying "This will clear all readings and gas safety details. Are you sure you want to continue?"
    And Dialog box - I click Yes button
