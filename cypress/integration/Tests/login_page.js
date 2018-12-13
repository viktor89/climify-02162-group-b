context("Log in", () => {
  beforeEach(function() {
    
    cy.visit("http://localhost:8000/");
  });
  it("Succesfully logs in", function() {
    cy.get("#inp-login-name").type("admin");
    cy.get("#inp-login-pass").type("admin");
    cy.get("#btn-system-login").click();
  });
});
