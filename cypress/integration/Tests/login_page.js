/// <reference types="Cypress" />
context("Actions", () => {
  beforeEach(function() {
    // reset and seed the database prior to every test
    // cy.exec("npm run db:reset && npm run db:seed");
    cy.request("POST", "http://localhost:8000", { username: "ben" })
      .its("body")
      .as("currentUser");
  });
  it("successfully loads login pssage", function() {
    cy.visit("http://localhost:8000/#/sensors"); // change URL to match your dev URL
  });

  it("succsesfully logs in", function() {
    // https://on.cypress.io/type
    cy.get("deviceList")
      .type("fake@email.com")
      .should("have.value", "fake@email.com");
  });

  it("Unsuccessfully loads the page", function() {
    cy.visit("http://localhost:8000/#/sensors"); // change URL to match your dev URL
  });
});
