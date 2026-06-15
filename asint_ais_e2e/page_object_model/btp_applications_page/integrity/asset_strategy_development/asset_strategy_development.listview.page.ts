import utils from "utils/utils";  
class asset_strategy_development_listview_page {

    private get assetStrategyDevelopmentApp() { return $("//a[contains(@aria-label, 'Asset Strategy Development')]"); }
    private get ASDIframe() { return $('iframe[data-help-id="application-assetstrategydevelopment-manage"]'); }
    private get newASDButton() { return $("//span[text()='Add']/ancestor::button"); }
    private get singleOption() { return $("//ul//div[text()='Single']"); }
    private get multipleOption() { return $("//ul//div[text()='Multiple']"); }
    private get createASDHeader() { return $("//h1[.='Create Asset Strategy Development']"); }
    private get createMassRun() { return $("//h1[.='Create Mass Run']"); }
    private get descriptionInput() { return $("//bdi[.='Description']/ancestor::div[1]/following::input[1]"); }
    private get equipmentComponentInput() { return $("//bdi[.='Equipment/Component']/ancestor::div[1]/following::span[1]"); }
    private get selectEquipmentHeader() { return $("//h1[.='Select Equipment']"); }
    private get equipmentSearchInput() { return $("//h1[.='Select Equipment']/following::input[@type='search'][1]"); }
    private get assessmentTemplateInput() { return $("//bdi[.='Assessment Template']/ancestor::div[1]/following::input[1]"); }
    private equipmentRowOption(i: number) { return $(`(//tr[@role='row'])[${i}]//td[2]//span`); }
    private get longDescriptionInput() { return $("//bdi[.='Long Description']/ancestor::div[1]/following::textarea"); }
    private get nextBtn() { return $("//footer//button[.//text()='Next']"); }
    private get createButton() { return $("//h1[.='Create Asset Strategy Development']/following::button[.//text()='Create']"); }
    private get okBtn() { return $("//header[.//text()='Success']/following::button[.//text()='OK']"); }
    private get generalSelectionHeader() { return $("//h1[.='General Selection']"); }
    private get selectAllToggle() { return $("//span[.='Select All / Deselect All']/preceding-sibling::div/ancestor::div[1]"); }
    private get saveButton() { return $("//button[.//bdi[.='Save']]"); }
    private get cancelBtn() { return $("//button[.//bdi[.='Cancel']]"); }
    private get analysisDetailButton() { return $("//button[.//bdi[.='Analysis Detail']]"); }
    private get selectMultiFunLoc() { return $("//div[@role='toolbar']//button[.//text()='Add All']"); }
    private get calculateMassRunBtn() { return $("//button[.//text()='Calculate Mass Run']")}
    private get cmlTab() { return $("//bdi[text()='CML']"); }
    private get selectedCheckboxTexts() { return $$("//li[@role='treeitem']//div[@role='checkbox']/following::div[1]"); }
    
    public selectedItemsGlobal:any = {};
    public assetASDDisplayID!: string;
    public assetASDDesc!: string;
    public assetASDFunLoc!: string;
    public assessmentTemplateName!: string;
    public selectedFuncLocsGlobal: string[] = [];
    public generalSelectionData: boolean = true;
    public singleCreate: boolean = true;

    public async navigateToASDListView() {
        console.log("Navigating to Asset Strategy Development List View");
        await this.navigateToASD(); 
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.ASDIframe);
        await browser.pause(2000);
        console.log("Navigated to Asset Strategy Development List View");

        // const el = await $('(//tr[@role="row"]//span[@title="Navigation"])[1]');
        // await utils.clickWithWait(el);
        // await browser.pause(10000);
    }

    public async navigateToASD(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.assetStrategyDevelopmentApp);
        await utils.waitForBusyIndicatorToDisappear();
    }

    public async createASDForSingleEquipment() {
        this.singleCreate = true;
        console.log("Starting creation of Asset Strategy Development for single equipment");   
        await utils.clickWithWait(this.newASDButton);
        console.log("Asset Strategy Development creation process initiated for single equipment"); 
        console.log("choosing equiment for ASD")
        await browser.keys("Enter");
        console.log("Equipment selected for ASD");
        await browser.pause(2000);
        console.log("Choosing Single equipment option");
        await utils.clickWithWait(this.singleOption);
        console.log("Single equipment option selected");
        await this.createASDHeader.waitForDisplayed({ timeout: 10000 });
        console.log("Filling in ASD details");
        await browser.pause(4000);
        this.assetASDDesc = `Automation_ASD_Single_Equipment_${Date.now()}`;
        console.log(`Generated ASD Description: ${this.assetASDDesc}`);
        await this.descriptionInput.setValue(this.assetASDDesc);
        await utils.clickWithWait(this.equipmentComponentInput);
        await this.selectEquipmentHeader.waitForDisplayed({ timeout: 10000 });
        await utils.waitForBusyIndicatorToDisappear();
        await this.equipmentSearchInput.setValue("10000162");
        await browser.keys("Enter");
        await browser.pause(2000);
        await utils.waitForBusyIndicatorToDisappear();
        await this.equipmentRowOption(2).waitForClickable({ timeout: 10000 });
        await utils.clickWithWait(this.equipmentRowOption(2));
        console.log("Equipment selected for ASD");
        await browser.pause(2000);
        await utils.setValueWithWait(this.assessmentTemplateInput, "RBI+ Fixed Equipment");
        console.log("Assessment Template set for ASD");
        await this.longDescriptionInput.setValue("Long description for ASD - Test");
        console.log("ASD details filled in successfully");
        await utils.clickWithWait(this.createButton);
        console.log("Create button clicked, waiting for ASD to be created");
        await utils.waitForBusyIndicatorToDisappear();
        console.log("ASD creation process completed");
        await this.okBtn.waitForClickable({ timeout: 10000 });
        await this.okBtn.click();
        console.log("OK button clicked, ASD creation confirmed");
        await this.verifyASDCreation();
    }

    public async verifyASDCreation() {
        console.log("Verifying ASD creation...");
        await utils.waitForBusyIndicatorToDisappear();
        if (await this.generalSelectionHeader.isDisplayed()) {
            console.log("Creation successful and navigated to detail view and able to see general selection header");
            console.log("Verifying selected items in General Selection");
            const items = await this.selectedCheckboxTexts;
            this.selectedItemsGlobal = {} as any;
            for (let el of items) {
                const text: string = await el.getText();
                this.selectedItemsGlobal[text] = true;
                console.log("Selected: " + text);
            }
            if (Object.keys(this.selectedItemsGlobal).length === 0) {
                this.generalSelectionData = false;
                await utils.clickWithWait(this.cancelBtn);
                await utils.waitForBusyIndicatorToDisappear();
                await browser.pause(3000);
                console.log("No items selected → Cancel clicked");
            } else {
                const isChecked = await this.selectAllToggle.getAttribute("aria-checked");
                if (isChecked === "false") {
                    await this.selectAllToggle.click();
                }
                await this.saveButton.click();
                await utils.waitForBusyIndicatorToDisappear();
                await browser.pause(2000);
                console.log("Saved general ASD after creation");
            }
            
        } else {
            if (await this.analysisDetailButton.isClickable() || await this.cmlTab.isClickable()) {
                console.log("Creation successful and navigated to detail view");
            }
        }
    }

    public async getASDDescName() {
        const xpath = "//header//*[@role='heading']//span";
        let found = false;
        try {
            await browser.waitUntil(async () => {
                const els = await $$(xpath);
                if (!els.length) return false;

                for (let el of els) {
                    let txt = (await el.getText()) ?? "";
                    if (!txt) txt =  (await el.getAttribute("innerText")) ?? "";
                    txt = txt?.trim();

                    if (txt && (txt.startsWith("AUTOMATION-") || txt.startsWith("Automation_"))) {
                        found = true;
                        return true;
                    }
                }
                return false;
            }, {
                timeout: 4000,  
                interval: 500
            });

        } catch (e) {
            console.log("ASD not visible in this attempt");
        }

        if (!found) return "";
        const spans = await $$(xpath);
        for (let el of spans) {
            let txt = (await el.getText()) ?? "";
                    if (!txt) txt =  (await el.getAttribute("innerText")) ?? "";
            txt = txt?.trim();

            if (txt && (txt.startsWith("AUTOMATION-") || txt.startsWith("Automation_"))) {
                return txt;
            }
        }
        return "";
    }

    public async fetchASDDisplayID() {
        console.log("Start: fetching ASD Display ID");
        const xpath = `//header[.//span[normalize-space()='${this.assetASDDesc}']]//*[starts-with(normalize-space(),'ASDA.')]`;
        await browser.waitUntil(async () => await (await $$(xpath)).length > 0, {
            timeout: 20000,
            timeoutMsg: "ASD Display ID not found"
        });
        const els = await $$(xpath);
        for (const el of els) {
            if (await el.isDisplayed() && await el.isEnabled()) {
                this.assetASDDisplayID = await el.getText();
                break;
            }
        }
        console.log("End: fetched ASD Display ID -> " + this.assetASDDisplayID);
    }
    
    public async verifyASDDeletion()
    {
        console.log("Verifying deletion of ASD");

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
        console.log("Visible search box found, searching for deleted ASD");
        await browser.execute((el, value) => {const input = el as unknown as HTMLInputElement;
            input.value = value as string;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }, searchBox, this.assetASDDisplayID);
        console.log(`Searched for ASD with Display ID: ${this.assetASDDisplayID}`);
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

        console.log("Clicking Go button to search for ASD");
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

        console.log("Checking if ASD is present in the list after deletion");
        const isFuncLocPresent = await $(noDataCell).isExisting();

        if (!isFuncLocPresent) {
            throw new Error("ASD still exists after deletion");
        } else {
            console.log("ASD deletion verified successfully");
        }
    }

    public async createASDForMultipleFunctionalLocations() {
        this.singleCreate = false;
        console.log("Starting creation of Asset Strategy Development for multiple functional locations");
        await utils.clickWithWait(this.newASDButton);
        console.log("Asset Strategy Development creation process initiated for multiple functional locations");
        console.log("choosing functional location for ASD")
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        console.log("Functional location selected for ASD");
        await browser.pause(2000);
        console.log("Choosing Multiple functional locations option");
        await utils.clickWithWait(this.multipleOption);
        console.log("Multiple functional locations option selected");
        await this.createMassRun.waitForDisplayed({ timeout: 10000 });
        console.log("Filling in ASD details");
        await browser.pause(4000);
        this.assetASDFunLoc = `Automation_ASD_Multiple_FuncLoc_${Date.now()}`;
        console.log(`Generated ASD Description: ${this.assetASDFunLoc}`);
        await this.descriptionInput.setValue(this.assetASDFunLoc);
        await browser.pause(2000);
        await utils.setValueWithWait(this.assessmentTemplateInput, "Mass Run Template");
        console.log("Assessment Template set for ASD");
        await this.longDescriptionInput.setValue("Long description for ASD - Test");
        console.log("ASD details filled in successfully");
        await utils.clickWithWait(this.nextBtn);
        console.log("Next button clicked, navigating to functional location selection");
        await utils.waitForBusyIndicatorToDisappear();
        await this.selectMultiFunLoc.waitForDisplayed({ timeout: 30000 });
        await browser.pause(5000);
        const funLocName = await $("//bdi[text()='Location Name']/following::input[1]");
        await utils.setValueWithWait(funLocName,'Mass Run');
        await browser.pause(3000);
        console.log("Selecting multiple functional locations for ASD");
        const noOfFuncLocs = await $("//div[contains(text(),'All')]").getText(); 
        const count = await utils.getAssignedValue(noOfFuncLocs); 
        console.log(`Number of functional locations to be assigned: ${count}`); 
        if(count === 0) 
        { 
            throw new Error("No functional locations found to assign for ASD"); 
        }
        const allAddBtns = await $$("//td[@aria-colindex='3']//button[@title='Add']");
        if (await allAddBtns.length === 0) {
            throw new Error("No functional locations available");
        }
        let success = false;
        for (let i = 0; i < await allAddBtns.length; i++) {
            this.selectedFuncLocsGlobal = [];
            await utils.clickWithWait(allAddBtns[i]);
            const noOfFuncLocsSelected = await $("//div[contains(text(),'Selected')]");
            const selectedText = await noOfFuncLocsSelected.getText();
            const selectedCount = await utils.getAssignedValue(selectedText);
            console.log(`Number of functional locations selected: ${selectedCount}`);
            if (selectedCount === 0) {
                throw new Error("No functional locations selected for ASD");
            }
            await utils.clickWithWait(noOfFuncLocsSelected);
            await browser.pause(4000);
            const selectedFuncLocs = await $$("//table[@aria-colcount='3']//td[@aria-colindex='2']//div//div//div//span");
            for (const el of selectedFuncLocs) {
                const text = await el.getText();
                if (text.trim()) {
                    this.selectedFuncLocsGlobal.push(text);
                }
            }
            console.log("Trying functional locations:", this.selectedFuncLocsGlobal);
            await utils.clickWithWait(this.calculateMassRunBtn);
            await browser.pause(4000);
            const errMsgHeader = $("//header[.//text()='Error']");
            if (await errMsgHeader.isDisplayed().catch(() => false)) {
                await utils.clickWithWait($("//header[.//text()='Error']/following-sibling::footer//button[.//text()='OK']"));
                while (true) {
                    const removeBtns = await $$("//span[text()='Delete']/preceding::span[1]");
                    if (await removeBtns.length === 0) break;
                    await removeBtns[0].click();
                    await utils.clickWithWait(await $("//footer//button[.//text()='OK']"));
                    await browser.pause(1000);
                }
                continue;
            }
            success = true;
            console.log("Mass run successful");
            await utils.clickWithWait(this.okBtn);
            console.log("Selected functional locations:", this.selectedFuncLocsGlobal);
            await browser.pause(5000);
            await utils.waitForBusyIndicatorToDisappear();
            break;
        }
        if (!success) {
        throw new Error("Mass run not possible with any functional location");
        }
        await browser.pause(4000);
        const el = await $('(//tr[@role="row"]//span[@title="Navigation"])[1]');
        await utils.clickWithWait(el);
        await browser.pause(10000);
        await this.verifyASDCreation();
    }

} export default new asset_strategy_development_listview_page();