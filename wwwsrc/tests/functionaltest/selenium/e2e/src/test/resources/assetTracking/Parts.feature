@ignore
Feature: Search for Parts
  As an Engineer I am on a Job I need to find a part to complete my Job

  Scenario: As an Engineer I want to search for parts 555051 in my van stock
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1351525001" on the Job List
    And I click on the Go en-route button and click Arrive Label
    And I click Got It on risks page
    And Tabs - I click "Activities" button
    And Activities - I select task "FIRST VST"
    And I select the Activity Status to "COMPLETE"
    And Appliance Booking - Worked On - I click "Appliance"
    And Appliance Booking - Fault Action Code - I select "PASS"
    And Appliance Booking - CHIRP Outcome Code - I select "54CODE"
    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
    And Appliance Booking - Customer Advice - I click "Not required"
    And I click Parts button
    And Parts - I click Parts Basket Tab
    And Parts Basket - I click Clear Order List
    And Dialog Box - I see a warning message displaying "Are you sure you want to clear the form?"
    And Dialog box - I click Yes button
    And Parts Basket - I select "search for part manually"
    And Parts Basket - I enter "555051" stock reference ID
    And Parts Basket - I click Search for part
    And Parts Basket - Associated Activity - I select "HTG UP'GRD"
    When Parts Basket - I click Add to order list
    Then I see local van stock message "2 parts avaialable on my van." displayed
    Then I see remote van stock message "   1 part available nearby. Part is 1.1 miles away." displayed

  Scenario: As an Engineer I want to search for parts 555053 in my van stock
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1351525001" on the Job List
    And I click on the Go en-route button and click Arrive Label
    And I click Got It on risks page
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
    And Parts Basket - I enter "555053" stock reference ID
    And Parts Basket - I click Search for part
    When Parts Basket - I click Add to order list
    Then I see local van stock message "1 part avaialable on my van." displayed
    Then I see remote van stock message "   9 parts available nearby. Closest is 1.1 miles away." displayed

  Scenario: As an Engineer I want to search for parts 555054 in my van stock
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1351525001" on the Job List
    And I click on the Go en-route button and click Arrive Label
    And I click Got It on risks page
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
    And Parts Basket - I enter "555054" stock reference ID
    And Parts Basket - I click Search for part
    When Parts Basket - I click Add to order list
    Then I see local van stock message "1 part avaialable on my van." displayed
    Then I see remote van stock message "   4 parts available nearby. Closest is 1 miles away." displayed

  Scenario: As an Engineer I want to search for parts 555055 in my van stock
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1351525001" on the Job List
    And I click on the Go en-route button and click Arrive Label
    And I click Got It on risks page
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
    And Parts Basket - I enter "555055" stock reference ID
    And Parts Basket - I click Search for part
    When Parts Basket - I click Add to order list
    Then I see local van stock message "1 part avaialable on my van." displayed
    Then I see remote van stock message "   No parts available nearby." displayed

  Scenario: As an Engineer I want to search for parts 555056 in my van stock
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1351525001" on the Job List
    And I click on the Go en-route button and click Arrive Label
    And I click Got It on risks page
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
    And Parts Basket - I enter "555056" stock reference ID
    And Parts Basket - I click Search for part
    When Parts Basket - I click Add to order list
    Then I see local van stock message "1 part avaialable on my van." displayed
    Then I see remote van stock error message "Unable to complete the search." displayed

  Scenario: As an Engineer I want to search for parts 727185 in my van stock
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1351525001" on the Job List
    And I click on the Go en-route button and click Arrive Label
    And I click Got It on risks page
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
    And Parts Basket - I enter "727185" stock reference ID
    And Parts Basket - I click Search for part
    When Parts Basket - I click Add to order list
    Then I see local van stock message "No parts on my van. Order this part." displayed
    Then I see remote van stock message "   1 part available nearby. Part is 1.1 miles away." displayed
