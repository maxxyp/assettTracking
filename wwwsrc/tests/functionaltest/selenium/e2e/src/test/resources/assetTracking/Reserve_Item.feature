@reserveItem
Feature: Reserve Items

  Background:
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab

  Scenario: As an Engineer I want to reserve product on another van
    And I click my van tab
    And Assets - Tabs I click "Locate Items"
    And I see "My Van (169)" items displayed in my van
    When I search for Items "555051"
    And I click the search button
    And I see "1 part available nearby. Item is 1.1 miles away."
    And I click view
    And I use the toggle button to select quantity
    And I click "Reserve" button
    And I see Items Coming Into My Van "555051" Description "3 Wire Electronic Thermostat" Qty "1" Engineer "Jenny Jones"
    And I click "Collect" status
    And I click "Confirm" button
    And I refresh the page
    And I see increase items "My Van (170)" displayed in my van
