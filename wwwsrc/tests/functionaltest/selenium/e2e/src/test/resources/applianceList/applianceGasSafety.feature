@ignore
Feature: Appliance Gas Safety

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I click the settings Tab
    And I enter training engineer ID "0000141"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P1" and Region "2 - Central & Northwest"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1343527001" on the Job List
    And I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Appliances" button
    And Appliance Details - I click the first appliance
    And I click Gas Safety button

  Scenario: Clear Gas Safety Page
    And Gas Safety - Did you work on the appliance - I click No
    And Gas Safety - Did you visually check - I click Yes
    And Gas Safety - Is appliance Safe - I click Yes
    And Gas Safety - To current standards - I click NA
    And I click Clear Button
    And Dialog Box - I see a warning message displaying "This will clear all readings and gas safety details. Are you sure you want to continue?"
    And Dialog box - I click Yes button
    Then I verify that form has invalid indicator "state-invalid" value

  Scenario: Complete Gas Safety Page with Worked on Appliance No Option with No Validation Errors
    And Gas Safety - Did you work on the appliance - I click No
    And Gas Safety - Did you visually check - I click Yes
    And Gas Safety - Is appliance Safe - I click Yes
    And Gas Safety - To current standards - I click NA
    Then I verify that form has "state-valid" value

  Scenario: Complete Gas Safety Page with Worked on Appliance yes Option with no Validation Errors
    And Gas Safety - Did you work on the appliance - I click yes
    And Gas Safety - Performance test not carried out why - Installation not available
    And Gas Safety - Whats the appliance stripped and cleaned in accordance with TOPs - I click "Yes"
    And Gas Safety - Whats the appliance tightness OK - I click "Yes"
    And Gas Safety - Chimney installation and applicable test okay - I click "Yes"
    And Gas Safety - Vent size and configuration okay - I click "Yes"
    And Gas Safety - Safety device correction operation - I select yes
    And Gas Safety - Safety - Is appliance Safe - I click Yes
    Then I verify that form has "state-valid" value

  Scenario: Complete Gas Safety Page with unsafe Details with No Validation Errors
    And Gas Safety - Did you work on the appliance - I click yes
    And Gas Safety - Performance test not carried out why - Installation not available
    And Gas Safety - Whats the appliance stripped and cleaned in accordance with TOPs - I click "No"
    And Gas Safety - Whats the appliance tightness OK - I click "Yes"
    And Gas Safety - Chimney installation and applicable test okay - I click "Yes"
    And Gas Safety - Vent size and configuration okay - I click "Yes"
    And Gas Safety - Safety device correction operation - I click "Yes"
    And Gas Safety - Unsafety situation - I enter report "test report" details
    And Gas Safety - Unsafety situation - I click "IMMEDIATELY DANGEROUS" Condition as Left
    And Gas Safety - Unsafety situation - I click "CAPPED" Capped Turn Off
    And Gas Safety - Unsafety situation - I click "ATTACHED" Label Attached or Removed
    And Gas Safety - Unsafety situation - I click "Yes" Owned by Customer
    And Gas Safety - Unsafety situation - I click "Yes" Letter Left
    And Gas Safety - Unsafety situation - I click "Yes" Signature Obtained
    Then I verify that form has "state-valid" value

  Scenario: As an Engineer I want to complete the appliance reading and gas safety
    And Gas Safety - Did you work on the appliance - I click yes
    And Gas Safety - Whats the appliance tightness OK - I click "Yes"
    And Gas Safety - Chimney installation and applicable test okay - I click "Yes"
    And Gas Safety - Vent size and configuration okay - I click "Yes"
    And Gas Safety - Safety device correction operation - I click "Yes"

#  @ignore
#  Scenario: As an Engineer I want to add supplementary burner and complete appliance reading and gas safety
#    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P1" and Region "3 - Northwest"
#    And I click Customer Details Tab
#    And I select Ready for work
#    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
#    And I click on first customer info on the Job List
#    And I click on the Go en-route button and click Arrive Label
#    And I click Appliances Label
#    And Appliance Details - I click the first appliance
#    And I click Gas Safety button
#
#  @ignore
#  Scenario: As an Engineer I want to clear out the landlord gas safety page
#    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P1" and Region "3 - Northwest"
#    And I click Customer Details Tab
#    And I select Ready for work
#    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
#    And I click on first customer info on the Job List
#    And I click on the Go en-route button and click Arrive Label
#    And I click Appliances Label
#    And Appliance Details - I click the first appliance
#    And I click Gas Safety button
#
#  @ignore
#  Scenario: As an Engineer I want to complete the landlord gas safety page
#    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P1" and Region "3 - Northwest"
#    And I click Customer Details Tab
#    And I select Ready for work
#    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
#    And I click on first customer info on the Job List
#    And I click on the Go en-route button and click Arrive Label
#    And I click Appliances Label
#    And Appliance Details - I click the first appliance
#    And I click Gas Safety button