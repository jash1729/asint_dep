import utils from '../../../../utils/utils';

class RNCTDetailPage {
    
    private get applicationFrame() { return $('//iframe[@title="Application"]'); }
    
    async verifyAdministrativeInformation() {
        console.log("Verifying Administrative Information");
        try {
            await browser.switchFrame(null);
            await browser.pause(1000);

            // try to find the application iframe by title first, fall back to scanning all iframes
            let frame = await $('//iframe[@title="Application"]');
            if (!(await frame.isExisting())) {
                const frames = await $$('//iframe');
                for (const f of frames) {
                    const title = (await f.getAttribute('title')) || '';
                    if (title && title.includes('Application')) { frame = f; break; }
                }
            }

            if (!(await frame.isExisting())) {
                throw new Error('Application iframe not found');
            }

            await utils.switchToIframe(frame);

            const extractField = async (labels: string[]): Promise<string> => {
                return await browser.execute((candidateLabels: string[]) => {
                    const normalized = (value: string) => value.replace(/\s+/g, ' ').trim();

                    const findValueAfterLabel = (label: string): string => {
                        const xpath = `//dt[contains(normalize-space(.), '${label}')]`;
                        const dt = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement | null;
                        if (!dt) return '';

                        let node: Element | null = dt.nextElementSibling;
                        while (node) {
                            const text = normalized(node.textContent || '');
                            if (text) return text;
                            node = node.nextElementSibling;
                        }

                        const following = document.evaluate(`${xpath}/following::*[normalize-space()][1]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement | null;
                        return normalized(following?.textContent || '');
                    };

                    for (const label of candidateLabels) {
                        const value = findValueAfterLabel(label);
                        if (value) return value;
                    }

                    return '';
                }, labels);
            };

            const createdBy = await extractField(['Created By']);
            const createdOn = await extractField(['Created On']);
            const changedBy = await extractField(['Changed By']);
            const changedOn = await extractField(['Changed On', 'Last Changed On', 'Modified On']);

            console.log(`Created By: ${createdBy || 'N/A'} | Created On: ${createdOn || 'N/A'} | Changed By: ${changedBy || 'N/A'} | Changed On: ${changedOn || 'N/A'}`);

            if (!createdBy && !createdOn && !changedBy && !changedOn) {
                throw new Error('No administrative information fields were found');
            }

            if (!changedOn) {
                console.warn('Changed On was not present on the page; continuing with the remaining administrative fields.');
            }
        } catch (err) {
            console.error('verifyAdministrativeInformation failed:', err);
            throw err;
        } finally {
            await browser.switchFrame(null);
        }
    }
    
    async editGeneralInformation(description: string, longDescription: string) {
        await console.log("Editing General Information with description:", description, "and longDescription:", longDescription);
        await utils.switchToIframe(this.applicationFrame);
        await browser.pause(2000);
        const editBtn = await $(`//div[text()='General Information']//following::bdi[text()='Edit'][1]`);
        await editBtn.waitForClickable({ timeout: 50000 });
        await editBtn.click();
        await browser.pause(1000);
        const descriptionInput = await $("//bdi[text()='Description']/following::textarea[1]");
        await descriptionInput.waitForDisplayed();
        await descriptionInput.setValue(description);
        await browser.pause(1000);
        const longDescriptionInput = await $("//bdi[text()='Long Description']/following::textarea[1]");
        await longDescriptionInput.setValue(longDescription);
        await browser.pause(1000);
        const saveBtn = await $("//div[text()='General Information']//following::bdi[text()='Save'][1]");
        await saveBtn.waitForClickable({ timeout: 50000 });
        await saveBtn.click();

        await utils.waitForBusyIndicatorToDisappear();

        const okBtn = await $("//span[text()='Success']/following::button[.//bdi[text()='OK']][1]");
        await okBtn.waitForClickable({ timeout: 50000 });
        await okBtn.click();
        await console.log("General Information edited successfully");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
    }
    async deleteTemplate() {
        await console.log("Deleting assessment");
        await utils.switchToIframe(this.applicationFrame);
        const deleteBtn = await $(`//button[.//bdi[normalize-space()='Manage']]`);
        await deleteBtn.waitForClickable({ timeout: 50000 });
        await deleteBtn.click();
        await browser.pause(1000);
        await browser.keys(['ArrowDown']);
        await browser.keys(['ArrowDown']);
        await browser.keys(['Enter']);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait($(`//button[.//bdi[normalize-space()='OK']]`));
        await utils.waitForBusyIndicatorToDisappear();
        const okBtn = await $("//span[text()='Success']/following::button[.//bdi[text()='OK']][1]");
        await okBtn.waitForClickable({ timeout: 50000 });
        await okBtn.click();
        await console.log("Assessment deleted successfully");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(3000);
    }
    
    async createImpact(title: string, description: string) {
        await console.log("Creating impact with title:", title);
        await browser.pause(3000);
        await utils.switchToIframe(this.applicationFrame);
        const impactSection = await $(`//bdi[text()="Impacts"]`);
        await impactSection.waitForDisplayed();
        await impactSection.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        const createBtn = await $(`//bdi[text()="Create"]`);
        await createBtn.waitForClickable({ timeout: 50000 });
        await createBtn.click();
        await browser.pause(1000);
        const descriptionInput = await $(`.//span[normalize-space()='Description']/following::input[1]`);
        await descriptionInput.setValue(title);
        await browser.pause(1000);
        const longTextInput = await $(`.//span[normalize-space()='Long Text']/following::textarea[1]`);
        await longTextInput.setValue("This is a long text for the impact: " + description);
        await browser.pause(1000);
        const categoryInput = await $(`.//span[@role="button" and @data-sap-ui-icon-content=""]`);
        await categoryInput.click();
        await browser.pause(1000);
        await browser.keys(['ArrowDown']);
        await browser.pause(1000);
        await browser.keys(['Enter']);
        await browser.pause(1000);
        const saveBtn = await $(`//button[.//bdi[normalize-space()='Save']]`);
        await saveBtn.waitForClickable({ timeout: 50000 });
        await saveBtn.click();
        await utils.waitForBusyIndicatorToDisappear();
        const okBtn = await $("//span[text()='Success']/following::button[.//bdi[text()='OK']][1]");
        await browser.pause(3000);
        if (await okBtn.isExisting()) {
            await okBtn.waitForClickable({ timeout: 50000 });
            await okBtn.click();
        }
        
        await console.log("Impact created successfully");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await utils.clickWithWait($(`//span[normalize-space()="${title}"]`));
        //await utils.clickWithWait($(`//div[.//span[text()='Health']]//button[@title="Edit"]`));
        await browser.pause(2000);
    }

    async addDimensionToImpact(impactTitle: string, dimensionTitle: string) {
        await console.log(`Adding dimension "${dimensionTitle}" to impact "${impactTitle}"`);
        // await utils.switchToIframe(this.applicationFrame);
        await browser.pause(2000);

        await utils.clickWithWait($(`//div[.//span[text()='Dimensions']]//button[.//bdi[text()='Edit']]`));
        await browser.pause(1000);

        await utils.clickWithWait($(`//div[.//span[text()='Dimensions']]//button[.//bdi[text()='Add Dimension']]`));
        await browser.pause(1000);
        await utils.clickWithWait($(`//div[.//span[text()='Dimensions']]//button[.//bdi[text()='Add Dimension']]`));
        await browser.pause(1000);

        // const expandBtn = await $("//button[@title='Expand/Collapse']");
        // await expandBtn.waitForClickable({ timeout: 50000 });
        // await expandBtn.click();
        // await browser.pause(1000);
        // const description = await $("//bdi[normalize-space()='Description']/following::input[@type='text'][1]");
        // await description.waitForDisplayed({ timeout: 50000 });
        // await description.setValue("Your Description");
        // await browser.pause(1000);
        // const longText = await $("//bdi[normalize-space()='Long Text']/following::textarea[1]");
        // await longText.waitForDisplayed({ timeout: 50000 });
        // await longText.setValue("Your long text here");
        // const addScaleBtn = await $("//button[.//bdi[normalize-space()='Add Scale Option']]");
        // await addScaleBtn.waitForClickable({ timeout: 50000 });
        // await addScaleBtn.click();
        // const increaseIcon = await $("//span[@aria-label='Increase']");
        // await increaseIcon.waitForClickable({ timeout: 50000 });
        // await increaseIcon.click();
        // await browser.pause(1000);
        // await increaseIcon.click();
        // await browser.pause(1000);
        // await increaseIcon.click();
        // await browser.pause(1000);
        // const okBtn = await $("//button[.//bdi[normalize-space()='Ok']]");
        // await okBtn.waitForClickable({ timeout: 50000 });
        // await okBtn.click();

        // for (let i = 1; i <= 3; i++) {

        //     await $(`(//input[@placeholder='Description'])[${i}]`)
        //         .setValue(`Desc${i}`);

        //     await $(`(//input[@placeholder='Enter a alpha numeric value'])[${i}]`)
        //         .setValue(`Val${i}`);
        // }
        const expandButtons = await $$("//button[@title='Expand/Collapse']");

        for (let d = 1; d <= 2; d++) {
            
            await browser.pause(1000);
            // Expand dimension
            const expandBtn = await $(`(//button[@title='Expand/Collapse'])[${d}]`);
            await expandBtn.scrollIntoView();
            await expandBtn.click();

            await browser.pause(1000);

            // Description
            const description = await $(`//span[text()='Dimension ${d}']/following::bdi[text()='Description'][1]/following::input[1]`);
            await description.waitForDisplayed({ timeout: 50000 });
            await description.setValue(`Description ${d}`);
            await browser.pause(1000);
            // Long Text
            const longText = await $(`//span[text()='Dimension ${d}']/following::bdi[text()='Long Text'][1]/following::textarea[1]`);
            await longText.waitForDisplayed({ timeout: 50000 });
            await longText.setValue(`Long Text ${d}`);
            await browser.pause(1000);
            // Add Scale Option
            const addScaleBtn = await $(`(//span[text()='Dimension ${d}']/following::button[.//bdi[normalize-space()='Add Scale Option']])[1]`);
            await addScaleBtn.scrollIntoView();
            await addScaleBtn.waitForClickable({ timeout: 50000 });
            await addScaleBtn.click();
            // Increase icon click 3 times
            for (let j = 0; j < 2; j++) {
            await browser.pause(1000);
                const increaseIcon = await $(`(//span[@aria-label='Increase'])`);

                await increaseIcon.waitForDisplayed();
                await browser.execute(el => el.click(), increaseIcon);

            }
            await browser.pause(500);

            // OK button
            const okBtn = await $("//button[.//bdi[normalize-space()='Ok']]");
            await okBtn.waitForClickable({ timeout: 50000 });
            await okBtn.click();
            await browser.pause(2000);
            // Fill 3 rows
            for (let i = ((d * 3) - 2); i <= ((d * 3)); i++) {
                console.log(`Filling values for Dimension ${d}, Row ${i}`);
                const descriptionInput = await $(`((//table//input[@placeholder='Description'])[position()])[${i}]`); 

                const valueInput = await $(`((//table//input[@placeholder='Enter a alpha numeric value'])[position()])[${i}]`);

                await descriptionInput.setValue(`Desc${d}-${i}`);
                await browser.pause(1000);
                const numericValue = i * 100;
                await valueInput.setValue(`${numericValue}`);
                console.log(`Filled Description: Desc${d}-${i} and Value: ${numericValue} for Dimension ${d}, Row ${i}`);
                await browser.pause(1000);
            }
            await browser.pause(1000);
        }

        console.log("All dimensions filled in, saving changes");
        await browser.pause(2000);


        const saveBtn = await $("//button[.//bdi[normalize-space()='Save']]");
        await saveBtn.waitForClickable({ timeout: 50000 });
        await saveBtn.click();

        const successOkBtn = await $("//span[text()='Success']/following::button[.//bdi[text()='OK']][1]");
        await successOkBtn.waitForClickable({ timeout: 50000 });
        await successOkBtn.click();
        console.log("Dimension added successfully");
        await utils.waitForBusyIndicatorToDisappear();
            
    }
    async verifyThresholdSection() {
        await console.log("Verifying Thresholds section");
        await browser.pause(2000);
        await utils.switchToIframe(this.applicationFrame);
        const thresholdsSection = await $(`//bdi[text()="Threshold"]`);
        await thresholdsSection.waitForDisplayed();
        await thresholdsSection.click();
        await browser.pause(2000);
        await utils.waitForBusyIndicatorToDisappear();
        const riskMatrixSvg = await $("//*[name()='svg' and @role='img']");

        await riskMatrixSvg.waitForDisplayed({ timeout: 50000 });

        expect(await riskMatrixSvg.isDisplayed()).toBe(true);

        console.log("Risk Matrix SVG is displayed");

        const rows = await $$("(//span[normalize-space()='Define Threshold:']/following::table[@role='grid'])[1]//tbody/tr");

        for (let i = 0; i < rows.length; i++) {

            const cell = await rows[i].$(".//td[@aria-colindex='1']//span");

            console.log(`Row ${i + 1} :`, await cell.getText());
        }
    }


}
export default new RNCTDetailPage();