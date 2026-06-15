import RNCTListViewPage from '../../page_object_model/btp_applications_page/reliability/asset_risk_and_criticality_template/rnct.listview.page';
import RNCTDetailPage from '../../page_object_model/btp_applications_page/reliability/asset_risk_and_criticality_template/rnct.detail.page';

describe('BTP - (RCT) -Asset Risk and Criticality Template App - Functional test', () => {

	it('should click on asset risk and criticality template application', async () => {
		await RNCTListViewPage.navigateToRNCTListView();
	});

	it('should create a new asset risk and criticality template', async () => {
		const templateName = "Test Template " + new Date().getTime();
		await RNCTListViewPage.createNewTemplate(templateName);
		//await RNCTDetailPage.verifyTemplateCreation(templateName);
	});
	
	it('should edit general information', async () => {
			const newDescription = "Updated Description " + new Date().getTime();
			const newLongDescription = "Updated Long Description " + new Date().getTime();
			await RNCTDetailPage.editGeneralInformation(newDescription, newLongDescription);
	});

	it('should verify Administrative Information tab', async () => {
		await RNCTDetailPage.verifyAdministrativeInformation();
	});

	it('should go to impacts section and create new impact', async () => {
		const impactTitle = "Test Impact " + new Date().getTime();
		await RNCTDetailPage.createImpact(impactTitle, "This is a test impact created during automation testing.");
		await RNCTDetailPage.addDimensionToImpact(impactTitle, "Test Dimension " + new Date().getTime());
	});

	it('should go to threshold section and verify risk matrix score and other details', async () => {
		await RNCTDetailPage.verifyThresholdSection();
	});

	it('should delete the created template', async () => {
		await RNCTDetailPage.deleteTemplate();
	});

	


});