import 'dotenv/config';
import { browser } from '@wdio/globals';
//import BtpLoginPage from '../page_object_model/btp_applications_page/asset_integrity_configuration/configuration/btpLogin.page';
import HomePage from '../page_object_model/btp_applications_page/integrity/configuration/home.page';
import ConfigurationAppPage from '../page_object_model/btp_applications_page/integrity/configuration/configurationPicklist.page';
import SapUtils from '../utils/utils';


describe('BTP Configuration (Picklist Creation) - Functional Test', () => {

    it('should navigate to the Configuration Management App', async () => {
        await HomePage.waitForHomePageToLoad();
        await HomePage.clickTile('Configurations');

        // Wait for page to stabilize after navigation
        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.waitForSAPPopupAndClose(10);

        expect(await ConfigurationAppPage.isAppLoaded()).toBe(true);
    });

    it('should navigate into the Picklist section', async () => {

        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.waitForSAPPopupAndClose();

        await ConfigurationAppPage.navigateToPicklist();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('picklist'),
            {
                timeout: 30000,
                timeoutMsg: 'Navigation to Picklist timed out'
            }
        );

        expect(await browser.getUrl()).toContain('picklist');
        console.log('[SUCCESS] Picklist functionality reached.');

        await ConfigurationAppPage.clickCreateButton();
        console.log('[SUCCESS] Create button clicked.');

        await ConfigurationAppPage.createPicklist();
    });

    it('should open the created Picklist and Add Column', async () => {
    
            await ConfigurationAppPage.openCreatedPicklist();
            await ConfigurationAppPage.clickAddButton();
            await ConfigurationAppPage.fillPicklistDetails1();
            await ConfigurationAppPage.clickAddButton();
            
    });

    it('should download the template', async () => {
    
        await ConfigurationAppPage.clickDownloadTemplate();
        console.log('[SUCCESS] Template download triggered');
    
    });

    it('should delete the created column', async () => {

        await ConfigurationAppPage.deleteColumn();
        await ConfigurationAppPage.confirmDeleteYes();
        await ConfigurationAppPage.clickOkButton();
        console.log('[SUCCESS] Column deleted successfully');

    });

    it('should delete the created Picklist', async () => {
            
        await ConfigurationAppPage.clickExitButton();
        await ConfigurationAppPage.deleteCreatedPicklist();
        await ConfigurationAppPage.confirmDeleteYes();
    });

});