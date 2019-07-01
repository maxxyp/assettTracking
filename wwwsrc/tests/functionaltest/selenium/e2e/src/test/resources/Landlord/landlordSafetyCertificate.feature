@ignore
Feature: Landlord Safety Certificate

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000141"
    And I click the select button Tab

  Scenario: When gas installation tightness done selected Yes, Gas Certificate shows PASS
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P1" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1333527001" on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Property Safety" button
    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "Yes"
    And Landlord Safety Certificate - Pressure Drop - I type "1"
    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
    And Landlord Safety Certificate - Report - I type "Property is very very safe"
    And Landlord Safety Certificate - Condition As Left - I click "IMMEDIATELY DANGEROUS"
    And Landlord Safety Certificate - Capped Turn Off - I click "CAPPED"
    And Landlord Safety Certificate - Label Attached - I click "ATTACHED"
    And Landlord Safety Certificate - Owned By Customer - I select "No"
    And Landlord Safety Certificate - Letter Left - I select "No"
    And Landlord Safety Certificate - Signature Obtained - I select "No"
    And I click Certificate button
    And Certificate - I see Gas Installation Tightness Test with Text "PASS"