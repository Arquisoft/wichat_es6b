Feature: Registering a new user

Scenario: The user is not registered in the site
  Given An unregistered user
  When I fill the data in the form and press submit
  Then A confirmation message should be shown in the screen
  Then I should be able to login with the new account
  Then I should be able to see the ranking
  Then I should be able to see the history
Scenario: The user tries to register with an existing username
  Given An existing username
  When I fill the form with an existing username
  Then An error message should be shown
Scenario: Login fails with non-existent username
  Given A non-existent username
  When I try to login with invalid credentials
  Then A login error message should be shown