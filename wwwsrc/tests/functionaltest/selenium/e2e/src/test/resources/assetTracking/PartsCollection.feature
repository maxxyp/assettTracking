@parts_to_collect
Feature: Parts to collect

  Scenario: Receipt and View Engineer Dispatch Items
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
    And I select Ready for work
    And I see parts notification "You have 6 parts ready for collection"
    When I click collect parts button
    Then I see parts to collect for job: 1384517001
    And I verify item where gc code F01293 and Description 4 1/2in Ball Valve Float Side Feed
    And I verify item where gc code 378368 and Description ACL Synchron Motor K30A
    And I verify item where gc code H10295 and Description Adaptor - Flow Sensor
    And I also see parts to collect for job: 1384517002
    And I verify item where gc code 386789 and Description Pressure Relief Valve 3 Bar TOTE
    And I see van stock parts
    And I verify item where gc code 757137 and Description Actuator for Diverter Valve
    And I verify item where gc code F01127 and Description Altecnic Filling Loop-WRAS TOTE
    When I click submit button
    Then I see dialog header - Please confirm parts collection "All 11 parts collected"
    And I dialog header - I click Save button
    And I click my van tab
    And I see local van stock message "My Stock (180)" displayed

  Scenario: Submit button inactive when items for collection are not verified
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I select Ready for work
    And I see parts notification "You have 6 parts ready for collection"
    When I click collect parts button
    Then I see parts to collect for job: 1384517001
    And I verify item where gc code F01293 and Description 4 1/2in Ball Valve Float Side Feed
    And I verify item where gc code H10295 and Description Adaptor - Flow Sensor
    And I also see parts to collect for job: 1384517002
    And I see van stock parts
    When I verify item where gc code 757137 and Description Actuator for Diverter Valve
    Then I see submit button is inactive

  Scenario: Using toggle button to identify missing items
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab
    And I select Ready for work
    And I see parts notification "You have 6 parts ready for collection"
    When I click collect parts button
    And I see parts to collect for job: 1384517001
    And I click edit icon where gc code is "F01293"
    And I click the toggle button none received
    And I dialog header - I click Save button
    And I verify item where gc code F01293 and Description 4 1/2in Ball Valve Float Side Feed
    And I verify item where gc code 378368 and Description ACL Synchron Motor K30A
    And I verify item where gc code H10295 and Description Adaptor - Flow Sensor
    And I verify item where gc code 386789 and Description Pressure Relief Valve 3 Bar TOTE
    And I verify item where gc code 757137 and Description Actuator for Diverter Valve
    And I click last edit icon where gc code is "F01127"
    And I click the minus sign to signify 1 missing item
    And I dialog header - I click Save button
    And I verify item where gc code F01127 and Description Altecnic Filling Loop-WRAS TOTE
    When I click submit button
    And I see parts expected "11" "expected"
    And I see parts collection message "9 parts collected / 2 parts missing"
    And I dialog header - I click Save button
    And I click my van tab
    And I see local van stock message "My Stock (178)" displayed

