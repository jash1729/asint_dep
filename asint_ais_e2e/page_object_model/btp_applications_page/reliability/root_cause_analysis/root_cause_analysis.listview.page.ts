import { $ } from '@wdio/globals';
import utils from '../../../../utils/utils';

class RCAListviewPage {

    private get pageTitle() { return $('//h1[contains(text(),"Root Cause Analysis")]'); }
    private get RCAIframe() { return $('iframe[data-help-id="application-rootcauseanalysis-manage"]'); }
    private get addButton() { return $('//button[@title="Add"]'); }
    private get rootCauseAnalysisApp() { return $("//a[contains(@aria-label, 'Root Cause Analysis')]"); }
    private get shortDescName() { return $('//bdi[text()="Description"]/ancestor::label/following::textarea[1]'); }
    private get longDescriptionField() { return $('//bdi[text()="Long Description"]/ancestor::label/following::textarea[1]'); }
    private get failureTypeDropdown() { return $("//label[.//text()='Failure Type']/following::span[@role='button'][1]"); }
    private get failureTypeBox() { return $('//ul[@role="listbox"]'); }
    private get safetyOption() { return $("(//ul[@role='listbox']//li//div[@role='checkbox']//div)[2]");}    
    private get rcaMethodologyDropdown() { return $("//label[.//text()='RCA Methodology']/following::span[@role='button'][1]"); }
    private get whyWhyAnalysisOption() { return $("//ul[@role='listbox']//li[@role='option']//span[normalize-space()='Why-Why Analysis']");} 
    private get fishboneOption() { return $("//ul[@role='listbox']//li[@role='option']//span[normalize-space()='Fishbone Analysis']");}   
    private get createAssessmentButton() { return $("//header[.//text()='Create Assessment']/following::button[.//text()='Create']"); }
    private get okButton() { return $('//button[.//bdi[text()="OK"]]'); }

    async isPageLoaded() {
        await utils.switchToIframe(this.RCAIframe);
        await utils.waitForBusyIndicatorToDisappear();
        await this.pageTitle.waitForDisplayed({ timeout: 20000 });
        await utils.waitForSAPPopupAndClose();
        return await this.pageTitle.isDisplayed();
    }

    public async navigateRCAListView() {
        console.log("Navigating to Root Cause Analysis List View");
        await this.navigateToRCAListView(); 
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.RCAIframe);
        await browser.pause(2000);
        console.log("Navigated to Root Cause Analysis List View");
    }

     public async navigateToRCAListView(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.rootCauseAnalysisApp);
        await utils.waitForBusyIndicatorToDisappear();
    }


    async clickAddButton() {

        await utils.switchToIframe(this.RCAIframe);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addButton.waitForDisplayed({ timeout: 20000 });
        await utils.clickWithWait(this.addButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Add button clicked successfully");
    }

    async enterDescription() {

        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await this.shortDescName.waitForClickable({ timeout: 20000 });
        await this.shortDescName.click();
        await this.shortDescName.setValue("Testing");
        console.log("Description entered successfully");

    }

    async enterLongDescription() {

        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await this.longDescriptionField.waitForClickable({ timeout: 20000 });
        await this.longDescriptionField.setValue("Testing");
        console.log("Long Description entered successfully");

    }

    async selectFailureType() {

        await utils.switchToIframe(this.RCAIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.failureTypeDropdown);
        await browser.pause(5000);
        await this.failureTypeBox.waitForDisplayed({ timeout: 15000 });
        await utils.clickWithWait(this.safetyOption);
        await utils.clickWithWait(this.failureTypeDropdown);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Failure Type selected successfully");

    }

    async selectRCAMethodology() {

        await utils.switchToIframe(this.RCAIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.rcaMethodologyDropdown);
        await browser.pause(5000);
        await this.whyWhyAnalysisOption.waitForDisplayed({ timeout: 15000 });
        await utils.clickWithWait(this.whyWhyAnalysisOption);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("RCA Methodology selected successfully");
    }

    async selectRCAMeathodology2() {

        await utils.switchToIframe(this.RCAIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.rcaMethodologyDropdown);
        await browser.pause(5000);
        await this.fishboneOption.waitForDisplayed({ timeout: 15000 });
        await utils.clickWithWait(this.fishboneOption);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("RCA Methodology selected successfully");

    }

    async clickCreateAssessmentButton() {

        await browser.pause(1000);
        await this.createAssessmentButton.waitForClickable({ timeout: 2000 });
        await utils.clickWithWait(this.createAssessmentButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Create Assessment button clicked successfully");
    }

    async clickOKButton() {

        await browser.pause(1000);
        await this.okButton.waitForClickable({ timeout: 2000 });
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("OK button clicked successfully");
    }
}

export default new RCAListviewPage();