@updateItems
Feature: Update Items

  Background:
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab

  Scenario: As an Engineer I want to update my van location
    And I click my van tab
    And Assets - Tabs I click "My Stock"
    When I click on van stock menu container
    And I click the "Edit" on the menu container
    And I see Dialog content Header "Radiant Town NG T90" Label
    And I change area to "A"
    And I click "Save" button
    Then I see Items with GC Code "120394" Description "Radiant Town NG T90" Qty "12" W/R No "" Area "A"