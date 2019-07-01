@ignore
Feature: Prime and Sub Charge

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1300000003" on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label

  Scenario: Complete Task and check prime and sub charge applied to correct tasks
    And Tabs - I click "Activities" button
    When Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    And Tabs - I click "Activities" button
    And Activities - I select task "FIRST FIX - Central Heating Boiler"
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    Then I verify first task description "SHRT DUR G - Central Heating Boiler" Charge "STD LAB ONLY-2SIS" VAT "20%" and Amount "£50.00"
    And I verify second task description "FIRST FIX - Central Heating Boiler" Charge "STD LAB ONLY-2SIS" VAT "20%" and Amount "£99.00"