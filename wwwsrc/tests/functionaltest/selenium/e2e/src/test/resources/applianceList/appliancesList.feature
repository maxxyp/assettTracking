@ignore
Feature: Appliance List

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000141"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work

  Scenario: Check that Appliances List are shown
    And I click on first customer info on the Job List
    And I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Appliances" button
    And I see appliance List Container

  Scenario: Verify that link dont care appliance with task and check the datastate of the appliance if it goes amber
    And I click on first customer info on the Job List
    And I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Appliances" button
    And Tabs - I click "Activities" button
    And I click New Task Button
    And New Activity - Appliance Type Location - I select "COD"
    And New Activity - Action Type - I select "IA - INST APP"
    And New Activity - Charge Type - I select "NCH3COD - NO CHARGE-3COD"
    And New Activity - Save - I click Save Button
    And New Activity - I click Appliances Label
#    And Appliance List - I verify the second appliance form has "state-not-visited" value

  Scenario: Create New Appliance
    And I click on first customer info on the Job List
    And I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Appliances" button
    And I click New Task Button
    And New Appliance - Appliance Type - I select "ELEC HOB - EHO"
    And New Appliance - GC CODE - I type "1231354"
    And New Appliance - Description - I type "test description"
    And New Appliance - Location - I type "test location"
    And New Appliance - Appliance Year - I type "2010"
    And New Appliance - Serial Number - I type "testt serialid"
    And New Appliance - BG Installation - I click "Yes"
    And New Appliance - I OK Button
    And Appliance List - I verify the container count equals "5"

  Scenario: Delete Appliance
    And I click on first customer info on the Job List
    And I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Appliances" button
    And I click New Task Button
    And New Appliance - Appliance Type - I select "ELEC HOB - EHO"
    And New Appliance - GC CODE - I type "1231354"
    And New Appliance - Description - I type "test description"
    And New Appliance - Location - I type "test location"
    And New Appliance - Appliance Year - I type "2010"
    And New Appliance - Serial Number - I type "testt serialid"
    And New Appliance - BG Installation - I click "No"
    And New Appliance - I OK Button
    And Appliance List - I click the DELETE Button
    And Dialog Box - I see a warning message displaying "Existing activity will be automatically unlinked with the appliance, Are you sure?"
    And Dialog box - I click Yes button
    And Appliance List - I verify the container count equals "4"