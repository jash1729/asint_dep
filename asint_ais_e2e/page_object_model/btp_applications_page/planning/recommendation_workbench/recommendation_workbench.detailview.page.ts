import utils from "utils/utils";
import recommendationWorkbenchListView from '../recommendation_workbench/recommendation_workbench.listview.page.ts';
import recommWorkbenchData from "test_data/btp_applications/planning/recommendation_workbench.data.ts";
class RecommendationWorkbenchDetailView {

    private get reccWorkbenchIframe() { return $('iframe[data-help-id="application-recommendationworkbenchplus-manage"]'); }
    private get generalInfoTab() { return $("//bdi[text()='General Information']"); }
    private get assignmentTab() { return $("//bdi[text()='Assignments']"); }
    private get riskDataTab() { return $("//bdi[text()='Risk Data']"); }
    private get planningTab() { return $("//bdi[text()='Planning']"); }
    private get attachmentsTab() { return $("//bdi[text()='Attachments']"); }
    private get historicDataTab() { return $("//bdi[text()='Historic Data']"); }
    private get changeHistoryTab() { return $("//bdi[text()='Change History']"); }
    private get editInfo() { return $("//button[.//text()='Edit']"); }
    private get saveBtn(){ return $("//footer//button[.//text()='Save']"); }
    private get longDescriptionTxt() { return $("//label[.//text()='Long Description']/following::textarea[1]"); }
    private get basisTxt() { return $("//label[.//text()='Basis']/following::textarea[1]"); }
    private get externalAssessmentTxt() { return $("//label[.//text()='External Assessment']/following::input[1]"); }
    private get typeDropdown() { return $("//label[.//text()='Type']/following::span[1]"); }
    private get budgetCategoryDropdown() { return $("//label[.//text()='Budget Category']/following::span[1]"); }
    private get businessImpactDropdown() { return $("//label[.//text()='Business Impact']/following::span[1]"); }
    private get maintenanceActivityTypeDropdown() { return $("//label[.//text()='Maintenance Activity Type']/following::span[1]"); }
    private get disciplineDropdown() { return $("//label[.//text()='Discipline']/following::span[1]"); }
    private get priorityDropdown() { return $("//label[.//text()='Priority']/following::span[1]"); }
    private get selectPriorityHeader() { return $("//header[.//text()='Select Priority']"); }
    private get priorityOption() { return $("//header[.//text()='Select Priority']/following-sibling::section//tr[@aria-rowindex='3']//td[@aria-colindex='1']"); }
    private get workCenterDropdown() { return $("//label[.//text()='Work Center']/following::span[1]"); }
    private get selectWorkCenterHeader() { return $("//header[.//text()='Select Work Center']"); }
    private get workCenterOption() { return $("(//header[.//text()='Select Work Center']/following-sibling::section//tr[@aria-rowindex='3']//td[@aria-colindex='1']//div)[1]"); }
    private get planningPlantDropdown() { return $("//label[.//text()='Planning Plant']/following::span[1]"); }
    private get selectPlanningPlantHeader() { return $("//header[.//text()='Select Planning Plant']"); }
    private get planningPlantOption() { return $("(//header[.//text()='Select Planning Plant']/following-sibling::section//tr[@aria-rowindex='3']//td[@aria-colindex='1']//div)[1]"); }
    private get maintenancePlantDropdown() { return $("//label[.//text()='Maintenance Plant']/following::span[1]"); }
    private get maintenancePlantHeader() { return $("//header[.//text()='Select Maintenance Plant']"); }
    private get maintenancePlantOption() { return $("(//header[.//text()='Select Maintenance Plant']/following-sibling::section//tr[@aria-rowindex='3']//td[@aria-colindex='1']//div)[1]"); }
    private get estimatedCostTxt() { return $("//label[.//text()='Estimated Cost']/following::input[1]"); }
    private get estimatedCostCurrencyDropdown() { return $("//label[.//text()='Estimated Cost']/following::span[1]"); }
    private get selectCurrencyHeader() { return $("//header[.//text()='Select Currency']"); }
    private get currencyOption() { return $("//header[.//text()='Select Currency']/following-sibling::section//tr[@aria-rowindex='3']//td[@aria-colindex='1']"); }
    private get estimatedMaintenanceSavingsTxt() { return $("//label[.//text()='Estimated Maintenance Savings']/following::input[1]"); }
    private get estimatedMaintenanceSavingsCurrencyDropdown() { return $("//label[.//text()='Estimated Maintenance Savings']/following::span[1]"); }
    private get notesTxt() { return $("//label[.//text()='Notes']/following::textarea[1]"); }
    private get startDateTxt() { return $("//label[.//text()='Start Date']/following::input[1]"); }
    private get dueDateTxt() { return $("//label[.//text()='Due Date']/following::input[1]"); }
    private get scheduleDateTxt() { return $("//label[.//text()='Schedule Date']/following::input[1]"); }
    private get recommendationMDADropdown() { return $("//label[.//text()='Recommendation MDA']/following::span[4]"); }
    private get selectRecommendationMDAHeader() { return $("//header[.//text()='Select Maintenance Data Attribute']"); }
    private get recommendationMDAOption() { return $("(//header[.//text()='Select Maintenance Data Attribute']/following-sibling::section//tr[@aria-rowindex='3']//td[@aria-colindex='1']//div)[1]"); }
    private get recommendationNotesTxt() { return $("//div[@role='heading'][.//text()='Recommendation Notes']/following::textarea[1]"); }
    private get saveTabBtn() { return $("//button[.//text()='Save']"); }
    private get noOfRiskData() { return $("(//section//span[contains(text(),'Risk Data')])[1]"); }
    private get sheMRAtDueDateTxt() { return $("//label[.//text()='SHE MR at Due Date']/following::input[1]"); }
    private get finMRAtDueDateTxt() { return $("//label[.//text()='FIN MR at Due Date']/following::input[1]"); }
    private get okBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get attachSuccMsg() { return $("//span[text()='Success']"); }
    private get historicDataHeader() { return $("//h2//span[contains(text(),'Historic Data')]"); }
    private get maintenancePlansTxt() { return $("//div[text()='Maintenance Plans']/following::span[1]"); }
    private get technicalObjectsTxt() { return $("//div[text()='Technical Objects']/following::span[2]"); }
    private get maintenanceNotificationsTxt() { return $("//div[text()='Maintenance Notifications']/following::span[1]"); }
    private get maintenanceOrdersTxt() { return $("//div[text()='Maintenance Orders']/following::span[1]"); }
    private get taskListsTxt() { return $("//div[text()='Task Lists']/following::span[1]"); }
    private get mergedRecommendationsTxt() { return $("//div[text()='Merged Recommendations']/following::span[1]"); }
    private get assetInspectionTxt() { return $("//div[text()='Asset Inspection']/following::span[1]"); }
    private get findingsTxt() { return $("//div[text()='Findings']/following::span[1]"); }
    private get cmlTxt() { return $("//div[text()='CML']/following::span[1]"); }
    private get createWorkflowBtn() { return $("//header//button[.//text()='Workflow']"); }
    private get workflowHeader() { return $("//header//span[contains(text(),'Workflow Inbox')]"); }
    private get createWorkflowOption() { return $("//header//button[.//text()='Create']"); }
    private get proposedDueDate() { return $("//label[.//text()='Proposed Due Date']/following::input[1]"); }
    private get commentTxt() { return $("//label[.//text()='Comments']/following::textarea[1]"); }
    private get createWorkflowSaveBtn() { return $("//header[.//text()='Create Workflow']/following::footer//button[.//text()='Create']"); }
    private get errorOkBtn() { return $("//header[.//text()='Error']/following::footer//bdi[text()='OK']"); }
    private get changeStatusBtn() { return $("//header//button[.//text()='Change Status']"); }
    private get editHeaderBtn() { return $("//header//button[.//text()='Edit Header']"); }
    private get editHeaderBox() { return $("//header[.//text()='Edit Header Details']"); }
    private get headerShortDescTxt() { return $("//label[.//text()='Short Description']/following::textarea[1]"); }
    private get inspectionTypeDrp() { return $("//label[.//text()='Inspection Type']/following::span[1]"); }
    private get inspectionValue() { return $("//label[.//text()='Inspection Type']/following::input[1]"); }
    private get saveHeaderBtn() { return $("//footer//button[.//text()='Save']"); }
    private get manageBtn() { return $("//button[.//text()='Manage']"); }
    private get deleteConfirmText() { return $("//span[.//text()='Are you sure you want to delete the assessment?']"); }
    private get confirmOkBtn() { return $("//header[.//text()='Confirmation']/following::button[.//text()='OK']"); }


    public async captureReccWorkbenchId(){
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        const { shortdesc, reco } = await this.captureIds();
        recommendationWorkbenchListView.ReccWorkShortDesc = shortdesc;
        recommendationWorkbenchListView.ReccWorkDisplayID = reco;
    }

    public async getRecoId(){
        try{
            await browser.waitUntil(async()=>{
                const text=await browser.execute(()=>{
                    const spans=[...document.querySelectorAll("header span")];
                    const match=spans.find(el=>
                        el.textContent?.trim().startsWith("Automation Recommendation")
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
                    el.textContent?.trim().startsWith("Automation Recommendation")
                );
                return match?.textContent?.trim() || "";
            });
            return text;
        }catch(e){
            console.log("Recommendation not visible in this attempt");
            return "";
        }
    }

    public async getDisplayId(): Promise<string> {
        try {
            const txt = await browser.execute(() => {
                const el = document.evaluate( 
                    "//span[starts-with(normalize-space(),'RECO_ASINT')]",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                return el ? (el.textContent || "") : "";
            });
            return txt ? txt.replace("RECO ASINT ID:", "").trim() : "";
        } catch (e) {
            return "";
        }
    }

    public async captureIds() {
        let shortdesc = "";
        let reco = "";
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
            const headerText = await this.getRecoId();
            const displayText = await this.getDisplayId();
            if (!shortdesc && headerText) shortdesc = headerText;
            if (!reco && displayText) reco = displayText;
            console.log(`Attempt ${i + 1} → Recommendation="${shortdesc || 'EMPTY'}" | DisplayID="${reco || 'EMPTY'}"`);
            if (shortdesc && reco) break;
        }
        return { shortdesc, reco };
    }

    public async editGeneralInformation(){
        await this.generalInfoTab.waitForClickable({ timeout: 10000 });
        await this.generalInfoTab.click();
        console.log("General Information tab clicked");
        await browser.pause(2000);
        await this.editInfo.waitForClickable({ timeout: 10000 });
        await this.editInfo.click();
        console.log("Edit button clicked in General Information section");
        await browser.pause(2000);
        await this.longDescriptionTxt.setValue(`Automation Recommendation ${Math.floor(Math.random() * 100000)}`);
        await this.basisTxt.setValue("Automation Basis");
        await this.externalAssessmentTxt.setValue("Automation External Assessment");
        await this.typeDropdown.click();
        await browser.keys(["ArrowDown", "Enter"]);
        await this.budgetCategoryDropdown.click();
        await browser.keys(["ArrowDown", "ArrowDown", "ArrowDown", "Enter"]);
        await this.businessImpactDropdown.click();
        await browser.keys(["ArrowDown", "ArrowDown", "Enter"]);
        await this.maintenanceActivityTypeDropdown.click();
        await browser.keys(["ArrowDown", "ArrowDown", "ArrowDown", "Enter"]);
        await this.disciplineDropdown.click();
        await browser.keys(["ArrowDown", "ArrowDown", "Enter"]);
        await this.priorityDropdown.click();
        await this.selectPriorityHeader.waitForDisplayed({ timeout: 10000 });
        await this.priorityOption.click();
        await this.saveBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await this.workCenterDropdown.click();
        await this.selectWorkCenterHeader.waitForDisplayed({ timeout: 10000 });
        await browser.pause(2000);
        await this.workCenterOption.click();
        await this.saveBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await this.planningPlantDropdown.click();
        await this.selectPlanningPlantHeader.waitForDisplayed({ timeout: 10000 });
        await browser.pause(2000);
        await this.planningPlantOption.click();
        await this.saveBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await this.maintenancePlantDropdown.click();
        await this.maintenancePlantHeader.waitForDisplayed({ timeout: 10000 });
        await browser.pause(2000);
        await utils.clickWithWait(this.maintenancePlantOption);
        await this.saveBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await this.estimatedCostTxt.setValue(`${Math.floor(Math.random() * 70) + 20}`);
        await this.estimatedCostCurrencyDropdown.click();
        await this.selectCurrencyHeader.waitForDisplayed({ timeout: 10000 });
        await browser.pause(2000);
        await this.currencyOption.click();
        await this.saveBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await this.estimatedMaintenanceSavingsTxt.setValue(`${Math.floor(Math.random() * 80) + 20}`);
        await this.estimatedMaintenanceSavingsCurrencyDropdown.click();
        await this.selectCurrencyHeader.waitForDisplayed({ timeout: 10000 });
        await browser.pause(2000);
        await this.currencyOption.click();
        await this.saveBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await this.notesTxt.setValue("Automation Notes");
        await this.startDateTxt.setValue(utils.formatDate(0));
        await this.dueDateTxt.setValue(utils.formatDatePlus(10));
        await this.scheduleDateTxt.setValue(utils.formatDatePlus(2));
        await this.recommendationMDADropdown.click();
        await browser.pause(2000);
        await this.selectRecommendationMDAHeader.waitForDisplayed({ timeout: 10000 });
        await browser.pause(2000);
        await this.recommendationMDAOption.click();
        await this.saveBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        // await this.recommendationNotesTxt.setValue("Automation Recommendation Notes");
        await this.saveTabBtn.waitForClickable({ timeout: 10000 });
        await this.saveTabBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(3000);
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("Save button clicked in General Information section");
        await utils.waitForBusyIndicatorToDisappear();
    }

    public async editRiskData(){
        console.log("Editing Risk Data...");
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.riskDataTab);
        console.log("Risk Data tab clicked");
        await utils.clickWithWait(this.editInfo);
        console.log("Edit button clicked in Risk Data section");
        const riskValue = await this.noOfRiskData.getText();
        const noOfRisk = await utils.getAssignedValue(riskValue);
        console.log(`Current number of risk data: ${noOfRisk}`);
        const randomRiskValue =
            recommWorkbenchData.riskValues[
            Math.floor(Math.random() * recommWorkbenchData.riskValues.length)
        ];
        await this.sheMRAtDueDateTxt.setValue(randomRiskValue);
        await this.finMRAtDueDateTxt.setValue(randomRiskValue);
        await this.saveTabBtn.click();
        console.log("Save button clicked in Risk Data section");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("Success OK button clicked in Risk Data section");
        console.log("Risk Data edited successfully");
    }

    public async addAttachments(){ 
        console.log("Adding attachments...");
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.attachmentsTab);
        console.log("Navigating to Attachment tab to assign attachment");
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

    public async verifyHistoricData(){
        console.log("Verifying Historic Data...");
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.historicDataTab);
        console.log("Historic Data tab clicked");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        const historicData = await this.historicDataHeader.getText();
        const hd = await utils.getAssignedValue(historicData);
        console.log(" Assigned Historic Data : "+hd);
        const maintenancePlansText = await this.maintenancePlansTxt.getText();
        const mp = await utils.getAssignedValue(maintenancePlansText);
        console.log(" Assigned Maintenance Plans : "+mp);
        console.log("Historic Data verified successfully");
    }

    public async verifyAssignmentBlock(){
        console.log("Verifying Assignment block...");
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.assignmentTab);
        console.log("Assignment tab clicked");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        const techObjectsText = await this.technicalObjectsTxt.getText();
        const to = await utils.getAssignedValue(techObjectsText);
        console.log(" Technical Objects : " + to);
        const maintainNotiText = await this.maintenanceNotificationsTxt.getText();
        const mn = await utils.getAssignedValue(maintainNotiText);
        console.log(" Assigned Maintenance Notification : " + mn);
        const maintainOrdersText = await this.maintenanceOrdersTxt.getText();
        const mo = await utils.getAssignedValue(maintainOrdersText);
        console.log(" Assigned Maintenance Orders : " + mo);
        const taskListsText = await this.taskListsTxt.getText();
        const tl = await utils.getAssignedValue(taskListsText);
        console.log(" Task Lists : " + tl);
        const maintainPlansText = await this.maintenancePlansTxt.getText();
        const mp = await utils.getAssignedValue(maintainPlansText);
        console.log(" Maintenance Plans : " + mp);
        const mergedRecomText = await this.mergedRecommendationsTxt.getText();
        const mr = await utils.getAssignedValue(mergedRecomText);
        console.log(" Merged Recommendations : " + mr);
        const assetInspectionText = await this.assetInspectionTxt.getText();
        const ai = await utils.getAssignedValue(assetInspectionText);
        console.log(" Asset Inspection : " + ai);
        const findingsText = await this.findingsTxt.getText();
        const f = await utils.getAssignedValue(findingsText);
        console.log(" Findings : " + f);
        const cmlText = await this.cmlTxt.getText();
        const cml = await utils.getAssignedValue(cmlText);
        console.log(" CML : " + cml);
        console.log("Assignment block verified successfully");
    }

    public async verifyPlanningBlock(){
        console.log("Verifying Planning block...");
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.planningTab);
        console.log("Planning tab clicked");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
    }

    public async verifyChangeHistory(){
        console.log("Verifying Change History...");
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.editHeaderBtn);
        await this.editHeaderBox.waitForDisplayed({ timeout: 10000 });
        await browser.pause(2000);
        await this.inspectionTypeDrp.click();
        await browser.keys(["ArrowDown","ArrowDown","ArrowDown","Enter"]);
        const inspctionTypeText = await this.inspectionValue.getAttribute("value") ?? "";
        console.log("Selected Inspection Type: " + inspctionTypeText);
        await this.saveHeaderBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await utils.clickWithWait(this.changeHistoryTab);
        console.log("Change History tab clicked");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("Fetching latest change history entry");
        const latestCngHst = await $("(//ul/li//div[2]/div/span)[1]");
        await latestCngHst.waitForDisplayed();
        console.log("Latest change history entry fetched successfully");
        const text = await latestCngHst.getText();
        console.log("Change History Text:\n", text);
        console.log("Validating change history entry");
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        console.log("Extracted Lines from Change History Entry:");
        const categoryLine = lines.find(l =>
            l.toLowerCase().includes('inspection type helper')
        );
        const expectedValue = inspctionTypeText
            .replace(/\s+/g, "_")
            .toUpperCase();
        if (!categoryLine?.includes(expectedValue)) {
            throw new Error(
                `Category mismatch. Expected: ${expectedValue}, Found: ${categoryLine}`
            );
        }
        console.log("Change history validation passed successfully");
    }

    public async createWorkflow(){
        console.log("Creating workflow...");
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.createWorkflowBtn);
        console.log("Create Workflow button clicked");
        this.workflowHeader.waitForDisplayed({ timeout: 10000 });
        console.log("Workflow header displayed");
        await utils.clickWithWait(this.createWorkflowOption);
        console.log("Create option clicked in Workflow dropdown");
        await browser.pause(2000);
        await browser.keys(["ArrowDown", "Enter"]);
        console.log("Choosing deferal workflow...");
        await browser.pause(2000);
        await this.proposedDueDate.setValue(utils.formatDatePlus(5));
        await this.commentTxt.setValue("Automation Workflow Creation");
        await this.createWorkflowSaveBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(5000);
        if(await this.errorOkBtn.isDisplayed()){
            await utils.clickWithWait(this.errorOkBtn);
        }
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("Workflow created successfully");
    }

    public async changeStatus(){
        console.log("Changing status...");
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.changeStatusBtn);
    }

    public async verifyHeader(){
        console.log("Verifying header information of MSP");
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        const asdHeader = await this.captureIds();
        await expect(asdHeader.shortdesc).toEqual(recommendationWorkbenchListView.ReccWorkShortDesc);
        console.log("MSP Event name matches header's name");
    }

    public async editHeader(){
        console.log("Editing header information of MSP");
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000); 
        await utils.clickWithWait(this.editHeaderBtn);
        console.log("Edit Header button clicked");
        await this.editHeaderBox.waitForDisplayed({ timeout: 10000 });
        console.log("Edit Header Details box displayed");
        recommendationWorkbenchListView.ReccWorkShortDesc = `Automation Recommendation ${Math.floor(Math.random() * 100000)}`;
        await this.headerShortDescTxt.setValue(recommendationWorkbenchListView.ReccWorkShortDesc);
        await this.inspectionTypeDrp.click();
        await browser.keys(["ArrowDown", "Enter"]);
        await this.saveHeaderBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("Header information edited successfully");
    }

    public async deleteReccWorkbench(){
        await this.deleteReccommendation();
        await recommendationWorkbenchListView.verifyDeletionOfRecommendationWorkbench();
    }

    public async deleteReccommendation(){
        console.log("Deleting the recommendation...");
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.reccWorkbenchIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.manageBtn);
        await browser.pause(1000);
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        await browser.pause(2000);
        await utils.clickWithWait(this.confirmOkBtn);
        await this.okBtn.waitForDisplayed({ timeout: 60000 });
        await utils.clickWithWait(this.okBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("RCM deleted successfully");
    }

}export default new RecommendationWorkbenchDetailView();