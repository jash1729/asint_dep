import 'dotenv/config';
import { browser } from '@wdio/globals';
import HomePage from '../page_object_model/btp_applications_page/integrity/configuration/home.page';
import configurationMatricesPage from '../page_object_model/btp_applications_page/integrity/configuration/configurationMatrices.page';
import SapUtils from '../utils/utils';


describe('BTP Configuration (Matrices) - Functional Test', () => {

    it('should navigate to Configuration Management App', async () => {

        await HomePage.waitForHomePageToLoad();
        await SapUtils.waitForSAPPopupAndClose();
        await HomePage.clickTile('Configurations');
        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.waitForSAPPopupAndClose(10);
        expect(await configurationMatricesPage.isAppLoaded()).toBe(true);

    });

    it('should navigate into the Matrices section', async () => {

        await SapUtils.waitForBusyIndicatorToDisappear();
        await SapUtils.waitForSAPPopupAndClose(20);
        await configurationMatricesPage.navigateToMatrices();
        console.log('[SUCCESS] Matrices functionality reached');
        await SapUtils.waitForSAPPopupAndClose(20);
        await configurationMatricesPage.clickCreateButton();
        await configurationMatricesPage.createMatrix();
        await configurationMatricesPage.clickOkButton();

    });

    it('should open the created matrix', async () => {

        await configurationMatricesPage.openCreatedMatrix();
        console.log('[SUCCESS] Matrix created and opened successfully');

    });

    it('should edit the created matrix', async () => {

        await configurationMatricesPage.editMatrix();
        console.log('[SUCCESS] Matrix edited successfully');
        
    });

    it('should add risk color', async () => {

        await configurationMatricesPage.addRiskColor('colour1', 'rgb(255, 0, 0)');
        await configurationMatricesPage.deleteRiskColor(0);
        await configurationMatricesPage.addRiskColor('colour1', 'rgb(255, 0, 0)');
        await configurationMatricesPage.addRiskColor('colour2', 'rgb(254, 224, 0)');
        await configurationMatricesPage.addRiskColor('colour3', 'rgb(255, 151, 0)');
        browser.pause(5000); 

    });
    it('should assign all risk colors to their specific matrix cells', async () => {
        
        //  Laal color
        const redCells = [
            { x: '271', y: '30' },
            { x: '371', y: '30' },
            { x: '371', y: '130' }
        ];
        await configurationMatricesPage.assignColorToCells(0, redCells);

        //  Haldi color
        const yellowCells = [
            { x: '171', y: '130' },                
            { x: '171', y: '229.99999999999997' }, 
            { x: '271', y: '229.99999999999997' } 
        ];
        await configurationMatricesPage.assignColorToCells(1, yellowCells);

        //  Santara color
        const orangeCells = [
            { x: '171', y: '30' },                 
            { x: '271', y: '130' },                
            { x: '371', y: '229.99999999999997' }
        ];
        await configurationMatricesPage.assignColorToCells(2, orangeCells);
        console.log('[SUCCESS] All risk colors assigned to matrix cells successfully');
    });

    it('should configure X-axis entirely', async () => {

        await configurationMatricesPage.configureXAxis('description', true);
        await configurationMatricesPage.enterTextValue(0, '0',  'LOW',    '10');
        await configurationMatricesPage.enterTextValue(1, '10', 'MEDIUM', '20');
        await configurationMatricesPage.enterTextValue(2, '20', 'HIGH',   '30');

        // Verify delete functionality on the X-axis, then re-create it
        await configurationMatricesPage.deleteAxisEntry('description');
        await configurationMatricesPage.configureXAxis('description', true);
        await configurationMatricesPage.enterTextValue(0, '0',  'LOW',    '10');
        await configurationMatricesPage.enterTextValue(1, '10', 'MEDIUM', '20');
        await configurationMatricesPage.enterTextValue(2, '20', 'HIGH',   '30');

    });

    it('should configure Y-axis entirely', async () => {

        await configurationMatricesPage.configureYAxis('Y-Axis Label', true);
        await configurationMatricesPage.enterYAxisRowValue(0, '20', 'HIGH',   '30');
        await configurationMatricesPage.enterYAxisRowValue(1, '10', 'MEDIUM');
        await configurationMatricesPage.enterYAxisRowValue(2, '0',  'LOW');

    });

    it('should add a risk line with specified coordinates and axes', async () => {
        await configurationMatricesPage.addRiskLine('Risk Line PS','#FEE000','3','3','13','13');
    });

    it('should verify the matrix details before publishing', async () => {
        await configurationMatricesPage.verifyMatrixDetails({
            xAxisDescription: 'description',
            xAxisSubLabels:   ['LOW', 'MEDIUM', 'HIGH'],
            xAxisRangeLabels: ['0-10', '10-20', '20-30'],
            yAxisLabel:       'Y-Axis Label',
            yAxisSubLabels:   ['LOW', 'MEDIUM', 'HIGH']
        });
        console.log('[SUCCESS] Matrix axis labels and risk line verified');
    });

    it('should should publish the matrix', async () => {
        await configurationMatricesPage.publishMatrix();
    });

    it('should create a new revision of the matrix', async () => {
        await configurationMatricesPage.createNewRevision();
    });

    it('should verify the matrix row details on the listview after new revision', async () => {
        // Same details as after publish; only Status flips to Unpublished and Version bumps to 2.
        // If the Categories cell is empty, the verifier throws — that is the known regression.
        await configurationMatricesPage.verifyMatrixListRow({
            title:       'AutomationMatrixTest_007',
            description: 'description',
            rowSize:     '3',
            colSize:     '3',
            status:      'Unpublished',
            version:     '2',
            categories:  'Asset Strategy Development(ASD), HAZOP, LOPA'
        });
        console.log('[SUCCESS] Listview row verified after new revision');
    });

    it('should delete the created matrix', async () => {
        await configurationMatricesPage.deleteMatrixByTitle('AutomationMatrixTest_007');
        console.log('[SUCCESS] Matrix deleted successfully');
    });

});
