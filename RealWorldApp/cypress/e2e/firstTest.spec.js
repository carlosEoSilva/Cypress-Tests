
describe('Test with backend', () => {
  
  beforeEach('login to application', ()=>{
    //note-2
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', {fixture: 'tags.json'})  
    cy.loginToApplication()
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

    cy.wait(3000)
    cy.get('button').contains('Delete Article').click()

  })

  it('verify if mocked tags are being displayed', ()=>{
    cy.get('.tag-list')
      .should('contain', 'cypress')
      .and('contain', 'automation')
      .and('contain', 'testing')
  })

  it.only('testing feed likes count', ()=>{
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
})