import CMLListView from "../../page_object_model/btp_applications_page/integrity/cmls/cmls.listview.page";
import CMLDetailView from "../../page_object_model/btp_applications_page/integrity/cmls/cmls.detailview.page";
describe('BTP - CMLs - Functional Test', () => {

    it('should navigate to CMLs list view', async () => {
        await CMLListView.navigateToCMLListView();
    });

    it('should create new CMLs', async () => {
        await CMLListView.createNewCMLs();
    });

    it('verify created CMLs in CML Summary', async () => {
        await CMLDetailView.verifyCmlInSummary();
    });

});