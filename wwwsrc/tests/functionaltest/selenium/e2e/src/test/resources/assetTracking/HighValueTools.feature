@highValueTools
Feature: High Value Tools

  Background:
    Given I am on the home page
    And I enter training engineer ID "0000050"
    And I click the select button Tab

  Scenario: As an Engineer I want to reserve product on another van
    And I click my van tab
    And Assets - Tabs I click "Locate Items"
    And I click Tools Lookup
    When I search for "T00188" tools
    Then I see GC code "T00188" and Description "Swivel Head Rechargeable Lantern Kit"
    And I select tools where code "T00188" and Description "Swivel Head Rechargeable Lantern Kit"
    And I see "No van stock items available on my van." displayed in my van
    And I see "No parts available nearby." displayed near by