import { navigateTo } from '../support/page_objects/navigationPage'
import { onFormLayoutsPage } from '../support/page_objects/formLayoutsPage'
import { onDatePickerPage } from '../support/page_objects/datepickerPage'
import { onSmartTablePage } from '../support/page_objects/smartTablePage'

describe('Test with Page Objects', ()=>{
    
    beforeEach('open application', ()=>{
        //note-22
        cy.openHomePage()
    })

    it('verify navigations across the pages', ()=>{
        navigateTo.formLayoutsPage()
        navigateTo.datePickerPage()
        navigateTo.smartTablePage()
        navigateTo.toasterPage()
        navigateTo.tooltipPage()
    })
    
    it('Submit inline and basic form and select tomorrow date in the calendar', ()=>{
        navigateTo.formLayoutsPage()
        onFormLayoutsPage.submitInlineFormWithNameAndEmail('Richard', 'test@email.com')
        onFormLayoutsPage.submitBasicFormWithEmailAndPassword('Richard', 'password123')

        navigateTo.datePickerPage()
        onDatePickerPage.selectCommonDatePickerDateFromToday(5)
    })

    it.only('Smart tables tests', ()=>{
        navigateTo.smartTablePage()
        onSmartTablePage.updateAgeByFirstName('Larry', 99)
        onSmartTablePage.addNewRecordWithFirstAndLastName('Sherlock', 'Holmes')
        onSmartTablePage.deleteRowByIndex(2)

    })
})