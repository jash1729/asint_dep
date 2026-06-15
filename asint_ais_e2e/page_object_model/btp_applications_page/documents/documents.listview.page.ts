import HomePage from '../home.page';
import { browser, $, $$ } from '@wdio/globals';
import utils from 'utils/utils';
import documentsDetailPage from './documents.detail.page';

class DocumentsListviewPage {
    // try to locate common elements in documents list view
    private get createBtn() { return $('button .sapUiIcon[data-sap-ui-icon-content=""]'); }
    public get appIframe() { return $('iframe[data-help-id="application-documents-manage"]'); }
    public createdDocumentName = 'vessel-1.png';
    async openDocumentsFromHome(): Promise<void> {
        await HomePage.waitForHomePageToLoad();
        await HomePage.clickTile('Documents');
        await utils.waitForBusyIndicatorToDisappear();
        // switch to the visible application iframe (dynamic)
        await this.switchToVisibleAppFrame();
        await utils.waitForBusyIndicatorToDisappear();
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
                if (await search.isExisting() || await header.isExisting()) {
                    return;
                }
                await browser.switchFrame(null);
            } catch {
                await browser.switchFrame(null);
            }
        }
        // if not found, stay at top-level (tests will fail later clearly)
    }

    async verifyOnDocumentsPage(): Promise<boolean> {
        try {
            // wait for either a visible search box or a list/table to appear
            await browser.waitUntil(async () => {
                const search = await $('//input[@type="search" or @placeholder="Search"]');
                const table = await $('//tbody[contains(@class,"sapMTableTBody")]');
                return (await search.isExisting() && await search.isDisplayed()) || (await table.isExisting() && await table.isDisplayed());
            }, { timeout: 60000 });
            return true;
        } catch {
            return false;
        }
    }

    async getFirstDocumentName(): Promise<string> {
        // try multiple fallbacks to get a stable first-row text
        await browser.pause(2000); // wait for any animations to settle
        const candidates = [
            '//tbody[contains(@class,"sapMTableTBody")]//tr[@role="row"][1]//span[normalize-space()][1]',
            '(//table//tr[@role="row"])[2]//span[normalize-space()][1]',
            '(//div[@role="row"])[2]//span[normalize-space()][1]'
        ];

        for (const xp of candidates) {
            const el = await $(xp);
            try {
                if (await el.isExisting() && await el.isDisplayed()) {
                    const txt = (await el.getText()) || '';
                    if (txt.trim()) return txt.trim();
                }
            } catch {}
        }

        throw new Error('No document name found in list');
    }

    // async clickOnDocumentInList(name: string): Promise<void> {
    //     // search visible list for the row that contains the exact name and click it
    //     // use normalize-space to avoid dynamic class/id reliance
    //     const row = await $(`//tr[@role="row"][.//span[normalize-space()="${name}"]]`);
    //     if (!(await row.isExisting())) {
    //         // try more generic span click
    //         const span = await $(`//span[normalize-space()="${name}"]`);
    //         await span.waitForDisplayed({ timeout: 30000 });
    //         await utils.clickWithWait(span);
    //         return;
    //     }

    //     // click first clickable cell inside the row
    //     const clickable = await row.$('.//span[normalize-space()]');
    //     await clickable.waitForDisplayed({ timeout: 30000 });
    //     await utils.clickWithWait(clickable);
    //     await utils.waitForBusyIndicatorToDisappear();
    // }

    async searchDocumentByName(name: string): Promise<void> {
        // find visible search input and set value via JS to avoid UI5 quirks
        const getVisibleSearch = async () => {
            const inputs = await $$('//input[@type="search" or @placeholder="Search"]');
            for (const inp of inputs) if (await inp.isDisplayed()) return inp;
            return null;
        };

        let searchBox: any = null;
        await browser.waitUntil(async () => {
            searchBox = await getVisibleSearch();
            return searchBox !== null;
        }, { timeout: 30000 });

        if (!searchBox) throw new Error('Search box not found');

        await browser.execute((el, value) => {
            const input = el as HTMLInputElement;
            input.value = value as string;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }, searchBox, name);

        // click visible Go/Submit if present
        const visibleGo = await (async () => {
            const btns = await $$('//bdi[text()="Go"]');
            for (const b of btns) if (await b.isDisplayed()) return b;
            return null;
        })();

        if (visibleGo) await browser.execute(el => el.click(), visibleGo);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
    }

    async addNewDocument(): Promise<void> {
        // click Create button and fill in the form - implementation depends on actual form fields which are not defined yet
        console.log('Starting to create a new document');
        await browser.pause(5000);
        await this.switchToVisibleAppFrame();
        await this.createBtn.waitForClickable({ timeout: 30000 });
        await utils.clickWithWait(this.createBtn);
        await browser.pause(2000); 
        await browser.keys('Enter');
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
        console.log('Create document test - implementation needed');
        await utils.waitForBusyIndicatorToDisappear();
    }

    async verifyDocumentInList(fileName: string): Promise<void> {
        const name  = $(`//tr[@role='row'][1]//td[@aria-colindex='3']//span`);
        await name.waitForDisplayed({ timeout: 30000 });
        const listFileName = await name.getText();
        if (listFileName.trim() !== fileName) {
            throw new Error(`Expected document "${fileName}" not found in list, found "${listFileName}" instead`);
        }
        else {
            console.log(`Document "${fileName}" successfully verified in list`);
        }
    }

    async clickOnDocumentInList(): Promise<void> {
        await browser.pause(2000); 
        await this.switchToVisibleAppFrame();
        await browser.pause(2000); 
        const name  = $(`//tr[@role='row'][1]//td[@aria-colindex='3']//span`);
        await name.waitForDisplayed({ timeout: 30000 });
        const listFileName = await name.getText();
        console.log(`Clicking on document "${listFileName}" in list`);
        await utils.clickWithWait(name);
        await utils.waitForBusyIndicatorToDisappear();
    }



    async editDocumentDetails(): Promise<void> {
        // implementation depends on actual editable fields which are not defined yet
        console.log('Editing document details - implementation needed');
        
    }


}

export default new DocumentsListviewPage();
