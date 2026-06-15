import assetRCMList from '../../page_object_model/btp_applications_page/reliability/asset_rcm_analysis/asset_rcm_analysis.listview.page';
import utils from '../../utils/utils';

describe('BTP - RCM Application - Functional Test', () => {

    it('should navigate to Asset RCM list view', async () => {
        await assetRCMList.navigateToAssetRCM();
    });

    it('should add and verify all the adapt filters', async () => {
        await utils.addAllAdaptFilter();
        //await utils.resetAllAdaptFilter();
    });

    it('should verify fields in list view using setting option', async () => {
        await utils.verifyFieldsInListView();
        await utils.resetFieldsInListView();
    });

});