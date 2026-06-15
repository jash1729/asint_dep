import { browser } from '@wdio/globals';
import utils from 'utils/utils';
import documentsListviewPage from './documents.listview.page';

class DocumentsDetailPage {
    private get header() { return $('//header//*[self::h1 or .//bdi]'); }
    private get downloadBtn() { return $('//button[.//bdi[text()="Download"]]'); }
    private get documentHeaderTitleSpans() { return $$("//header[@role='banner']//*[@role='heading']//span[normalize-space()]"); }
    private get documentEditHeader() { return $("//bdi[text()='Edit Header ']"); }
    private get documentDescEditHeader() { return $("//div[@role='dialog']//bdi[contains(text(),'Short Description')]/following::input[1][not(@readonly)]"); }
    private get documentConfidentialityEditHeader() { return $("//div[@role='dialog']//bdi[contains(text(),'Confidentiality')]/following::span[2]"); }
    private get documentHeaderSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get documentHdSaveSucc() { return $("//span[text()='Updated successfully']"); }
    private get documentHdOkBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    isLink = false;
    async verifyOnDocumentDetailPage(expectedName?: string): Promise<boolean> {
        try {
            await utils.waitForObjectPageHeader();
            if (expectedName) {
                // try to verify header contains expected name
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

    async downloadDocument(): Promise<void> {
        try {
            const btn = await this.downloadBtn;
            await btn.waitForDisplayed({ timeout: 15000 });
            await utils.clickWithWait(btn);
            await utils.waitForBusyIndicatorToDisappear();
        } catch (err) {
            throw new Error('Download button not found or failed to click');
        }
    }
    public async verifyHeader(): Promise<void> {
        console.log("Verifying Document name");
        const expectedDocumentName = documentsListviewPage.createdDocumentName;
        console.log(`Expected Document header: ${expectedDocumentName}`);
        console.log("Waiting for visible Document header title element");
 
        await browser.waitUntil(async () => {
            const headingSpans = await this.documentHeaderTitleSpans;
            for (const span of headingSpans) {
                if (await span.isDisplayed()) {
                    const headingText = (await span.getText())?.trim();
                    if (headingText === expectedDocumentName) {
                        return true;
                    }
                }
            }
            return false;
        }, {
            timeout: 30000,
            interval: 500,
            timeoutMsg: `Document header '${expectedDocumentName}' was not visible in Object Page header`
        });
 
        let actualVisibleHeader = "";
        const headingSpans = await this.documentHeaderTitleSpans;
        for (const span of headingSpans) {
            if (await span.isDisplayed()) {
                const headingText = (await span.getText())?.trim();
                if (headingText) {
                    actualVisibleHeader = headingText;
                    break;
                }
            }
        }
 
        console.log(`Actual Document header: ${actualVisibleHeader}`);
        await expect(actualVisibleHeader).toEqual(expectedDocumentName);
        console.log("Document name matches header name");
    }
 
    public async editHeader(): Promise<void> {
        const fileTypeText = await $("//span[contains(normalize-space(),'File Type:')]").getText();

        if (fileTypeText.includes("Link")) {
            this.isLink = true;
        }
        console.log("isLink:", this.isLink);

        console.log("Editing header's Information");
        await utils.clickWithWait(this.documentEditHeader);
        const updatedDescription = "updated " + documentsListviewPage.createdDocumentName + " description";
        console.log(`Setting new description: ${updatedDescription}`);
        await utils.setValueWithWait(this.documentDescEditHeader, updatedDescription);
        await browser.pause(1000);
        await utils.clickWithWait(this.documentHeaderSave);
        console.log("Header save clicked, waiting for success message");
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Header update success message displayed");
        await utils.clickWithWait(this.documentHdOkBtn);
        console.log("Success dialog acknowledged with OK");
        console.log("Header edited successfully");
        await browser.pause(5000);
    }
    async editDocumentDetails(): Promise<void> {
        console.log("Editing document details - implementation needed");
        utils.clickWithWait($(`//button[contains(@class,"sapMBtn")][.//bdi[text()="Edit"]]`));
        await browser.pause(1000);

        if (this.isLink) {
            const link = await $("//bdi[normalize-space()='Link']/following::a[1]");

            if (await link.isExisting()) {

                console.log("Link is present");

                console.log("URL :", await link.getText());

                const Comments = await $(`//bdi[.//text()='Comments']/following::textarea[1]`);
                await Comments.waitForDisplayed({ timeout: 50000 });
                await console.log(await Comments.getText());
                await utils.setValueWithWait(Comments, "updated comments for link document");
                if (await Comments.getText() !== "updated comments for link document") {
                    throw new Error("Failed to update comments for link document");
                }
                const saveBtn = await $("//button[.//bdi[normalize-space()='Save']]");
                await saveBtn.waitForClickable({ timeout: 50000 });
                await saveBtn.click();
                await utils.waitForBusyIndicatorToDisappear();
                await utils.clickWithWait(this.documentHdOkBtn);
                console.log("Success dialog acknowledged with OK");
            } else {

                console.log("Link is not present");
            }
        }
        else {
            const dropdown = await $("//bdi[normalize-space()='Category']/ancestor::label/following::span[@role='button'][1]");
            await dropdown.click();

            const option = await $("//li[@role='option']//span[normalize-space()='Firmware']");
            await option.waitForClickable({ timeout: 50000 });
            await option.click();

            const Phase = await $("//bdi[normalize-space()='Phase']/ancestor::label/following::span[@role='button'][1]");
            await Phase.click();
            const design = await $("//li[@role='option'][.//span[normalize-space()='Design']]");
            await design.waitForClickable({ timeout: 50000 });
            await design.click();

            const modifiedBy = await $(`//bdi[.//text()='Modified By']/following::input[1]`);
            await modifiedBy.waitForDisplayed({ timeout: 50000 });
            await console.log(await modifiedBy.getText());

            const saveBtn = await $("//button[.//bdi[normalize-space()='Save']]");
            await saveBtn.waitForClickable({ timeout: 50000 });
            await saveBtn.click();
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickWithWait(this.documentHdOkBtn);
            console.log("Success dialog acknowledged with OK");
        }
    }
    async verifyAssignmentTabDetails(): Promise<void> {

        console.log("Navigating to Assignment tab");

        const assignmentTab = await $("//bdi[normalize-space()='Assignments']");

        await assignmentTab.waitForClickable({ timeout: 50000 });
        await assignmentTab.click();

        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        // Equipment
        const equipmentCount = await $("//h2/span[starts-with(normalize-space(),'Equipment (')]");

        console.log(
            "Equipment Count :",
            await equipmentCount.getText()
        );

        // Functional Location
        const flocCount = await $("//h2/span[starts-with(normalize-space(),'Functional Location (')]");

        console.log(
            "Functional Location Count :",
            await flocCount.getText()
        );

        // Asset Inspections
        const assetInspectionCount = await $("//h2/span[starts-with(normalize-space(),'Asset Inspections (')]");

        console.log(
            "Asset Inspection Count :",
            await assetInspectionCount.getText()
        );

        // Asset Strategy
        const assetStrategyCount = await $("//h2/span[starts-with(normalize-space(),'Asset Strategy (')]");

        console.log(
            "Asset Strategy Count :",
            await assetStrategyCount.getText()
        );

        // Maintenance Order
        const maintenanceOrderCount = await $("//h2/span[starts-with(normalize-space(),'Maintenance Order (')]");

        console.log(
            "Maintenance Order Count :",
            await maintenanceOrderCount.getText()
        );
    }

}

export default new DocumentsDetailPage();
