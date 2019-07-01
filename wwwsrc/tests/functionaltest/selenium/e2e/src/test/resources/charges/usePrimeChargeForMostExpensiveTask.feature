@ignore
Feature: Prime and Sub Charge for Most Expensive
  # there are two non-prime tasks and the most expensive one should be flagged as prime
  # the below are both non-prime charges
  # task1: GU, BBC, ZAW5 => labour code H3 prime: £82.56, sub: £14.47
  # task2: HU, AGA, BNI2 => labour code H2, prime: £74.05, sub: £14.47

  # if task1 is more time and therefore more expensive, second task should use sub charge
  # secondly if task2 is more time and therfore most expensice, first task should use sub charge

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1300000004" on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label

  Scenario: Complete Task and check prime and sub charge applied to correct tasks, the first task being most expensive
    And Tabs - I click "Activities" button
    And Activities - I select task "ENSAV UPGD - Back Boiler Circulator"
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    And Tabs - I click "Activities" button
    And Activities - I select task "HTG UP'GRD - AGA"
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    Then I verify first task description "ENSAV UPGD - Back Boiler Circulator" Charge "ALL LAB PRTS 5%-ZAW5" VAT "5%" and Amount "£77.75"
    And I verify second task description "HTG UP'GRD - AGA" Charge "ALL LAB & PARTS-BNI2" VAT "20%" and Amount "£17.36"
    And I see charge total including VAT equals £95.11

  Scenario: make the second task most expensive, such that the first task utilises sub charge
    And Tabs - I click "Activities" button
    And Activities - I select task "HTG UP'GRD - AGA"
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    And Tabs - I click "Activities" button
    And I Increase the Activity Duration for End Times to 41 minutes
    And I click on the Charges tab
    Then I verify first task description "ENSAV UPGD - Back Boiler Circulator" Charge "ALL LAB PRTS 5%-ZAW5" VAT "5%" and Amount "£77.75"
    And I verify second task description "HTG UP'GRD - AGA" Charge "ALL LAB & PARTS-BNI2" VAT "20%" and Amount "£106.22"
    And I see charge total including VAT equals £121.41

  Scenario: set the status of task 2 to cancelled, task 1 being the only non-prime task, should use a prime charge
    And Tabs - I click "Activities" button
    And Activities - I select task "HTG UP'GRD - AGA"
    And I select the Activity Status to "CANCELLED"
    And I click on the Charges tab
    Then I verify first task description "ENSAV UPGD - Back Boiler Circulator" Charge "ALL LAB PRTS 5%-ZAW5" VAT "5%" and Amount "£77.75"


