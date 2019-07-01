@ignore
Feature: Tiered Labour Charge SLO Prime, and No parts charge

  Scenario: Complete Minimum Charge with a part
    Given I am on the SettingsPage
    When I wait for the app data to load
    And I click the settings Tab
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Activities" button
    When Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    Then I verify first task description "OCA TIERED - Bulk Circulator" Charge "STD LAB ONLY-NONE" VAT "20%" and Amount "£79.00"
    And Activity Description - I click the chevron
    And I verify the followings activity "Timer Mechanical EMT 2 TOTE x1" Charge "Parts" and Amount "£0.00" is displayed

  Scenario: Increase just below min charge period
    Given I am on the SettingsPage
    When I wait for the app data to load
    And I click the settings Tab
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    When I Increase the End Time by approximately 24 minutes
    And I click on the Charges tab
    Then I verify first task description "OCA TIERED - Bulk Circulator" Charge "STD LAB ONLY-NONE" VAT "20%" and Amount "£79.00"
    And I ensure the Chargeable Time is within 25 minutes
    And I also ensure the Job Duration is within 25 minutes

  Scenario: Increase just above min charge period
    Given I am on the SettingsPage
    When I wait for the app data to load
    And I click the settings Tab
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    When I Increase the End Time by approximately 26 minutes
    And I click on the Charges tab
    Then I verify first task description "OCA TIERED - Bulk Circulator" Charge "STD LAB ONLY-NONE" VAT "20%" and Amount "£199.00"

  Scenario: Increase just below interval of 90 minutes
    Given I am on the SettingsPage
    When I wait for the app data to load
    And I click the settings Tab
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Activities" button
    When Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I Increase the End Time to "31" minutes
    And I click on the Charges tab
    Then I verify first task description "OCA TIERED - Bulk Circulator" Charge "STD LAB ONLY-NONE" VAT "20%" and Amount "£199.00"

  Scenario: Increase just above interval of 90 minutes, should also round to whole number
    Given I am on the SettingsPage
    When I wait for the app data to load
    And I click the settings Tab
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Activities" button
    When Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I Increase the End Time to "121" minutes
    And I click on the Charges tab
    Then I verify first task description "OCA TIERED - Bulk Circulator" Charge "STD LAB ONLY-NONE" VAT "20%" and Amount "£409.00"

  Scenario: Change Region to London
    Given I am on the SettingsPage
    When I wait for the app data to load
    And I click the settings Tab
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "7 - London & South East"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label
    And Tabs - I click "Activities" button
    When Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    Then I verify first task description "OCA TIERED - Bulk Circulator" Charge "STD LAB ONLY-NONE" VAT "20%" and Amount "£79.00"