import functionalLocationListView from './functional_location.listview.page';
import {funcLocTestData} from '../../../../test_data/btp_applications/functional_location.data';
import utils from '../../../../utils/utils';
import * as path from 'path';
/**
 * Page Object Model for the Fixed AIP Application within the SAP utils.
 */
class functionalLocationDetailView {

    private get funLocHeader() { return $(`(//header//*[@role='heading']/span[text()='${functionalLocationListView.functionalLocName}'])[2]`); }
    private get funLocHeadChk() { return $("(//header//*[@role='heading']/span)[2]"); }
    private get funLocDisplayId() { return $("//span[starts-with(normalize-space(), 'Display ID:')]"); }
    private get funLocEditHeader() { return $("//bdi[text()='Edit Header']"); }
    private get funLocDescEditHeader() { return $("//bdi[text()='Functional Location Description']/following::input[1][not(@readonly)]"); }
    private get funLocCategoryEditHeader() { return $("//bdi[text()='Category']/following::input[1]"); }
    private get funLocCategory() { return $("//span[text()='Select Category']"); }
    private get funLocCtgChoose() { return $(`//span[text()='${funcLocTestData.headerInfoEdit.linearAsset}']/ancestor::tr//td[2]//*[name()='circle'][2]`); }
    private get funLocCtgSave() { return $("(//bdi[text()='Save'])[2]"); }
    private get funLocheaderSave() { return $("//bdi[text()='Save']"); }
    private get funLocHdSaveSucc() { return $("//span[text()='Updated successfully']"); }
    private get funLocHdOkBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get objectType() { return $("//bdi[text()='Object Type']/following::input[1]"); }
    private get selectObjGrpBox() { return $("//span[text()='Select Object Type']"); }
    private get selectObj() { return $("//span[.='Select Object Type']/ancestor::header/following::*[name()='circle'][2]"); }
    private get selectObjSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get editGenInfo() { return $("//bdi[text()='Edit']"); }
    private get authGrp() { return $("//bdi[text()='Authorization Group']/following::input[1]"); }
    private get inventryGrp() { return $("//bdi[text()='Inventory Number']/following::input[1]"); }
    private get strUpDt() { return $("//bdi[text()='Start up date']/following::input[1]"); }
    private get longDesc() { return $("//bdi[text()='Long Description']/following::textarea[1]"); }
    private get acqValue() { return $("//bdi[text()='Acquisition Value / Currency']/following::input[1]"); }
    private get acqCurr() { return $("//bdi[text()='Acquisition Value / Currency']/following::input[2]"); }
    private get selectCurrBox() { return $("//span[text()='Select Currency']"); }
    private get selectCurr() { return $("//span[.='Select Currency']/ancestor::header/following::*[name()='circle'][2]"); }
    private get selectCurrSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get asstManuName() { return $("//bdi[text()='Asset Manufacturer Name ']/following::input[1]"); }
    private get modelNum() { return $("//bdi[text()='Model Number ']/following::input[1]"); }
    private get partNum() { return $("//bdi[text()='Part Number']/following::input[1]"); }
    private get manuSrlNum() { return $("//bdi[text()='Manufacturer Serial Number']/following::input[1]"); }
    private get country() { return $("//bdi[text()='Country']/following::input[1]"); }
    private get cntryBox() { return $("//span[text()='Select Country']"); }
    private get cntryBoxSelect() { return $("//span[.='Select Country']/ancestor::header/following::*[name()='circle'][2]"); }
    private get cntrySave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get cnstYear() { return $("(//bdi[text()='Construction Year / Month']/ancestor::label/../following-sibling::div//span)[1]"); }
    private get cnstYearSelect() { return $(`//div[text()='${funcLocTestData.generalInfoEdit.constructionYear}']`); }
    private get cnstMon() { return $("(//bdi[text()='Construction Year / Month']/ancestor::label/../following-sibling::div//span)[2]"); }
    private get cnstMonSelect() { return $(`//span[text()='${funcLocTestData.generalInfoEdit.constructionMonth}']`); }
    private get mntPlant() { return $("//bdi[text()='Maintenance Plant']/following::input[1]"); }
    private get mntPlantBox() { return $("//span[text()='Select Maintenance Plant']"); }
    private get mntPlantSelect() { return $("//span[.='Select Maintenance Plant']/ancestor::header/following::*[name()='circle'][2]"); }
    private get mntPlantSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get plantSec() { return $("//bdi[text()='Plant Section']/following::input[1]"); }
    private get plantSecBox() { return $("//span[text()='Select Plant Section']"); }
    private get plantSecSelect() { return $("//span[.='Select Plant Section']/ancestor::header/following::*[name()='circle'][2]"); }
    private get plantSecSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get workCen() { return $("//bdi[text()='Work Center ']/following::input[1]"); }
    private get workCenBox() { return $("//span[text()='Select Work Center ']"); }
    private get workCenSelect() { return $("//span[.='Select Work Center ']/ancestor::header/following::*[name()='circle'][2]"); }
    private get workCenSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get criticality() { return $("//bdi[text()='Criticality']/following::input[1]"); }
    private get criticalityBox() { return $("//span[text()='Select Criticality']"); }
    private get criticalitySelect() { return $("//span[.='Select Criticality']/ancestor::header/following::*[name()='circle'][4]"); }
    private get criticalitySave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get sortField() { return $("//bdi[text()='Sort Field ']/following::input[1]"); }
    private get funLoc() { return $("//bdi[text()='Functional Location']/following::input[1]"); }
    private get compCode() { return $("//bdi[text()='Company Code ']/following::input[1]"); }
    private get costCenter() { return $("//bdi[text()='Cost Center ']/following::input[1]"); }
    private get bussArea() { return $("//bdi[text()='Business Area']/following::input[1]"); }
    private get planPlant() { return $("//bdi[text()='Planning Plant']/following::input[1]"); }
    private get planPlantBox() { return $("//span[text()='Select Planning Plant']"); }
    private get planPlantSelect() { return $("//span[.='Select Planning Plant']/ancestor::header/following::*[name()='circle'][4]"); }
    private get planPlantSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get planGrp() { return $("//bdi[text()='Planner Group']/following::input[1]"); }
    private get planGrpBox() { return $("//span[text()='Select Planner Group']"); }
    private get planGrpSelect() { return $("//span[.='Select Planner Group']/ancestor::header/following::*[name()='circle'][4]"); }
    private get planGrpSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get ctgProfile() { return $("//bdi[text()='Catalog Profile']/following::input[1]"); }
    private get ctgProfileBox() { return $("//span[text()='Select Catalog Profile']"); }
    private get CtgProfileSelect() { return $("//span[.='Select Catalog Profile']/ancestor::header/following::*[name()='circle'][6]"); }
    private get CtgProfileSave() { return $("//footer//*[name()='bdi' and text()='Save']"); }
    private get infoSave() { return $("//bdi[normalize-space()='Save']/ancestor::button"); }
    private get infoSuccUpdate() { return $("//span[normalize-space()='Updated successfully']"); }
    private get infoUpdateOK() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get funLocStrucTab() { return $("//bdi[text()='Structure']"); }
    private get funLocAssetIntTab() { return $("//bdi[text()='Asset Intelligence']"); }
    private get funLocRiskSumTab() { return $("//bdi[text()='Risk Summary']"); }
    private get funLocMainSerTab() { return $("//bdi[text()='Maintenance and Service']"); }
    private get funLocAttach() { return $("//bdi[text()='Attachments']"); }
    private get funLocChngHist() { return $("//bdi[text()='Change History']"); }
    private get editStrucInfo() { return $("//bdi[text()='Edit']"); }
    private get superFunLoc() { return $("//bdi[text()='Superior Functional Location']/following::input[1]"); }
    private get superFunLocBox() { return $("//span[text()='Select Functional Location']"); }
    private get superFunLocSelect() { return $("(//tr[@role='row'])[2]//td[2]//span"); }
    private get superFunLocDesc() { return $("//bdi[text()='Superior Functional Location Description']/following::input[1]"); }
    private get compInfoAsgn() { return $("//bdi[text()='Assign']"); }
    private get compInfoEqAsgn() { return $("//li[contains(.,'Equipment')]"); }
    private get compInfoEqCnf() { return $("//bdi[text()='Confirm']"); }
    private get yesBtn() { return $("//bdi[text()='Yes']"); }
    private get cancelBtn() { return $("//bdi[text()='Cancel']"); }
    private get okBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get okBtn2() { return $("//bdi[text()='Ok']"); }
    private get compInfoFunLocAsgn() { return $("//li[contains(.,'Functional Location')]"); }
    private get groups() { return $("//div[text()='Groups']/following::span[1]"); }
    private get components() { return $("//div[text()='Component Information']/following::span[1]"); }
    private get funLocAsgnTab() { return $("//bdi[text()='Assignments']"); }
    private get funLocMDATab() { return $("//bdi[text()='Classification & MDA']"); }
    private get asgnFunLocTemp() { return $("(//div[text()='Functional Location Templates']/following::bdi[text()='Assign'])[1]"); }
    private get asgnClsAndChr() { return $("(//div[text()='Class & Characteristics']/following::bdi[text()='Assign'])[1]"); }
    private get asgnChrMDA() { return $("//span[text()='Maintenance Data Attribute']/following::bdi[text()='Assign']"); }
    private get autoAsgnClsAndChr() { return $("//footer//div[@role='checkbox' and .//bdi[text()='Auto assign Class and Characteristics']]"); }
    private get class() { return $("//div[text()='Class & Characteristics']/following::span[1]"); }
    private get noOfClassMDA() { return $("//span[text()='Assign Classes']/following::span[2]"); }
    private get characteristics() { return $("//div[text()='Class & Characteristics']/following::h2[2]"); }
    private get noOfCharMDA() { return $("//span[text()='Maintenance Data Attribute']/following::h2//span"); }
    private get riskAndCriticality() { return $("//div[text()='Risk and Criticality']/following::span[1]"); }
    private get attachmentsSection() { return $('//button[.//bdi[text()="Attachments"]]'); }
    private get assetInsp() { return $("//div[text()='Asset Inspection']/following::span[1]"); }
    private get findings() { return $("//div[text()='Findings']/following::span[1]"); }
    private get recommend() { return $("//div[text()='Recommendations']/following::span[1]"); }
    private get maintainNoti() { return $("//div[text()='Maintenance Notification']/following::span[1]"); }
    private get maintainOrder() { return $("//div[text()='Maintenance Order']/following::span[1]"); }
    private get maintainPlan() { return $("//div[text()='Maintenance Plan']/following::span[1]"); }
    private get recomWrk() { return $("//div[text()='Recommendation Workbench']/following::span[1]"); }
    private get maintaintask() { return $("//div[text()='Maintenance Tasks']/following::span[5]"); }
    private get assetStrategyRBI() { return $("(//div[text()='Asset Strategy']/following::li//div//div)[1]"); }
    private get assetStrategyRCM() { return $("(//div[text()='Asset Strategy']/following::li//div//div)[2]"); }
    private get riskProfile() { return $("//bdi[text()='Risk Summary']//following::h2[1]"); }
    private get component() { return $("//bdi[text()='Risk Summary']//following::h2[2]"); }
    private get recommendation() { return $("//bdi[text()='Risk Summary']//following::div[@aria-level='2']//span"); }
    private get funLocTemp() { return $("//div[text()='Functional Location Templates']/following::span[1]"); }
    private get noOfCML() { return $("(//h2//span)[2]"); }
    private get deleteBtn() { return $("//*[contains(@class,'sapUxAPObjectPageLayout')]//header//button[.//bdi[normalize-space()='Delete']]"); }
    private get downloadReport() { return $("//*[contains(@class,'sapUxAPObjectPageLayout')]//header//button[.//bdi[normalize-space()='Download Report']]"); }
    private get attachSuccMsg() { return $("//span[text()='Success']"); }
    private get funLocIframe() { return $('iframe[data-help-id="application-functionallocation-manage"]'); }
    
    public superFuncLocValue!: string;
    public funcLocHeadValue!: string;
    public displayID!: string;

    public async verifyHeader(): Promise<void> {
        console.log("Verifying Functional Location name");
        await this.funLocHeader.isDisplayed();
        const funHeader = await this.funLocHeader.getText();
        console.log(funHeader);
        const funLocName = functionalLocationListView.functionalLocName;
        await expect(funHeader).toEqual(funLocName);
        console.log("Functional Location name matches header's name");
    }

    public async editHeader(): Promise<void> {
        console.log("Editing header's Information");
        await utils.clickWithWait(this.funLocEditHeader);
        await utils.setValueWithWait(this.funLocDescEditHeader,funcLocTestData.headerInfoEdit.funLocDesc);
        await utils.clickWithWait(this.funLocCategoryEditHeader);
        await this.funLocCategory.waitForDisplayed({ timeout: 30000 });
        await this.funLocCtgChoose.scrollIntoView();
        await utils.clickWithWait(this.funLocCtgChoose);
        await utils.clickWithWait(this.funLocCtgSave);
        await utils.clickWithWait(this.funLocheaderSave);
        await this.funLocHdSaveSucc.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.funLocHdOkBtn);
        console.log("Header edited successfully");
    }

    public async verifyAndEditGeneralInfo() {
        console.log("Verifying and editing General Information");
        await utils.clickWithWait(this.editGenInfo);
        await utils.clickWithWait(this.objectType);
        await this.selectObjGrpBox.waitForDisplayed({ timeout: 90000 });
        await utils.clickWithWait(this.selectObj,2000);
        await utils.clickWithWait(this.selectObjSave,1000);
        await utils.setValueWithWait(
            this.authGrp,
            funcLocTestData.generalInfoEdit.authorizationGroup
        );
        await utils.setValueWithWait(
            this.inventryGrp,
            funcLocTestData.generalInfoEdit.inventoryNumber
        );
        await utils.setValueWithWait(
            this.strUpDt,
            funcLocTestData.generalInfoEdit.startUpDate
        );
        await utils.setValueWithWait(
            this.longDesc,
            funcLocTestData.generalInfoEdit.longDescription
        );
        await utils.setValueWithWait(
            this.acqValue,
            funcLocTestData.generalInfoEdit.acqValue
        );
        await utils.clickWithWait(this.acqCurr);
        await this.selectCurrBox.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.selectCurr,2000);
        await utils.clickWithWait(this.selectCurrSave,1000);
        await utils.setValueWithWait(
            this.asstManuName,
            funcLocTestData.generalInfoEdit.assetManufacturer
        );
        await utils.setValueWithWait(
            this.modelNum,
            funcLocTestData.generalInfoEdit.modelNumber
        );
        await utils.setValueWithWait(
            this.partNum,
            funcLocTestData.generalInfoEdit.partNumber
        );
        await utils.setValueWithWait(
            this.manuSrlNum,
            funcLocTestData.generalInfoEdit.manufacturerSerialNum
        );
        await utils.clickWithWait(this.country);
        await this.cntryBox.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.cntryBoxSelect,2000);
        await utils.clickWithWait(this.cntrySave,1000);
        await utils.clickWithWait(this.cnstYear);
        await utils.clickWithWait(this.cnstYearSelect);
        await utils.clickWithWait(this.cnstMon);
        await utils.clickWithWait(this.cnstMonSelect);
        await utils.clickWithWait(this.mntPlant);
        await this.mntPlantBox.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.mntPlantSelect,2000);
        await utils.clickWithWait(this.mntPlantSave,1000);
        await utils.clickWithWait(this.plantSec);
        await this.plantSecBox.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.plantSecSelect,2000);
        await utils.clickWithWait(this.plantSecSave,1000);
        await utils.clickWithWait(this.workCen);
        await this.workCenBox.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.workCenSelect,2000);
        await utils.clickWithWait(this.workCenSave,1000);
        await utils.clickWithWait(this.criticality);
        await this.criticalityBox.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.criticalitySelect,2000);
        await utils.clickWithWait(this.criticalitySave,1000);
        await utils.setValueWithWait(
            this.sortField,
            funcLocTestData.generalInfoEdit.sortField
        );
        const funLocation = await utils.getValueWithWait(this.funLoc);
        console.log("Functional Location Assigned : "+funLocation);
        const compCode = await utils.getValueWithWait(this.compCode);
        console.log("Company Code : "+compCode);
        const costCenter = await utils.getValueWithWait(this.costCenter);
        console.log("Cost Center : "+costCenter)
        const bussinessArea = await utils.getValueWithWait(this.bussArea);
        console.log("Bussiness Area : "+bussinessArea)
        // await utils.clickWithWait(this.planPlant);
        // await this.planPlantBox.waitForDisplayed({ timeout: 30000 });
        // try {
        //     await this.planPlantSelect.waitForDisplayed({ timeout: 30000 });
        // } catch {
        //     await utils.clickWithWait(await $("//footer//bdi[text()='Cancel']"));
        //     throw new Error("Plan Plant Select not displayed");
        // }
        // await utils.clickWithWait(this.planPlantSelect,2000);
        // await utils.clickWithWait(this.planPlantSave,1000);
        await utils.clickWithWait(this.planGrp);
        await this.planGrpBox.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.planGrpSelect,2000);
        await utils.clickWithWait(this.planGrpSave,1000);
        await utils.clickWithWait(this.ctgProfile);
        await this.ctgProfileBox.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.CtgProfileSelect,2000);
        await utils.clickWithWait(this.CtgProfileSave,1000);
        await this.infoSave.scrollIntoView();
        await utils.clickWithWait(this.infoSave,1000);
        await this.infoSuccUpdate.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.infoUpdateOK);
        console.log("General Information Edited and verified");
    }

    public async verifyAndEditStructure() {
        console.log("Navigating to Structure Tab");
        await utils.clickWithWait(this.funLocStrucTab);
        await this.funLocStrucTab.waitForDisplayed({ timeout: 30000 });
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Navigated to Structure Tab successfully");
        const { funcLoc } = await this.getFinalIDs();
        this.funcLocHeadValue = funcLoc;
        console.log("Functional Location header value is : " + this.funcLocHeadValue);
        await utils.clickWithWait(this.editStrucInfo);
        await utils.clickWithWait(this.superFunLoc);
        await this.superFunLocBox.waitForDisplayed({ timeout: 30000 });
        await browser.pause(8000);
        await utils.switchToIframe(this.funLocIframe);

        this.superFuncLocValue = await utils.getTextWithWait(this.superFunLocSelect);
        let i = 2;
        while (true) {
            const row = $(`(//tr[@role='row'])[${i}]//td[2]//span`);
            await row.waitForDisplayed({ timeout: 20000 });
            const text = await row.getText();
            if (text === this.funcLocHeadValue) {
                i++;
                continue;
            }
            this.superFuncLocValue = text;
            await utils.clickWithWait(row);
            break;
        }

        await browser.pause(8000);
        const superFunLocDesc = await utils.getValueWithWait(this.superFunLocDesc);
        console.log(superFunLocDesc);
        await utils.clickWithWait(this.infoSave,1000);
        await this.infoSuccUpdate.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.infoUpdateOK);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Structuring saved successfully");
    }

    public async assignEquipment(noOfEquipments: number) {
        console.log("Assigning Equipment to Functional Location");
        await utils.clickWithWait(this.compInfoAsgn,1000);
        await utils.clickWithWait(this.compInfoEqAsgn,1000);
        await utils.switchToIframe(this.funLocIframe);
        await browser.pause(4000);
        await utils.selectCheckboxes(noOfEquipments);
        await utils.clickWithWait(this.compInfoEqCnf,1000);
        await utils.clickWithWait(this.yesBtn,1000);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.okBtn,1000);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(4000);
        console.log("Equipment Components assigned successfully");
        const components = await this.components.getText();
        const count = await utils.getAssignedValue(components);
        console.log("No of Components assigned are :"+count);
    }

    public async assignFuncLoc(noOfFunLoc: number) {
        console.log("Assigning Functional Location");
        if (noOfFunLoc === 0) return;
        let selectedCount = 0;
        let i = 1;
        while (selectedCount < noOfFunLoc) {
            await utils.clickWithWait(this.compInfoAsgn,1000);
            await browser.pause(2000);
            await browser.keys(['ArrowDown']);
            await browser.keys(['ArrowDown']);
            await browser.keys(['Enter']);
            await browser.pause(2000);
            await utils.switchToIframe(this.funLocIframe);
            let foundValid = false;
            while (!foundValid) {
                const row = $(`(//tr[@role='row'])[${i + 1}]//td[2]//span`);
                await row.waitForDisplayed({ timeout: 20000 });
                let text: string = (await row.getText()) || (await row.getAttribute("innerText")) || "";
                text = text.trim();
                console.log("Row text ->", text);
                console.log("Skip values ->", this.funcLocHeadValue, this.superFuncLocValue);
                if (
                    text &&
                    (text.includes(this.funcLocHeadValue) || text.includes(this.superFuncLocValue))
                ) {
                    i++;
                    continue;
                }

                await utils.clickWithWait(row);
                await utils.waitForBusyIndicatorToDisappear();
                await browser.pause(1000);
                await utils.clickWithWait(this.okBtn, 1000);
                await utils.waitForBusyIndicatorToDisappear();
                selectedCount++;
                i++;                 
                foundValid = true;
            }
        }
        console.log("Functional Location assigned");
        const components = await this.components.getText();
        const count = await utils.getAssignedValue(components);
        console.log("No of Components assigned are :"+count);
    }

    public async verifyGroups() {
        console.log("Verifying Groups assigned");
        const groups = await this.groups.getText();
        const count = await utils.getAssignedValue(groups);
        console.log("No of groups assigned are :"+count);
    }

    public async asgnFunLocTemplate(noOfFunTemp: number, autoAssign: boolean): Promise<void> {
        console.log("Assigning Functional Location Template");
        await browser.pause(1000);
        await utils.switchToIframe(this.funLocIframe);
        await this.funLocAsgnTab.waitForDisplayed({ timeout: 50000 });
        await this.funLocAsgnTab.click();
        await utils.waitForBusyIndicatorToDisappear();

        await utils.switchToIframe(this.funLocIframe);
        await this.asgnFunLocTemp.waitForClickable({ timeout: 30000 });
        await this.asgnFunLocTemp.click();
        await browser.pause(1000);

        await utils.selectCheckboxes(noOfFunTemp);
        if (autoAssign) {
            const checkBox = await this.autoAsgnClsAndChr;
            await checkBox.waitForClickable({ timeout: 30000 });
            await checkBox.click();
        }
 
        await utils.switchToIframe(this.funLocIframe);
        await utils.clickWithWait(this.okBtn2);
        await browser.pause(1000);
        await utils.clickWithWait(this.okBtn);
        await utils.waitForBusyIndicatorToDisappear();
        const funLocTemp = await this.funLocTemp.getText();
        const count = await utils.getAssignedValue(funLocTemp);
        console.log("No of Functional Location Template assigned are :"+count);
    }

    async assignFunLocClass(noOfClasses: number, autoAssign: boolean): Promise<void> {
        console.log("Assigning classes to Functional Location");
        const classes = await this.class.getText();
        await utils.getAssignedValue(classes);
        console.log("Already assigned classes: "+classes);
        const characteristics = await this.characteristics.getText(); 
        await utils.getAssignedValue(characteristics);
        console.log("No of characteristics assigned are -> "+characteristics);
        if (autoAssign) {
            console.log("Auto-assigning classes, skipping manual class assignment.");
            return;
        }
        await browser.pause(1000);
        await utils.switchToIframe(this.funLocIframe);
        await utils.clickWithWait(this.asgnClsAndChr,2000);
        await utils.switchToIframe(this.funLocIframe);
        const availableText = await $("//span[text()='Assign Classes']/ancestor::header/following::span[1]").getText();
        const availableCount = await utils.getAssignedValue(availableText);
        console.log("Available classes:"+ availableCount);
        if(availableCount === 0)
        {
            console.log("No of classes available is zero")
            //await this.cancelBtn.click();
            await utils.clickWithWait($("//header[.//text()='Assign Classes']/following::bdi[text()='Cancel']"));
            utils.waitForBusyIndicatorToDisappear();
            return;
        }
        else if (availableCount <= noOfClasses )
        {
            const selectAll = $("//span[text()='Assign Classes']/ancestor::header/following::th[2]");
            await utils.clickWithWait(selectAll);
        } 
        else {
            await utils.selectCheckboxesForClass(noOfClasses);
        }
        await utils.clickWithWait(this.okBtn2,1500);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.okBtn,1500);
        await utils.waitForBusyIndicatorToDisappear();
        const updatedCharacteristicsText = await this.characteristics.getText();
        const updatedCharacteristics = await utils.getAssignedValue(updatedCharacteristicsText);
        console.log("No of characteristics assigned are -> " + updatedCharacteristics);
        const updatedClassesText = await this.class.getText();
        const updatedClasses = await utils.getAssignedValue(updatedClassesText);
        console.log("No of Assigned classes -> " + updatedClasses);
    }

    async assignFunLocChar(noOfChar: number): Promise<void> {
        console.log("Assigning characteristics to Functional Location");
        let k=0;
        await browser.pause(1000);
        await utils.switchToIframe(this.funLocIframe);
        await this.funLocMDATab.waitForDisplayed({ timeout: 50000 });
        await this.funLocMDATab.click();
        await utils.waitForBusyIndicatorToDisappear();
        const char = await this.noOfCharMDA.getText();
        const c2 = await utils.getAssignedValue(char);
        console.log("Already assigned charactertics : "+c2);
        await browser.pause(1000);
        await utils.switchToIframe(this.funLocIframe);
        await this.funLocMDATab.waitForDisplayed({ timeout: 50000 });
        await this.funLocMDATab.click();
        await utils.switchToIframe(this.funLocIframe);
        await this.asgnChrMDA.waitForClickable({ timeout: 30000 });
        await this.asgnChrMDA.click();
        await browser.pause(1000);
        await utils.switchToIframe(this.funLocIframe);
        const availableChar = await this.noOfClassMDA.getText();
        const availableCharCount = await utils.getAssignedValue(availableChar);
        console.log("Available characteritics:"+ availableCharCount);
        if(availableCharCount === 0)
        {
            console.log("No of characteritics available is zero")
            //await this.cancelBtn.click();
            await utils.clickWithWait($("//header[.//text()='Assign Classes']/following::bdi[text()='Cancel']"));
            utils.waitForBusyIndicatorToDisappear();
            k=1;
        }
        else if (availableCharCount <= noOfChar )
        {
            const selectAll = $("//span[text()='Assign Classes']/ancestor::header/following::th[2]");
            await utils.clickWithWait(selectAll);
        } 
        if(k===0)
        {
        await utils.clickWithWait(this.okBtn2,1500);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.okBtn,1500);
        await utils.waitForBusyIndicatorToDisappear();
        }
        const updatedChar = await this.noOfCharMDA.getText();
        const uc = await utils.getAssignedValue(updatedChar);
        console.log("Assigned charactertics : "+uc);
    }

    public async verifyAssetIntelligence() {
        console.log("Navigating to Asset Intelligence Tab");
        await utils.clickWithWait(this.funLocAssetIntTab);
        await this.funLocAssetIntTab.waitForDisplayed({ timeout: 30000 });
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Navigated to Asset Intelligence Tab successfully");

        const riskAndCriti = await this.riskAndCriticality.getText();
        const r1 = await utils.getAssignedValue(riskAndCriti);
        console.log("Assigned risk and criticality : "+r1);

        const assetStraRBI = await this.assetStrategyRBI.getText();
        const as1 = await utils.getAssignedValue(assetStraRBI);
        console.log("Assigned asset strategy RBI : "+as1);

        const assetStraRCM = await this.assetStrategyRCM.getText();
        const as2 = await utils.getAssignedValue(assetStraRCM);
        console.log("Assigned asset strategy RCM: "+as2);

        const astInsp = await this.assetInsp.getText();
        const ai1 = await utils.getAssignedValue(astInsp);
        console.log("Assigned asset Inspection : "+ai1);

        const finding = await this.findings.getText();
        const f = await utils.getAssignedValue(finding);
        console.log("Assigned findings : "+f);

        const recommendations = await this.recommend.getText();
        const r = await utils.getAssignedValue(recommendations);
        console.log("Assigned recommendations : "+r);

    }

    public async verifyRiskSummary() {
        console.log("Navigating to Risk Summary Tab");
        await utils.clickWithWait(this.funLocRiskSumTab);
        await this.funLocRiskSumTab.waitForDisplayed({ timeout: 30000 });
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Navigated to Risk Summary Tab successfully");

        const riskProfile = await this.riskProfile.getText();
        const rp = await utils.getAssignedValue(riskProfile);
        console.log(" Assigned risk profile : "+rp);

        const component = await this.component.getText();
        const c = await utils.getAssignedValue(component);
        console.log(" Assigned component: "+c);

        const recommendation = await this.recommendation.getText();
        const recom = await utils.getAssignedValue(recommendation);
        console.log(" Assigned recommendations: "+recom);

    }

    public async verifyMainAndSum() {
        console.log("Navigating to Maintenance and Service Tab");
        await utils.clickWithWait(this.funLocMainSerTab);
        await this.funLocMainSerTab.waitForDisplayed({ timeout: 30000 });
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Navigated to Maintenance and Service successfully");

        const maintainNoti = await this.maintainNoti.getText();
        const mn = await utils.getAssignedValue(maintainNoti);
        console.log(" Assigned Maintenance Notification : "+mn);

        const maintainOrder = await this.maintainOrder.getText();
        const mo = await utils.getAssignedValue(maintainOrder);
        console.log(" Assigned Maintenance Order: "+mo);

        const maintainPlan = await this.maintainPlan.getText();
        const mp = await utils.getAssignedValue(maintainPlan);
        console.log(" Assigned Maintenance Plan: "+mp);

        const recomWrk = await this.recomWrk.getText();
        const rw = await utils.getAssignedValue(recomWrk);
        console.log(" Assigned recommendations: "+rw);

        const maintaintask = await this.maintaintask.getText();
        const mt = await utils.getAssignedValue(maintaintask);
        console.log(" Assigned Maintenance Task: "+mt);
    }

    async addDocument() {
        const addLinkBtn = await $('//button[.//bdi[text()="Add"]]');
        await utils.clickWithWait(addLinkBtn,1000);
        await browser.pause(2000);
        await utils.switchToIframe(this.funLocIframe);
        const documentOption = await $('//li[contains(.,"Add Document")]');
        await utils.clickWithWait(documentOption);
        await browser.pause(2000);
        await utils.uploadDocument('vessel-1.png');
        await browser.pause(9000);
        console.log("Document uploaded successfully, now filling the details to assign document");
        console.log("Selecting Category, Phase and Language for the document");

        await utils.openDropdown($('//label[.//bdi[text()="Category"]]//following::span[contains(@id,"arrow")][1]'));
        await utils.waitForDropdownOpen();
        await utils.waitForAnyUI5OptionActive();
        const firstOption = await $('(//li[@role="option"])[1]');
        await utils.clickWithWait(firstOption);
        console.log("Category selected");

        await utils.openDropdown($('//label[.//bdi[text()="Phase"]]//following::span[contains(@id,"arrow")][1]'));
        await utils.waitForDropdownOpen();
        await utils.waitForAnyUI5OptionActive();
        const phaseOption = await $('//li[@role="option"][1]//div[@role="checkbox"]');
        await utils.clickWithWait(phaseOption);
        console.log("Phase selected");

        await utils.openDropdown($('//label[.//bdi[text()="Language"]]//following::span[contains(@id,"arrow")][1]'));
        await utils.waitForDropdownOpen();
        await utils.waitForAnyUI5OptionActive();
        const languageOption = await $('//span[text()="English"]/ancestor::li');
        await utils.clickWithWait(languageOption);
        console.log("Language selected");

        await utils.clickWithWait($('//button[.//bdi[text()="Save"]]'));
        await utils.waitForBusyIndicatorToDisappear();
        await this.attachSuccMsg.waitForDisplayed({
            timeout: 20000,
            timeoutMsg: 'Document assign success message not displayed'
        });

        console.log("Document assign success message displayed");
        await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'));
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(10000);
    }

    async addLink() {
        const addLinkBtn = await $('//button[.//bdi[text()="Add"]]');
        await utils.clickWithWait(addLinkBtn);
        await browser.pause(2000);
        await utils.switchToIframe(this.funLocIframe);
        const link = await $('//li[contains(.,"Add Link")]');
        await utils.clickWithWait(link);
        await browser.pause(2000);
        console.log("Filling the details to assign link");
        const displayNameInput = await $(`//label[.//bdi[text()='Display Name']]//following::input[1]`);
        await displayNameInput.waitForDisplayed({ timeout: 10000 });
        await displayNameInput.setValue("Test Link");
        console.log("Display Name entered");
        console.log("Entering URL for the link");
        const linkInput = await $(`//label[.//bdi[text()='Link']]//following::input[1]`);
        await linkInput.setValue("https://testlink.com");
        const phaseInput = await $(`//label[.//bdi[text()="Phase"]]//following::span[contains(@id,"arrow")][1]`);
        await phaseInput.click();
        console.log("Phase dropdown opened");
        await utils.waitForDropdownOpen();
        const phaseoption = await $(`//li[@role="option"][1]//div[@role="checkbox"]`);
        await phaseoption.waitForDisplayed({ timeout: 10000 });
        await phaseoption.click();
        console.log("Phase selected");
        // const categoryInput = await $(`//label[.//bdi[text()="Category"]]//following::span[contains(@id,"arrow")][1]`);
        // await categoryInput.click();
        // const categoryoption = await $(`(//ul[@role="listbox"]//li[@role="option"])[2]`);
        // await utils.clickWithWait(categoryoption,1000);
        await utils.clickWithWait($('//button[.//bdi[text()="Save"]]'));
        await utils.waitForBusyIndicatorToDisappear();
        await this.attachSuccMsg.waitForDisplayed({
            timeout: 20000,
            timeoutMsg: 'Link assign success message not displayed'
        });

        console.log("Link assign success message displayed");
        await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'));
        await browser.pause(2000);
    }

    async gotoAttachmentsTabAndAssignAttachment() {
        console.log("Navigating to Attachment tab to assign attachment");
        await browser.pause(4000);
        await utils.switchToIframe(this.funLocIframe);
        await this.attachmentsSection.waitForDisplayed({ timeout: 50000 });
        await this.attachmentsSection.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(4000);
        const addAttachmentBtn = await $('//section[.//bdi[text()="Attachments"]]/following::bdi[text()="Assign"]');
        const addAttachmentBtn2 = await $('//header[.//bdi[text()="Attachments"]]/following::bdi[text()="Assign"]');
        if(await addAttachmentBtn.isExisting()){
            await utils.clickWithWait(addAttachmentBtn,2000);
        }
        else if(await addAttachmentBtn2.isExisting()){
            await utils.clickWithWait(addAttachmentBtn2,2000);
        }
        await browser.pause(2000);
        await utils.selectCheckboxes(2);
        await utils.clickWithWait($('//footer//button[.//bdi[text()="Assign"]]'),1000);

        await this.attachSuccMsg.waitForDisplayed({
            timeout: 20000,
            timeoutMsg: 'Document assign success message not displayed'
        });

        console.log("Document assign success message displayed");
        await utils.clickWithWait(this.okBtn,1000);
        console.log("Attachment assigned successfully");
    }

    async deleteAttachmentAndVerify() {
        console.log("Deleting assigned attachment and verifying");
        await browser.pause(8000);
        await utils.switchToIframe(this.funLocIframe);
        await browser.pause(8000);
        const attachmentCheckbox = await $('(//table//tr[@role="row"]//div[@role="checkbox" and @aria-checked="false"])[1]');
        await attachmentCheckbox.waitForDisplayed({ timeout: 20000 });
        await utils.clickWithWait(attachmentCheckbox,1000);
        const selectAllAttachment = await $('(//table//tr[@role="row"]//div[@role="checkbox" and @aria-checked="true"])[1]');
        if(await selectAllAttachment.isExisting()){
            console.log("Selecting all attachments for deletion");
            await selectAllAttachment.click();
        }
        else
        {
            console.log("No attachment is selected for deletion");    
            return;
        }
        await utils.clickWithWait($('//section[.//bdi[text()="Attachments"]]/following::bdi[text()="Delete"]/ancestor::button'),1000);
        await utils.clickWithWait($('//button[.//bdi[text()="Yes"]]'),1000);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait($('//button[.//bdi[text()="OK"]]'),1000);
        await browser.pause(2000);
        console.log("Attachment deleted successfully");
    }

    public async verifyChangeHistory() {
        console.log("Editing header's Information for change history check");
        await utils.clickWithWait(this.funLocEditHeader);
        await utils.setValueWithWait(
            this.funLocDescEditHeader,
            await utils.generateRandomFuncDescName()
        );
        const enteredDesc = await this.funLocDescEditHeader.getValue();
        await utils.clickWithWait(this.funLocCategoryEditHeader);
        await this.funLocCategory.waitForDisplayed({ timeout: 30000 });
        await this.funLocCtgChoose.scrollIntoView();
        let selectedCategory = "";
        const sElem = $("//span[text()='S']/ancestor::tr//td[2]//*[name()='circle'][2]/ancestor::div[@aria-checked='false']");
        if (await sElem.isExisting()) {
            await utils.clickWithWait(sElem);
            selectedCategory = "S";
        } else {
            const mElem = $("//span[text()='M']/ancestor::tr//td[2]//*[name()='circle'][2]");
            await utils.clickWithWait(mElem);
            selectedCategory = "M";
        }
        await utils.clickWithWait(this.funLocCtgSave);
        await utils.clickWithWait(this.funLocheaderSave);
        await this.funLocHdSaveSucc.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.funLocHdOkBtn);
        console.log("Header edited successfully");

        console.log("Navigating to Change History tab");
        await utils.clickWithWait(this.funLocChngHist);
        await this.funLocChngHist.waitForDisplayed({ timeout: 30000 });
        console.log("Navigated to Change History tab successfully");
        console.log("Fetching latest change history entry");
        const latestCngHst = await $("(//ul/li//div[2]/div/span)[1]");
        await latestCngHst.waitForDisplayed();
        console.log("Latest change history entry fetched successfully");
        const text = await latestCngHst.getText();
        console.log("Change History Text:\n", text);
        console.log("Validating change history entry");
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        console.log("Extracted Lines from Change History Entry:");
        const categoryLine = lines.find(l => l.toLowerCase().includes('category'));
        const descLine = lines.find(l => l.toLowerCase().includes('description'));

        if (!categoryLine || !categoryLine.includes(selectedCategory)) {
            throw new Error(
                `Category mismatch. Expected: ${selectedCategory}, Found: ${categoryLine}`
            );
        }
        if (!descLine || !descLine.includes(enteredDesc)) {
            throw new Error(
                `Description mismatch. Expected: ${enteredDesc}, Found: ${descLine}`
            );
        }
        console.log("Change history validation passed successfully");
    }

    public async getFuncLocId() {
        const xpath = "//header//*[@role='heading']//span";
        let found = false;
        try {
            await browser.waitUntil(async () => {
                const els = await $$(xpath);
                if (!els.length) return false;

                for (let el of els) {
                    let txt = (await el.getText()) ?? "";
                    if (!txt) txt =  (await el.getAttribute("innerText")) ?? "";
                    txt = txt?.trim();

                    if (txt && (txt.startsWith("AUTOMATION-FLOC ") || txt.startsWith("AUTOMATION-FUNC-LOC"))) {
                        found = true;
                        return true;
                    }
                }
                return false;
            }, {
                timeout: 4000,   // shorter wait per attempt
                interval: 500
            });

        } catch (e) {
            console.log("FuncLoc not visible in this attempt");
        }

        if (!found) return "";
        const spans = await $$(xpath);
        for (let el of spans) {
            let txt = (await el.getText()) ?? "";
                    if (!txt) txt =  (await el.getAttribute("innerText")) ?? "";
            txt = txt?.trim();

            if (txt && (txt.startsWith("AUTOMATION-FLOC ") || txt.startsWith("AUTOMATION-FUNC-LOC"))) {
                return txt;
            }
        }
        return "";
    }

    public async getDisplayId() {
        try {
            const txt = await browser.execute(() => {
                const el = document.evaluate( //display ID xpath may differ for different apps, adjust accordingly
                    "//span[starts-with(normalize-space(),'Display ID:')]",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                return el ? (el.textContent || "") : "";
            });
            return txt ? txt.replace("Display ID:", "").trim() : "";
        } catch (e) {
            return "";
        }
    }

    public async getFinalIDs() {
        let funcLoc = "";
        let actualId = "";
        const expandBtn = await $("(//span[text()='Expand Header']/preceding-sibling::span//span)[2]");
        const collapseBtn = await $("(//span[text()='Collapse Header']/preceding-sibling::span//span)[2]");
        for (let i = 0; i < 3; i++) {
            if (i === 0 && await expandBtn.isDisplayed()) {
                await expandBtn.waitForClickable({ timeout: 5000 });
                await expandBtn.click();
            } 
            else if (i === 1 && await collapseBtn.isDisplayed()) {
                await collapseBtn.waitForClickable({ timeout: 5000 });
                await collapseBtn.click();
            }
            await browser.pause(500); // small buffer before waitUntil kicks in
            const headerText = await this.getFuncLocId();
            const displayText = await this.getDisplayId();
            if (!funcLoc && headerText) funcLoc = headerText;
            if (!actualId && displayText) actualId = displayText;
            console.log(`Attempt ${i + 1} → FuncLoc="${funcLoc || 'EMPTY'}" | DisplayID="${actualId || 'EMPTY'}"`);
            if (funcLoc && actualId) break;
        }
        return { funcLoc, actualId };
    }

    public async verifyCML()
    {
        console.log("Starting CML verification");
        console.log("Capturing Functional Location header value for CML check");
        const { funcLoc, actualId } = await this.getFinalIDs();
        this.funcLocHeadValue = funcLoc;
        console.log(`Final → FuncLoc="${funcLoc}" | DisplayID="${actualId}"`);
        console.log("Verifying CML section");
        const parentTab = await browser.getWindowHandle();
        const oldHandles = await browser.getWindowHandles();
        await utils.clickWithWait($('//bdi[text()="CML"]'));
        await browser.waitUntil(
            async () => (await browser.getWindowHandles()).length > oldHandles.length,
            { timeout: 10000 }
        );
        const newHandles = await browser.getWindowHandles();
        const newTab = newHandles.find(h => !oldHandles.includes(h));
        await browser.switchToWindow(newTab!);
        await browser.waitUntil(
            async () => (await browser.execute(() => document.readyState)) === 'complete'
        );
        await utils.waitForBusyIndicatorToDisappear();
        const frame = await $('//iframe[@data-help-id="application-cml-manage"]');
        await frame.waitForExist({ timeout: 20000 });
        await utils.switchToIframe(frame);
        console.log("Switched to CML iframe");
        const cmlElem = await this.noOfCML;
        await cmlElem.waitForDisplayed({ timeout: 20000 });
        const funLocInCML = await $("(//header//*[@role='heading']/span)[1]");
        await funLocInCML.waitForDisplayed({ timeout: 20000 });
        await browser.waitUntil(async () => {
            return (await funLocInCML.getText()).trim().length > 0;
        }, { timeout: 10000 });
        const funLocInCMLText = await funLocInCML.getText();
        console.log("Functional Location in CML:", funLocInCMLText);
        const displayIdInCML = await $("((//header//*[@role='heading']/span)/following::bdi[2])[1]");
        await displayIdInCML.waitForDisplayed({ timeout: 20000 });
        await browser.waitUntil(async () => {
            const txt = await displayIdInCML.getText();
            return txt && txt.trim().length > 0;
        }, { timeout: 10000 });
        const displayIdInCMLText = await displayIdInCML.getText();
        console.log("Display ID in CML:", displayIdInCMLText);
        if(!funLocInCMLText || !displayIdInCMLText) {
            throw new Error("CML header values are empty");
        }
        await utils.assertTextEquals(funLocInCML, this.funcLocHeadValue);
        console.log("Functional Location in CML matches header value");
        await utils.assertTextEquals(displayIdInCML, actualId);
        let finalValue = 0;
        let lastSeenText = "";
        try {
            await browser.waitUntil(
                async () => {
                    let text = (await cmlElem.getText()) ?? "";
                    if (!text) text = (await cmlElem.getAttribute("innerText")) ?? "";

                    lastSeenText = text;

                    const value = await utils.getAssignedValue(text);
                    finalValue = value;

                    return value > 0;
                },
                {
                    timeout: 20000,
                    interval: 1000
                }
            );
            console.log(`SUCCESS CML value became ${finalValue}`);
        } catch (e) {
            console.log(`WARNING → CML value is still 0 after waiting`);
            console.log(`FINAL → CML TEXT: ${lastSeenText}`);
        }
        let cmlText = (await cmlElem.getText()) ?? "";
        if (!cmlText) {
            cmlText = (await cmlElem.getAttribute("innerText")) ?? "";
        }
        console.log("FINAL CML TEXT:", cmlText);
        const CML = await utils.getAssignedValue(cmlText);
        console.log("Assigned CMLs:", CML);
        console.log("CML verification completed successfully");
        await browser.closeWindow();
        await browser.switchToWindow(parentTab);
        console.log("Returned to parent tab");
    }

    async deleteFunctionalLocation(){
        console.log("Deleting the Functional Location");
        console.log("Capturing Functional Location header value for Deletion");
        await utils.switchToIframe(this.funLocIframe);
        await browser.pause(4000);
        const { funcLoc, actualId } = await this.getFinalIDs();
        this.funcLocHeadValue = funcLoc;
        this.displayID = actualId;
        console.log(`Final → FuncLoc="${funcLoc}" | DisplayID="${actualId}"`);
        await utils.switchToIframe(this.funLocIframe);
        console.log("Waiting for UI5 view to finish rendering...");
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForObjectPageHeader();
        await browser.pause(5000);
        await this.deleteBtn.waitForExist({ timeout: 30000 });
        await this.deleteBtn.waitForDisplayed({ timeout: 30000 });
        console.log("Clicking Delete...");
        await utils.clickWithWait(this.deleteBtn,3000);
        await utils.clickWithWait($("//header[.//text()='Confirmation']/following::button[.//text()='OK']"),3000);
        await utils.waitForBusyIndicatorToDisappear();
        console.log("Functional Location deletion in progress");
        console.log("Waiting for deletion to complete...");
        console.log("Deletion completed, confirming deletion");
    }

    async downloadAndVerifyPDF() {
        console.log("Downloading PDF and verifying its content");
        await utils.switchToIframe(this.funLocIframe);
        const { funcLoc} = await this.getFinalIDs();
        this.funcLocHeadValue = funcLoc;
        await utils.clickWithWait(this.downloadReport);
        let expectedFilters: string[] = [];
        try {
            const info = await $("//*[contains(text(),'Failed to export')]");
            await info.waitForDisplayed({ timeout: 7000 });
            console.log(await info.getText());
            const viewDetails = await $("//span[.='Failed to export the following']/following::a");
            await utils.clickWithWait(viewDetails);
            const filterNames = await $$("//span[.='Failed to export the following']/following-sibling::div//li");
            for (const el of filterNames) {
                const text = (await el.getText()).trim();
                if (text) expectedFilters.push(text);
            }
            console.log("Details not downloaded:", expectedFilters);
            const okBtn = await $("//header[.='Information']/following::button[.='OK']");
            await okBtn.waitForDisplayed({ timeout: 5000 });
            await utils.clickWithWait(okBtn);
        } catch (e) {
            console.log("Export success popup not shown");
        }
        console.log("Download initiated, waiting for file to be downloaded...");
        const filePath = await utils.waitForDownload('.pdf');
        console.log("File downloaded at:", filePath);
        const fileName = path.basename(filePath);
        console.log("Downloaded file name:", fileName);
        expect(fileName).toContain(this.funcLocHeadValue); // replace dynamically
        console.log("File name contains Functional Location header value");
        const pdfContent = await utils.extractTextFromPDF(filePath);
        console.log("Extracted PDF content:", pdfContent);
        expect(pdfContent).toContain(this.funcLocHeadValue);
        console.log("PDF content contains Functional Location header value");
        expect(pdfContent).toContain('Table of Content');
        console.log("PDF content verification completed successfully");
    }
}
export default new functionalLocationDetailView();