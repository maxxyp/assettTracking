Feature: Reserve and consume an Item

#  @reserveAndCollect
  Scenario: One engineer reserves an item on another engineer's van
    Given I navigate to the api URI
    When I am an engineer able to reserve for materialCode "350075",description "22mm Pump Valve Heavy Duty TOTE",engineer "0013846", owner "BGS", quantity "1", date "20190202", time "14090100", requestingEngineer "0013865"
    Then I get Http response code "500"


  @reserveAndCollect
  Scenario: One engineer reserves an item on another engineer's van and collects the same
    Given I navigate to the api URI
    When I am an engineer able to reserve for materialCode "350075",description "22mm Pump Valve Heavy Duty TOTE",engineer "0013846", owner "BGS", quantity "1", date "20190202", time "14090100", requestingEngineer "0013865"
    And I am able to collect the same item
    Then I get Http response code "200"

