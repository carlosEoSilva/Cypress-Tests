function goToList(userName){
    cy.visit('/profile/'+userName);
}


export class PostsList{
    UserName= 'carlosCypress';

    deleteByTitle(title){
        cy.get('.nav-item').find('[href="/profile/carlosCypress"]').click();
        cy.get('.preview-link').contains(title).click();
        cy.get('[class="article-actions"]').find('button').contains('Delete Article').click();
    }

    //não funciona
    deleteAllPosts(){
        cy.visit('https://conduit.bondaracademy.com/profile/carlosCypress')

        let qtd= cy.get('app-article-preview').length

        // if(cy.get('app-article-preview').length > 0){
        //     cy.log('tst')
        // }

        cy.get('app-article-preview').then((article) =>{
            if(article.length > 0){
                cy.get('.preview-link').first().click();
                cy.get('button').contains('Delete Article').click();
                this.deleteAllPosts();
            }
            else{
                
            }
        })
    }
}

export const postsList= new PostsList()