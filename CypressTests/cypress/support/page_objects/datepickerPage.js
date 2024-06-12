
function selectDayFromCurrent(day){
    let date= new Date()
    date.setDate(date.getDate() + day)
    let futureDay= date.getDate()
    let futureMonth= date.toLocaleDateString('en-US', {month: 'short'})
    let futureYear= date.getFullYear()
    let dateAssert= `${futureMonth} ${futureDay}, ${futureYear}`

    cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute=>{
        if(!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear)){
            cy.get('[data-name="chevron-right"]').click()
            selectDayFromCurrent(day)
        } else{
            cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
        }
    })

    return dateAssert
}



class DatePickerPage{
    
    selectCommonDatePickerDateFromToday(dayFromToday){
        cy.contains('nb-card', 'Common Datepicker').find('input').then(input =>{
            cy.wrap(input).click()
            let dateAssert= selectDayFromCurrent(dayFromToday)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
            cy.wrap(input).should('have.value', dateAssert)
        })
    }
}

export const onDatePickerPage= new DatePickerPage()