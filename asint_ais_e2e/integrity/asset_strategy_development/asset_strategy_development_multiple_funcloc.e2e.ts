import ASDListView from '../../page_object_model/btp_applications_page/integrity/asset_strategy_development/asset_strategy_development.listview.page';
import ASDDetailView from '../../page_object_model/btp_applications_page/integrity/asset_strategy_development/asset_strategy_development.detailview.page';
import utils from '../../utils/utils';

describe('BTP - Asset Strategy Development (ASD)- Multiple Functional Locations - Functional Test', () => {

    it('should navigate to asset strategy development list view', async () => {
        await ASDListView.navigateToASDListView();
    });

    it('should be able to create asset strategy development for multiple functional locations', async () => {
        await ASDListView.createASDForMultipleFunctionalLocations();
    });

    it('should be able to capture asset strategy development details for single equipment', async () => {
        await utils.captureHeaderDetails();
    });

    it('should be able to capture information from general section', async () => {
        await ASDDetailView.captureGeneralSelection();
    });

    it('should be able to edit header information', async () => {
        await ASDDetailView.verifyHeader();
        await ASDDetailView.editHeader();
    });

    it('should be able to verify and edit general information section', async () => {
        await ASDDetailView.verifyEditGenInfo();
    });

    it('should be able to verify and edit Analysis section', async () => {
        await ASDDetailView.editAnalysisInfo();
        await ASDDetailView.verifyAnalysisInfo();
    });

    it('should be able to verify risk matrix section', async () => {
        await ASDDetailView.verifyRiskMatrixInfo();
    });

    it('should be able to verify CMLs section', async () => {
        await ASDDetailView.verifyCMLSection();
    });

    it('should be able to verify risk information section', async () => {
        await ASDDetailView.verifyRiskInfo();
    });

    it('should be able to verify maintenance and service section', async () => {
        await ASDDetailView.verifyMaintenanceAndServiceInfo();
    });

    it('should verify attachment section' , async () => {
        await ASDDetailView.gotoAttachmentsTabAndAssignAttachment();
//        await functionalLocationDetailView.addDocument();
//        await functionalLocationDetailView.addLink();
//        await functionalLocationDetailView.deleteAttachmentAndVerify();
    });

    it('should be able to download and verify ASD report', async () => {
        await ASDDetailView.downloadAndVerifyReport();
    });

    it('should able to delete newly created ASD', async () => {
        await ASDDetailView.deleteASD();
        await ASDListView.verifyASDDeletion();
    });

});