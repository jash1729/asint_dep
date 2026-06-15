import { browser } from '@wdio/globals';
import utils from 'utils/utils';
import inspectionTemplatesListPage from './inspection_templates.list.page';

class InspectionTemplatesDetailPage {
    private get header() { return $('//header//*[self::h1 or .//bdi]'); }
    private get templateHeaderTitleSpans() { return $$("//header[@role='banner']//*[@role='heading']//span[normalize-space()]"); }
    private get editHeaderBtn() { return $("//bdi[text()='Edit Header ']"); }
    private get headerDescInput() { return $("//div[@role='dialog']//bdi[contains(text(), 'Description')]/following::input[1][not(@readonly)]"); }
    private get headerSaveBtn() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get successMsg() { return $("//span[text()='Updated successfully']"); }
    private get okBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get yesBtn() { return $("//header[.//text()='Confirmation']/following::bdi[text()='Yes']"); }

    public assignedCharacteristics: string = "";

    async deleteInspectionTemplate(templateName: string): Promise<void> {
        console.log(`Attempting to delete inspection template: ${templateName}`);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        const deleteBtn = await $(`//button[.//bdi[text()='Delete']]`);
        await deleteBtn.waitForClickable({ timeout: 15000 });
        await utils.clickWithWait(deleteBtn);
        await browser.pause(1000);
        await utils.clickWithWait(this.yesBtn);
        await utils.waitForBusyIndicatorToDisappear();  
        const successOk = $(`//header[.//text()='Success']/following::button[.//text()='OK']`);
        await utils.clickWithWait(successOk);
        console.log(`Delete action confirmed for template: ${templateName}`);
    }
    async verifyOnInspectionTemplateDetailPage(expectedName?: string): Promise<boolean> {
        try {
            await utils.waitForObjectPageHeader();
            if (expectedName) {
                const hdr = await this.header;
                await hdr.waitForDisplayed({ timeout: 20000 });
                const text = await hdr.getText();
                return text.includes(expectedName) || text.includes(expectedName.split(' ')[0]);
            }
            return true;
        } catch {
            return false;
        }
    }

    async verifyHeader(): Promise<void> {
        console.log("Verifying Inspection Template header name");
        const expectedTemplateName = inspectionTemplatesListPage.createdTemplateName;
        console.log(`Expected Template header: ${expectedTemplateName}`);
        console.log("Waiting for visible Template header title element");

        await browser.waitUntil(async () => {
            const headingSpans = await this.templateHeaderTitleSpans;
            for (const span of headingSpans) {
                if (await span.isDisplayed()) {
                    const headingText = (await span.getText())?.trim();
                    if (headingText === expectedTemplateName) {
                        return true;
                    }
                }
            }
            return false;
        }, {
            timeout: 30000,
            interval: 500,
            timeoutMsg: `Template header '${expectedTemplateName}' was not visible in Object Page header`
        });

        let actualVisibleHeader = "";
        const headingSpans = await this.templateHeaderTitleSpans;
        for (const span of headingSpans) {
            if (await span.isDisplayed()) {
                const headingText = (await span.getText())?.trim();
                if (headingText) {
                    actualVisibleHeader = headingText;
                    break;
                }
            }
        }

        console.log(`Actual Template header: ${actualVisibleHeader}`);
        await expect(actualVisibleHeader).toEqual(expectedTemplateName);
        console.log("Template name matches header name");
    }

    async editHeader(): Promise<void> {
        try {
            const editBtn = await this.editHeaderBtn;
            await editBtn.waitForDisplayed({ timeout: 20000 });
            await utils.clickWithWait(editBtn);
            await utils.waitForBusyIndicatorToDisappear();

            const descInput = await this.headerDescInput;
            await descInput.waitForDisplayed({ timeout: 15000 });
            const currentValue = await descInput.getValue() || '';
            const updatedValue = `${currentValue} - Updated`;
            await descInput.clearValue();
            await descInput.setValue(updatedValue);
            await utils.waitForBusyIndicatorToDisappear();

            const saveBtn = await this.headerSaveBtn;
            await saveBtn.waitForDisplayed({ timeout: 15000 });
            await utils.clickWithWait(saveBtn);
            await utils.waitForBusyIndicatorToDisappear();

            console.log("Template header edited and saved successfully");
        } catch (err) {
            console.log("Error editing template header:", err);
            throw err;
        }
    }

    async verifyEditHeaderSuccess(): Promise<boolean> {
        try {
            const successMsg = await this.successMsg;
            await successMsg.waitForDisplayed({ timeout: 15000 });
            return true;
        } catch {
            return false;
        }
    }

    async assignFunctionalLocationTemplate(): Promise<void> {
        console.log("Navigating to Assignment section to assign template which was not started with 'SA'");
        const assignmentTab = await $(".//bdi[text()='Assignments']");
        await assignmentTab.waitForClickable({ timeout: 15000 });
        await utils.clickWithWait(assignmentTab);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(1000);
        await utils.clickWithWait($("//button[.//bdi[text()='Assign']]"));
        await browser.pause(1000);
        await browser.keys('ArrowDown');
        await browser.pause(500);
        await browser.keys('Enter');
        await utils.waitForBusyIndicatorToDisappear();
        
        // let foundValid = false;
        // let selectedCount = 0;
        // let i = 2;
        await browser.pause(3000);
        const searchInput = await $("//div[@role='dialog']//input[@type='search']");
        await searchInput.waitForDisplayed({ timeout: 20000 });
        await browser.pause(500);
        await searchInput.setValue("OBJT.51437");
        await browser.pause(500);
        await browser.keys('Enter');
        await browser.pause(2000);
        const nameCell = $(`//tr[.//span[text()='OBJT.51437']]//div[@role='checkbox']`);
        await nameCell.waitForDisplayed({ timeout: 20000 });
        await nameCell.click();

        // while (!foundValid && selectedCount == 0) {
        //     await browser.pause(3000);
        //     const nameCell = $(`((//tr[@role='row'])[${i + 1}]//td[3]//span)[1]`);
        //     await nameCell.waitForDisplayed({ timeout: 20000 });

        //     let templateName: string = (await nameCell.getText()) || (await nameCell.getAttribute("innerText")) || "";
        //     templateName = templateName.trim();
        //     await console.log(`Checking template: ${templateName}`);

        //     if (
        //         templateName &&
        //         (templateName.startsWith("SA"))
        //     ) {
        //         i++;
        //         await console.log(`Skipping template: ${templateName} as it starts with 'SA'`);
        //         continue;
        //     }

        //     // click corresponding checkbox (td[2])
        //     const checkbox = $(`((//tr[@role='row'])[${i + 1}]//td[2]//div)[1]`);
        //     await utils.clickWithWait(checkbox);
        //     await utils.waitForBusyIndicatorToDisappear();

        //     selectedCount++;
        //     i++;
        //     foundValid = true;
        // }
        await utils.clickWithWait($("//button[.//bdi[text()='Ok']]"));
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickSuccessOkButton();
        console.log("Template assigned successfully");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
    }

    async createNewDefinitionWithAssignedTemplate(templateName: string): Promise<void> {
        console.log("Navigating to Define section to create new definition with assigned template");
        const defineTab = await $(".//bdi[text()='Define Section']");
        await defineTab.waitForClickable({ timeout: 15000 });
        await utils.clickWithWait(defineTab);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait($(`//span[@aria-label='Expand/Collapse']`));
        await browser.pause(1000);
        const sectionTitle = await $("//bdi[normalize-space()='Section Title']/following::input[@type='text'][1]");
        await sectionTitle.waitForDisplayed({ timeout: 50000 });
        await sectionTitle.setValue("My Section");
        const desc = await $("//bdi[normalize-space()='Description']/following::input[@type='text'][1]");
        await desc.waitForDisplayed({ timeout: 50000 });
        await desc.setValue("My Section Description");
        const objectTemplate = await $(`//bdi[normalize-space()='Object Template']/following::input[@type='text'][1]`);
        await objectTemplate.waitForDisplayed({ timeout: 50000 });
        await objectTemplate.click();
        await browser.pause(1000);
        await utils.clickWithWait($(`//div[@role='radio']`));
        await browser.pause(1000);
        await utils.clickWithWait($("//button[.//bdi[text()='Ok']]"));
        const dropdownArrow = await $("//span[@role='button'][.//span[text()='Select Options']]");
        await dropdownArrow.waitForClickable({ timeout: 50000 });
        await dropdownArrow.click();
        await browser.pause(1000);
        await browser.keys('ArrowDown');
        await browser.pause(500);
        await browser.keys('Enter');
        await browser.pause(1000);

        await utils.clickWithWait($(".//bdi[text()='Create']"));
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(1000);
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        await console.log("Definition created with assigned template successfully");

        await browser.pause(2000);
        await console.log("Verifying the assigned template in the created definition");
        const classValues = await $$("(//bdi[normalize-space()='Class']/following::tbody/tr//td[@aria-colindex='2']//span)[1]");
        if (classValues.length > 0) {
            for (const cls of classValues) {
                const clsText = await cls.getText();
                await console.log("Assigned Class :", clsText);
            }
        } else {
            await console.log("No Class Assigned");
        }
    }

    async createNewSubSectionAndAssignClass(templateName: string): Promise<void> {
        await console.log("Creating new sub section under the created section and assigning class to it");
        await browser.pause(2000);
        const subSectionBtn = await $("//bdi[text()='Define Sub Section']");
        await subSectionBtn.waitForClickable({ timeout: 15000 });
        await utils.clickWithWait(subSectionBtn);
        await utils.waitForBusyIndicatorToDisappear();
        const subSectionTitle = await $(`//bdi[normalize-space()='Sub Section Title']/following::input[@type='text'][1]`);
        await subSectionTitle.waitForDisplayed({ timeout: 50000 });
        await subSectionTitle.setValue("Sub Section Title");
        
        const dropdownArrow = await $("//span[@role='button'][.//span[text()='Select Options']]");
        await dropdownArrow.waitForClickable({ timeout: 50000 });
        await dropdownArrow.click();
        await browser.pause(1000);
        await browser.keys('ArrowDown');
        await browser.pause(500);
        await browser.keys('Enter');
        await browser.pause(1000);        

        await utils.clickWithWait($(".//bdi[text()='Create']"));
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(1000);
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        await console.log("Sub Section created successfully");
        await browser.pause(1000);

        const subsectionValues = await $$("//bdi[normalize-space()='Sub Section Title']/following::tbody[1]/tr//td[@aria-colindex='1']//span");

        for (const subsection of subsectionValues) {

            await console.log("Sub Section :", await subsection.getText());
        }
        await console.log("Assigning class to the created sub section");

        const characteristicsLink = await $("//td[@aria-colindex='2']//a");
        await characteristicsLink.waitForClickable({ timeout: 50000 });
        await utils.clickWithWait(characteristicsLink);
        await browser.pause(1500);
        await browser.keys('Enter');
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(1000);
        // const firstRowCheckbox = await $("(//table[@role='grid']//tbody/tr)[1]//div[@role='checkbox']");
        // await firstRowCheckbox.waitForClickable({ timeout: 50000 });
        // await firstRowCheckbox.click();
        const rows = await $$("//span[contains(text(),'Characteristics (')]/ancestor::*[@role='dialog']//table[@role='grid']//tbody/tr");

        await console.log("Popup Characteristics Count :", rows.length);

        if (rows.length > 0) {
            await browser.pause(1000);
            const checkbox = await rows[0].$(".//div[@role='checkbox']");
            this.assignedCharacteristics = await $(`(//span[contains(text(),'Characteristics (')]/ancestor::*[@role='dialog']//table[@role='grid']//tbody/tr//span[1])[1]`).getText() || "";
            console.log("Assigned Characteristic ::", this.assignedCharacteristics);
            await checkbox.click();
            await browser.pause(1000);
            await utils.clickWithWait($("//span[normalize-space()='Characteristics']/ancestor::*[@role='dialog']//button[.//bdi[normalize-space()='Assign']]"));
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickSuccessOkButton();
            await utils.waitForBusyIndicatorToDisappear();
            console.log("Class assigned to sub section successfully");
        }

    }

    async mapSectionToHeader(templateName: string): Promise<void> {
        console.log("Mapping section to header in inspection header mapping and verifying it");
        const headerMappingTab = await $(".//bdi[text()='Inspection Header Mapping']");
        await headerMappingTab.waitForClickable({ timeout: 15000 });
        await utils.clickWithWait(headerMappingTab);
        await utils.waitForBusyIndicatorToDisappear();
        const assignSectionBtn = await $("//button[.//bdi[normalize-space()='Assign Section']]");
        await assignSectionBtn.waitForClickable({ timeout: 50000 });
        await assignSectionBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(1000);
        const sectionDropdown = await $("//bdi[normalize-space()='Section']/following::span[@role='button'][1]");
        await sectionDropdown.waitForClickable({ timeout: 50000 });
        await sectionDropdown.click();
        await browser.pause(1000);
        const mySection = await $("(//li[@role='option'][.//span[normalize-space()='My Section']])[2]");
        await mySection.waitForClickable({ timeout: 50000 });
        await mySection.click();
        await browser.pause(1000);
        const subSectionDropdown = await $("//bdi[normalize-space()='Sub Section']/following::span[@role='button'][1]");
        await subSectionDropdown.waitForClickable({ timeout: 50000 });
        await subSectionDropdown.click();
        await browser.pause(1000);
        const mySubSection = await $("//li[@role='option'][.//span[normalize-space()='Sub Section Title']]");
        await mySubSection.waitForClickable({ timeout: 50000 });
        await mySubSection.click();
        await browser.pause(1000);

        const lastInspDateChar = await $("(//bdi[normalize-space()='Characteristic']/following::span[@role='button'][1])[1]");
        await lastInspDateChar.waitForClickable({ timeout: 50000 });
        await lastInspDateChar.click();
        await browser.pause(1000);
        const lastCharOption = await $(`(//li[@role='option'][.//span[normalize-space()='${this.assignedCharacteristics}']])[1]`);
        await lastCharOption.waitForClickable({ timeout: 50000 });
        await lastCharOption.click();
        await browser.pause(1000);

        const scheduledInspDateChar = await $("(//bdi[normalize-space()='Characteristic']/following::span[@role='button'][1])[2]");
        await scheduledInspDateChar.waitForClickable({ timeout: 50000 });
        await scheduledInspDateChar.click();
        await browser.pause(1000);
        const scheduledCharOption = await $(`(//li[@role='option'][.//span[normalize-space()='${this.assignedCharacteristics}']])[2]`);
        await scheduledCharOption.waitForClickable({ timeout: 50000 });
        await scheduledCharOption.click();
        await browser.pause(1000);
        await utils.clickWithWait($("//button[.//bdi[normalize-space()='Create']]"));
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Section mapped to header successfully");
    }

    async assignSectionToChecklist(templateName: string): Promise<void> {
        console.log("Assigning section to checklist in checklist mapping and verifying it");
        const checklistMappingTab = await $(".//bdi[text()='Checklist Mapping']");
        await checklistMappingTab.waitForClickable({ timeout: 15000 });
        await utils.clickWithWait(checklistMappingTab);

        utils.clickWithWait($(`.//bdi[text()='Assign Section']`));
        await browser.pause(1000);
        await utils.clickWithWait($(`//tr[.//span[normalize-space()='My Section']]//div[@role='checkbox']`));
        await browser.pause(1000);
        await utils.clickWithWait($(`//span[normalize-space()='Assign Section']/ancestor::*[@role='dialog']//button[.//bdi[normalize-space()='Assign']]`));
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Section assigned to checklist successfully");
    }

    async assignComponentTemplateToComponent(templateName: string): Promise<void> {
        console.log("Assigning component inspection template to component in component mapping and verifying it");
        const componentMappingTab = await $(".//bdi[text()='Component Mapping']");
        await componentMappingTab.waitForClickable({ timeout: 15000 });
        await utils.clickWithWait(componentMappingTab);
        const toolbar = await $("//*[normalize-space()='Component Inspection Templates']/ancestor::*[@role='toolbar']");

        const assignBtn = await toolbar.$(".//button[.//bdi[normalize-space()='Assign']]");
        await assignBtn.waitForClickable({ timeout: 50000 });
        await assignBtn.click();
        await browser.pause(1000);
        await utils.clickWithWait($(`(//table[@role='grid']//tbody/tr)[1]//div[@role='checkbox']`));
        await utils.clickWithWait($(`.//bdi[text()='Ok']`)); 
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickSuccessOkButton();
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Component inspection template assigned to component successfully");
    }


}
export default new InspectionTemplatesDetailPage();
