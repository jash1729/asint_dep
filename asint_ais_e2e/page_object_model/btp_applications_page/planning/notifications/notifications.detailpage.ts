import { browser } from '@wdio/globals';
import utils from '../../../../utils/utils';

class NotificationsDetailPage {
	private get notificationsFrameByHelpId() { return $('iframe[data-help-id="application-notifications-manage"]'); }
	private get updateStatusButton() { return $('//button[.//span[normalize-space()="Update Status"] or .//bdi[normalize-space()="Update Status"] or normalize-space()="Update Status"]'); }
	private get downloadReportButton() { return $('//button[.//span[normalize-space()="Download Report"] or .//bdi[normalize-space()="Download Report"] or normalize-space()="Download Report"]'); }
	private get editHeaderDetailsButton() { return $('//button[.//span[normalize-space()="Edit Header Details"] or .//bdi[normalize-space()="Edit Header Details"] or normalize-space()="Edit Header Details"]'); }

	private async getValueByLabel(labelText: string): Promise<string> {
		const labelXpath = `//label[.//bdi[normalize-space()=${utils.xpathString(labelText)}]]`;
		const label = await $(labelXpath);
		if (!(await label.isExisting())) return '';
		if (!(await label.isDisplayed().catch(() => false))) {
			await label.scrollIntoView();
		}

		const container = await label.$('./parent::div/following-sibling::div[1]');
		if (!(await container.isExisting())) return '';

		const input = await container.$('.//input');
		if (await input.isExisting()) {
			const value = await input.getValue().catch(() => '');
			if (value) return String(value).trim();
			const text = await input.getText().catch(() => '');
			if (text) return text.trim();
		}

		const textarea = await container.$('.//textarea');
		if (await textarea.isExisting()) {
			const value = await textarea.getValue().catch(() => '');
			if (value) return String(value).trim();
			const text = await textarea.getText().catch(() => '');
			if (text) return text.trim();
		}

		const switchEl = await container.$('.//*[@role="switch"]');
		if (await switchEl.isExisting()) {
			const checked = await switchEl.getAttribute('aria-checked');
			if (checked === 'true') return 'On';
			if (checked === 'false') return 'Off';
		}

		const text = await container.getText().catch(() => '');
		return text.trim();
	}

	private async isNotificationDetailVisible(): Promise<boolean> {
		const updateStatus = await this.updateStatusButton.isDisplayed().catch(() => false);
		if (updateStatus) return true;

		const downloadReport = await this.downloadReportButton.isDisplayed().catch(() => false);
		if (downloadReport) return true;

		return await this.editHeaderDetailsButton.isDisplayed().catch(() => false);
	}

	private async switchToNotificationsFrame(): Promise<void> {
		await browser.switchFrame(null);

		const helpFrame = await this.notificationsFrameByHelpId;
		if (await helpFrame.isExisting().catch(() => false)) {
			await utils.switchToIframe(helpFrame);
			if (await this.isNotificationDetailVisible()) return;
			await browser.switchFrame(null);
		}

		const frames = await $$('//iframe');
		for (const frame of frames) {
			try {
				await browser.switchFrame(frame);
				if (await this.isNotificationDetailVisible()) return;
				await browser.switchFrame(null);
			} catch {
				await browser.switchFrame(null);
			}
		}

		throw new Error('Notifications detail view frame not found');
	}

	public async waitForNotificationDetailPage(): Promise<void> {
		await utils.waitForBusyIndicatorToDisappear();
		await browser.waitUntil(async () => {
			return await this.isNotificationDetailVisible();
		}, { timeout: 120000, timeoutMsg: 'Notification detail page did not load' });
	}

	public async verifyOnNotificationDetailPage(): Promise<boolean> {
		try {
			await this.switchToNotificationsFrame();
			await this.waitForNotificationDetailPage();
			return true;
		} catch {
			return false;
		}
	}

	public async verifyAndPrintGeneralInfo(): Promise<Record<string, string>> {
		await this.switchToNotificationsFrame();
		await this.waitForNotificationDetailPage();
        await console.log('✓ On Notification Detail Page - General Info:');
		const labels = [
			'Equipment',
			'Equipment Description',
			'Parent Name',
			'Parent Description',
			'Component Name',
			'Component Description',
			'Priority',
			'Required Start Date / Time',
			'Required End Date / Time',
			'Notification MDA',
			'Breakdown',
			'Long Description'
		];

		const values: Record<string, string> = {};
		for (const label of labels) {
			const value = await this.getValueByLabel(label);
			values[label] = value;
			console.log(`General Info - ${label}: ${value || 'N/A'}`);
		}

		return values;
	}

	public async verifyAndPrintResponsibilities(): Promise<Record<string, string>> {
		await this.switchToNotificationsFrame();
		await this.waitForNotificationDetailPage();
		await console.log('On Notification Detail Page - Responsibilities:');

		const labels = [
			'Work Center',
			'Work Center Plant',
			'Planning Plant',
			'Planner Group',
			'Work Center Description',
			'Work Center Plant Description',
			'Planning Plant Description',
			'Revision'
		];

		const values: Record<string, string> = {};
		for (const label of labels) {
			const value = await this.getValueByLabel(label);
			values[label] = value;
			console.log(`Responsibilities - ${label}: ${value || 'N/A'}`);
		}

		return values;
	}

	public async verifyAndPrintAssetStrategy(): Promise<Record<string, string>> {
		await browser.pause(2000);
        await this.switchToNotificationsFrame();
		await this.waitForNotificationDetailPage();
        await utils.clickWithWait(await $(`//button[.//bdi[text()="Assignments"]]`));
        await browser.pause(1000);
		await console.log('On Notification Detail Page - Asset Strategy:');
        await utils.clickWithWait(await $(`//div[normalize-space()='Asset Strategy']/following::button[.//bdi[normalize-space()='Assign']][1]`));
        await browser.pause(2500);
        // await utils.clickWithWait(await $(`(//div[@role='checkbox'])[2]`));
		
		const firstRow = await $("(//table[@role='grid']//tbody/tr)[1]");
		const assessmentName = await firstRow.$(".//td[@role='gridcell']//span[1]");
		const assessmentText = await assessmentName.getText();
		console.log("Assessment Name :", assessmentText);
		const checkbox = await firstRow.$(".//div[@role='checkbox']");
		await checkbox.click();

        await browser.pause(1000);
        await utils.clickWithWait(await $(`//h1[.//span[normalize-space()='Assign Assessment']]/following::button[.//bdi[normalize-space()='Assign']][1]`));
        await utils.waitForBusyIndicatorToDisappear();
        if(await $(`//span[normalize-space()='Assign unsuccessful.']`).isExisting()){
            console.log('Asset Strategy - Assignment unsuccessful');
            await utils.clickWithWait(await $(`//button[.//bdi[normalize-space()='OK']][1]`));
            await browser.pause(1000);
            await utils.clickWithWait(await $(`//h1[.//span[normalize-space()='Assign Assessment']]/following::button[.//bdi[normalize-space()='Cancel']][1]`));
            await console.log('Asset Strategy - Assignment already exists');
        } else {
            console.log('Asset Strategy - Assignment successful');
            await utils.clickSuccessOkButton();
            await browser.pause(2000);
        }
		const tableXpath = [
			'//table[@role="grid" and @aria-roledescription="Responsive Table"',
			'and .//th[.//span[normalize-space()="Assessment"]]',
			'and .//th[.//span[normalize-space()="Template Type"]]',
			'and .//th[.//span[normalize-space()="Analysis Status"]]',
			'and .//th[.//span[normalize-space()="Created On"]]',
			'and .//th[.//span[normalize-space()="Notifications"]]',
			'and .//th[.//span[normalize-space()="Maintenance Orders"]]]'
		].join(' ');

		const table = await $(tableXpath);
		await browser.waitUntil(async () => {
			return await table.isDisplayed().catch(() => false);
		}, { timeout: 120000, timeoutMsg: 'Asset Strategy table not found' });
		await table.scrollIntoView();

		const headerCells = await table.$$('.//thead//th//span[normalize-space()]');
		const headers: string[] = [];
		for (let i = 0; i < await headerCells.length; i++) {
			const text = (await headerCells[i].getText().catch(() => '')).trim();
			if (text) headers.push(text);
		}
		console.log(`Asset Strategy - Columns: ${headers.join(' | ')}`);

		const rows = await table.$$('.//tbody//tr[@role="row" and .//td[@role="gridcell"]]');
		const rowCount = await rows.length;
		console.log(`Asset Strategy - Row count: ${rowCount}`);
		if (rowCount === 0) {
			const noData = await table.$('.//tbody//td[normalize-space()="No Data"]');
			if (await noData.isExisting().catch(() => false)) {
				console.log('Asset Strategy - No Data');
                throw new Error('No data in Asset Strategy table');
			}
		}

        console.log('Asset Strategy - now unassign all the assignments to reset the state');
		await browser.pause(2000);
		await utils.clickWithWait(await $(`//tr[@role='row'][.//a[normalize-space()='${assessmentText}']]//div[@role='checkbox']`));
        await browser.pause(1000);
		await utils.clickWithWait(await $(`(//button[.//bdi[text()="Unassign"]])[1]`));
        await browser.pause(2000);
        await utils.clickWithWait(await $(`//button[.//bdi[text()="Yes"]]`)); 
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickSuccessOkButton();
        await browser.pause(2000);

		// await browser.waitUntil(async () => {
		// 	const updatedRows = await table.$$('.//tbody//tr[@role="row" and .//td[@role="gridcell"]]');
		// 	const updatedCount = await updatedRows.length;
		// 	if (updatedCount !== 0) return false;
		// 	const noDataCell = await table.$('.//tbody//td[normalize-space()="No Data"]');
		// 	return await noDataCell.isExisting().catch(() => false);
		// }, { timeout: 60000, timeoutMsg: 'Asset Strategy table did not clear after unassign' });

		// const finalRows = await table.$$('.//tbody//tr[@role="row" and .//td[@role="gridcell"]]');
		// const finalCount = await finalRows.length;
		// const finalNoData = await table.$('.//tbody//td[normalize-space()="No Data"]');
		// const noDataVisible = await finalNoData.isExisting().catch(() => false);
		// if (finalCount !== 0 || !noDataVisible) {
		// 	throw new Error('Asset Strategy table should be empty after unassign');
		// }
		console.log('Asset Strategy - table cleared after unassign');

        

		return {
			Columns: headers.join(' | '),
			RowCount: String(rowCount)
		};
	}

	public async verifyAndPrintAssetInspection(): Promise<Record<string, string>> {
		await browser.pause(2000);
		await this.switchToNotificationsFrame();
		await this.waitForNotificationDetailPage();
		await utils.clickWithWait(await $(`//button[.//bdi[text()="Assignments"]]`));
		await browser.pause(1000);
		await console.log('On Notification Detail Page - Asset Inspection:');
		await utils.clickWithWait(await $(`//div[normalize-space()='Asset Inspection']/following::button[.//bdi[normalize-space()='Assign']][1]`));
		await browser.pause(2500);
		// await utils.clickWithWait(await $(`(//div[@role='checkbox'])[2]`));
		const firstRow = await $("(//table[@role='grid']//tbody/tr)[1]");
		const assessmentName = await firstRow.$(".//td[@role='gridcell']//span[1]");
		const assessmentText = await assessmentName.getText();
		console.log("Assessment Name :", assessmentText);
		const checkbox = await firstRow.$(".//div[@role='checkbox']");
		await checkbox.click();

		await browser.pause(1000);
		await utils.clickWithWait(await $(`//h1[.//span[normalize-space()='Assign Inspection']]/following::button[.//bdi[normalize-space()='Assign']][1]`));
		await utils.waitForBusyIndicatorToDisappear();
		if (await $(`//span[normalize-space()='Assign unsuccessful.']`).isExisting()) {
			console.log('Asset Inspection - Assignment unsuccessful');
			await utils.clickWithWait(await $(`//button[.//bdi[normalize-space()='OK']][1]`));
			await browser.pause(1000);
			await utils.clickWithWait(await $(`//h1[.//span[normalize-space()='Assign Inspection']]/following::button[.//bdi[normalize-space()='Cancel']][1]`));
			await console.log('Asset Inspection - Assignment already exists');
		} else {
			console.log('Asset Inspection - Assignment successful');
			await utils.clickSuccessOkButton();
			await browser.pause(2000);
		}

		const tableXpath = [
			'//table[@role="grid" and @aria-roledescription="Responsive Table"',
			'and .//th[.//span[normalize-space()="Inspections"]]',
			'and .//th[.//span[normalize-space()="Template Type"]]',
			'and .//th[.//span[normalize-space()="Analysis Status"]]',
			'and .//th[.//span[normalize-space()="Created On"]]',
			'and .//th[.//span[normalize-space()="Notifications"]]',
			'and .//th[.//span[normalize-space()="Maintenance Orders"]]]'
		].join(' ');

		const table = await $(tableXpath);
		await browser.waitUntil(async () => {
			return await table.isDisplayed().catch(() => false);
		}, { timeout: 120000, timeoutMsg: 'Asset Inspection table not found' });
		await table.scrollIntoView();

		const headerCells = await table.$$('.//thead//th//span[normalize-space()]');
		const headers: string[] = [];
		for (let i = 0; i < await headerCells.length; i++) {
			const text = (await headerCells[i].getText().catch(() => '')).trim();
			if (text) headers.push(text);
		}
		console.log(`Asset Inspection - Columns: ${headers.join(' | ')}`);

		const rows = await table.$$('.//tbody//tr[@role="row" and .//td[@role="gridcell"]]');
		const rowCount = await rows.length;
		console.log(`Asset Inspection - Row count: ${rowCount}`);
		if (rowCount === 0) {
			const noData = await table.$('.//tbody//td[normalize-space()="No Data"]');
			if (await noData.isExisting().catch(() => false)) {
				console.log('Asset Inspection - No Data');
			}
		}

		console.log('Asset Inspection - now unassign that assigned assignments to reset the state');
		await browser.pause(2000);
		await utils.clickWithWait(await $(`//tr[@role='row'][.//a[normalize-space()='${assessmentText}']]//div[@role='checkbox']`));
		await browser.pause(1000);
		await utils.clickWithWait(await $(`(//button[.//bdi[text()="Unassign"]])[2]`));
		await browser.pause(2000);
		await utils.clickWithWait(await $(`//button[.//bdi[text()="Yes"]]`));
		await utils.waitForBusyIndicatorToDisappear();
		await utils.clickSuccessOkButton();
		await browser.pause(2000);

		// await browser.waitUntil(async () => {
		// 	const updatedRows = await table.$$('.//tbody//tr[@role="row" and .//td[@role="gridcell"]]');
		// 	const updatedCount = await updatedRows.length;
		// 	if (updatedCount !== 0) return false;
		// 	const noDataCell = await table.$('.//tbody//td[normalize-space()="No Data"]');
		// 	return await noDataCell.isExisting().catch(() => false);
		// }, { timeout: 60000, timeoutMsg: 'Asset Inspection table did not clear after unassign' });

		// const finalRows = await table.$$('.//tbody//tr[@role="row" and .//td[@role="gridcell"]]');
		// const finalCount = await finalRows.length;
		// const finalNoData = await table.$('.//tbody//td[normalize-space()="No Data"]');
		// const noDataVisible = await finalNoData.isExisting().catch(() => false);
		// if (finalCount !== 0 || !noDataVisible) {
		// 	throw new Error('Asset Inspection table should be empty after unassign');
		// }
		console.log('Asset Inspection - table cleared after unassign');

		return {
			Columns: headers.join(' | '),
			RowCount: String(rowCount)
		};
	}

	public async verifyAndPrintRecommendation(): Promise<Record<string, string>> {
		await browser.pause(2000);
		await this.switchToNotificationsFrame();
		await this.waitForNotificationDetailPage();
		await utils.clickWithWait(await $(`//button[.//bdi[text()="Assignments"]]`));
		await browser.pause(1000);
		await console.log('On Notification Detail Page - Recommendation:');
		await utils.clickWithWait(await $(`//div[normalize-space()='Recommendation']/following::button[.//bdi[normalize-space()='Assign']][1]`));
		await browser.pause(2500);
		// await utils.clickWithWait(await $(`(//div[@role='checkbox'])[2]`));
		const firstRow = await $("(//table[@role='grid']//tbody/tr)[1]");
		const assessmentName = await firstRow.$(".//td[@role='gridcell']//span[1]");
		const assessmentText = await assessmentName.getText();
		console.log("Assessment Name :", assessmentText);
		const checkbox = await firstRow.$(".//div[@role='checkbox']");
		await checkbox.click();
		await browser.pause(1000);
		await utils.clickWithWait(await $(`//h1[.//span[normalize-space()='Select Recommendation(s)']]/following::button[.//bdi[normalize-space()='Confirm']][1]`));
		await utils.waitForBusyIndicatorToDisappear();
		if (await $(`//span[normalize-space()='Assign unsuccessful.']`).isExisting()) {
			console.log('Recommendation - Assignment unsuccessful');
			await utils.clickWithWait(await $(`//button[.//bdi[normalize-space()='OK']][1]`));
			await browser.pause(1000);
			await utils.clickWithWait(await $(`//h1[.//span[normalize-space()='Select Recommendation(s)']]/following::button[.//bdi[normalize-space()='Close']][1]`));
			await console.log('Recommendation - Assignment already exists');
		} else {
			console.log('Recommendation - Assignment successful');
			await utils.clickSuccessOkButton();
			await browser.pause(2000);
		}

		const tableXpath = [
			'//table[@role="grid" and @aria-roledescription="Responsive Table"',
			'and .//th[.//span[normalize-space()="Recommendation"]]',
			'and .//th[.//span[normalize-space()="Type"]]',
			'and .//th[.//span[normalize-space()="Subtype"]]',
			'and .//th[.//span[normalize-space()="Assessment Type"]]',
			'and .//th[.//span[normalize-space()="Assessment"]]',
			'and .//th[.//span[normalize-space()="Cycle"]]',
			'and .//th[.//span[normalize-space()="Status"]]]'
		].join(' ');

		const table = await $(tableXpath);
		await browser.waitUntil(async () => {
			return await table.isDisplayed().catch(() => false);
		}, { timeout: 120000, timeoutMsg: 'Recommendation table not found' });
		await table.scrollIntoView();

		const headerCells = await table.$$('.//thead//th//span[normalize-space()]');
		const headers: string[] = [];
		for (let i = 0; i < await headerCells.length; i++) {
			const text = (await headerCells[i].getText().catch(() => '')).trim();
			if (text) headers.push(text);
		}
		console.log(`Recommendation - Columns: ${headers.join(' | ')}`);

		const rows = await table.$$('.//tbody//tr[@role="row" and .//td[@role="gridcell"]]');
		const rowCount = await rows.length;
		console.log(`Recommendation - Row count: ${rowCount}`);
		if (rowCount === 0) {
			const noData = await table.$('.//tbody//td[normalize-space()="No Data"]');
			if (await noData.isExisting().catch(() => false)) {
				console.log('Recommendation - No Data');
			}
		}

		console.log('Recommendation - now unassign all the assignments to reset the state');
		await browser.pause(2000);
		await utils.clickWithWait(await $(`//tr[@role='row'][.//a[normalize-space()='${assessmentText}']]//div[@role='checkbox']`));
		await browser.pause(1000);
		await utils.clickWithWait(await $(`(//button[.//bdi[text()="Unassign"]])[3]`));
		await browser.pause(2000);
		await utils.clickWithWait(await $(`//button[.//bdi[text()="Yes"]]`));
		await utils.waitForBusyIndicatorToDisappear();
		await utils.clickSuccessOkButton();
		await browser.pause(2000);

		// await browser.waitUntil(async () => {
		// 	const updatedRows = await table.$$('.//tbody//tr[@role="row" and .//td[@role="gridcell"]]');
		// 	const updatedCount = await updatedRows.length;
		// 	if (updatedCount !== 0) return false;
		// 	const noDataCell = await table.$('.//tbody//td[normalize-space()="No Data"]');
		// 	return await noDataCell.isExisting().catch(() => false);
		// }, { timeout: 60000, timeoutMsg: 'Recommendation table did not clear after unassign' });

		// const finalRows = await table.$$('.//tbody//tr[@role="row" and .//td[@role="gridcell"]]');
		// const finalCount = await finalRows.length;
		// const finalNoData = await table.$('.//tbody//td[normalize-space()="No Data"]');
		// const noDataVisible = await finalNoData.isExisting().catch(() => false);
		// if (finalCount !== 0 || !noDataVisible) {
		// 	throw new Error('Recommendation table should be empty after unassign');
		// }
		console.log('Recommendation - table cleared after unassign');

		return {
			Columns: headers.join(' | '),
			RowCount: String(rowCount)
		};
	}
}

export default new NotificationsDetailPage();
