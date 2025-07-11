describe('Weather App', () => {
  it('shows weather for a city', () => {
    cy.visit('http://localhost:3000');
    cy.get('.cityInput').type('Berlin');
    cy.get('button[type="submit"]').click();
    cy.get('.card').should('be.visible');
    cy.get('.card').should('contain.text', 'Berlin');
  });

  it('shows error when city is not found', () => {
    cy.visit('http://localhost:3000');
    cy.get('.cityInput').type('NotACity');
    cy.get('button[type="submit"]').click();
    cy.get('.card').should('be.visible');
    cy.get('.card').should('contain.text', 'City not found');
  });

  it('shows error when input is empty', () => {
    cy.visit('http://localhost:3000');
    cy.get('button[type="submit"]').click();
    cy.get('.card').should('be.visible');
    cy.get('.card').should('contain.text', 'Please enter a city name');
  });

  it('clears previous results when searching again', () => {
    cy.visit('http://localhost:3000');
    cy.get('.cityInput').type('Berlin');
    cy.get('button[type="submit"]').click();
    cy.get('.card').should('contain.text', 'Berlin');
    cy.get('.cityInput').clear().type('London');
    cy.get('button[type="submit"]').click();
    cy.get('.card').should('contain.text', 'London');
    cy.get('.card').should('not.contain.text', 'Berlin');
  });
});

it('handles special characters in city input', () => {
  cy.visit('http://localhost:3000');
  cy.get('.cityInput').type('@#$%');
  cy.get('button[type="submit"]').click();
  cy.get('.card').should('be.visible');
});

it('handles very long city names gracefully', () => {
  cy.visit('http://localhost:3000');
  cy.get('.cityInput').type('A'.repeat(100));
  cy.get('button[type="submit"]').click();
  cy.get('.card').should('be.visible');
});

it('trims spaces in city input', () => {
  cy.visit('http://localhost:3000');
  cy.get('.cityInput').type('   Berlin   ');
  cy.get('button[type="submit"]').click();
  cy.get('.card').should('contain.text', 'Berlin');
});

it('submits form with Enter key', () => {
  cy.visit('http://localhost:3000');
  cy.get('.cityInput').type('Berlin{enter}');
  cy.get('.card').should('contain.text', 'Berlin');
});