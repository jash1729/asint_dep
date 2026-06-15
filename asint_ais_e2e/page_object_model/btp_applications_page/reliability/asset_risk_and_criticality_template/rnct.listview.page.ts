import HomePage from '../../home.page';
import utils from '../../../../utils/utils';

class RNCTListViewPage {
    private get applicationFrame() { return $('//iframe[@title="Application"]'); }

    async navigateToRNCTListView() {
        await utils.waitForBusyIndicatorToDisappear();
        await HomePage.waitForHomePageToLoad();
        await utils.waitForSAPPopupAndClose();
        await HomePage.clickTile('Asset Risk and Criticality Template');
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForSAPPopupAndClose();
        await utils.switchToIframe(this.applicationFrame);
    }

    async createNewTemplate(templateName: string) {
        const createButton = await $('//button[@title="Create"]');
        await createButton.click();
        await browser.pause(1000);
        const desc = await $(`.//span[normalize-space()='Description']/following::textarea[1]`);
        await desc.setValue(templateName);
        await browser.pause(1000);
        const longDesc = await $(`.//span[normalize-space()='Long Description']/following::textarea[1]`);
        await longDesc.setValue("This is a long description for " + templateName);
        await browser.pause(1000);
        const riskScoreType = await $(`//bdi[text()="Alphanumeric"]/ancestor::div[@role="radio"]`);
        await riskScoreType.click();
        const saveButton = await $('//bdi[text()="Save"]');
        await saveButton.click();
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait($(`//span[text()='Success']/following::button[.//bdi[text()='OK']][1]`));
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
    }

}
export default new RNCTListViewPage();