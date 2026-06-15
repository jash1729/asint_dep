import { $$, browser } from '@wdio/globals';
import * as console from 'console';
import * as path from 'path';
import * as fs from 'fs';
class Utils {
    downloadDir = path.resolve(process.cwd(), 'downloads');

    private get equipmentIframe() { return $('iframe[data-help-id="application-equipment-manage"]'); }
    private get funLocIframe() { return $('iframe[data-help-id="application-functionallocation-manage"]'); }
    private get ASDIframe() { return $('iframe[data-help-id="application-assetstrategydevelopment-manage"]'); }
    private get CMLIframe() { return $('iframe[data-help-id="application-cml-manage"]'); }
    private get documentIframe() { return $('iframe[data-help-id="application-documents-manage"]'); }
    private get notificationIframe() { return $('iframe[data-help-id="application-notifications-manage"]'); }
    private get backBtn() { return $("//a[@aria-label='Back']"); }
    private get settingsBtn() { return $("//span[text()='Settings']/preceding-sibling::span//span"); }
    private get tableSettingsBtn() { return $("//span[text()='Table Settings']/preceding-sibling::span//span"); }
    private get showHierarchyBtn() { return $("//span[text()='Show Hierarchy']/preceding-sibling::span"); }
    private get showAnalyticChartBtn() { return $("//span[text()='Analytics Chart']/preceding-sibling::span"); }
    private get closeHierarchyBtn() { return $("//div[@role='toolbar']/button[@aria-label='Decline']"); }
    private get closeAnalyticChartBtn() { return $("//button[@title='Close']"); }
    private get cancelAnalyticChartBtn() { return $("//button[@title='Cancel']"); }
    private get hazopIframe(): any { return $("iframe[data-help-id='application-hazop-manage']"); }
    private get rcmIframe() { return $('iframe[data-help-id="application-rcm-manage"]'); }
    private get mspIframe() { return $('iframe[data-help-id="application-msp-manage"]'); }
    private get reccWorkbenchIframe() { return $('iframe[data-help-id="application-recommendationworkbenchplus-manage"]'); }

    async switchToIframe(frameElement: any): Promise<void> {
        console.log("---- Switching to iframe ----");
        await browser.switchFrame(null);
        await frameElement.waitForExist({ timeout: 20000 });
        await frameElement.waitForDisplayed({ timeout: 20000 });
        await browser.switchFrame(frameElement);
        console.log("---- Switched successfully ----");
    }

    async uploadDocument(fileName: string): Promise<void> {
        const filePath = path.join(process.cwd(), 'test_data/btp_applications/', fileName);
        const remoteFilePath = await browser.uploadFile(filePath);
        const fileInput = await $('//input[@type="file"]');
        await fileInput.waitForExist();
        await fileInput.setValue(remoteFilePath);
    }

    async waitForObjectPageHeader(): Promise<void> {
        const headerToolbar = await $(
            "//*[contains(@class,'sapUxAPObjectPageLayout')]//header"
        );
        await headerToolbar.waitForExist({ timeout: 30000 });
        await headerToolbar.waitForDisplayed({ timeout: 30000 });
        console.log("Object Page header ready");
    }

    async assertTextEquals(element: any, expectedText: string): Promise<void> {
        const el = await element;  
        await el.waitForDisplayed({ timeout: 10000 });
        const actualText = await el.getText();
        if (actualText.trim() !== expectedText.trim()) {
            throw new Error(`Text assertion failed. Expected: "${expectedText}", Actual: "${actualText}"`);
        } else {    
            console.log(`Text assertion passed. Text: "${actualText}"`);
        }
    }

    async clickWithWait(element: any,delayAfter: number = 0,timeout: number = 75000): Promise<void> {
        const el = await element;
        await el.waitForExist({ timeout });
        await el.waitForDisplayed({ timeout });
        await browser.pause(200);
        await this.scrollIntoViewIfNeeded(el);
        await el.waitForClickable({
            timeout,
            timeoutMsg: `Element not clickable: ${el.selector}`
        });
        // ========== TRY 1 : normal click ==========
        try {
            await el.click();
            if (delayAfter) await browser.pause(delayAfter);
            return;
        } catch (err) {
            console.log(`Normal click failed → ${el.selector}`);
        }
        // ========== TRY 2 : scroll + retry ==========
        try {
            await browser.pause(500);
            await this.scrollIntoViewIfNeeded(el);
            await browser.pause(300);
            await el.click();
            if (delayAfter) await browser.pause(delayAfter);
            return;
        } catch (err) {
            console.log(`Retry click failed → ${el.selector}`);
        }
        // ========== TRY 3 : JS click ==========
        try {
            await browser.execute(
                (element: HTMLElement) => element.click(),
                el
            );
            if (delayAfter) await browser.pause(delayAfter);
            return;
        } catch (err) {
            console.log(`JS click failed → ${el.selector}`);
        }
        // ========== TRY 4 : real mouse action click ==========
        try {
            await el.moveTo();
            await browser.pause(200);
            await browser.action('pointer')
                .move({ origin: el })
                .down()
                .up()
                .perform();
            if (delayAfter) await browser.pause(delayAfter);
            return;
        } catch (err) {
            throw new Error(`All click strategies failed for: ${el.selector}`);
        }
    }

    async setValueWithWait(element: any, value: string, delayAfter = 0, timeout = 60000): Promise<void> {
        const el = await element;
        await el.waitForDisplayed({ timeout });
        await this.scrollIntoViewIfNeeded(el);

        try {
            await el.click();
            await el.clearValue();
            await el.setValue(value);
        } catch {
            await browser.pause(1000);
            await this.scrollIntoViewIfNeeded(el);
            await el.clearValue();
            await el.setValue(value);
        }
        await browser.keys("Enter");
        await browser.keys("Tab");
        if (delayAfter > 0) await browser.pause(delayAfter);
    }

    public async waitForBusyIndicatorToDisappear(timeoutInSeconds = 60): Promise<void> {
        const busy = $("#sapUiBusyIndicator");
        const anim = $(".sapUiLocalBusyIndicatorAnimation");
        try {
            const appeared = await browser.waitUntil(async () => {
                const b = await busy.isDisplayed().catch(() => false);
                const a = await anim.isDisplayed().catch(() => false);
                return b || a;
            }, {
                timeout: 3000,
                interval: 300
            }).then(() => true).catch(() => false);

            if (!appeared) {
                console.log("Busy indicator did not appear → skipping wait");
                return;
            }
            await browser.waitUntil(async () => {
                const b = await busy.isDisplayed().catch(() => false);
                const a = await anim.isDisplayed().catch(() => false);
                return !(b || a);
            }, {
                timeout: timeoutInSeconds * 1000,
                interval: 300,
                timeoutMsg: "Busy indicator did not disappear"
            });
        } catch {
            console.warn("Busy indicator wait failed");
        }
    }

    async generateRandomFuncName(): Promise<string> {
        console.log(`AUTOMATION-FUNC-LOC-${Math.floor(Math.random() * 1000000)}`);
    return `AUTOMATION-FUNC-LOC-${Math.floor(Math.random() * 1000000)}`;
    }

    async generateRandomFuncDescName(): Promise<string> {
        console.log(`AUTOMATION-FUNC-LOC-DESC-${Math.floor(Math.random() * 1000000)}`);
    return `AUTOMATION-FUNC-LOC-DESC-${Math.floor(Math.random() * 1000000)}`;
    }

    async setValueWithDelay(element: any, value: string) {
    const el = await element;
    await el.waitForDisplayed({ timeout: 10000 });
    await el.clearValue();
    await el.setValue(value);
    await browser.pause(1500);
    }

    async waitForSAPPopupAndClose(timeoutInSeconds = 30): Promise<void> {
        const popUpCloseBtn = $("//button[@title='Close Lightbox']");
        try {
            if (await popUpCloseBtn.waitForDisplayed({ timeout: timeoutInSeconds * 1000 })) {
                await popUpCloseBtn.click();
            }
        } catch {
            console.log("No SAP popup appeared within timeout");
            console.log("Continuing without closing popup");
        }
    }

    async waitAndSelect(element: any) {
        const el = await element;
        await el.waitForDisplayed({ timeout: 10000 });
        await el.click();
        await this.waitForBusyIndicatorToDisappear();
    }

    async getTextWithWait(element: any) {
        const el = await element;
        await el.waitForDisplayed({ timeout: 10000 });
        return await el.getText();
    }

    async getValueWithWait(element: any) {
        const el = await element;
        await el.waitForDisplayed({ timeout: 10000 });
        return await el.getValue();
    }

    async verifyText(element: any, expected: string) {
        const el = await element;
        await el.waitForDisplayed({ timeout: 10000 });
        const actual = await el.getText();
        await expect(actual).toEqual(expected);
    }

    async verifyValue(element: any, expected: string) {
        const el = await element;
        await el.waitForDisplayed({ timeout: 10000 });
        const actual = await el.getValue();
        await expect(actual).toEqual(expected);
    }

    async scrollAndClick(element: any, timeout = 30000) {
        await element.waitForExist({ timeout });

        await browser.waitUntil(async () => await element.isExisting(), {
            timeout,
            interval: 500
        });

        await browser.pause(2000);

        const el = await element;

        await browser.execute((e) => {
            if (e && e.nodeType === 1) e.scrollIntoView({ block: 'center' });
        }, el);

        await browser.pause(1500);

        await browser.execute((e) => {
            if (e && e.nodeType === 1) e.click();
        }, el);

        await browser.pause(2000);
    }

    async jsClickElement(element: any): Promise<void> {
        const el = await element;
        await browser.execute((e: HTMLElement) => e.click(), el);
    }

    async waitForDropdownOpen(timeout = 10000): Promise<WebdriverIO.Element> {
        const dropdownXpaths = [
        '//ul[@role="listbox" and not(contains(@style,"display: none"))]',
        '//div[contains(@class,"sapUiPopup")]//ul[@role="listbox"]'
        ];

        await browser.waitUntil(async () => {
            for (const xpath of dropdownXpaths) {
                const listboxes = await browser.$$(xpath);

                for (const listbox of listboxes) {
                    try {
                        if (await listbox.isDisplayed()) {
                            const options = await listbox.$$('.//li[@role="option"]'); 
                            if (await options.length > 0) return true;
                        }
                    } catch {}
                }
            }
            return false;
        }, {
            timeout,
            timeoutMsg: 'No visible dropdown listbox with options found'
        });

        for (const xpath of dropdownXpaths) {
            const listboxes = await browser.$$(xpath);

            for (const listbox of listboxes) {
                try {
                    if (await listbox.isDisplayed()) {
                        const options = await listbox.$$('.//li[@role="option"]');
                        if (await options.length > 0) {
                            return listbox;
                        }
                    }
                } catch {}
            }
        }

        throw new Error('Dropdown opened but no usable listbox found');
    }

    async scrollIntoViewIfNeeded(element: WebdriverIO.Element) {
        await browser.execute((el: HTMLElement) => {

            function findScrollableParent(node: HTMLElement | null): HTMLElement {
                while (node) {
                    const style = window.getComputedStyle(node);
                    const overflowY = style.overflowY;
                    const overflow = style.overflow;

                    if (
                        overflowY === 'auto' || overflowY === 'scroll' ||
                        overflow === 'auto' || overflow === 'scroll'
                    ) {
                        return node;
                    }

                    node = node.parentElement;
                }
                return document.body as HTMLElement;
            }

            const scrollParent = findScrollableParent(el);
            scrollParent.scrollTop = el.offsetTop - 200;
            el.scrollIntoView({ block: 'center' });

        }, element);
    }

    async waitForAnyUI5OptionActive() {
        await browser.waitUntil(async () => {
            const listboxes = await $$('//ul[@role="listbox"]');

            for (const box of listboxes) {
                if (await box.isDisplayed()) return true;
            }
            return false;
        }, {
            timeout: 15000,
            timeoutMsg: 'UI5 dropdown did not open'
        });

        await browser.waitUntil(async () => {
            const listboxes = await $$('//ul[@role="listbox"]');

            for (const box of listboxes) {
                if (await box.isDisplayed()) {
                    const options = await box.$$('.//li[@role="option"]');
                    if (await options.length > 0) return true;
                }
            }
            return false;
        }, {
            timeout: 15000,
            timeoutMsg: 'Dropdown opened but no options found'
        });
    }

    async openDropdown(dropdownArrow: ReturnType<typeof $>) {
        const arrow = await dropdownArrow; 

        await arrow.waitForExist({ timeout: 10000 });

        await browser.execute(el => {
            el.scrollIntoView({ block: 'center', inline: 'center' });
        }, arrow);

        await browser.pause(300);

        await arrow.moveTo();
        await browser.pause(200);

        try {
            await arrow.click();
        } catch {}

        await browser.execute(el => el.click(), arrow);

        await browser.pause(500);
    }

    async selectCheckboxesForClass(noOfClass: number): Promise<void> {
        const classText = await $(`//header[.//text()='Assign Classes']/following-sibling::section//span[contains(text(),'Classes')]`);
        await classText.waitForDisplayed();
        const availableClasses = await this.getAssignedValue(await classText.getText());
        console.log(`Available Classes: ${availableClasses}`);
        const classesToSelect = Math.min(noOfClass, availableClasses);
        let selectedCount = 0;
        let rowIndex = 2;
        console.log(`Selecting ${classesToSelect} checkboxes...`);
        while (selectedCount < classesToSelect) {
            const checkbox = await $(`(//tr[@role="row"])[${rowIndex}]//div[@role="checkbox"]`);
            if (await checkbox.isExisting()) {
                await checkbox.scrollIntoView();
                await checkbox.waitForClickable({ timeout: 20000 });
                await checkbox.click();
                selectedCount++;
                console.log(`Selected checkbox ${selectedCount} at row ${rowIndex}`);
            }
            rowIndex++;
            if (rowIndex > 100) {
                break;
            }
        }
        console.log(`Checkbox selection completed.`);
    }

    async selectCheckboxes(noOfEquipment: number): Promise<void> {
        const firstCheckBox = await $('(//tr[@role="row"])[2]//div[@role="checkbox"]');
        await firstCheckBox.waitForDisplayed();
        await firstCheckBox.waitForClickable();
        console.log("Checkbox now clickable");
        console.log(`Selecting checkboxes...`);
        for (let i = 1; i <= noOfEquipment; i++) {
            const expectedRow = i * 2;
            let resultCell = await $(`(//tr[@role="row"])[${expectedRow}]//div[@role="checkbox"]`);

            if (!(await resultCell.isExisting())) {
                resultCell = await $(`(//tr[@role="row"])[${expectedRow + 1}]//div[@role="checkbox"]`);
            }

            if (await resultCell.isExisting()) {
                await resultCell.waitForClickable({ timeout: 20000 });
                await resultCell.click();
            }
        }
        console.log(`Checkbox selection completed.`);
    }

    async selectCheckboxesForPhase(noOfPhases: number): Promise<void> {
        for (let i = 0; i <= noOfPhases; i++) {
            const expectedRow = i ;
            let resultCell = await $(`//li[@aria-posinset="${expectedRow}"]//div[@aria-checked='false']`);

            if (!(await resultCell.isExisting())) {
                resultCell = await $(`//li[@aria-posinset="${expectedRow +1 }"]//div[@aria-checked='false']`);
            }

            if (await resultCell.isExisting()) {
                await resultCell.waitForClickable({ timeout: 20000 });
                await resultCell.click();
            }
        }
    }

    async generateUniqueName(base: string): Promise<string> {
        const timestamp = new Date().getTime();
        return `${base}_${timestamp}`;
    }

    async getAssignedValue(text: string): Promise<number> {
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
    }

    private get adaptFilter() {
        return $("//input[@placeholder='Search']/following::bdi[contains(text(),'Adapt Filters')]");
    }

async addAllAdaptFilter(): Promise<void> {
        console.log("Trying to open Adapt filter");
        await browser.switchFrame(null);
 
        if (await this.funLocIframe.isExisting()) {
            await this.switchToIframe(this.funLocIframe);
        } else if (await this.equipmentIframe.isExisting()) {
            await this.switchToIframe(this.equipmentIframe);
        }else if(await this.hazopIframe.isExisting()){
            await this.switchToIframe(this.hazopIframe);
        }else if(await this.rcmIframe.isExisting()){
            await this.switchToIframe(this.rcmIframe);
        }else if(await this.ASDIframe.isExisting()){
            await this.switchToIframe(this.ASDIframe);
        }else if(await this.notificationIframe.isExisting()){
            await this.switchToIframe(this.notificationIframe);
        }else if(await this.documentIframe.isExisting()){
            await this.switchToIframe(this.documentIframe);
        }
 
        await this.adaptFilter.waitForClickable({ timeout: 200000 });
        await this.adaptFilter.click();
        await browser.pause(5000);
        console.log("Adapt filter opened");
        let prevCount: number = -1;
 
        while (true) {
            const checkboxes: any = await $$(`(//div[contains(@class,'sapMDialog') and not(@aria-hidden='true')])[last()]//div[@role='checkbox' and @aria-checked='false']`);
            const uncheckedCount: number = checkboxes.length;
 
            if (uncheckedCount === 0) break;
 
            if (uncheckedCount === prevCount) {
                await browser.pause(2000);
            }
 
            const checkbox = checkboxes[0];
            try {
                await checkbox.click();
            } catch {
                await browser.execute((el) => el.click(), checkbox);
            }
 
            prevCount = uncheckedCount;
        }
 
        const filterNames = await $$('//tr[@role="row"]//bdi');
        const expectedFilters: string[] = [];
 
        for (const el of filterNames) {
            const text = (await el.getText()) || (await el.getAttribute("innerText")) || "";
            if (text.trim()) expectedFilters.push(text.trim());
        }
 
        await this.clickWithWait($('//button//bdi[text()="OK"]'));
        await browser.pause(5000);
 
        const actualFiltersElements = await $$('//label//bdi');
        const actualFilters: string[] = [];
 
        for (const el of actualFiltersElements) {
            const text = (await el.getText()) || (await el.getAttribute("innerText")) || "";
            if (text.trim()) actualFilters.push(text.trim());
        }
 
        const missingFilters: string[] = [];
        for (const expected of expectedFilters) {
            if (!actualFilters.includes(expected)) {
                missingFilters.push(expected);
            }
        }
 
        if (missingFilters.length > 0) {
            throw new Error(`Missing filters: ${missingFilters.join(', ')}`);
        }
    }

    async resetAllAdaptFilter(): Promise<void> {
        await this.clickWithWait(this.adaptFilter);
        await browser.pause(3000);
        const resetBtn = await $('//button//bdi[text()="Reset"]');
        await this.clickWithWait(resetBtn);
        await this.clickWithWait($('(//button[.//bdi[text()="OK"]])[last()]'));
        await this.clickWithWait($('//button//bdi[text()="OK"]'));
        await browser.pause(5000);
        const actualFiltersElements = await $$('//label//bdi');
        const remainingFilters: string[] = [];

        for (const el of actualFiltersElements) {
            const text = await el.getText();
            if (text.trim()) {
                remainingFilters.push(text.trim());
            }
        }
        console.log('Remaining Filters after reset:', remainingFilters);
        if (remainingFilters.length > 0) {
            throw new Error(`Reset failed: Filters still present: ${remainingFilters.join(', ')}`);
        }
        console.log('All filters successfully reset');
    }

    async generateRandomEquipmentName(): Promise<string> {
        console.log(`AUTO-EQUIP-${Math.floor(Math.random() * 10000)}`);
        return `${Math.floor(Math.random() * 10000000)}-EQUIP-AUTO`;
    }

    async generateRandomHazopName(): Promise<string> {
        console.log(`AUTOMATION-HAZOP-${Math.floor(Math.random() * 10000)}`);
        return `AUTOMATION-HAZOP-${Math.floor(Math.random() * 10000)}`;
    }

    public async verifyFieldsInListView(): Promise<void> {
        await this.waitForBusyIndicatorToDisappear();
        await browser.switchFrame(null);
        if(await this.funLocIframe.isExisting()) await this.switchToIframe(this.funLocIframe);
        else if (await this.equipmentIframe.isExisting()) await this.switchToIframe(this.equipmentIframe);
        else if (await this.hazopIframe.isExisting()) await this.switchToIframe(this.hazopIframe);
        else if (await this.rcmIframe.isExisting()) await this.switchToIframe(this.rcmIframe);
        else if (await this.ASDIframe.isExisting()) await this.switchToIframe(this.ASDIframe);

        if (await this.settingsBtn.isDisplayed().catch(() => false)) {
        await this.clickWithWait(this.settingsBtn);
        }

        if (await this.tableSettingsBtn.isDisplayed().catch(() => false)) {
            await this.clickWithWait(this.tableSettingsBtn);
        }
        await browser.pause(2000);
        const rows = await browser.$$("(//div[contains(@class,'sapMDialog') and not(@aria-hidden='true')])[last()]//tr[@role='row']");
        const rowsArr = Array.from(rows);
        let uncheckedCheckboxes: any[] = [];
        let removedFields: string[] = [];
        let selectedFields: string[] = [];

        for (let i = 0; i < rowsArr.length; i++) {

        const row = rowsArr[i];
        const checkbox = await row.$(".//div[@role='checkbox']");
        const textElem = await row.$(".//td[@role='gridcell']//bdi");
        if (!(await checkbox.isExisting())) continue;
        const text = ((await textElem.getText()) || "").trim();
        const state = await checkbox.getAttribute("aria-checked");
        if (text) selectedFields.push(text);
        if (state === "false") uncheckedCheckboxes.push(checkbox);
        }

        if (uncheckedCheckboxes.length > 0) {
            for (let i = 0; i < uncheckedCheckboxes.length; i++) {
                await uncheckedCheckboxes[i].click();
            }
        }
        else {
            const startIndex = rowsArr.length - 2;
            for (let i = startIndex; i < rowsArr.length; i++) {
                const row = rowsArr[i];
                const checkbox = await row.$(".//div[@role='checkbox']");
                const textElem = await row.$(".//td[@role='gridcell']//bdi");

                const text = ((await textElem.getText()) || "").trim();
                await checkbox.click();
                removedFields.push(text);
            }
        }

        await this.clickWithWait($("//h1[.//text()='View Settings']/following::button[.//text()='OK']"));
        await this.waitForBusyIndicatorToDisappear();
        await browser.pause(8000);

        const headerElems = await $$("//th//span");
        const rowElems = await $$("//tbody//tr[2]//span[1][normalize-space()][not(normalize-space()='Yes')]");

        for (const field of selectedFields) {

            if (removedFields.includes(field)) continue;

            let found = false;

            for (const el of headerElems) {
                const txt = ((await el.getText()) || "").trim();
                if (txt === field) {
                    console.log(`FOUND: ${field} in HEADER`);
                    found = true;
                    break;
                }
            }

            if (!found) {
                for (const el of rowElems) {
                    const txt = ((await el.getText()) || "").trim();
                    if (txt === field) {
                        console.log(`FOUND: ${field} in ROW`);
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                throw new Error(`Field NOT visible: ${field}`);
            }
        }

        for (const field of removedFields) {
            for (const el of headerElems) {
                const txt = ((await el.getText()) || "").trim();
                if (txt === field) {
                    throw new Error(`Field still visible after removal: ${field}`);
                }
            }
        }

        console.log("verifyFieldsInListView PASSED");
    }


   async resetFieldsInListView(): Promise<void> {
        const btn = await this.settingsBtn.isDisplayed().catch(() => false)
            ? this.settingsBtn
            : await this.tableSettingsBtn.isDisplayed().catch(() => false)
                ? this.tableSettingsBtn
                : null;

        if (!btn) throw new Error("Neither Settings nor Table Settings button is visible");

        await this.waitForBusyIndicatorToDisappear();
        await btn.waitForClickable({ timeout: 10000 });
        await btn.click();
        const resetBtn = await $('//h1[.//text()="View Settings"]/following::button[.//text()="Reset"]');

        if (!(await resetBtn.isExisting())) {
            await this.clickWithWait($('//button//bdi[text()="OK"]'));
            return;
        }

        await this.clickWithWait(resetBtn);
        await this.waitForBusyIndicatorToDisappear();
        await this.clickWithWait($('//span[text()="Warning"]//following::bdi[text()="OK"]'));
        await this.waitForBusyIndicatorToDisappear();
        await browser.pause(5000);
        const elems = await browser.$$(
            "(//div[contains(@class,'sapMDialog') and not(@aria-hidden='true')])[last()]//div[@role='checkbox' and @aria-checked='true']/ancestor::tr//td[@role='gridcell']//bdi"
        );
        const elemsArr = Array.from(elems);
        const resetFields: string[] = [];
        for (let i = 0; i < elemsArr.length; i++) {
            const text = ((await elemsArr[i].getText()) || "").trim();
            if (text && !resetFields.includes(text)) resetFields.push(text);
        }
        console.log("Fields after RESET:", resetFields);
        await this.clickWithWait($("//h1[.//text()='View Settings']/following::button[.//text()='OK']"));
        await this.waitForBusyIndicatorToDisappear();
        await browser.pause(8000);
        const headerElems = await $$("//th//span");
        const rowElems = await $$("//tbody//tr[2]//span[1][normalize-space()][not(normalize-space()='Yes')]");

        const headerTexts: string[] = [];
        const rowTexts: string[] = [];

        for (let i = 0; i < await headerElems.length; i++) {
        const t = ((await headerElems[i].getText()) || "").trim();
        if (t) headerTexts.push(t);
        }

        for (let i = 0; i < await rowElems.length; i++) {
        const t = ((await rowElems[i].getText()) || "").trim();
        if (t) rowTexts.push(t);
        }
        console.log("HEADER:", headerTexts);
        console.log("ROW:", rowTexts);
        for (const field of resetFields) {

        if (headerTexts.includes(field)) {
            console.log(`FOUND AFTER RESET: ${field} in HEADER`);
            continue;
        }

        if (rowTexts.includes(field)) {
            console.log(`FOUND AFTER RESET: ${field} in ROW`);
            continue;
        }

        throw new Error(`Reset failed, field missing: ${field}`);
        }
        console.log("resetFieldsInListView PASSED");
    }

    public async verifyShowHierarchy(): Promise<void> {
        await this.clickWithWait(this.showHierarchyBtn);
        await browser.pause(5000);  
        console.log("Show Hierarchy clicked and hierarchy displayed");
        console.log("Some of the below entries are present"); 

        const entries = await browser.execute(() => {
        return Array.from(document.querySelectorAll("div[style*='-webkit-line-clamp']"))
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 0);
        });

        console.log("Number of entries found:", entries.length);
        console.log("Entries:", entries);

        if (entries.length === 0) {
        throw new Error("No hierarchy entries found after clicking Show Hierarchy");
        }

        console.log("Hierarchy entries found successfully");
        console.log("Closing hierarchy view");
        await this.clickWithWait(this.closeHierarchyBtn);
        await browser.pause(3000);
    }

    public async verifyAnalyticsChart(): Promise<void> {
        console.log("Attempting to open Analytics Chart");
        await this.clickWithWait(this.showAnalyticChartBtn);
        console.log("Analytics chart is displayed");

        const charts = await $$("//span[text()='Analytics']/following::section//div//div[@aria-level='2']//div//div")
        if (await charts.length === 0) {
            throw new Error("No charts found in Analytics Chart view");
        }
        else {
            console.log(`Found ${charts.length} chart(s) in Analytics Chart view`);
            console.log("Analytics Chart entries:");
            for (const chart of charts) {
                let text: string = (await chart.getText()) || (await chart.getAttribute("innerText")) || "";
                console.log(text);
            }
        }

        console.log("Closing Analytics Chart view");
        if (await this.closeAnalyticChartBtn.isDisplayed().catch(() => false)) {
        await this.clickWithWait(this.closeAnalyticChartBtn);
            return;
        }

        if (await this.cancelAnalyticChartBtn.isDisplayed().catch(() => false)) {
            await this.clickWithWait(this.cancelAnalyticChartBtn);
        }
        await browser.pause(3000);
    }

    async createDownloadDir() {
        if (!fs.existsSync(this.downloadDir)) {
            fs.mkdirSync(this.downloadDir, { recursive: true });
        }
    }

    async cleanDownloads() {
        if (fs.existsSync(this.downloadDir)) {
            fs.readdirSync(this.downloadDir).forEach(file => {
                fs.unlinkSync(path.join(this.downloadDir, file));
            });
        }
    }

    async waitForDownload(extension: string = '.pdf'): Promise<string> {
        await browser.waitUntil(() => {
            const files = fs.readdirSync(this.downloadDir)
                .filter(f => f.endsWith(extension) && !f.endsWith('.crdownload'));
            return files.length > 0;
        }, { timeout: 20000 });

        const files = fs.readdirSync(this.downloadDir)
            .filter(f => f.endsWith(extension));

        const latest = files
            .map(file => ({
                name: file,
                time: fs.statSync(path.join(this.downloadDir, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time)[0];

        return path.join(this.downloadDir, latest.name);
    }

    async extractTextFromPDF(filePath: string): Promise<string> {
        const fs = await import('fs');
        const pdfjsLib: any = await import('pdfjs-dist/legacy/build/pdf.js');
        const data = new Uint8Array(fs.readFileSync(filePath));
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            const pageText = content.items.map((item: any) => item.str).join(' ');
            textContent += pageText + '\n';
        }
        return textContent
        .replace(/\s+/g, ' ')          
        .replace(/\s*-\s*/g, '-')     
        .replace(/([A-Z])\s+(?=[A-Z])/g, '$1') 
        .trim();
    }

    
    // Reads an .xlsx (or .xls / .csv) file 
     
    async readExcelData(filePath: string): Promise<Record<string, string>[]> {
        const xlsxModule: any = await import('xlsx');
        const XLSX: any = xlsxModule.default ?? xlsxModule;
        if (!fs.existsSync(filePath)) {
            throw new Error(`Excel file not found: ${filePath}`);
        }
        const workbook = XLSX.readFile(filePath);
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        return rows.map(row => {
            const normalised: Record<string, string> = {};
            for (const key of Object.keys(row)) {
                normalised[key.trim()] = String(row[key] ?? '').trim();
            }
            return normalised;
        });
    }


    //  Compares two .xlsx files cell-by-cell after normalising values via readExcelData.
    
    async compareExcelData(uploadedPath: string, downloadedPath: string): Promise<{ ok: boolean; diff: string[] }> {
        const uploaded = await this.readExcelData(uploadedPath);
        const downloaded = await this.readExcelData(downloadedPath);
        const diff: string[] = [];

        if (uploaded.length !== downloaded.length) {
            diff.push(`Row count mismatch — uploaded: ${uploaded.length}, downloaded: ${downloaded.length}`);
        }

        const rowsToCheck = Math.min(uploaded.length, downloaded.length);
        for (let i = 0; i < rowsToCheck; i++) {
            const up = uploaded[i];
            const dn = downloaded[i];
            const columns = new Set([...Object.keys(up), ...Object.keys(dn)]);
            for (const col of columns) {
                const a = up[col] ?? '';
                const b = dn[col] ?? '';
                if (a !== b) {
                    diff.push(`Row ${i + 1}, column "${col}": uploaded="${a}", downloaded="${b}"`);
                }
            }
        }

        return { ok: diff.length === 0, diff };
    }

    async getAdvFilterVariableName(): Promise<string> {

        const options = ["Criticality", "Abc Indicator"];

        for (const option of options) {
            await browser.pause(3000);
            const el = await $(`//li[@role='listitem'][.//div[text()='${option}']]`);

            if (await el.isDisplayed()) {
                await el.click();
                return option;
            }
        }

        throw new Error("Neither Criticality nor Abc Indicator found");
    }

    async createNewAdvancedFilter(filterName?: string): Promise<string> {
        await console.log("Creating new advanced filter");
        const uniqueFilterName = filterName ?? `Test Filter ${Date.now()}`;
        const advancedFilterBtn = await $('//span[text()="Advanced Filter"]/ancestor::button');

        await advancedFilterBtn.waitForExist({ timeout: 60000 });
        await advancedFilterBtn.waitForDisplayed({ timeout: 60000 });

        await this.clickWithWait(advancedFilterBtn, 5000);
        await browser.pause(1000);
        const filterInput = await $('//label[.//bdi[text()="Filter Name"]]/following::input[1]');
        await filterInput.waitForDisplayed();
        await filterInput.click();
        await filterInput.clearValue();
        await filterInput.addValue(uniqueFilterName);
        await this.clickWithWait($('//div[@role="button" and .//div[@title="New Item"]]'));
        await this.clickWithWait($('//li[.//span[text()="Variables"]]'));
        await browser.pause(2000);
        const searchInput = await $('//input[@placeholder="Search..." and @aria-label="Search..."]');
        await searchInput.waitForDisplayed();
        await searchInput.click();
        await searchInput.clearValue();
        await this.getAdvFilterVariableName();
        await this.clickWithWait($('//div[@role="button" and .//div[@title="New Item"]]'));
        await this.clickWithWait($('//li[.//span[text()="Operators"]]'));
        await browser.pause(2000);
        const operator = await $(`//button[.//bdi[text()='=']]`);
        await operator.waitForDisplayed();
        await operator.click();
        await this.clickWithWait($('//div[@role="button" and .//div[@title="New Item"]]'));
        const literalValue = await $(`//input[@placeholder='Enter a text or a number.']`);
        await literalValue.waitForDisplayed();
        await this.clickWithWait(literalValue);
        await literalValue.clearValue();
        await literalValue.addValue('A');
        await browser.pause(1000);
        await this.clickWithWait($('//button//bdi[text()="OK"]'));
        await browser.pause(1000);
        await this.clickWithWait($('//button//bdi[text()="Save"]'));
        await this.waitForBusyIndicatorToDisappear();
        await browser.pause(1000);  
        await this.clickWithWait($(`//h1[.//span[text()='Success']]//following::button[.//bdi[text()='OK']]`));
        console.log(`Created adapt filter: ${uniqueFilterName}`);
        return uniqueFilterName;
 
    }
 
    async deleteAdvancedFilter(): Promise<void> {
        await this.waitForBusyIndicatorToDisappear();
        await this.clickWithWait($('//button[@aria-label="Advanced Filter"]'));
        await browser.pause(2000);
        await this.clickWithWait($(`//div[@role='checkbox' and @aria-label='Select all rows']`));
        const deleteFlow = async () => {
            console.log("---- deleteFlow START ----");
            await this.clickWithWait($(`//button[@aria-label='Delete']`));
            await this.clickWithWait($(`//button//bdi[text()="Yes"]`));
            console.log("Clicked Delete -> Yes");
            console.log("---- deleteFlow END ----");
        };

        const waitForAnyPopup = async () => {
            console.log("---- waitForAnyPopup START ----");
            await browser.waitUntil(async () => {
                const err = await $("//header[.//text()='Error']").isDisplayed().catch(() => false);
                const suc = await $("//header[.//text()='Success']").isDisplayed().catch(() => false);
                return err || suc;
            }, { timeout: 10000 });
            console.log("Popup detected (Error or Success)");
            console.log("---- waitForAnyPopup END ----");
        };

        const clickAnyOkButton = async () => {
            console.log("---- clickAnyOkButton START ----");

            const errorOk = $(`//header[.//text()='Error']/following::bdi[.//text()='OK']`);
            const successOk = $(`//header[.//text()='Success']/following::button[.//text()='OK']`);

            if (await errorOk.isDisplayed().catch(()=>false)) {
                console.log("Error popup OK found → clicking");
                await errorOk.click();
            } else if (await successOk.isDisplayed().catch(()=>false)) {
                console.log("Success popup OK found → clicking");
                await successOk.click();
            } else {
                console.log("No OK button found");
            }

            console.log("Waiting for busy indicator after OK...");
            await this.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);

            console.log("---- clickAnyOkButton END ----");
        };

        const getAdvancedFilterCount = async () => {
            console.log("---- getAdvancedFilterCount START ----");

            const el = await $(`//span[contains(text(),'Advanced Filters')]`);
            await el.waitForDisplayed({ timeout: 10000 });

            const text = await el.getText();
            const count = await this.getAssignedValue(text);

            console.log(`Advanced Filters text: "${text}"`);
            console.log(`Parsed count value: ${count}`);

            console.log("---- getAdvancedFilterCount END ----");
            return count;
        };

        console.log("========= DELETE ADVANCED FILTER FLOW START =========");

        let attempts = 0;

        while (attempts < 3) {
            console.log(`\n***** DELETE ATTEMPT ${attempts + 1} *****`);

            await deleteFlow();
            await waitForAnyPopup();
            await clickAnyOkButton();

            const count = await getAdvancedFilterCount();

            if (count === 0) {
                console.log("Advanced Filter count is 0 → Deletion successful");
                break;
            }

            console.log(`Advanced Filter count still ${count} → Retrying delete`);
            attempts++;
        }

        if (attempts === 3) {
            throw new Error("Advanced Filters still not deleted after retries");
        }

        console.log("Preparing to close dialog...");
        const closeBtn = await $(`//button//bdi[normalize-space()='Close']`);
        await closeBtn.waitForDisplayed({ timeout: 10000 });
        await closeBtn.waitForClickable({ timeout: 10000 });
        console.log("Close button visible & clickable → clicking Close");
        await closeBtn.click();
        await this.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        const createHeader = await $(`//header//h1//span[normalize-space()='Create Advanced Filter']`);
        const isCreateScreenOpen = await createHeader.isDisplayed().catch(()=>false);
        if (isCreateScreenOpen) {
            console.log("Create Advanced Filter screen OPENED accidentally → clicking Cancel");

            const cancelBtn = await $(`//button//bdi[normalize-space()='Cancel']`);
            await cancelBtn.waitForDisplayed({ timeout: 10000 });
            await cancelBtn.waitForClickable({ timeout: 10000 });
            await cancelBtn.click();

            await this.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);

            console.log("Create Advanced Filter screen CLOSED");
        } else {
            console.log("Create Advanced Filter screen not opened → flow correct");
        }
        console.log("========= DELETE ADVANCED FILTER FLOW END =========");
 
    }
 
    async applyAdvancedFilter(): Promise<void> {
        await browser.pause(2000);
        const firstFilterCheckbox = await $(`(//tr[@role='row'])[2]//div[@role='checkbox']`);
        await firstFilterCheckbox.waitForDisplayed();
        await firstFilterCheckbox.click();
        await this.clickWithWait($('//button//bdi[text()="Apply"]'));
        await this.waitForBusyIndicatorToDisappear();
        await this.clickWithWait($('//button//bdi[text()="Go"]'));
        console.log("Applied advanced filter");
        const criticalityElement = await $(`(//tr[@aria-rowindex='2']/preceding::span[text()='Criticality']/following::span[text()='A'])[1]`);
        await criticalityElement.waitForExist({ timeout: 20000 });
        await criticalityElement.scrollIntoView();
        await criticalityElement.waitForDisplayed({ timeout: 20000 });
        if (!(await criticalityElement.isDisplayed())) {
            throw new Error("Criticality is NOT 'A'");
        }

        console.log("Criticality is correctly 'A'");
    }
 
    async resetAdvancedFilter(): Promise<void> {
        await this.clickWithWait(this.adaptFilter);
        await browser.pause(3000);
        const resetBtn = await $('//button//bdi[text()="Reset"]');
        await this.clickWithWait(resetBtn);
        await this.clickWithWait($('(//button[.//bdi[text()="OK"]])[last()]'));
        await browser.pause(1000);
        await this.clickWithWait($(`//h1//span[starts-with(normalize-space(),'Adapt Filters')] /ancestor::div[@role='dialog'] //footer//button[.//bdi[normalize-space()='OK']]`));
        await browser.pause(5000);
        const actualFiltersElements = await $$('//label//bdi');
        const remainingFilters: string[] = [];
        for (const el of actualFiltersElements) {
            const text = await el.getText();
            if (text.trim()) {
                remainingFilters.push(text.trim());
            }
        }
        console.log('Remaining Filters after reset:', remainingFilters);
        if (remainingFilters.length > 0) {
            throw new Error(`Reset failed: Filters still present: ${remainingFilters.join(', ')}`);
        }
        console.log('All filters successfully reset');
    }

    public async captureHeaderDetails() : Promise<Record<string, string>>   {
        if (await this.funLocIframe.isExisting()) {
            await this.switchToIframe(this.funLocIframe);
        } else if (await this.equipmentIframe.isExisting()) {
            await this.switchToIframe(this.equipmentIframe);
        }else if(await this.hazopIframe.isExisting()){
            await this.switchToIframe(this.hazopIframe);
        }else if(await this.rcmIframe.isExisting()){
            await this.switchToIframe(this.rcmIframe);
        }else if(await this.ASDIframe.isExisting()){
            await this.switchToIframe(this.ASDIframe);
        }else if(await this.CMLIframe.isExisting()){
            await this.switchToIframe(this.CMLIframe);
        }else if(await this.mspIframe.isExisting()){
            await this.switchToIframe(this.mspIframe);
        }else if(await this.reccWorkbenchIframe.isExisting()){
            await this.switchToIframe(this.reccWorkbenchIframe);
        }
        await this.waitForBusyIndicatorToDisappear();
        const result: any = {};
        const blocks = await $$(`//div[contains(@class,'sapFDynamicPageHeaderContent')]//*`);
        for (const block of blocks) {
            const titleEl = await block.$(`.//span[contains(@class,'sapMObjStatusTitle')]`);
            if (await titleEl.isExisting()) {
                const key = (await titleEl.getText()).trim();
                const valueEl = await block.$(`.//span[contains(@class,'sapMObjStatusText')]`);
                if (await valueEl.isExisting()) {
                    result[key] = (await valueEl.getText()).trim();
                }
                continue;
            }
            const labelEl = await block.$(`.//span[contains(@class,'sapMLabelTextWrapper')]`);
            if (await labelEl.isExisting()) {
                const key = (await labelEl.getText()).replace(":", "").trim();
                let value = "";
                const link = await block.$(`.//a`);
                if (await link.isExisting() && await link.isDisplayed()) {
                    value = await link.getText();
                }
                if (!value) {
                    const text = await block.$(`.//span[contains(@class,'sapMText')]`);
                    if (await text.isExisting() && await text.isDisplayed()) {
                        value = await text.getText();
                    }
                }
                if (!value) {
                    const exText = await block.$(`.//span[contains(@class,'sapMExTextString')]`);
                    if (await exText.isExisting() && await exText.isDisplayed()) {
                        value = await exText.getText();
                    }
                }
                if (key && value) {
                    result[key] = value.trim();
                }
            }
        }
        console.log(result);
        await browser.switchToParentFrame();
        return result;
    }

    public selectFromDropdown = async (el: any, downCount: number) => {
        await el.waitForDisplayed();
        await browser.pause(1500);
        await el.click();
        for (let i = 0; i < downCount; i++) {
            await browser.keys("ArrowDown");
        }
        await browser.keys("Enter");
        await browser.keys("Escape");  
        await browser.keys("Tab");
    };

    public rand(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public formatDate(daysMinus: number): string {
        const d = new Date();
        d.setDate(d.getDate() - daysMinus);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    }

    public formatDatePlus(daysMinus: number): string {
        const d = new Date();
        d.setDate(d.getDate() + daysMinus);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    }

    public async verifyProgressBar(element: any, sectionName: string) {
        if (!(await element.isExisting())) {
            throw new Error(`${sectionName} progress bar not found`);
        }
        const style = await element.getAttribute("style");
        if (!style) {
            throw new Error(`${sectionName} style attribute not found`);
        }
        const match = style.match(/flex-basis:\s*([\d.]+)%/);
        const value = match ? parseFloat(match[1]) : 0;
        if (value === 100) {
            console.log(`${sectionName} - All mandatory fields are filled`);
        } else {
            throw new Error(`${sectionName} - Not all mandatory fields filled, current: ${value}%`);
        }
    }

    async waitForBlockLayerToDisappear(timeoutInSeconds = 30): Promise<void> {
        const blockLayer = $("//div[contains(@class,'sapUiBLy')]");

        try {
            await browser.waitUntil(async () => {
                return !(await blockLayer.isDisplayed().catch(() => false));
            }, {
                timeout: timeoutInSeconds * 1000,
                interval: 200
            });
        } catch {
            console.warn("Block layer timeout");
        }
    }

    xpathString(value: string): string {
        const s = String(value);
        if (!s.includes('"')) {
            return `"${s}"`;
        }
        if (!s.includes("'")) {
            return `'${s}'`;
        }
        // Contains both quote types — build via concat().
        const parts = s.split('"').map(p => `"${p}"`).join(`, '"', `);
        return `concat(${parts})`;
    }
    
    public clickSuccessOkButton = async () => {
            console.log("---- clickSuccessOkButton START ----");

            const successOk = $(`//header[.//text()='Success']/following::button[.//text()='OK']`);

            if (await successOk.isDisplayed().catch(()=>false)) {
                console.log("Success popup OK found → clicking");
                await successOk.click();
            } else {
                console.log("No OK button found");
                
            }

            console.log("Waiting for busy indicator after OK...");
            await this.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);

            console.log("---- clickSuccessOkButton END ----");
    }
    async switchToVisibleAppFrame(): Promise<void> {
        await browser.switchFrame(null);
        const frames = await $$('//iframe');
        for (const frame of frames) {
            try {
                await browser.switchFrame(frame);
                // heuristics: page contains a search box or a heading
                const search = await $('//input[@type="search" or @placeholder="Search"]');
                const header = await $('//h1|//header//*[contains(text(),"Documents") or contains(.,"Documents")]');
                if (await search.isExisting()) {
                    return;
                }
                await browser.switchFrame(null);
            } catch {
                await browser.switchFrame(null);
            }
        }
        // if not found, stay at top-level (tests will fail later clearly)
    }

}

export default new Utils();
