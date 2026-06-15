import HomePage from 'page_object_model/btp_applications_page/home.page';
import documentsListviewPage from 'page_object_model/btp_applications_page/documents/documents.listview.page';
import documentsDetailPage from 'page_object_model/btp_applications_page/documents/documents.detail.page';
import utils from 'utils/utils';

describe('Documents Application - Functional test', () => {

	it('should navigate to Documents list and verify page', async () => {
		await documentsListviewPage.openDocumentsFromHome();
	});

    it('should add and verify all the adapt filters', async () => {
        await utils.addAllAdaptFilter(documentsListviewPage.appIframe);
        //await utils.applyAdaptFilter();
        await utils.resetAllAdaptFilter();
    });

	it.skip('should open first document in list and verify details page', async () => {
		const firstDoc = await documentsListviewPage.getFirstDocumentName();
		console.log(`First document found: ${firstDoc}`);
		await documentsListviewPage.clickOnDocumentInList(firstDoc);
		expect(await documentsDetailPage.verifyOnDocumentDetailPage(firstDoc)).toBe(true);
	});

	it.skip('should attempt to download the document if download is available', async () => {
		try {
			await documentsDetailPage.downloadDocument();
			// no strict assertion for download file here — env dependent
		} catch (err) {
			console.log('Download action unavailable or failed:', err.message || err);
		}
	});

    it.skip('should create or add new document on listview page', async () => {
        await documentsListviewPage.addNewDocument();
    });

    it.skip('should verify the created document appears in the listview page', async () => {
        await documentsListviewPage.verifyDocumentInList('vessel-1.png');
        console.log('Verification of created document in list - implementation needed');
    });

    it('should click on one document and verify details page', async () => {
        await documentsListviewPage.clickOnDocumentInList();
    });

    it('should verify edit header information and update it' , async () => {
        await documentsDetailPage.editHeader();
    });

    it('should verify and edit document details page' , async () => {
        await documentsDetailPage.editDocumentDetails();
    });

	it('should goto the assignment tab and verify assignment details' , async () => {
		await documentsDetailPage.verifyAssignmentTabDetails();
	});

});

