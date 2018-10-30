Feature: Test case for React UI Boilerplate page
@home
    Scenario Outline: Customer sees the Page content
        Given Customer opens Boilerplate page "<url>"
        Then Customer sees the content in the page
        
        Examples:
        | url |
        | /reactuiboilerplate/v1/page |
