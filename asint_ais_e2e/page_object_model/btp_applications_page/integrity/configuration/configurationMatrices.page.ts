import { $, browser } from '@wdio/globals';
import SapUtils from '../../../../utils/utils';

class MatricesPage {

    // ============================================================================
    // SELECTORS
    // ============================================================================

    // --- Page chrome -----------------------------------------------------------
    private get header()        { return $('//h1[contains(text(),"Configuration")]'); }
    private get matricesTile()  { return $('//div[@role="button"][.//span[normalize-space()="Matrices"]]'); }
    private get iFrame()        { return $('iframe[title="Application"]'); }

    // --- Matrix create dialog --------------------------------------------------
    private get createButton()         { return $('button[aria-label="Create"]'); }
    private get matrixTitleInput()     { return $('input[aria-labelledby="__label4"]'); }
    private get categoryValueHelpIcon() { return $('#idCategoryMultiInput-vhi'); }
    private get selectButton()         { return $('//bdi[normalize-space()="Select"]/ancestor::button'); }
    private get rowSizeIncrement()     { return $('#idMatrixStep1-incrementBtn'); }
    private get columnSizeIncrement()  { return $('#idMatrixStep2-incrementBtn'); }
    private get saveButton()           { return $('//bdi[normalize-space()="Save"]/ancestor::button'); }
    private get OkButton()             { return $('//bdi[text()="OK"]/ancestor::button'); }

    private categoryCheckboxByText(label: string) {
        return $(`//div[@role="dialog"]//li[@role="listitem"][.//div[contains(@class,"sapMSLITitleOnly") and contains(normalize-space(.),"${label}")]]//div[@role="checkbox"]`);
    }

    // --- Matrix detail / edit --------------------------------------------------
    private get createdMatrix()        { return $('//span[normalize-space()="AutomationMatrixTest"]'); }
    private get editButton()           { return $('button[aria-label="Edit"]'); }
    private get descriptionTextarea()  { return $('#idDetailDescTextArea-inner'); }
    private get matrixTitleEditInput() { return $('input.sapMInputBaseInner'); }

    // --- Risk colors -----------------------------------------------------------
    private get addRiskColorButton()         { return $('button[aria-label="Add Risk Color"]'); }
    private get riskColorDescriptionInput()  { return $('//div[contains(@class,"sapMDialog")]//input[contains(@class,"sapMInputBaseInner")]'); }
    private get colorPickerButton()          { return $('.asintRbiColorBtn'); }
    private get saveRiskColorButton()        { return $('//div[contains(@class,"sapMDialog")]//bdi[normalize-space()="Save"]/ancestor::button'); }
    private get riskColorsExpandButton()     { return $('(//button[@title="Expand/Collapse"])[2]'); }
    private get colorSelectionSaveButton()   { return $('//button[contains(@class, "sapMBtnInverted") and descendant::bdi[normalize-space()="Save"]]'); }

    private getColorOption(color: string)            { return $(`div[style*="${color}"]`); }
    private getRiskColorSelectButton(index: number)  { return $(`button[title="Select"][id$="-${index}"]`); }
    private getRiskColorDeleteButton(index: number)  { return $$('button[aria-label="Delete"]')[index]; }

    // --- X-Axis dialog ---------------------------------------------------------
    private get addXAxisButton()        { return $('button[aria-label="Add"]'); }
    private get xAxisDescriptionInput() { return $('//input[@class="sapMInputBaseInner" and @type="text"]'); }
    private get displayRangeToggle()    { return $('//*[normalize-space()="Display Range"]/following::div[@role="switch"][1]'); }
    private get displayTextToggle()     { return $('//*[normalize-space()="Display Text"]/following::div[@role="switch"][1]'); }
    private get ascendingToggle()       { return $('//*[normalize-space()="Ascending"]/following::div[@role="switch"][1]'); }
    private get descendingToggle()      { return $('//*[normalize-space()="Descending"]/following::div[@role="switch"][1]'); }
    private get xAxisExpandButton()     { return $('(//button[@title="Expand/Collapse"])[3]'); }

    // --- Y-Axis dialog ---------------------------------------------------------
    private get yAxisAddButton()         { return $('(//button[@title="Add"])[2]'); }
    private get yAxisDescriptionInput()  { return $('//input[@class="sapMInputBaseInner" and @type="text"]'); }
    private get yAxisDisplayTextToggle() { return $('//*[normalize-space()="Display Text"]/following::div[@role="switch"][1]'); }

    // --- Risk Line dialog ------------------------------------------------------
    private get addRiskLineButton()        { return $('button[aria-label="Add Risk Line"]'); }
    private get riskLineDescriptionInput() { return $('//div[@role="dialog"]//input[@type="text"]'); }
    private get yAxisDropdownArrow()       { return $('(//div[@role="dialog"]//span[contains(@class, "sapMSltArrow")])[1]'); }
    private get xAxisDropdownArrow()       { return $('(//div[@role="dialog"]//span[contains(@class, "sapMSltArrow")])[2]'); }
    private get yAxisLabelOption()         { return $('(//li[@role="option" and text()="Y-Axis Label"])[last()]'); }
    private get xAxisDescriptionOption()   { return $('(//li[@role="option" and text()="description"])[last()]'); }
    private get startXInput()              { return $('(//div[@role="dialog"]//input[@type="number"])[1]'); }
    private get startYInput()              { return $('(//div[@role="dialog"]//input[@type="number"])[2]'); }
    private get endXInput()                { return $('(//div[@role="dialog"]//input[@type="number"])[3]'); }
    private get endYInput()                { return $('(//div[@role="dialog"]//input[@type="number"])[4]'); }

    // --- Publish / revision / settings -----------------------------------------
    private get publishButton()         { return $('//bdi[normalize-space()="Publish"]/ancestor::button'); }
    private get newRevisionButton()     { return $('//bdi[normalize-space()="New Revision"]/ancestor::button'); }
    private get yesConfirmationButton() { return $('//bdi[normalize-space()="Yes"]/ancestor::button'); }
    private get matrixSettingsButton()  { return $('button[title="Settings"]'); }

    // --- Listview row (post-publish / post-revision) ---------------------------
    // Locate a row by its title cell so we don't depend on dynamic id suffixes.
    private listRowByTitle(title: string) {
        return $(`//tr[contains(@class,"sapMListTblRow")][.//span[normalize-space()="${title}"]]`);
    }
    private listRowCheckboxByTitle(title: string) {
        return $(`//tr[contains(@class,"sapMListTblRow")][.//span[normalize-space()="${title}"]]//div[contains(@class,"sapMCbBg")]`);
    }
    private listRowCellByTitle(title: string, columnKey: string) {
        return $(`//tr[contains(@class,"sapMListTblRow")][.//span[normalize-space()="${title}"]]//td[contains(@data-sap-ui-column,"${columnKey}")]`);
    }

    // Backwards-compatible alias kept in case other specs still reference it.
    private get createdMatrixCheckbox() { return this.listRowCheckboxByTitle('AutomationMatrixTest_007'); }

    // --- Rendered Risk Matrix SVG (read-only verification) ---------------------
    private get riskMatrixSvg() { return $('div.asintRbiCustomRiskMatrix svg'); }
    private getMatrixCell(x: string, y: string) { return $(`rect[x="${x}"][y="${y}"]`); }


    // ============================================================================
    // ACTIONS
    // ============================================================================

    async isAppLoaded(): Promise<boolean> {
        try {
            const hd = await this.header;
            await hd.waitForDisplayed({ timeout: 20000 });
            return true;
        } catch {
            return false;
        }
    }

    async clickOkButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.clickWithWait(this.OkButton);
        console.log('[ACTION] OK button clicked after upload');
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async navigateToMatrices(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.switchToIframe(this.iFrame);
        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.waitForSAPPopupAndClose(5);

        await SapUtils.clickWithWait(this.matricesTile);
        console.log('[ACTION] Matrices tile clicked');

        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.waitForSAPPopupAndClose(5);
    }

    async clickCreateButton(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.clickWithWait(this.createButton);
        console.log('[ACTION] Create (+) button clicked');
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async createMatrix(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.setValueWithWait(this.matrixTitleInput, 'AutomationMatrixTest');
        console.log('[ACTION] Matrix title entered');

        await SapUtils.clickWithWait(this.categoryValueHelpIcon);
        console.log('[ACTION] Category value help opened');

        const categoriesToSelect = ['Asset Strategy Development', 'HAZOP', 'LOPA'];
        for (const label of categoriesToSelect) {
            const cb = await this.categoryCheckboxByText(label);
            await cb.waitForDisplayed({ timeout: 20000 });
            const alreadyChecked = (await cb.getAttribute('aria-checked')) === 'true';
            if (!alreadyChecked) {
                await SapUtils.clickWithWait(cb);
                console.log(`[ACTION] Category selected: ${label}`);
            } else {
                console.log(`[SKIP] Category already selected: ${label}`);
            }
        }

        await SapUtils.clickWithWait(this.selectButton);
        console.log('[ACTION] Select button clicked');

        await SapUtils.clickWithWait(this.rowSizeIncrement);
        console.log('[ACTION] Row size increased');

        await SapUtils.clickWithWait(this.columnSizeIncrement);
        console.log('[ACTION] Column size increased');

        await SapUtils.clickWithWait(this.saveButton);
        console.log('[ACTION] Matrix saved');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async openCreatedMatrix(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.waitForSAPPopupAndClose(5);
        await SapUtils.clickWithWait(this.createdMatrix);
        console.log('[ACTION] Created Matrix opened');
        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.waitForSAPPopupAndClose(5);
    }

    async editMatrix(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.editButton);
        console.log('[ACTION] Edit button clicked');

        await SapUtils.setValueWithWait(this.descriptionTextarea, 'description');
        console.log('[ACTION] Description entered');

        await SapUtils.setValueWithWait(this.matrixTitleEditInput, 'AutomationMatrixTest_007');
        console.log('[ACTION] Matrix title updated');

        await SapUtils.clickWithWait(this.saveButton);
        console.log('[ACTION] Save button clicked');

        await SapUtils.clickWithWait(this.OkButton);
        console.log('[ACTION] Update confirmation accepted');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async addRiskColor(description: string, color: string): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.addRiskColorButton);
        console.log('[ACTION] Add Risk Color button clicked');

        await SapUtils.setValueWithWait(this.riskColorDescriptionInput, description);
        console.log(`[ACTION] Description entered: ${description}`);

        await SapUtils.clickWithWait(this.colorPickerButton);
        console.log('[ACTION] Color picker opened');

        await SapUtils.clickWithWait(this.getColorOption(color));
        console.log(`[ACTION] Color selected: ${color}`);

        await SapUtils.clickWithWait(this.saveRiskColorButton);
        await SapUtils.clickWithWait(this.OkButton);

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async deleteRiskColor(index: number = 0): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        const expandBtn = await this.riskColorsExpandButton;
        await expandBtn.waitForDisplayed({ timeout: 20000 });
        if ((await expandBtn.getAttribute('aria-expanded')) === 'false') {
            await SapUtils.clickWithWait(expandBtn, 1000);
            console.log('[ACTION] Risk Colors panel expanded to reveal Delete icon');
        }

        const deleteBtn = await this.getRiskColorDeleteButton(index);
        await SapUtils.clickWithWait(deleteBtn);
        console.log(`[ACTION] Delete button clicked for Risk Color at index ${index}`);

        await SapUtils.clickWithWait(this.OkButton);
        console.log('[ACTION] Delete confirmation accepted (OK)');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async deleteAxisEntry(label: string): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        const expandBtn = await this.xAxisExpandButton;
        await expandBtn.waitForDisplayed({ timeout: 20000 });
        if ((await expandBtn.getAttribute('aria-expanded')) === 'false') {
            await SapUtils.clickWithWait(expandBtn, 1000);
            console.log('[ACTION] X-Axis panel expanded to reveal Delete icon');
        }

        const deleteBtn = $(
            `//bdi[normalize-space()="${label}"]/ancestor::li//button[@aria-label="Delete"]`
        );
        await SapUtils.clickWithWait(deleteBtn);
        console.log(`[ACTION] Delete button clicked for axis entry: ${label}`);

        await SapUtils.clickWithWait(this.OkButton);
        console.log('[ACTION] Axis delete confirmation accepted (OK)');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async assignColorToCells(colorIndex: number, cellCoordinates: {x: string, y: string}[]): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        const expandBtn = await this.riskColorsExpandButton;
        await expandBtn.waitForDisplayed({ timeout: 20000 });

        const isExpanded = await expandBtn.getAttribute('aria-expanded');
        if (isExpanded === 'false') {
            await SapUtils.clickWithWait(expandBtn, 1000);
            console.log('[ACTION] Risk Colors panel expanded');
        }

        await SapUtils.clickWithWait(this.getRiskColorSelectButton(colorIndex), 500);
        console.log(`[ACTION] Color Select button for index ${colorIndex} clicked`);

        for (const coord of cellCoordinates) {
            const cell = await this.getMatrixCell(coord.x, coord.y);
            await SapUtils.clickWithWait(cell, 500);
            console.log(`[ACTION] Colored matrix cell at X:${coord.x}, Y:${coord.y}`);
        }

        await SapUtils.clickWithWait(this.colorSelectionSaveButton);
        await SapUtils.clickWithWait(this.OkButton);

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async configureXAxis(description: string, shouldEnable: boolean): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.addXAxisButton);
        console.log('[ACTION] X-Axis Add button clicked');

        await SapUtils.setValueWithWait(this.xAxisDescriptionInput, description);
        console.log(`[ACTION] X-Axis description entered: ${description}`);

        const rangeToggle = await this.displayRangeToggle;
        await rangeToggle.waitForDisplayed({ timeout: 20000 });
        const rangeOn = await rangeToggle.getAttribute('aria-checked') === 'true';
        if (!rangeOn) {
            await SapUtils.clickWithWait(rangeToggle);
            console.log('[ACTION] Display Range switched to YES');
        } else {
            console.log('[SKIP] Display Range already YES');
        }
        await browser.waitUntil(async () => {
            return (await rangeToggle.getAttribute('aria-checked')) === 'true';
        }, { timeout: 10000, timeoutMsg: 'Display Range toggle did not switch to YES' });

        const toggle = await this.displayTextToggle;
        await toggle.waitForDisplayed({ timeout: 20000 });
        const isEnabled = await toggle.getAttribute('aria-checked') === 'true';
        console.log(`[INFO] Current toggle state: ${isEnabled ? 'YES' : 'NO'}`);

        if (isEnabled !== shouldEnable) {
            await SapUtils.clickWithWait(toggle);
            console.log(`[ACTION] Toggle switched to ${shouldEnable ? 'YES' : 'NO'}`);
        } else {
            console.log('[SKIP] Toggle already in desired state');
        }

        await browser.waitUntil(async () => {
            const state = await toggle.getAttribute('aria-checked');
            return state === (shouldEnable ? 'true' : 'false');
        }, { timeout: 10000, timeoutMsg: 'Toggle state did not update' });

        await SapUtils.waitForBusyIndicatorToDisappear();

        // Force Ascending ON so X-axis columns stay in Low | High | Text order.
        const ascToggle = await this.ascendingToggle;
        await ascToggle.waitForDisplayed({ timeout: 20000 });
        const ascOn = await ascToggle.getAttribute('aria-checked') === 'true';
        console.log(`[INFO] Ascending current state: ${ascOn ? 'ON' : 'OFF'}`);

        if (!ascOn) {
            await SapUtils.clickWithWait(ascToggle);
            console.log('[ACTION] Ascending switched to ON');
        } else {
            console.log('[SKIP] Ascending already ON');
        }

        await browser.waitUntil(async () => {
            return (await ascToggle.getAttribute('aria-checked')) === 'true';
        }, { timeout: 10000, timeoutMsg: 'Ascending toggle did not switch to ON' });
    }

    // Resolve the column dynamically via aria-colindex so Low/High swaps when Ascending/Descending flips.
    private async getPointConfigInput(rowIndex: number, columnHeader: 'Low' | 'High' | 'Text') {
        const dialogTable = '//div[@role="dialog"]//table[.//th[.//span[normalize-space()="Low"]]]';
        const headerCell = await $(`${dialogTable}//th[.//span[normalize-space()="${columnHeader}"]]`);
        await headerCell.waitForExist({ timeout: 20000 });
        const colIndex = await headerCell.getAttribute('aria-colindex');
        const inputType = columnHeader === 'Text' ? 'text' : 'number';
        return $(`${dialogTable}//tr[@aria-rowindex="${rowIndex + 2}"]//td[@aria-colindex="${colIndex}"]//input[@type="${inputType}"]`);
    }

    // SAP cascade: only row 0 has Low and High editable; rows 1-2 have one readonly cell auto-derived from above.
    async enterTextValue(row: number, low: string, text: string, high?: string): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        const lowInput = await this.getPointConfigInput(row, 'Low');
        if (!(await lowInput.getAttribute('readonly'))) {
            await SapUtils.setValueWithWait(lowInput, low);
            console.log(`[ACTION] X-Axis row ${row} Low set to ${low}`);
        } else {
            console.log(`[SKIP] X-Axis row ${row} Low is auto-derived (readonly)`);
        }

        if (high !== undefined) {
            const highInput = await this.getPointConfigInput(row, 'High');
            if (!(await highInput.getAttribute('readonly'))) {
                await SapUtils.setValueWithWait(highInput, high);
                console.log(`[ACTION] X-Axis row ${row} High set to ${high}`);
            } else {
                console.log(`[SKIP] X-Axis row ${row} High is auto-derived (readonly)`);
            }
        }

        const textInput = await this.getPointConfigInput(row, 'Text');
        await SapUtils.setValueWithWait(textInput, text);
        console.log(`[ACTION] X-Axis row ${row} Text set to ${text}`);

        if (row === 2) {
            await SapUtils.clickWithWait(this.saveRiskColorButton);
            await SapUtils.clickWithWait(this.OkButton);
        }
    }

    async configureYAxis(description: string, shouldEnableToggle: boolean): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.yAxisAddButton);
        console.log('[ACTION] Y-Axis Add (+) button clicked');

        await SapUtils.setValueWithWait(this.yAxisDescriptionInput, description);
        console.log(`[ACTION] Y-Axis description entered: ${description}`);

        const toggle = await this.yAxisDisplayTextToggle;
        await toggle.waitForDisplayed({ timeout: 20000 });
        const isEnabled = await toggle.getAttribute('aria-checked') === 'true';

        if (isEnabled !== shouldEnableToggle) {
            await SapUtils.clickWithWait(toggle);
            console.log(`[ACTION] Y-Axis Toggle switched to ${shouldEnableToggle}`);
        }

        await browser.waitUntil(async () => {
            const state = await toggle.getAttribute('aria-checked');
            return state === (shouldEnableToggle ? 'true' : 'false');
        }, { timeout: 5000 });

        // Force Descending ON so Y-axis columns stay in High | Low | Text order (overrides X-axis carry-over).
        const descToggle = await this.descendingToggle;
        await descToggle.waitForDisplayed({ timeout: 20000 });
        const descOn = await descToggle.getAttribute('aria-checked') === 'true';
        console.log(`[INFO] Y-Axis Descending current state: ${descOn ? 'ON' : 'OFF'}`);
        if (!descOn) {
            await SapUtils.clickWithWait(descToggle);
            console.log('[ACTION] Y-Axis Descending switched to ON');
        } else {
            console.log('[SKIP] Y-Axis Descending already ON');
        }
        await browser.waitUntil(async () => {
            return (await descToggle.getAttribute('aria-checked')) === 'true';
        }, { timeout: 10000, timeoutMsg: 'Y-Axis Descending toggle did not switch to ON' });

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    // In Descending mode write High BEFORE Low: writing Low first triggers a cascade that wipes row 0's High back to 0.
    async enterYAxisRowValue(row: number, low: string, text: string, high?: string): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        if (high !== undefined) {
            const highInput = await this.getPointConfigInput(row, 'High');
            if (!(await highInput.getAttribute('readonly'))) {
                await SapUtils.setValueWithWait(highInput, high);
                console.log(`[ACTION] Y-Axis row ${row} High set to ${high}`);
                await browser.pause(300);
            } else {
                console.log(`[SKIP] Y-Axis row ${row} High is auto-derived (readonly)`);
            }
        }

        const lowInput = await this.getPointConfigInput(row, 'Low');
        if (!(await lowInput.getAttribute('readonly'))) {
            await SapUtils.setValueWithWait(lowInput, low);
            console.log(`[ACTION] Y-Axis row ${row} Low set to ${low}`);
            await browser.pause(300);
        } else {
            console.log(`[SKIP] Y-Axis row ${row} Low is auto-derived (readonly)`);
        }

        const textInput = await this.getPointConfigInput(row, 'Text');
        await SapUtils.setValueWithWait(textInput, text);
        console.log(`[ACTION] Y-Axis row ${row} Text set to ${text}`);
        await browser.pause(300);

        if (row === 2) {
            await SapUtils.waitForBusyIndicatorToDisappear();
            await SapUtils.clickWithWait(this.saveRiskColorButton);
            await SapUtils.clickWithWait(this.OkButton);
            await SapUtils.waitForBusyIndicatorToDisappear();
        }
    }

    // ============================================================================
    // RISK LINE ACTION
    // ============================================================================

    async addRiskLine(
        description: string,
        colorHex: string,
        startX: string,
        startY: string,
        endX: string,
        endY: string
    ): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.addRiskLineButton);
        console.log('[ACTION] Add Risk Line button clicked');

        await SapUtils.setValueWithWait(this.riskLineDescriptionInput, description);
        console.log(`[ACTION] Risk Line Description entered: ${description}`);

        await SapUtils.clickWithWait(this.colorPickerButton);
        const colorOption = await $(`div[data-sap-ui-color="${colorHex}"]`);
        await SapUtils.clickWithWait(colorOption);
        console.log(`[ACTION] Risk Line Color selected: ${colorHex}`);

        await SapUtils.clickWithWait(this.yAxisDropdownArrow, 1000);
        await SapUtils.clickWithWait(this.yAxisLabelOption);
        console.log('[ACTION] Y-Axis selected: Y-Axis Label');

        await SapUtils.clickWithWait(this.xAxisDropdownArrow, 1000);
        await SapUtils.clickWithWait(this.xAxisDescriptionOption);
        console.log('[ACTION] X-Axis selected: description');

        await SapUtils.setValueWithWait(this.startXInput, startX);
        await SapUtils.setValueWithWait(this.startYInput, startY);
        await SapUtils.setValueWithWait(this.endXInput, endX);
        await SapUtils.setValueWithWait(this.endYInput, endY);
        console.log(`[ACTION] Coordinates entered - Start(${startX}, ${startY}), End(${endX}, ${endY})`);

        await SapUtils.clickWithWait(this.saveRiskColorButton);
        await SapUtils.clickWithWait(this.OkButton);

        await SapUtils.waitForBusyIndicatorToDisappear();
        console.log('[SUCCESS] Risk Line saved');
    }

    // ============================================================================
    // VERIFICATION
    // ============================================================================

    // Verifies the rendered Risk Matrix SVG shows all configured X/Y labels and at least one risk line before Publish.
    async verifyMatrixDetails(expected: {
        xAxisDescription: string;
        xAxisSubLabels: string[];
        xAxisRangeLabels: string[];
        yAxisLabel: string;
        yAxisSubLabels: string[];
    }): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        const svg = await this.riskMatrixSvg;
        await svg.waitForDisplayed({ timeout: 20000 });
        console.log('[VERIFY] Risk Matrix SVG is displayed');

        const collectTexts = async (selector: string): Promise<string[]> => {
            const els = await $$(selector);
            const texts: string[] = [];
            for (const el of els) {
                const t = await el.getText();
                texts.push((t || '').trim());
            }
            return texts;
        };

        const normalizedXSub = await collectTexts(
            'div.asintRbiCustomRiskMatrix svg text.asIntRbiRMXSubLabelPoint'
        );
        console.log(`[VERIFY] X-Axis sub-labels found: ${JSON.stringify(normalizedXSub)}`);
        for (const expectedLabel of expected.xAxisSubLabels) {
            if (!normalizedXSub.includes(expectedLabel)) {
                throw new Error(
                    `X-Axis sub-label "${expectedLabel}" not displayed. Found: ${JSON.stringify(normalizedXSub)}`
                );
            }
        }

        const normalizedXRange = await collectTexts(
            'div.asintRbiCustomRiskMatrix svg text.asIntRbiRMXLabelPoint'
        );
        console.log(`[VERIFY] X-Axis range labels found: ${JSON.stringify(normalizedXRange)}`);
        for (const expectedRange of expected.xAxisRangeLabels) {
            if (!normalizedXRange.includes(expectedRange)) {
                throw new Error(
                    `X-Axis range label "${expectedRange}" not displayed. Found: ${JSON.stringify(normalizedXRange)}`
                );
            }
        }

        const normalizedYSub = await collectTexts(
            'div.asintRbiCustomRiskMatrix svg text.asIntRbiRMYSubLabelPoint'
        );
        console.log(`[VERIFY] Y-Axis sub-labels found: ${JSON.stringify(normalizedYSub)}`);
        for (const expectedLabel of expected.yAxisSubLabels) {
            if (!normalizedYSub.includes(expectedLabel)) {
                throw new Error(
                    `Y-Axis sub-label "${expectedLabel}" not displayed. Found: ${JSON.stringify(normalizedYSub)}`
                );
            }
        }

        const normalizedTitles = await collectTexts(
            'div.asintRbiCustomRiskMatrix svg text.asintRbiLabelText'
        );
        console.log(`[VERIFY] Axis title labels found: ${JSON.stringify(normalizedTitles)}`);

        if (!normalizedTitles.includes(expected.xAxisDescription)) {
            throw new Error(
                `X-Axis description "${expected.xAxisDescription}" not displayed. Found: ${JSON.stringify(normalizedTitles)}`
            );
        }
        if (!normalizedTitles.includes(expected.yAxisLabel)) {
            throw new Error(
                `Y-Axis label "${expected.yAxisLabel}" not displayed. Found: ${JSON.stringify(normalizedTitles)}`
            );
        }

        // Risk lines render as <line> elements inside the matrix SVG.
        const lineEls = await $$('div.asintRbiCustomRiskMatrix svg line');
        let lineCount = 0;
        for (const _el of lineEls) lineCount++;
        console.log(`[VERIFY] Risk Line <line> elements found: ${lineCount}`);
        if (lineCount < 1) {
            throw new Error('Risk Line is not displayed on the matrix (no <line> elements found).');
        }

        console.log('[SUCCESS] Matrix details verified before Publish');
    }

    /**
     * Verifies a row in the Matrices listview against an expected snapshot.
     * Used after Publish (status=Published) and after New Revision (status=Unpublished)
     * to make sure ALL configured details survive the lifecycle. Fails if any cell
     * value (incl. Categories — known to regress empty after a revision) drifts.
     */
    async verifyMatrixListRow(expected: {
        title: string;
        description: string;
        rowSize: string;
        colSize: string;
        status: string;
        version: string;
        categories: string;
    }): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        const row = await this.listRowByTitle(expected.title);
        await row.waitForDisplayed({ timeout: 20000 });
        console.log(`[VERIFY] Matrix row "${expected.title}" is displayed in the listview`);

        const readCellText = async (columnKey: string, innerSelector?: string): Promise<string> => {
            const cell = await this.listRowCellByTitle(expected.title, columnKey);
            await cell.waitForExist({ timeout: 20000 });
            const target = innerSelector ? await cell.$(innerSelector) : cell;
            const raw = await target.getText();
            return (raw || '').trim();
        };

        const assertEquals = (label: string, actual: string, expectedValue: string) => {
            if (actual !== expectedValue) {
                throw new Error(
                    `Listview row "${expected.title}" — ${label} mismatch. Expected "${expectedValue}", got "${actual}".`
                );
            }
            console.log(`[VERIFY] ${label} = "${actual}" OK`);
        };

        const actualTitle       = await readCellText('desc',           '.sapMObjectIdentifierTitle span');
        const actualDescription = await readCellText('desc',           '.sapMObjectIdentifierText span');
        const actualRowSize     = await readCellText('rowSize',        'span');
        const actualColSize     = await readCellText('colSize',        'span');
        const actualStatus      = await readCellText('status',         '.sapMObjStatusText');
        const actualVersion     = await readCellText('matrixVersion',  'span');
        const actualCategories  = await readCellText('matrixCategory', 'span');

        assertEquals('Title',       actualTitle,       expected.title);
        assertEquals('Description', actualDescription, expected.description);
        assertEquals('Row Size',    actualRowSize,     expected.rowSize);
        assertEquals('Column Size', actualColSize,     expected.colSize);
        assertEquals('Status',      actualStatus,      expected.status);
        assertEquals('Version',     actualVersion,     expected.version);

        if (actualCategories.length === 0) {
            throw new Error(
                `Listview row "${expected.title}" — Categories cell is EMPTY after ${expected.status}. ` +
                `Expected "${expected.categories}". This is the known regression where categories drop after New Revision.`
            );
        }
        assertEquals('Categories', actualCategories, expected.categories);

        console.log(`[SUCCESS] Listview row "${expected.title}" matches expected snapshot (${expected.status})`);
    }

    async publishMatrix(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.publishButton);
        await SapUtils.clickWithWait(this.yesConfirmationButton);
        await SapUtils.clickWithWait(this.OkButton);

        console.log('[ACTION] Publish button clicked');
        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async createNewRevision(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.newRevisionButton);
        console.log('[ACTION] New Revision button clicked');

        await SapUtils.clickWithWait(this.yesConfirmationButton);
        console.log('[ACTION] New Revision confirmation accepted');

        await SapUtils.clickWithWait(this.OkButton);
        console.log('[ACTION] New Revision success popup acknowledged');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    /**
     * Selects the matrix row checkbox by title and triggers the delete flow
     * (the toolbar Settings/trash button), confirming the Yes prompt and OK.
     */
    async deleteMatrixByTitle(title: string): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.listRowCheckboxByTitle(title));
        console.log(`[ACTION] Matrix row checkbox selected: ${title}`);

        await SapUtils.clickWithWait(this.matrixSettingsButton);
        console.log('[ACTION] Delete (Settings) button clicked');

        await SapUtils.clickWithWait(this.yesConfirmationButton);
        console.log('[ACTION] Delete confirmation accepted (Yes)');

        await SapUtils.clickWithWait(this.OkButton);
        console.log('[ACTION] Delete success popup acknowledged (OK)');

        await SapUtils.waitForBusyIndicatorToDisappear();
    }

    async selectMatrixAndOpenSettings(): Promise<void> {
        await SapUtils.waitForBusyIndicatorToDisappear();

        await SapUtils.clickWithWait(this.createdMatrixCheckbox);
        console.log('[ACTION] Matrix checkbox selected');

        await SapUtils.clickWithWait(this.matrixSettingsButton);
        console.log('[ACTION] Settings button clicked');

        await SapUtils.clickWithWait(this.yesConfirmationButton);
        await SapUtils.clickWithWait(this.OkButton);

        await SapUtils.waitForBusyIndicatorToDisappear();
    }
}

export default new MatricesPage();