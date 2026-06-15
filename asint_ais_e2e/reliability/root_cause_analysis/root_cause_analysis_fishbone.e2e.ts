import rcaListviewPage from '../../page_object_model/btp_applications_page/reliability/root_cause_analysis/root_cause_analysis.listview.page.ts';
import rcaFishbonePage from '../../page_object_model/btp_applications_page/reliability/root_cause_analysis/root_cause_analysis_fishbone.page.ts';
import { clear } from 'node:console';


describe('BTP RCA Application Functional test', () => {

    it('should navigate to Root Cause Analysis list view', async () => {
        await rcaListviewPage.navigateRCAListView();
    });

    it('should click Add button to open creation form', async () => {
        await rcaListviewPage.clickAddButton();
    });

    it('should fill and submit Create Assessment form', async () => {
        await rcaListviewPage.enterDescription();
        await rcaListviewPage.enterLongDescription();
        await rcaListviewPage.selectFailureType();
        await rcaListviewPage.selectRCAMeathodology2();
        await rcaListviewPage.clickCreateAssessmentButton();
        await rcaListviewPage.clickOKButton();
    });

    it('should update RCA General Information', async () => {
        await rcaFishbonePage.clickEditButton();
        await rcaFishbonePage.selectFailureOccurrenceMultiple();
        await rcaFishbonePage.enterObservation();
        await rcaFishbonePage.enterLongDescription();
        await rcaFishbonePage.selectDates();
        await rcaFishbonePage.clickSaveButton();
        await rcaFishbonePage.clickAddRolesButton();
    });

    it('should navigate to Technical Objects tab', async () => {
        await rcaFishbonePage.clickTechnicalObjectsTab2();
    });

    it('should navigate to FishBone Analysis tab', async () => {
        await rcaFishbonePage.clickFishBoneAnalysisTab();
        await rcaFishbonePage.createFishboneEventNode();
        await rcaFishbonePage.addProbableCauseNode();
    });

    it('should verify attachment section', async () => {
        await rcaFishbonePage.gotoAttachmentsTabAndAssignAttachment();
        // await rcaFishbonePage.addDocument();
        // await rcaFishbonePage.addLink();
        // await rcaFishbonePage.deleteAttachmentAndVerify();
    });

    it('should verify Maintenance and Service information section', async () => {
        await rcaFishbonePage.verifyMaintenanceAndServiceSections();
    });

    it('should verify RCA change history for header information edits', async () => {
        await rcaFishbonePage.verifyChangeHistory();
    });

    it('should should delete assessment', async () => {
            await rcaFishbonePage.deleteassessment();
    });


});