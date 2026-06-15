import HomePage from '../../home.page';
import utils from '../../../../utils/utils';

class RNCAListViewPage {
	private get applicationFrame() { return $('//iframe[@title="Application"]'); }
	private get addButton() {
		return $(
			"//button[contains(@aria-label,'Add') or contains(@aria-label,'Create') or " +
			"contains(@title,'Add') or contains(@title,'Create')]"
		);
	}
	private get newAssessmentDialog() {
		return $("//div[@role='dialog' and .//span[normalize-space()='New Assessment']]");
	}
	private get newAssessmentSaveButton() {
		return $(
			"//div[@role='dialog' and .//span[normalize-space()='New Assessment']]" +
			"//button[.//bdi[normalize-space()='Save']]"
		);
	}
	private get currencyValueHelp() {
		return this.newAssessmentDialog.$(
			".//span[normalize-space()='Currency']/following::span[@aria-label='Show Value Help'][1]"
		);
	}
	private get currencyInput() {
		return this.newAssessmentDialog.$(
			".//span[normalize-space()='Currency']/following::input[1]"
		);
	}
	private get currencyDialog() {
		return $("//div[@role='dialog' and .//span[normalize-space()='Select Currency']]");
	}
	private get currencyDialogSaveButton() {
		return $(
			"//div[@role='dialog' and .//span[normalize-space()='Select Currency']]" +
			"//button[.//bdi[normalize-space()='Save']]"
		);
	}
	private get descriptionField() {
		return this.newAssessmentDialog.$(
			".//span[normalize-space()='Description']/following::textarea[1] | " +
			".//span[normalize-space()='Description']/following::input[1]"
		);
	}
	private get longDescriptionField() {
		return this.newAssessmentDialog.$(
			".//span[normalize-space()='Long Description']/following::textarea[1] | " +
			".//span[normalize-space()='Long Description']/following::input[1]"
		);
	}
	private get riskTypeLabel() {
		return this.newAssessmentDialog.$(".//span[normalize-space()='Risk Type']");
	}
	private get allowedObjectsLabel() {
		return this.newAssessmentDialog.$(".//span[normalize-space()='Allowed Objects']");
	}

	public async navigateToRNCAListView(): Promise<void> {
		await HomePage.waitForHomePageToLoad();
		await utils.waitForSAPPopupAndClose();
		await HomePage.clickTile('Asset Risk and Criticality Analysis');
		await utils.waitForBusyIndicatorToDisappear();
		await utils.waitForSAPPopupAndClose();
		await utils.switchToIframe(this.applicationFrame);
	}

	public async openNewAssessmentDialog(): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await this.addButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.addButton);
		await this.newAssessmentDialog.waitForDisplayed({ timeout: 60000 });
	}

	public async verifyNewAssessmentDialogVisible(): Promise<void> {
		await this.newAssessmentDialog.waitForDisplayed({ timeout: 60000 });
		await expect(this.newAssessmentDialog).toBeDisplayed();
	}

	public async fillDescription(description: string, longDescription: string): Promise<void> {
		await this.descriptionField.waitForDisplayed({ timeout: 60000 });
		await utils.setValueWithWait(this.descriptionField, description);
		await this.longDescriptionField.waitForDisplayed({ timeout: 60000 });
		await utils.setValueWithWait(this.longDescriptionField, longDescription);
	}

	public async verifyDescriptionValues(expectedDescription: string, expectedLongDescription: string): Promise<void> {
		const descriptionValue = await utils.getValueWithWait(this.descriptionField);
		const longDescriptionValue = await utils.getValueWithWait(this.longDescriptionField);
		await expect(descriptionValue.trim()).toEqual(expectedDescription.trim());
		await expect(longDescriptionValue.trim()).toEqual(expectedLongDescription.trim());
	}

	public async selectRiskType(optionText: string): Promise<void> {
		await this.riskTypeLabel.waitForDisplayed({ timeout: 60000 });
		const option = this.newAssessmentDialog.$(
			`.//*[self::label or self::span][normalize-space()='${optionText}']`
		);
		await option.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(option);
	}

	public async selectAllowedObjects(optionText: string): Promise<void> {
		await this.allowedObjectsLabel.waitForDisplayed({ timeout: 60000 });
		const option = this.newAssessmentDialog.$(
			`.//*[self::label or self::span][normalize-space()='${optionText}']`
		);
		await option.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(option);
	}

	public async selectCurrencyByIndex(rowIndex = 3): Promise<void> {
		await this.currencyValueHelp.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.currencyValueHelp);
		await this.currencyDialog.waitForDisplayed({ timeout: 60000 });
		const currencyRow = this.currencyDialog.$(
			`(//tr[@role='row']//div[@role='radio'])[${rowIndex}]`
		);
		await currencyRow.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(currencyRow);
		await this.currencyDialogSaveButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.currencyDialogSaveButton);
	}

	public async getSelectedCurrencyValue(): Promise<string> {
		await this.currencyInput.waitForDisplayed({ timeout: 60000 });
		return (await utils.getValueWithWait(this.currencyInput)).trim();
	}

	public async saveNewAssessment(): Promise<void> {
		await this.newAssessmentSaveButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.newAssessmentSaveButton);
	}

	
}

export default new RNCAListViewPage();
