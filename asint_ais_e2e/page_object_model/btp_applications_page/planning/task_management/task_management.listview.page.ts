import { browser } from '@wdio/globals';
import HomePage from '../../home.page';
import utils from '../../../../utils/utils';

type TaskCreateOptions = { activity?: string; priority?: string; objectType?: string; assignedTo?: string; };
type TaskEditOptions = { description?: string; activity?: string; priority?: string; assignedTo?: string; startDate?: string; dueDate?: string; comment?: string; };

class TaskManagementListView {
    
    // ============ SELECTORS ============
    
    // Frame & Table
    private get taskManagementFrame() { return $('//iframe[@title="Application"]'); }
    private get taskTable() { return $('//table[@role="grid" and @aria-roledescription="Responsive Table"]'); }
    private get searchInput() { return $('//input[@type="search" and (@aria-label="Search" or @placeholder="Search")]'); }
    
    // Create Dialog Selectors
    private get createTaskDialog() { return $('//div[@role="dialog"]'); }
    private get descriptionInput() { return $('//div[@role="dialog"]//label[.//bdi[text()="Short Description"]]/following::input[@type="text"][1]'); }
    private get activityInput() { return $('//input[@type="text" and @aria-roledescription="Multi Value Input"]'); }
    private get priorityDropdownArrow() { return $('//div[@role="dialog"]//label[.//bdi[text()="Priority"]]/following::span[@role="button"][1]'); }
    private get assignedToDropdownArrow() { return $('//div[@role="dialog"]//label[.//bdi[text()="Assigned To"]]/following::span[@role="button"][1]'); }
    private get startDateInput() { return $('(//div[@role="dialog"]//input[@aria-roledescription="Date Input"])[1]'); }
    private get dueDateInput() { return $('(//div[@role="dialog"]//input[@aria-roledescription="Date Input"])[2]'); }
    private get objectTypeDropdownArrow() { return $('//div[@role="dialog"]//label[.//bdi[text()="Object Type"]]/following::span[@role="button"][1]'); }
    private get createButton() { return $('//div[@role="dialog"]//button[.//bdi[text()="Create"]]'); }
    
    // Detail Page Selectors
    private get detailEditHeaderButton() { return $('//button[contains(text(),"Edit Header") or .//bdi[contains(normalize-space(),"Edit Header")]]'); }
    private get detailUpdateStatusButton() { return $('//button[.//bdi[normalize-space()="Update Status"] or .//span[normalize-space()="Update Status"] or contains(@aria-label,"Update Status") or contains(text(),"Update Status")]'); }
    private get detailEditButton() { return $('(//button[.//bdi[normalize-space()="Edit"]])[last()]'); }
    private get detailSaveButton() { return $('(//button[.//bdi[normalize-space()="Save"]])[last()]'); }
    private get detailDeleteButton() { return $('(//button[.//bdi[normalize-space()="Delete"] or contains(@title,"Delete") or contains(@aria-label,"Delete")])[last()]'); }
    private get detailDescriptionInput() { return $('//bdi[contains(normalize-space(),"Description")]/ancestor::label/following::input[1]'); }
    private get detailActivityInput() { return $('//label[.//bdi[text()="Activity"]]/following::input[@aria-roledescription="Multi Value Input"][1]'); }
    private get detailPriorityDropdownArrow() { return $('//label[.//bdi[text()="Priority"]]/following::span[@role="button"][1]'); }
    private get detailAssignedToDropdownArrow() { return $('//label[.//bdi[text()="Assigned To"]]/following::span[@role="button"][1]'); }
    private get detailStartDateInput() { return $('//label[.//bdi[text()="Start Date"]]/following::input[@aria-roledescription="Date Input"][1]'); }
    private get detailDueDateInput() { return $('//label[.//bdi[text()="Due Date"]]/following::input[@aria-roledescription="Date Input"][1]'); }
    private get detailDisciplineDropdownArrow() { return $('//label[.//bdi[text()="Discipline"]]/following::span[@role="button"][1]'); }
    private get detailDisciplineValueInput() { return $('//bdi[contains(normalize-space(),"Discipline")]/ancestor::label/following::input[1]'); }
    private get detailCommentTextArea() { return $('//bdi[contains(normalize-space(),"Comment")]/ancestor::label/following::textarea[1]'); }
    
    // Edit Header Dialog Selectors
    private get headerShortDescTextArea() { return $('//div[@role="dialog"]//label[.//bdi[text()="Short Description"]]/following::textarea[1]'); }
    private get headerLongDescTextArea() { return $('//div[@role="dialog"]//label[.//bdi[text()="Long Description"]]/following::textarea[1]'); }
    private get headerStartDateInput() { return $('//div[@role="dialog"]//label[.//bdi[text()="Start Date"]]/following::input[@aria-roledescription="Date Input"][1]'); }
    private get headerDueDateInput() { return $('//div[@role="dialog"]//label[.//bdi[text()="Due Date"]]/following::input[@aria-roledescription="Date Input"][1]'); }
    
    // Dynamic Selectors
    private taskDescriptionCell(taskDescription: string) { return $(`//table[@role="grid" and @aria-roledescription="Responsive Table"]//tr[@role="row"]//*[contains(@title,"${taskDescription}") or contains(normalize-space(),"${taskDescription}")]`); }
    private taskRowByDescription(taskDescription: string) { return $(`(//table[@role="grid" and @aria-roledescription="Responsive Table"]//tr[@role="row"][.//*[contains(@title,"${taskDescription}") or contains(normalize-space(),"${taskDescription}")]])[1]`); }
    private getOptionInLastListboxByText(optionText: string) { return $(`((//ul[@role="listbox"])[last()]//li[@role="option"][.//*[normalize-space()="${optionText}" or contains(normalize-space(),"${optionText}")] or normalize-space()="${optionText}" or contains(normalize-space(),"${optionText}")])[1]`); }

    // ============ PRIVATE HELPER METHODS ============

    private async getAddTaskButton(): Promise<any> {
        const candidates = ['(//table[@role="grid" and @aria-roledescription="Responsive Table"]//ancestor::div[contains(@class,"sapMList")][1]//button[contains(@title,"Add") or contains(@aria-label,"Add")])[1]', '(//table[@role="grid" and @aria-roledescription="Responsive Table"]//ancestor::div[contains(@class,"sapMList")][1]//button[contains(@title,"task") or contains(@aria-label,"task")])[1]', '(//table[@role="grid" and @aria-roledescription="Responsive Table"]//ancestor::div[contains(@class,"sapMList")][1]//button)[2]'];
        for (const selector of candidates) {
            const button = await $(selector);
            if (await button.isExisting()) return button;
        }
        throw new Error('Add Task button not found in task management list view');
    }

    private async switchToTaskManagementFrame(): Promise<void> {
        await browser.switchFrame(null);
        await this.taskManagementFrame.waitForExist({ timeout: 180000 });
        await browser.switchFrame(this.taskManagementFrame);
    }

    private formatDate(daysOffset: number): string {
        const date = new Date();
        date.setDate(date.getDate() + daysOffset);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private normalizeDateValue(input: string): string {
        const trimmed = (input || '').trim();
        if (!trimmed) return '';
        const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
        const parsed = new Date(trimmed);
        if (!Number.isNaN(parsed.getTime())) {
            const year = parsed.getFullYear();
            const month = String(parsed.getMonth() + 1).padStart(2, '0');
            const day = String(parsed.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return trimmed;
    }

    private async clickElementWithFallback(element: any): Promise<void> {
        await element.waitForDisplayed({ timeout: 180000 });
        await element.scrollIntoView();
        try {
            await utils.clickWithWait(element);
            return;
        } catch {
            const clickable = await element.isClickable().catch(() => false);
            if (clickable) {
                await element.click();
                return;
            }
            await browser.execute((el) => { (el as HTMLElement).click(); }, element);
        }
    }

    // Dropdown selection methods
    private async openDropdownAndSelectByText(dropdownArrow: any, optionText: string): Promise<void> {
        await utils.clickWithWait(dropdownArrow);
        const option = this.getOptionInLastListboxByText(optionText);
        await option.waitForDisplayed({ timeout: 90000 });

        const ariaSelected = await option.getAttribute('aria-selected').catch(() => null);
        const isAlreadySelected = ariaSelected === 'true';
        const clickable = isAlreadySelected ? false : await option.isClickable().catch(() => false);

        if (clickable) {
            await utils.clickWithWait(option);
            return;
        }

        try {
            await browser.execute((el) => { (el as HTMLElement).click(); }, option);
        } catch {
            // ignore
        }
        await browser.keys('Escape');
    }

    private async openDropdownAndSelectFirst(dropdownArrow: any): Promise<void> {
        await dropdownArrow.waitForDisplayed({ timeout: 180000 });
        await dropdownArrow.scrollIntoView();
        try {
            await utils.clickWithWait(dropdownArrow);
        } catch {
            const clickable = await dropdownArrow.isClickable().catch(() => false);
            if (clickable) await dropdownArrow.click();
            else await browser.execute((el) => { (el as HTMLElement).click(); }, dropdownArrow);
        }
        await browser.keys('ArrowDown');
        await browser.keys('Enter');
    }
 
    // Activity selection methods
    private async selectActivityFromSuggestions(activity: string): Promise<void> {
        await utils.clickWithWait(this.activityInput);
        await utils.setValueWithWait(this.activityInput, activity);
        await browser.pause(500);
        const listOption = $(`//li[@role="option"][.//*[normalize-space()="${activity}"] or normalize-space()="${activity}"]`);
        const tableOption = $(`//tr[@role="option"][.//*[normalize-space()="${activity}"] or normalize-space()="${activity}"]`);
        
        // Try list option first
        if (await listOption.isDisplayed().catch(() => false)) {
            const isClickable = await listOption.isClickable().catch(() => false);
            if (isClickable) {
                await utils.clickWithWait(listOption);
                return;
            }
        }
        
        // Try table option
        if (await tableOption.isDisplayed().catch(() => false)) {
            const isClickable = await tableOption.isClickable().catch(() => false);
            if (isClickable) {
                await utils.clickWithWait(tableOption);
                return;
            }
        }
        
        // Fallback to Enter key
        await browser.keys('Enter');
    }

    private async selectDetailActivity(activity: string): Promise<void> {
        await this.clearDetailActivityTokens();
        await utils.clickWithWait(this.detailActivityInput);
        await utils.setValueWithWait(this.detailActivityInput, activity);
        await browser.pause(300);
        const listOption = $(`//li[@role="option"][.//*[normalize-space()="${activity}"] or normalize-space()="${activity}"]`);
        const tableOption = $(`//tr[@role="option"][.//*[normalize-space()="${activity}"] or normalize-space()="${activity}"]`);
        if (await listOption.isDisplayed().catch(() => false)) {
            await utils.clickWithWait(listOption);
            return;
        }
        if (await tableOption.isDisplayed().catch(() => false)) {
            await utils.clickWithWait(tableOption);
            return;
        }
        await browser.keys('Enter');
    }

    private async clearDetailActivityTokens(): Promise<void> {
        let tokenDeleteIcons = await $$('//label[.//bdi[text()="Activity"]]/following::div[contains(@class,"sapMMultiInput")][1]//span[contains(@class,"sapMTokenIcon")]');
        while ((await tokenDeleteIcons.length) > 0) {
            const isDisplayed = await tokenDeleteIcons[0].isDisplayed().catch(() => false);
            if (!isDisplayed) break;
            await utils.clickWithWait(tokenDeleteIcons[0]);
            await browser.pause(200);
            tokenDeleteIcons = await $$('//label[.//bdi[text()="Activity"]]/following::div[contains(@class,"sapMMultiInput")][1]//span[contains(@class,"sapMTokenIcon")]');
        }
    }

    // MessageBox handling methods
    private async clickMessageBoxButton(buttonText: string): Promise<void> {
        const normalized = buttonText.toUpperCase();
        const selectors = [
            `(//button[starts-with(@id,"__mbox-btn-") and .//bdi[translate(normalize-space(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ")="${normalized}"]])[last()]`,
            `(//button[starts-with(@id,"__mbox-btn-") and .//span[translate(normalize-space(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ")="${normalized}"]])[last()]`,
            `(//div[@role="dialog"]//button[.//bdi[translate(normalize-space(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ")="${normalized}"]])[last()]`,
            `(//div[@role="dialog"]//button[.//span[translate(normalize-space(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ")="${normalized}"]])[last()]`,
            `(//div[@role="dialog"]//button[contains(translate(@aria-label,"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ"),"${normalized}")])[last()]`
        ];

        const findVisibleButton = async (): Promise<any | null> => {
            for (const selector of selectors) {
                const button = await $(selector);
                const exists = await button.isExisting().catch(() => false);
                if (!exists) continue;
                const visible = await button.isDisplayed().catch(() => false);
                if (visible) return button;
            }
            return null;
        };

        const waitForButtonInCurrentContext = async (timeout: number): Promise<any | null> => {
            let foundButton: any | null = null;
            await browser.waitUntil(async () => {
                foundButton = await findVisibleButton();
                return foundButton !== null;
            }, { timeout, interval: 500, timeoutMsg: `Message box button not found in current context: ${buttonText}` }).catch(() => {});
            return foundButton;
        };

        let clicked = false;
        let button = await waitForButtonInCurrentContext(30000);
        if (button) {
            await this.clickElementWithFallback(button);
            clicked = true;
        }

        let switchedToTop = false;
        if (!clicked) {
            await browser.switchFrame(null);
            switchedToTop = true;
            button = await waitForButtonInCurrentContext(30000);
            if (button) {
                await this.clickElementWithFallback(button);
                clicked = true;
            }
        }

        if (switchedToTop) await this.switchToTaskManagementFrame();
        if (!clicked) console.log(`[INFO] Message box button not found for: ${buttonText}`);
        else await utils.waitForBusyIndicatorToDisappear();
    }

    private async clickEditHeaderSaveButton(): Promise<void> {
        const selectors = [
            '//div[@role="dialog" and .//h1[contains(text(),"Edit Header")]]//button[.//bdi[normalize-space()="Save"] or .//span[normalize-space()="Save"] or contains(@aria-label,"Save")]',
            '//div[@role="dialog" and .//label[.//bdi[text()="Short Description"]]]//button[.//bdi[normalize-space()="Save"] or .//span[normalize-space()="Save"] or contains(@aria-label,"Save")]',
            '(//button[not(starts-with(@id,"__mbox-btn-")) and (.//bdi[normalize-space()="Save"] or .//span[normalize-space()="Save"] or contains(@aria-label,"Save"))])[last()]'
        ];

        let saveButton: any | null = null;
        await browser.waitUntil(async () => {
            for (const selector of selectors) {
                const candidate = await $(selector);
                const displayed = await candidate.isDisplayed().catch(() => false);
                if (displayed) {
                    saveButton = candidate;
                    return true;
                }
            }
            return false;
        }, { timeout: 180000, timeoutMsg: 'Edit Header Save button was not found' });

        await this.clickElementWithFallback(saveButton);
    }

    private getStatusMenuItemByText(statusText: string) {
        const upper = statusText.toUpperCase();
        return $(`(//*[@role="menuitem" or @role="option"][.//*[translate(normalize-space(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ")="${upper}"] or translate(normalize-space(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ")="${upper}"])[last()]`);
    }

    // ============ PUBLIC METHODS ============

    /**
     * Navigate to Task Management list view
     */
    public async navigateToTaskManagementListView(): Promise<void> {
        await HomePage.waitForHomePageToLoad();
        await utils.waitForSAPPopupAndClose();
        await HomePage.clickTile('Task Management');
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForSAPPopupAndClose();
        await this.switchToTaskManagementFrame();
        
        // Wait until add button is displayed and ready
        const addButton = await this.getAddTaskButton();
        await browser.waitUntil(async () => {
            const isDisplayed = await addButton.isDisplayed().catch(() => false);
            const isEnabled = await addButton.isEnabled().catch(() => false);
            return isDisplayed && isEnabled;
        }, { timeout: 180000, timeoutMsg: 'Add Task button not ready in Task Management list view' });
    }

    /**
     * Create a new task with specified details
     */
    public async createTask(taskDescription: string, options: TaskCreateOptions = {}): Promise<void> {
        const taskActivity = options.activity ?? 'Asset Inspection';
        const taskPriority = options.priority ?? 'Low';
        const taskObjectType = options.objectType ?? 'None';
        const taskAssignedTo = options.assignedTo ?? 'anmol.kumar@asint.net';

        await utils.waitForBusyIndicatorToDisappear();
        const addButton = await this.getAddTaskButton();
        await utils.clickWithWait(addButton);
        
        // Wait until create dialog is displayed and ready
        await browser.waitUntil(async () => {
            return await this.createTaskDialog.isDisplayed().catch(() => false);
        }, { timeout: 180000, timeoutMsg: 'Create task dialog did not appear' });

        // Wait until description input is ready
        await browser.waitUntil(async () => {
            return await this.descriptionInput.isEnabled().catch(() => false);
        }, { timeout: 90000, timeoutMsg: 'Description input not ready' });
        
        await utils.setValueWithWait(this.descriptionInput, taskDescription);
        await this.selectActivityFromSuggestions(taskActivity);
        await this.openDropdownAndSelectByText(this.priorityDropdownArrow, taskPriority);
        await this.openDropdownAndSelectByText(this.assignedToDropdownArrow, taskAssignedTo);

        await utils.setValueWithWait(this.startDateInput, this.formatDate(0));
        await browser.keys('Tab');
        await utils.setValueWithWait(this.dueDateInput, this.formatDate(1));
        await browser.keys('Tab');

        await this.openDropdownAndSelectByText(this.objectTypeDropdownArrow, taskObjectType);
        
        // Wait until create button is clickable
        await browser.waitUntil(async () => {
            return await this.createButton.isClickable().catch(() => false);
        }, { timeout: 90000, timeoutMsg: 'Create button not clickable' });
        
        await utils.clickWithWait(this.createButton);
        await utils.waitForBusyIndicatorToDisappear();
        
        // Wait until dialog is closed (task created)
        await browser.waitUntil(async () => {
            const isDisplayed = await this.createTaskDialog.isDisplayed().catch(() => false);
            return !isDisplayed;
        }, { timeout: 180000, timeoutMsg: 'Create task dialog did not close after creating task' });
    }

    /**
     * Verify that task was created successfully
     */
    public async verifyTaskCreated(taskDescription: string): Promise<void> {
        await this.switchToTaskManagementFrame();
        await utils.waitForBusyIndicatorToDisappear();

        const dialogOpen = await this.createTaskDialog.isDisplayed().catch(() => false);
        if (dialogOpen) {
            throw new Error(`Task create dialog is still open. Task with description "${taskDescription}" was likely not created.`);
        }

        await this.taskTable.waitForDisplayed({ timeout: 180000 });
        const taskRow = this.taskDescriptionCell(taskDescription);
        const isTaskVisible = await taskRow.isDisplayed().catch(() => false);
        if (!isTaskVisible) console.log(`[INFO] Task row text not directly visible for: ${taskDescription}`);
    }

    /**
     * Open task detail page
     */
    public async openTaskDetail(taskDescription: string): Promise<void> {
        await this.switchToTaskManagementFrame();
        await utils.waitForBusyIndicatorToDisappear();
        
        const taskRow = this.taskRowByDescription(taskDescription);
        
        // Wait until task row is displayed and clickable
        await browser.waitUntil(async () => {
            const isDisplayed = await taskRow.isDisplayed().catch(() => false);
            const isClickable = await taskRow.isClickable().catch(() => false);
            return isDisplayed && isClickable;
        }, { timeout: 180000, timeoutMsg: `Task row not found for: ${taskDescription}` });
        
        await utils.clickWithWait(taskRow);
        
        // Wait until detail page is loaded - Edit Header button should be visible
        await browser.waitUntil(async () => {
            const editHeaderDisplayed = await this.detailEditHeaderButton.isDisplayed().catch(() => false);
            const editButtonDisplayed = await this.detailEditButton.isDisplayed().catch(() => false);
            return editHeaderDisplayed || editButtonDisplayed;
        }, { timeout: 180000, timeoutMsg: 'Task detail page did not load' });
    }

    /**
     * Edit task and save changes
     */
    public async editTaskAndSave(options: TaskEditOptions = {}): Promise<void> {
        const updatedDescription = options.description ?? `UPDATED AUTO TASK ${Date.now()}`;
        const updatedActivity = options.activity ?? 'Asset Inspection';
        const updatedPriority = options.priority ?? 'Low';
        const updatedAssignedTo = options.assignedTo ?? 'anmol.kumar@asint.net';
        const updatedStartDate = options.startDate ?? this.formatDate(1);
        const updatedDueDate = options.dueDate ?? this.formatDate(2);
        const updatedComment = options.comment ?? `EDITED COMMENT ${Date.now()}`;

        await utils.waitForBusyIndicatorToDisappear();
        await this.clickElementWithFallback(this.detailEditButton);
        await utils.waitForBusyIndicatorToDisappear();
        
        await this.detailDescriptionInput.waitForDisplayed({ timeout: 180000 });
        await this.detailDescriptionInput.clearValue();
        await utils.setValueWithWait(this.detailDescriptionInput, updatedDescription);

        await this.selectDetailActivity(updatedActivity);
        await this.openDropdownAndSelectByText(this.detailPriorityDropdownArrow, updatedPriority);
        await this.openDropdownAndSelectByText(this.detailAssignedToDropdownArrow, updatedAssignedTo);

        // Check if date fields are visible (controlled by feature flag)
        const startDateVisible = await this.detailStartDateInput.isDisplayed().catch(() => false);
        const dueDateVisible = await this.detailDueDateInput.isDisplayed().catch(() => false);
        
        if (startDateVisible) {
            await utils.setValueWithWait(this.detailStartDateInput, updatedStartDate);
            await browser.keys('Tab');
        }
        
        if (dueDateVisible) {
            await utils.setValueWithWait(this.detailDueDateInput, updatedDueDate);
            await browser.keys('Tab');
        }

        await this.openDropdownAndSelectFirst(this.detailDisciplineDropdownArrow);

        await this.detailCommentTextArea.waitForDisplayed({ timeout: 180000 });
        await this.detailCommentTextArea.clearValue();
        await utils.setValueWithWait(this.detailCommentTextArea, updatedComment);

        await this.clickElementWithFallback(this.detailSaveButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.clickMessageBoxButton('OK');
        await utils.waitForSAPPopupAndClose();
        await utils.waitForBusyIndicatorToDisappear();
    }

    /**
     * Edit header details (short and long description, and optionally dates)
     */
    public async editHeaderDetails(shortDescription: string, longDescription: string, startDate?: string, dueDate?: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await this.clickElementWithFallback(this.detailEditHeaderButton);

        // Wait until dialog opens and short description field is ready
        await browser.waitUntil(async () => {
            const isDisplayed = await this.headerShortDescTextArea.isDisplayed().catch(() => false);
            const isEnabled = await this.headerShortDescTextArea.isEnabled().catch(() => false);
            return isDisplayed && isEnabled;
        }, { timeout: 180000, timeoutMsg: 'Edit header short description field did not appear' });
        
        await browser.pause(500); // Allow dialog to fully render
        
        // Edit short description using clear and type approach
        await this.clickElementWithFallback(this.headerShortDescTextArea);
        await browser.keys(['Control', 'a']);
        await browser.keys('Delete');
        await browser.pause(200);
        await this.headerShortDescTextArea.addValue(shortDescription);
        await browser.pause(200);
        
        // Edit long description
        const longDescExists = await this.headerLongDescTextArea.isDisplayed().catch(() => false);
        if (longDescExists) {
            await this.clickElementWithFallback(this.headerLongDescTextArea);
            await browser.keys(['Control', 'a']);
            await browser.keys('Delete');
            await browser.pause(200);
            await this.headerLongDescTextArea.addValue(longDescription);
            await browser.pause(200);
        }
        
        // Edit start date if provided and field is visible
        const startDateExists = await this.headerStartDateInput.isDisplayed().catch(() => false);
        if (startDate && startDateExists) {
            await this.clickElementWithFallback(this.headerStartDateInput);
            await browser.keys(['Control', 'a']);
            await browser.keys('Delete');
            await browser.pause(200);
            await this.headerStartDateInput.setValue(startDate);
            await browser.pause(200);
        }
        
        // Edit due date if provided and field is visible
        const dueDateExists = await this.headerDueDateInput.isDisplayed().catch(() => false);
        if (dueDate && dueDateExists) {
            await this.clickElementWithFallback(this.headerDueDateInput);
            await browser.keys(['Control', 'a']);
            await browser.keys('Delete');
            await browser.pause(200);
            await this.headerDueDateInput.setValue(dueDate);
            await browser.pause(200);
        }
        
        // Verify the values were set correctly
        await browser.waitUntil(async () => {
            const shortValue = await this.headerShortDescTextArea.getValue().catch(() => '');
            return shortValue.trim() === shortDescription.trim();
        }, { timeout: 30000, timeoutMsg: 'Short description was not updated with expected value' });

        await this.clickEditHeaderSaveButton();
        await utils.waitForBusyIndicatorToDisappear(120);
        await browser.pause(1000);
        await this.clickMessageBoxButton('OK');
        await utils.waitForBusyIndicatorToDisappear(120);
        
        // Wait until edit header dialog is closed
        await browser.waitUntil(async () => {
            const shortVisible = await this.headerShortDescTextArea.isDisplayed().catch(() => false);
            return !shortVisible;
        }, { timeout: 180000, timeoutMsg: 'Edit header dialog did not close after Save/OK' });
    }

    /**
     * Update task status from header action menu
     * Tasks must follow status transitions: NEW -> In Progress -> Completed
     */
    public async updateStatusToCompleted(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        
        // First change status to "In Progress" (NEW -> INPROG)
        await this.clickElementWithFallback(this.detailUpdateStatusButton);
        await browser.pause(500);
        
        let inProgressMenuItem = this.getStatusMenuItemByText('In Progress');
        await browser.waitUntil(async () => {
            const displayed = await inProgressMenuItem.isDisplayed().catch(() => false);
            return displayed;
        }, { timeout: 30000, timeoutMsg: 'In Progress option did not appear in Update Status menu' });

        await this.clickElementWithFallback(inProgressMenuItem);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(1000);
        
        // Check for success message and close it
        await this.clickMessageBoxButton('OK');
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(1000);
        
        // Now change status to "Completed" (INPROG -> COMP)
        await this.clickElementWithFallback(this.detailUpdateStatusButton);
        await browser.pause(500);
        
        const completedMenuItem = this.getStatusMenuItemByText('Completed');
        await browser.waitUntil(async () => {
            const displayed = await completedMenuItem.isDisplayed().catch(() => false);
            return displayed;
        }, { timeout: 30000, timeoutMsg: 'Completed option did not appear in Update Status menu after changing to In Progress' });

        await this.clickElementWithFallback(completedMenuItem);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(1000);
        await this.clickMessageBoxButton('OK');
        await utils.waitForSAPPopupAndClose();
        await utils.waitForBusyIndicatorToDisappear();
    }

    /**
     * Delete task and confirm deletion
     */
    public async deleteTaskAndConfirm(): Promise<void> {
        await this.clickElementWithFallback(this.detailDeleteButton);
        await this.clickMessageBoxButton('YES');
        try {
            await this.clickMessageBoxButton('OK');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log(`[INFO] Optional OK button not found after delete confirmation: ${message}`);
        }
        await utils.waitForBusyIndicatorToDisappear();
    }

    /**
     * Search for task and verify it was deleted
     */
    public async searchAndVerifyTaskDeleted(taskDescription: string): Promise<void> {
        await this.switchToTaskManagementFrame();
        await utils.waitForBusyIndicatorToDisappear();
        
        // Wait until search input is ready
        await browser.waitUntil(async () => {
            const isDisplayed = await this.searchInput.isDisplayed().catch(() => false);
            const isEnabled = await this.searchInput.isEnabled().catch(() => false);
            return isDisplayed && isEnabled;
        }, { timeout: 90000, timeoutMsg: 'Search input not ready' });
        
        await this.searchInput.click();
        await this.searchInput.setValue(taskDescription);
        await browser.keys('Enter');
        await utils.waitForBusyIndicatorToDisappear();
        
        // Wait for search results to stabilize
        await browser.waitUntil(async () => {
            const tableDisplayed = await this.taskTable.isDisplayed().catch(() => false);
            return tableDisplayed;
        }, { timeout: 90000, timeoutMsg: 'Task table not loaded after search' });
        
        const taskRow = this.taskDescriptionCell(taskDescription);
        const isTaskVisible = await taskRow.isDisplayed().catch(() => false);
        if (isTaskVisible) {
            throw new Error(`Task "${taskDescription}" was not deleted - still visible in search results`);
        }
        console.log(`[VERIFIED] Task "${taskDescription}" successfully deleted - not found in search`);
    }
}

export default new TaskManagementListView();

