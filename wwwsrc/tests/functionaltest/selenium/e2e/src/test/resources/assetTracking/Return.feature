@return_items
Feature: Return Items

  Background:
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab

  Scenario: Return an item as Material Damaged
    And I click my van tab
    And Assets - Tabs I click "My Stock"
    When I click on van stock menu container
    And I click the "Return" on the menu container
    And I see Dialog content Header "Return - Radiant Town NG T90" Label
    When I select return reasons "Material Damaged"
    And click "Return" button in the Dialog box
    And Dialog Box - I see a confirmation message displaying "Are you sure that your wish to return 120394?"
    And Dialog box - I click Confirm button
    And Assets - Tabs I click "Locate Items"
    Then I see Items Returns GC Code "120394" Description "Radiant Town NG T90" WR Number ""

  Scenario: Return an item as Material Under Waranty
    And I click my van tab
    And Assets - Tabs I click "My Stock"
    When I click on van stock menu container
    And I click the "Return" on the menu container
    And I see Dialog content Header "Return - Radiant Town NG T90" Label
    When I select return reasons - Material under warranty
    And click "Return" button in the Dialog box
    And Dialog Box - I see a confirmation message displaying "Are you sure that your wish to return 120394?"
    And Dialog box - I click Confirm button
    And Assets - Tabs I click "Locate Items"
    Then I see Items Returns GC Code "120394" Description "Radiant Town NG T90" WR Number ""

  Scenario: Return an item as Material Recalled
    And I click my van tab
    And Assets - Tabs I click "My Stock"
    When I click on van stock menu container
    And I click the "Return" on the menu container
    And I see Dialog content Header "Return - Radiant Town NG T90" Label
    When I select return reasons - Material recalled
    And click "Return" button in the Dialog box
    And Dialog Box - I see a confirmation message displaying "Are you sure that your wish to return 120394?"
    And Dialog box - I click Confirm button
    And Assets - Tabs I click "Locate Items"
    Then I see Items Returns GC Code "120394" Description "Radiant Town NG T90" WR Number ""

  Scenario: Return an item as Material expired
    And I click my van tab
    And Assets - Tabs I click "My Stock"
    When I click on van stock menu container
    And I click the "Return" on the menu container
    And I see Dialog content Header "Return - Radiant Town NG T90" Label
    When I select return reasons - Material expired
    And click "Return" button in the Dialog box
    And Dialog Box - I see a confirmation message displaying "Are you sure that your wish to return 120394?"
    And Dialog box - I click Confirm button
    And Assets - Tabs I click "Locate Items"
    Then I see Items Returns GC Code "120394" Description "Radiant Town NG T90" WR Number ""