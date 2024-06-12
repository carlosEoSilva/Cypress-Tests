Cypress.Commands.add('loginToApplication', ()=>{
    cy.visit('/login')
    cy.get('[placeholder="Email"]').type('board_arg@yahoo.com.br')
    cy.get('[placeholder="Password"]').type('cypress')
    cy.get('form').submit()
})