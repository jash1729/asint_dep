import MSPDetailView from '../../page_object_model/btp_applications_page/planning/maintenance_spend_planning/maintenance_spend_planning.detailview.page.ts';
import MSPListView from '../../page_object_model/btp_applications_page/planning/maintenance_spend_planning/maintenance_spend_planning.listview.page.ts';
import utils from "../../utils/utils.ts";
describe('BTP - Maintenance Spend Planning event (MSP) - Functional Test', () => {

    it('should navigate to Maintenance Spend Planning list view', async () => {
        await MSPListView.navigateToMSPListView();
    });

    it('should be able to create Maintenance Spend Planning items', async () => {
        await MSPListView.createMSPEvent();
    });

    it('should capture header details of newly created MSP items', async() => {
        await utils.captureHeaderDetails();
    });

    it('should capture the MSPE id', async() => {
        await MSPDetailView.captureMSPEId();
    });

    it.skip('should verify and edit header details', async() => {
        await MSPDetailView.verifyMSPEHeader();
        // await MSPDetailView.editHeader();
    });
});