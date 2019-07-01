@searchItems
Feature: Search for Items on Local Van Stock

  Background:
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab

  Scenario: As an Engineer I want to see items displayed on my van
    And I click my van tab
    When Assets - Tabs I click "My Van"
    Then Assets List - I see: Quanty, GC Code, Description and Area

  Scenario: As an Engineer I want to search items(s) using GC Code
    And I click my van tab
    And Assets - Tabs I click "My Van"
    When I search product using "H40266"
    Then I see Items with GC Code "H40266" Description "O Ring Seal 31.2x25.5x2.9mm" Qty "1" W/R No "1351525001" Area "B"

  Scenario: As an Engineer I want to search item(s) using Description
    And I click my van tab
    And Assets - Tabs I click "My Van"
    When I search product using "Flow Regulator 12 Ltr/Min"
    Then I see Items with GC Code "727427" Description "Flow Regulator 12 Ltr/Min" Qty "5" W/R No "" Area "B"

  Scenario: As an Engineer I want to search item(s) using Job Number
    And I click my van tab
    And Assets - Tabs I click "My Van"
    When I search product using "#1351525001"
    Then I see Items with GC Code "F00006" Description "22mm Speedfit Tank Connector TOTE" Qty "2" W/R No "1351525001" Area ""

  Scenario: As an Engineer I want to search item(s) using Area
    And I click my van tab
    And Assets - Tabs I click "My Van"
    When I search product using "@A"
    Then I see Items with GC Code "301048" Description "Seal Foam 1010x5 mm (Each)" Qty "3" W/R No "" Area "A"