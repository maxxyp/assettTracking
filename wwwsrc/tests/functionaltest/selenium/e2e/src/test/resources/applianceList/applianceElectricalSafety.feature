@ignore
Feature: Appliance Electrical Safety

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I click the settings Tab
    And I enter training engineer ID "0000141"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Electrical Services" Patch Area "11P1" and Region "3 - Northwest"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1307517001" on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label

  Scenario: Check Appliance Electrical Safety
    And I click Got It on risks page
    And Tabs - I click "Property Safety" button
    And Property Safety Details - I enter "1" ELI Readings Ohms
    And Property Safety Details - I click Yes consumer unit fuse box satisfactory
    And Property Safety Details - I click TNS System type
    And I verify that form has "state-valid" value
    And Tabs - I click "Appliances" button
    And I click the first appliance on the list
    And I click Electrical Safety button
    And Electrical Safety - Main Earth Okay - I click "Yes"
    And Electrical Safety - Gas Bonding Okay - I click "Yes"
    And Electrical Safety - Water Bonding Okay - I click "Yes"
    And Electrical Safety - Other Bonding Checked Okay - I click "Yes"
    And Electrical Safety - Supplementary Bonding or Full RCD Protection Okay - I click "Yes"
    And Electrical Safety - Ring Continuity Reading Done - I click "Pass"
    And Electrical Safety - LEIR - I type "1" Reading
    And Electrical Safety - NEIR - I type "1" Reading
    And Electrical Safety - LNIR - I type "1" Reading
    And Electrical Safety - Final ELI Reading done - I click "Yes"
    And Electrical Safety - I type "1" Final ELI Reading
    And Electrical Safety - Customer RCD RCBO Protected - Bonding Okay - I click "RCD"
    And Electrical Safety - RCD Trip Time - I type "1" Reading
    And Electrical Safety - Fuse MCB Rating - I select "5"
    And Electrical Safety - Is Part P - I click "No"
    And Electrical Safety - Worked on lighting circuit - I click "No"
    And Electrical Safety - Installation Satisfactory - I click "Yes"
    And I verify that form has "state-valid" value