import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then(/the search textbox exists/, () => {
  cy.get("textarea").should("exist");
});
