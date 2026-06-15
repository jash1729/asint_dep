import { browser } from '@wdio/globals';
import HomePage from '../../home.page';
import utils from '../../../../utils/utils';

class NotificationsListPage {
	public firstNotificationName = '';

	private get notificationsFrameByHelpId() { return $('iframe[data-help-id="application-notifications-manage"]'); }
	private get notificationColumnHeader() { return $('//span[normalize-space()="Notification"]'); }
	private get notificationFilterLabel() { return $('//label[normalize-space()="Notification"]'); }
	private get notificationTypeColumnHeader() { return $('//span[normalize-space()="Notification Type"]'); }

	private async isNotificationListVisible(): Promise<boolean> {
		const columnHeader = await this.notificationColumnHeader.isDisplayed().catch(() => false);
		if (columnHeader) return true;

		const filterLabel = await this.notificationFilterLabel.isDisplayed().catch(() => false);
		if (filterLabel) return true;

		return await this.notificationTypeColumnHeader.isDisplayed().catch(() => false);
	}

	private async switchToNotificationsFrame(): Promise<void> {
		await browser.switchFrame(null);

		const helpFrame = await this.notificationsFrameByHelpId;
		if (await helpFrame.isExisting().catch(() => false)) {
			await utils.switchToIframe(helpFrame);
			if (await this.isNotificationListVisible()) return;
			await browser.switchFrame(null);
		}

		const frames = await $$('//iframe');
		for (const frame of frames) {
			try {
				await browser.switchFrame(frame);
				if (await this.isNotificationListVisible()) return;
				await browser.switchFrame(null);
			} catch {
				await browser.switchFrame(null);
			}
		}

		throw new Error('Notifications list view frame not found');
	}

	private async getNotificationRows(): Promise<any[]> {
		const rowSelectors = [
			'//tr[@role="row" and .//td[@role="gridcell"]]',
			'//div[@role="row" and .//*[@role="gridcell"]]'
		];

		for (const selector of rowSelectors) {
			const rows = await $$(selector);
			const rowCount = await rows.length;
			if (rowCount > 0) {
				const rowList: any[] = [];
				for (let i = 0; i < rowCount; i++) {
					rowList.push(rows[i]);
				}
				return rowList;
			}
		}

		const fallbackRows = await $$('//tr[@role="row"]');
		const dataRows: any[] = [];
		for (let i = 0; i < await fallbackRows.length; i++) {
			const row = fallbackRows[i];
			const cells = await row.$$('td');
			if (await cells.length > 0) dataRows.push(row);
		}
		return dataRows;
	}

	private async waitForNotificationRows(): Promise<any[]> {
		let rows: any[] = [];
		await browser.waitUntil(async () => {
			rows = await this.getNotificationRows();
			if (rows.length === 0) return false;
			return await rows[0].isDisplayed().catch(() => false);
		}, { timeout: 120000, timeoutMsg: 'No notification rows found in the list' });
		return rows;
	}

	private async getRowPrimaryText(row: any): Promise<string> {
		const gridCells = await row.$$('td[role="gridcell"]');
		for (let i = 0; i < await gridCells.length; i++) {
			const cell = gridCells[i];
			const text = (await cell.getText()).trim();
			if (text) return text;
		}

		const textCandidates = await row.$$('.//*[self::a or self::span][normalize-space()]');
		for (let i = 0; i < await textCandidates.length; i++) {
			const candidate = textCandidates[i];
			const text = (await candidate.getText()).trim();
			if (text) return text;
		}

		return '';
	}

	private async clickNotificationRow(row: any): Promise<void> {
		try {
			await utils.clickWithWait(row);
			return;
		} catch {
			const clickable = await row.$('.//*[self::a or self::span][normalize-space()]');
			await utils.clickWithWait(clickable);
		}
	}

	public async navigateToNotificationsListView(): Promise<void> {
		await HomePage.waitForHomePageToLoad();
		await utils.waitForSAPPopupAndClose();
		await HomePage.clickTile('Notifications');
		await utils.waitForBusyIndicatorToDisappear();
		await utils.waitForSAPPopupAndClose();
		await this.switchToNotificationsFrame();
		await this.waitForNotificationListReady();
	}

	public async verifyOnNotificationsListPage(): Promise<boolean> {
		try {
			await this.switchToNotificationsFrame();
			await this.waitForNotificationListReady();
			return true;
		} catch {
			return false;
		}
	}

	private async waitForNotificationListReady(): Promise<void> {
		await browser.waitUntil(async () => {
			if (await this.isNotificationListVisible()) return true;
			const rows = await this.getNotificationRows();
			return rows.length > 0;
		}, { timeout: 120000, timeoutMsg: 'Notification list view did not load' });
	}

	public async openFirstNotificationFromList(): Promise<void> {
		await this.switchToNotificationsFrame();
		await utils.waitForBusyIndicatorToDisappear();

		const rows = await this.waitForNotificationRows();
		const firstRow = rows[0];

		this.firstNotificationName = await this.getRowPrimaryText(firstRow);
		await this.clickNotificationRow(firstRow);
		await utils.waitForBusyIndicatorToDisappear();
	}
}

export default new NotificationsListPage();
