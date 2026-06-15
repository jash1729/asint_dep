import utils from "utils/utils";

class CML_Detail_Page{

    private get CMLIframe() { return $('iframe[data-help-id="application-cml-manage"]'); }
    private get noOfCml() { return $("//h2//span[contains(text(),'CMLs')]"); }

    public async verifyCmlInSummary()
    {
        await utils.switchToIframe(this.CMLIframe);
        await browser.pause(3000);
        const cmlText = await this.noOfCml.getText();
        const noOfCMLs = await utils.getAssignedValue(cmlText);
        console.log("No of CMLs present is/are :"+noOfCMLs);
        if(noOfCMLs === 0)
        {

        }
        else
        {
            await this.verifyCMLSection();
        }

    }

    public async verifyCMLSection()
    {
        console.log("Start: Verifying CML section of ASD"); 
        const table = await $("//div[@role='treegrid']");
        let prevCount = 0;
        while (true) {
            const rows = await $$("//tr[@role='row']");
            const currentCount = await rows.length;
            if (currentCount === prevCount) break;
            prevCount = currentCount;
            await browser.execute(el => {
                el.scrollTop = el.scrollHeight;
            }, table);
            await browser.pause(1000);
        }
        const techObjs = await $$("//td[@aria-colindex='2']//span[normalize-space()]");
        console.log("The technical objects assigned are:");
        for (let obj of techObjs) {
            const text = await obj.getText();
            if (text.trim() !== "") {
                console.log(text);
            }
        }
        const cmls = await $$("//td[@aria-colindex='3']//div[normalize-space()]");
        console.log("\n and the CMLs assigned are:");
        for (let cml of cmls) {
            const text = await cml.getText();
            if (text.trim() !== "") {
                console.log(text);
            }
        }
    }

}
export default new CML_Detail_Page();