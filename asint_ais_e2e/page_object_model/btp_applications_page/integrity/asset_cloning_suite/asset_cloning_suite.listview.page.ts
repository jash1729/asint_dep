import HomePage from '../../home.page';
import utils from '../../../../utils/utils';
import { browser, expect } from '@wdio/globals';

class AssetCloningSuiteListViewPage {

	private get applicationFrame() { return $('//iframe[@title="Application"]'); }
	private get backButton() { return $("//a[@aria-label='Back']"); }

	// --- Sub-section tile (home page) ---
	private subSectionTile(tileName: string) { return $(`//div[@role='button' and contains(concat(' ', normalize-space(@class), ' '), ' sapMGT ') and starts-with(normalize-space(@aria-label), '${tileName}')]`); }

	// --- Asset Strategy Assessments (ASD) ---
	private get searchInput() { return $("//input[@type='search' and @aria-label='Search']"); }
	private get firstAssessmentRadio() { return $("(//div[@role='radio'])[1]"); }

	// --- Generic list-with-filter (RCM / ASA / RCA) ---
	private get listFilterSearchInput() { return $("(//input[@type='search' or contains(@class,'sapMSFI') or contains(@id,'-search-I') or contains(@id,'-I')][not(@disabled)])[1]"); }
	private get listGoButton() { return $("//button[.//bdi[normalize-space()='Go'] or normalize-space(@title)='Go']"); }
	private get firstListAssessmentRadio() { return $("(//table//tr[@role='row' and ./td])[1]//div[@role='radio']"); }

	// --- Asset Cloning Templates: list + Create New Tasks dialog ---
	private get cloningTemplatesAddButton() { return $("//button[@aria-label='Add' and @title='Add' and not(@disabled)]"); }
	private get createTaskDialog() { return $("//div[@role='dialog' and .//h1[normalize-space()='Create New Tasks']]"); }
	private get createTaskDialogTitle() { return this.createTaskDialog.$(".//h1[normalize-space()='Create New Tasks']"); }
	private get createTaskShortDescriptionInput() { return this.createTaskDialog.$(".//label[.//bdi[normalize-space()='Short Description']]/following::input[1]"); }
	private get createTaskObjectTypeArrow() { return this.createTaskDialog.$(".//label[.//bdi[normalize-space()='Object Type']]/following::*[@role='button'][1]"); }
	private get createTaskRelevantForArrow() { return this.createTaskDialog.$(".//label[.//bdi[normalize-space()='Relevant For']]/following::*[@role='button'][1]"); }
	// Assessment Template uses a value-help (F4) icon, not a dropdown arrow.
	private get createTaskAssessmentTemplateValueHelp() { return this.createTaskDialog.$(".//span[@role='button' and @aria-label='Show Value Help']"); }
	// Value-help popup is at body root, outside createTaskDialog — pick the most recent one with a Save button.
	private get assessmentTemplateValueHelpDialog() { return $("(//div[@role='dialog' and .//button[.//bdi[normalize-space()='Save']]])[last()]"); }
	private assessmentTemplateRowByName(name: string) {
		const lower = name.toLowerCase();
		return this.assessmentTemplateValueHelpDialog.$(`.//tr[@role='row' and .//input[@type='CheckBox'] and .//*[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${lower}')]]`);
	}
	// Row click only highlights — must click the checkbox wrapper div (the input itself is not clickable in UI5).
	private assessmentTemplateRowCheckboxByName(name: string) {
		const lower = name.toLowerCase();
		return this.assessmentTemplateValueHelpDialog.$(`.//tr[@role='row' and .//input[@type='CheckBox'] and .//*[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${lower}')]]//input[@type='CheckBox']/parent::*`);
	}
	private get assessmentTemplateSaveButton() { return this.assessmentTemplateValueHelpDialog.$(".//button[.//bdi[normalize-space()='Save']]"); }
	private get createTaskCloneButton() { return this.createTaskDialog.$(".//button[.//bdi[normalize-space()='Clone']]"); }
	private get successOkButton() { return $("//button[@title='OK' or normalize-space(.)='OK' or .//bdi[normalize-space()='OK'] or .//span[normalize-space()='OK']]"); }
	private get openComboboxFirstOption() { return $("(//ul[@role='listbox' and not(@aria-hidden='true')]//li[@role='option'])[1]"); }
	// Click the inner title span so the row selects via its content area, not its checkbox.
	private openComboboxOptionByText(value: string) { return $(`(//ul[@role='listbox' and not(@aria-hidden='true')]//li[@role='option']//span[@aria-live='polite' and normalize-space()='${value}'])[last()]`); }

	// --- Shared helpers ---

	/** Click with `clickWithWait`; on intercepted-click failures, fall back to a native JS click. */
	private async clickWithJsFallback(elem: any): Promise<void> {
		try {
			await elem.waitForClickable({ timeout: 10000 });
			await utils.clickWithWait(elem);
		} catch {
			await browser.execute((el: HTMLElement) => el.click(), elem as unknown as HTMLElement);
		}
	}

	// --- Navigation ---

	public async navigateToAssetCloningSuiteListView(): Promise<void> {
		await HomePage.waitForHomePageToLoad();
		await utils.waitForSAPPopupAndClose();
		await HomePage.clickTile('Asset Cloning Suite');
		await utils.waitForBusyIndicatorToDisappear();
		await utils.waitForSAPPopupAndClose();
		await utils.switchToIframe(this.applicationFrame);
	}

	private async openSubSection(tileName: string): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		const tile = await this.subSectionTile(tileName);
		await tile.waitForExist({ timeout: 60000 });
		await tile.scrollIntoView();
		await this.clickWithJsFallback(tile);
		await utils.waitForBusyIndicatorToDisappear();
		console.log(`Opened sub-section: ${tileName}`);
	}

	public async navigateBackToSubSections(): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		// Back button lives in the FLP shell header, outside the application iframe.
		await browser.switchFrame(null);
		await this.backButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.backButton);
		await utils.waitForBusyIndicatorToDisappear();
		await utils.switchToIframe(this.applicationFrame);
		console.log('Navigated back to Asset Cloning Suite sub-sections');
	}

	/**
	 * Returns to the Asset Cloning Suite sub-sections page from anywhere
	 * (including from inside a launched sub-app) via the FLP intent hash.
	 */
	public async returnToAssetCloningSuiteHome(): Promise<void> {
		const intentHash = '#cloneapp-manage?sap-ui-app-id-hint=saas_approuter_com.asint.ais.mi.cloneapp';
		await utils.waitForBusyIndicatorToDisappear();
		await browser.switchFrame(null);
		await utils.waitForSAPPopupAndClose();
		await browser.execute((hash: string) => { window.location.hash = hash; }, intentHash);
		await utils.waitForBusyIndicatorToDisappear();
		await utils.waitForSAPPopupAndClose();
		await utils.switchToIframe(this.applicationFrame);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Returned to Asset Cloning Suite sub-sections page via intent hash');
	}

	public async openAssetStrategyAssessments(): Promise<void> { await this.openSubSection('Asset Strategy Assessments'); }
	public async openAssetRCMAnalysis(): Promise<void> { await this.openSubSection('Asset RCM Analysis'); }
	public async openAssetStrategyAnalysisForClasses(): Promise<void> { await this.openSubSection('Asset Strategy Analysis for Classes'); }
	public async openAssetCloningTemplates(): Promise<void> { await this.openSubSection('Asset Cloning Templates'); }
	public async openRiskAndCriticalityAssessments(): Promise<void> { await this.openSubSection('Risk and Criticality Assessments'); }

	// --- Search / select (RCM / ASA / RCA share these) ---

	public async searchListAssessment(searchText: string): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await this.listFilterSearchInput.waitForDisplayed({ timeout: 60000 });
		await utils.setValueWithWait(this.listFilterSearchInput, searchText);
		await this.listGoButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.listGoButton);
		await utils.waitForBusyIndicatorToDisappear();
		console.log(`Searched list for: ${searchText}`);
	}

	public async selectFirstListAssessment(): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		const radio = await this.firstListAssessmentRadio;
		await radio.waitForExist({ timeout: 60000 });
		await radio.scrollIntoView();
		await this.clickWithJsFallback(radio);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Selected first assessment radio from results');
	}

	// --- ASD search / select ---

	public async searchAssessment(searchText: string): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await this.searchInput.waitForDisplayed({ timeout: 60000 });
		await utils.setValueWithWait(this.searchInput, searchText);
		await browser.keys('Enter');
		await utils.waitForBusyIndicatorToDisappear();
		console.log(`Searched assessment for: ${searchText}`);
	}

	public async selectFirstSearchedAssessment(): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await this.firstAssessmentRadio.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.firstAssessmentRadio);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Selected first searched assessment');
	}

	// --- Asset Cloning Templates: Create New Tasks dialog actions ---

	public async clickAddCloningTemplateButton(): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await this.cloningTemplatesAddButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.cloningTemplatesAddButton);
		await this.createTaskDialog.waitForDisplayed({ timeout: 60000 });
		console.log('Clicked + (Add) — Create New Tasks dialog opened');
	}

	public async fillCreateTaskShortDescription(shortDescription: string): Promise<void> {
		await this.createTaskDialog.waitForDisplayed({ timeout: 60000 });
		await this.createTaskShortDescriptionInput.waitForDisplayed({ timeout: 60000 });
		await utils.setValueWithWait(this.createTaskShortDescriptionInput, shortDescription);
		const actual = await utils.getValueWithWait(this.createTaskShortDescriptionInput);
		await expect(actual.trim()).toEqual(shortDescription.trim());
		console.log(`Filled Create Task Short Description: ${shortDescription}`);
	}

	public async selectObjectTypeFirstOption(): Promise<void> {
		await this.createTaskObjectTypeArrow.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.createTaskObjectTypeArrow);
		await this.openComboboxFirstOption.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.openComboboxFirstOption);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Selected first option from Object Type dropdown');
	}

	public async selectAssessmentTemplateByName(templateName: string): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await this.createTaskAssessmentTemplateValueHelp.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.createTaskAssessmentTemplateValueHelp);
		await this.assessmentTemplateValueHelpDialog.waitForDisplayed({ timeout: 60000 });
		const row = await this.assessmentTemplateRowByName(templateName);
		await row.waitForExist({ timeout: 60000 });
		await row.scrollIntoView();
		const checkbox = await this.assessmentTemplateRowCheckboxByName(templateName);
		await checkbox.waitForExist({ timeout: 60000 });
		await this.clickWithJsFallback(checkbox);
		await this.assessmentTemplateSaveButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.assessmentTemplateSaveButton);
		await utils.waitForBusyIndicatorToDisappear();
		console.log(`Selected Assessment Template from value help: ${templateName}`);
	}

	public async selectRelevantForOption(optionText: string): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		const arrow = await this.createTaskRelevantForArrow;
		await arrow.waitForExist({ timeout: 60000 });
		await arrow.scrollIntoView();
		await this.clickWithJsFallback(arrow);
		const option = await this.openComboboxOptionByText(optionText);
		await option.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(option);
		// Multi-combobox popover stays open after selection — JS-click the dialog title (inert)
		// to dismiss the popover without closing the Create New Tasks dialog.
		const dismissTarget = await this.createTaskDialogTitle;
		try {
			await browser.execute((el: HTMLElement) => el.click(), dismissTarget as unknown as HTMLElement);
		} catch { /* popover already gone */ }
		await utils.waitForBusyIndicatorToDisappear();
		console.log(`Selected Relevant For option: ${optionText}`);
	}

	public async submitCreateTaskClone(): Promise<void> {
		await this.createTaskCloneButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.createTaskCloneButton);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Submitted Create New Tasks clone');
	}

	public async acknowledgeCloningTemplateSuccessPopup(): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await this.successOkButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.successOkButton);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Acknowledged Create New Tasks success popup');
	}

	public async verifyAndOpenCloningTemplate(description: string): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		const row = await $(`(//tr[@role='row' and .//*[normalize-space()='${description}']])[1]`);
		await row.waitForExist({ timeout: 60000 });
		await row.scrollIntoView();
		const cell = await row.$(`.//*[normalize-space()='${description}']`);
		await expect(await cell.isExisting()).toBe(true);
		await this.clickWithJsFallback(cell);
		await utils.waitForBusyIndicatorToDisappear();
		console.log(`Verified and opened cloning template row: ${description}`);
	}
}

export default new AssetCloningSuiteListViewPage();
