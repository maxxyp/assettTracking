Feature: Search Item

    @search_item
    Scenario: Search for a specific item which is not found
        Given I navigate to the api URI
        When I search for item "350075"
        Then I get Http response code "404"

    @search_item
    Scenario: Search for a specific item for successful search.
        Given I navigate to the api URI
        When I search for item "301235"
#        Then I get Http response code "200"








