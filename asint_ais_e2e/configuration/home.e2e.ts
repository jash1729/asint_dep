// home.e2e.ts
import 'dotenv/config';
import HomePage from '../page_object_model/btp_applications_page/integrity/configuration/home.page';

describe('BTP - Home Page - Functional Test', () => {

    it('should wait for the last tile (HAZOP) to load and verify count', async () => {
        await HomePage.waitForHomePageToLoad();

        const tileCount = await HomePage.getTilesCount();
        console.log(`[INFO] Dashboard loaded with ${tileCount} tiles.`);
        expect(tileCount).toBeGreaterThan(0);
    });

    it('should verify critical tiles are present in the list', async () => {
        const tileNames = await HomePage.getAllTileNames();

        const expectedTiles = [
            'Asset Inspection',
            'Configurations',
            'HAZOP'
        ];

        for (const tile of expectedTiles) {
            expect(tileNames).toContain(tile);
        }
    });
});