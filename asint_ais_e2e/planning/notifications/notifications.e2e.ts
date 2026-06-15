import notificationsListPage from '@pages/btp_applications_page/planning/notifications/notifications.listpage';
import notificationsDetailPage from '@pages/btp_applications_page/planning/notifications/notifications.detailpage';
import utils from 'utils/utils';

describe('BTP Notifications Application', () => {

	it('should open the Notifications application and display the list', async () => {
		await notificationsListPage.navigateToNotificationsListView();
		expect(await notificationsListPage.verifyOnNotificationsListPage()).toBe(true);
	});

	it('should add and verify all the adapt filters', async () => {
		await utils.addAllAdaptFilter();
		await utils.resetAllAdaptFilter();
	});
	
	it('should open the first notification from the list', async () => {
		await notificationsListPage.openFirstNotificationFromList();
		expect(await notificationsDetailPage.verifyOnNotificationDetailPage()).toBe(true);
	});

	it('should verify notification general info details', async () => {
		const details = await notificationsDetailPage.verifyAndPrintGeneralInfo();
		expect(Object.keys(details).length).toBeGreaterThan(0);
	});

	it('should verify notification responsibilities details', async () => {
		const details = await notificationsDetailPage.verifyAndPrintResponsibilities();
		expect(Object.keys(details).length).toBeGreaterThan(0);
	});

	it('should assign & unassign Assign Assessment and verify on asset strategy details page', async () => {
		const details = await notificationsDetailPage.verifyAndPrintAssetStrategy();
		expect(Object.keys(details).length).toBeGreaterThan(0);
	});

	it('should assign & unassign Assign Inspection and verify on asset inspection details', async () => {
		const details = await notificationsDetailPage.verifyAndPrintAssetInspection();
		expect(Object.keys(details).length).toBeGreaterThan(0);
	});

	it('should assign & unassign Recommendation and verify on recommendation details', async () => {
		const details = await notificationsDetailPage.verifyAndPrintRecommendation();
		expect(Object.keys(details).length).toBeGreaterThan(0);
	});
});
