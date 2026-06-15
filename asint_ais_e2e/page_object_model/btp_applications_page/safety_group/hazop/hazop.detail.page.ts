import { safetydata } from 'test_data/btp_applications/safety.data';
import utils from '../../../../utils/utils';
import * as console from 'console';

class safetyHAZOPDetailView {

    private get addDeviation() { return $("//button[@title='Add Deviation']"); }
    private get addParameter() { return $("(//input[@aria-haspopup='listbox'])[1]//following-sibling::div"); }
    private get addGuidedWord() { return $("//input[@aria-roledescription='Multi Value Combo Box']//following-sibling::div"); }
    private get createDeviationBtn() { return $("//div[contains(@class,'sapMDialog')]//button[.//bdi='Create']"); }
    private get OKbTN() { return $("//bdi[text()='OK']"); }
    private get landonNodeInfo() { return $("//span[@aria-label='goal']"); }
    private get navigateTechObjs() { return $("//bdi[text()='Technical Objects']"); }
    private get assignTechObjs() { return $("//bdi[text()='Assign']"); }
    private get selectAllTechObjs() { return $("(//th[@aria-label='Selection']//div[@role='checkbox' and @title='Select All' and not(contains(@style,'display: none'))])[1]"); }
    private get searchTechObjs() { return $("(//input[@type='search' and @aria-label='Search' and not(ancestor::*[@aria-hidden='true'])])[1]"); }
    private get confirmTechObjs() { return $("//bdi[text() = 'Confirm']"); }
    private get teamMemTab() { return $("(//bdi[text() = 'Team Members'])[2]"); }
    private get addTeamMem() { return $("(//bdi[text() = 'Add Role'])[2]"); }
    private get addRolesHzLead() { return $("//div[text()='HAZOP Lead']"); }
    private get addRolesHzFacilitator() { return $("//div[text()='HAZOP Facilitator']"); }
    private get selectsearchedTeamMem() { return $("(//tr[contains(@class,'sapMLIB')][1]//div[@role='checkbox' and @tabindex='0'])[1]"); }
    private get searchtemMem() { return $("//form[contains(@id,'idUsersSearchField')]//input[@type='search']"); }
    private get saveTeamMem() { return $("//button[.//bdi[text()='Save'] and following-sibling::button[.//bdi[text()='Cancel']] and preceding-sibling::button[.//bdi[text()='Add Role']]]"); }
    private get expandCollapseNode() { return $("//span[@title='Expand/Collapse Node']"); }
    private get addCauseBtn() { return $("(//button[@title='Add Cause' and @class='sapMBtnBase sapMBtn'])[1]"); }
    private get addCauseField() { return $("//div[contains(@class,'sapMDialog')]//textarea[@rows='1']"); }
    private get causeLD() { return $("//div[contains(@class,'sapMDialog')]//textarea[@rows='2']"); }
    private get createBtn() { return $("(//bdi[text() = 'Create'])[1]"); }
    private get addRolesSME() { return $("//div[text()='Subject Matter Expert']"); }
    private get createAssemtBtn() { return $("//bdi[text()='Create Assessment']"); }
    private get nodeNumfield() { return $("//textarea[@id='__area0-inner']"); }
    private get nodeSDes() { return $("//textarea[@id='__area1-inner']"); }
    private get nodeLDes() { return $("//textarea[@id='__area2-inner']"); }
    private get createNodeBtn() { return $("//bdi[text() = 'Create']"); }
    private get OKButton() { return $("//bdi[text()='OK']"); }
    private get navtoNode() { return $("(//tr[@aria-rowindex='2']//span[@title='Navigation' and @aria-hidden='true'])[3]"); }
    private get landonCauseConseScreen() { return $("(//span[text()='Temperature_Less'])[1]"); }
    private get frame(): any { return $("iframe[data-help-id='application-hazop-manage']"); }
    private get addConseBtn(): any { return $("(//button[.//span[contains(text(),'Add Consequence')]])[1]"); }
    private get addConsefield(): any { return $("//textarea[@aria-required='true' and contains(@id,'inner')]"); }
    private get addConseLD(): any { return $("(//textarea[contains(@aria-labelledby,'label')])[2]"); }
    private get conseDrpdwn(): any { return $("(//span[@title='Expand/Collapse Node' and @role='button'])[2]"); }
    private get landonConsePg(): any { return $("(//span[text()='AutomationConsequence'])[1]"); }
    private get addunmitigatedRiskbtn(): any { return $("(//button[contains(@class,'sapMBtnBase sapMBtn') and @title='Add'])[2]"); }
    private get severityFld(): any { return $("//input[@placeholder='Select Severity']"); }
    private get severityFld2(): any { return $("(//input[@placeholder='Select Severity'])[2]"); }
    private get severityFld3(): any { return $("(//input[@placeholder='Select Severity'])[3]"); }
    private get severityFld4(): any { return $("(//input[@placeholder='Select Severity'])[4]"); }
    private get severityFld5(): any { return $("(//input[@placeholder='Select Severity'])[5]"); }
    private get severityFld6(): any { return $("(//input[@placeholder='Select Severity'])[6]"); }
    private get likelihoodFld4(): any { return $("(//input[@placeholder='Select Likelihood'])[4]"); }
    private get likelihoodFld5(): any { return $("(//input[@placeholder='Select Likelihood'])[5]"); }
    private get likelihoodFld6(): any { return $("(//input[@placeholder='Select Likelihood'])[6]"); }
    private get likelihoodFld(): any { return $("//input[@placeholder='Select Likelihood']"); }
    private get likelihoodFld2(): any { return $("(//input[@placeholder='Select Likelihood'])[2]"); }
    private get likelihoodFld3(): any { return $("(//input[@placeholder='Select Likelihood'])[3]"); }
    private get impactFld(): any { return $("//input[@placeholder='Select Impact']"); }
    private get impactFld2(): any { return $("(//input[@placeholder='Select Impact'])[2]"); }
    private get impactFld3(): any { return $("(//input[@placeholder='Select Impact'])[3]"); }
    private get saveUnmitigatedrisk(): any { return $("(//bdi[text()='Save'])[1]"); }
    private get addBarrierBtn(): any { return $("//button[@aria-label='Add Barrier']"); }
    private get barrierdesc(): any { return $("//textarea[@rows='1']"); }
    private get barrierType(): any { return $("//input[@placeholder='Select Barrier Type']"); }
    private get barrierDiscipline(): any { return $("//input[@placeholder='Select Discipline']"); }
    private get barrierRemarks(): any { return $("//textarea[@rows='3']"); }
    private get editMitigatedRisk(): any { return $("//h2[.//text()='Mitigated Risk']/following::button[.//text()='Edit']"); }
    private get riskComments(): any { return $("//textarea[@rows='6']"); }
    private get saveBarrier(): any { return $("(//bdi[text()='Save'])[1]"); }
    private get addRecomm(): any { return $("(//button[@title='Add'])[2]"); }
    private get objectTypeRecomm(): any { return $("(//input[contains(@id,'idRecommendation')])[1]"); }
    private get sdofRecomm(): any { return $("//textarea[@rows='1']"); }
    private get ldofRecomm(): any { return $("//textarea[@rows='3']"); }
    private get recommSubtype(): any { return $("(//input[@role='combobox' and @aria-autocomplete='both'])[2]"); }
    private get dueDaterecomm(): any { return $("//input[@placeholder='e.g. 31 Dec, 2026']"); }
    private get saveRecomm(): any { return $("//bdi[text()='Save']"); }
    private get toggleBtnNeg(): any { return $("//div[.//text()='Mark as Ready']/following::div[@role='switch' and @aria-checked='false']"); }
    private get toggleBtnPos(): any { return $("//div[.//text()='Mark as Ready']/following::div[@role='switch' and @aria-checked='true']"); }
    private get toggleYES(): any { return $("//bdi[text()='Yes']"); }
    private get navBack(): any { return $("//a[@aria-label='Back']"); }
    private get publishBtn(): any { return $("//bdi[text()='Publish']"); }
    private get selectRecommforPublish(): any { return $("//footer[.//text()='Publish']/preceding::div[@aria-label='Select all rows' and @tabindex='0']"); }
    private get publishDrpdwn(): any { return $("(//button[.//bdi[text()='Publish']])[1]"); }
    private get convertToAPMrecomm(): any { return $("//li[.//text()='Convert to APM Recommendation']"); }
    public assessmentID!: string;

    public async publishHazop(): Promise<void> {
        console.log("Publishing Hazop...")
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.frame);
        await this.navtoNode.waitForDisplayed({timeout:30000});
        await utils.clickWithWait(this.publishBtn);
        const checkMark = await $("//header[.//text()='Confirmation']/following::button[.//text()='Yes']");
        if(await checkMark.waitForExist() && await checkMark.isDisplayed())
        {
            await utils.clickWithWait(checkMark);
        }
        const noOfRec = await $("//footer[.//text()='Publish']/preceding::h1//span");
        const val = await utils.getAssignedValue(await noOfRec.getText());
        if(val === 0)
        {
            await utils.clickWithWait(this.publishDrpdwn);
            await utils.waitForBusyIndicatorToDisappear();
            const succMsg = await browser.waitUntil(async () => {
                const el = await $("//span[contains(.,'HAZOP Study Published Successfully')]");
                if (!(await el.isExisting())) return false;
                const txt = (await el.getText()) || (await el.getAttribute("innerText"));
                return txt?.trim() ? el : false;
            }, { timeout: 300000 });
            await succMsg.waitForDisplayed({ timeout: 30000 });
            console.log("Succcess message displayed for HAZOP publish");
            await utils.clickWithWait($("//header[.//text()='Success']/following::button[.//text()='OK']"));
            console.log("checking if HAZOP published successfully");
            console.log("Checking header of Hazop for published")
            const headerPublish = await $("//header[.//text()='Published']");
            await headerPublish.waitForExist({timeout : 30000});
            console.log("HAZOP has been published successfully");
        }
        else
        {
            await utils.clickWithWait(this.selectRecommforPublish);
            await utils.clickWithWait(this.publishDrpdwn);
            await browser.keys(['ArrowDown']);
            await browser.keys(['Enter']);
            console.log("Checking if recommendation of workbench is created...")
            await utils.clickWithWait($("//header[.//text()='Success']/following::button[.//text()='OK']"));
            console.log("Recommendation of workbench is created")
            await utils.waitForBusyIndicatorToDisappear();
            const succMsg = await browser.waitUntil(async () => {
                const el = await $("//span[contains(.,'HAZOP Study Published Successfully')]");
                if (!(await el.isExisting())) return false;
                const txt = (await el.getText()) || (await el.getAttribute("innerText"));
                return txt?.trim() ? el : false;
            }, { timeout: 300000 });
            await succMsg.waitForDisplayed({ timeout: 30000 });
            console.log("Success message displayed for HAZOP publish");
            await utils.clickWithWait($("//header[.//text()='Success']/following::button[.//text()='OK']"));
            console.log("checking if HAZOP published successfully");
            console.log("Checking header of Hazop for published")
            const headerPublish = await $("//header[.//text()='Published']");
            await headerPublish.waitForExist({timeout : 30000});
            console.log("HAZOP has been published successfully");
        }
    }

    public async addDeviationInAssesment()
    {
        console.log("Adding deviation...");
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.frame);
        await utils.clickWithWait(this.addDeviation);
        await utils.clickWithWait(this.addParameter);
        const paraOption = await browser.waitUntil(async () => {
            const els = await $$("//ul[@role='listbox']//li[4]");
            if (!els.length) return false;
            const txt = (await els[0].getText()).trim();
            return txt ? els[0] : false;
        }, { timeout: 30000 });
        const selectedParameter = (await paraOption.getText()).trim();
        await paraOption.click();
        await utils.clickWithWait(this.addGuidedWord);
        const guideOption = await browser.waitUntil(async () => {
            const els = await $$("(//ul[@role='listbox' and @aria-multiselectable='true']//li[3])");
            if (!els.length) return false;
            const txt = (await els[0].getText()).trim();
            return txt ? els[0] : false;
        }, { timeout: 30000 });
        const selectedGuideWord = (await guideOption.getText()).trim();
        await guideOption.click();
        await utils.clickWithWait(this.createBtn);
        await utils.clickWithWait(this.OKbTN);
        await utils.clickWithWait(this.expandCollapseNode);
        const expectedNode = `${selectedParameter}_${selectedGuideWord}`;
        const actualNode = await browser.waitUntil(async () => {
        const els = await $$(`//span[normalize-space()='${expectedNode}']`);
            if (!els.length) return false;
            const txt = (await els[0].getText()) || (await els[0].getAttribute("innerText"));
            return txt?.trim() ? els[0] : false;
        }, { timeout: 30000 });

        const actualText = ((await actualNode.getText()) || (await actualNode.getAttribute("innerText")) || "").trim();

        expect(actualText).toBe(expectedNode);
        console.log("Deviation Added");
    }

    public async addCause(){
        console.log("Adding cause...");
        await utils.switchToIframe(this.frame);
        await utils.clickWithWait(this.addCauseBtn,2000);
        await utils.clickWithWait(this.addCauseField,2000);
        await utils.setValueWithWait(this.addCauseField, safetydata.createHAZOP.cause);
        await utils.clickWithWait(this.causeLD);
        await utils.setValueWithWait(this.causeLD, safetydata.createHAZOP.causeld);
        await utils.clickWithWait(this.createBtn);
        await utils.clickWithWait(this.OKbTN);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Cause Added");
    }

    public async addConsequence()
    {
        console.log("Navigating to detail of deviation");
        const deviationDetail = await $("//tr[@aria-rowindex='2' and @title]//td");
        await utils.clickWithWait(deviationDetail);
        console.log("Adding consequence...");
        await utils.switchToIframe(this.frame);
        await utils.clickWithWait(this.addConseBtn,2000);
        await utils.clickWithWait(this.addConsefield,2000);
        await utils.setValueWithWait(this.addConsefield, safetydata.createHAZOP.conse);
        await utils.clickWithWait(this.addConseLD,2000);
        await utils.setValueWithWait(this.addConseLD, safetydata.createHAZOP.conseLD);
        await utils.clickWithWait(this.createBtn);
        await utils.clickWithWait(this.OKbTN);
        await utils.waitForBusyIndicatorToDisappear();

        await utils.switchToIframe(this.frame);
        await utils.clickWithWait(this.conseDrpdwn,2000);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.landonConsePg,2000);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Consequence added");
    }

    public async verifyUnmitigatedRiskValues(expectedImpacts: string[]) {
        console.log("Checking if added unmitigated risk are reflecting in migigated risk...");
        const xpath = "//table[@aria-colcount='3']//tbody/tr/td[@aria-colindex='1']//input";

        await browser.waitUntil(async () => await ($$(xpath)).length >= expectedImpacts.length);

        const elements = await $$(xpath);
        const actualValues: string[] = [];

        for (const el of elements) {
            actualValues.push(await el.getValue());
        }

        for (const expected of expectedImpacts) {
            expect(actualValues).toContain(expected);
        }
        console.log("Unmitigated risk are reflecting in mitigated risk");
    }

    public async addDetailsOfConsequence()
    {
        console.log("Adding details for consequence");
        console.log("Adding Unmitigated Risk details...");
        let addedRiskCount = 0;
        const addedImpacts: string[] = [];
        await utils.clickWithWait(this.addunmitigatedRiskbtn,3000);
        addedRiskCount++;
        await utils.clickWithWait(this.impactFld,3000);
        await utils.setValueWithWait(this.impactFld,safetydata.createHAZOP.impact1);
        addedImpacts.push(safetydata.createHAZOP.impact1);
        await browser.keys('Enter');
        await utils.clickWithWait(this.severityFld,3000);
        await utils.setValueWithWait(this.severityFld,safetydata.createHAZOP.severity1);
        await browser.keys('Enter');
        await utils.clickWithWait(this.likelihoodFld,3000);
        await utils.setValueWithWait(this.likelihoodFld,safetydata.createHAZOP.likelihood1);
        await browser.keys('Enter');
        await utils.clickWithWait(this.addunmitigatedRiskbtn,3000);
        addedRiskCount++;
        await utils.clickWithWait(this.impactFld2,3000);
        await utils.setValueWithWait(this.impactFld2,safetydata.createHAZOP.impact2);
        addedImpacts.push(safetydata.createHAZOP.impact2);
        await browser.keys('Enter');
        await utils.clickWithWait(this.severityFld2,3000);
        await utils.setValueWithWait(this.severityFld2,safetydata.createHAZOP.severity2);
        await browser.keys('Enter');
        await utils.clickWithWait(this.likelihoodFld2,3000);
        await utils.setValueWithWait(this.likelihoodFld2,safetydata.createHAZOP.likelihood2);
        await browser.keys('Enter');
        await utils.clickWithWait(this.addunmitigatedRiskbtn,3000);
        addedRiskCount++;
        await utils.clickWithWait(this.impactFld3,3000);
        await utils.setValueWithWait(this.impactFld3,safetydata.createHAZOP.impact3);
        addedImpacts.push(safetydata.createHAZOP.impact3);
        await browser.keys('Enter');
        await utils.clickWithWait(this.severityFld3,3000);
        await utils.setValueWithWait(this.severityFld3,safetydata.createHAZOP.severity3);
        await browser.keys('Enter');
        await utils.clickWithWait(this.likelihoodFld3,3000);
        await utils.setValueWithWait(this.likelihoodFld3,safetydata.createHAZOP.likelihood3);
        await browser.keys('Enter');
        await utils.clickWithWait(this.saveUnmitigatedrisk,3000);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.OKbTN,3000);
        await utils.waitForBusyIndicatorToDisappear();
        await this.verifyUnmitigatedRiskValues(addedImpacts);
        console.log("Unmitigated Risk details added");

        console.log("Adding Barrier details...");
        await utils.clickWithWait(this.addBarrierBtn,2000);
        await utils.switchToIframe(this.frame);
        await utils.clickWithWait(this.barrierdesc,8000);
        await utils.setValueWithWait(this.barrierdesc,safetydata.createHAZOP.barrierdes);
        await utils.clickWithWait(this.barrierType,2000);
        await utils.setValueWithWait(this.barrierType,safetydata.createHAZOP.barriertype);
        await browser.keys('Enter');
        await utils.clickWithWait(this.barrierDiscipline,2000);
        await utils.setValueWithWait(this.barrierDiscipline,safetydata.createHAZOP.barrierDiscipline);
        await browser.keys('Enter');
        await utils.clickWithWait(this.barrierRemarks,2000);
        await utils.setValueWithWait(this.barrierRemarks,safetydata.createHAZOP.barrierRemarks);
        await utils.clickWithWait(this.saveBarrier,2000);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.OKbTN,1000);
        console.log("Barrier details added");

        console.log("Adding Mitigated Risk details...");
        await utils.clickWithWait(this.editMitigatedRisk,2000);
        await utils.clickWithWait(this.severityFld4,2000);
        await utils.setValueWithWait(this.severityFld4,safetydata.createHAZOP.severity3);
        await utils.clickWithWait(this.severityFld5,2000);
        await utils.setValueWithWait(this.severityFld5,safetydata.createHAZOP.severity2);
        await utils.clickWithWait(this.severityFld6,2000);
        await utils.setValueWithWait(this.severityFld6,safetydata.createHAZOP.severity1);
        await utils.clickWithWait(this.likelihoodFld4,2000);
        await utils.setValueWithWait(this.likelihoodFld4,safetydata.createHAZOP.likelihood3);
        await utils.clickWithWait(this.likelihoodFld5,2000);
        await utils.setValueWithWait(this.likelihoodFld5,safetydata.createHAZOP.likelihood2);
        await utils.clickWithWait(this.likelihoodFld6,2000);
        await utils.setValueWithWait(this.likelihoodFld6,safetydata.createHAZOP.likelihood1);
        await utils.clickWithWait(this.saveUnmitigatedrisk);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.OKbTN);
        console.log("Added Mitigated Risk details");

        console.log("Adding Risk Comments...");
        await utils.clickWithWait(this.riskComments,2000);
        await utils.setValueWithWait(this.riskComments, safetydata.createHAZOP.barrierRemarks);
        await utils.clickWithWait(this.saveUnmitigatedrisk);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.OKbTN);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Risk Comments added");

        await this.runOnlyOnMonWed(async () => {
        console.log("Adding Recommendations...");
        await utils.clickWithWait(this.addRecomm);
        await utils.clickWithWait(this.objectTypeRecomm,2000);
        await utils.setValueWithWait(this.objectTypeRecomm,safetydata.createHAZOP.objtypeRecomm);
        await browser.keys('Enter');
        await utils.clickWithWait(this.sdofRecomm,2000);
        await utils.setValueWithWait(this.sdofRecomm,safetydata.createHAZOP.sdOfRecomme);
        await utils.clickWithWait(this.ldofRecomm,2000);
        await utils.setValueWithWait(this.ldofRecomm,safetydata.createHAZOP.LdofRecomme);
        await utils.clickWithWait(this.recommSubtype,2000);
        await utils.setValueWithWait(this.recommSubtype,safetydata.createHAZOP.recommSubType);
        await browser.keys('Enter');
        await utils.clickWithWait(this.barrierDiscipline,2000);
        await utils.setValueWithWait(this.barrierDiscipline,safetydata.createHAZOP.barrierDiscipline);
        await browser.keys('Enter');
        await utils.clickWithWait(this.dueDaterecomm,2000);
        await utils.setValueWithWait(this.dueDaterecomm,safetydata.createHAZOP.hzenddate);
        await utils.clickWithWait(this.saveRecomm,2000);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.OKbTN,2000);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Recommendations added");
        });
        console.log("Details entered in Consequence");
    }

    public async runOnlyOnMonWed(task: () => Promise<void>) {
        const day = new Date().getDay(); // 0=Sun,1=Mon,...6=Sat
        if (day === 1 || day === 3) {
            await task();
        }else {
            console.log("Skipping Recommendations (runs only Mon & Wed)");
        }
    }

    public async completeConsequence()
    {
        console.log("Completing Consequences...");
        console.log("Clicking markas ready button...")
        await utils.clickWithWait(this.toggleBtnNeg,2000);
        await utils.clickWithWait(this.toggleYES,2000);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.OKbTN,2000);
        console.log("Toggled as Ready");
        await this.toggleBtnPos.waitForExist({timeout : 30000});
        await utils.waitForBusyIndicatorToDisappear();
        await browser.switchFrame(null);
        console.log("navigating back to the list page of assessments");
        await this.navBack.waitForExist({ timeout: 90000 });
        await this.navBack.waitForDisplayed({ timeout: 90000 });
        await this.navBack.waitForClickable({ timeout: 90000 });
        await this.navBack.click();
        await browser.pause(5000);
        console.log("Consequence Completed");
    }

    public async createAssessment()
    {
        console.log("Creating Assessment...");
        await utils.clickWithWait(this.createAssemtBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.nodeNumfield);
        await utils.setValueWithWait(this.nodeNumfield,safetydata.createHAZOP.nodeNumName);
        console.log("Node Enterted");
        await utils.clickWithWait(this.nodeSDes);
        await utils.setValueWithWait(this.nodeSDes,safetydata.createHAZOP.nodeSD);
        console.log("Node Desc Enterted");
        await utils.clickWithWait(this.nodeLDes);
        await utils.setValueWithWait(this.nodeLDes,safetydata.createHAZOP.nodeLD);
        console.log("Node Long Desc Enterted");
        console.log("Clicking create button");
        await utils.clickWithWait(this.createNodeBtn);
        console.log("Create button clicked");
        console.log("Clicking Ok button");
        await utils.clickWithWait(this.OKButton);
        console.log("Ok button clicked");
        console.log("Assesment created");
        console.log("Capturing assessmnet Id");
        const assessmentID = await $("//h1[.='Assessments']/following::tr[.//*[contains(.,'HZAS')]]//td[3]//span");
        this.assessmentID = (
            (await assessmentID.getText()) ||
            (await assessmentID.getAttribute("innerText")) ||
            ""
        ).trim();
        console.log("Assessment Created with Id -> "+this.assessmentID);
        const searchAssID = await $("//h1[.='Assessments']/following::input[@placeholder='Search']");
        await utils.setValueWithWait(searchAssID,this.assessmentID);
        await browser.keys('Enter');
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Searching Assessent...");
        await this.navtoNode.waitForDisplayed({timeout:30000});
        console.log("Assessment searched");
        console.log("Navigating to Node ")
        await utils.switchToIframe(this.frame);
        await utils.clickWithWait(this.navtoNode);
        await utils.waitForBusyIndicatorToDisappear();
        const hazopAssID = await $(`//tbody//tr[@title]//span[text()='${this.assessmentID}']`);
        await hazopAssID.waitForDisplayed({timeout:30000});
        console.log("Navigate to Assessment detail page");
    }
}
export default new safetyHAZOPDetailView  ();
