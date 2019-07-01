@ignore
Feature: Appliance Other Safety

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000141"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P1" and Region "2 - Central & Northwest"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1358774001" on the Job List
    And I click on the Go en-route button and click Arrive Label

  Scenario: Clear Gas Safety Page
    And Tabs - I click "Appliances" button
    And Appliance Details - I click the first appliance
    And I click Other Safety button
    And Gas Safety - Did you work on the appliance - I click No
    And Gas Safety - Did you visually check - I click Yes
    And Gas Safety - Is appliance Safe - I click Yes
    And Gas Safety - To current standards - I click NA
    And I click Clear Button
    And Dialog Box - I see a warning message displaying "Are you sure you want to clear the form?"
    And Dialog box - I click Yes button
#    Then I verify that Appliance Gas Safety form has "active" value

  Scenario: Complete Gas Safety Page with Worked on Appliance No Option with No Validation Errors
    And Tabs - I click "Appliances" button
    And Appliance Details - I click the first appliance
    And I click Other Safety button
    And Gas Safety - Did you work on the appliance - I click No
    And Gas Safety - Did you visually check - I click Yes
    And Gas Safety - Is appliance Safe - I click Yes
    And Gas Safety - To current standards - I click NA
    Then I verify that form has "state-valid" value

  Scenario: Complete Gas Safety Page with Worked on Appliance yes Option with no Validation Errors
    And Tabs - I click "Appliances" button
    And Appliance Details - I click the first appliance
    And I click Other Safety button
    And Gas Safety - Did you work on the appliance - I click yes
    And Gas Safety - Did you visually check - I click Yes
    And Gas Safety - Whats the appliance stripped and cleaned in accordance with TOPs - I click "Yes"
    And Gas Safety - To current standards - I click NA
    Then I verify that form has "state-valid" value

  Scenario: Complete Gas Safety Page with unsafe Details with No Validation Errors
    And Tabs - I click "Appliances" button
    And Appliance Details - I click the first appliance
    And I click Other Safety button
    And Gas Safety - Did you work on the appliance - I click yes
    And Gas Safety - Did you visually check - I click Yes
    And Gas Safety - Safety - Is appliance Safe - I click "Yes"
    And Gas Safety - To current standards - I click "No"
    And Gas Safety - Unsafety situation - I enter report "test report" details
    And Gas Safety - Unsafety situation - I click "IMMEDIATELY DANGEROUS" Condition as Left
    And Gas Safety - Unsafety situation - I click "CAPPED" Capped Turn Off
    And Gas Safety - Unsafety situation - I click "ATTACHED" Label Attached or Removed
    And Gas Safety - Unsafety situation - I click "Yes" Owned by Customer
    And Gas Safety - Unsafety situation - I click "Yes" Letter Left
    And Gas Safety - Unsafety situation - I click "Yes" Signature Obtained
    Then I verify that form has "state-valid" value
