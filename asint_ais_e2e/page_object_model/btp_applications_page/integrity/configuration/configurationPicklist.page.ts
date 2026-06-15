import { $, browser } from '@wdio/globals';
import * as path from 'path';
import SapUtils from '../../../../utils/utils';

export const PICKLIST_02_UPLOAD_FILE = path.join(
    process.cwd(),
    'test_data/btp_applications/configuration_data/picklist_02_data.xlsx'
);

class ConfigurationAppPage {

    /* ========================
       SELECTORS
    ======================== */
 
    private get header() { return $('//h1[contains(text(),"Configuration")]'); }
    private get picklistTile() { return $('//div[@role="button"][.//span[normalize-space()="Picklist"]]'); }
    private get iFrame() { return $('iframe[title="Application"]'); }
    private get createButton() { return $('button[aria-label="Create"]'); }
    private get picklistInput() { return $('input[aria-required="true"]'); }
    private get saveButton() { return $('//button[.//bdi[text()="Save"]]'); }
    private get createdPicklist() { return $('//span[normalize-space()="AutomationTestSample"]'); }
    private get addButton() { return $('//button[.//bdi[normalize-space()="Add"]]'); }
    private get columnNameInput() { return $('input.sapMInputBaseInner[aria-required="true"]'); }
    private get codeListDropdown() { return $('#idAsintRBICodeList-arrow'); }
    private get injectionMonitoringOption() { return $('//span[normalize-space()="Injection Monitoring"]'); }
    private get publishButton() { return $('//button[.//bdi[normalize-space()="Publish"]]'); }
    private get deleteColumnButton() { return $('//button[@aria-label="Delete Column"]'); }
    private get confirmYesButton() { return $('//button[.//bdi[normalize-space()="Yes"]]'); }
    private get selectCheckbox() { return $('//div[contains(@id,"selectMulti-CbBg")]'); }
    private get deletePicklistButton() { return $('//button[.//span[@data-sap-ui-icon-content=""] and not(@disabled)]'); }
    private get okButton() { return $('//div[contains(@class,"sapMDialog")]//button[.//bdi[text()="OK"]]');}
    private get exitButton() { return $('//button[@aria-label="Close column"]'); }
    private get downloadTemplateButton() { return $('//button[.//bdi[normalize-space()="Download Template"]]'); }
    private get uploadDataButton() { return $('//bdi[text()="Upload Data"]/ancestor::button'); }
    private get fileInput() { return $('input[type="file"]'); }
    private get uploadFileButton() { return $('//bdi[text()="Upload File"]/ancestor::button'); }
    private get uploadOkButton() { return $('//bdi[text()="OK"]/ancestor::button'); }
    private get yesButton() { return $('//bdi[text()="Yes"]/ancestor::button'); }
    private get downloadDataButton() {  return $('//bdi[text()="Download Data"]/ancestor::button'); }
    private get editDescriptionButton() { return $('//button[@title="Edit Description"]'); }
    private get editDescriptionInput() { return $('//*[@role="dialog"]//input[@aria-required="true"]'); }
    private get cancelButton() { return $('//button[.//bdi[normalize-space()="Cancel"]]'); }
    private get picklistHeaderTitle() { return $('//button[@title="Edit Description"]/preceding::div[@role="heading" and @aria-level="2"][1]/span[@dir="auto"]'); }
    private get newRevisionButton() { return $('//button[@title="New Revision"]'); }
    private get picklistSearchInput() { return $('//input[@type="search" and @aria-label="Search"]'); }

    /* ========================
       ACTIONS
    ======================== */

    async navigateToPicklist(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.switchToIframe(this.iFrame);
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.picklistTile);
        console.log('[ACTION] Picklist tile clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async isAppLoaded(): Promise<boolean> {
        try {
            const hd = await this.header;
            await hd.waitForDisplayed({ timeout: 20000 });
            return true;
        } catch {
            return false;
        }
    }

    async clickCreateButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.createButton);
        console.log('Create (+) button clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async createPicklist(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        
        await SapUtils.setValueWithWait(this.picklistInput, 'AutomationTestSample');
        console.log('[ACTION] Picklist name entered');
        
        await SapUtils.clickWithWait(this.saveButton);
        console.log('[ACTION] Save button clicked');
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async openCreatedPicklist(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        
        await SapUtils.clickWithWait(this.createdPicklist);
        console.log('[ACTION] Created Picklist opened');
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async clickAddButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        
        await SapUtils.clickWithWait(this.addButton);
        console.log('[ACTION] Add button clicked');
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async fillPicklistDetails1(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.setValueWithWait(this.columnNameInput, 'column1');
        await SapUtils.clickWithWait(this.codeListDropdown);
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async fillPicklistDetailss1(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.setValueWithWait(this.columnNameInput, 'column2');
        await SapUtils.clickWithWait(this.codeListDropdown);
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async fillPicklistDetails(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.setValueWithWait(this.columnNameInput, 'coatingCondition');
        await SapUtils.clickWithWait(this.codeListDropdown);
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async fillPicklistDetailss(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.setValueWithWait(this.columnNameInput, 'factor');
        await SapUtils.clickWithWait(this.codeListDropdown);
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async selectInjectionMonitoring(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.injectionMonitoringOption);
        console.log('[ACTION] Injection Monitoring selected');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async clickPublishButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.publishButton);
        console.log('[ACTION] Publish button clicked');
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async deleteColumn(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.deleteColumnButton);
        console.log('[ACTION] Delete column clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async confirmDeleteYes(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.confirmYesButton);
        console.log('[ACTION] Delete confirmed with YES');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    public async clickYesOnPublishPopup(timeoutInSeconds = 30): Promise<void> {
        await SapUtils.clickWithWait(this.confirmYesButton, 0, timeoutInSeconds * 1000);
    }

    public async clickYesButton(): Promise<void> {
        await SapUtils.clickWithWait(this.confirmYesButton, 0, 10000);
    }

    async deleteCreatedPicklist(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.selectCheckbox);
        console.log('[ACTION] Picklist checkbox selected');

        await SapUtils.clickWithWait(this.deletePicklistButton);
        console.log('[ACTION] Delete button clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async clickOkButton(): Promise<void> {
        await SapUtils.clickWithWait(this.okButton, 0, 20000);
        console.log('[ACTION] OK button clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async clickExitButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.exitButton);
        console.log('[ACTION] Exit button clicked');
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async clickDownloadTemplate(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        
        await SapUtils.clickWithWait(this.downloadTemplateButton);
        console.log('[ACTION] Download Template button clicked');
        
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async uploadDataFile(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.uploadDataButton);
        console.log('[ACTION] Upload Data button clicked');

        const remoteFilePath = await browser.uploadFile(PICKLIST_02_UPLOAD_FILE);

        const input = await this.fileInput;
        await input.setValue(remoteFilePath);
        console.log('[ACTION] File attached');

        await SapUtils.clickWithWait(this.uploadFileButton);
        console.log('[ACTION] Upload File button clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async clickUploadOkButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.uploadOkButton);
        console.log('[ACTION] OK button clicked after upload');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }
    
    async clickYesButtons(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.yesButton);
        console.log('[ACTION] Yes button clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async clickDownloadDataButton() {
        await SapUtils.clickWithWait(this.downloadDataButton, 0, 20000);
    }

    async clickEditDescription(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.editDescriptionButton);
        console.log('[ACTION] Edit Description button clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async editPicklistName(newName: string): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.setValueWithWait(this.editDescriptionInput, newName);
        console.log(`[ACTION] Picklist name updated to: ${newName}`);

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async clickSaveButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.saveButton);
        console.log('[ACTION] Save button clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async clickCancelButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.cancelButton);
        console.log('[ACTION] Cancel button clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async getPicklistHeaderText(): Promise<string> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        const el = await this.picklistHeaderTitle;
        await el.waitForDisplayed({ timeout: 20000 });
        const text = (await el.getText()).trim();
        console.log(`[ACTION] Picklist header text read: "${text}"`);
        return text;
    }

    async clickNewRevisionButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.newRevisionButton);
        console.log('[ACTION] New Revision button clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async searchForPicklist(name: string): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.setValueWithWait(this.picklistSearchInput, name);
        console.log(`[ACTION] Searched for picklist: "${name}"`);

        await SapUtils.waitForBusyIndicatorToDisappear();
    }
}

export default new ConfigurationAppPage();