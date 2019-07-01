@ignore
Feature: Appliance Details

    Background:
      Given I am on the SettingsPage
      And I wait for the app data to load
      And I enter training engineer ID "0000141"
      And I click the select button Tab
      And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
      And I click Customer Details Tab
      And I select Ready for work

  Scenario: Complete Appliance Details Page
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 7"
    And Job List - I click on Customer Information "Job No: 1304687001" on the Job List
    And I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Appliances" button
    And Appliances - I click the first appliance on the list "ALDE INTERNATIONAL BOILER - NO INFN"
    And Appliance Details - I click Show Default button
    And Appliance Details - I select default GC Code the first option
    And Dialog Box - I see a warning message displaying "Is this a replacement Appliance?"
    And Dialog box - I click Yes button
    And Appliance Details - I type Location "Test Location" Location
    And Appliance Details - I type Installation year as "2008"
    And Appliance Details - Serial Number - I type "12345"
    And Appliance Details - I select Flue Type the first option
    And Appliance Details - I click BG Installation - NO
    And Appliance Details - I select Appliance Condition the first option
    And Appliance Details - I select System Type the first option
    And Appliance Details - I select System Design Condition the first option
    And Appliance Details - I type Radiators as "5"
    And Appliance Details - I type Radiators Special as "2"
    And Appliance Details - I type Boiler Size Units as "10"
    And Appliance Details - I select Cylinder Type the first option
    And Appliance Details - I select Energy Controls the first option
    And I verify that form has "state-valid" value