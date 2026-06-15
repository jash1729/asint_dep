import maintenanceOrdersListviewPage from '../../page_object_model/btp_applications_page/planning/maintenance_orders/maintenance_orders.listview.page.ts';
import maintenanceOrdersDetailPage from '../../page_object_model/btp_applications_page/planning/maintenance_orders/maintenance_orders.detail.page.ts';

describe('BTP Maintenance Orders Application Functional test', async () => {

    it('should navigate to Recommendation Workbench view', async () => {
        await maintenanceOrdersListviewPage.navigateToRecommendationWorkbenchView();
    });

    it('should search for a recommendation using Maintenance Order ID', async () => {
        await maintenanceOrdersListviewPage.searchRecommendation();
    });

    it('should click Create button to open creation options', async () => {
        await maintenanceOrdersListviewPage.createButton();
    });

    it('should select Create Maintenance Order option', async () => {
        await maintenanceOrdersListviewPage.fillCreateMaintenanceOrderForm();
    });

    it('should select Maintenance Orders assessment', async () => {
        await maintenanceOrdersListviewPage.navigateBackToMaintenanceOrdersListView();
    });

    it('should click on the first maintenance order in the list', async () => {
        await maintenanceOrdersListviewPage.clickMaintenanceOrder();
    });

    it('should verify maintenance order data is loaded correctly', async () => {
        const result =
        await maintenanceOrdersDetailPage.verifyMaintenanceOrderData();
        expect(result).toBe(true);
    });

    it('should navigate to Object List tab and verify equipment', async () => {
        await maintenanceOrdersDetailPage.ObjectListViewTab();
    });

});
