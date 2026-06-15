import utils from "utils/utils";
class MSPListView {

    private get MSPApp() { return $("//a[contains(@aria-label, 'Maintenance Spend Planning')]"); }
    private get mspIframe() { return $('iframe[data-help-id="application-msp-manage"]'); }
    private get createBtn() { return $("//button//bdi[.//text()='Create']"); }
    private get createEventBtn() { return $("//button[@aria-label='Create']"); }
    private get openSelectRecommendation() { return $("//bdi[.='Select Recommendation']/following::span[5]"); }
    private get selectRecommendationPopup() { return $("//h1[.='Select Recommendation(s)']"); }
    private get firstRecommendationRow() { return $("(//tr[@role='row'])[2]"); }
    private get nextBtn() { return $("//button[.//text()='Next']"); }
    private get mspItemHeader() { return $("//h1[.='Create MSP']"); }
    private get shortDescInput() { return $("//bdi[.='Short Description']/following::input[1]"); }
    private get longDescInput() { return $("//bdi[.='Long Description']/following::textarea[1]"); }
    private get createMSPBtn() { return $("//footer//button[.//text()='Create']"); }
    private get createRecommendation() { return $("//section//li[.='Create Recommendation']//div//div"); }
    private get objectTypeDropdown() { return $("//bdi[.='Object Type']/following::span[2]"); }
    private get equipmentValueHelpBtn() { return $("//bdi[.='Equipment']/following::span[5]"); }
    private get equipmentPopupHeader() { return $("//header//span[contains(text(),'Equipment')]"); }
    private get equipmentSecondCheckbox() { return $("(//tr[@role='row'])[3]//td[@aria-colindex='1']"); }
    private get functionalLocationValueHelpBtn() { return $("//bdi[.='Functional Location']/following::span[5]"); }
    private get functionalLocationPopupHeader() { return $("//header//span[contains(text(),'Functional Location')]"); }
    private get functionalLocationSecondCheckbox() { return $("((//tr[@role='row'])[3]//td[@aria-colindex='1']//div)[1]"); }
    private get confirmBtn() { return $("//button[.//text()='Confirm']"); }
    private get typeDropdown() { return $("//bdi[.='Type']/following::span[2]"); }
    private get assessmentTypeDropdown() { return $("//bdi[.='Assessment Type']/following::span[2]"); }
    private get okBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get mspEventsTab() { return $("(//section//li[@role='option' and @aria-posinset='2'])[1]");}
    private get createMSPEventHeader(){return $("//header[.//text()='Create MSP Event']");}
    private get mspeShortDescInput(){return $("//label[.//text()='Short Description']/following::input[1]");}
    private get mspeStartDateInput(){return $("//label[.//text()='Start Date']/following::input[1]");}
    private get mspeEndDateInput(){return $("//label[.//text()='End Date']/following::input[1]");}
    private get mspeLongDescInput(){return $("//label[.//text()='Long Description']/following::textarea[1]");}
    private get createMSPEventBtn(){return $("//button//bdi[text()='Create']");}
    private get mspItemsValueBtn(){return $("//label[.//text()='MSP Items']/following::span[4]");}
    private get importMSPItemHeader(){return $("//header[.//text()='Import MSP Item']");}
    private get goBtn(){return $("(//button[.//text()='Go'])[1]");}
    private get secondMSPItemCheckbox(){return $("((//tr[@role='row'])[3]//td[@aria-colindex='1']//div)[1]");}
    private get importBtn(){return $("//footer//button[.//text()='Import']");}
    private get sectionMoreBtn() { return $("//section//button[@aria-label='Additional Options']//span[@role='presentation']"); }


    public MSPDisplayID!: string;
    public MSPShortDesc!: string;
    public MSPLongDesc!: string;
    public MSPEDisplayID!: string;
    public MSPEShortDesc!: string;
    public MSPELongDesc!: string;


    public async navigateToMSPListView(){
        console.log("Navigating to Maintenance spend planning - start");
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.MSPApp);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(10000);
        console.log("Navigating to Maintenance spend planning  - end");
    }

    private getRandomTxt(prefix:string){
        return `${prefix} ${Date.now()}`;
    }

    public async createMSPItems(){
        console.log("Creating MSP Items....");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(4000);
        if(await this.sectionMoreBtn.isExisting()){
            await this.sectionMoreBtn.waitForDisplayed({timeout:10000});
            await this.sectionMoreBtn.scrollIntoView();
            await this.sectionMoreBtn.waitForClickable({timeout:10000});
            await utils.clickWithWait(this.sectionMoreBtn);
            await browser.pause(1000);
        }
        await utils.clickWithWait(this.createBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.keys("Enter");
        const createMSPBox = await $("//header[.//text()='Create MSP']");
        await createMSPBox.waitForDisplayed();
        const dayOfMonth = new Date().getDate();
        if (dayOfMonth % 2 === 0) {
            console.log("Selecting recommendation...");
            await browser.pause(4000);
            await utils.clickWithWait(this.openSelectRecommendation);
            await this.selectRecommendationPopup.waitForDisplayed();
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(4000);
            await utils.clickWithWait(this.firstRecommendationRow);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
            await utils.clickWithWait(this.nextBtn);
            await this.mspItemHeader.waitForDisplayed({timeout:10000});
            this.MSPShortDesc = `${this.getRandomTxt("Automation MSP item ")} ${Math.floor(Math.random()*100000)}`;
            this.MSPLongDesc = `${this.getRandomTxt("Automation MSP item long desc")} ${Math.floor(Math.random()*100000)}`;
            await this.shortDescInput.setValue(this.MSPShortDesc);
            await this.longDescInput.setValue(this.MSPLongDesc);
        } 
        else{
            console.log("Creating recommendation...");
            await browser.pause(4000);
            await utils.clickWithWait(this.createRecommendation);
            await browser.pause(2000);
            const currentDay = new Date().getDay(); 
            if ([1, 2, 3, 4].includes(currentDay)) {
                await utils.clickWithWait(this.objectTypeDropdown);
                await browser.keys(["ArrowDown", "Enter"]);
                await utils.clickWithWait(this.equipmentValueHelpBtn);
                await utils.waitForBusyIndicatorToDisappear();
                await browser.pause(2000);
                await this.equipmentPopupHeader.waitForDisplayed();
                await utils.clickWithWait(this.equipmentSecondCheckbox);
                await utils.clickWithWait(this.confirmBtn);
                await utils.waitForBusyIndicatorToDisappear();
                await browser.pause(2000);
            } else {
                await utils.clickWithWait(this.objectTypeDropdown);
                await browser.keys(["ArrowDown", "ArrowDown", "Enter"]);
                await utils.clickWithWait(this.functionalLocationValueHelpBtn);
                await this.functionalLocationPopupHeader.waitForDisplayed();
                await browser.pause(10000);
                await utils.clickWithWait(this.functionalLocationSecondCheckbox);
                await utils.clickWithWait(this.confirmBtn);
            }
            await utils.waitForBusyIndicatorToDisappear();
            this.MSPShortDesc = `Automation MSP ${Date.now()}`;
            this.MSPLongDesc = `Automation MSP Long Desc ${Date.now()}`;
            await this.shortDescInput.setValue(this.MSPShortDesc);
            await this.longDescInput.setValue(this.MSPLongDesc);
            await utils.clickWithWait(this.typeDropdown);
            await browser.keys(["ArrowDown", "Enter"]);
            await utils.clickWithWait(this.assessmentTypeDropdown);
            await browser.keys(["ArrowDown", "ArrowDown", "Enter"]);
            await utils.clickWithWait(this.nextBtn);
        }
        await browser.pause(2000);
        await utils.clickWithWait(this.createMSPBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(4000);
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await this.searchNewlyCreated(this.MSPShortDesc);
        console.log("Created MSP Items");
        console.log("Navigating to detail view page of newly created MSP item....");
        const el = await $('(//tr[@role="row"]//span[@title="Navigation"])[1]');
        await utils.clickWithWait(el);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(10000);
        console.log("Navigated to detail view page of newly created MSP item");
    }

    public async searchNewlyCreated(shortDesc:string)
    {
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
                    return true; 
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
        }, searchBox, shortDesc);
        console.log(`Searched for MSP with short desc: ${shortDesc}`);
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

        console.log("Clicking Go button to search for MSP");
        await goBtn.waitForDisplayed({ timeout: 10000 });
        await goBtn.waitForClickable({ timeout: 10000 });
        await goBtn.click();
        await browser.pause(5000);
    }

    public async createMSPEvent()
    {
        console.log("Navigating to MSP Event section...");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.mspEventsTab);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.createEventBtn);
        await this.createMSPEventHeader.waitForDisplayed();
        this.MSPEShortDesc=`Automation MSP Event ${Date.now()}`;
        this.MSPELongDesc=`Automation MSP Event Long Desc ${Date.now()}`;
        await this.mspeShortDescInput.setValue(this.MSPEShortDesc);
        await this.mspeStartDateInput.setValue(utils.formatDate(0));
        await this.mspeEndDateInput.setValue(utils.formatDatePlus(10));
        await this.mspeLongDescInput.setValue(this.MSPELongDesc);
        await utils.clickWithWait(this.mspItemsValueBtn);
        await this.importMSPItemHeader.waitForDisplayed();
        await utils.clickWithWait(this.goBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.secondMSPItemCheckbox);
        await utils.clickWithWait(this.importBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.createMSPEventBtn);
        await browser.pause(2000);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await this.searchNewlyCreated(this.MSPEShortDesc);
        console.log("Created MSP Event");
        console.log("Navigating to detail view page of newly created MSP Event....");
        const el = await $('(//tr[@role="row"]//span[@title="Navigation"])[21]');
        await utils.clickWithWait(el);
        await browser.pause(10000);
        console.log("Navigated to detail view page of newly created MSP Event");
    }
}
export default new MSPListView();