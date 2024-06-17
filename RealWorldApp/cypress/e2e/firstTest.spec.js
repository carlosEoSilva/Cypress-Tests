
import {postsList} from '../support/pageObjects/PostsList'

describe('Test with backend', () => {
  
  beforeEach('login to application', ()=>{
    //note-2
    //cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', {fixture: 'tags.json'})  
    
    //
    cy.intercept({method: 'GET', path: 'tags'}, {fixture: 'tags.json'})
    
    // cy.screenLogin()
    cy.apiLogin()
  })


  it('verify correct request and response', () => {
    //note-1
    cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles')
    
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('Testing applications with cypress')
    cy.get('[formcontrolname="description"]').type('Article about how to use cypress')
    cy.get('[formcontrolname="body"]').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id eros tortor. Fusce sed fringilla nibh. Vestibulum tempus porta sem ac vehicula. Quisque tincidunt sapien id diam dictum, at porttitor neque pulvinar. Integer lobortis dolor nibh, at semper neque euismod at.')
    cy.get('[placeholder="Enter tags"]').type('cypress, test, end to end, applications')
    cy.get('button').contains('Publish Article').click()

    cy.wait('@postArticles').then(xhr =>{
      console.log(xhr)
      expect(xhr.response.statusCode).to.be.equal(201)
      expect(xhr.request.body.article.title).to.equal('Testing applications with cypress')
      expect(xhr.response.body.article.description).to.equal('Article about how to use cypress')
    })

    postsList.deleteByTitle('Testing applications with cypress')

  })

  it('modify request and response with intercept', () => {
    
    cy.intercept('POST', '**articles', (req)=>{
      req.body.article.title= 'Title modified with intercept'
    }).as('postArticles')
    
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('Testing applications with cypress')
    cy.get('[formcontrolname="description"]').type('Article about how to use cypress')
    cy.get('[formcontrolname="body"]').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id eros tortor. Fusce sed fringilla nibh. Vestibulum tempus porta sem ac vehicula. Quisque tincidunt sapien id diam dictum, at porttitor neque pulvinar. Integer lobortis dolor nibh, at semper neque euismod at.')
    cy.get('[placeholder="Enter tags"]').type('cypress, test, end to end, applications')
    cy.get('button').contains('Publish Article').click()

    cy.wait('@postArticles').then(xhr =>{
      console.log(xhr)
      expect(xhr.response.statusCode).to.be.equal(201)
      expect(xhr.request.body.article.title).to.equal('Title modified with intercept')
      expect(xhr.response.body.article.description).to.equal('Article about how to use cypress')
    })

    postsList.deleteByTitle('Title modified with intercept')

  })

  it('verify if mocked tags are being displayed', ()=>{
    cy.get('.tag-list')
      .should('contain', 'cypress')
      .and('contain', 'automation')
      .and('contain', 'testing')
  })

  it('testing feed likes count', ()=>{
    //note-3
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', {"articles":[],"articlesCount":0})
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', {fixture: 'articles.json'})

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(heartList =>{
      expect(heartList[0]).to.contain('1')
      expect(heartList[1]).to.contain('5')
      expect(heartList[2]).to.contain('10')
    })

    cy.fixture('articles.json').then(file =>{

      let articleSlug= file.articles[0].slug
      file.articles[1].favoritesCount= 2
      cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/'+ articleSlug +'/favorite', file)
    
      let articleSlug_1= file.articles[1].slug
      file.articles[1].favoritesCount= 6
      cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/'+ articleSlug_1 +'/favorite', file)
    
      let articleSlug_2= file.articles[2].slug
      file.articles[1].favoritesCount= 11
      cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/'+ articleSlug_2 +'/favorite', file)  
    })

    cy.get('app-article-list button').eq(0).click().should('contain', '2')
    cy.get('app-article-list button').eq(1).click().should('contain', '6')
    cy.get('app-article-list button').eq(2).click().should('contain', '11')

  })

  it('login with screen - delete new article in global feed', ()=>{
    const userCredentials= {
      "user": {
          "email": "board_arg@yahoo.com.br",
          "password": "cypress"
        }
    }

    const bodyRequest= {
      "article": {
          "title": "Api call with cypress",
          "description": "Loren ipsun dolor sit amet",
          "body": "Loren ipsun dolor sit amet",
          "tagList": []
      }
    }

    cy.request('POST', 'https://conduit-api.bondaracademy.com/api/users/login', userCredentials)
      .its('body').then(body =>{
        const token= body.user.token
        
        cy.request({
          url: 'https://conduit-api.bondaracademy.com/api/articles/',
          headers: { 'Authorization': 'Token ' + token },
          method: 'POST',
          body: bodyRequest
        }).then(response =>{
            expect(response.status).to.equal(201)
          })

        postsList.deleteByTitle(bodyRequest.article.title)

        cy.request({
          url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
          headers: { 'Authorization': 'Token ' + token },
          method: 'GET'
        }).its('body').then(body=>{
          console.log(body)
          expect(body.articles[0].title).not.to.equal(bodyRequest.article.title)
        })
      })


  })

  it('login with API - delete new article in global feed', ()=>{

    const bodyRequest= {
      "article": {
          "title": "Api call with cypress",
          "description": "Loren ipsun dolor sit amet",
          "body": "Loren ipsun dolor sit amet",
          "tagList": []
      }
    }

    cy.get('@token')
      .then(token =>{
        cy.request({
          url: 'https://conduit-api.bondaracademy.com/api/articles/',
          headers: { 'Authorization': 'Token ' + token },
          method: 'POST',
          body: bodyRequest
        }).then(response =>{
            expect(response.status).to.equal(201)
          })

        postsList.deleteByTitle(bodyRequest.article.title)

        cy.request({
          url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
          headers: { 'Authorization': 'Token ' + token },
          method: 'GET'
        }).its('body').then(body=>{
          console.log(body)
          expect(body.articles[0].title).not.to.equal(bodyRequest.article.title)
        })
      })


  })

})