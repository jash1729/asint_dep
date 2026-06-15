import HomePage from '../../home.page';
import { browser } from '@wdio/globals';
import utils from 'utils/utils';
import inspectionTemplatesDetailPage from './inspection_templates.detail.page';

class InspectionTemplatesListPage {
    public createdTemplateName: string = '';

    private get createTemplateBtn() { return $('button .sapUiIcon[data-sap-ui-icon-content=""]'); }

    private get createBtn() { return $(`//button[.//bdi[normalize-space()='Create']]`); }
    private get searchInput() { return $('//input[@placeholder="Search" or @type="search"]'); }
    private get templateTableBody() { return $('//tbody[contains(@class, "sapMTableTBody")]'); }

    async createNewInspectionTemplate(templateName: string, description: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForSAPPopupAndClose();
        await console.log("Clicking on Create button to create new Inspection Template");
        await this.switchToVisibleAppFrame();
        this.createdTemplateName = templateName;
        await this.createTemplateBtn.waitForClickable({ timeout: 30000 });
        await utils.clickWithWait(this.createTemplateBtn);
        await browser.pause(2000);
        const descInput = await $(`//bdi[normalize-space()='Description']/following::input[@type='text'][1]`); // dynamic selector
        await descInput.waitForDisplayed({ timeout: 30000 });
        await descInput.setValue(description);
        const longDescInput = await $(`//bdi[normalize-space()='Long Description']/following::textarea[1]`); // dynamic selector
        await longDescInput.waitForDisplayed({ timeout: 30000 });
        await longDescInput.setValue(description);
        const dropDown = await $(`//bdi[normalize-space()='Relevant For']/following::span[@role='button'][1]`); // dynamic selector
        await dropDown.waitForClickable({ timeout: 30000 });
        await dropDown.click();
        await browser.pause(1000);
        await browser.keys("ArrowDown");
        await browser.pause(1000);
        await browser.keys(['Enter']);
        await browser.pause(1000);
        await utils.clickWithWait(this.createBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait($(`//header[.//text()='Success']/following::bdi[text()='OK']`));
        console.log(`New Inspection Template created with name: ${templateName}`);
    }
    // async clickOnInspectionTemplateInList(name: string) { 
    //         await this.switchToVisibleAppFrame();
    //         const compSearchBox = await $('input[placeholder="Search"]');
    //         await compSearchBox.waitForDisplayed({ timeout: 20000 });
    //         await compSearchBox.click();

    //         await browser.keys(['Control', 'a']);
    //         await browser.keys('Backspace');
    //         await compSearchBox.setValue(name);
    //         await browser.keys("Enter");
    //         await browser.pause(3000);

    //         const equipment = await $(`//td[contains(@data-sap-ui-column,'name')]//span[normalize-space()="${name}"]`);
    //         await equipment.waitForDisplayed({ timeout: 50000 });
    //         await equipment.waitForClickable({ timeout: 50000 });
    //         return equipment.click();
    //     }

    async navigateToInspectionTemplates(): Promise<void> {
        await HomePage.waitForHomePageToLoad();
        await HomePage.clickTile('Inspection Templates');
        await utils.waitForBusyIndicatorToDisappear();
        await this.switchToVisibleAppFrame();
        await utils.waitForBusyIndicatorToDisappear();
    }

    async switchToVisibleAppFrame(): Promise<void> {
        await console.log("Switching to visible application frame");
        await browser.switchFrame(null);
        const frames = await $$('//iframe');
        for (const frame of frames) {
            try {
                await browser.switchFrame(frame);
                const search = await $('//input[@type="search" or @placeholder="Search"]');
                const header = await $('//h1|//header//*[contains(text(), "Inspection") or contains(., "Template")]');
                if (await search.isExisting() || await header.isExisting()) {
                    await console.log("Visible application frame found and switched to");
                    return;
                }
                await browser.switchFrame(null);
            } catch {
                await browser.switchFrame(null);
            }
        }

    }

    async verifyOnInspectionTemplatesListPage(): Promise<boolean> {
        try {
            await browser.waitUntil(async () => {
                const search = await $('//input[@type="search" or @placeholder="Search"]');
                const table = await $('//tbody[contains(@class, "sapMTableTBody")]');
                return (await search.isExisting() && await search.isDisplayed()) || (await table.isExisting() && await table.isDisplayed());
            }, { timeout: 60000 });
            return true;
        } catch {
            return false;
        }
    }

    async getFirstInspectionTemplateName(): Promise<string> {
        await browser.pause(2000);
        const candidates = [
            '//tbody[contains(@class, "sapMTableTBody")]//tr[@role="row"][1]//span[normalize-space()][1]',
            '(//table//tr[@role="row"])[2]//span[normalize-space()][1]',
            '(//div[@role="row"])[2]//span[normalize-space()][1]'
        ];

        for (const xp of candidates) {
            const el = await $(xp);
            try {
                if (await el.isExisting() && await el.isDisplayed()) {
                    const txt = (await el.getText()) || '';
                    if (txt.trim()) {
                        this.createdTemplateName = txt.trim();
                        return txt.trim();
                    }
                }
            } catch {}
        }

        throw new Error('No inspection template name found in list');
    }

    async clickOnInspectionTemplateInList(name: string): Promise<void> {
        console.log(`Attempting to click on inspection template in list with name: ${name}`);
        await this.switchToVisibleAppFrame();
        await browser.pause(2000);
        const row = await $(`//tr[@role="row"][.//span[normalize-space()="${name}"]]`);
        if (!(await row.isExisting())) {
            const span = await $(`//span[normalize-space()="${name}"]`);
            await span.waitForDisplayed({ timeout: 30000 });
            await utils.clickWithWait(span);
            await utils.waitForBusyIndicatorToDisappear();
            console.log(`Clicked on inspection template with name: ${name} using fallback selector`);
            return;
        }

        await console.log(`Found row for template: ${name}, attempting to click`);
        const clickable = await row.$('.//span[normalize-space()]');
        await clickable.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(clickable);
        await utils.waitForBusyIndicatorToDisappear();
    }

    async searchTemplateByName(name: string): Promise<void> {
        const getVisibleSearch = async () => {
            const inputs = await $$('//input[@type="search" or @placeholder="Search"]');
            for (const inp of inputs) if (await inp.isDisplayed()) return inp;
            return null;
        };

        const search = await getVisibleSearch();
        if (search) {
            await search.clearValue();
            await search.setValue(name);
            await utils.waitForBusyIndicatorToDisappear();
        }
    }

    async verifyTemplateInList(name: string): Promise<boolean> {
        try {
            const span = await $(`//span[normalize-space()="${name}"]`);
            await span.waitForExist({ timeout: 10000 });
            return await span.isDisplayed();
        } catch {
            return false;
        }
    }
}

export default new InspectionTemplatesListPage();
