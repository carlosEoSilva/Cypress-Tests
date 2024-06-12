/// <reference types="cypress"/>

describe('First test suite', ()=>{
    it('first test', ()=>{

        cy.visit('/');//note-4
        cy.contains('Forms').click();
        cy.contains('Form Layouts').click();
        
        // by tag name
        cy.get('input');

        // by ID
        cy.get('#inputEmail');

        // by class value
        cy.get('.input-full-width');

        // by attribute name
        cy.get('[fullwidth]');

        // by attibute and value
        cy.get('[placeholder="Email"]');

        // by entire class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]');

        // by two attibutes
        cy.get('[placeholder="Email"][fullwidth]');

        //by tag, attibute, id, class
        cy.get('input[placeholder="Email"]#inputEmail.input-full-width');

        //by cypress test Id
        cy.get('[data-cy="inputEmail1"]');


    })

    it('Second Test', ()=>{
        cy.visit('/');
        cy.contains('Forms').click();
        cy.contains('Form Layouts').click();

        cy.contains('Sign in')
        
        cy.contains('[status="warning"]', 'Sign in')
        
        cy.contains('nb-card', 'Horizontal form').find('button') //note-5
        cy.contains('nb-card', 'Horizontal form').contains('Sign in')//note-6
        cy.contains('nb-card', 'Horizontal form').get('button');//note-7

        //note-8
        cy.get('#inputEmail3')
            .parents('form')//note-9
            .find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()
    })

    it('Save subject of the command', ()=>{
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')

        //Reaproveitamento de códigos
        // 1 Cypress Alias
        cy.contains('nb-card', 'Using the Grid').as('usingTheGrid')//note-10
        cy.get('@usingTheGrid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.get('@usingTheGrid').find('[for="inputPassword2"]').should('contain', 'Password')

        // 2 Cypress then()
        cy.contains('nb-card', 'Using the Grid').then(usingTheGridForm=>{
            cy.wrap(usingTheGridForm).find('[for="inputEmail1"]').should('contain', 'Email')
            cy.wrap(usingTheGridForm).find('[for="inputPassword2"]').should('contain', 'Password')
        })


    })

    it('Extract text vaues', ()=>{
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //1
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        //2
        cy.get('[for="exampleInputEmail1"]').then(label =>{
            const labelText= label.text()
            expect(labelText).to.equal('Email address')
            cy.wrap(labelText).should('contain', 'Email address')
        })

        //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text =>{
            expect(text).to.equal('Email address')
        })

        cy.get('[for="exampleInputEmail1"]').invoke('text').as('labelText').should('contain', 'Email address')

        //4
        cy.get('[for="exampleInputEmail1"]').invoke('attr', 'class').then(classValue =>{
            expect(classValue).to.equal('label')
        })

        //5 invoke property
        cy.get('[for="exampleInputEmail1"]').type('test@test.com')
        
        cy.get('#exampleInputEmail1').invoke('prop', 'value').should('contain', 'test@test.com')
            .then(property =>{
                expect(property).to.equal('test@test.com')
        })

    })

    it('Radio buttons', ()=>{
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[type=radio]').then(radioButtons=>{
            //por existir mais de um radio na tela, o radioButtons se tornou um array

            cy.wrap(radioButtons).eq(0).check({force:true}).should('be.checked')//note-12
            cy.wrap(radioButtons).eq(1).check({force:true})
            cy.wrap(radioButtons).eq(0).should('not.be.checked')
            cy.wrap(radioButtons).eq(2).should('be.disabled')
        })
    })

    it('Checkboxes', ()=>{
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        // cy.get(('[type="checkbox"]').uncheck({force: true}))
        cy.get('[type="checkbox"]').eq(0).click({force: true})
        cy.get('[type="checkbox"').eq(1).check({force: true})
    })

    it("Date picker", ()=>{
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        let date= new Date()
        date.setDate(date.getDate() + 1000)
        let futureDay= date.getDate()
        let futureMonth= date.toLocaleDateString('en-US', {month: 'short'})
        let futureYear= date.getFullYear()
        let dateToAssert= `${futureMonth} ${futureDay}, ${futureYear}`

        console.log(dateToAssert)

        cy.contains('nb-card', 'Common Datepicker').find('input').then(input =>{
            cy.wrap(input).click()

            //note-13
            function selectDayFromCurrent(){
                cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute=>{
                    if(!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear)){
                        cy.get('[data-name="chevron-right"]').click()
                        selectDayFromCurrent()
                    } else{
                        cy.get('.day-cell').not('.bounding-month').contains(futureDay).click()
                    }
                })
            }
            
            selectDayFromCurrent()

            cy.wrap(input).invoke('prop', 'value').should('contain', dateToAssert)
            cy.wrap(input).should('have.value', dateToAssert)
        })
    })

    it('Lists and dropdowns', ()=>{
        cy.visit('/')

        //1
        //note-14
        // cy.get('nav').contains('nb-select').click()
        cy.get('nav nb-select').click()
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav nb-select').should('contain', 'Dark')

        //2
        cy.get('nav nb-select').then(dropDown=>{
            cy.wrap(dropDown).click()
            cy.get('.options-list nb-option').each((listItem, index)=>{
                const itemText= listItem.text().trim()
                cy.wrap(listItem).click()
                cy.wrap(dropDown).should('contain', itemText)
                if(index < 3){
                    cy.wrap(dropDown).click()
                }
            })
        })
    })

    it('Web tables', ()=>{
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        //1 Get the row by text
        cy.get('tbody').contains('tr', 'Larry').then(tableRow=>{
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('99')
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '99')
        })

        //2 Get the row by index
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then(tableRow=>{
            cy.wrap(tableRow).find('[placeholder="First Name"]').type("John")
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Smith")
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })

        cy.get('tbody tr').first().find('td').then(tableColumns=>{
            cy.wrap(tableColumns).eq(2).should('contain', 'John')//note-15
            cy.wrap(tableColumns).eq(3).should('contain', 'Smith')
        })

        //3 Get each row validation
        const age= [20, 30, 40, 200]

        //note-17
        cy.wrap(age).each(age =>{//note-18
            cy.get('thead [placeholder="Age"]').clear().type(age)
            cy.wait(500)//note-16
            cy.get('tbody tr').each(tableRow=>{
                if(age == 200)
                    cy.wrap(tableRow).should('contain', 'No data found')
                else
                    cy.wrap(tableRow).find('td').eq(6).should('contain', age)
            })
        })
    })

    it("Tooltip", ()=>{
        cy.visit("/")
        cy.contains("Modal & Overlays").click()
        cy.contains("Tooltip").click()

        cy.contains("nb-card", "Colored Tooltips")
        cy.contains("Default").click()
        cy.get('nb-tooltip').should('contain', "This is a tooltip")
    })

    it.only("Browser confirmation window", ()=>{
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        //exemplo 1, o problema desta aboradagem é que o teste sempre será positivo
        // cy.get('tbody tr').first().find('.nb-trash').click()
        
        // //note-19
        // cy.on('window:confirm', (confirm)=>{
        //     expect(confirm).to.equal('Are you sure you want to delete?')
        // })

        //exemplo 2
        // const stub= cy.stub()
        // cy.on('window:confirm', stub)
        // cy.get('tbody tr').first().find('.nb-trash').click().then(()=>{
        //     expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        // })

        //exemplo 3
        cy.get('tbody tr').first().find('.nb-trash').click()
        //note-20
        cy.on('window:confirm', () => false)
    })
})