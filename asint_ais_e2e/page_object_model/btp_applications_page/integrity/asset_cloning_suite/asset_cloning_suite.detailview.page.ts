import utils from '../../../../utils/utils';
import { browser, expect } from '@wdio/globals';

class AssetCloningSuiteDetailViewPage {

	// --- RCM clone dialog (no title, has <textarea>) ---
	private get rcmCloneDialog() { return $("//div[@role='dialog' and .//textarea and .//button[.//bdi[normalize-space()='Clone']]]"); }
	private get rcmCloneDescriptionTextArea() { return this.rcmCloneDialog.$(".//textarea[1]"); }
	private get rcmCloneSubmitButton() { return this.rcmCloneDialog.$(".//button[.//bdi[normalize-space()='Clone']]"); }
	private get rcmCloneOptionCheckbox() { return this.rcmCloneDialog.$(".//input[translate(@type,'checkbox','CHECKBOX')='CHECKBOX']/parent::div"); }
	private get rcmCloneOptionCheckboxInput() { return this.rcmCloneDialog.$(".//input[translate(@type,'checkbox','CHECKBOX')='CHECKBOX']"); }

	// --- ASD / RCA clone dialog (titled "Update Cloning Information") ---
	private get cloneDialog() { return $("//div[@role='dialog' and .//*[normalize-space()='Update Cloning Information']]"); }
	private get cloneDescriptionTextArea() { return this.cloneDialog.$(".//*[self::label or self::bdi or self::span][starts-with(normalize-space(), 'Description')]/following::textarea[1]"); }
	private get cloneSubmitButton() { return this.cloneDialog.$(".//button[.//bdi[normalize-space()='Clone']]"); }
	// RCA dialog reuses the same title but Description is an <input> (not textarea).
	private get rcaCloneDescriptionInput() { return this.cloneDialog.$(".//label[.//bdi[normalize-space()='Description']]/following::input[1]"); }
	private get rcaCloneSubmitButton() { return this.cloneDialog.$(".//button[.//bdi[normalize-space()='Clone']]"); }

	// --- Cloned-assessment detail page (shared across ASD/RCM/ASA/RCA) ---
	private clonedAssessmentTitleByText(expected: string) { return $(`//*[@role='heading' and normalize-space(@title)='${expected}']`); }
	private get deleteButton() { return $("//header[@role='banner']//button[.//bdi[normalize-space()='Delete']]"); }
	private get confirmYesButton() { return $("//button[@title='Yes' or normalize-space(.)='Yes' or .//bdi[normalize-space()='Yes'] or .//span[normalize-space()='Yes']]"); }
	private get successOkButton() { return $("//button[@title='OK' or normalize-space(.)='OK' or .//bdi[normalize-space()='OK'] or .//span[normalize-space()='OK']]"); }
	private get manageButton() { return $("//button[.//bdi[normalize-space()='Manage']]"); }
	private get manageDeleteMenuItem() { return $("//*[(@role='menuitem' or @role='menuitemcheckbox') and (.//bdi[normalize-space()='Delete'] or .//span[normalize-space()='Delete'] or normalize-space()='Delete')]"); }

	// --- ASD clone dialog ---

	public async updateCloneDescription(newDescription: string): Promise<void> {
		await this.cloneDialog.waitForDisplayed({ timeout: 60000 });
		await this.cloneDescriptionTextArea.waitForDisplayed({ timeout: 60000 });
		await utils.setValueWithWait(this.cloneDescriptionTextArea, newDescription);
		const actual = await utils.getValueWithWait(this.cloneDescriptionTextArea);
		await expect(actual.trim()).toEqual(newDescription.trim());
		console.log(`Updated clone description to: ${newDescription}`);
	}

	public async submitClone(): Promise<void> {
		await this.cloneSubmitButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.cloneSubmitButton);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Submitted clone');
	}

	// --- RCM clone dialog (also reused by ASA) ---

	public async updateRCMCloneDescription(newDescription: string): Promise<void> {
		await this.rcmCloneDialog.waitForDisplayed({ timeout: 60000 });
		await this.rcmCloneDescriptionTextArea.waitForDisplayed({ timeout: 60000 });
		await utils.setValueWithWait(this.rcmCloneDescriptionTextArea, newDescription);
		const actual = await utils.getValueWithWait(this.rcmCloneDescriptionTextArea);
		await expect(actual.trim()).toEqual(newDescription.trim());
		console.log(`Updated RCM clone description to: ${newDescription}`);
	}

	public async toggleRCMCloneOptionCheckbox(): Promise<void> {
		await this.rcmCloneDialog.waitForDisplayed({ timeout: 60000 });
		const wrapper = await this.rcmCloneOptionCheckbox;
		await wrapper.waitForExist({ timeout: 60000 });
		await wrapper.scrollIntoView();
		try {
			await wrapper.waitForClickable({ timeout: 10000 });
			await utils.clickWithWait(wrapper);
		} catch {
			const input = await this.rcmCloneOptionCheckboxInput;
			await browser.execute((el: HTMLElement) => el.click(), input as unknown as HTMLElement);
		}
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Toggled RCM clone dialog checkbox');
	}

	public async submitRCMClone(): Promise<void> {
		await this.rcmCloneSubmitButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.rcmCloneSubmitButton);
		await utils.waitForBusyIndicatorToDisappear();
		await this.successOkButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.successOkButton);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Submitted RCM clone and acknowledged confirmation popup');
	}

	// --- RCA clone dialog ---

	public async updateRCACloneDescription(newDescription: string): Promise<void> {
		await this.cloneDialog.waitForDisplayed({ timeout: 60000 });
		await this.rcaCloneDescriptionInput.waitForDisplayed({ timeout: 60000 });
		await utils.setValueWithWait(this.rcaCloneDescriptionInput, newDescription);
		const actual = await utils.getValueWithWait(this.rcaCloneDescriptionInput);
		await expect(actual.trim()).toEqual(newDescription.trim());
		console.log(`Updated RCA clone description to: ${newDescription}`);
	}

	public async submitRCAClone(): Promise<void> {
		await this.rcaCloneSubmitButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.rcaCloneSubmitButton);
		await utils.waitForBusyIndicatorToDisappear();
		await this.successOkButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.successOkButton);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Submitted RCA clone and acknowledged confirmation popup');
	}

	// --- Cloned-assessment detail page actions (shared) ---

	public async verifyClonedAssessmentTitle(expectedDescription: string): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		const expected = expectedDescription.trim();
		const headingEl = this.clonedAssessmentTitleByText(expected);
		await headingEl.waitForExist({
			timeout: 90000,
			timeoutMsg: `Cloned assessment header with title "${expected}" was not found`
		});
		const actualTitle = ((await headingEl.getAttribute('title')) || '').trim();
		console.log(`Cloned assessment header title: "${actualTitle}"`);
		await expect(actualTitle).toEqual(expected);
	}

	/** ASD detail page: header Delete button → Yes → OK. */
	public async deleteClonedAssessment(): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await this.deleteButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.deleteButton);

		await this.confirmYesButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.confirmYesButton);
		await utils.waitForBusyIndicatorToDisappear();

		await this.successOkButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.successOkButton);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Deleted cloned assessment and acknowledged success popup');
	}

	/** RCM/ASA/RCA detail page: Manage menu → Delete → two OK confirmations. */
	public async deleteClonedAssessmentViaManage(): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await this.manageButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.manageButton);
		await this.manageDeleteMenuItem.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.manageDeleteMenuItem);

		await this.successOkButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.successOkButton);
		await utils.waitForBusyIndicatorToDisappear();

		await this.successOkButton.waitForClickable({ timeout: 60000 });
		await utils.clickWithWait(this.successOkButton);
		await utils.waitForBusyIndicatorToDisappear();
		console.log('Deleted cloned assessment via Manage → Delete (two OK confirmations)');
	}
}

export default new AssetCloningSuiteDetailViewPage();
