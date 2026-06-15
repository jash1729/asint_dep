import assetRCMList from '../../page_object_model/btp_applications_page/reliability/asset_rcm_analysis/asset_rcm_analysis.listview.page';
import assetRCMDetailView from '../../page_object_model/btp_applications_page/reliability/asset_rcm_analysis/asset_rcm_analysis.detailview.page';

describe('BTP - RCM Analysis Application - Functional Test', () => {

    it('should navigate to Asset RCM list view', async () => {
        await assetRCMList.navigateToAssetRCM();
    });
    
    it('Create new Asset RCM Assessment', async () => {
        await assetRCMList.createAssetRCM();
    });

    it('should verify and edit information tab' , async () => {
        await assetRCMDetailView.verifyAndEditGenInfo();
        await assetRCMDetailView.verifyAndEditPlanningData();
        await assetRCMDetailView.addRoles();
    });

    it('should verify assessment tab and add tecnhinal objects' , async () => {
        await assetRCMDetailView.createAssessmentFlow();
        await assetRCMDetailView.verifyAssessment();
        await assetRCMDetailView.verifyAssessmentSections();
    });

    it('should add maintanable itmes for techninal objects' , async () => {
        await assetRCMDetailView.addMaintanableItems();
        await assetRCMDetailView.verifyMaintainableDetails();
    });

    it('should add failure modes for added maintanable itmes of technical objects' , async () => {
        await assetRCMDetailView.addFailureModes();
        await assetRCMDetailView.verifyFailureModesDetails();
    });

    it('should add functional location as technical objects', async () => {
        await assetRCMDetailView.addFunLocTechObj();
        await assetRCMDetailView.verifyDetailPageFunLoc();
    });

    it('should add functions for functional location technical objects', async () => {
        await assetRCMDetailView.assignFunctions();
    });

    it('should add functional failure for assigned functions', async () => {
        await assetRCMDetailView.assignFunctionalFailure();
    });

    it('should add maintanable itmes for technical objects' , async () => {
        await assetRCMDetailView.addMaintainableItemsForFuncLoc();
    });

    it('should add failure modes for added maintanable itmes of technical objects' , async () => {
        await assetRCMDetailView.addFailureModesForFuncLoc();
        await assetRCMDetailView.verifyFailureModesDetails();
    });

    it('should verify attachment section' , async () => {
        await assetRCMDetailView.gotoAttachmentsTabAndAssignAttachment();
    });

    it('should able to download and verify summary report', async () => {
        await assetRCMDetailView.downloadSummaryReport();
    });

    it('should able to delete newly created RCM', async () => {
        await assetRCMDetailView.deleteRCM();
        await assetRCMList.verifyRCMDeletion();
    });
    
});
