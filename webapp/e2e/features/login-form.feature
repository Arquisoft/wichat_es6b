Feature: Login with a existing user

Scenario: The user is already registered in the site
  Given A registered user
  When I fill the data in the form and press login
  Then Dashboard page should be shown in the screen


Scenario: The user is not registered in the site
  Given A unregistered user
  When I fill the data in the form and press login
  Then An error message is shown


