import { $ } from '@wdio/globals';
import utils from '../../../../utils/utils';
import { MaintenanceOrdersData } from '../../../../test_data/btp_applications/maintenance_orders.data.ts';

class maintenanceOrdersListviewPage {

    private get RecpomendationWorkbenchPageTitle() { return $("//span[normalize-space()='Recommendation Workbench+']"); }
    private get RecomendationWorkbenchApp() { return $("//a[contains(@aria-label, 'Recommendation Workbench+')]"); }
    private get RecommendationWorkbenchIframe() { return $('iframe[data-help-id="application-recommendationworkbenchplus-manage"]'); }
    get createDropdownButton() { return $('//button[.//bdi[text()="Create"]]'); }
    get searchBox() { return $('(//input[@type="search" and @placeholder="Search"])[1]'); }
    get goButton() { return $('//button//*[text()="Go"]'); }
    get recommendationCheckbox() { return $('(//div[@role="checkbox"])[2]'); }
    private get referenceTechnicalObjectInput() { return $("//bdi[text()='Reference Technical Object']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
    private get technicalObjectSelection() { return $('(//div[@role="radio"])[1]'); }
    private get saveButton() { return $('//bdi[normalize-space()="Save"]'); }
    private get objectListTechnicalObjectsInput() { return $("//bdi[text()='Object List Technical Objects']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
    private get objectListTechnicalObjectsCheckbox() { return $('(//div[@role="checkbox"])[2]'); }
    private get shortDescriptionInput() { return $("//bdi[normalize-space()='Short Description']/ancestor::label/following::input[1]"); }
    private get longDescriptionInput() { return $("//bdi[normalize-space()='Long Description']/ancestor::label/following::textarea[1]"); }
    private get maintenanceOrderTypeDropdown() { return $("//bdi[text()='Maintenance Order Type']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
    private get maintenanceOrderTypeOption() { return $("//div[@role='dialog' and .//span[contains(text(),'Select Maintenance Order Type')]]//span[text()='PM01']/ancestor::tr//div[@role='radio']"); }
    private get priorityDropdown() { return $("//bdi[text()='Priority']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
    private get priorityOption() { return $("//div[@role='dialog' and .//span[contains(text(),'Select Priority')]]//span[text()='4']/ancestor::tr//div[@role='radio']"); }
    private get maintenanceActivityTypeDropdown() { return $("//bdi[normalize-space()='Maintenance Activity Type']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
    private get maintenanceActivityTypeOption() { return $('//div[@role="dialog" and .//*[contains(text(),"Select Activity")]]//span[normalize-space()="003"]/ancestor::tr//div[@role="radio"]'); }
    private get PlanningPlantDropdown() { return $("//bdi[normalize-space()='Planning Plant']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
    private get PlanningPlantOption() { return $("//div[@role='dialog' and .//*[normalize-space()='Select Planning Plant']]//tr[.//span[normalize-space()='1001']]//div[@role='radio']"); }
    private get maintenanceWorkCenterDropdown() { return $("//bdi[normalize-space()='Maintenance Work Center']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
    private get maintenanceWorkCenterOption() { return $("//div[@role='dialog' and .//*[contains(text(),'Select Work Center')]]//tr[.//span[normalize-space()='MMD02']]//div[@role='radio']"); }
    private get controlKeyInputDropdown() { return $("//bdi[normalize-space()='Control Key']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
    private get controlKeyInputOption() { return $("//div[@role='dialog' and .//span[contains(text(),'Select Control Key')]]//span[text()='PM01']/ancestor::tr//div[@role='radio']"); }
    private get operationsInput() { return $("//bdi[normalize-space()='Operations']/ancestor::label/following::input[1]"); }
    private get basicStartDateInput() { return $("//bdi[normalize-space()='Basic Start Date']/ancestor::label/following::input[1]"); }
    private get breakdownToggle() { return $('//bdi[normalize-space()="Breakdown"]/ancestor::label/following::div[@role="switch"][1]'); }
    private get ConfirmButton() { return $('//button[.//bdi[text()="Confirm"]]'); }
    private get okButton() { return $('//button[.//bdi[text()="OK"]]'); }
    private get recommendationWorkbenchMenuButton() { return $('//span[normalize-space()="Recommendation Workbench+"]/ancestor::div[@role="button"]');}
    private get homeMenuOption() { return $("//li[@role='menuitem' and .//span[normalize-space()='Home']]"); }
    private get maintenanceOrdersApp() { return $("//a[contains(@aria-label, 'Maintenance Orders')]"); }
    private get MaintenanceOrdersIframe() { return $('iframe[data-help-id="application-workorders-manage"]'); }
    private get firstMaintenanceOrderRow() { return $("(//table//tr[@role='row'])[2]"); }


    async isPageLoaded() {
        await utils.switchToIframe(this.RecommendationWorkbenchIframe);
        await utils.waitForBusyIndicatorToDisappear();
        await this.RecpomendationWorkbenchPageTitle.waitForDisplayed({ timeout: 20000 });
        await utils.waitForSAPPopupAndClose();
        return await this.RecpomendationWorkbenchPageTitle.isDisplayed();
    }
    
    public async navigateToRecommendationWorkbenchView(): Promise<void> {
        console.log("Navigating to Recommendation Workbench View");
        await this.navigateToMaintenancePlanView();
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.RecommendationWorkbenchIframe);
        await browser.pause(2000);
        console.log("Navigated to Recommendation Workbench View");
    }
    
    public async navigateToMaintenancePlanView(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.RecomendationWorkbenchApp);
        await utils.waitForBusyIndicatorToDisappear();
    }

    public async searchRecommendation(recommendationId: string = MaintenanceOrdersData.RecommendationId): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.setValueWithWait(this.searchBox, recommendationId);
        await utils.clickWithWait(this.goButton);
        await browser.pause(2000); 
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`Searched for Recommendation ID: ${recommendationId} successfully`);

        await this.recommendationCheckbox.waitForDisplayed({ timeout: 20000 });
        await browser.pause(4000);
        await utils.clickWithWait(this.recommendationCheckbox);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`Recommendation checkbox selected successfully`);
    }

    public async createButton(){
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.createDropdownButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Create button clicked successfully");
        await browser.keys("ArrowDown");
        await browser.keys("ArrowDown");
        await browser.keys("ArrowDown");
        await browser.keys("ArrowDown");
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        console.log("Maintenance Order creation option selected successfully");
    }

    public async fillCreateMaintenanceOrderForm() {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.referenceTechnicalObjectInput);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.technicalObjectSelection);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Reference Technical Object selected successfully");

        await utils.clickWithWait(this.objectListTechnicalObjectsInput);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.objectListTechnicalObjectsCheckbox);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Object List Technical Object selected successfully");

        await utils.setValueWithWait(this.shortDescriptionInput, MaintenanceOrdersData.shortDescriptionInput);
        await utils.setValueWithWait(this.longDescriptionInput, MaintenanceOrdersData.longDescriptionInput);
        console.log("Short and Long Description entered successfully");

        await utils.clickWithWait(this.maintenanceOrderTypeDropdown);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.maintenanceOrderTypeOption);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Maintenance Order Type selected successfully");

        await utils.clickWithWait(this.priorityDropdown);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.priorityOption);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Priority selected successfully");

        await utils.clickWithWait(this.maintenanceActivityTypeDropdown);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.maintenanceActivityTypeOption);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Maintenance Activity Type selected successfully");

        await utils.clickWithWait(this.PlanningPlantDropdown);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.PlanningPlantOption);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Planning Plant selected successfully");

        await utils.clickWithWait(this.maintenanceWorkCenterDropdown);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.maintenanceWorkCenterOption);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Maintenance Work Center selected successfully");

        await utils.clickWithWait(this.controlKeyInputDropdown);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.controlKeyInputOption);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Control Key selected successfully");

        await utils.setValueWithWait(this.operationsInput, MaintenanceOrdersData.operationsInput);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Operations entered successfully");

        await utils.clickWithWait(this.basicStartDateInput);

        const date = new Date();
        date.setDate(date.getDate() + 2);
        const formattedDate = date.toISOString().split('T')[0];
        await utils.setValueWithWait(this.basicStartDateInput, formattedDate);

        await utils.waitForBusyIndicatorToDisappear();
        console.log("Start Date entered successfully");

        await utils.clickWithWait(this.breakdownToggle);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Breakdown toggle switched on successfully");

        await utils.clickWithWait(this.ConfirmButton);
        await browser.pause(10000);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Maintenance Order creation confirmed successfully");
        await browser.switchToParentFrame();
    }

    public async navigateBackToMaintenanceOrdersListView(): Promise<void> {
        await browser.pause(2000);
        await this.recommendationWorkbenchMenuButton.waitForClickable({ timeout: 20000 });
        await utils.clickWithWait(this.recommendationWorkbenchMenuButton);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.homeMenuOption);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Navigated back to Home successfully");

        await browser.pause(2000);
        console.log("Maintenance Orders List view loaded successfully");
        await utils.clickWithWait(this.maintenanceOrdersApp);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Maintenance Orders App opened successfully");
        await this.MaintenanceOrdersIframe.waitForExist({ timeout: 20000 });
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Switched to Maintenance Orders Iframe successfully");

        await utils.switchToIframe(this.MaintenanceOrdersIframe);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Maintenance Orders List view loaded successfully");
    }

    public async clickMaintenanceOrder() {
        await utils.waitForBusyIndicatorToDisappear();
        await this.firstMaintenanceOrderRow.waitForDisplayed({ timeout: 20000 });
        await utils.clickWithWait(this.firstMaintenanceOrderRow);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("First Maintenance Order selected successfully");
    }
    
}

export default new maintenanceOrdersListviewPage();