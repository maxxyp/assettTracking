@ignore
Feature: Appointment Booking

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000141"
    And I click the select button Tab

  Scenario: Check the appointment booking process
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P1" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1333527001" on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Activities" button
    And I click Book An Appointment Button
    And I see a message "You can't currently book an appointment, please set a suitable activity status first" displayed
    And I click the Back Button
    And Appliance Booking - I click the first appliance on the List
    And Appliance Booking - Activities Status - I select "COMPLETE - C"
    And Appliance Booking - Worked On - I click "Appliance"
    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
    And Appliance Booking - Activity Report - I select "The flange needs to be twisted"
    And Appliance Booking - Customer Advice - I click "Not required"