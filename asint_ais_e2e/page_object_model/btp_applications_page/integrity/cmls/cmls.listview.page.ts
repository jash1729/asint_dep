import utils from "utils/utils";  
class CML_ListView_Page {

    private get cmlApp() { return $("//a[contains(@aria-label, 'CMLs')]"); }
    private get CMLIframe() { return $('iframe[data-help-id="application-cml-manage"]'); }
    private get newCMLButton() { return $("//span[text()='New']/ancestor::button"); }
    private get createCMLHeader() { return $("//h1[.//text()='Create CML']"); }
    private get objectTypeValue() { return $("//bdi[text()='Object Type']/following::div[@tabindex='0'][1]"); }
    private get objectTypeDrp() { return $("//bdi[text()='Object Type']/following::span[5]"); }
    private get equipmentInput() { return $("//bdi[text()='Equipment']/following::span[2]"); }
    private get funLocInput() { return $("//bdi[text()='Functional Location']/following::span[2]"); }
    private get selectEquipmentHeader() { return $("//h1[.//text()='Select Equipment']"); }
    private get selectFunLocHeader() { return $("//h1[.//text()='Select Functional Location']"); }
    private equipmentRow(i: number) { return $(`(//tr[@role='row'])[${i}]//td[2]//span`); }
    private funLocRow(i: number) { return $(`(//tr[@role='row'])[${i}]//td[2]//span`); }
    private get cmlTemplateDropdown() { return $("//bdi[text()='CML Template']/following::span[5]"); }
    private get errorHeader() { return $("//h1[.//text()='Error']"); }
    private get errorOkBtn() { return $("//h1[.//text()='Error']/following::button[.//text()='OK']"); }
    private get nextBtn() { return $("//footer//button[.//text()='Next']"); }
    private get selectedEquipmentText() { return $("//bdi[text()='EQUI:']/following::span[2]"); }
    private get selectedFunLocText() { return $("//bdi[text()='FLOC:']/following::span[2]"); }
    private get selectedTemplateText() { return $("//bdi[text()='CML Template:']/following::span[2]"); }
    private get nameInput() { return $("(//th[.//text()='Name']/following::td[@aria-colindex='1']//input)[1]"); }
    private get descriptionInput() { return $("(//th[.//text()='Description']/following::td[@aria-colindex='2']//input)[1]"); }
    private get cmlTemplateCell() { return $("(//th[.//text()='CML Template']/following::td[@aria-colindex='3']//span)[1]"); }
    private get previousBtn() { return $("//footer//button[.//text()='Previous']"); }
    private get addGridCMLCheckbox() { return $("(//bdi[text()='Add Grid CMLs']/ancestor::div[@role='radio']//div)[1]"); }
    private get gridCMLNameInput() { return $("//bdi[text()='Grid CML Name']/following::input[1]"); }
    private get gridCMLTemplateDropdown() { return $("//bdi[text()='CML Template']/following::span[2]"); }
    private get addGridCMLHeader() { return $("//h3[.//text()='Add Grid CMLs']"); }
    private get gridNameInputs() { return $$("//span[text()='Name']/following::td[@aria-colindex='1']//input"); }
    private get gridDescInputs() { return $$("//span[text()='Description']/following::td[@aria-colindex='2']//input"); }
    private get createCML() { return $("//footer//button[.//text()='Create']"); }
    private get okBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get cmlSummaryHeader() { return $("//h2[.//text()='CML Summary']"); }

    public selectedEquipment: string = "";
    public selectedEquTemplate: string = "";
    public selectedFunLoc: string = "";
    public selectedFunLocTemplate: string = "";
    public gridCmlName: string = "";
    public cmlName: string ="";

    generateCMLName() {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        this.cmlName = `Automation CML Name ${randomNum}`;
        return this.cmlName;
    }

    generateGridCMLName() {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        this.gridCmlName = `Automation Grid CML ${randomNum}`;
        return this.gridCmlName;
    }
    
    public async navigateToCMLListView() {
        console.log("Navigating to Asset Strategy Development List View");
        await this.navigateToCML(); 
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.CMLIframe);
        await browser.pause(2000);
        console.log("Navigated to Asset Strategy Development List View");


        await utils.clickWithWait($("//div[contains(text(),'CML Overview')]"));
        await browser.pause(3000);

        const el = await $('(//tr[@role="row"]//span[@title="Navigation"])[1]');
        await utils.clickWithWait(el);
        await browser.pause(10000);
    }
    
    public async navigateToCML(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.cmlApp);
        await utils.waitForBusyIndicatorToDisappear();
    }

    public async plusIconAndCMLSelect(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.newCMLButton);
    }

    public async createNewCMLs() {
        console.log("Creating new CMLs...");
        await this.plusIconAndCMLSelect();
        console.log("Chossing CML for creation")
        await browser.keys('Enter');
        await this.createCMLHeader.waitForDisplayed();

        const isOddDay = new Date().getDate() % 2 !== 0;
        if(isOddDay)
        {
            let flowCompleted = false;
            console.log("Creating for Equipment...");
            const objType = await this.objectTypeValue.getText();
            console.log("Object Type:", objType);
            for (let eq = 2; eq <= 50; eq++) {
                await browser.pause(2000);
                await utils.clickWithWait(this.equipmentInput);
                await browser.pause(5000);
                await this.selectEquipmentHeader.waitForDisplayed();
                if (!(await this.equipmentRow(eq).isDisplayed().catch(() => false))) continue;
                const equipmentText = await this.equipmentRow(eq).getText();
                await utils.clickWithWait(this.equipmentRow(eq));
                await browser.pause(5000);
                await utils.waitForBusyIndicatorToDisappear();
                let templateText = '';
                let validTemplateFound = false;
                console.log("Selected Equipment:", equipmentText);
                for (let t = 3; t <= 10; t++) {
                    await browser.pause(1500);
                    await utils.selectFromDropdown(this.cmlTemplateDropdown, t - 1);
                    await browser.pause(3000);
                    await utils.waitForBusyIndicatorToDisappear();
                    const selectedTextEl = $("//bdi[text()='CML Template']/following::span[2]//span[2]");
                    const selectedText = (await selectedTextEl.getText().catch(() => "")).trim();
                    console.log(`After selection ${t} → text: ${selectedText}`);
                    if (!selectedText) {
                        console.log("No value selected → trying next option");
                        continue;
                    }
                    if (await this.errorHeader.isDisplayed().catch(() => false)) {
                        await utils.clickWithWait(this.errorOkBtn);
                        console.log("Error after selection → trying next");
                        continue;
                    }
                    console.log("Valid Template selected:", selectedText);
                    templateText = selectedText;
                    validTemplateFound = true;
                    break;
                }

                if (!validTemplateFound) {
                    console.log("No valid template → trying next equipment");
                    continue;
                }
                this.selectedEquipment = equipmentText;
                this.selectedEquTemplate = templateText;

                console.log("Final Selected → Equipment:", equipmentText, "Template:", templateText);

                await utils.clickWithWait(this.nextBtn);
                await browser.pause(2000);
                await utils.waitForBusyIndicatorToDisappear();
                const cmlsSec = await $("//h3[.//text()='CMLs']");
                await cmlsSec.waitForDisplayed({ timeout: 20000 });
                const equi = await this.selectedEquipmentText.getText();
                const template = await this.selectedTemplateText.getText();

                await expect(equi).toEqual(this.selectedEquipment);
                await expect(template).toEqual(this.selectedEquTemplate);
                console.log("Confirmed the selected equipment and template");
                await utils.clickWithWait(this.nameInput);
                await this.nameInput.setValue(this.generateCMLName());
                await utils.clickWithWait(this.descriptionInput);
                await this.descriptionInput.setValue("Automation CML Description");
                let cmlTemplateSelected = false;
                for (let ct = 3; ct <= 10; ct++) {
                    await browser.pause(1500);
                    await utils.selectFromDropdown(this.cmlTemplateCell, ct - 1);
                    await browser.pause(3000);
                    await utils.waitForBusyIndicatorToDisappear();

                    const selectedTextEl = $("(//th[.//text()='CML Template']/following::td[@aria-colindex='3']//span//span[2])[1]");
                    const selectedText = (await selectedTextEl.getText().catch(() => "")).trim();
                    console.log(`After selection ${ct} → text: ${selectedText}`);
                    if (!selectedText) {
                        console.log("No value selected → trying next option");
                        continue;
                    }
                    if (await this.errorHeader.isDisplayed().catch(() => false)) {
                        await utils.clickWithWait(this.errorOkBtn);
                        console.log("Error after selection → trying next");
                        continue;
                    }
                    console.log("Valid CML template selected:", selectedText);
                    cmlTemplateSelected = true;
                    break;
                }
                if (!cmlTemplateSelected) {
                    console.log("No valid CML template → going back");
                    if (await this.previousBtn.isDisplayed().catch(() => false)) {
                        await utils.clickWithWait(this.previousBtn);
                    }
                    continue;
                }
                console.log("Choosing add grid CMLs check box");
                await utils.clickWithWait(this.addGridCMLCheckbox);
                await browser.pause(2000);
                await this.gridCMLNameInput.waitForClickable();
                await utils.clickWithWait(this.gridCMLNameInput);
                await this.gridCMLNameInput.setValue(this.generateGridCMLName());

                await utils.clickWithWait(this.gridCMLTemplateDropdown);
                for (let ct = 3; ct <=  10; ct++) {
                    await utils.selectFromDropdown(this.gridCMLTemplateDropdown, ct - 1);
                    await browser.pause(3000);
                    await utils.waitForBusyIndicatorToDisappear();
                    const selectedTextEl = $("//bdi[text()='CML Template']/following::span[2]//span[2]");
                    const selectedText = (await selectedTextEl.getText().catch(() => "")).trim();
                    console.log(`After selection ${ct} → text: ${selectedText}`);

                    if (!selectedText) {
                        console.log("No value selected → trying next option");
                        continue;
                    }

                    if (await this.errorHeader.isDisplayed().catch(() => false)) {
                        await utils.clickWithWait(this.errorOkBtn);
                        console.log("Error after selection → trying next");
                        continue;
                    }
                    console.log("Valid CML template selected:", selectedText);
                    cmlTemplateSelected = true;
                    break;
                }

                await utils.clickWithWait(this.nextBtn);
                await this.addGridCMLHeader.waitForDisplayed();
                const names = await this.gridNameInputs;
                const descs = await this.gridDescInputs;

                for (let i = 0; i < await names.length; i++) {
                    const uniqueName = `Auto_Name_${Date.now()}_${i}`;
                    const uniqueDesc = `Auto_Desc_${Date.now()}_${i}`;
                    await utils.clickWithWait(names[i]);
                    await utils.setValueWithWait(names[i],uniqueName);
                    await utils.clickWithWait(descs[i]);
                    await utils.setValueWithWait(descs[i],uniqueDesc);
                }
                flowCompleted = true;
                break;
            }
            if (flowCompleted) {
                console.log("Clicking on create button...");
                await utils.clickWithWait(this.createCML);
                await browser.pause(3000);
                await utils.waitForBusyIndicatorToDisappear();

                if (await this.okBtn.isDisplayed().catch(() => false) &&
                    await this.okBtn.isClickable().catch(() => false)) {
                    await utils.clickWithWait(this.okBtn);
                }
                await utils.waitForBusyIndicatorToDisappear();
                await this.verifyCMLCreation();
            }

        }
        else
        {
            console.log("Creating for functional location...");
            let flowCompleted  = false;
            await utils.clickWithWait(this.objectTypeDrp);
            await browser.keys("ArrowDown");
            await browser.keys("Enter");
            await browser.pause(2000);
            const objType = await this.objectTypeValue.getText();
            console.log("Object Type:", objType);
            for (let eq = 2; eq <= 50; eq++) {
                await browser.pause(2000);
                await utils.clickWithWait(this.funLocInput);
                await browser.pause(5000);
                await this.selectFunLocHeader.waitForDisplayed();

                if (!(await this.funLocRow(eq).isDisplayed().catch(() => false))) continue;

                const funLocText = await this.funLocRow(eq).getText();
                await utils.clickWithWait(this.funLocRow(eq));
                await browser.pause(5000);
                await utils.waitForBusyIndicatorToDisappear();
                let templateText = '';
                let validTemplateFound = false;
                console.log("Selected Functional Location:", funLocText);
                for (let t = 3; ; t++) {
                    await browser.pause(1500);
                    await utils.selectFromDropdown(this.cmlTemplateDropdown, t - 1);
                    await browser.pause(3000);
                    await utils.waitForBusyIndicatorToDisappear();
                    const selectedTextEl = $("//bdi[text()='CML Template']/following::span[2]//span[2]");
                    const selectedText = (await selectedTextEl.getText().catch(() => "")).trim();
                    console.log(`After selection ${t} → text: ${selectedText}`);
                    if (!selectedText) {
                        console.log("No value selected → trying next option");
                        continue;
                    }
                    if (await this.errorHeader.isDisplayed().catch(() => false)) {
                        await utils.clickWithWait(this.errorOkBtn);
                        console.log("Error after selection → trying next");
                        continue;
                    }
                    console.log("Valid Template selected:", selectedText);
                    templateText = selectedText;
                    validTemplateFound = true;
                    break;
                }

                if (!validTemplateFound) {
                    console.log("No valid template → trying next functional location");
                    continue;
                }

                this.selectedFunLoc = funLocText;
                this.selectedFunLocTemplate = templateText;

                console.log("Final Selected → functional location:", funLocText, "Template:", templateText);
                await utils.clickWithWait(this.nextBtn);
                await browser.pause(2000);
                await utils.waitForBusyIndicatorToDisappear();
                const cmlsSec = await $("//h3[.//text()='CMLs']");
                await cmlsSec.waitForDisplayed({ timeout: 20000 });
                const funLoc = await this.selectedFunLocText.getText();
                const template = await this.selectedTemplateText.getText();
                await expect(funLoc).toEqual(this.selectedFunLoc);
                await expect(template).toEqual(this.selectedFunLocTemplate);
                console.log("Confirmed the selected functional location and template");

                await utils.clickWithWait(this.nameInput);
                await this.nameInput.setValue("Automation CML Name");

                await utils.clickWithWait(this.descriptionInput);
                await this.descriptionInput.setValue("Automation CML Description");

                let cmlTemplateSelected = false;
                for (let ct = 3; ct <= 10; ct++) {
                    await browser.pause(1500);
                    await utils.selectFromDropdown(this.cmlTemplateCell, ct - 1);
                    await browser.pause(3000);
                    await utils.waitForBusyIndicatorToDisappear();

                    const selectedTextEl = $("(//th[.//text()='CML Template']/following::td[@aria-colindex='3']//span//span[2])[1]");
                    const selectedText = (await selectedTextEl.getText().catch(() => "")).trim();
                    console.log(`After selection ${ct} → text: ${selectedText}`);
                    if (!selectedText) {
                        console.log("No value selected → trying next option");
                        continue;
                    }

                    if (await this.errorHeader.isDisplayed().catch(() => false)) {
                        await utils.clickWithWait(this.errorOkBtn);
                        console.log("Error after selection → trying next");
                        continue;
                    }
                    console.log("Valid CML template selected:", selectedText);
                    cmlTemplateSelected = true;
                    break;
                }

                if (!cmlTemplateSelected) {
                    console.log("No valid CML template → going back");
                    if (await this.previousBtn.isDisplayed().catch(() => false)) {
                        await utils.clickWithWait(this.previousBtn);
                    }
                    continue;
                }

                console.log("Choosing add grid CMLs check box");
                await utils.clickWithWait(this.addGridCMLCheckbox);
                await browser.pause(2000);
                await this.gridCMLNameInput.waitForClickable();
                await utils.clickWithWait(this.gridCMLNameInput);
                await this.gridCMLNameInput.setValue("Automation Grid CML");

                await utils.clickWithWait(this.gridCMLTemplateDropdown);
                for (let ct = 3; ct <=  10; ct++) {
                    await utils.selectFromDropdown(this.gridCMLTemplateDropdown, ct - 1);
                    await browser.pause(3000);
                    await utils.waitForBusyIndicatorToDisappear();

                    const selectedTextEl = $("//bdi[text()='CML Template']/following::span[2]//span[2]");
                    const selectedText = (await selectedTextEl.getText().catch(() => "")).trim();
                    console.log(`After selection ${ct} → text: ${selectedText}`);

                    if (!selectedText) {
                        console.log("No value selected → trying next option");
                        continue;
                    }

                    if (await this.errorHeader.isDisplayed().catch(() => false)) {
                        await utils.clickWithWait(this.errorOkBtn);
                        console.log("Error after selection → trying next");
                        continue;
                    }

                    console.log("Valid CML template selected:", selectedText);
                    cmlTemplateSelected = true;
                    break;
                }

                await utils.clickWithWait(this.nextBtn);

                await this.addGridCMLHeader.waitForDisplayed();

                const names = await this.gridNameInputs;
                const descs = await this.gridDescInputs;

                for (let i = 0; i < await names.length; i++) {
                    const uniqueName = `Auto_Name_${Date.now()}_${i}`;
                    const uniqueDesc = `Auto_Desc_${Date.now()}_${i}`;

                    await utils.clickWithWait(names[i]);
                    await utils.setValueWithWait(names[i],uniqueName);

                    await utils.clickWithWait(descs[i]);
                    await utils.setValueWithWait(descs[i],uniqueDesc);
                }
                flowCompleted = true;
                break;
            }
            if (flowCompleted) {
                console.log("Clicking on create button...");
                await utils.clickWithWait(this.createCML);
                await browser.pause(3000);
                await utils.waitForBusyIndicatorToDisappear();

                if (await this.okBtn.isDisplayed().catch(() => false) &&
                    await this.okBtn.isClickable().catch(() => false)) {
                    await utils.clickWithWait(this.okBtn);
                }
                await utils.waitForBusyIndicatorToDisappear();
                await this.verifyCMLCreation();
            }
        }
        console.log("New CMLs has been created");
    }

    public async verifyCMLCreation()
    {
        console.log("Verifying the CMLs creation...");
        await this.cmlSummaryHeader.waitForDisplayed({timeout : 20000});
        console.log("Navigated to CMLs detail page");
    }
}
export default new CML_ListView_Page();