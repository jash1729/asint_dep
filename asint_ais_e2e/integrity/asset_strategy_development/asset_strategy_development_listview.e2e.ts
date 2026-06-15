import ASDListView from '../../page_object_model/btp_applications_page/integrity/asset_strategy_development/asset_strategy_development.listview.page';
import utils from '../../utils/utils';

describe('BTP - Asset Strategy Development (ASD) (ListView) - Functional Test', () => {

    it('should navigate to Asset RCM list view', async () => {
        await ASDListView.navigateToASD();
    });

    it('should add and verify all the adapt filters', async () => {
        await utils.addAllAdaptFilter();
        await utils.resetAllAdaptFilter();
    });

    it('should verify fields in list view using setting option', async () => {
        await utils.verifyFieldsInListView();
        await utils.resetFieldsInListView();
    });

    it('should verify show hierarchy option in list View', async () => {
        await utils.verifyShowHierarchy();
    });
    
    it('should verify Analytic chart option in list View', async () => {
        await utils.verifyAnalyticsChart();
    });

});