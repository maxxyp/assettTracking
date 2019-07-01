@ignore
Feature: Consumables Archives

  Background:
    Given I am on the SettingsPage
    And I wait for the app data to load
    And I enter training engineer ID "0000141"
    And I click the select button Tab

  Scenario: Check consumables basket tabs are visible
    And I click Consumables Tab
    And I see Order History Tab
    And I see Favourites Tab

  Scenario: Search Parts and Add to Baskets
    And I click Consumables Tab
    When Consumables Basket - I select "Tool Box 2 Tray Liftout : T00010" as Part Search
    And Consumables Basket - I Increase Quantity
    And Consumables Basket - I click Add To Basket
    Then Consumables Basket - I see Container with Description "Tool Box 2 Tray Liftout : T00010"

  Scenario: Search Parts and Delete from Basket
    And I click Consumables Tab
    And Consumables Basket - I select "Tool Box 2 Tray Liftout : T00010" as Part Search
    And Consumables Basket - I Increase Quantity
    And Consumables Basket - I click Add To Basket
    And Consumables Basket - I see Container with Description "Tool Box 2 Tray Liftout : T00010"
    When Consumables Basket - I click Delete button
    Then Dialog Box - I see a warning message displaying "Are you sure you want to delete the 'part' ?"
    And Dialog box - I click Yes button

  Scenario: Place Order
    And I click Consumables Tab
    And Consumables Basket - I select "Tool Box 2 Tray Liftout : T00010" as Part Search
    And Consumables Basket - I Increase Quantity
    And Consumables Basket - I click Add To Basket
    When Consumables Basket - I click Place Order button