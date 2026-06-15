import HomePage from 'page_object_model/btp_applications_page/home.page';
import inspectionTemplatesListPage from 'page_object_model/btp_applications_page/integrity/inspection_templates/inspection_templates.list.page';
import inspectionTemplatesDetailPage from 'page_object_model/btp_applications_page/integrity/inspection_templates/inspection_templates.detail.page';
import utils from 'utils/utils';

describe('BTP Inspection Templates Application - Functional test', () => {

    it('should navigate to Inspection Templates application and verify the page', async () => {
        await HomePage.clickTile('Inspection Templates');
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Navigated to Inspection Templates List View");
    });

    it('should verify Inspection Templates list view page is displayed', async () => {
        await inspectionTemplatesListPage.verifyOnInspectionTemplatesListPage();
   });

    it('should create new Inspection Template and verify it appears in the list', async () => {
        const templateDescription = `E2E Template ${new Date().getTime()}`;
        await inspectionTemplatesListPage.createNewInspectionTemplate(templateDescription, templateDescription);
        console.log(`Created new Inspection Template with description: ${templateDescription}`);
    });

    it('should click on first inspection template in list and verify details page', async () => {
        await inspectionTemplatesListPage.clickOnInspectionTemplateInList(inspectionTemplatesListPage.createdTemplateName);
    });

    it('should goto assignment section and assign the template which was not started with "SA" and verify the assignment', async () => {
        await inspectionTemplatesDetailPage.assignFunctionalLocationTemplate();
    });

    it('should goto define section and create new defination with assigned template and verify', async () => {
        await inspectionTemplatesDetailPage.createNewDefinitionWithAssignedTemplate(inspectionTemplatesListPage.createdTemplateName);
    });

    it('should goto define sub section and create new sub section with the main section and assign classes to sub section and verify', async () => {
        await inspectionTemplatesDetailPage.createNewSubSectionAndAssignClass(inspectionTemplatesListPage.createdTemplateName);
    });

    it('should goto inspection header mapping and map the section to header and verify', async () => {
        await inspectionTemplatesDetailPage.mapSectionToHeader(inspectionTemplatesListPage.createdTemplateName);
    });

    it('should goto checklist mapping and assign sections to checklist and verify', async () => {
        await inspectionTemplatesDetailPage.assignSectionToChecklist(inspectionTemplatesListPage.createdTemplateName);
    });

    it('should goto component mapping and assign component inspection template to component and verify', async () => {
        await inspectionTemplatesDetailPage.assignComponentTemplateToComponent(inspectionTemplatesListPage.createdTemplateName);
    });

    it('should delete the created inspection template and verify it is removed from the list', async () => {
        await inspectionTemplatesDetailPage.deleteInspectionTemplate(inspectionTemplatesListPage.createdTemplateName);
    });
    
    // it('should add and verify all the adapt filters', async () => {
    //     await utils.addAllAdaptFilter();
    //     await utils.resetAllAdaptFilter();
    // });

    // it('should create new advanced filter and verify', async () => {
    //     const createdFilterName = await utils.createNewAdvancedFilter();
    //     console.log(`Created filter for this run: ${createdFilterName}`);
    // });

    // it('should apply the created advanced filter and verify', async () => {
    //     await utils.applyAdvancedFilter();
    // });

    // it('should reset and delete the created advanced filter and verify', async () => {
    //     await utils.resetAdvancedFilter();
    //     await utils.deleteAdvancedFilter();
    // });

    

    // it('should verify and edit header information', async () => {
    //     await inspectionTemplatesDetailPage.verifyHeader();
    //     await inspectionTemplatesDetailPage.editHeader();
    // });

});