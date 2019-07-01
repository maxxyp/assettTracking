@ignore
Feature: Labour and Parts Charge SLO Prime

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000142"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I click Customer Details Tab
    And I select Ready for work
    And I wait for Job Details to load and displayed "Your work for today: Customers 5  Activities 6"
    And Job List - I click on Customer Information "Job No: 1315747002" on the Job List
    And Job List - I click on the Go en-route button and click Arrive Label

  Scenario: Complete Task and default parts charged
    And I click on the Charges tab
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    When I click on the Charges tab
    And Activity Description - I click the chevron
    Then I verify the followings activity "Testing Bypass data x1" Charge "Parts" and Amount "£113.21" is displayed
    And I see activity charge price equals £190.96 for Labour

  Scenario: Add part
    And I click on the Charges tab
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    And Tabs - I click "Parts" button
    When Parts - I click Parts Basket Tab
    And 357552 - Gasket - Cover Plate - I checked Van Stock
    And I select "No" for Is this part going to be returned as a Warranty claim
    And I click on the Charges tab
    And Activity Description - I click the chevron
    Then I verify additional activity "Gasket - Cover Plate x1" Charge "Parts" and Amount "£11.09" is displayed
    And I verify total charge including VAT is "£202.05"

  Scenario: Increase Part Quantity
    And I click on the Charges tab
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    And Tabs - I click "Parts" button
    And Parts - I click Parts Basket Tab
    When Van Stock - I Increase quantity for part 357552 - Gasket - Cover Plate to 2
    And 357552 - Gasket - Cover Plate - I checked Van Stock
    And I select "No" for Is this part going to be returned as a Warranty claim
    And I click on the Charges tab
    And Activity Description - I click the chevron
    Then I verify additional activity "Gasket - Cover Plate x2" Charge "Parts" and Amount "£22.18" is displayed
    And I verify total charge including VAT is "£213.14"

#  Scenario: Return as warranty from Parts Basket
#    And I click on the Charges tab
#    And I click Activities Button
#    And Activities - I click the first appliance on the list
#    And I select the Activity Status to "COMPLETE"
#    And I click on the Charges tab
#    And I click Parts button
#    And Parts - I click Parts Basket Tab
#    And Parts Basket - I click Clear Order List
#    And Dialog Box - I see a warning message displaying "Are you sure you want to clear the form?"
#    And Dialog box - I click Yes button
#    And 357552 - Gasket - Cover Plate - I checked Van Stock
#    And I select "Yes" for Is this part going to be returned as a Warranty claim
#    And I click Same ID as Original
#    And I click on the Charges tab
#    And Activity Description - I click the chevron
#    Then I verify additional activity "Gasket - Cover Plate x1" Charge "Parts" and Amount "£11.09" is displayed
#    And I verify total charge including VAT is "£202.05"

  Scenario: Return as warranty from Today's Part
    And I click on the Charges tab
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    And Tabs - I click "Parts" button
    And I click the Warranty Return chevron
    And I select "Yes" for Is this part going to be returned as a Warranty claim
    And I click Same ID as Original
    And I click on the Charges tab
    And Activity Description - I click the chevron
    Then I verify the followings activity "Testing Bypass data x1" Charge "Parts - x1 warranty" and Amount "£0.00" is displayed
    And I verify total charge including VAT is "£77.75"

  Scenario: Return as not used from Today's Part
    And I click on the Charges tab
    And Tabs - I click "Activities" button
    And Activities - I click the first appliance on the list
    And I select the Activity Status to "COMPLETE"
    And I click on the Charges tab
    And Tabs - I click "Parts" button
    And I click the Warranty Return chevron
    And I select "No" for Is this part going to be returned as a Warranty claim
    And I click the Not used return chevron
    And I set Quantity to claim or return to 1
    And I click on the Charges tab
    And Activity Description - I click the chevron
    Then I verify the followings activity "Testing Bypass data x1" Charge "Parts - x1 return" and Amount "£0.00" is displayed
    And I verify total charge including VAT is "£77.75"