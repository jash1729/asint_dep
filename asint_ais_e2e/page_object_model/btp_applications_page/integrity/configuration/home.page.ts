// Home.page.ts
import { $, $$, browser } from '@wdio/globals';

class HomePage {

    /* =========================
       SELECTORS
    ========================== */

    private readonly tilesContainer =
        'ul.sapUshellTilesContainer-sortable';

    private readonly tileSelector =
        'ul.sapUshellTilesContainer-sortable li a.sapMGT';

    /* =========================
       PAGE LOAD
    ========================== */

    async waitForHomePageToLoad(): Promise<void> {
    const firstTile = $(this.tileSelector);

    await firstTile.waitForExist({
        timeout: 30000,
        timeoutMsg: 'Home page tiles did not load'
    });
}


    /* =========================
       GETTERS
    ========================== */

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

    /* =========================
       ACTIONS
    ========================== */

    async clickTile(tileName: string): Promise<void> {
        const tile = await this.getTileByName(tileName);
        await tile.scrollIntoView();
        await tile.waitForClickable({ timeout: 15000 });
        await browser.execute(el => el.click(), tile);
    }

    /* =========================
       VERIFICATIONS
    ========================== */

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
