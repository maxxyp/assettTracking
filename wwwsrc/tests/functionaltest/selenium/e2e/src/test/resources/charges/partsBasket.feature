@ignore
Feature: Parts Baskets

  Background:
    Given I am on the home page
    And I enter training engineer ID "0000141"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1343527001" on the Job List
    And I click on the Go en-route button and click Arrive Label
    And I click Got It on risks page

  Scenario: Make Parts moustache green after adding parts manually using van stock with no warranty
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And Appliance Booking - Worked On - I click "Appliance"
    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
    And Appliance Booking - CHIRP Outcome Code - I select "54CODE"
    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
    And Appliance Booking - Customer Advice - I click "Not required"
    And I click Parts button
    And I click Clear Button
    And Dialog Box - I see a warning message displaying "Are you sure you want to clear the form?"
    And Dialog box - I click Yes button
    And Tabs - I click "Activities" button
    And Tabs - I click "Parts" button
    And Parts - I click Parts Basket Tab
    And Parts Basket - I click Clear Order List
    And Dialog Box - I see a warning message displaying "Are you sure you want to clear the form?"
    And Dialog box - I click Yes button
    And Parts Basket - I select "search for part manually"
    And Parts Basket - I enter "555123" stock reference ID
    And Parts Basket - I click Search for part
    And Parts Basket - I click Add to order list
    And 555123 - Gasket - Cover Plate - I checked Van Stock
    And I select "No" for Is this part going to be returned as a Warranty claim
    And Parts Basket - I click Quick Add
    And 555123 - Gasket - Cover Plate - I checked Van Stock
    And Tabs - I click "Previous Activities" button
    When Tabs - I click "Parts" button
    Then I verify that the charges mustashe tab is green

  Scenario: Set activity to Parts required add parts and confirm parts moustache is green
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "PARTS REQUIRED"
    And Appliance Booking - Worked On - I click "Appliance"
    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
    And Appliance Booking - CHIRP Outcome Code - I select "54CODE"
    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
    And Appliance Booking - Customer Advice - I click "Not required"
    And I click Parts button
    And Parts - I click Parts Basket Tab
    And Parts Basket - I click Clear Order List
    And Dialog Box - I see a warning message displaying "Are you sure you want to clear the form?"
    And Dialog box - I click Yes button
    And Parts Basket - I select "search for part manually"
    And Parts Basket - I enter "555123" stock reference ID
    And Parts Basket - I click Search for part
    And Parts Basket - I click Add to order list
    And Parts Basket - I click Quick Add
    When Tabs - I click Activities tab
    And Tabs - I click "Parts" button
    And 555123 - Gasket - Cover Plate - I checked Van Stock
    And I select "No" for Is this part going to be returned as a Warranty claim
    And Tabs - I click "Previous Activities" button
    And Tabs - I click "Parts" button
    Then I verify that the charges mustashe tab is green

  Scenario: Make Parts moustache red by settings job to complete and ordering parts after adding parts
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And Appliance Booking - Worked On - I click "Appliance"
    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
    And Appliance Booking - CHIRP Outcome Code - I select "54CODE"
    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
    And Appliance Booking - Customer Advice - I click "Not required"
    And I click Parts button
    And Parts - I click Parts Basket Tab
    And Parts Basket - I click Clear Order List
    And Dialog Box - I see a warning message displaying "Are you sure you want to clear the form?"
    And Dialog box - I click Yes button
    And Parts Basket - I select "search for part manually"
    And Parts Basket - I enter "555123" stock reference ID
    And Parts Basket - I click Search for part
    And Parts Basket - I click Add to order list
    And Parts Basket - I click Quick Add
    And Tabs - I click "Previous Activities" button
    And Tabs - I click "Parts" button
    Then I verify that the charges mustashe tab is red