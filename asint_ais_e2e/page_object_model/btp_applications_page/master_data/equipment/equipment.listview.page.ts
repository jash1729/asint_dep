import { promises } from "node:dns";
import utils from "utils/utils";
import { waitForDisplayed } from "webdriverio/build/commands/element";
import equipmentDetailPage from "./equipment.detail.page";

class EquipmentListviewPage {
    //equipment listview
    public get appIframe() { return $('iframe[data-help-id="application-equipment-manage"]'); }
    get firstEquipmentInList() { return $('//tbody[contains(@class,"sapMTableTBody")]//tr[@role="row"][1]'); }
    // buttons
    private get createEquipmentBtn() { return $('button .sapUiIcon[data-sap-ui-icon-content=""]'); }
    private get equipmentIcon() { return $('button[aria-label="New Equipment"]'); }
    private get confirmBtn() { return $('//bdi[text()="Confirm"]/ancestor::button'); }
    private get createBtn() { return $('//bdi[text()="Create"]/ancestor::button'); }
    private get okBtn() { return $('//bdi[text()="OK"]/ancestor::button'); }
    private get equipmentNameInput() { return $('//bdi[text()="Equipment Name"]/ancestor::label/following::input[1]'); }
    private get equipmentDescInput() { return $('//bdi[text()="Description"]/ancestor::label/following::input[1]'); }
    private get equipmentTemplateInput() { return $('//bdi[text()="Equipment Template"]/ancestor::label/following::input[1]'); }
    private get parentAssetInput() { return $('//bdi[text()="Parent Asset"]/ancestor::label/following::input[1]'); }
    private get equipmentIframe() { return $('iframe[data-help-id="application-equipment-manage"]'); }
    
    async verifyOnEquipmentPage(): Promise<boolean> {

        try {
            await this.equipmentIcon.waitForDisplayed({
                timeout: 50000,
                timeoutMsg: 'The Equipment icon did not display'
            });

            return true;

        } catch {
            return false;
        }
    }

    public createdEquipmentName!: string;

    async createEquipmentWithMandatoryFields(
        description: string,
        equipmentTemplate: string,
        parentAsset: string
    ): Promise<void> {
        this.createdEquipmentName = await utils.generateRandomEquipmentName();
        await utils.switchToIframe(this.equipmentIframe);;

        await this.createEquipmentBtn.waitForClickable({ timeout: 50000 });
        await this.createEquipmentBtn.click();
        await browser.pause(2000);
        await this.equipmentNameInput.waitForDisplayed({ timeout: 30000 });
        await this.equipmentNameInput.setValue(this.createdEquipmentName);
        await browser.pause(2000);
        await this.equipmentDescInput.waitForDisplayed({ timeout: 30000 });
        await this.equipmentDescInput.setValue(description);
        await browser.pause(2000);
        await this.equipmentTemplateInput.click();

        await browser.pause(2000);

        // dynamic selector inside method
        const compSearchBox = await $(`//div[@role="dialog"]//input[@placeholder="Search"]`);
        await utils.clickWithWait(compSearchBox);

        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');
        await compSearchBox.setValue(equipmentTemplate);
        await browser.keys("Enter");
        await browser.pause(3000);

        const template = await $(`//span[text()="${equipmentTemplate}"]/ancestor::tr//div[@role="checkbox"]`);
        const templateExists = await template.isExisting();
        if (!templateExists) {
            throw new Error(`No row found for equipment template: ${equipmentTemplate}`);
        }
        await template.waitForDisplayed({ timeout: 30000 });
        await template.waitForClickable({ timeout: 30000 });
        await template.click();

        await this.confirmBtn.click();

        await this.parentAssetInput.click();

        await browser.pause(2000);

        // dynamic selector inside method
        const parentEquipment = await $(`(//tr[@role="row"])[2]`);
        await parentEquipment.waitForDisplayed({ timeout: 30000 });
        await parentEquipment.click();

        await this.createBtn.waitForClickable({ timeout: 30000 });
        await this.createBtn.click();

        // await this.okBtn.waitForDisplayed({ timeout: 30000 });
        // await this.okBtn.click();
        const okBtn = await $("//header[.//text()='Success']/following::button[.//text()='OK']");
        await utils.clickWithWait(okBtn);

        await this.equipmentIcon.waitForClickable({ timeout: 30000 });
    }
    async clickOnEquipmentInList(name: string) { 
        await utils.switchToIframe(this.equipmentIframe);;
        const compSearchBox = await $('input[placeholder="Search"]');
        await compSearchBox.waitForDisplayed({ timeout: 20000 });
        await compSearchBox.click();

        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');
        await compSearchBox.setValue(name);
        await browser.keys("Enter");
        await browser.pause(3000);

        const equipment = await $(`//td[contains(@data-sap-ui-column,'name')]//span[normalize-space()="${name}"]`);
        await equipment.waitForDisplayed({ timeout: 50000 });
        await equipment.waitForClickable({ timeout: 50000 });
        return equipment.click();
    }
    
    async verifyDeletionOfEquipment() {
        console.log("Verifying deletion of Equipment");
 
        await utils.waitForBusyIndicatorToDisappear();
 
        // wait for page ready
        await browser.waitUntil(
            async () => (await browser.execute(() => document.readyState)) === "complete",
            { timeout: 20000 }
        );
 
        // 🔥 switch to correct iframe dynamically
        await browser.waitUntil(async () => {
        const frames = await $$("//iframe");
 
        for (const frame of frames) {
            try {
                await browser.switchFrame(frame);
 
                const search = await $("//input[@type='search']");
                if (await search.isExisting()) {
                    return true; // correct frame
                }
 
                await browser.switchFrame(null);
            } catch (e) {
                await browser.switchFrame(null);
            }
        }
        return false;
        }, { timeout: 30000 });
 
        // 🔥 get visible search box only
        const getVisibleSearch = async () => {
            const elements = await $$("//input[@type='search']");
            for (const el of elements) {
                if (await el.isDisplayed()) {
                    return el;
                }
            }
            return null;
        };
 
        let searchBox;
 
        await browser.waitUntil(async () => {
            searchBox = await getVisibleSearch();
            return searchBox !== null;
        }, { timeout: 30000 });
 
        if (!searchBox) {
            throw new Error("❌ Visible search box not found");
        }
        console.log("Visible search box found, searching for deleted Equipment");
        // 🔥 set value via JS (TS safe)
        await browser.execute((el, value) => {
            const input = el as unknown as HTMLInputElement;
            input.value = value as string;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }, searchBox, equipmentDetailPage.displayID);
        console.log(`Searched for Equipment with Display ID: ${equipmentDetailPage.displayID}`);
        // 🔥 click Go (visible one)
        const getVisibleGo = async () => {
            const buttons = await $$("//bdi[text()='Go']");
            for (const btn of buttons) {
                if (await btn.isDisplayed()) {
                    return btn;
                }
            }
            return null;
        };
 
        let goBtn;
 
        await browser.waitUntil(async () => {
            goBtn = await getVisibleGo();
            return goBtn !== null;
        }, { timeout: 20000 });
 
        if (!goBtn) {
            throw new Error("❌ Go button not found");
        }
        console.log("Clicking Go button to search for Equipment");
        await browser.execute(el => el.click(), goBtn);
 
        await browser.pause(8000);
        console.log("Checking if Equipment is present in the list after deletion");
        const isEquipmentPresent = await $('//td[text()="No data"]').isExisting();
 
        if (!isEquipmentPresent) {
            throw new Error("Equipment still exists after deletion");
        } else {
            console.log("Equipment deletion verified successfully");
        }
    }
    
}



export default new EquipmentListviewPage();