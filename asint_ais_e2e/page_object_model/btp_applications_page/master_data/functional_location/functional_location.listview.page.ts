import { ChainablePromiseElement } from 'webdriverio';
import utils from '../../../../utils/utils';
import functionalLocationDetailView from './functional_location.detail.page';

class functionalLocationListView {

    private get functionalLocationApp() { return $("//a[contains(@aria-label, 'Functional Location')]"); }
    private get newFunctionalLocButton() { return $("//span[text()='Add']/ancestor::button"); }
    private get newFunctionalLocName() { return $("//bdi[text()='Functional Location Name']/ancestor::div[1]/following::input[1]"); }
    private get shortDescName() { return $("//bdi[text()='Short Description']/ancestor::div[1]/following::input[1]"); }
    private get selectFunLocTemp() { return $("//bdi[text()='Functional Location Template']/ancestor::div[1]/following::input[1]"); }
    private get selectParentAsset() { return $("//bdi[text()='Parent Asset']/ancestor::div[1]/following::input[1]"); }
    private get selectFuncLocBox() { return $("//span[text()='Select Functional Location']"); }
    private get selectParentFuncLoc() { return $("(//tr[@role='row'])[3]//td[2]//span"); }
    private get createFuncLocButton() { return $("//bdi[text()='Create']"); }
    private get succCrtMsg() { return $("//span[text()='Functional Location created successfully']"); }
    private get oKbtn() { return $("//bdi[text()='Ok']"); }
    private get oKbtn2() { return $("//bdi[text()='OK']"); }
    private get search() { return $("//input[@type='search' and not(@title) and not(@aria-haspopup) and not(@aria-labelledby)]"); }
    private funcLocSearched() { return $("(//tr[@role='row']//span[@title='Navigation'])[1]"); }
    private get funLocGeneralInfoTab() { return $("//bdi[text()='General Information']/ancestor::button"); }
    private get funLocIframe() { return $('iframe[data-help-id="application-functionallocation-manage"]'); }
    public functionalLocName!: string;
    public functionalLocDescName!: string;
    public parentFunctionalLoc: string = "FL0603";

    public async navigateToFunctionalLocation(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.functionalLocationApp);
        await utils.waitForBusyIndicatorToDisappear();
    }

    public async plusIconAndFuncLocSelect(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.newFunctionalLocButton);
    }

    public async funcLocSuccCreation(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await this.succCrtMsg.waitForDisplayed({ timeout: 100000 });
        console.log("Functional Location created successfully");
        await utils.clickWithWait($("//header[.//text()='Success']/following::button[.//text()='OK']"));
    }

    public async navigateFunctionalLocationListView(): Promise<void> {
        console.log("Navigating to Functional Location List View");
        await this.navigateToFunctionalLocation(); 
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.funLocIframe);
        await browser.pause(2000);
        console.log("Navigated to Functional Location List View");
    }

    public async createFunctionalLocation(assignCount: number = 0): Promise<void> {
        console.log("Creating of Functional Location started");
        await this.plusIconAndFuncLocSelect();
        await utils.waitForBusyIndicatorToDisappear();
        this.functionalLocName = await utils.generateRandomFuncName();
        await utils.setValueWithWait(this.newFunctionalLocName, this.functionalLocName);
        this.functionalLocDescName = await utils.generateRandomFuncDescName();
        await utils.setValueWithWait(this.shortDescName, this.functionalLocDescName);

        if (assignCount > 0) {
            await utils.clickWithWait(this.selectFunLocTemp);
            await browser.pause(5000);
            await utils.selectCheckboxes(assignCount);
            await utils.clickWithWait(this.oKbtn, 3000);
            await utils.waitForBusyIndicatorToDisappear();
        }
        await utils.clickWithWait(this.selectParentAsset);
        await this.selectFuncLocBox.waitForDisplayed({ timeout: 30000 });
        await browser.pause(20000);
        await utils.switchToIframe(this.funLocIframe);
        await utils.clickWithWait(this.selectParentFuncLoc);
        await browser.pause(8000);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.createFuncLocButton, 2000);
        await this.funcLocSuccCreation();
        console.log("Functional Location created");
    }

    public async navigateFunctionalLocation(): Promise<void> {

        // console.log("Searching for created Functional Location in the list view and navigating to detail view");
        // await utils.clickWithWait(this.search,1000);
        // await utils.setValueWithWait(this.search,this.functionalLocName,1000);
        // await utils.clickWithWait($('//bdi[text()="Go"]'),2000);
        // await browser.pause(2000);
        // console.log(`Searched for Functional Location with name: ${this.functionalLocName}`);

        console.log("Navigating to Detail view page of Functional Location");
        await utils.waitForBusyIndicatorToDisappear();
        const nav = this.funcLocSearched();
        await utils.clickWithWait(nav);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.funLocIframe);
        const el = await this.funLocGeneralInfoTab;
        await el.waitForExist({ timeout: 90000 });
        await browser.execute((element) => {element.scrollIntoView({ block: 'center' });}, el);
        await browser.pause(2000);
        await browser.execute((element) => {element.click();}, el);
        console.log("Navigated to Detail View page successfully");
    }

    async verifyDeletionOfFunctionalLocation() {
        console.log("Verifying deletion of Functional Location");

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
        console.log("Visible search box found, searching for deleted Functional Location");
        await browser.execute((el, value) => {
            const input = el as unknown as HTMLInputElement;
            input.value = value as string;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }, searchBox, functionalLocationDetailView.displayID);
        console.log(`Searched for Functional Location with Display ID: ${functionalLocationDetailView.displayID}`);
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

        console.log("Clicking Go button to search for Functional Location");
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

        console.log("Checking if Functional Location is present in the list after deletion");
        const isFuncLocPresent = await $(noDataCell).isExisting();

        if (!isFuncLocPresent) {
            throw new Error("Functional Location still exists after deletion");
        } else {
            console.log("Functional Location deletion verified successfully");
        }
    }
}
export default new functionalLocationListView();