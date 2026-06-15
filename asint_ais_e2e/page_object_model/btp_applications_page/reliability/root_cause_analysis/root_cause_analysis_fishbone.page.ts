    import { $ } from '@wdio/globals';
    import utils from '../../../../utils/utils';
    import { rcaData } from '../../../../test_data/btp_applications/reliability/root_cause_analysis_data';
    import { clear } from 'node:console';

    class rcaFishbonePage {
        
        private get RCAIframe() { return $('iframe[data-help-id="application-rootcauseanalysis-manage"]'); }
        private get editButton() { return $('//button[.//bdi[text()="Edit"]]'); }
        private get failureOccurrenceDropdownArrow() { return $('//span[@aria-label="Select Options"]'); }
        private get multipleOption() { return $("//span[normalize-space()='Multiple']/ancestor::*[@role='option']"); }
        private get observationField() { return $("//bdi[normalize-space()='Observation']/following::textarea[1]"); }
        private get failureTypeDropdownArrow() { return $("//bdi[normalize-space()='Failure Type']/ancestor::*[contains(@class,'sapMFlexItem')]/following::span[@role='button'][1]"); }
        private get safetyOption() { return $("//span[normalize-space()='Safety']/ancestor::*[@role='option']"); }
        private get longDescriptionField() { return $("//bdi[normalize-space()='Long Description']/following::textarea[1]"); }    
        private get startDateCalendar() { return $("(//input[@aria-roledescription='Date Input'])[1]"); }
        private get endDateCalendar() { return $("(//input[@aria-roledescription='Date Input'])[2]"); }
        private get saveButton1() { return $("//bdi[normalize-space()='Save']/ancestor::button"); }
        private get okButton1() { return $("//button[.//bdi[normalize-space()='OK']]"); }
        private get addRolesButton() { return $("//bdi[normalize-space()='Add Roles']/ancestor::button"); }
        private get reliabilityEngineerCheckbox() { return $("//div[normalize-space()='Reliability Engineer']/ancestor::*[@role='listitem']//*[@role='checkbox']"); }
        private get okButton() { return $("//bdi[normalize-space()='Ok']/ancestor::button"); }
        private get selectUsersValueHelpIcon() { return $('//bdi[text()="Reliability Engineer"]/following::span[@role="button"][1]'); }
        get userSearchInput() { return $('//input[@type="search"]'); }
        selectUserCheckbox(email: string) { return $(`//tr[.//span[text()="${email}"]]//div[@role="checkbox"]`); }
        get userDialogOkBtn() { return $('//button[.//bdi[text()="Ok"]]'); }
        private get saveButton2() { return $("//button[.//bdi[text()='Save']]"); }
        private get technicalObjectsTab() { return $("//button[.//bdi[text()='Technical Objects']]"); }
        private get assignBtn() { return $("//bdi[normalize-space()='Assign']/ancestor::button"); }
        private get firstEquipmentCheckbox() { return $("(//table//tbody/tr)[1]//div[@role='checkbox']"); }   
        private get confirmButton() { return $("//button[.//bdi[normalize-space()='Confirm']]"); }
        private get okButton2() { return $("//button[.//bdi[normalize-space()='OK']]"); }
        private get fishboneAnalysisTab() { return $("//button[.//bdi[text()='Fishbone Analysis']]"); }
        private get saveButton3() { return $("//button[.//bdi[normalize-space()='Save']]"); }
        private get descriptionField() { return $("//bdi[normalize-space()='Description']/ancestor::label/following::input[1]"); }
        private get activityField() { return $("//bdi[normalize-space()='Activity']/ancestor::label/following::input[1]"); }
        private get priorityDropdown() { return $("//bdi[text()='Priority']/ancestor::label/following::span[@role='button'][1]"); }
        private get PriorityOption() { return $("//span[text()='Low']/ancestor::li"); }
        private get assignedDropdown() { return $("//bdi[text()='Assigned To']/ancestor::label/following::span[@role='button'][1]"); }
        private get assignedToInput() { return $("//bdi[text()='Assigned To']/ancestor::label/following::input[@role='combobox'][1]"); }
        private get startDateCalendarIcon() { return $("(//input[@aria-roledescription='Date Input'])[1]"); }
        private get endDateCalendarIcon() { return $("(//input[@aria-roledescription='Date Input'])[2]"); }
        private get technicalObjectDropdown1() { return $("//bdi[text()='Technical Object Type']/ancestor::label/following::span[@role='button'][1]"); }
        private get equipmentOption() { return $("//ul[@role='listbox']//span[text()='Equipment']"); }
        private get equipmentValueHelpIcon() { return $("//bdi[text()='Equipment']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
        private get firstEquipmentRow() { return $("(//tr[contains(@class,'sapMListTblRow')])[2]"); }
        private get assignButton() { return $("//bdi[text()='Assign']/ancestor::button"); }
        // private get addRecommendationButton() { return $("//button[.//bdi[normalize-space()='Add Recommendation']]"); }
        private get technicalObjectDropdown2() { return $("//bdi[text()='Technical Object Type']/ancestor::label/following::span[@role='button'][1]"); }
        private get equipmentHelpIcon2() { return $("//bdi[text()='Technical Object Type']/ancestor::label/following::span[@aria-label='Show Value Help'][1]"); }
        private get firstEquipmentRow2()  { return $("(//tr[@aria-rowindex='2']//div[@role='checkbox'])[1]"); }
        private get equipmentOption2() { return $("(//bdi[text()='Technical Object Type']/ancestor::label/following::*[@role='listbox'][1]//*[normalize-space()='Equipment'])[last()]"); }
        private get shortDescriptionInput() { return $("//bdi[text()='Short Description']/ancestor::label/following::input[1]"); }
        private get longDescriptionInput() { return $("//bdi[text()='Long Description']/ancestor::label/following::textarea[1]"); }
        private get TypeDropdown() { return $("//bdi[text()='Type']/ancestor::label/following::span[@role='button'][1]"); }
        private get typeOption() { return $("//ul[@role='listbox']//li[@role='option']//span[normalize-space()='Improvement']"); }
        private get startDateInput() { return $("//bdi[text()='Start Date']/ancestor::label/following::input[@type='text'][1]"); }
        private get endDateInput() { return $("//bdi[text()='Due Date']/ancestor::label/following::input[@type='text'][1]"); }
        private get saveRecommendationButton() { return $("//button[.//bdi[normalize-space()='Save']]"); }
        private get okButton4() { return $("//button[.//bdi[text()='OK']]"); }
        private get tasksAndRecommendationRab2() { return $("//div[normalize-space()='Task And Recommendations']/ancestor::li[@role='option']"); }
        private get selectedCheckbox() { return $("//tr[.//*[contains(text(),'This is a recommendation')]]//div[@role='checkbox']"); }
        private get editAndUpdateButton() { return $("(//button[.//bdi[normalize-space()='Edit & Update']])[1]"); }
        private get editAndUpdateButton2() { return $("(//button[.//bdi[normalize-space()='Edit & Update']])[2]");}
        private get typeOption2() { return $("//ul[@role='listbox']//li[@role='option']//span[normalize-space()='Reactive']"); }
        private get selectedCheckbox2() {  return $("//tr[.//*[contains(text(),'Task activity details')]]//div[@role='checkbox']"); }
        private get attachmentsSection() { return $('//button[.//bdi[text()="Attachments"]]'); }
        private get attachSuccMsg() { return $("//span[text()='Success']"); }
        private get okBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
        private get maintAndServ() { return $("//bdi[normalize-space()='Maintenance and Service']/ancestor::button"); }
        private get RCAEditHeader() { return $("//bdi[text()='Edit Header']"); }
        private get RCAChngHist() { return $("//bdi[text()='Change History']"); }
        private get rcaDescriptionField() { return $("//bdi[normalize-space()='RCA Description']/following::input[1]"); }
        private get okButton5() { return $("//button[.//bdi[normalize-space()='OK']]"); }
        private get createFishboneEvent() { return $("//div[normalize-space()='Event']"); }
        private get addEventButton() { return $("//div[@title='Add Event']"); }
        private get titleInput() { return $("//label[normalize-space()='Title']/following::input[1]"); }
        private get descriptionInput() { return $("//label[normalize-space()='Description']/following::textarea[1]"); }
        private get saveButton4() { return $("//bdi[normalize-space()='Save']/ancestor::button"); }
        private get humanNode() { return $("//div[contains(@class,'sapMFlexBox')]//*[text()='Environmental']"); }        
        private get addCause() { return $("//div[.//div[normalize-space()='Environmental']]//div[@title='Add Cause']"); }
        private get skillAndCompetencyNode() { return $("//*[contains(text(),'Skill & Competency')]/ancestor::div[2]"); }
        private get probableCauseDescription() { return $("//span[normalize-space()='Description']/ancestor::label/following::textarea[1]"); }
        private get plusIconButton() { return $("//div[@title='Add']"); }
        private get recommendationOption() { return $("//div[normalize-space()='Recommendation']"); }
        private get taskOption() { return $("//div[normalize-space()='Task']"); }
        private get closeButton() { return $("//button[.//bdi[normalize-space()='Close']]"); }
        get closeButton2() { return $('//button[.//bdi[text()="Cancel"]]'); }
        private get manageButton() { return $("//button[.//bdi[normalize-space()='Manage']]"); }
        private get yesButton() { return $("//button[.//bdi[normalize-space()='Yes']]"); }

        async verifyOnRCADetailPage(): Promise<boolean> {
            try {
                const detailHeader = $('//div[contains(@class, "sapMPageHeader")]');
                await detailHeader.waitForDisplayed({ timeout: 15000 });
                return true;
            } catch {
                return false;
            }
        }

        async verifyHeader(): Promise<boolean> {
            try {
                const header = $('//header');
                return await header.isDisplayed();
            } catch {
                return false;
            }
        }

        async clickEditButton() {
            await utils.switchToIframe(this.RCAIframe);
            await browser.pause(1000);
            await this.editButton.waitForClickable({ timeout: 15000 });
            await utils.clickWithWait(this.editButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Edit button clicked successfully");
        }

        async selectFailureOccurrenceMultiple() {
            await browser.pause(1000);
            await this.failureOccurrenceDropdownArrow.waitForClickable({ timeout: 15000 });
            await utils.clickWithWait(this.failureOccurrenceDropdownArrow);
            await browser.pause(1000);
            await this.multipleOption.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.multipleOption);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Multiple option selected successfully");
        }

        async enterObservation() {
            await utils.setValueWithWait(this.observationField, rcaData.observation);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Observation entered successfully");
        }

        async selectFailureTypeSafety() {
            await utils.switchToIframe(this.RCAIframe);
            await browser.pause(3000);
            await utils.clickWithWait(this.failureTypeDropdownArrow);
            await browser.pause(2000);
            await this.safetyOption.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.safetyOption);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Safety selected in Failure Type successfully");
        }

        async enterLongDescription() {
            await utils.setValueWithWait(this.longDescriptionField, rcaData.longDescription);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Long Description entered successfully");
        }

        async selectDates() {
            await utils.clickWithWait(this.startDateCalendar);
            await utils.setValueWithWait(this.startDateCalendar, utils.formatDate(2));
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Start Date entered successfully");

            await utils.clickWithWait(this.endDateCalendar);   
            await utils.setValueWithWait(this.endDateCalendar, utils.formatDatePlus(7));
            await utils.waitForBusyIndicatorToDisappear();
            console.log("End Date entered successfully");
            
        }

        async clickSaveButton() {
            await utils.clickWithWait(this.saveButton1);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Save button clicked successfully");
            await utils.clickWithWait(this.okButton1);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("OK button clicked successfully");

        }

        async clickAddRolesButton() {
            await utils.clickWithWait(this.addRolesButton);
            await this.reliabilityEngineerCheckbox.waitForClickable({ timeout: 10000 });
            await utils.clickWithWait(this.reliabilityEngineerCheckbox);
            await utils.clickWithWait(this.okButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Reliability Engineer role added successfully");

            await utils.clickWithWait(this.selectUsersValueHelpIcon);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Select Users value help icon clicked successfully");
            await this.userSearchInput.waitForDisplayed({ timeout: 10000 });
            await utils.setValueWithWait(this.userSearchInput, rcaData.userEmail);
            const userCheckbox = this.selectUserCheckbox(rcaData.userEmail);

            await userCheckbox.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(userCheckbox);
            await this.userDialogOkBtn.waitForClickable({ timeout: 10000 });
            await utils.clickWithWait(this.userDialogOkBtn);
            await utils.waitForBusyIndicatorToDisappear();

            await utils.clickWithWait(this.saveButton2);
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickWithWait(this.okButton2);
            console.log("Reliability Engineer user assigned successfully");
        } 

        async clickTechnicalObjectsTab2() {
            await utils.switchToIframe(this.RCAIframe);
            await this.technicalObjectsTab.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.technicalObjectsTab);
            await browser.pause(2000);
            console.log("Technical Objects tab clicked successfully");
            
            await utils.clickWithWait(this.assignBtn);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Assign button clicked successfully");     
            // await browser.keys("ArrowDown");
            await browser.keys("Enter");
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Equipment option selected successfully");
            await browser.pause(4000);
            await utils.waitForBusyIndicatorToDisappear();
            await this.firstEquipmentCheckbox.waitForClickable({ timeout: 10000 });

            await utils.clickWithWait(this.firstEquipmentCheckbox);
            await utils.clickWithWait(this.confirmButton);
            await utils.waitForBusyIndicatorToDisappear();

            await utils.clickWithWait(this.okButton1);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("OK button clicked successfully");
        }   


        async clickFishBoneAnalysisTab() {
            await browser.pause(4000);
            await utils.switchToIframe(this.RCAIframe);
            await this.fishboneAnalysisTab.waitForDisplayed({ timeout: 50000 });
            await this.fishboneAnalysisTab.click();
            await browser.pause(2000);
            console.log("Fishbone Analysis tab clicked successfully");
        }

        async createFishboneEventNode() {
            await this.createFishboneEvent.waitForDisplayed({ timeout: 20000 });
            await utils.clickWithWait(this.createFishboneEvent);
            console.log("Event node clicked");

            await this.addEventButton.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.addEventButton);
            console.log("Add Event button clicked");

            await this.titleInput.waitForDisplayed({ timeout: 10000 });
            await utils.setValueWithWait(this.titleInput, rcaData.eventTitle);
            console.log("Title entered");

            await utils.setValueWithWait(this.descriptionInput, rcaData.eventDescription1);
            console.log("Description entered");

            await utils.clickWithWait(this.saveButton4);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Fishbone Event saved successfully");

            await utils.clickWithWait(this.okButton5)
            await utils.waitForBusyIndicatorToDisappear();
            console.log("OK Button clicked");
        }

        async addProbableCauseNode() {

            await utils.switchToIframe(this.RCAIframe);
            await browser.pause(3000);
            await utils.waitForBusyIndicatorToDisappear();
            await this.humanNode.waitForDisplayed({ timeout: 15000 });
            await utils.scrollAndClick(this.humanNode);
            console.log("Human node clicked successfully");

            await this.addCause.waitForDisplayed({ timeout: 10000 });
            await this.addCause.waitForClickable({ timeout: 10000 });
            await utils.clickWithWait(this.addCause);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Add option clicked successfully");

            const categoryOption = $(
                `//*[normalize-space()='${rcaData.probableCauseCategory}']`
            );
            await categoryOption.waitForDisplayed({ timeout: 10000 });
            await categoryOption.waitForClickable({ timeout: 10000 });
            await utils.clickWithWait(categoryOption);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Probable Cause category selected successfully");

            await this.probableCauseDescription.waitForDisplayed({ timeout: 10000 });
            await utils.setValueWithWait(this.probableCauseDescription, rcaData.probableCauseDescription);
            console.log("Probable Cause description entered");

            await utils.clickWithWait(this.saveButton4);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Probable Cause saved successfully");

            await utils.clickWithWait(this.okButton5);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("OK Button clicked");


            await utils.switchToIframe(this.RCAIframe);
            await this.skillAndCompetencyNode.waitForDisplayed({
                timeout: 20000
            });

            await utils.clickWithWait(this.skillAndCompetencyNode);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Skill & Compentancy node clicked successfully");

            await this.plusIconButton.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.plusIconButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Add button clicked");

            await this.recommendationOption.waitForExist({ timeout: 10000 });
            await utils.clickWithWait(this.recommendationOption);
            await browser.pause(4000);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Recommendation button clicked");

            await utils.clickWithWait(this.technicalObjectDropdown2);
            await this.equipmentOption2.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.equipmentOption2);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Technical Object Type 'Equipment' selected successfully");

            await utils.clickWithWait(this.equipmentHelpIcon2);
            await utils.waitForBusyIndicatorToDisappear();

            await browser.pause(4000);
            await this.firstEquipmentRow2.waitForClickable({ timeout: 10000 });
            await utils.clickWithWait(this.firstEquipmentRow2);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("equipment selected successfully for recommendation");
            await utils.clickWithWait(this.assignButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Assign button clicked successfully for recommendation");

            await this.shortDescriptionInput.waitForClickable({ timeout: 15000 });
            await utils.clickWithWait(this.shortDescriptionInput);
            await browser.keys(rcaData.recommendationShort);
            await browser.pause(1000);
            console.log(
                "Short Desc Value:",
                await this.shortDescriptionInput.getValue()
            );
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Short Description entered successfully");  

            await utils.clickWithWait(this.longDescriptionInput);
            await browser.keys(rcaData.recommendationLong);
            await browser.pause(1000);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Long Description entered successfully");   

            await utils.clickWithWait(this.TypeDropdown);
            await this.typeOption.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.typeOption);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Type 'Improvement' selected successfully");

            await utils.clickWithWait(this.startDateInput);
            await utils.setValueWithWait(this.startDateInput, utils.formatDate(2));
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Start Date entered successfully"); 

            await utils.clickWithWait(this.endDateInput);
            await utils.setValueWithWait(this.endDateInput, utils.formatDatePlus(7));
            await utils.waitForBusyIndicatorToDisappear();
            console.log("End Date entered successfully");

            await browser.pause(3000);
            await this.saveRecommendationButton.waitForClickable({timeout: 15000 });
            await utils.clickWithWait(this.saveRecommendationButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Save button clicked successfully");

            await utils.clickWithWait(this.okButton4);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("OK button clicked successfully");

            await this.plusIconButton.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.plusIconButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Add button clicked");

            await this.taskOption.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.taskOption);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("OK button clicked successfully");

             await utils.setValueWithWait(this.descriptionField, rcaData.taskDescription);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Task description entered successfully");

            await utils.setValueWithWait(this.activityField, rcaData.taskActivity);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Task activity entered successfully");

            await utils.clickWithWait(this.priorityDropdown);
            await browser.pause(2000);
            await this.PriorityOption.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.PriorityOption);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Priority selected successfully");   

            await utils.clickWithWait(this.assignedDropdown);
            await browser.pause(2000);
            await utils.waitForBusyIndicatorToDisappear();
            await utils.setValueWithWait(this.assignedToInput, rcaData.assignedUser);
            await browser.pause(2000);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.keys("ArrowDown");
            await browser.keys("Enter");
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Assigned To user selected successfully");


            await utils.clickWithWait(this.startDateCalendarIcon);
            await utils.setValueWithWait(this.startDateCalendarIcon, utils.formatDate(2));
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Start Date entered successfully"); 

            await utils.clickWithWait(this.endDateCalendarIcon);
            await utils.setValueWithWait(this.endDateCalendarIcon, utils.formatDatePlus(7));
            await utils.waitForBusyIndicatorToDisappear();
            console.log("End Date entered successfully");
    
            await utils.clickWithWait(this.technicalObjectDropdown1);
            await browser.pause(2000);
            await this.equipmentOption.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.equipmentOption);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Technical Object Type 'Equipment' selected successfully");
            
            await utils.clickWithWait(this.equipmentValueHelpIcon);
            await utils.waitForBusyIndicatorToDisappear();

            await browser.pause(4000);
            await this.firstEquipmentRow.waitForClickable({ timeout: 10000 });
            await utils.clickWithWait(this.firstEquipmentRow);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("equipment selected successfully");

            await utils.clickWithWait(this.assignButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Assign button clicked successfully");

            await utils.clickWithWait(this.saveButton3);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Save button clicked successfully");
            await utils.clickWithWait(this.okButton2);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("OK button clicked successfully"); 

            await this.closeButton.waitForClickable({ timeout: 10000 });
            await utils.clickWithWait(this.closeButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("close clicked successfully");

            await this.tasksAndRecommendationRab2.waitForClickable({ timeout: 10000 });
            await utils.clickWithWait(this.tasksAndRecommendationRab2);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Tasks and Recommendation tab clicked successfully");

            await this.selectedCheckbox.waitForDisplayed({ timeout: 20000 });
            await utils.clickWithWait(this.selectedCheckbox);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Recommendation checkbox selected successfully");
            
            await utils.clickWithWait(this.editAndUpdateButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Edit & Update button clicked successfully");   

            await utils.clickWithWait(this.TypeDropdown);   
            await this.typeOption2.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.typeOption2);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Type 'Proactive' selected successfully");

            await utils.clickWithWait(this.saveRecommendationButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Save button clicked successfully");

            await utils.clickWithWait(this.okButton4);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("OK button clicked successfully");  

            await this.selectedCheckbox2.waitForDisplayed({ timeout: 10000 });
            await utils.clickWithWait(this.selectedCheckbox2);  
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Selected checkbox for recommendation selected successfully");

            await utils.clickWithWait(this.editAndUpdateButton2);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Edit & Update button clicked successfully");

            await utils.setValueWithWait(this.descriptionField, rcaData.updatedTaskDescription);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Task description entered successfully");

            await utils.clickWithWait(this.saveButton3);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Save button clicked successfully");

            await utils.clickWithWait(this.okButton4);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("OK button clicked successfully");  
        
        }
        
        async addDocument() {
            const addLinkBtn = await $('//button[.//bdi[text()="Add"]]');
            await utils.clickWithWait(addLinkBtn,1000);
            await browser.pause(2000);
            await utils.switchToIframe(this.RCAIframe);
            const documentOption = await $('//li[contains(.,"Add Document")]');
            await utils.clickWithWait(documentOption);
            await browser.pause(2000);
            await utils.uploadDocument('vessel-1.png');
            await browser.pause(9000);
            console.log("Document uploaded successfully, now filling the details to assign document");
            console.log("Selecting Category, Phase and Language for the document");
            
            await utils.openDropdown($('//label[.//bdi[text()="Category"]]//following::span[contains(@id,"arrow")][1]'));
            await utils.waitForDropdownOpen();
            await utils.waitForAnyUI5OptionActive();
            const firstOption = await $('(//li[@role="option"])[1]');
            await utils.clickWithWait(firstOption);
            console.log("Category selected");
            
            await utils.openDropdown($('//label[.//bdi[text()="Phase"]]//following::span[contains(@id,"arrow")][1]'));
            await utils.waitForDropdownOpen();
            await utils.waitForAnyUI5OptionActive();
            const phaseOption = await $('//li[@role="option"][1]//div[@role="checkbox"]');
            await utils.clickWithWait(phaseOption);
            
            console.log("Phase selected");
            await utils.openDropdown($('//label[.//bdi[text()="Language"]]//following::span[contains(@id,"arrow")][1]'));
            await utils.waitForDropdownOpen();
            await utils.waitForAnyUI5OptionActive();
            const languageOption = await $('//span[text()="English"]/ancestor::li');
            await utils.clickWithWait(languageOption);
            console.log("Language selected");
            
            await utils.clickWithWait($('//button[.//bdi[text()="Save"]]'));
            await utils.waitForBusyIndicatorToDisappear();
            await this.attachSuccMsg.waitForDisplayed({
                timeout: 20000,
                timeoutMsg: 'Document assign success message not displayed'
            });
            
            console.log("Document assign success message displayed");
            await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'));
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(10000);
        }
            
        async addLink() {
            await browser.pause(2000);
            const addLinkBtn = await $('//button[.//bdi[text()="Add"]]');
            await utils.clickWithWait(addLinkBtn);
            await browser.pause(2000);
            await utils.switchToIframe(this.RCAIframe);
            const link = await $('//li[contains(.,"Add Link")]');
            await utils.clickWithWait(link);
            await utils.waitForDropdownOpen();
            console.log("Filling the details to assign link");
            const displayNameInput = await $(`//label[.//bdi[text()='Display Name']]//following::input[1]`);
            await displayNameInput.waitForDisplayed({ timeout: 10000 });
            await displayNameInput.setValue("Test Link");
            console.log("Display Name entered");
            console.log("Entering URL for the link");
            const linkInput = await $(`//label[.//bdi[text()='Link']]//following::input[1]`);
            await linkInput.setValue("https://testlink.com");
            const phaseInput = await $(`//label[.//bdi[text()="Phase"]]//following::span[contains(@id,"arrow")][1]`);
            await phaseInput.click();
            console.log("Phase dropdown opened");
            const phaseoption = await $(`//li[@role="option"][1]//div[@role="checkbox"]`);
            await phaseoption.waitForDisplayed({ timeout: 10000 });
            await phaseoption.click();
            console.log("Phase selected");
            // const categoryInput = await $(`//label[.//bdi[text()="Category"]]//following::span[contains(@id,"arrow")][1]`);
            // await categoryInput.click();
            // const categoryoption = await $(`(//ul[@role="listbox"]//li[@role="option"])[2]`);
            // await utils.clickWithWait(categoryoption,1000);
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickWithWait($('//button[.//bdi[text()="Save"]]'));
            await this.attachSuccMsg.waitForDisplayed({
                timeout: 20000,
                timeoutMsg: 'Link assign success message not displayed'
            });
        
            console.log("Link assign success message displayed");
            await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'));
            await browser.pause(2000);
            
        }
        async gotoAttachmentsTabAndAssignAttachment() {
            console.log("Navigating to Attachment tab to assign attachment");
            await browser.pause(4000);
            await utils.switchToIframe(this.RCAIframe);
            await this.attachmentsSection.waitForDisplayed({ timeout: 50000 });
            await this.attachmentsSection.click();
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

        async deleteAttachmentAndVerify() {
            console.log("Deleting assigned attachment and verifying");
            await browser.pause(8000);
            await utils.switchToIframe(this.RCAIframe);
            await browser.pause(8000);
            const attachmentCheckbox = await $('(//table//tr[@role="row"]//div[@role="checkbox" and @aria-checked="false"])[1]');
            await attachmentCheckbox.waitForDisplayed({ timeout: 20000 });
            await utils.clickWithWait(attachmentCheckbox,1000);
            const selectAllAttachment = await $('(//table//tr[@role="row"]//div[@role="checkbox" and @aria-checked="true"])[1]');
            if(await selectAllAttachment.isExisting()){
                console.log("Selecting all attachments for deletion");
                await selectAllAttachment.click();
            }
            else
            {
                console.log("No attachment is selected for deletion");    
                return;
            }
            await utils.clickWithWait($('//section[.//bdi[text()="Attachments"]]/following::bdi[text()="Delete"]/ancestor::button'),1000);
            await utils.clickWithWait($('//button[.//bdi[text()="Yes"]]'),1000);
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'),1000);
            await browser.pause(2000);
            console.log("Attachment deleted successfully");
        }

        async verifyMaintenanceAndServiceSections() {            
            await utils.clickWithWait(this.maintAndServ);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Maintenance and Service section opened successfully");
        }  

        async verifyChangeHistory() {
            console.log("Editing header's Information for change history check");
            await utils.switchToIframe(this.RCAIframe);
            await browser.pause(1000);
            await utils.clickWithWait(this.RCAEditHeader);
            
            await utils.setValueWithWait(
                this.rcaDescriptionField,
                "Testing why why analysis"
            );

            const enteredDesc = await this.rcaDescriptionField.getValue();

            await utils.clickWithWait(this.saveButton1);
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickWithWait(this.okButton5);
            console.log("Header edited successfully");
    
            console.log("Navigating to Change History tab");
            await utils.clickWithWait(this.RCAChngHist);
            await this.RCAChngHist.waitForDisplayed({ timeout: 30000 });
            console.log("Navigated to Change History tab successfully");
            console.log("Fetching latest change history entry");

            const detailsBtn = await $("(//a[text()='Details'])[1]");
            await detailsBtn.waitForDisplayed({ timeout: 20000 });
            await detailsBtn.click();
            const changeDetailsPopup = await $("//*[text()='Change Details']");
            await changeDetailsPopup.waitForDisplayed({ timeout: 20000 });

            const fieldName = await $("(//table//tr//td[2])[1]");
            const oldValue = await $("(//table//tr//td[3])[1]");
            const newValue = await $("(//table//tr//td[4])[1]");

            const field = await fieldName.getText();
            const oldVal = await oldValue.getText();
            const newVal = await newValue.getText();

            console.log("Field:", field);
            console.log("Old Value:", oldVal);
            console.log("New Value:", newVal);


            if (!field.includes("Failure Name")) {
                throw new Error("Field name mismatch");
            }

            if (!newVal.includes(enteredDesc)) {
                throw new Error(`New value mismatch. Expected: ${enteredDesc} Found: ${newVal}`);
            }
        }
        
        async closeChnageHistory() {
            await utils.clickWithWait(this.closeButton2);
            await browser.pause(2000);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Change History popup closed successfully");
        }


        async deleteassessment(){
            await this.manageButton.waitForDisplayed({ timeout: 10000 });
            await browser.pause(5000);
            await utils.clickWithWait(this.manageButton);
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Manage button clicked successfully"); 
            await browser.pause(5000);
            await browser.keys("ArrowDown");
            await browser.keys("Enter");
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickWithWait(this.yesButton)
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(5000);
            await utils.clickWithWait(this.okButton5)
            console.log("Assessment deleted successfully");
                    
        }

}


export default new rcaFishbonePage();