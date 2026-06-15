import 'dotenv/config';
import { browser } from '@wdio/globals';
//import BtpLoginPage from '../page_object_model/btp_applications_page/asset_integrity_configuration/configuration/btpLogin.page';
import HomePage from '../page_object_model/btp_applications_page/integrity/configuration/home.page';
import ConfigurationAppPage, { PICKLIST_02_UPLOAD_FILE } from '../page_object_model/btp_applications_page/integrity/configuration/configurationPicklist.page';
import SapUtils from '../utils/utils';


describe('BTP - Configuration (Picklist Publish) - Functional Test', () => {

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
        await ConfigurationAppPage.fillPicklistDetails();
        await ConfigurationAppPage.clickAddButton();
        
        await browser.pause(2000);
        await SapUtils.waitForBusyIndicatorToDisappear();
        
        await ConfigurationAppPage.clickAddButton();
        await ConfigurationAppPage.fillPicklistDetailss();
        await ConfigurationAppPage.clickAddButton();
    });

    // it('should edit the Picklist header (description) and Save', async () => {

    //     const newHeaderName = 'AutomationTestSample1';

    //     await ConfigurationAppPage.clickEditDescription();
    //     await ConfigurationAppPage.editPicklistName(newHeaderName);
    //     await ConfigurationAppPage.clickSaveButton();

    //     await SapUtils.waitForBusyIndicatorToDisappear();

    //     const updatedHeader = await ConfigurationAppPage.getPicklistHeaderText();
    //     console.log(`[VERIFY] Header after Save: "${updatedHeader}" (expected: "${newHeaderName}")`);
    //     expect(updatedHeader).toBe(newHeaderName);
    //     console.log('[SUCCESS] Picklist header updated successfully after Save');
    // });

    // it('should edit the Picklist header (description) and Cancel', async () => {

    //     const previousHeaderName = 'AutomationTestSample1';
    //     const discardedHeaderName = 'AutomationTestSample2';

    //     await ConfigurationAppPage.clickEditDescription();
    //     await ConfigurationAppPage.editPicklistName(discardedHeaderName);
    //     await ConfigurationAppPage.clickCancelButton();

    //     await SapUtils.waitForBusyIndicatorToDisappear();

    //     const headerAfterCancel = await ConfigurationAppPage.getPicklistHeaderText();
    //     console.log(`[VERIFY] Header after Cancel: "${headerAfterCancel}" (expected unchanged: "${previousHeaderName}")`);
    //     expect(headerAfterCancel).toBe(previousHeaderName);
    //     expect(headerAfterCancel).not.toBe(discardedHeaderName);
    //     console.log('[SUCCESS] Picklist header unchanged after Cancel');
    // });

    it('should upload picklist data file', async () => {

        await ConfigurationAppPage.uploadDataFile();
        await ConfigurationAppPage.clickUploadOkButton();
        console.log('[SUCCESS] Picklist data uploaded successfully');
        await ConfigurationAppPage.clickPublishButton();
        await ConfigurationAppPage.clickYesButtons();        
        await ConfigurationAppPage.clickUploadOkButton();

    });

    it('should download the data file and verify it matches the uploaded file', async () => {

        await ConfigurationAppPage.clickDownloadDataButton();
        console.log('[ACTION] Download Data button clicked');
        const downloadedFilePath = await SapUtils.waitForDownload('.xlsx');
        console.log(`[INFO] Downloaded file located at: ${downloadedFilePath}`);
        console.log(`[INFO] Uploaded file located at:   ${PICKLIST_02_UPLOAD_FILE}`);
        const { ok, diff } = await SapUtils.compareExcelData(
            PICKLIST_02_UPLOAD_FILE,
            downloadedFilePath
        );
        if (!ok) {
            console.log('[FAIL] Downloaded data does not match uploaded data:');
            diff.forEach(line => console.log(`  - ${line}`));
        }
        expect(ok).toBe(true);
        console.log('[SUCCESS] Downloaded picklist data matches the uploaded data');
    });

    it('should create a New Revision of the published Picklist', async () => {

        await ConfigurationAppPage.clickNewRevisionButton();
        await ConfigurationAppPage.clickYesButtons();
        console.log('[ACTION] New Revision confirmation accepted');
        await ConfigurationAppPage.clickUploadOkButton();
        console.log('[SUCCESS] New Revision created successfully');
    });

    it('should delete the created Picklist', async () => {

        // await ConfigurationAppPage.clickExitButton();
        await ConfigurationAppPage.searchForPicklist('AutomationTestSample');
        await ConfigurationAppPage.deleteCreatedPicklist();
        await ConfigurationAppPage.confirmDeleteYes();
        await ConfigurationAppPage.clickOkButton();
        console.log('[SUCCESS] Picklist deleted successfully');
    });

});