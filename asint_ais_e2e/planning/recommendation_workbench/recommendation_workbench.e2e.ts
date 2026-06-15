import utils from "../../utils/utils.ts";
import recommendationWorkbenchDetailView from '../../page_object_model/btp_applications_page/planning/recommendation_workbench/recommendation_workbench.detailview.page.ts';
import recommendationWorkbenchListView from '../../page_object_model/btp_applications_page/planning/recommendation_workbench/recommendation_workbench.listview.page.ts';
describe('BTP - Recommendation Workbench - Functional Test', () => {

    it('should navigate to functional location list view', async () => {
        await recommendationWorkbenchListView.navigateRecommendationWorkbenchListView();
    });

    it('should create new recommendation workbench from list page', async() => {
        await recommendationWorkbenchListView.createReccWorkbench();
    });

    it('should capture header details of newly created MSP items', async() => {
        await utils.captureHeaderDetails();
    });
    
    it('should verify and edit header details of the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.verifyHeader();
        await recommendationWorkbenchDetailView.editHeader();
    });

    it('should capture the MSP id', async() => {
        await recommendationWorkbenchDetailView.captureReccWorkbenchId();
    });

    it.skip('should edit general information of the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.editGeneralInformation();
    });

    it('should edit risk data of the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.editRiskData();
    });

    it('should add attachments to the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.addAttachments();
    });

    it('should verify historic data of the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.verifyHistoricData();
    });

    it('should verify assignment block of the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.verifyAssignmentBlock();
    });

    it('should verify planning block of the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.verifyPlanningBlock();
    });

    it('should verify change history of the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.verifyChangeHistory();
    });

    it.skip('should create workflow for the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.createWorkflow();
    });

    it.skip('should change the status of the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.changeStatus();
    });

    it('should delete the recommendation workbench', async() => {
        await recommendationWorkbenchDetailView.deleteReccWorkbench();
    });
});