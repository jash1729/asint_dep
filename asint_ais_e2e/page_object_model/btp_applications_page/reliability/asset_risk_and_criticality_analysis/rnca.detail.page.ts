import HomePage from '../../home.page';
import utils from '../../../../utils/utils';

class RNCADetailPage {

    private get rncaIframe() { return $('iframe[data-help-id="application-rca-manage"]'); }

    private get generalInfoEditBtn() {
        return $(`//div[text()='General Information']//following::bdi[text()='Edit'][1]`);
    }
    private get validityInfoEditBtn() {
        return $(`//div[text()='Validity']//following::bdi[text()='Edit'][1]`);
    }
    private get scopeInfoEditBtn() {
        return $(`//div[text()='Scope']//following::bdi[text()='Edit'][1]`);
    }

    private async clickSuccessOkIfPresent(timeout = 5000) {
        await browser.pause(2500); 
        const okBtn = await $("//span[text()='Success']/following::button[.//bdi[text()='OK']][1]");

        try {
            await okBtn.waitForExist({ timeout });
        } catch (err) {
            return;
        }

        if (await okBtn.isDisplayed().catch(() => false)) {
            await okBtn.waitForClickable({ timeout });
            await okBtn.click();
        }
    }

    async editGeneralInformation(description: string, longDescription: string) {
        await console.log("Editing General Information with description:", description, "and longDescription:", longDescription);
        await browser.pause(3000);
        await utils.switchToIframe(this.rncaIframe);
        
        const editBtn = await this.generalInfoEditBtn;
        await editBtn.waitForClickable({ timeout: 50000 });
        await editBtn.click();

        const descriptionInput = await $("//bdi[text()='Description']/following::textarea[1]");
        await descriptionInput.waitForDisplayed();
        await descriptionInput.setValue(description);

        const longDescriptionInput = await $("//bdi[text()='Long Description']/following::textarea[1]");
        await longDescriptionInput.setValue(longDescription);

        const saveBtn = await $("//div[text()='General Information']//following::bdi[text()='Save'][1]");
        await saveBtn.waitForClickable({ timeout: 50000 });
        await saveBtn.click();

        await utils.waitForBusyIndicatorToDisappear();

        await this.clickSuccessOkIfPresent(50000);
        await console.log("General Information edited successfully");
        await utils.waitForBusyIndicatorToDisappear();
    }

    async editValidity(validFrom: string, validTo: string) {
        await console.log("Editing Validity with validFrom:", validFrom, "and validTo:", validTo);
        await this.validityInfoEditBtn.click();

        const validFromInput = await $("//bdi[text()='Valid From']/following::input[1]");
        await validFromInput.setValue(validFrom);

        const validToInput = await $("//bdi[text()='Valid To']/following::input[1]");
        await validToInput.setValue(validTo);

        const saveBtn = await $("//div[text()='Validity']//following::bdi[text()='Save'][1]");
        await saveBtn.waitForClickable({ timeout: 50000 });
        await saveBtn.click();

        await utils.waitForBusyIndicatorToDisappear();

        await this.clickSuccessOkIfPresent(50000);
        await utils.waitForBusyIndicatorToDisappear();
        await console.log("Validity edited successfully");

    }

    async editScope(description: string) {
        await console.log("Editing Scope with description:", description);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForBlockLayerToDisappear();
        await utils.clickWithWait(this.scopeInfoEditBtn);

        const descriptionInput = await $(`//div[text()='Scope']//following::bdi[text()='Description']/following::textarea[1]`);
        await descriptionInput.setValue(description);

        const saveBtn = await $("//div[text()='Scope']//following::bdi[text()='Save'][1]");
        await saveBtn.waitForClickable({ timeout: 50000 });
        await saveBtn.click();

        await utils.waitForBusyIndicatorToDisappear();

        await this.clickSuccessOkIfPresent(50000);
        await utils.waitForBusyIndicatorToDisappear();
        await console.log("Scope edited successfully");
        await browser.pause(3000);
    }

    private async getEquipmentTable() {
        const table = await $("(//table[@role='grid' and @aria-multiselectable='true' and @aria-rowcount])[1]");
        await table.waitForExist({ timeout: 10000 });
        return table;
    }

    private async getEquipmentRows() {
        const table = await this.getEquipmentTable();
        return await table.$$(".//tbody//tr[@role='row']");
    }

    private async getEquipmentCheckboxes() {
        const table = await this.getEquipmentTable();
        return await table.$$(".//tbody//tr[@role='row']//div[@role='checkbox']");
    }

    private async getDialogScrollContainer() {
        const table = await this.getEquipmentTable();
        const dialogSection = await table.$("./ancestor::section[contains(@style,'overflow')][1]");

        if (await dialogSection.isExisting()) {
            return dialogSection;
        }

        const dialogScroll = await table.$("./ancestor::div[contains(@style,'overflow')][1]");

        if (await dialogScroll.isExisting()) {
            return dialogScroll;
        }

        return table;
    }

    private async loadMoreRowsUntil(targetIndex: number) {
        let rows = await this.getEquipmentRows();
        let lastCount = rows.length;
        let attempts = 0;

        while (rows.length <= targetIndex) {
            console.log(`Loading more rows... current rows: ${rows.length}, need: ${targetIndex}`);

            const container = await this.getDialogScrollContainer();
            await container.scrollIntoView();
            await browser.execute((el) => {
                el.scrollTop = el.scrollHeight;
            }, container);

            await browser.pause(3000);
            const moreBtn = await $("(//div[@role='button' and .//span[normalize-space()='More']])[1]");
            if (await moreBtn.isDisplayed().catch(() => false)) {
                await moreBtn.click();
            }

            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(1500);

            rows = await this.getEquipmentRows();

            if (rows.length <= lastCount) {
                attempts += 1;
                if (attempts >= 3) {
                    throw new Error("No more rows can be loaded.");
                }
            } else {
                lastCount = rows.length;
                attempts = 0;
            }
        }
    }
    async ensureItemsLoaded(requiredIndex: number) {
        await this.loadMoreRowsUntil(requiredIndex);
        return await this.getEquipmentCheckboxes();
    }
    async ensureRowVisible(targetIndex: number) {
        await this.loadMoreRowsUntil(targetIndex);
        return await this.getEquipmentCheckboxes();
    }
    
    async assignEquipment(equipmentName: string) {
        await console.log("Assigning equipment:", equipmentName);
        await utils.switchToIframe(this.rncaIframe);
        await utils.clickWithWait($("//bdi[normalize-space()='Assignments']"));
        // let count = 0;
        // while(true) {
        //     await console.log("Attempting to assign equipment, batch starting at index:", count);
        //     const assignBtn = await $(`//div[.//span[normalize-space()='Assignments']]//button[.//bdi[normalize-space()='Assign']]`);
        //     await assignBtn.waitForClickable({ timeout: 50000 });
        //     await assignBtn.click();

        //     const equipmentDropdown = await $("//*[normalize-space()='Equipment']");
        //     await equipmentDropdown.waitForClickable({ timeout: 50000 });
        //     await equipmentDropdown.click();

        //     await browser.pause(6000); // Wait for dropdown options to load
        //     const checkboxes = await $$("//tbody//tr[@role='row']//div[@role='checkbox']");
        //     const checkboxesCount = await checkboxes.length;
        //     if (count >= checkboxesCount) {
        //         throw new Error("No more technical objects available to assign after duplicate-selection retries.");
        //     }
        //     if(count > 10) {
        //         const container = await $('//section[contains(@style,"overflow: auto")]');
        //         let lastScrollTop = 0;
        //         while (true) {
        //             const newScrollTop = await browser.execute((el) => {
        //                 el.scrollTop += 20;   // scroll step
        //                 return el.scrollTop;
        //             }, container);

        //             if (newScrollTop === lastScrollTop) break;

        //             lastScrollTop = newScrollTop;

        //             await browser.pause(1500); // wait for new data load
        //         }
        //     }
        //     await console.log(`Selecting equipment checkbox at index: ${count}`);
        //     await checkboxes[count].waitForClickable({ timeout: 10000 });
        //     await browser.execute(el => el.scrollIntoView({ block: 'center' }), checkboxes[count]);
        //     await checkboxes[count].click();

        //     await utils.clickWithWait($(`//bdi[text()='Confirm']`));
        //     await utils.waitForBusyIndicatorToDisappear();

        //     const dialog = await $("//div[@role='alertdialog']");
        //     await dialog.waitForDisplayed({ timeout: 50000 });
        //     await browser.pause(500);

        //     const dialogText = await dialog.getText();
        //     console.log("Assignment Dialog Message:", dialogText);

        //     if (dialogText.includes("Please select different Technical Objects")) {
        //         const warningOkBtn = await dialog.$(".//button[.//bdi[normalize-space()='OK']]");
        //         await warningOkBtn.waitForClickable({ timeout: 10000 });
        //         await warningOkBtn.click();
        //         await utils.waitForBusyIndicatorToDisappear();
        //         count++;
        //         continue;
        //     }

        //     const isAssignmentSuccess = /Technical\s*Object\s*Assigned\s*successfully|Assigned\s*successfully/i.test(dialogText);
        //     if (!isAssignmentSuccess) {
        //         throw new Error(`Unexpected assignment dialog message: ${dialogText}`);
        //     }

        //     const yesBtn = await dialog.$(".//button[.//bdi[normalize-space()='Yes' or normalize-space()='OK']]");
        //     await yesBtn.waitForClickable({ timeout: 10000 });
        //     await yesBtn.click();
        //     await utils.waitForBusyIndicatorToDisappear();
        //     await this.clickSuccessOkIfPresent(50000);
        //     await utils.waitForBusyIndicatorToDisappear();
        //     await console.log("Equipment assigned successfully");
        //     break;
        // }
        let batchStart = 0;
        let batchSize = 20;

        while (true) {

            console.log(`Starting batch from index: ${batchStart}`);

            const assignBtn = await $(`//div[.//span[normalize-space()='Assignments']]//button[.//bdi[normalize-space()='Assign']]`);
            await assignBtn.waitForClickable({ timeout: 50000 });
            await assignBtn.click();

            const equipmentDropdown = await $("//*[normalize-space()='Equipment']");
            await equipmentDropdown.waitForClickable({ timeout: 50000 });
            await equipmentDropdown.click();

            await browser.pause(3000);

            await this.loadMoreRowsUntil(batchStart + batchSize - 1);

            const checkboxes = await this.getEquipmentCheckboxes();
            const totalLoaded = checkboxes.length;

            let selectedCount = 0;
            for (let i = batchStart; i < Math.min(batchStart + batchSize, totalLoaded); i++) {
                try {
                    await browser.execute(el => el.scrollIntoView({ block: 'center' }), checkboxes[i]);
                    await checkboxes[i].waitForClickable({ timeout: 5000 });
                    await checkboxes[i].click();

                    selectedCount++;
                } catch (err) {
                    console.log(`Skipping index ${i}`);
                }
            }

            console.log(`Selected ${selectedCount} items`);

            if (selectedCount === 0) {
                throw new Error("No selectable items found in batch.");
            }

            // ✅ SINGLE CONFIRM CLICK
            await utils.clickWithWait($(`//bdi[text()='Confirm']`));
            await utils.waitForBusyIndicatorToDisappear();

            const dialog = await $("//div[@role='alertdialog']");
            await dialog.waitForDisplayed({ timeout: 50000 });

            const dialogText = await dialog.getText();
            console.log("Dialog:", dialogText);

            // ⚠️ HANDLE DUPLICATES / PARTIAL FAIL
            if (dialogText.includes("Please select different Technical Objects")) {
                console.log("Some duplicates found, moving to next batch...");

                const okBtn = await dialog.$(".//button[.//bdi[normalize-space()='OK']]");
                await okBtn.click();

                await utils.waitForBusyIndicatorToDisappear();

                batchStart += batchSize;
                continue;
            }
            if (dialogText.includes("Few of the selected Technical Objects are already assigned to other ongoing assessments")) {
                await console.log(dialogText);
                console.log("Some items already assigned, confirming to assign the rest...");
                const yesBtn = await dialog.$(".//button[.//bdi[normalize-space()='Yes' or normalize-space()='OK']]");
                await yesBtn.waitForClickable({ timeout: 10000 });
                await yesBtn.click();
                await utils.waitForBusyIndicatorToDisappear();
                await this.clickSuccessOkIfPresent(50000);
                await browser.pause(3000);
                const noDataCell = await $("//td[normalize-space()='No data']");
                if (await noDataCell.isDisplayed()) {
                    console.log("⚠️ No equipment available (No data found), skipping...");
                    batchStart += batchSize;
                    continue;
                }                
                console.log("Batch assigned with some duplicates skipped, done.");
                break;
            }

            // ✅ SUCCESS
            // const isSuccess = /Assigned\s*successfully/i.test(dialogText);

            // if (!isSuccess) {
            //     throw new Error(`Unexpected dialog: ${dialogText}`);
            // }

            const yesBtn = await dialog.$(".//button[.//bdi[normalize-space()='Yes' or normalize-space()='OK']]");
            await yesBtn.click();

            await utils.waitForBusyIndicatorToDisappear();
            await this.clickSuccessOkIfPresent(50000);

            console.log("✅ Batch assigned successfully");

            // 🔁 MOVE TO NEXT BATCH
            batchStart += batchSize;
        }
    }

    // async assignEquipment(equipmentName: string) {
    //     await console.log("Assigning equipment:", equipmentName);
    //     await utils.switchToIframe(this.rncaIframe);
    //     await utils.clickWithWait($("//bdi[normalize-space()='Assignments']"));

    //     const assignBtn = await $(`//div[.//span[normalize-space()='Assignments']]//button[.//bdi[normalize-space()='Assign']]`);
    //     await assignBtn.waitForClickable({ timeout: 50000 });
    //     await assignBtn.click();

    //     const equipmentDropdown = await $("//*[normalize-space()='Equipment']");
    //     await equipmentDropdown.waitForClickable({ timeout: 50000 });
    //     await equipmentDropdown.click();

    //     await browser.pause(4000); // Wait for dropdown options to load
    //     const checkboxes = await $$("//tbody//tr[@role='row']//div[@role='checkbox']");

    //     for (let i = 0; i < 15; i++) {
    //         await checkboxes[i].waitForClickable({ timeout: 10000 });
    //         await checkboxes[i].scrollIntoView();
    //         await checkboxes[i].click();
    //     }
    //     await console.log("Checkboxes clicked successfully");

    //     await utils.clickWithWait($(`//bdi[text()='Confirm']`));
    //     await utils.waitForBusyIndicatorToDisappear();
    //     // Wait for dialog
    //     const dialog = await $("//div[@role='alertdialog']");
    //     await dialog.waitForDisplayed({ timeout: 50000 });
    //     // Get message text
    //     const message = await dialog.$(".//span[contains(text(),'Few')]").getText();
    //     console.log("Confirmation Message:", message);

    //     // Click Yes
    //     const yesBtn = await dialog.$(".//button[.//bdi[normalize-space()='Yes']]");
    //     await yesBtn.waitForClickable({ timeout: 10000 });
    //     await yesBtn.click();
    //     await utils.waitForBusyIndicatorToDisappear();
    //     await this.clickSuccessOkIfPresent(50000);
    //     await console.log("Equipment assigned successfully");
    //     await utils.waitForBusyIndicatorToDisappear();
    // }

    async assignFunctionalLocation(equipmentName: string) {
        await console.log("Assigning functional location:", equipmentName);
        await utils.switchToIframe(this.rncaIframe);
        await utils.clickWithWait($("//bdi[normalize-space()='Assignments']"));

        const assignBtn = await $(`//div[.//span[normalize-space()='Assignments']]//button[.//bdi[normalize-space()='Assign']]`);
        await assignBtn.waitForClickable({ timeout: 50000 });
        await assignBtn.click();

        const equipmentDropdown = await $("//*[normalize-space()='Functional Location']");
        await equipmentDropdown.waitForClickable({ timeout: 50000 });
        await equipmentDropdown.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(4000); // Wait for dropdown options to load
        const checkboxes = await $$("//tbody//tr[@role='row']//div[@role='checkbox']");

        for (let i = 0; i < 20; i++) {
            await checkboxes[i].waitForClickable({ timeout: 10000 });
            await checkboxes[i].scrollIntoView();
            await checkboxes[i].click();
        }

        await utils.clickWithWait($(`//bdi[text()='Confirm']`));
        await utils.waitForBusyIndicatorToDisappear();
        // Wait for dialog
        const dialog = await $("//div[@role='alertdialog']");
        await dialog.waitForDisplayed({ timeout: 50000 });

        // Get message text
        const message = await dialog.$(".//span[contains(text(),'Few')]").getText();
        console.log("Confirmation Message:", message);

        // Click Yes
        const yesBtn = await dialog.$(".//button[.//bdi[normalize-space()='Yes']]");
        await yesBtn.waitForClickable({ timeout: 10000 });
        await yesBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await this.clickSuccessOkIfPresent(50000);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(5000);
    }
    async assignTemplate(TemplateName: string) {
        await console.log("Assigning template:", TemplateName);
        await browser.pause(3000);
        await utils.switchToIframe(this.rncaIframe);
        const firstCheckbox = await $("(//tbody//tr[@role='row']//div[@role='checkbox' and @tabindex='0' and not(ancestor::*[@aria-hidden='true'])])[1]");
        await firstCheckbox.scrollIntoView();
        await firstCheckbox.click();
        //await browser.execute(el => el.click(), firstCheckbox);

        const manageTemplateBtn = await $(`//button[.//bdi[normalize-space()='Manage Template'] or .//span[normalize-space()='Manage Template']]`);
        await manageTemplateBtn.waitForClickable({ timeout: 50000 });
        await manageTemplateBtn.click();
        await browser.pause(3000);
        // const manageTemplateAssignOption = await $(`(//li[@role='menuitem' and .//bdi[normalize-space()='Assign'] and not(ancestor::*[@aria-hidden='true'])])[1]`);
        // await utils.clickWithWait(manageTemplateAssignOption);
        //await browser.keys(['ArrowDown']);
        await browser.keys(['Enter']);
        await browser.pause(4000);
        const firstRadio = await $("(//tr[@role='row']//div[@role='radio'])[1]");

        await firstRadio.waitForDisplayed({ timeout: 10000 });
        await firstRadio.scrollIntoView();
        await firstRadio.waitForClickable({ timeout: 10000 });

        const isSelected = await firstRadio.getAttribute("aria-checked");

        if (isSelected !== "true") {
            await firstRadio.click();
        }

        await utils.clickWithWait($(`//button[.//bdi[normalize-space()='Cancel']]/preceding::button[.//bdi[normalize-space()='Assign']][1]`));
        await utils.waitForBusyIndicatorToDisappear();
        await this.clickSuccessOkIfPresent(50000);
        await utils.waitForBusyIndicatorToDisappear();
        await console.log("Template assigned successfully");
        await browser.pause(3000); 
    }
    async calculateRiskOnAssessment() {
        await console.log("Calculating risk on assessment");
        await utils.switchToIframe(this.rncaIframe);
        await utils.clickWithWait($("//bdi[normalize-space()='Assessment']"));
        await utils.clickWithWait($(`(//li[@role='listitem']//div[@role='checkbox'])[1]`));
        // Step 1: get all expand/collapse buttons
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(3000);
        const expcolBtns = await $$("//button[@title='Expand/Collapse']");

        console.log("Total panels:", expcolBtns.length);

        // Step 2: loop each panel
        for (let i = 0; i < expcolBtns.length; i++) {
            await console.log(`Processing panel ${i + 1}`);
            const btn = expcolBtns[i];

            //await btn.scrollIntoView();
            await browser.execute(el => el.scrollIntoView({ block: 'center' }), btn);
            await browser.pause(300);
            await btn.waitForClickable({ timeout: 10000 });

            // Expand only if collapsed
            const isExpanded = await btn.getAttribute("aria-expanded");

            if (isExpanded === "false") {
                await btn.click();
            }

            console.log(`Panel ${i + 1} expanded`);

            // Step 3: get corresponding panel (relative to button)
            const panel = await btn.$("./ancestor::div[contains(@id,'idImpactPanels')]");

            // Step 4: check content
            const content = await panel.$$(".//*[normalize-space()!='']");

            if (content.length === 0) {
                console.log(`Panel ${i + 1}: empty`);
                continue;
            }

            console.log(`Panel ${i + 1}: has content`);

            // Step 5: get tables inside THIS panel only
            const tables = await panel.$$(".//table[@role='grid']");

            console.log(`Panel ${i + 1}: tables =`, tables.length);

            // Step 6: loop tables
            for (let j = 0; j < tables.length; j++) {
                await console.log(`Processing table ${j + 1} in panel ${i + 1}`);
                const table = tables[j];

                try {
                    // Try to find radios quickly (2 seconds max)
                    const radios = await table.$$(".//tbody//div[@role='radio']");

                    if (radios.length === 0) {
                        console.log(`Panel ${i+1} - Table ${j+1}: No radios`);
                        continue;
                    }

                    const radio = radios[0];

                    // Wait only briefly for radio to be displayed
                    await radio.waitForExist({ timeout: 2000 });

                    const isSelected = await radio.getAttribute("aria-checked");

                    if (isSelected !== "true") {
                        await radio.scrollIntoView();

                        try {
                            await radio.click();
                        } catch (e) {
                            await browser.execute(el => el.click(), radio);
                        }

                        console.log(`Panel ${i+1} - Table ${j+1}: Radio selected`);
                    } else {
                        console.log(`Panel ${i+1} - Table ${j+1}: Already selected`);
                    }

                } catch (err) {
                    // If timeout or slow loading → skip
                    console.log(`Panel ${i+1} - Table ${j+1}: Skipped due to timeout`);
                    continue;
                }
            }        
        }
        await utils.clickWithWait($(`//bdi[normalize-space()='Action:']/following::button[.//bdi[normalize-space()='Save']][1]`));
        await utils.waitForBusyIndicatorToDisappear();
        await this.clickSuccessOkIfPresent(50000);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(5000);
        
        const table = await $(
        "//span[normalize-space()='Risk Details']/ancestor::*[.//table][1]//table"
        );
        if (await table.isDisplayed().catch(() => false)) {

            const rows = await table.$$(".//tbody/tr");


            if (rows.length === 0) {
                console.log("❌ Risk Details present but empty");
            } else {
                console.log(`✅ Risk Details found (${rows.length} rows)`);

                for (let row of rows) {
                    // ✅ skip hidden rows (important for SAP)
                    if (!(await row.isDisplayed())) continue;

                    const impact = await row.$("./td[2]//span").getText();
                    const risk = await row.$("./td[3]//span").getText();

                    console.log(`Impact: ${impact} | Risk: ${risk}`);
                }
            }

        } else {
            console.log("❌ Risk Details section not found");
        }

        const riskScore = await $(
        "(//bdi[normalize-space()='Risk Score/Criticality:']/following::div[1])[1]"
        ).getText();
        await console.log("Risk Score:", riskScore);
    }
    async deleteAssessment() {
        await console.log("Deleting assessment");
        await utils.switchToIframe(this.rncaIframe);
        const deleteBtn = await $(`//button[.//bdi[normalize-space()='Manage']]`);
        await deleteBtn.waitForClickable({ timeout: 50000 });
        await deleteBtn.click();
        await browser.keys(['Enter']);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait($(`//button[.//bdi[normalize-space()='OK']]`));
        await utils.waitForBusyIndicatorToDisappear();
        await this.clickSuccessOkIfPresent(50000);
        await console.log("Assessment deleted successfully");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(3000);
    }
    async verifyAdministrativeInformation() {
        await console.log("Verifying Administrative Information");
        await utils.switchToIframe(this.rncaIframe);
        const createdBy = await $("//dt[.//text()='Created By']/following::span[1]").getText();
        const createdOn = await $("//dt[.//text()='Created On']/following::span[1]").getText();
        const changedOn = await $("//dt[.//text()='Changed On']/following::span[1]").getText();
        const changedBy = await $("//dt[.//text()='Changed By']/following::span[1]").getText();
        await console.log(`Created By: ${createdBy} | Created On: ${createdOn} | Changed By: ${changedBy} | Changed On: ${changedOn}`);
    }
}
export default new RNCADetailPage();