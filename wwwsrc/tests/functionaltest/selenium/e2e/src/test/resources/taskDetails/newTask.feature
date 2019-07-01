@ignore
Feature: New Activity

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000141"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And Gas Job - I click on the Go en-route button and click Arrive Label

  Scenario: Verify engineer can add a New Activity to the Customers Job
    And Tabs - I click "Activities" button
    And I click New Task Button
    And New Activity - Appliance Type Location - I select "COD"
    And New Activity - Action Type - I select "IA - INST APP"
    And New Activity - Charge Type - I select "NCH3COD - NO CHARGE-3COD"
    And New Activity - Save - I click Save Button
    And New Activity - I verify that the New Activity is displayed

  Scenario: Verify engineer can deleted a newly created activity in customers job
    And Tabs - I click "Activities" button
    And I click New Task Button
    And New Activity - Appliance Type Location - I select "COD"
    And New Activity - Action Type - I select "IA - INST APP"
    And New Activity - Charge Type - I select "NCH3COD - NO CHARGE-3COD"
    And New Activity - Save - I click Save Button
    When New Activity - I click Delete button
    And Dialog Box - I see a warning message displaying "Are you sure you want to delete the 'activity' ?"
    And Dialog box - I click Yes button
    Then New Activity - I verify that newly created Activity is Deleted
    And I close the browser

