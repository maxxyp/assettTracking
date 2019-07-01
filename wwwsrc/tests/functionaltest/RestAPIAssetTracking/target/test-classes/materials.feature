Feature: Check all materials

  @materials
  Scenario: Check for all the Items for Engineer - 0013846
    Given I navigate to the api URI
    Then I am able to search the materials for Engineer "0013846" with HTTP response "200"
#    And I am able to validate materials for Engineer 0013846
    And I can validate the schema

#  @materials
#  Scenario: Check for all the Items for Engineer - 0013865
#    Given I navigate to the api URI
#    Then I am able to search the materials for Engineer "0013865" with HTTP response "200"
#
