import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { getPage } from "cypress/support/appOne/pages";
Given(/I navigate to the main url/, () => {
  cy.visit(getPage());
});
