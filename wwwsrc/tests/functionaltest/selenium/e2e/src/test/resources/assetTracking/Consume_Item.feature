Feature: Consume Item

  @consume_item
  Scenario: Collect an Item
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I click my van tab
    And Assets - Tabs I click "Locate Items"
    And I search for Items "555051"
    And I click the search button
    And I see "2 items available on my van." displayed in my van
    And I see "1 part available nearby. Item is 1.1 miles away." displayed near by
    And I click view
    And Dialog header - I select quantity
    And I click "Reserve" button
    And I see Items Coming Into My Van "555051" Description "3 Wire Electronic Thermostat" Qty "1" Engineer "Jenny Jones"
    And I click "Collect" status
    And Dialog Box - I see a confirmation message displaying "Are you sure that your wish to collect the item 386789?"
    And I click "Confirm" button
    And I see Items Coming Into My Van "386789" Description "Pressure Relief Valve 3 Bar TOTE" Qty "1" Engineer "Kelvin Cripps" Confirm Status "Collected"

  @consume_item
  Scenario: Cancel an Item
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I click my van tab
    And Assets - Tabs I click "Locate Items"
    And I click "Cancel" status
    And Dialog Box - I see a confirmation message displaying "Are you sure that your wish to cancel this reservation for item 386789?"
    And I click "Confirm" button
    And I see Items Coming Into My Van "386789" Description "Pressure Relief Valve 3 Bar TOTE" Qty "1" Engineer "Kelvin Cripps" Confirm Status "Cancelled"

  @consume_item
  Scenario: Consumed an item
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I click my van tab
    When I search product using "386789"
    Then I see Items with GC Code "386789" Description "Pressure Relief Valve 3 Bar TOTE" Qty "1" W/R No "" Area "A"
    And Assets - Tabs I click "Locate Items"
    And I click "Collect" status
    And Dialog Box - I see a confirmation message displaying "Are you sure that your wish to collect the item 386789?"
    And I click "Confirm" button
    And I see Items Coming Into My Van "386789" Description "Pressure Relief Valve 3 Bar TOTE" Qty "1" Engineer "Kelvin Cripps" Confirm Status "Collected"
    And I click the settings Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And I click on first customer info on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label
    And I click Got It on risks page
    And Tabs - I click "Activities" button
    And Activities - I select task "HTG UP'GRD"
    And I select the Activity Status to "COMPLETE"
    And Appliance Booking - Worked On - I click "Appliance"
    And Appliance Booking - Fault Action Code - I select "PASS"
    And Appliance Booking - CHIRP Outcome Code - I select "54CODE"
    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
    And Appliance Booking - Customer Advice - I click "Not required"
    And I click Parts button
    And Tabs - I click Activities tab
    And Activities - I select task "HTG UP'GRD"
    And I select the Activity Status to "COMPLETE"
    And Appliance Booking - Worked On - I click "Appliance"
    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
    And Appliance Booking - CHIRP Outcome Code - I select "54CODE"
    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
    And Appliance Booking - Customer Advice - I click "Not required"
    And Appliance Booking - Is the job part L/J reportable? - I select "Yes"
    And I click Gas Property Safety button
    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "No"
    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
    And Tabs - I click "Appliances" button
    And Appliance Details - I click the first appliance
    And I click Gas Safety button
    And Gas Safety - Did you work on the appliance - I click No
    And Gas Safety - Did you visually check - I click Yes
    And Gas Safety - Is appliance Safe - I click Yes
    And Gas Safety - To current standards - I click NA
    And Gas Safety - click next task
    And Appliances - I click Appliance Detail Tab
    And Appliance Details - I select Flue Type the first option
    And I click Gas Safety button
    And Gas Safety - Did you work on the appliance - I click No
    And Gas Safety - Did you visually check - I click Yes
    And Gas Safety - Is appliance Safe - I click Yes
    And Gas Safety - To current standards - I click NA
    And I click Parts button
    And I click the Warranty Return chevron
    And I select "No" for Is this part going to be returned as a Warranty claim
    And Parts - I click Parts Basket Tab
    And Parts Basket - I click Clear Order List
    And Dialog box - I click Yes button
    And Parts Basket - I select "search for part manually"
    And Parts Basket - I enter "386789" stock reference ID
    And Parts Basket - I click Search for part
    And Parts Basket - I click Add to order list
    And Parts Basket - Associated Activity - I select "HTG UP'GRD"
    And 386789 - Gasket - Cover Plate - I checked Van Stock
    And I select "No" for Is this part going to be returned as a Warranty claim
    And I click on the Charges tab
    And I click I Understand. Click to continue
    And I click charges ok
    And Tabs - I click "Parts" button
    And I click on the Complete button
    And I click my van tab
    And Assets - Tabs I click "My Van"
    When I search product using "386789"
    Then I see Items with GC Code "386789" Description "Pressure Relief Valve 3 Bar TOTE" Qty "1" W/R No "" Area "A"