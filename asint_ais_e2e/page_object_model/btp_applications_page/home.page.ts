// Home.page.ts
import { $, $$, browser } from '@wdio/globals';
import utils from '../../utils/utils';
class HomePage {

    private readonly tilesContainer ='ul.sapUshellTilesContainer-sortable';

    private readonly tileSelector ='ul.sapUshellTilesContainer-sortable li a.sapMGT';
    private get equipmentIframe() {
        return $('iframe[data-help-id="application-equipment-manage"]');
    }
    // EQUIPMENT APP
    get homeIcon() { return $('//div[contains(@class, "sapUshellAppTitle")]//span[text()="Home"]');}
    
    private get equipmentTile() { 
        return $("//a[contains(@aria-label, 'Equipment')]"); 
    }
    async verifyOnHomePage(): Promise<boolean> {
        try {
            await this.homeIcon.waitForDisplayed({ timeout: 30000 });
            return true;
        } catch {
            return false;
        }
    }
    async navigateToEquipment(): Promise<void> {
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickWithWait(this.equipmentTile);
            await utils.waitForBusyIndicatorToDisappear();
    }
    
    async clickEquipmentTile(): Promise<void> {
        await utils.waitForSAPPopupAndClose();
        await this.navigateToEquipment();
        await utils.waitForSAPPopupAndClose();
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.equipmentIframe);
        await utils.waitForSAPPopupAndClose();
        console.log("Navigated to Equipment List View");
        await browser.pause(2000);
    }                              

    async waitForHomePageToLoad(): Promise<void> {
    const firstTile = $(this.tileSelector);

    await firstTile.waitForExist({
        timeout: 30000,
        timeoutMsg: 'Home page tiles did not load'
    });
}


    async getAllTiles() {
        return await $$(this.tileSelector);
    }

    async getTilesCount(): Promise<number> {
        const tiles = await this.getAllTiles();
        return tiles.length;
    }

    async getAllTileNames(): Promise<string[]> {
        const tiles = await this.getAllTiles();
        const names: string[] = [];

        for (const tile of tiles) {
            const ariaLabel = await tile.getAttribute('aria-label');
            if (ariaLabel) {
                names.push(ariaLabel.split('\n')[0].trim());
            }
        }

        return names;
    }

    async getTileByName(tileName: string) {
        const tile = await $(
            `//a[contains(@aria-label,'${tileName}')]`
        );

        await tile.waitForExist({
            timeout: 20000,
            timeoutMsg: `Tile with name "${tileName}" not found`
        });

        return tile;
    }

    async clickTile(tileName: string): Promise<void> {
        const tile = await this.getTileByName(tileName);
        await tile.scrollIntoView();
        await browser.pause(1000); 
        await tile.waitForClickable({ timeout: 15000 });
        await browser.execute(el => el.click(), tile);
    }

    async isTileVisible(tileName: string): Promise<boolean> {
        try {
            const tile = await this.getTileByName(tileName);
            return await tile.isDisplayed();
        } catch {
            return false;
        }
    }
}

export default new HomePage();
