import MSPDetailView from '../../page_object_model/btp_applications_page/planning/maintenance_spend_planning/maintenance_spend_planning.detailview.page.ts';
import MSPListView from '../../page_object_model/btp_applications_page/planning/maintenance_spend_planning/maintenance_spend_planning.listview.page.ts';
import utils from "../../utils/utils.ts";
describe('BTP - Maintenance Spend Planning item (MSP) - Functional Test', () => {

    it('should navigate to Maintenance Spend Planning list view', async () => {
        await MSPListView.navigateToMSPListView();
    });

    it('should be able to create Maintenance Spend Planning items', async () => {
        await MSPListView.createMSPItems();
    });

    it('should capture header details of newly created MSP items', async() => {
        await utils.captureHeaderDetails();
    });

    it('should capture the MSP id', async() => {
        await MSPDetailView.captureMSPId();
    });

    it('should verify and edit header details', async() => {
        await MSPDetailView.verifyHeader();
        // await MSPDetailView.editHeader();
    });

    it('should edit general information section', async() => {
        await MSPDetailView.editGeneralInfo();
    });

    it('should edit assignments section', async() => {
        await MSPDetailView.editAssigmentsSection();
    });

    it('should edit details section', async() => {
        await MSPDetailView.editDetailSection();
    });

    it('should edit risk data section', async() => {
        await MSPDetailView.editRiskData();
    });

    it('should edit summary section', async() => {
        await MSPDetailView.editSummary();
    });

    it('should verify attachment section' , async () => {
        await MSPDetailView.gotoAttachmentsTabAndAssignAttachment();
    });

    it('should verify historic data section', async() => {
        await MSPDetailView.verifyHistoricData();
    });

    it('should verify change history section', async() => {
        await MSPDetailView.verifyChangeHistory();
    });

    it('should able to change status of MSP', async() => {
        await MSPDetailView.changeStatus();
    });

    it('should create workflow', async() => {
        await MSPDetailView.createWorkflow();
    });

});