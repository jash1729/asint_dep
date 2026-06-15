import utils from "../../../../utils/utils.ts";
import EquipmentListviewPage from "./equipment.listview.page.ts";
class EquipmentDetailPage {
    //  SELECTORS 
    public equipmentHeadValue!: string;
    public displayID!: string;
    private get equipmentNameHeader() { return $("//header[.//div[@role='heading']][@role='banner']"); }
    get successOkBtn() { return $("//header[.//text()='Success']/following::button[.//text()='OK']"); }
    equipmentName(name: string) { return $(`//*[text()="${name}"]//span`); }
    private get deleteBtn() { return $("//*[contains(@class,'sapUxAPObjectPageLayout')]//header//button[.//bdi[normalize-space()='Delete']]"); }
    get structureSection() { return $('//button[.//bdi[text()="Structure"]]'); }
    get assignmentSection() { return $('//button[.//bdi[text()="Assignments"]]'); }
    get classificationSection() { return $('//button[.//bdi[text()="Classification & MDA"]]'); }
    get assetIntelligenceSection() { return $('//button[.//bdi[text()="Asset Intelligence"]]'); }
    get riskSection() { return $('//button[.//bdi[text()="Risk Summary"]]'); }
    get mainAndServiceSection() { return $('//button[.//bdi[text()="Maintenance and Service"]]'); }
    private get maintainNoti() { return $("//div[text()='Maintenance Notifications']/following::span[1]"); }
    private get maintainOrder() { return $("//div[text()='Maintenance Orders']/following::span[1]"); }
    private get maintainPlan() { return $("//div[text()='Maintenance Plan']/following::span[1]"); }
    private get recomWrk() { return $("//div[text()='Recommendation Workbench']/following::span[1]"); }
    private get maintaintask() { return $("//div[text()='Maintenance Tasks']/following::span[5]"); }
    private get changeHistoryEditHeader() { return $("//bdi[text()='Edit Header']"); }
    private get descEditHeader() { return $("//bdi[text()='Short Description']/following::input[1][not(@readonly)]"); }
    private get categoryEditHeader() { return $("//bdi[text()='Category']/following::input[1]"); }
    private get category() { return $("//span[text()='Select Category']"); }
    private get ctgChoose() { return $(`//span[text()='Linear Asset']/ancestor::tr//td[2]//*[name()='circle'][2]`); }
    private get ctgSave() { return $("(//bdi[text()='Save'])[2]"); }
    private get headerSave() { return $("//bdi[text()='Save']"); }
    private get hdSaveSucc() { return $("//span[text()='Updated successfully']"); }
    private get hdOkBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get chngHist() { return $("//bdi[text()='Change History']"); }

    private get maintenanceSection() { return $('//button[.//bdi[text()="Maintenance and Service"]]'); }
    private get attachmentsSection() { return $('//button[.//bdi[text()="Attachments"]]'); }
    private get changeHistorySection() { return $('//button[.//bdi[text()="Change History"]]'); }
    get equipmentAssignBtn() {return $('(//div[text()="Equipment Templates"]/following::bdi[text()="Assign"])[1]')}
    get equipmentClassAssignBtn() {return $('(//div[text()="Equipment Template Class & Characteristics"]/following::bdi[text()="Assign"])[1]')}
    get editBtn() { return $('//button[contains(@class,"sapMBtn")][.//bdi[text()="Edit"]]'); }
    get inventoryNumberInput() { return $('//bdi[text()="Inventory Number"]/following::input[1]'); }
    private get equipmentIframe() { return $('iframe[data-help-id="application-equipment-manage"]'); }
    get componentTypeDropdown() { return $('//bdi[text()="Component Type"]/following::input[1]'); }
    get activationStateDropdown() { return $('//bdi[text()="Activation State"]/following::input[1]'); }
    get authorizationGroupInput() { return $('//bdi[text()="Authorization Group"]/following::input[1]'); }
    get startUpDateInput() { return $('//bdi[text()="Start up date"]/following::input[1]'); }
    get deactivationDateInput() { return $('//bdi[text()="Deactivation Date"]/following::input[1]'); }
    get componentRegulatoryIdInput() { return $('//bdi[text()="Component Regulatory ID"]/following::input[1]'); }
    get commentsTextArea() { return $('//bdi[text()="Comments"]/following::textarea[1]'); }
    get longDescTextArea() { return $('//bdi[text()="Long Description"]/following::textarea[1]'); }
    get acquisitionValueInput() { return $('//bdi[text()="Acquisition Value / Currency"]/following::input[1]'); }
    get assetManufacturerInput() { return $('//bdi[text()="Asset Manufacturer Name "]/following::input[1]'); }
    get partNumberInput() { return $('//bdi[text()="Part Number "]/following::input[1]'); }
    get modelNumberInput() { return $('//bdi[text()="Model Number "]/following::input[1]'); }
    get serialNumberInput() { return $('//bdi[text()="Serial Number"]/following::input[1]'); }
    get superordinateEquipmentInput() { return $('//bdi[text()="Superordinate Equipment"]/following::input[1]'); }
    get functionalLocationInput() { return $('//bdi[text()="Functional Location"]/following::input[1]'); }
    get componentInfoAssignBtn() { return $('//button[.//bdi[text()="Assign"]]'); }
    get componentInfoUnassignBtn() { return $('//button[.//bdi[text()="Unassign"]]'); }
    get saveBtn() { return $('//button[.//bdi[text()="Save"]]'); }
    private get groups() { return $("//div[text()='Equipment Template Class & Characteristics']/following::span[1]"); }
    get asgnChrMDA() { return $("//span[text()='Maintenance Data Attribute']/following::bdi[text()='Assign']"); }
    get noOfClassMDA() { return $("//span[text()='Assign Classes']/following::span[2]"); }
    private get riskProfile() { return $("//bdi[text()='Risk Summary']//following::h2[1]"); }
    private get component() { return $("//bdi[text()='Risk Summary']//following::h2[2]"); }
    private get recommendation() { return $("//bdi[text()='Risk Summary']//following::div[@aria-level='2']//span"); }
    private get riskAndCriticality() { return $("//div[text()='Risk and Criticality']/following::span[1]"); }
    private get assetStrategyRBI() { return $("(//div[text()='Asset Strategy']/following::li//div//div)[1]"); }
    private get assetStrategyRCM() { return $("(//div[text()='Asset Strategy']/following::li//div//div)[2]"); }
    private get assetInsp() { return $("//div[text()='Asset Inspection']/following::span[1]"); }
    private get findings() { return $("//div[text()='Findings']/following::span[1]"); }
    private get recommend() { return $("//div[text()='Recommendations']/following::span[1]"); }
    get cancelBtn() { return $("//bdi[text()='Cancel']"); }
    private get noOfCharMDA() { return $("//span[text()='Maintenance Data Attribute']/following::h2//span"); }
    private get equipmentHeaderTitleSpans() { return $$("//header[@role='banner']//*[@role='heading']//span[normalize-space()]"); }
    private get equipmentEditHeader() { return $("//bdi[text()='Edit Header']"); }
    private get equipmentDescEditHeader() { return $("//div[@role='dialog']//bdi[contains(text(),'Description')]/following::input[1][not(@readonly)]"); }
    private get equipmentCategoryEditHeader() { return $("//div[@role='dialog']//bdi[text()='Category']/following::input[1]"); }
    private get equipmentCategoryDialog() { return $("//span[text()='Select Category']"); }
    private get equipmentFirstCategoryChoose() { return $("(//span[.='Select Category']/ancestor::header/following::*[name()='circle'][2])[1]"); }
    private get equipmentCategorySave() { return $("(//bdi[text()='Save'])[2]"); }
    private get equipmentHeaderSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get equipmentHdSaveSucc() { return $("//span[text()='Updated successfully']"); }
    private get equipmentHdOkBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    public superEquipValue!: string;
    public equipHeadValue!: string;

    async verifyOnEquipmentDetailPage(expectedName?: string): Promise<boolean> {
        try {
            await this.equipmentNameHeader.waitForDisplayed({ timeout: 50000 });
            if (!expectedName) {
                return true;
            }
            const actualName = await this.equipmentName(expectedName).getText();
            return actualName === expectedName;
        } catch {
            return false;
        }
    }
    
    async fillGeneralInfo(
        inventoryNumber?: string,
        componentType?: string,
        activationState?: string,
        authorizationGroup?: string,
        startUpDate?: string,
        deactivationDate?: string,
        componentRegulatoryId?: string,
        comments?: string,
        longDescription?: string,
        acquisitionValue?: number,
        assetManufacturer?: string,
        partNumber?: string,
        modelNumber?: number,
        serialNumber?: string
    ): Promise<void> {
        await browser.pause(5000);
        await this.editBtn.waitForClickable();
        await this.editBtn.click();
        await browser.pause(5000);
        if (inventoryNumber !== undefined) {
            await this.inventoryNumberInput.setValue(inventoryNumber);
            await browser.pause(2000);
        }

        if (componentType !== undefined) {
            await this.componentTypeDropdown.click();
            await browser.keys(componentType);
            await browser.keys("Enter");
        }

        if (activationState !== undefined) {
            await this.activationStateDropdown.click();
            await browser.keys(activationState);
            await browser.keys("Enter");
        }

        if (authorizationGroup !== undefined) {
            await this.authorizationGroupInput.setValue(authorizationGroup);
            await browser.pause(2000);
        }

        if (startUpDate !== undefined) {
            await this.startUpDateInput.setValue(startUpDate);
        }

        if (deactivationDate !== undefined) {
            await this.deactivationDateInput.setValue(deactivationDate);
        }

        if (componentRegulatoryId !== undefined) {
            await this.componentRegulatoryIdInput.setValue(componentRegulatoryId);
            await browser.pause(2000);
        }

        if (comments !== undefined) {
            await this.commentsTextArea.setValue(comments);
            await browser.pause(2000);
        }

        if (longDescription !== undefined) {
            await this.longDescTextArea.setValue(longDescription);
            await browser.pause(2000);
        }
        if (acquisitionValue !== undefined) {
            await this.acquisitionValueInput.setValue(acquisitionValue.toString());
            await browser.pause(2000);
        }
        if (assetManufacturer !== undefined) {
            await this.assetManufacturerInput.setValue(assetManufacturer);
            await browser.pause(2000);
        }
        if (partNumber !== undefined) {
            await this.partNumberInput.setValue(partNumber);
            await browser.pause(2000);
        }
        if (modelNumber !== undefined) {
            await this.modelNumberInput.setValue(modelNumber.toString());
            await browser.pause(2000);
        }
        if (serialNumber !== undefined) {
            await this.serialNumberInput.setValue(serialNumber);
            await browser.pause(2000);
        }
        await browser.pause(5000); 
        await this.saveBtn.click();
        await this.successOkBtn.waitForClickable({ timeout: 30000 });
        await this.successOkBtn.click();
        await browser.pause(10000); 
    }

    async waitForBlockLayerToDisappear(timeoutInSeconds = 30): Promise<void> {
        const blockLayer = await $('#sap-ui-blocklayer-popup');
        try {
            await browser.waitUntil(
                async () => {
                    const exists = await blockLayer.isExisting();
                    if (!exists) return true;
                    const visible = await blockLayer.isDisplayed();
                    return !visible;
                },
                { timeout: timeoutInSeconds * 1000, interval: 500 }
            );
        } catch {
            console.warn('Block layer still visible after timeout');
        }
    }

    async editStructureInfo(noOfequip: number) {
        await browser.pause(4000);
        await utils.switchToIframe(this.equipmentIframe);
        await this.structureSection.waitForDisplayed({ timeout: 50000 });
        await this.structureSection.click()
        await browser.pause(2000);

        // Click Edit button
        await this.editBtn.waitForClickable({ timeout: 30000 });
        await this.editBtn.click();
        await browser.pause(5000);

        // Search and select superordinate equipment
        await this.superordinateEquipmentInput.waitForClickable({ timeout: 30000 });
        await this.superordinateEquipmentInput.click();
        await browser.pause(8000);
        await utils.switchToIframe(this.equipmentIframe);
        const subordinateResultCell = await $(`(//tr[@role="row"])[3]`);
        await subordinateResultCell.waitForDisplayed({ timeout: 20000 });
        await subordinateResultCell.click();
        await browser.pause(2000);
        const closeBtn = await $('//bdi[text()="Close"]/ancestor::button');
        try {
            await closeBtn.waitForDisplayed({ timeout: 5000 });
            if (await closeBtn.isDisplayed()) {
                await closeBtn.click();
            }
        } catch {
            // Dialog already closed
        }
        await browser.pause(2000);

        const superEquip = await $("//bdi[text()='Superordinate Equipment']/following::input[1]");
        console.log("Assigning Equipment");
        if (noOfequip === 0) return;
        const superEquipValue: string =
            (await superEquip.getAttribute("value"))?.trim() || "";
        console.log("Super Ordinate Equipment Value :"+superEquipValue);
        console.log("Equipment Name is:"+EquipmentListviewPage.createdEquipmentName);
        let selectedCount = 0;
        let i = 1;

        while (selectedCount < noOfequip) {
            await utils.clickWithWait(this.componentInfoAssignBtn, 1000);
            await browser.pause(2000);
            await browser.keys(['ArrowDown']);
            await browser.keys(['ArrowDown']);
            await browser.keys(['ArrowDown']);
            await browser.keys(['Enter']);
            await browser.pause(2000);

            await utils.switchToIframe(this.equipmentIframe);

            let foundValid = false;

            while (!foundValid) {
                await browser.pause(3000);
                const nameCell = $(`(//tr[@role='row'])[${i + 1}]//td[3]//span`);
                await nameCell.waitForDisplayed({ timeout: 20000 });

                let equipName: string = (await nameCell.getText()) || (await nameCell.getAttribute("innerText")) || "";
                equipName = equipName.trim();
                await console.log(`Checking equipment: ${equipName}`);

                if (
                    equipName &&
                    (equipName === EquipmentListviewPage.createdEquipmentName) || equipName === superEquipValue
                ) {
                    i++;
                    await console.log(`Skipping equipment: ${equipName} as it matches either the equipment being edited or the superordinate equipment`);
                    continue;
                }

                // click corresponding checkbox (td[2])
                const checkbox = $(`((//tr[@role='row'])[${i + 1}]//td[2]//div)[1]`);
                await utils.clickWithWait(checkbox);
                await utils.waitForBusyIndicatorToDisappear();

                selectedCount++;
                i++;
                foundValid = true;

                await utils.clickWithWait($("//header[.//text()='Select Equipment']/following::bdi[text()='Confirm']"));
                await utils.waitForBusyIndicatorToDisappear();
                await browser.pause(1000);
                await utils.clickWithWait($("//header[.//text()='Success']/following::bdi[text()='OK']"), 1000);
                await utils.waitForBusyIndicatorToDisappear();

                selectedCount++;
                i++;
                foundValid = true;
            }
    }

    console.log("Equipment assigned");
    }

    async assignEquipmentTemplate(noOfEquipment: number, autoAssign: boolean): Promise<void> {
        await browser.pause(4000);
        await utils.switchToIframe(this.equipmentIframe);
        await this.assignmentSection.waitForDisplayed({ timeout: 50000 });
        await this.assignmentSection.click();

        await utils.switchToIframe(this.equipmentIframe);
        await utils.clickWithWait(this.equipmentAssignBtn,0, 50000);
        await browser.pause(2000);

        await utils.selectCheckboxes(noOfEquipment);
        if (autoAssign) {
            const checkBox = await $('//footer//div[@role="checkbox" and .//bdi[text()="Auto assign Class and Characteristics"]]');
            await utils.clickWithWait(checkBox);
        }
        await utils.switchToIframe(this.equipmentIframe); 
        await utils.clickWithWait($("//header[.//text()='Select Templates']/following::button[.//bdi[text()='Ok']]"));
        await browser.pause(2000);
        await utils.clickWithWait($('//header[.//text()="Success"]/following::button[.//bdi[text()="OK"]]'));

        await this.equipmentAssignBtn.waitForClickable({ timeout: 30000 });
    }

    async assignEquipmentClass(noOfClasses: number, autoAssign: boolean): Promise<void> {
        
        const classes = await this.groups.getText();
        await utils.getAssignedValue(classes);
        console.log(`Already assigned classes: ${classes}`);

        if (autoAssign) {
            console.log("Auto-assigning classes, skipping manual class assignment.");
            return;
        }
        await browser.pause(4000);
        await utils.switchToIframe(this.equipmentIframe);
        await utils.clickWithWait(this.assignmentSection);
        await browser.pause(2000);

        await utils.switchToIframe(this.equipmentIframe);
        await this.equipmentClassAssignBtn.waitForClickable({ timeout: 30000 });
        await this.equipmentClassAssignBtn.click();
        await browser.pause(2000);
        await utils.switchToIframe(this.equipmentIframe);
        await utils.selectCheckboxes(noOfClasses);
        await utils.clickWithWait($('//header[.//text()="Assign Classes"]/following::button[.//bdi[text()="Ok"]]'));
        await browser.pause(2000);
        await utils.clickWithWait($('//header[.//text()="Success"]/following::button[.//bdi[text()="OK"]]'));
    }

    async assignCharacteristics(noOfChar: number): Promise<void> {
        let k=0;
        await browser.pause(1000);
        await utils.switchToIframe(this.equipmentIframe);
        await this.classificationSection.waitForDisplayed({ timeout: 50000 });
        await this.classificationSection.click();
        const char = await this.noOfCharMDA.getText();
        await utils.getAssignedValue(char);
        console.log("Already assigned charactertics : "+char);
        await browser.pause(1000);
        await utils.switchToIframe(this.equipmentIframe);
        await this.classificationSection.waitForDisplayed({ timeout: 50000 });
        await this.classificationSection.click();
        await utils.switchToIframe(this.equipmentIframe);
        await this.asgnChrMDA.waitForClickable({ timeout: 30000 });
        await this.asgnChrMDA.click();
        await browser.pause(1000);
        await utils.switchToIframe(this.equipmentIframe);
        const availableChar = await this.noOfClassMDA.getText();
        const availableCharCount = await utils.getAssignedValue(availableChar);
        console.log("Available characteritics:"+ availableCharCount);
        if(availableCharCount === 0)
        {
            console.log("No of characteritics available is zero")
            await utils.clickWithWait($("//header[.//text()='Assign Classes']/following::button[.//bdi[text()='Cancel']]"));
            await utils.waitForBusyIndicatorToDisappear();
            k=1;
        }
        else if (availableCharCount <= noOfChar )
        {
            const selectAll = $("//span[text()='Assign Classes']/ancestor::header/following::th[2]");
            await utils.clickWithWait(selectAll);
        }
        if(k===0)
        {
        await utils.clickWithWait(this.successOkBtn,1500);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.successOkBtn,1500);
        await utils.waitForBusyIndicatorToDisappear();
        }
        const updatedChar = await this.noOfCharMDA.getText();
        await utils.getAssignedValue(updatedChar);
        console.log("Assigned charactertics : "+updatedChar);
    }
    async gotoAttachmentsTabAndAssignAttachment() {
        await browser.pause(4000);
        await utils.switchToIframe(this.equipmentIframe);
        await this.attachmentsSection.waitForDisplayed({ timeout: 50000 });
        await this.attachmentsSection.click();
        // Click on "Add Attachment" button
        await utils.switchToIframe(this.equipmentIframe);
        const addAttachmentBtn = await $('//button[.//bdi[text()="Assign"]]');
        await utils.clickWithWait(addAttachmentBtn);
        await browser.pause(2000);
        await utils.selectCheckboxes(2);
        await utils.clickWithWait($('//footer//button[.//bdi[text()="Assign"]]'));
        await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'));
    }

    async deleteAttachmentAndVerify() {
        const firstAttachmentCheckbox = await $('(//table//tr[@role="row"]//div[@role="checkbox"])[1]');
        await firstAttachmentCheckbox.waitForClickable({ timeout: 20000 });
        await firstAttachmentCheckbox.click();

        await utils.clickWithWait($('//button[.//bdi[text()="Assign"]]/following::bdi[1]'));
        await utils.clickWithWait($('//button[.//bdi[text()="Yes"]]'));
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'));
        await browser.pause(2000);
    }

    async addLink() {
        const addLinkBtn = await $('//button[.//bdi[text()="Add"]]');
        await utils.clickWithWait(addLinkBtn);
        await browser.pause(2000);
        await utils.switchToIframe(this.equipmentIframe);
        const link = await $('//li[contains(.,"Add Link")]');
        await utils.clickWithWait(link);
        await browser.pause(2000);

        // Display Name
        const displayNameInput = await $(`//label[.//bdi[text()='Display Name']]//following::input[1]`);
        await displayNameInput.waitForDisplayed();
        await displayNameInput.setValue("Test Link");

        // Link
        const linkInput = await $(`//label[.//bdi[text()='Link']]//following::input[1]`);
        await linkInput.setValue("https://testlink.com");

        // Phase (MultiComboBox)
        // if (false) {
        //     const phaseInput = await $(`//label[.//bdi[text()='Phase']]//following::input[1]`);
        //     await phaseInput.click();
        //     await phaseInput.setValue(data.phase);

        //     const option = await $(`//li//span[text()='${data.phase}']`);
        //     await option.waitForDisplayed();
        //     await option.click();
        // }

        // // Category (ComboBox)
        // if (false) {
        //     const categoryInput = await $(`//label[.//bdi[text()='Category']]//following::input[1]`);
        //     await categoryInput.click();
        //     await categoryInput.setValue(data.category);

        //     const option = await $(`//li//span[text()='${data.category}']`);
        //     await option.waitForDisplayed();
        //     await option.click();
        // }

        // // Language (ComboBox)
        // if (false) {
        //     const languageInput = await $(`//label[.//bdi[text()='Language']]//following::input[1]`);
        //     await languageInput.click();
        //     await languageInput.setValue(data.language);

        //     const option = await $(`//li//span[text()='${data.language}']`);
        //     await option.waitForDisplayed();
        //     await option.click();
        // }
        await utils.clickWithWait($('//button[.//bdi[text()="Save"]]'));
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'));
        await browser.pause(2000);
    }
    async addDocument() {
        
        const addLinkBtn = await $('//button[.//bdi[text()="Add"]]');
        await utils.clickWithWait(addLinkBtn);
        await browser.pause(2000);
        await utils.switchToIframe(this.equipmentIframe);
        const documentOption = await $('//li[contains(.,"Add Document")]');
        await utils.clickWithWait(documentOption);
        await browser.pause(2000);
        await utils.uploadDocument('vessel-1.png');
        await browser.pause(9000);
        await utils.clickWithWait($('//label[.//bdi[text()="Category"]]//following::span[contains(@id,"arrow")][1]'));
        await utils.clickWithWait($('//li[@role="option" and .//span[text()="Bills of Materials"]]'));
        await browser.pause(1000);
        await utils.clickWithWait($('//label[.//bdi[text()="Phase"]]//following::span[contains(@id,"arrow")][1]'));
        await browser.pause(1000);
        await utils.clickWithWait($('//li[@role="option"][1]//div[@role="checkbox"]'));
        await browser.pause(1000);
        await utils.clickWithWait($('//label[.//bdi[text()="Phase"]]//following::span[contains(@id,"arrow")][1]'));
        await browser.pause(1000);
        await utils.clickWithWait($('//label[.//bdi[text()="Language"]]//following::span[contains(@id,"arrow")][1]'));
        await browser.pause(1000);
        await utils.clickWithWait($('//span[text()="English"]/ancestor::li'));
        await browser.pause(1000);
        await utils.clickWithWait($('//button[.//bdi[text()="Save"]]'));
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'));
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(10000);
    }

    async verifyAssetIntelligence() {
        console.log("Navigating to Asset Intelligence Tab");
        await browser.pause(4000);
        await utils.switchToIframe(this.equipmentIframe);
        await utils.clickWithWait(this.assetIntelligenceSection);
        await this.assetIntelligenceSection.waitForDisplayed({ timeout: 30000 });
        console.log("Navigated to Asset Intelligence Tab successfully");
        await browser.pause(5000);
        const riskAndCriti = await this.riskAndCriticality.getText();
        const r1 = await utils.getAssignedValue(riskAndCriti);
        console.log("Assigned risk and criticality : "+r1);

        const assetStraRBI = await this.assetStrategyRBI.getText();
        const as1 = await utils.getAssignedValue(assetStraRBI);
        console.log("Assigned asset strategy RBI : "+as1);

        const assetStraRCM = await this.assetStrategyRCM.getText();
        const as2 = await utils.getAssignedValue(assetStraRCM);
        console.log("Assigned asset strategy RCM: "+as2);

        const astInsp = await this.assetInsp.getText();
        const ai1 = await utils.getAssignedValue(astInsp);
        console.log("Assigned asset Inspection : "+ai1);

        const finding = await this.findings.getText();
        const f = await utils.getAssignedValue(finding);
        console.log("Assigned findings : "+f);

        const recommendations = await this.recommend.getText();
        const r = await utils.getAssignedValue(recommendations);
        console.log("Assigned recommendations : "+r);
    }

    public async verifyRiskSummary() {
        console.log("Navigating to Risk Summary Tab");
        await browser.pause(4000);
        await utils.switchToIframe(this.equipmentIframe);
        await utils.clickWithWait(this.riskSection);
        await this.riskSection.waitForDisplayed({ timeout: 30000 });
        console.log("Navigated to Risk Summary Tab successfully");
        await browser.pause(4000);
        const riskProfile = await this.riskProfile.getText();
        const rp = await utils.getAssignedValue(riskProfile);
        console.log("Assigned risk profile : "+rp);

        const component = await this.component.getText();
        const c = await utils.getAssignedValue(component);
        console.log("Assigned component: "+c);

        const recommendation = await this.recommendation.getText();
        const recom = await utils.getAssignedValue(recommendation);
        console.log("Assigned reocmmendatios: "+recom);

    } 

    async deleteEquipment(){
        console.log("Deleting the Equipment");
        console.log("Capturing Equipment header value for Deletion");

        await utils.switchToIframe(this.equipmentIframe);
        await browser.pause(4000);

        const { equipmentName, actualId } = await this.getEquipmentFinalIDs();

        this.equipmentHeadValue = equipmentName;
        this.displayID = actualId;

        console.log(`Final → Equipment="${equipmentName}" | DisplayID="${actualId}"`);

        await utils.switchToIframe(this.equipmentIframe);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForObjectPageHeader();
        await browser.pause(5000);

        await this.deleteBtn.waitForExist({ timeout: 30000 });
        await this.deleteBtn.waitForDisplayed({ timeout: 30000 });

        console.log("Clicking Delete...");
        await utils.clickWithWait(this.deleteBtn,3000);
        await utils.clickWithWait($("//header[.//text()='Confirmation']/following::bdi[text()='OK']"),3000);

        await utils.waitForBusyIndicatorToDisappear();

        console.log("Equipment deletion in progress");
        console.log("Waiting for deletion to complete...");
        console.log("Deletion completed, confirming deletion");
    }
    
    public async getEquipmentFinalIDs() {
        let equipmentName = "";
        let actualId = "";

        const expandBtn = await $("(//span[text()='Expand Header']/preceding-sibling::span//span)[2]");
        const collapseBtn = await $("(//span[text()='Collapse Header']/preceding-sibling::span//span)[2]");

        for (let i = 0; i < 3; i++) {

            if (i === 0 && await expandBtn.isDisplayed()) {
                await expandBtn.waitForClickable({ timeout: 5000 });
                await expandBtn.click();
            } 
            else if (i === 1 && await collapseBtn.isDisplayed()) {
                await collapseBtn.waitForClickable({ timeout: 5000 });
                await collapseBtn.click();
            }

            await browser.pause(500);

            const headerText = await this.getEquipmentHeaderId();
            const displayText = await this.getEquipmentDisplayId();

            if (!equipmentName && headerText) equipmentName = headerText;
            if (!actualId && displayText) actualId = displayText;

            console.log(`Attempt ${i + 1} → Equipment="${equipmentName || 'EMPTY'}" | DisplayID="${actualId || 'EMPTY'}"`);

            if (equipmentName && actualId) break;
        }

        return { equipmentName, actualId };
    }

    public async getEquipmentDisplayId() {
        try {
            const txt = await browser.execute(() => {
                const el = document.evaluate(
                    "//bdi[text()='Display ID: ']/ancestor::span[2]/following-sibling::span",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                return el ? (el.textContent || "") : "";
            });

            return txt ? txt.replace("Display ID:", "").trim() : "";
        } catch (e) {
            return "";
        }
    }

    public async getEquipmentHeaderId() {
        const xpath = "//header//*[@role='heading']//span";
        let found = false;

        try {
            await browser.waitUntil(async () => {
                const els = await $$(xpath);
                if (!els.length) return false;

                for (let el of els) {
                    let txt = (await el.getText()) ?? "";
                    if (!txt) txt = (await el.getAttribute("innerText")) ?? "";
                    txt = txt?.trim();

                    if (txt && (txt.endsWith("AUTO") || txt.endsWith("EQUIP-AUTO"))) {
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
            console.log("Equipment header not visible in this attempt");
        }

        if (!found) return "";

        const spans = await $$(xpath);
        for (let el of spans) {
            let txt = (await el.getText()) ?? "";
            if (!txt) txt = (await el.getAttribute("innerText")) ?? "";
            txt = txt?.trim();

            if (txt && (txt.endsWith("AUTO") || txt.endsWith("EQUIP-AUTO"))) {
                return txt;
            }
        }
        return "";
    }

    public async verifyHeader(): Promise<void> {
        console.log("Verifying Equipment name");
        const expectedEquipmentName = EquipmentListviewPage.createdEquipmentName;
        console.log(`Expected Equipment header: ${expectedEquipmentName}`);
        console.log("Waiting for visible Equipment header title element");
 
        await browser.waitUntil(async () => {
            const headingSpans = await this.equipmentHeaderTitleSpans;
            for (const span of headingSpans) {
                if (await span.isDisplayed()) {
                    const headingText = (await span.getText())?.trim();
                    if (headingText === expectedEquipmentName) {
                        return true;
                    }
                }
            }
            return false;
        }, {
            timeout: 30000,
            interval: 500,
            timeoutMsg: `Equipment header '${expectedEquipmentName}' was not visible in Object Page header`
        });
 
        let actualVisibleHeader = "";
        const headingSpans = await this.equipmentHeaderTitleSpans;
        for (const span of headingSpans) {
            if (await span.isDisplayed()) {
                const headingText = (await span.getText())?.trim();
                if (headingText) {
                    actualVisibleHeader = headingText;
                    break;
                }
            }
        }
 
        console.log(`Actual Equipment header: ${actualVisibleHeader}`);
        await expect(actualVisibleHeader).toEqual(expectedEquipmentName);
        console.log("Equipment name matches header name");
    }
 
    public async editHeader(): Promise<void> {
        console.log("Editing header's Information");
        await utils.clickWithWait(this.equipmentEditHeader);
        await utils.setValueWithWait(this.equipmentDescEditHeader, "Equipment header updated by automation");
        await utils.clickWithWait(this.equipmentCategoryEditHeader);
        await this.equipmentCategoryDialog.waitForDisplayed({ timeout: 30000 });
 
        console.log("selecting first available category option");
        await this.equipmentFirstCategoryChoose.scrollIntoView();
        await utils.clickWithWait(this.equipmentFirstCategoryChoose);
       
        await utils.clickWithWait(this.equipmentCategorySave);
        await utils.clickWithWait(this.equipmentHeaderSave);
        console.log("Header save clicked, waiting for success message");
        await this.equipmentHdSaveSucc.waitForDisplayed({ timeout: 30000 });
        console.log("Header update success message displayed");
        await utils.clickWithWait(this.equipmentHdOkBtn);
        console.log("Success dialog acknowledged with OK");
        console.log("Header edited successfully");
 
        await browser.pause(5000);
    }

    public async verifyMainAndSum() {
        console.log("Navigating to Maintenance and Service Tab");
        await utils.clickWithWait(this.mainAndServiceSection);
        await this.mainAndServiceSection.waitForDisplayed({ timeout: 30000 });
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Navigated to Maintenance and Service successfully");

        // const maintainNoti = await this.maintainNoti.getText();
        // const mn = await utils.getAssignedValue(maintainNoti);
        // console.log(" Assigned Maintenance Notification : "+mn);

        const maintainOrder = await this.maintainOrder.getText();
        const mo = await utils.getAssignedValue(maintainOrder);
        console.log(" Assigned Maintenance Order: "+mo);

        const maintainPlan = await this.maintainPlan.getText();
        const mp = await utils.getAssignedValue(maintainPlan);
        console.log(" Assigned Maintenance Plan: "+mp);

        const recomWrk = await this.recomWrk.getText();
        const rw = await utils.getAssignedValue(recomWrk);
        console.log(" Assigned recommendations: "+rw);

        const maintaintask = await this.maintaintask.getText();
        const mt = await utils.getAssignedValue(maintaintask);
        console.log(" Assigned Maintenance Task: "+mt);
    }
    
    public async verifyChangeHistory() {
            console.log("Editing header's Information for change history check");
            await utils.clickWithWait(this.changeHistoryEditHeader);
            await utils.setValueWithWait(
                this.descEditHeader,
                await utils.generateRandomFuncDescName()
            );
            const enteredDesc = await this.descEditHeader.getValue();
            await utils.clickWithWait(this.categoryEditHeader);
            await this.category.waitForDisplayed({ timeout: 30000 });
            await this.ctgChoose.scrollIntoView();
            let selectedCategory = "";
            const sElem = $("//span[text()='S']/ancestor::tr//td[2]//*[name()='circle'][2]/ancestor::div[@aria-checked='false']");
            if (await sElem.isExisting()) {
                await utils.clickWithWait(sElem);
                selectedCategory = "S";
            } else {
                const mElem = $("//span[text()='M']/ancestor::tr//td[2]//*[name()='circle'][2]");
                await utils.clickWithWait(mElem);
                selectedCategory = "M";
            }
            await utils.clickWithWait(this.ctgSave);
            await utils.clickWithWait(this.headerSave);
            await this.hdSaveSucc.waitForDisplayed({ timeout: 30000 });
            await utils.clickWithWait(this.hdOkBtn);
            console.log("Header edited successfully");
    
            console.log("Navigating to Change History tab");
            await utils.clickWithWait(this.chngHist);
            await utils.waitForBusyIndicatorToDisappear();
            await this.chngHist.waitForDisplayed({ timeout: 30000 });
            console.log("Navigated to Change History tab successfully");
            console.log("Fetching latest change history entry");
            const latestCngHst = await $("(//ul/li//div[2]/div/span)[1]");
            await latestCngHst.waitForDisplayed();
            console.log("Latest change history entry fetched successfully");
            const text = await latestCngHst.getText();
            console.log("Change History Text:\n", text);
            console.log("Validating change history entry");
            const lines = text.split('\n').map(l => l.trim()).filter(l => l);
            console.log("Extracted Lines from Change History Entry:");
            const categoryLine = lines.find(l => l.toLowerCase().includes('category'));
            const descLine = lines.find(l => l.toLowerCase().includes('description'));
    
            if (!categoryLine || !categoryLine.includes(selectedCategory)) {
                throw new Error(
                    `Category mismatch. Expected: ${selectedCategory}, Found: ${categoryLine}`
                );
            }
            if (!descLine || !descLine.includes(enteredDesc)) {
                throw new Error(
                    `Description mismatch. Expected: ${enteredDesc}, Found: ${descLine}`
                );
            }
            console.log("Change history validation passed successfully");
        }
}
export default new EquipmentDetailPage();