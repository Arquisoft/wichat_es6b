Feature: Game Application E2E Tests

  Scenario: User registration and login flow
    Given an unregistered user
    When I register with valid credentials
    Then I should see a successful registration message
    When I login with those credentials
    Then I should be redirected to the dashboard

  Scenario: Playing a game
    Given a logged in user
    When I navigate to the game page
    Then I should see a question
    When I answer the question
    Then I should see the next question or game results

  Scenario: Viewing ranking
    Given a logged in user
    When I click on the ranking button
    Then I should see the ranking list
    And I should see efficiency circles

  Scenario: Viewing user profile
    Given a logged in user
    When I click on my profile
    Then I should see my game statistics
    And I should see my game history