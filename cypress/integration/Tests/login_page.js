context("Actions", () => {
  beforeEach(function() {
    // reset and seed the database prior to every test
    // cy.exec("npm run db:reset && npm run db:seed");
    cy.visit("http://localhost:8000/");
  });
  it("Succesfully logs in", function() {
    cy.get("#inp-login-name").type("admin");
    cy.get("#inp-login-pass").type("admin");
    cy.get("#btn-system-login").click();
  });
});
