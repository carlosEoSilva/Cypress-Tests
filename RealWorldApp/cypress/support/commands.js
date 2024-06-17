Cypress.Commands.add('apiLogin', ()=>{
    const userCredentials= {
        "user": {
            "email": "board_arg@yahoo.com.br",
            "password": "cypress"
          }
      }


      cy.request('POST', 'https://conduit-api.bondaracademy.com/api/users/login', userCredentials)
        .its('body')
        .then(body =>{
            const token= body.user.token
            cy.wrap(token).as('token')//note-5

            cy.visit('/', {
                onBeforeLoad: (window)=> {
                    window.localStorage.setItem('jwtToken', token)
                }
            })
        })
})

Cypress.Commands.add('screenLogin', ()=>{
    cy.visit('/login')
    cy.get('[placeholder="Email"]').type('board_arg@yahoo.com.br')
    cy.get('[placeholder="Password"]').type('cypress')
    cy.get('form').submit()
})
