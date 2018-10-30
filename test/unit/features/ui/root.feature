Feature: Root component
  Root component render the page specific components
@rootComponent
  Scenario: Render root component
    Given Root component is available
    Then Welcome to boilerplate text shown
