import { $ } from '@wdio/globals';
import utils from '../../../../utils/utils';
import { MaintenanceOrdersData } from '../../../../test_data/btp_applications/maintenance_orders.data';

class MaintenanceOrdersDetailPage {

    private get maintenanceOrdersApp() { return $("//a[contains(@aria-label,'Maintenance Orders')]"); }
    private get MaintenanceOrdersIframe() { return $('iframe[data-help-id="application-workorders-manage"]'); }
    private get workCenter() { return $("(//bdi[normalize-space()='Main Work Center']/ancestor::span/following::span)[2]"); }
    private get activityType() { return $("(//bdi[normalize-space()='Activity Type']/ancestor::span/following::span)[2]"); }
    private get planningPlant() { return $("(//bdi[normalize-space()='Planning Plant']/ancestor::span/following::span)[2]"); }
    private get equipment() { return $("(//bdi[normalize-space()='Equipment']/ancestor::span/following::span)[2]"); }
    private get ObjectListTab() { return $("//button[.//bdi[text()='Object List']]"); }
    private get equipment2() { return $("//h2[contains(.,'Object List')]/following::a[normalize-space()][1]"); }


    async isPageLoaded() {
        await utils.switchToIframe(this.MaintenanceOrdersIframe);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForSAPPopupAndClose();
        return await this.MaintenanceOrdersIframe.isDisplayed();
    }

    public async navigateToMaintenancePlanView(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.maintenanceOrdersApp);
        await utils.waitForBusyIndicatorToDisappear();
    }

    public async navigateToRecommendationWorkbenchView(): Promise<void> {
        console.log("Navigating to Maintenance Order Details Page");
        await this.navigateToMaintenancePlanView();
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.MaintenanceOrdersIframe);
        console.log("Navigated to Maintenance Order Details Page");
    }

    public async verifyMaintenanceOrderData(): Promise<boolean> {

        await utils.switchToIframe(this.MaintenanceOrdersIframe);
        await utils.waitForBusyIndicatorToDisappear();

        const actualData = {
            expectedWorkCenter: (await this.workCenter.getText()).trim(),
            expectedActivityType: (await this.activityType.getText()).trim(),
            expectedPlanningPlant: (await this.planningPlant.getText()).trim(),
            expectedEquipment: (await this.equipment.getText()).trim()
        };

        console.log("===== Maintenance Order Details =====");
        console.table(actualData);

        expect(actualData.expectedActivityType)
            .toContain(MaintenanceOrdersData.MaintenanceActivityType);

        expect(actualData.expectedWorkCenter)
            .toEqual(MaintenanceOrdersData.expectedWorkCenter);

        expect(actualData.expectedPlanningPlant)
            .toEqual(MaintenanceOrdersData.expectedPlanningPlant);

        expect(actualData.expectedEquipment)            
            .toEqual(MaintenanceOrdersData.equipment);

        console.log("Maintenance Order Data Validation Passed");
        return true;   
    }

    async ObjectListViewTab() {
        await utils.clickWithWait(this.ObjectListTab);
        await utils.waitForBusyIndicatorToDisappear();
        const equipmentText = await this.equipment2.getText();
        console.log(`Equipment in Object List: ${equipmentText}`);

        expect(equipmentText.trim())
            .toEqual(MaintenanceOrdersData.equipment);
        console.log("Object List Tab Validation Passed");
    }
}

export default new MaintenanceOrdersDetailPage();