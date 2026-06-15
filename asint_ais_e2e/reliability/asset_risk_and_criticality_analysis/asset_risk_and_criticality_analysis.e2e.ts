import rncaListViewPage from '../../page_object_model/btp_applications_page/reliability/asset_risk_and_criticality_analysis/rnca.listview.page';
import rncaDetailpage from '../../page_object_model/btp_applications_page/reliability/asset_risk_and_criticality_analysis/rnca.detail.page';
import { browser, expect } from '@wdio/globals';
import utils from '../../utils/utils';

describe('BTP - (RNC)-Asset Risk and Criticality Analysis Application - Functional Test', () => {

	it('should click on asset risk and criticality analysis application', async () => {
		await rncaListViewPage.navigateToRNCAListView();
	});

	it('should create a new RNCA assessment from list view', async () => {
		const description = 'Test Assessment';
		const longDescription = 'This is automation test';

		await rncaListViewPage.openNewAssessmentDialog();
		await rncaListViewPage.verifyNewAssessmentDialogVisible();
		await rncaListViewPage.fillDescription(description, longDescription);
		await rncaListViewPage.verifyDescriptionValues(description, longDescription);
		await rncaListViewPage.selectRiskType('Current Risk');
		await rncaListViewPage.selectAllowedObjects('Both');
		await rncaListViewPage.selectCurrencyByIndex(3);
		const selectedCurrency = await rncaListViewPage.getSelectedCurrencyValue();	
		await expect(selectedCurrency).not.toEqual('');
		await rncaListViewPage.saveNewAssessment();
		await utils.waitForBusyIndicatorToDisappear();
		const okBtn = await $("//span[text()='Success']/following::button[.//bdi[text()='OK']][1]");
		await okBtn.waitForClickable();
		await okBtn.click();
		await utils.waitForBusyIndicatorToDisappear();
	});

	it('should edit General Information tab of created assessment', async () => {
		await rncaDetailpage.editGeneralInformation('Updated Test Assessment', 'This is updated automation test');
	});

	it('should verify Administrative Information tab', async () => {
		await rncaDetailpage.verifyAdministrativeInformation();
	});

	it('should edit Validity Information', async () => {
		await rncaDetailpage.editValidity('Dec 31, 2024', 'Jan 1, 2026');
	});

	it('should edit Scope information and verify', async () => {
		await rncaDetailpage.editScope('Updated In Scope Description');
		await browser.pause(3000);
	});

	it('should assign equipment to the assessment and verify', async () => {
		await rncaDetailpage.assignEquipment('Test Equipment 123');
	});

	it('should assign Assessment Template to the technical object', async () => {
		await rncaDetailpage.assignTemplate('Test Template');
	});

	it('should calculate risk Details on Assessment section and verify risk details', async () => {
		await rncaDetailpage.calculateRiskOnAssessment();
	});

	it('should delete the created assessment and verify', async () => {
		await rncaDetailpage.deleteAssessment();
	});

});
