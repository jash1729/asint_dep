import utils from '../../../../utils/utils';
import assetRcmData from "../../../../test_data/btp_applications/reliability/asset_rcm.data";
import { browser } from '@wdio/globals';
class assetRCMListView {

    private get assetRCMApp() { return $("//a[contains(@aria-label, 'Asset RCM Analysis')]"); }
    private get rcmIframe() { return $('iframe[data-help-id="application-rcm-manage"]'); }
    private get createBtn() { return $("//button[@title='Create']"); }
    private get descInput() { return $("//label[.//bdi[.='Description']]/following::textarea[1]"); }
    public get templateDropdown(){ return $("//label[.//bdi[.='Select Template']]/following::span[@role='button'][1]"); }
    public get templateFirstOption(){ return $("//ul[@role='listbox']/li[@role='option'][1]"); }
    private get createAsBaselineCheckbox() { return $("//bdi[.='Create as baseline']/ancestor::div[@role='checkbox']/div[1]"); }
    private get longDescriptionTxtArea() { return $("//bdi[text()='Long Description']/ancestor::div[1]/following::textarea[1]"); }
    private get saveBtn() { return $("//button[.//bdi[text()='Save']]"); }
    private get okBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get infoTab() { return $("//bdi[text()='Information']"); }
    public assetRCMDisplayID!: string;
    public assetRCMDesc!: string;

    public async navigateToAssetRCM(){
        console.log("Navigating to Asset RCM - start");
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.assetRCMApp);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Navigating to Asset RCM - end");
    }

    public async createAssetRCM(){
        console.log("Creating Asset RCM - start");
        await utils.switchToIframe(this.rcmIframe);
        await utils.clickWithWait(this.createBtn);
        await utils.waitForBusyIndicatorToDisappear();
        this.assetRCMDesc = `Automation_RCM_${Date.now()}`;
        console.log(`Generated RCM Description: ${this.assetRCMDesc}`);
        await utils.setValueWithWait(this.descInput, this.assetRCMDesc);
        await this.templateDropdown.click();
        await browser.waitUntil(async()=> await this.templateFirstOption.isDisplayed(),{timeout:20000});
        await this.templateFirstOption.click();
        await this.longDescriptionTxtArea.setValue(assetRcmData.description);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.okBtn);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Creating Asset RCM is done");
        console.log("Navigating to detail page of RCM...");
        await this.infoTab.waitForEnabled({timeout:100000});
        console.log("Navigated to detail view page of new ly created RCM");
        await this.fetchRCMDisplayID();
        await this.verifyHeader();
        console.log("Header verification done");
        console.log("Capturing all header values");
        await utils.captureHeaderDetails();

        // const el = await $('(//tr[@role="row"]//span[@title="Navigation"])[1]');
        // await utils.clickWithWait(el);
        // await browser.pause(10000);

    }

    public async verifyHeader()
    {
        console.log("Verifying RCM detail page header");
        const headers = await $$("//div[@role='heading' and @title]//span");
        const headerTexts: string[] = [];
        for (const h of headers) {
            if (await h.isDisplayed()) headerTexts.push((await h.getText()).trim());
        }
        console.log("Captured headers:", headerTexts);
        console.log("Verifying Description value with header text");
        await expect(this.assetRCMDesc).toEqual(headerTexts[0]);
        console.log("Description verification completed");
    }

    public async fetchRCMDisplayID() {
        console.log("Start: fetching RCM Display ID");
        const xpath = `//header[.//span[normalize-space()='${this.assetRCMDesc}']]//*[starts-with(normalize-space(),'RCM_')]`;
        await browser.waitUntil(async () => await (await $$(xpath)).length > 0, {
            timeout: 20000,
            timeoutMsg: "RCM Display ID not found"
        });
        const els = await $$(xpath);
        for (const el of els) {
            if (await el.isDisplayed() && await el.isEnabled()) {
                this.assetRCMDisplayID = await el.getText();
                break;
            }
        }
        console.log("End: fetched RCM Display ID -> " + this.assetRCMDisplayID);
    }

    public async verifyRCMDeletion()
    {
        console.log("Verifying deletion of RCM");

        await utils.waitForBusyIndicatorToDisappear();
        await browser.waitUntil(
            async () => (await browser.execute(() => document.readyState)) === "complete",
            { timeout: 20000 }
        );

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
            throw new Error("Visible search box not found");
        }
        console.log("Visible search box found, searching for deleted RCM");
        await browser.execute((el, value) => {const input = el as unknown as HTMLInputElement;
            input.value = value as string;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }, searchBox, this.assetRCMDisplayID);
        console.log(`Searched for Functional Location with Display ID: ${this.assetRCMDisplayID}`);
        const getVisibleGo = async () => {
            const buttons = await $$("//bdi[text()='Go']");
            for (const btn of buttons) {
                if (await btn.isDisplayed()) {
                    return btn;
                }
            }
            return null;
        };

        let goBtn: any;
        await browser.waitUntil(async () => {
            goBtn = await getVisibleGo();   // should return Element | null
            return goBtn !== null;
        }, {
            timeout: 20000,
            interval: 500,
            timeoutMsg: "Go button not found"
        });
        if (!goBtn) {
            throw new Error("Go button not found");
        }

        console.log("Clicking Go button to search for RCM");
        await goBtn.waitForDisplayed({ timeout: 10000 });
        await goBtn.waitForClickable({ timeout: 10000 });
        await goBtn.click();
        await browser.pause(5000);

        console.log("Waiting for table to refresh after search...");
        const noDataCell = '//td[text()="No data"]';
        const tableRows = '//table//tr[contains(@class,"sapMListTblRow")]';

        await browser.waitUntil(async () => {
            const noDataExists = await $(noDataCell).isExisting();
            const rowsExist = await $$(tableRows).length > 0;
            return noDataExists || rowsExist;
        }, {
            timeout: 20000,
            interval: 500,
            timeoutMsg: "Search results never loaded"
        });

        console.log("Checking if RCM is present in the list after deletion");
        const isFuncLocPresent = await $(noDataCell).isExisting();

        if (!isFuncLocPresent) {
            throw new Error("RCM still exists after deletion");
        } else {
            console.log("RCM deletion verified successfully");
        }
    }
}
export default new assetRCMListView();