
import utils from "utils/utils";
import MSPListView from './maintenance_spend_planning.listview.page';
class maintenance_detail_view{

    private get mspIframe() { return $('iframe[data-help-id="application-msp-manage"]'); }
    private get MSPEditHeader() { return $("//bdi[text()='Edit Header']"); }
    private get editHeaderTitle() { return $("//h1[.//text()='Edit Header Details']"); }
    private get shortDescriptionInput() { return $("//label[.//text()='Short Description']/following::textarea[1]"); }
    private get longDescriptionTextarea() { return $("//label[.//text()='Long Description']/following::textarea[1]"); }
    private get saveHeader() { return $("//button[.//text()='Save']"); }
    private get generalInfoTab() { return $("//bdi[text()='General Information']"); }
    private get assignmentTab() { return $("//bdi[text()='Assignments']"); }
    private get detailTab() { return $("//bdi[text()='Details']"); }
    private get riskDataTab() { return $("//bdi[text()='Risk Data']"); }
    private get summaryTab() { return $("//bdi[text()='Summary']"); }
    private get attachmentsTab() { return $("//bdi[text()='Attachments']"); }
    private get historicDataTab() { return $("//bdi[text()='Historic Data']"); }
    private get changeHistoryTab() { return $("//bdi[text()='Change History']"); } 
    private get editInfo() { return $("//button[.//text()='Edit']"); }
    private get budgetCategoryDropdown(){ return $("//label[.//text()='Budget Category']/following::span[1]"); }
    private get linkedProgramDropdown(){ return $("//label[.//text()='Linked to Program']/following::span[1]"); }
    private get startDateInput(){ return $("//label[.//text()='Start Date']/following::input[1]"); }
    private get dueDateInput(){ return $("//label[.//text()='Due Date']/following::input[1]"); }
    private get priorityInput(){ return $("//label[.//text()='Priority']/following::input[1]"); }
    private get selectPriorityPopup(){ return $("//h1[.//text()='Select Priority']"); }
    private get priorityRow3Checkbox(){ return $("//header[.//text()='Select Priority']/following-sibling::section//tr[@aria-rowindex='3']//td[@aria-colindex='1']"); }
    private get saveBtn(){ return $("//footer//button[.//text()='Save']"); }
    private get deferralFollowupDropdown(){ return $("//label[.//text()='Deferral Follow-up']/following::span[1]"); }
    private get businessImpactDropdown(){ return $("//label[.//text()='Business Impact']/following::span[1]"); }
    private get saveDetailBtn() { return $("//button[.//text()='Save']"); }
    private get okBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get closeErrBtn() { return $("//footer//button[.//text()='Close']"); }
    private get technicalObjectsCount(){ return $("//div[text()='Technical Objects']/following::span[1]"); }
    private get maintenanceNotificationsCount(){ return $("//div[text()='Maintenance Notifications']/following::span[1]"); }
    private get maintenanceOrdersCount(){ return $("//div[text()='Maintenance Orders']/following::span[1]"); }
    private get taskListsCount(){ return $("//div[text()='Task Lists']/following::span[1]"); }
    private get maintenancePlansCount(){ return $("//div[text()='Maintenance Plans']/following::span[1]"); }
    private get callsCount(){ return $("//div[text()='Calls']/following::span[1]"); }
    private get linkedMSPsCount(){ return $("//div[text()='Linked MSPs']/following::span[1]"); }
    private get localCurrencyDD(){ return $("//label[.//text()='Local Currency']/following::span[1]"); }
    private get selectCurrencyPopup(){ return $("//h1[.//text()='Select Currency']"); }
    private get thirdCurrencyOption(){ return $("//header[.//text()='Select Currency']/following-sibling::section//tr[@aria-rowindex='3']//td[@aria-colindex='1']"); }
    private get localMaintenanceCost(){ return $("//label[.//text()='Local Maintenance Cost']/following::input[1]"); }
    private get localOtherCost(){ return $("//label[.//text()='Local Other Cost']/following::input[1]"); }
    private get localProcessCost(){ return $("//label[.//text()='Local Process Cost']/following::input[1]"); }
    private get localEngineeringCost(){ return $("//label[.//text()='Local Engineering Cost']/following::input[1]"); }
    private get localTotalCost(){ return $("//label[.//text()='Local Total Cost']/following::input[1]"); }
    private get exchangeRateUSD(){ return $("//label[.//text()='Exchange Rate to USD']/following::input[1]"); }
    private get maintenanceCostBasisDD(){ return $("//label[.//text()='Maintenance Cost Estimate Basis']/following::span[1]"); }
    private get finRiskEditBtn(){ return $("//div[text()='FIN Risk']/following::button[.//text()='Edit']"); }
    private get finPofOverrideInput(){ return $("//label[.//text()='FIN POF Override Value']/following::input[1]"); }
    private get finConsOverrideInput(){ return $("//label[.//text()='FIN Consequence Override ($K)']/following::input[1]"); }
    private get mitigatedFinPofInput(){ return $("//label[.//text()='Mitigated FIN POF Override']/following::input[1]"); }
    private get mitigatedFinConsInput(){ return $("//label[.//text()='Mitigated FIN Consequence Override ($K)']/following::input[1]"); }
    private get reoccurringBenefitDD(){ return $("//label[.//text()='Reoccurring Benefit']/following::span[1]"); }
    private get finRiskSaveBtn(){ return $("//div[text()='FIN Risk']/following::button[.//text()='Save']"); }
    private get sheRiskEditBtn(){ return $("//div[text()='SHE Risk']/following::button[.//text()='Edit']"); }
    private get sheRiskDueDateDD(){ return $("//label[.//text()='SHE Risk at Due Date Override']/following::span[1]"); }
    private get sheMrDueDateDD(){ return $("//label[.//text()='SHE MR at Due Date Override']/following::span[1]"); }
    private get sheRiskSaveBtn(){ return $("//div[text()='SHE Risk']/following::button[.//text()='Save']"); }
    private get processStageDD(){ return $("//label[.//text()='Process Stage']/following::span[1]"); }
    private get attachSuccMsg() { return $("//span[text()='Success']"); }
    private get historicDataCount(){ return $("//div[text()='Historic Data']/following::h2//span"); }
    private get maintenancePlanCount(){ return $("//div[text()='Maintenance Plan']/following::span[1]"); }
    private get latestChangeHistoryEntry(){ return $("(//ul/li//div[2]/div/span)[1]"); }
    private get changeStatusBtn() { return $("//button[.//text()='Change Status']"); }
    private get workflowBtn() { return $("//header//button[.//text()='Workflow']"); }
    private get workflowHeader() { return $("//span[contains(text(),'Workflow Inbox')]") };
    private get createWorkflowBtn() { return $("//span[contains(text(),'Workflow Inbox')]/following::button[.//text()='Create']")};
    private get createWorkflowBtn2() { return $("//span[contains(text(),'Create Workflow')]/following::button[.//text()='Create']")};
    private get workflowSuccessMsg() { return $("//span[.//text()='Workflow Created Successfully']"); }

    public async captureMSPId()
    {
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(4000);
        const { shortdesc, mspid } = await this.captureIds(false);
        MSPListView.MSPShortDesc = shortdesc;
        MSPListView.MSPDisplayID = mspid;
    }

    public async getMSPId(){
        try{
            await browser.waitUntil(async()=>{
                const text=await browser.execute(()=>{
                    const spans=[...document.querySelectorAll("header span")];
                    const match=spans.find(el=>
                        el.textContent?.trim().startsWith("Automation MSP")
                    );
                    return match?.textContent?.trim() || "";
                });
                return text!=="";
            },{
                timeout:10000,
                interval:500
            });
            const text=await browser.execute(()=>{
                const spans=[...document.querySelectorAll("header span")];
                const match=spans.find(el=>
                    el.textContent?.trim().startsWith("Automation MSP")
                );
                return match?.textContent?.trim() || "";
            });
            return text;
        }catch(e){
            console.log("MSP not visible in this attempt");
            return "";
        }
    }

    public async getDisplayId(isMSPE: boolean): Promise<string> {
        try {
            const prefix = isMSPE ? "MSPE." : "MSP.";

            await browser.waitUntil(async () => {
                const text = await browser.execute((p) => {
                    const spans = [...document.querySelectorAll("span")];

                    const match = spans.find(el =>
                        el.textContent?.trim().startsWith(p)
                    );

                    return match?.textContent?.trim() || "";
                }, prefix);

                return text !== "";
            }, {
                timeout: 10000,
                interval: 500
            });

            const text = await browser.execute((p) => {
                const spans = [...document.querySelectorAll("span")];

                const match = spans.find(el =>
                    el.textContent?.trim().startsWith(p)
                );

                return match?.textContent?.trim() || "";
            }, prefix);

            return text;

        } catch (e) {
            console.log("Display ID not visible in this attempt");
            return "";
        }
    }

    public async captureIds(isMSPE: boolean) {
        let shortdesc = "";
        let mspid = "";
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
            const headerText = await this.getMSPId();
            const displayText = await this.getDisplayId(isMSPE);
            if (!shortdesc && headerText) shortdesc = headerText;
            if (!mspid && displayText) mspid = displayText;
            console.log(`Attempt ${i + 1} → MSP="${shortdesc || 'EMPTY'}" | DisplayID="${mspid || 'EMPTY'}"`);
            if (shortdesc && mspid) break;
        }
        return { shortdesc, mspid };
    }

    public async verifyHeader()
    {
        console.log("Verifying header information of MSP");
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(4000);
        const asdHeader = await this.captureIds(false);
        await expect(asdHeader.shortdesc).toEqual(MSPListView.MSPShortDesc);
        console.log("MSP name matches header's name");
    }
    
    public async editHeader()
    {
        console.log("Editing header information of ASD");
        await utils.clickWithWait(this.MSPEditHeader);
        await browser.pause(2000);
        await this.editHeaderTitle.waitForDisplayed();
        const newMSPShortDEsc = `Automation_MSP_${Date.now()}`;
        console.log("Setting new short description: " + newMSPShortDEsc);
        await utils.setValueWithWait(this.shortDescriptionInput, newMSPShortDEsc);
        MSPListView.MSPShortDesc = newMSPShortDEsc;
        await utils.setValueWithWait(this.longDescriptionTextarea, "Automation long description");
        await utils.clickWithWait(this.saveHeader);
        await utils.waitForBusyIndicatorToDisappear();
    }

    public async editGeneralInfo()
    {
        console.log("Editing general information...");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(3000);
        await utils.clickWithWait(this.generalInfoTab);
        await utils.clickWithWait(this.editInfo);
        await utils.clickWithWait(this.budgetCategoryDropdown); await browser.keys(["ArrowDown","Enter"]);
        await utils.clickWithWait(this.linkedProgramDropdown); await browser.keys(["ArrowDown","Enter"]);
        await this.startDateInput.setValue(await utils.formatDate(0));
        await this.dueDateInput.setValue(await utils.formatDatePlus(10));
        await utils.clickWithWait(this.priorityInput);
        await this.selectPriorityPopup.waitForDisplayed();
        await utils.clickWithWait(this.priorityRow3Checkbox);
        await utils.clickWithWait(this.saveBtn);
        await utils.clickWithWait(this.deferralFollowupDropdown); await browser.keys(["ArrowDown","Enter"]);
        await utils.clickWithWait(this.businessImpactDropdown); await browser.keys(["ArrowDown","ArrowDown","Enter"]);
        await utils.clickWithWait(this.saveDetailBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        if (await this.okBtn.isDisplayed().catch(() => false)) {
            await this.okBtn.click();
        }
        if(await this.closeErrBtn.isDisplayed().catch(() => false)) {
            console.log("Can not enter the detail in general information section");
            await this.closeErrBtn.click();
        }
        console.log("General information details entered");
    }

    public async editAssigmentsSection()
    {
        console.log("Editing assignment section...");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(3000);
        await utils.clickWithWait(this.assignmentTab);
        const objs: [string, any][] = [
        ["Technical Objects", this.technicalObjectsCount],
        ["Maintenance Notifications", this.maintenanceNotificationsCount],
        ["Maintenance Orders", this.maintenanceOrdersCount],
        ["Task Lists", this.taskListsCount],
        ["Maintenance Plans", this.maintenancePlansCount],
        ["Calls", this.callsCount],
        ["Linked MSPs", this.linkedMSPsCount]
        ];
        for(const [name, el] of objs){
            const txt = await el.getText();
            const val = await utils.getAssignedValue(txt);
            console.log(`${name} present are ${val}`);
        }
        console.log("Assignment section done");
    }

    public async editDetailSection()
    {
        console.log("Editing detail section...");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(2000);
        await utils.clickWithWait(this.detailTab);
        await utils.clickWithWait(this.editInfo);
        await utils.clickWithWait(this.localCurrencyDD);
        await this.selectCurrencyPopup.waitForDisplayed();
        await utils.clickWithWait(this.thirdCurrencyOption);
        await utils.clickWithWait(this.saveBtn);
        await this.localMaintenanceCost.setValue(utils.rand(100,9999).toString());
        await this.localOtherCost.setValue(utils.rand(100,9999).toString());
        await this.localProcessCost.setValue(utils.rand(100,9999).toString());
        await this.localEngineeringCost.setValue(utils.rand(100,9999).toString());
        // await this.localTotalCost.setValue(utils.rand(100,9999).toString());
        await this.exchangeRateUSD.setValue(utils.rand(1,99).toString());
        await utils.clickWithWait(this.maintenanceCostBasisDD);
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        await utils.clickWithWait(this.saveDetailBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.okBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("verification of detail section completed");
    }

    public async editRiskData()
    {
        console.log("Editing risk data...");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(2000);
        await utils.clickWithWait(this.riskDataTab);
        await utils.clickWithWait(this.finRiskEditBtn);
        await this.finPofOverrideInput.setValue(utils.rand(1,99).toString());
        await this.finConsOverrideInput.setValue(utils.rand(1,99).toString());
        await this.mitigatedFinPofInput.setValue(utils.rand(1,99).toString());
        await this.mitigatedFinConsInput.setValue(utils.rand(1,99).toString());
        await utils.clickWithWait(this.reoccurringBenefitDD);
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        await utils.clickWithWait(this.finRiskSaveBtn);
        await utils.clickWithWait(this.okBtn);
        await utils.clickWithWait(this.sheRiskEditBtn);
        await utils.clickWithWait(this.sheRiskDueDateDD);
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        await utils.clickWithWait(this.sheMrDueDateDD);
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        await utils.clickWithWait(this.sheRiskSaveBtn);
        await utils.clickWithWait(this.okBtn);
        console.log("Verified risk data");
    }

    public async editSummary()
    {
        console.log("Editing Summary data...");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(2000);
        await utils.clickWithWait(this.summaryTab);
        await utils.clickWithWait(this.editInfo);
        await utils.clickWithWait(this.processStageDD);
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        const saveSummBtn = await $("//button[.//text()='Save']");
        await utils.clickWithWait(saveSummBtn);
        console.log("Verified summary data");
    }

    async gotoAttachmentsTabAndAssignAttachment() {
        console.log("Navigating to Attachment tab to assign attachment");
        await browser.pause(4000);
        await utils.switchToIframe(this.mspIframe);
        await this.attachmentsTab.waitForDisplayed({ timeout: 50000 });
        await this.attachmentsTab.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(4000);
        const addAttachmentBtn = await $('//section[.//bdi[text()="Attachments"]]/following::bdi[text()="Assign"]');
        const addAttachmentBtn2 = await $('//header[.//bdi[text()="Attachments"]]/following::bdi[text()="Assign"]');
        if(await addAttachmentBtn.isExisting()){
            await utils.clickWithWait(addAttachmentBtn,2000);
        }
        else if(await addAttachmentBtn2.isExisting()){
            await utils.clickWithWait(addAttachmentBtn2,2000);
        }
        await browser.pause(2000);
        await utils.selectCheckboxes(2);
        await utils.clickWithWait($('//footer//button[.//bdi[text()="Assign"]]'),1000);

        await this.attachSuccMsg.waitForDisplayed({
            timeout: 20000,
            timeoutMsg: 'Document assign success message not displayed'
        });

        console.log("Document assign success message displayed");
        await utils.clickWithWait(this.okBtn,1000);
        console.log("Attachment assigned successfully");
    }

    public async verifyHistoricData()
    {
        console.log("Historic + Maintenance count start");
        await utils.clickWithWait(this.historicDataTab);
        await browser.pause(2000);
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(2000);
        const historic = await this.historicDataCount.getText();
        const maintenance = await this.maintenancePlanCount.getText();
        console.log("Historic Data present are:", await utils.getAssignedValue(historic));
        console.log("Maintenance Plan present are:", await utils.getAssignedValue(maintenance));
        console.log("Historic + Maintenance count end");
    }

    public async verifyChangeHistory()
    {
        console.log("Verifying change history...");
        console.log("Editing risk data...");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(2000);
        await utils.clickWithWait(this.riskDataTab);
        await utils.clickWithWait(this.finRiskEditBtn);
        await this.finPofOverrideInput.setValue(utils.rand(1,999).toString());
        await utils.clickWithWait(this.finRiskSaveBtn);
        await utils.clickWithWait(this.okBtn);
        const finValue=(await this.finPofOverrideInput.getAttribute("value")) ?? "";
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("Navigating to change history tab...");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(2000);
        await utils.clickWithWait(this.changeHistoryTab);
        await utils.waitForBusyIndicatorToDisappear();
        await this.latestChangeHistoryEntry.waitForDisplayed();
        const text=await this.latestChangeHistoryEntry.getText();
        console.log("Change History Text :",text);
        const lines=text.split('\n').map(l=>l.trim()).filter(l=>l);
        const finLine=lines.find(l=>l.includes(finValue));
        if(!finLine){
            throw new Error(`FIN POF mismatch. Expected: ${finValue}, Found: ${finLine}`);
        }
        console.log("Validating FIN Risk Change History end");
    }

    public async changeStatus()
    {
        console.log("Changing the MSP status...");
        await utils.clickWithWait(this.changeStatusBtn);
        await browser.pause(2000);
        const day = new Date().getDay();
        if(day === 1 || day === 2)
        {
            console.log("Changing status to Ready for funding...");
            await browser.keys("Enter");
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(3000);
            const fundingStatusElement=$("//bdi[text()='Funding Status: ']/following::span[2]");
            let fundingStatus="";
            if(
                await fundingStatusElement.isDisplayed().catch(()=>false) &&
                await fundingStatusElement.isClickable().catch(()=>false)
            ){
                fundingStatus=(await fundingStatusElement.getText()).trim();
            }else{
                const expandBtn=await $("(//span[text()='Expand Header']/preceding-sibling::span//span)[2]");
                if(await expandBtn.isDisplayed().catch(()=>false)){
                    await expandBtn.waitForClickable({timeout:10000});
                    await expandBtn.click();
                    await browser.pause(2000);
                }
                fundingStatus=(await fundingStatusElement.getText()).trim();
            }
            console.log("Funding Status :",fundingStatus);
            const normalizedStatus = fundingStatus?.trim().replace(/\s+/g, " ");
            if (normalizedStatus !== "Ready for Funding") {
                throw new Error(`Funding Status validation failed. Found: ${normalizedStatus}`);
            }
            console.log("Funding Status validation passed");
        }
        else if(day === 3 || day === 4)
        {
            console.log("Changing status to Planning...");
            await browser.keys("Arrow Down");
            await browser.keys("Enter");
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(1000);
            const changeSts = await $("//h1[.//text()='Change Status']");
            await changeSts.waitForDisplayed();
            const textArea = await $("//label[.//text()='Comment']/following::textarea");
            await utils.setValueWithWait(textArea,"Test");
            const saveBtn = await $("//footer//button[.//text()='Save']");
            await utils.clickWithWait(saveBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(3000);
            const fundingStatusElement=$("//bdi[text()='Funding Status: ']/following::span[2]");
            let fundingStatus="";
            if(
                await fundingStatusElement.isDisplayed().catch(()=>false) &&
                await fundingStatusElement.isClickable().catch(()=>false)
            ){
                fundingStatus=(await fundingStatusElement.getText()).trim();
            }else{
                const expandBtn=await $("(//span[text()='Expand Header']/preceding-sibling::span//span)[2]");
                if(await expandBtn.isDisplayed().catch(()=>false)){
                    await expandBtn.waitForClickable({timeout:10000});
                    await expandBtn.click();
                    await browser.pause(2000);
                }
                fundingStatus=(await fundingStatusElement.getText()).trim();
            }
            console.log("Funding Status :",fundingStatus);
            const normalizedStatus = fundingStatus?.trim().replace(/\s+/g, " ");
            if (normalizedStatus !== "Planning") {
                throw new Error(`Funding Status validation failed. Found: ${normalizedStatus}`);
            }
            console.log("Funding Status validation passed");
            console.log("Status changed to Planning");
        }
        else
        {
            console.log("Changing status to Deferred...");
            await browser.keys("Arrow Down");
            await browser.keys("Arrow Down");
            await browser.keys("Enter");
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(1000);
            const changeSts = await $("//h1[.//text()='Change Status']");
            await changeSts.waitForDisplayed();
            const textArea = await $("//label[.//text()='Comment']/following::textarea");
            await utils.setValueWithWait(textArea,"Test");
            const saveBtn = await $("//footer//button[.//text()='Save']");
            await utils.clickWithWait(saveBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(3000);
            const fundingStatusElement=$("//bdi[text()='Funding Status: ']/following::span[2]");
            let fundingStatus="";
            if(
                await fundingStatusElement.isDisplayed().catch(()=>false) &&
                await fundingStatusElement.isClickable().catch(()=>false)
            ){
                fundingStatus=(await fundingStatusElement.getText()).trim();
            }else{
                const expandBtn=await $("(//span[text()='Expand Header']/preceding-sibling::span//span)[2]");
                if(await expandBtn.isDisplayed().catch(()=>false)){
                    await expandBtn.waitForClickable({timeout:10000});
                    await expandBtn.click();
                    await browser.pause(2000);
                }
                fundingStatus=(await fundingStatusElement.getText()).trim();
            }
            console.log("Funding Status :",fundingStatus);
            const normalizedStatus = fundingStatus?.trim().replace(/\s+/g, " ");
            if (normalizedStatus !== "Deferred") {
                throw new Error(`Funding Status validation failed. Found: ${normalizedStatus}`);
            }
            console.log("Funding Status validation passed");
            console.log("Status changed to Deferred");
        }

    }

    public async createWorkflow()
    {
        console.log("Creating workflow...");
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(2000);
        await utils.clickWithWait(this.workflowBtn);
        await browser.pause(3000);
        await this.workflowHeader.waitForDisplayed({ timeout: 10000 });
        const day = new Date().getDay(); 
        const isdays = day >= 1 && day <= 3;
        if (await this.createWorkflowBtn.isDisplayed().catch(() => false)) {
            if (isdays) {
                console.log("Creating Approval Workflow");
                await utils.clickWithWait(this.createWorkflowBtn);
                await browser.keys("ArrowDown");
                await browser.keys("Enter");
                await browser.pause(2000);
                await utils.clickWithWait(this.createWorkflowBtn2);
                await this.workflowSuccessMsg.waitForDisplayed({ timeout: 10000 });
                console.log("Approval Workflow created");
                await utils.clickWithWait(this.okBtn);
                await browser.pause(2000);
                await utils.waitForBusyIndicatorToDisappear();
            }   
            else {
                console.log("Creating Deferral Workflow");
                await utils.clickWithWait(this.createWorkflowBtn);
                await browser.keys("Enter");
                await browser.pause(2000);
                const proposeDate = await $("//label[.//text()='Proposed Due Date']/following::input[1]");
                await proposeDate.waitForDisplayed();
                await utils.setValueWithWait(proposeDate,utils.formatDatePlus(1));
                const deferralFollowUp = await $("(//label[.//text()='Deferral Follow-up']/following::input[1])[1]");
                await utils.clickWithWait(deferralFollowUp);
                await browser.keys("ArrowDown");
                await browser.keys("Enter");
                const comments = await $("//label[.//text()='Comments']/following::textarea[1]");
                await utils.setValueWithWait(comments,"Testing");
                await utils.clickWithWait(this.createWorkflowBtn2);
                await this.workflowSuccessMsg.waitForDisplayed({ timeout: 10000 });
                console.log("Recommendation Workflow created");
                await utils.clickWithWait(this.okBtn);
                await browser.pause(2000);
                await utils.waitForBusyIndicatorToDisappear();
            }
        } else {
            console.log("Create button not present. Hence, workflow cannot be created");
        }
    }

    public async captureMSPEId()
    {
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(4000);
        const { shortdesc, mspid } = await this.captureIds(true);
        MSPListView.MSPEShortDesc = shortdesc;
        MSPListView.MSPEDisplayID = mspid;
    }

    public async verifyMSPEHeader()
    {
        console.log("Verifying header information of MSP");
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.mspIframe);
        await browser.pause(4000);
        const asdHeader = await this.captureIds(true);
        await expect(asdHeader.shortdesc).toEqual(MSPListView.MSPEShortDesc);
        console.log("MSP Event name matches header's name");
    }
}
export default new maintenance_detail_view();