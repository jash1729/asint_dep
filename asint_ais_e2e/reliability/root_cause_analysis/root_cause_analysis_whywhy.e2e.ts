import rcaListviewPage from '../../page_object_model/btp_applications_page/reliability/root_cause_analysis/root_cause_analysis.listview.page.ts';
import rcaWhywhyPage from '../../page_object_model/btp_applications_page/reliability/root_cause_analysis/root_cause_analysis_whywhy.page.ts';
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
        await rcaListviewPage.selectRCAMethodology();
        await rcaListviewPage.clickCreateAssessmentButton();
        await rcaListviewPage.clickOKButton();
    });

    it('should update RCA General Information', async () => {
        await rcaWhywhyPage.clickEditButton();
        await rcaWhywhyPage.selectFailureOccurrenceMultiple();
        await rcaWhywhyPage.enterObservation();
        await rcaWhywhyPage.enterLongDescription();
        // await rcaWhywhyPage.selectFailureTypeSafety();
        await rcaWhywhyPage.selectDates();
        await rcaWhywhyPage.clickSaveButton();
        await rcaWhywhyPage.clickAddRolesButton(); 
    });

    it('should navigate to Technical Objects tab', async () => {
        await rcaWhywhyPage.clickTechnicalObjectsTab();
    });

    it('should navigate to Why-Why Analysis tab', async () => {
        await rcaWhywhyPage.clickWhyWhyAnalysisTab();
        await rcaWhywhyPage.verifyEventInWhyWhyAnalysis();
    });

    it('should verify attachment section', async () => {
        await rcaWhywhyPage.gotoAttachmentsTabAndAssignAttachment();
        // await rcaWhywhyPage.addDocument();
        // await rcaWhywhyPage.addLink();
        // await rcaWhywhyPage.deleteAttachmentAndVerify();
    });

    it('should verify Maintenance and Service information section', async () => {
        await rcaWhywhyPage.verifyMaintenanceAndServiceSections();
    });

    it('should verify RCA change history for header information edits', async () => {
        await rcaWhywhyPage.verifyChangeHistory();
    });

    it('should should delete assessment', async () => {
        await rcaWhywhyPage.deleteassessment();
    });

});