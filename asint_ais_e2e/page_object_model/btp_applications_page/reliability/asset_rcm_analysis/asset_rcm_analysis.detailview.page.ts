import utils from '../../../../utils/utils';
import assetRCMListView from "./asset_rcm_analysis.listview.page";
import assetRcmData from "../../../../test_data/btp_applications/reliability/asset_rcm.data";
import * as path from 'path';
import { url } from 'inspector';
class assetRCMDetailView {

    private get infoTab() { return $("//bdi[text()='Information']"); }
    private get rcmIframe() { return $('iframe[data-help-id="application-rcm-manage"]'); }
    private get assessmentTab() { return $("//bdi[text()='Assessment']"); }
    private get attachmentTab() { return $("//bdi[text()='Attachment']"); }
    private get editGenInfo() { return $("//div[text()='General Information']/ancestor::div[1]/following-sibling::div//button[.//text()='Edit']"); }
    private get descTextArea() { return $("//bdi[.='Description']/ancestor::div[1]/following::textarea[1]"); }
    private get longDescTextArea() { return $("//bdi[.='Long Description']/ancestor::div[1]/following::textarea[1]"); }
    private get systemBoundaryDescTextArea() { return $("//bdi[.='System Boundary Description']/ancestor::div[1]/following::textarea[1]"); }
    private get operatingContextTextArea() { return $("//bdi[.='Operating Context']/ancestor::div[1]/following::textarea[1]"); }
    private get saveGeneralInfoBtn() { return $("//div[.='General Information']/ancestor::div[1]/following-sibling::div//button[.//text()='Save']"); }
    private get okBtn() { return $("//header[.//text()='Success']/following::bdi[text()='OK']"); }
    private get editPlanData() { return $("//div[text()='Planning Data']/ancestor::div[1]/following-sibling::div//button[.//text()='Edit']"); }
    private get nextReviewDateInput() { return $("//bdi[.='Next Review Date']/ancestor::div[2]/following::input[1]"); }
    private get lastReviewDateInput() { return $("//bdi[.='Last Review Date']/ancestor::div[2]/following::input[1]"); }
    private get plannedReviewDateInput() { return $("//bdi[.='Planned Review Date (Next Refresh)']/ancestor::div[2]/following::input[1]"); }
    private get nextTADateInput() { return $("//bdi[.='Next TA Date (Unit Level)']/ancestor::div[2]/following::input[1]"); }
    private get secondTADateInput() { return $("//bdi[.='2nd TA Date (Unit Level)']/ancestor::div[2]/following::input[1]"); }
    private get savePlanDataBtn() { return $("//div[.='Planning Data']/ancestor::div[1]/following-sibling::div//button[.//text()='Save']"); }
    private get addRoleBtn() { return $("//button[.//text()='Add Role']"); }
    private get addRoleDialog() { return $("//header[.//text()='Add Role']/following-sibling::section"); }
    private get secondRoleCheckbox() { return $("//ul[@role='list']//li[@aria-posinset='2']//div[@role='checkbox']"); }
    private get addRoleOkBtn() { return $("//header[.//text()='Add Role']/following::button[.//text()='Ok']"); }
    private get maintenanceTechnicianRoleBtn() { return $("//bdi[.='Maintenance Technician']/ancestor::div[2]/following-sibling::div//span[@role='button']"); }
    private get selectUsersSearchInput() { return $("//header[.='Select Users']/following-sibling::section//input[@type='search']"); }
    private get qaAutomationUserCheckbox() { return $("//tr[.//span[.='qa automation']]//div[@role='checkbox']"); }
    private get selectUsersOkBtn() { return $("//header[.='Select Users']/following::button[.//text()='Ok']"); }
    private get saveBtnFooter() { return $("//bdi[text()='Save']"); }
    private get startAssessmentBtn() { return $("//button[.='Start Assessment']"); }
    private get technicalObjectsHeader() { return $("//h3[.//text()[contains(.,'Technical Objects')]]"); }
    private get equipmentValueBtn() { return $("//bdi[.='Equipment']/ancestor::div[2]/following::span[@role='button'][1]"); }
    private get funcLocValueBtn() { return $("//bdi[.='Functional Location']/ancestor::div[2]/following::span[@role='button'][1]"); }
    private get confirmBtn() { return $("//footer//button[.='Confirm']"); }
    private get nextBtn() { return $("//button[.='Next']"); }
    private get createBtnFooter() { return $("//footer//button[.//bdi[.='Create']]"); }
    private get warningMsg() { return $("//span[text()='All of the selected Technical Objects are already assigned to other ongoing assessments. Please select different Technical Objects.']"); }
    private get warningOkBtn() { return $("//button[.='OK']"); }
    private get previousBtn() { return $("//button[.='Previous']"); }
    private get removeSelectedToken() { return $("(//div[@role='listbox']//span[@aria-label='Remove'])[1]"); }
    private getRowByIndex(i:number){ return $(`(//tr[@role='row' and .//div[@role='checkbox']])[${i}]`); }
    private technicalObjectRowTxt = (techObj: string) => $(`//span[@dir='auto'][contains(text(),"${techObj}")]`);
    private technicalObjectRowClick = (techObj: string) => $(`//span[@dir='auto'][contains(text(),'${techObj}')]/ancestor::div[4]`);
    private get riskInformationSection() { return $("//bdi[normalize-space()='Risk Information']"); }
    private headerTechnicalObjectId = (id: string) => $$(`(//header[@role='banner']//div[@role='heading']//span[@dir='auto'])[normalize-space()='${id}']`);
    private headerTechnicalObjectName = (name: string) => $$(`//header[@role='banner']//span[@dir='auto'][normalize-space()='${name}']`);
    private get criticalityLabel() { return $("//bdi[normalize-space()='Criticality:']"); }
    private criticalityValue = (crit: string) => $(`//bdi[normalize-space()='Criticality:']/ancestor::div[1]/following::span[1][normalize-space()='${crit}']`);
    private get riskInformationHeader() { return $("//div[@role='heading']//span[contains(text(),'Risk Information')]"); }
    private get riskInformationExpandBtn() { return $("//span[contains(text(),'Risk Information')]/preceding::button[1]"); }
    private riskRowValue = (i:number) => $(`//td[@aria-colindex='1']//bdi/following::tbody//tr[@aria-rowindex='${i}']//td[@aria-colindex='1']//bdi`);
    private get maintenanceServiceSections() {return $$("//bdi[normalize-space()='Maintenance and Service']");}
    private get maintenanceNotifText() { return $("//div[contains(text(),'Maintenance Notifications')]"); }
    private get maintenanceNotifAssignBtn() { return $("//div[contains(text(),'Maintenance Notifications')]/following::button[.//text()='Assign'][1]"); }
    private get maintenanceNotifHeader() { return $("//header//span[contains(text(),'Maintenance Notifications')]"); }
    private get maintenanceOrdersText() { return $("//div[contains(text(),'Maintenance Orders')]"); }
    private get maintenanceOrdersAssignBtn() { return $("//div[contains(text(),'Maintenance Orders')]/following::button[.//text()='Assign'][1]"); }
    private get maintenanceOrdersHeader() { return $("//header//span[contains(text(),'Orders')]"); }
    private get maintenancePlansText() { return $("//div[contains(text(),'Maintenance Plans')]"); }
    private get footerCancelBtn() { return $("//footer//button[.//text()='Cancel']"); }
    private get strategiesHeader() { return $$("//div[@role='heading']//span[contains(text(),'Strategies')]"); }
    private get strategiesExpandBtn() { return $("//span[contains(text(),'Strategies')]/preceding::button[1]"); }
    private get strategiesRows() { return $$("//tr[@role='row']//div[@role='heading']//span"); }
    private get recommendationHeader() { return $("//div[@role='heading']//span[contains(text(),'Recommendation')]"); }
    private get recommendationExpandBtn() { return $("//span[contains(text(),'Recommendation')]/preceding::button[1][@aria-label]"); }
    private get recommendationRCMValues() { return $$("//tbody//tr[@role='row']//td[.//span[contains(text(),'RCM')]]//span[contains(text(),'RCM')]"); }
    private get assessmentDetailCloseBtn() { return $("//header[@role='banner']//button[@aria-label='Decline']"); }
    private addMaintainableBtn = (techObj: string) => $(`//span[@dir='auto'][contains(text(),"${techObj}")]/ancestor::div[3]/following-sibling::div//button[@title='Add']`);
    private get assignMaintainableItemsBtns() { return $$("//button[@title='Assign Maintainable Items']"); }
    private get assignMaintainableItemsHeader() { return $("//h1[normalize-space()='Assign Maintainable Items']"); }
    private get maintainableItemsText() {return $("//header[.//text()='Assign Maintainable Items']/following-sibling::section//span[contains(text(),'Maintainable Items')]"); }
    private get maintainableItemValue() {return $("//header[.//text()='Assign Maintainable Items']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[@aria-colindex='2']//span"); }
    private get maintainableItemRow() {return $("//header[.//text()='Assign Maintainable Items']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[2]"); }
    private get assignBtn() { return $("//button[.//text()='Assign']"); }
    private get cancelBtn() { return $("//button[.//text()='Cancel']"); }
    private expandBtn = (techObj: string) =>$$(`//span[@dir='auto'][contains(text(),"${techObj}")]/ancestor::div[5]//span[@role='button']`);
    private assignedItem = (value: string) =>$$(`//span[@dir='auto'][contains(text(),"${value}")]`);
    private maintainableItemHeader = (name: string) =>$(`(//header[@role='banner']//div[@role='heading']//span[@dir='auto'])[last()][normalize-space()='${name}']`);
    private maintainableItemIdValue = (id: string) =>$(`//section[@role='region']//span[text()='Code ID ']/following-sibling::span[normalize-space()='${id}']`);
    private get riskInfoText(){return $("//div[@role='heading']//div[contains(text(),'Risk Information')]//following::h2//span"); }
    private get strategyInfoText(){return $("//div[@role='heading']//div[contains(text(),'Risk Information')]//following::span[contains(text(),'Strategies')]");}
    private get closeBtn() {return $$("//header[@role='banner']//button[@aria-label='Decline']"); }
    private failureModeAddBtn = (val: string) => $(`//span[@dir='auto'][contains(text(),"${val}")]/ancestor::div[3]/following-sibling::div//button[@title='Add']`);
    private get assignFailureModeBtn() { return $$("//button[@title='Assign Failure Modes']"); }
    private get assignFailureModeHeader() { return $("//h1[normalize-space()='Assign Failure Modes']"); }
    private get failureModeCountText() { return $("//header[.//text()='Assign Failure Modes']/following-sibling::section//span[contains(text(),'Failure Modes')]"); }
    private get failureModeValue() { return $("//header[.//text()='Assign Failure Modes']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[@aria-colindex='2']//span"); }
    private get failureModeCheckbox() { return $("//header[.//text()='Assign Failure Modes']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[2]"); }
    private failureModeExpandBtn = (val: string) => $(`//span[@dir='auto'][contains(text(),"${val}")]/ancestor::div[5]//span[@role='button']`);
    private failureModeAssigned = (val: string) => $(`//span[@dir='auto'][contains(text(),"${val}")]`);
    private failureModeRow = (val: string) => $(`//span[@dir='auto'][contains(text(),"${val}")]/ancestor::div[4]`);
    private failureModeHeaders = (name: string) => $$(`(//header[@role='banner']//div[@role='heading']//span[@dir='auto'])[normalize-space()='${name}']`);
    private failureModeId = (id: string) => $(`//section[@role='region']//span[text()='Code ID ']/following-sibling::span[normalize-space()='${id}']`);
    private get analysisDetailsSections() {return $$("//bdi[normalize-space()='Analysis Details']");}
    private get failureEffectsText() { return $("//div[@role='heading']//following::span[contains(text(),'Failure Effects')]"); }
    private get failureEffectsAssignBtn() { return $("//div[@role='heading']//following::span[contains(text(),'Failure Effects')]/following::button[1]"); }
    private get assignFailureEffectsHeader() { return $("//h1[normalize-space()='Assign Failure Effects']"); }
    private get failureEffectsCountText() { return $("//header[.//text()='Assign Failure Effects']/following-sibling::section//span[contains(text(),'Failure Effects')]"); }
    private get failureEffectsValue() { return $("//header[.//text()='Assign Failure Effects']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[@aria-colindex='2']//span"); }
    private get failureEffectsCheckbox() { return $("//header[.//text()='Assign Failure Effects']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[2]"); }
    private get failureScenarioEditBtn() { return $("//div[@role='heading']//following::span[contains(text(),'Failure Scenario')]/following::bdi[text()='Edit'][1]"); }
    private get failureScenarioTextarea() { return $("//div[@role='heading']//following::span[contains(text(),'Failure Scenario')]/following::textarea"); }
    private get failureScenarioSaveBtn() { return $("//div[@role='heading']//following::span[contains(text(),'Failure Scenario')]/following::bdi[text()='Save']"); }
    private get failureMechanismText() { return $("//div[@role='heading']//following::span[contains(text(),'Failure Mechanisms')]"); }
    private get failureMechanismAssignBtn() { return $("//div[@role='heading']//following::span[contains(text(),'Failure Mechanisms')]/following::button[1]"); }
    private get assignFailureMechanismHeader() { return $("//h1[normalize-space()='Assign Failure Mechanisms']"); }
    private get failureMechanismCountText() { return $("//header[.//text()='Assign Failure Mechanisms']/following-sibling::section//span[contains(text(),'Failure Mechanisms')]"); }
    private get failureMechanismValue() { return $("//header[.//text()='Assign Failure Mechanisms']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[@aria-colindex='2']//span"); }
    private get failureMechanismCheckbox() { return $("//header[.//text()='Assign Failure Mechanisms']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[2]"); }
    private get consequencePerformBtn() { return $("//div[@role='heading']//following::span[contains(text(),'Consequence Evaluation')]/following::bdi[text()='Perform'][1]"); }
    private get consequenceHeader() { return $("//h1[normalize-space()='Consequence Evaluation']"); }
    private get hiddenFailureDropdown() { return $("//bdi[contains(text(),'Hidden Failure')]/ancestor::div[2]/following::span[4]"); }
    private get failurePatternDropdown() { return $("(//bdi[contains(text(),'Failure Pattern')]/ancestor::div[2]/following::span[4])[1]"); }
    private get safeLifePopupBtn() { return $("//bdi[contains(text(),'Safe Life')]/ancestor::div[2]/following::span[@role='button'][1]"); }
    private get pfIntervalPopupBtn() { return $("//bdi[contains(text(),'P-F Interval')]/ancestor::div[2]/following::span[@role='button'][1]"); }
    private get unitPopupHeader() { return $("//h1[normalize-space()='Select unit of measurement']"); }
    private get unitOption() { return $("//h1[normalize-space()='Select unit of measurement']/following::tr[3]"); }
    private get safeLifeInput() { return $("//bdi[contains(text(),'Safe Life')]/ancestor::div[2]/following::input[@type='text'][1]"); }
    private get pfIntervalInput() { return $("//bdi[contains(text(),'P-F Interval')]/ancestor::div[2]/following::input[@type='text'][1]"); }
    private get consequenceSaveBtn() { return $("//bdi[contains(text(),'Safe Life')]/following::button[.//text()='Save']"); }
    private get causesText() { return $("(//div[@role='heading']//following::span[contains(text(),'Causes')])[1]"); }
    private get causesAssignBtn() { return $("(//div[@role='heading']//following::span[contains(text(),'Causes')])[1]/following::button[1]"); }
    private get assignCausesHeader() { return $("//h1[normalize-space()='Assign Causes']"); }
    private get causesCountText() { return $("//header[.//text()='Assign Causes']/following-sibling::section//span[contains(text(),'Causes')]"); }
    private get causesValue() { return $("//header[.//text()='Assign Causes']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[@aria-colindex='2']//span"); }
    private get causesCheckbox() { return $("//header[.//text()='Assign Causes']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[2]"); }
    private get strategiesTexts() { return $$("//div[@role='heading']//following::span[contains(text(),'Strategies')]"); }
    private get strategiesCreateBtn() { return $("(//div[@role='heading']//following::span[contains(text(),'Causes')])[1]/following::button[.='Create']"); }
    private get createStrategyHeader() { return $("//h1[normalize-space()='Create Strategy']"); }
    private get strategyDescInput() { return $("//bdi[text()='Description']/following::input[1]"); }
    private get strategyLongDesc() { return $("//bdi[text()='Long Description']/following::textarea"); }
    private get strategyTypeDropdown() { return $("//bdi[text()='Type']/following::span[@role='button'][1]"); }
    private get strategyStartDate() { return $("//bdi[text()='Start Date']/following::input[1]"); }
    private get strategyDueDate() { return $("//bdi[text()='Due Date']/following::input[1]"); }
    private get strategyCreateBtn() { return $("//footer//button[.//bdi[.='Create']]"); }
    private get riskInformationSections() { return $$("//bdi[normalize-space()='Risk Information']"); }
    private get riskSearchInput() { return $("//input[@placeholder='Search by Transition , Last transition date , FIN Risk , SHE Risk   ']"); }
    private get editRiskBtn() { return $("//button[@title='Edit']"); }
    private get transitionTextRow1() { return $("(//th[@aria-colindex='2']//span[text()='Transition']/following::td[@aria-colindex='2']//span)[1]"); }
    private get lastTransitionDateRow1() { return $("(//th[@aria-colindex='3']//span[text()='Last Transition Date']/following::td[@aria-colindex='3']//input)[1]"); }
    private get sheRiskDropdownRow1() { return $("(//th[@aria-colindex='4']//span[text()='SHE Risk']/following::td[@aria-colindex='4']//input)[1]"); }
    private get finRiskDropdownRow1() { return $("(//th[@aria-colindex='5']//span[text()='FIN Risk']/following::td[@aria-colindex='5']//input)[1]"); }
    private get finConsequenceRow1() { return $("(//th[@aria-colindex='6']//span[text()='FIN Consequence ($K)']/following::td[@aria-colindex='6']//input)[1]"); }
    private get finPofRow1() { return $$("(//span[text()='FIN POF']/following::td[@colspan='6']//input)[1]"); }
    private get transitionTextRow2() { return $("(//th[@aria-colindex='2']//span[text()='Transition']/following::tr[@aria-rowindex='2']/following::td[@aria-colindex='2']//span)[1]"); }
    private get lastTransitionDateRow2() { return $("(//th[@aria-colindex='3']//span[text()='Last Transition Date']/following::tr[@aria-rowindex='2']/following::td[@aria-colindex='3']//input)[1]"); }
    private get sheRiskDropdownRow2() { return $("(//th[@aria-colindex='4']//span[text()='SHE Risk']/following::tr[@aria-rowindex='2']/following::td[@aria-colindex='4']//input)[1]"); }
    private get finRiskDropdownRow2() { return $("(//th[@aria-colindex='5']//span[text()='FIN Risk']/following::tr[@aria-rowindex='2']/following::td[@aria-colindex='5']//input)[1]"); }
    private get finConsequenceRow2() { return $("(//th[@aria-colindex='6']//span[text()='FIN Consequence ($K)']/following::tr[@aria-rowindex='2']/following::td[@aria-colindex='6']//input)[1]"); }
    private get finPofRow2() { return $$("(//span[text()='FIN POF']/following::td[@colspan='6']//input)[2]"); }
    private get transitionTextRow3() { return $("(//th[@aria-colindex='2']//span[text()='Transition']/following::tr[@aria-rowindex='3']/following::td[@aria-colindex='2']//span)[1]"); }
    private get lastTransitionDateRow3() { return $("(//th[@aria-colindex='3']//span[text()='Last Transition Date']/following::tr[@aria-rowindex='3']/following::td[@aria-colindex='3']//input)[1]"); }
    private get sheRiskDropdownRow3() { return $("(//th[@aria-colindex='4']//span[text()='SHE Risk']/following::tr[@aria-rowindex='3']/following::td[@aria-colindex='4']//input)[1]"); }
    private get finRiskDropdownRow3() { return $("(//th[@aria-colindex='5']//span[text()='FIN Risk']/following::tr[@aria-rowindex='3']/following::td[@aria-colindex='5']//input)[1]"); }
    private get finConsequenceRow3() { return $("(//th[@aria-colindex='6']//span[text()='FIN Consequence ($K)']/following::tr[@aria-rowindex='3']/following::td[@aria-colindex='6']//input)[1]"); }
    private get finPofRow3() { return $$("(//span[text()='FIN POF']/following::td[@colspan='6']//input)[3]"); }
    private get transitionTextRow4() { return $("(//th[@aria-colindex='2']//span[text()='Transition']/following::tr[@aria-rowindex='4']/following::td[@aria-colindex='2']//span)[1]"); }
    private get lastTransitionDateRow4() { return $("(//th[@aria-colindex='3']//span[text()='Last Transition Date']/following::tr[@aria-rowindex='4']/following::td[@aria-colindex='3']//input)[1]"); }
    private get sheRiskDropdownRow4() { return $("(//th[@aria-colindex='4']//span[text()='SHE Risk']/following::tr[@aria-rowindex='4']/following::td[@aria-colindex='4']//input)[1]"); }
    private get finRiskDropdownRow4() { return $("(//th[@aria-colindex='5']//span[text()='FIN Risk']/following::tr[@aria-rowindex='4']/following::td[@aria-colindex='5']//input)[1]"); }
    private get finConsequenceRow4() { return $("(//th[@aria-colindex='6']//span[text()='FIN Consequence ($K)']/following::tr[@aria-rowindex='4']/following::td[@aria-colindex='6']//input)[1]"); }
    private get finPofRow4() { return $$("(//span[text()='FIN POF']/following::td[@colspan='6']//input)[4]"); }
    private get saveRiskBtn() { return $("//button[.//text()='Save']"); }
    private get riskMatrixSections() { return $$("//bdi[normalize-space()='Risk Matrix']"); }
    private get riskMatrixTitle() { return $("//div[text()='Exxon 4x5 FIN Risk Matrix']"); }
    private get finTodayText() { return $("//span[text()=\"FIN At Today's Date\"]"); }
    private get finPofValue() { return $("//div[contains(.,'FIN PoF')]/b"); }
    private get finCofValue() { return $("//div[contains(.,'FIN CoF ($K)')]/b"); }
    private get assignTechObjBtn() { return $("//button[.//text()='Assign Technical Objects']"); }
    private get hierarchyMoreBtn() { return $("//span[text()='Hierarchy']/following::button[@aria-label='Additional Options']//span[@role='presentation']"); }
    private get headerMoreBtn() { return $("//header//button[@aria-label='Additional Options']//span[@role='presentation']"); }
    private get functionalLocationHeader() { return $("//header//span[contains(text(),'Functional Location')]"); }
    private get checkBoxByIndex() { return (i: number) => $(`(//tr[@role='row']//div[@role='checkbox'])[${i}]`); }
    private functionalLocationRow = (funcLoc: string) =>$(`//span[@dir='auto'][contains(text(),'${funcLoc}')]`);
    private functionalLocationRowClick = (funcLoc: string) => $(`//span[@dir='auto'][contains(text(),'${funcLoc}')]/ancestor::div[4]`);
    private functionalLocationAddBtn = (locationName: string, locationId: string) =>$(`//span[@dir='auto'][contains(normalize-space(), '${locationName}') and contains(normalize-space(), '${locationId}')]/ancestor::div[3]/following-sibling::div//button[@title='Add']`);
    private get assignMaintainableItemsBtn() {return $$("//button[@title='Assign Maintainable Items']");}
    private get assignFunctionsBtn() {return $$("//button[@title='Assign Functions']");}
    private get assignFunctionsHeader() { return $("//h1[normalize-space()='Assign Functions']"); }
    private get functionsCountText() {return $("//header[.//text()='Assign Functions']/following-sibling::section//span[contains(text(),'Functions')]"); }
    private get firstFunctionValue() {return $("//header[.//text()='Assign Functions']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[@aria-colindex='2']//span"); }
    private get firstFunctionCheckbox() {return $("//header[.//text()='Assign Functions']/following-sibling::section//tbody//tr[@aria-rowindex='3']//td[2]"); }
    private expandBtnForFuncLoc = (locationName: string, locationId: string) =>$$(`//span[@dir='auto'][contains(normalize-space(), '${locationName}') and contains(normalize-space(), '${locationId}')]/ancestor::div[5]//span[@role='button']`);
    private expandBtnForFunc = (funtion: string) =>$$(`//span[@dir='auto'][contains(normalize-space(), '${funtion}')]/ancestor::div[5]//span[@role='button']`);
    private expandBtnForFuncFail = (funtion: string) =>$$(`//span[@dir='auto'][contains(normalize-space(), '${funtion}')]/ancestor::div[5]//span[@role='button']`);
    private functionRow = (fn: string) => $$(`//span[@dir='auto'][contains(text(),'${fn}')]`);
    private functionRowClick = (fn: string) => $(`//span[@dir='auto'][contains(text(),'${fn}')]/ancestor::div[4]`);
    private functionalFailureAddBtn = (functionName: string) =>$(`//span[@dir='auto'][contains(normalize-space(), '${functionName}')]/ancestor::div[3]/following-sibling::div//button[@title='Add']`);
    private get assignFunctionalFailureBtn() {return $$("//button[@title='Assign Functional Failure']"); }
    private get assignFunctionalFailureHeader() {return $("//h1[normalize-space()='Assign Functional Failures']"); }
    private get functionalFailureCountText() {return $("//header[.//text()='Assign Functional Failures']/following-sibling::section//span[contains(text(),'Functional Failure')]"); }
    private get firstFunctionalFailureValue() {return $("//header[.//text()='Assign Functional Failures']/following-sibling::section//tbody//tr[@aria-rowindex='5']//td[@aria-colindex='2']//span"); }
    private get firstFunctionalFailureCheckbox() {return $("//header[.//text()='Assign Functional Failures']/following-sibling::section//tbody//tr[@aria-rowindex='5']//td[2]"); }
    private functionalFailureRow = (val: string) => $$(`//span[@dir='auto'][contains(text(),"${val}")]`);
    private functionalFailureRowClick = (val: string) =>$(`//span[@dir='auto'][contains(text(),"${val}")]/ancestor::div[4]`);
    private get attachSuccMsg() { return $("//span[text()='Success']"); }
    private get summaryReportBtn() { return $("//button[.//text()='Summary Report']"); }
    private get downloadReportHeader() { return $("//h1[.//text()='Download Report']"); }
    private get includeAllTechObjText() { return $("//bdi[text()='Include all Technical Objects']"); }
    private get downloadReportOkBtn() { return $("//header[.//text()='Download Report']/following::footer//button[.//text()='Ok']"); }
    private get confirmationYesBtn() { return $("//header[.//text()='Confirmation']/following::footer//button[.//text()='Yes']"); }
    private get manageBtn() { return $("//button[.//text()='Manage']"); }
    private get deleteConfirmText() { return $("//span[.//text()='Are you sure you want to delete the assessment?']"); }
    private get confirmOkBtn() { return $("//header[.//text()='Confirmation']/following::button[.//text()='OK']"); }

    public selectedEquipmentData:any = {};
    public selectedFunctionalLocation:any ={};
    private techObj!: string;
    private maintanableItems!: string;
    private failureMode!: string;
    private funcLocObj!: string;
    private functionValue!: string;
    private functionalFailureValue!: string;
    private maintainableItemValueFunLoc!: string;
    private failureModeValueFunLoc!: string;
    private assignedMaintainable!: number;
    private failureModeFunLoc: boolean = false;
    private maintenableItemFunLoc: boolean = false;

    public async verifyAndEditGenInfo(){
        console.log("Navigating to Information Tab");
        utils.switchToIframe(this.rcmIframe);
        await utils.clickWithWait(this.infoTab);
        console.log("Navigated to information tab");
        const infoDesc = await $("//bdi[.='Description']/ancestor::div[1]/following::div[.//span][1]//span");
        const infoDescText = (await infoDesc.getText()).trim();
        console.log("Comparing Header vs Information tab Description");
        await expect(infoDescText).toEqual(assetRCMListView.assetRCMDesc);
        console.log("Description matched successfully");
        console.log("Editing infomation...");
        await utils.clickWithWait(this.editGenInfo);
        await utils.waitForBusyIndicatorToDisappear();
        assetRCMListView.assetRCMDesc = `Automation_RCM_${Date.now()}`;
        console.log(`Generated RCM Description for infomration verification: ${assetRCMListView.assetRCMDesc}`);
        await utils.setValueWithWait(this.descTextArea,assetRCMListView.assetRCMDesc);
        console.log("New description value is "+assetRCMListView.assetRCMDesc);
        await utils.setValueWithWait(this.longDescTextArea,"Automation Long Desc Test");
        await utils.setValueWithWait(this.systemBoundaryDescTextArea,"System Bounday Description");
        await utils.setValueWithWait(this.operatingContextTextArea,"Operating context");
        await utils.clickWithWait(this.saveGeneralInfoBtn);
        await utils.clickWithWait(this.okBtn);
        await browser.pause(5000);
        await assetRCMListView.verifyHeader();
        console.log("Verification and editing of Information tab done");
        console.log("Verifying if header value changed or not, after changing the description");
    }

    public async verifyAndEditPlanningData()
    {
        console.log("Editing planning section...");
        await utils.clickWithWait(this.editPlanData);
        const getFutureDate = (days:number)=> new Date(Date.now()+days*86400000)
        .toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"});
        await utils.setValueWithWait(this.lastReviewDateInput, getFutureDate(1));
        await utils.setValueWithWait(this.nextReviewDateInput, getFutureDate(5));
        await utils.setValueWithWait(this.plannedReviewDateInput, getFutureDate(6));
        await utils.setValueWithWait(this.secondTADateInput, getFutureDate(8));
        await utils.setValueWithWait(this.nextTADateInput, getFutureDate(7));
        await utils.clickWithWait(this.savePlanDataBtn);
        await utils.clickWithWait(this.okBtn);
        await browser.pause(2500);
        console.log("Verification of planning section is done");
    }

    public async addRoles()
    {
        console.log("Adding roles...");
        await utils.clickWithWait(this.addRoleBtn);
        await browser.pause(2500);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addRoleDialog.waitForDisplayed();
        await utils.clickWithWait(this.secondRoleCheckbox);
        await utils.clickWithWait(this.addRoleOkBtn);
        await browser.pause(2500);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.maintenanceTechnicianRoleBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await this.selectUsersSearchInput.setValue("qa automation");
        await browser.pause(2000);
        await utils.clickWithWait(this.qaAutomationUserCheckbox);
        await utils.clickWithWait(this.selectUsersOkBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveBtnFooter);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.okBtn);
        await browser.pause(2500);
        console.log("Roles added");
    }

    public async createAssessmentFlow(){
        console.log("Navigating to Assessment Tab");
        utils.switchToIframe(this.rcmIframe);
        await utils.clickWithWait(this.assessmentTab);
        console.log("Navigated to Assessment tab");
        console.log("Assessment flow start");
        await utils.switchToIframe(this.rcmIframe);
        await browser.pause(4000);
        await utils.clickWithWait(this.startAssessmentBtn);
        await browser.pause(2000);
        await utils.switchToIframe(this.rcmIframe);
        await browser.pause(4000);
        await this.technicalObjectsHeader.waitForDisplayed();
        for(let i=2;i<=81;i++){
            console.log(`Trying checkbox index: ${i}`);
            await utils.clickWithWait(this.equipmentValueBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(5000);
            const checkBox = $(`(//tr[@role='row']//div[@role='checkbox'])[${i}]`);
            await checkBox.waitForClickable({timeout : 50000});
            await utils.clickWithWait(checkBox);
            await this.selectEquipmentAndStore(i);
            await utils.clickWithWait(this.confirmBtn);
            await utils.clickWithWait(this.nextBtn);
            await utils.clickWithWait(this.createBtnFooter);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(5000);
            await browser.waitUntil(async () => (await this.okBtn.isDisplayed()) || (await this.warningMsg.isDisplayed()), { timeout: 60000 });
            if (await this.okBtn.isDisplayed()) {
                console.log("Assessment created successfully");
                await utils.clickWithWait(this.okBtn);
                break;
            } else if (await this.warningMsg.isDisplayed()) {
                console.log("Warning displayed, retrying with next checkbox");
                await utils.clickWithWait(this.warningOkBtn);
                await utils.clickWithWait(this.previousBtn);
                await browser.pause(4000);
                await utils.waitForBusyIndicatorToDisappear();
                await utils.clickWithWait(this.removeSelectedToken);
            }
        }
        console.log("Assessment details :", this.selectedEquipmentData);
        console.log("Assessment flow end");
    }

    public async selectEquipmentAndStore(i:number){
        console.log("Store equipment data start");
        const row = await this.getRowByIndex(i);
        const equipmentId = await row.$(".//td[@aria-colindex='2']//span[contains(@id,'txt')]").getText();
        console.log("Equipment ID selected: "+equipmentId);
        const equipmentName = await row.$(".//td[@aria-colindex='2']//div[contains(@class,'Text')]/span[last()]").getText();
        console.log("Equipment Name selected: "+equipmentName);
        const category = await row.$(".//td[@aria-colindex='3']//span").getText();
        console.log("Category selected: "+category);
        const objectType = await row.$(".//td[@aria-colindex='4']//span").getText();
        console.log("Object type selected: "+objectType);
        const catalogProfile = await row.$(".//td[@aria-colindex='8']//span").getText();
        console.log("Catalog profile selected: "+catalogProfile);
        //const criticality = await row.nextElement().$(".//span[text()='Criticality']/ancestor::div[1]/following::span[1]").getText();
        this.selectedEquipmentData = {equipmentId,equipmentName,category,objectType,catalogProfile};
        console.log("Store equipment data end");
    }
    
    public async verifyAssessment(){
        console.log("Open technical object and verify start...");
        const data = this.selectedEquipmentData;
        await utils.waitForBusyIndicatorToDisappear();
        const cleanName = data.equipmentName.replace(/\\+/g, '\\');
        this.techObj = `${cleanName} (${data.equipmentId})`;
        console.log("Technical object selected : "+this.techObj);
        await expect(this.technicalObjectRowTxt(this.techObj)).toBeDisplayed();
        await utils.clickWithWait(this.technicalObjectRowClick(this.techObj));
        await utils.waitForBusyIndicatorToDisappear();
        await this.verifyAssessmentDetails();
        console.log("Technical object and verification ends");
    }

    public async verifyAssessmentDetails()
    {
        console.log("Verification of technical object details starts...");
        const data = this.selectedEquipmentData;
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(10000);
        const elements = [
        this.riskInformationSection,
        this.headerTechnicalObjectId(data.equipmentId),
        this.headerTechnicalObjectName(data.equipmentName),
        //this.criticalityLabel,
        //this.criticalityValue(data.criticality)
        ];

        for (const el of elements) {
            const elems = await $$(await el.selector);
            let isVisible = false;

            for (const e of elems) {
                if (await e.isDisplayed()) {
                    isVisible = true;
                    break;
                }
            }

            await expect(isVisible).toBe(true);
        }
        console.log("Verify technical object details end");
        console.log("Verifying deatil page of techinical object");
        console.log("Clicking risk information tab...");
        await utils.clickWithWait(this.riskInformationSection);
    }

    public async verifyAssessmentSections()
    {
        await this.captureRiskStrategyRecommendation();
        await this.captureMaintainAndService();
    }

    public async captureRiskStrategyRecommendation(){
        console.log("Capture Risk/Strategy/Recommendation start");
        const riskHeaderTxt = await this.riskInformationHeader.getText();
        const riskCount = await utils.getAssignedValue(riskHeaderTxt);
        if(riskCount > 0){
            if((await this.riskInformationExpandBtn.getAttribute("aria-expanded")) === "false"){
                await utils.clickWithWait(this.riskInformationExpandBtn);
            }
        }
        let headerText = "";

        for (const el of await this.strategiesHeader) {
            if (await el.isDisplayed().catch(() => false)) {
                headerText = await el.getText();
                break;
            }
        }

        const strategyVal = await utils.getAssignedValue(headerText);
        console.log("Assigned strategies is/are :", strategyVal);

        if (strategyVal > 0) {
            await this.strategiesExpandBtn.waitForDisplayed({ timeout: 60000 });

            if ((await this.strategiesExpandBtn.getAttribute("aria-expanded")) === "false") {
                await utils.clickWithWait(this.strategiesExpandBtn);
                await browser.pause(2000);
            }

            for (const row of await this.strategiesRows) {
                if (await row.isDisplayed().catch(() => false)) {
                    console.log("Strategy Row: " + await row.getText());
                }
            }
        }
        const recHeaderTxt = await this.recommendationHeader.getText();
        const recCount = await utils.getAssignedValue(recHeaderTxt);
        if(recCount > 0){
            if((await this.recommendationExpandBtn.getAttribute("aria-expanded")) === "false"){
                await utils.clickWithWait(this.recommendationExpandBtn);
            }
            const recs = await this.recommendationRCMValues;
            for(const rec of recs){
                if(await rec.isDisplayed()){
                    console.log("Recommendation:", await rec.getText());
                }
            }
        }

        console.log("Capture Risk/Strategy/Recommendation end");
        
    }

    public async captureMaintainAndService()
    {
        console.log("Navigating to Maintenance and Service...");
        for (const el of await this.maintenanceServiceSections) {
                if (await el.isDisplayed() && await el.isClickable()) {
                    await utils.clickWithWait(el);
                    break;
                }
        };
        await browser.pause(2000);
        console.log("Navigated to Maintenance and Service");
        let txt = await this.maintenanceNotifText.getText();
        console.log("Maintenance Notifications: " + await utils.getAssignedValue(txt));

        await utils.clickWithWait(this.maintenanceNotifAssignBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await expect(this.maintenanceNotifHeader).toBeDisplayed();
        let count = await utils.getAssignedValue(await this.maintenanceNotifHeader.getText());
        console.log("Available maintenance notifications: " + count);
        if(count===0)
        {
            await utils.clickWithWait(this.footerCancelBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
        }
        else
        {
            await browser.pause(5000);
            const rowCheckbox = await $("(//tr[@role='row'])[2]//div[@role='checkbox']");
            await utils.clickWithWait(rowCheckbox);

            const selectBtn = await $("//button[.//text()='Select']");
            await utils.clickWithWait(selectBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickWithWait(this.okBtn);
            await browser.pause(2000);
        }
        txt = await this.maintenanceOrdersText.getText();
        console.log("Maintenance Orders: " + await utils.getAssignedValue(txt));
        await utils.clickWithWait(this.maintenanceOrdersAssignBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await expect(this.maintenanceOrdersHeader).toBeDisplayed();
        count = await utils.getAssignedValue(await this.maintenanceOrdersHeader.getText());
        console.log("Available maintenance orders: " + count);
        if(count===0)
        {
            await utils.clickWithWait(this.footerCancelBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
        }
        else
        {
            await browser.pause(5000);
            const rowCheckbox = await $("(//tr[@role='row'])[2]//div[@role='checkbox']");
            await utils.clickWithWait(rowCheckbox);

            const selectBtn = await $("//button[.//text()='Select']");
            await utils.clickWithWait(selectBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await utils.clickWithWait(this.okBtn);
            await browser.pause(2000);
        }
        txt = await this.maintenancePlansText.getText();
        console.log("Maintenance Plans: " + await utils.getAssignedValue(txt));
        console.log("Maintenance and Service checks end");
        console.log("Closing Assessment detail page...")
        await utils.clickWithWait(this.assessmentDetailCloseBtn);
        console.log("Closed Assessment detail page")
    }

    public async addMaintanableItems()
    {
        console.log("Adding maintanable items...");
        await utils.clickWithWait(this.addMaintainableBtn(this.techObj));
        await browser.pause(3000);
        for (const btn of await this.assignMaintainableItemsBtns) {
            if (await btn.isDisplayed() && await btn.isClickable()) {
                await utils.clickWithWait(btn);
                break;
            }
        }
        await browser.pause(3000);
        await expect(this.assignMaintainableItemsHeader).toBeDisplayed();
        const miText = await this.maintainableItemsText.getText();
        this.assignedMaintainable = await utils.getAssignedValue(miText);
        console.log("Total assigned maintainable are :"+this.assignedMaintainable);
        if(this.assignedMaintainable === 0)
        {
            console.log("No maintainable values are present");
            await utils.clickWithWait(this.cancelBtn);
            return;
        }
        else
        {
            const miValue = await this.maintainableItemValue.getText();
            this.maintanableItems = miValue;
            console.log("Maintainable item is/are : "+miValue);
            await utils.clickWithWait(this.maintainableItemRow);
            await utils.clickWithWait(this.assignBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(5000);
        }
        console.log("Expanding the tenchinal object for maintainable items...");
        await browser.waitUntil(async () => {
            const btns = await this.expandBtn(this.techObj);
            if (await btns.length === 0) return false;

            for (const btn of btns) {
                if (await btn.isDisplayed()) return true;
            }
            return false;
        }, { timeout: 60000, interval: 1000 });
        const expandBtns = await this.expandBtn(this.techObj);
        for (const btn of expandBtns) {
            if (await btn.isDisplayed()) {
                if ((await btn.getAttribute("aria-expanded")) === "false") {
                    await utils.clickWithWait(btn);
                }
                break;
            }
        }
        console.log("Expanded the tenchinal object for maintainable items");
        let found = false;
        for (const item of await this.assignedItem(this.maintanableItems)) {
            if (await item.isDisplayed()) {
                found = true;
                await utils.clickWithWait(await item.$("./ancestor::div[4]"));
                break;
            }
        }
        await expect(found).toBe(true);

        console.log("MaintanableItems Added successfully");
    }

    public async verifyMaintainableDetails()
    {
        if(this.assignedMaintainable === 0)
        return;
        console.log("Verifying Maintainable Item Details...");
        const nameOnly = this.maintanableItems.split(' (')[0];
        await expect(this.maintainableItemHeader(nameOnly)).toBeDisplayed();
        const idMatch = this.maintanableItems?.match(/\((.*?)\)/);
        const idOnly = idMatch ? idMatch[1] : '';
        await expect(this.maintainableItemIdValue(idOnly)).toBeDisplayed();
        const riskText = await this.riskInfoText.getText();
        const riskValue = await utils.getAssignedValue(riskText);
        console.log("Risk Information value: " + riskValue);
        const strategyText = await this.strategyInfoText.getText();
        const strategyValue = await utils.getAssignedValue(strategyText);
        console.log("Strategy value: " + strategyValue);
        for (const btn of await this.closeBtn) {
            if (await btn.isDisplayed() && await btn.isClickable()) {
                await utils.clickWithWait(btn);
                break;
            }
        }
        console.log("Verified Maintainable Item Details");
    }

    public async addFailureModes()
    {
        if(this.assignedMaintainable === 0)
            return;
        console.log("Adding Failure Modes...");
        await utils.clickWithWait(this.failureModeAddBtn(this.maintanableItems));
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("Clicking assign failure mode button...");
        let clicked = false;
        for (const btn of await this.assignFailureModeBtn) {
            if (await btn.isDisplayed().catch(() => false) && await btn.isClickable().catch(() => false)) {
                await btn.scrollIntoView();
                await browser.pause(500);
                await utils.clickWithWait(btn);
                const opened = await this.assignFailureModeHeader.waitForDisplayed({
                    timeout: 10000
                }).then(() => true).catch(() => false);
                if (opened) {
                    clicked = true;
                    break;
                }
            }
        }
        if (!clicked) {
            throw new Error("Assign Failure Mode popup did not open");
        }
        console.log("Assign failure mode button clicked");
        await expect(this.failureModeCountText).toBeDisplayed();
        const fmText = await this.failureModeCountText.getText();
        const count = await utils.getAssignedValue(fmText);
        console.log("Failure Modes count: " + count);
        if (count === 0) {
            await utils.clickWithWait(this.cancelBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
            console.log("Add Failure Modes ends with no available failure mode to assign");
            return;
        }
        this.failureMode = await this.failureModeValue.getText();
        console.log("Failure mode selected :"+this.failureMode);
        await utils.clickWithWait(this.failureModeCheckbox);
        await utils.clickWithWait(this.assignBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await utils.clickWithWait(this.okBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(5000);
        const expandBtn = this.failureModeExpandBtn(this.maintanableItems);
        await expandBtn.waitForDisplayed({ timeout: 60000 });
        await expandBtn.waitForClickable({ timeout: 60000 });
        if ((await expandBtn.getAttribute("aria-expanded")) === "false") {
            await utils.clickWithWait(expandBtn);
        }
        await browser.pause(5000);
        await expect(this.failureModeAssigned(this.failureMode)).toBeDisplayed();
        console.log("Added Failure Modes");
    }

    public async verifyFailureModesDetails()
    {
        if(this.functionValue = "0")
        {
            return;
        }
        if(this.assignedMaintainable === 0)
            return;
        await this.verifyAnalysisDetails();
        await this.verifyRiskInfoDetails();
        await this.verifyRiskMatrix();
    }

    public async verifyAnalysisDetails()
    {
        console.log("Failure Mode Flow starts...");
        if(this.failureModeFunLoc === true)
        {
            const nameOnly = this.failureModeValueFunLoc.split(' (')[0];
            const idOnly = this.failureModeValueFunLoc.match(/\((.*?)\)/)?.[1] || '';
            await utils.clickWithWait(this.failureModeRow(this.failureModeValueFunLoc));
            await browser.pause(5000);
            let isDisplayed = false;
            let actualText = "";

            for (const el of await this.failureModeHeaders(nameOnly)) {
                if (await el.isDisplayed()) {
                    isDisplayed = true;
                    actualText = await el.getText();
                    console.log("Displayed Failure Mode Header: " + actualText);
                    break;
                }
            }

            await expect(isDisplayed).toBe(true);
            await browser.execute(() => window.scrollTo(0, 0));
            await expect(this.failureModeId(idOnly)).toBeDisplayed();
        }
        else
        {
            const nameOnly = this.failureMode.split(' (')[0];
            const idOnly = this.failureMode.match(/\((.*?)\)/)?.[1] || '';
            await utils.clickWithWait(this.failureModeRow(this.failureMode));
            await browser.pause(5000);
            let isDisplayed = false;
            let actualText = "";

            for (const el of await this.failureModeHeaders(nameOnly)) {
                if (await el.isDisplayed()) {
                    isDisplayed = true;
                    actualText = await el.getText();
                    console.log("Displayed Failure Mode Header: " + actualText);
                    break;
                }
            }

            await expect(isDisplayed).toBe(true);
            await expect(this.failureModeId(idOnly)).toBeDisplayed();
        }

        for (const el of await this.analysisDetailsSections) {
            if (await el.isDisplayed() && await el.isClickable()) {
                await utils.clickWithWait(el);
                await utils.waitForBusyIndicatorToDisappear();
                await browser.pause(2000);
                break;
            }
        }

        let txt = await this.failureEffectsText.getText();
        console.log("Failure Effects before: " + await utils.getAssignedValue(txt));
        await utils.clickWithWait(this.failureEffectsAssignBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(3000);
        await expect(this.assignFailureEffectsHeader).toBeDisplayed();

        let count = await utils.getAssignedValue(await this.failureEffectsCountText.getText());
        if (count === 0) {
            await utils.clickWithWait(this.cancelBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
        } else {
            const val = await this.failureEffectsValue.getText();
            console.log("Failure effect selected :"+val);
            await utils.clickWithWait(this.failureEffectsCheckbox);
            await utils.clickWithWait(this.assignBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
            await utils.clickWithWait(this.okBtn);
            await utils.waitForBusyIndicatorToDisappear();
        }
        txt = await this.failureEffectsText.getText();
        console.log("Failure Effects after: " + await utils.getAssignedValue(txt));
        await utils.clickWithWait(this.failureScenarioEditBtn);
        await this.failureScenarioTextarea.setValue("Test Scenario");
        await utils.clickWithWait(this.failureScenarioSaveBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await utils.clickWithWait(this.okBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        txt = await this.failureMechanismText.getText();
        console.log("Failure Mechanisms before: " + await utils.getAssignedValue(txt));
        await utils.clickWithWait(this.failureMechanismAssignBtn);
        await expect(this.assignFailureMechanismHeader).toBeDisplayed();
        count = await utils.getAssignedValue(await this.failureMechanismCountText.getText());
        if (count === 0) {
            await utils.clickWithWait(this.cancelBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
        } else {
            await utils.clickWithWait(this.failureMechanismCheckbox);
            const failVal = await this.failureMechanismValue.getText();
            console.log("Failure value selected :",failVal);
            await utils.clickWithWait(this.assignBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
            await utils.clickWithWait(this.okBtn);
            await utils.waitForBusyIndicatorToDisappear();
        }
        txt = await this.failureMechanismText.getText();
        console.log("Failure Mechanisms after: " + await utils.getAssignedValue(txt));
        await utils.clickWithWait(this.consequencePerformBtn);
        await browser.pause(2000);
        await expect(this.consequenceHeader).toBeDisplayed();
        await utils.clickWithWait(this.hiddenFailureDropdown);
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        await utils.clickWithWait(this.failurePatternDropdown);
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        await utils.clickWithWait(this.safeLifePopupBtn);
        await expect(this.unitPopupHeader).toBeDisplayed();
        await utils.clickWithWait(this.unitOption);
        await this.safeLifeInput.setValue("3");
        await utils.clickWithWait(this.pfIntervalPopupBtn);
        await expect(this.unitPopupHeader).toBeDisplayed();
        await utils.clickWithWait(this.unitOption);
        await this.pfIntervalInput.setValue("2");
        await utils.clickWithWait(this.consequenceSaveBtn);
        await utils.clickWithWait(this.okBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        txt = await this.causesText.getText();
        console.log("Causes before: " + await utils.getAssignedValue(txt));
        await utils.clickWithWait(this.causesAssignBtn);
        await expect(this.assignCausesHeader).toBeDisplayed();
        count = await utils.getAssignedValue(await this.causesCountText.getText());
        if (count === 0) {
            await utils.clickWithWait(this.cancelBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
        } else {
            const causesVal = await this.causesValue.getText();
            console.log("Choosing : "+causesVal);
            await utils.clickWithWait(this.causesCheckbox);
            await utils.clickWithWait(this.assignBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
            await utils.clickWithWait(this.okBtn);
            await utils.waitForBusyIndicatorToDisappear();
        }
        txt = await this.causesText.getText();
        console.log("Causes after: " + await utils.getAssignedValue(txt));
        // for (const el of await this.strategiesTexts) {
        //     if (await el.isDisplayed()) {
        //         console.log("Strategies: " + await utils.getAssignedValue(await el.getText()));
        //     }
        // }
        // await browser.pause(5000);
        // await utils.clickWithWait(this.strategiesCreateBtn);
        // await browser.pause(2000);
        // await expect(this.createStrategyHeader).toBeDisplayed();
        // await browser.pause(5000);
        // //await utils.setValueWithWait(this.strategyDescInput,'Strategies for RCM Automation')
        // // await this.strategyDescInput.waitForDisplayed();
        // // await this.strategyDescInput.click();
        // // await this.strategyDescInput.clearValue();
        // // await this.strategyDescInput.setValue("Strategies for RCM Automation");
        // await this.strategyDescInput.waitForDisplayed({ timeout: 60000 });
        // await browser.execute((el, value) => {
        //     const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
        //     if (input) {
        //         const inp = input as HTMLInputElement;
        //         inp.focus();
        //         inp.value = value;
        //         inp.dispatchEvent(new Event('input', { bubbles: true }));
        //         inp.dispatchEvent(new Event('change', { bubbles: true }));
        //         inp.dispatchEvent(new Event('blur', { bubbles: true }));
        //     }
        // }, await this.strategyDescInput, "Strategies for RCM Automation");
        
        // await browser.pause(2000);
        // await this.strategyLongDesc.setValue("Test Long Desc");
        // await browser.pause(2000);
        // await utils.clickWithWait(this.strategyTypeDropdown);
        // await browser.keys("ArrowDown");
        // await browser.keys("Enter");
        // const today = new Date();
        // const tomorrow = new Date();
        // tomorrow.setDate(today.getDate() + 1);
        // const format = (d: Date): string => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        // await this.strategyStartDate.setValue(format(today));
        // await this.strategyDueDate.setValue(format(tomorrow));
        // await utils.clickWithWait(this.strategyCreateBtn);
        // await utils.waitForBusyIndicatorToDisappear();
        // await browser.pause(2000);
        // for (const el of await this.strategiesTexts) {
        //     if (await el.isDisplayed()) {
        //         console.log("Strategies after: " + await utils.getAssignedValue(await el.getText()));
        //     }
        // }

        console.log("Failure Mode Flow ends");
    }

    public async verifyRiskInfoDetails()
    {
        console.log("Handle Risk Information starts...");
        for (const el of await this.riskInformationSections) {
            if (await el.isDisplayed()) {
                await utils.clickWithWait(el);
                await browser.pause(1000);
                break;
            }
        }
        await this.riskSearchInput.waitForClickable({ timeout: 60000 });
        await utils.clickWithWait(this.editRiskBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        const format = (d: Date): string => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const today = new Date();

        const t1 = await this.transitionTextRow1.getText();
        console.log("Editing Transition " + t1);
        await utils.setValueWithWait(this.lastTransitionDateRow1, format(today));
        const getRandomRisk1 = () => assetRcmData.riskValues[Math.floor(Math.random() * assetRcmData.riskValues.length)];
        await utils.setValueWithWait(this.sheRiskDropdownRow1, getRandomRisk1());
        await browser.pause(2000);
        await utils.setValueWithWait(this.finRiskDropdownRow1, getRandomRisk1());
        await browser.pause(2000);
        await utils.setValueWithWait( this.finConsequenceRow1, (Math.floor(Math.random() * (1000000 - 400000 + 1)) + 400000).toString());
        await browser.pause(2000);
        for (const el of await this.finPofRow1) {
            if (await el.isDisplayed().catch(() => false) && await el.isClickable().catch(() => false)) {
                await utils.setValueWithWait(el, (Math.random()).toFixed(2));
                break;
            }
        }
        await browser.pause(2000);

        const t2 = await this.transitionTextRow2.getText();
        console.log("Editing Transition " + t2);
        await utils.setValueWithWait(this.lastTransitionDateRow2, format(today));
        await browser.pause(2000);
        const getRandomRisk2 = () => assetRcmData.riskValues[Math.floor(Math.random() * assetRcmData.riskValues.length)];
        await utils.setValueWithWait(this.sheRiskDropdownRow2, getRandomRisk2());
        await browser.pause(2000);
        await utils.setValueWithWait(this.finRiskDropdownRow2, getRandomRisk2());
        await browser.pause(2000);
        await utils.setValueWithWait(this.finConsequenceRow2, (Math.floor(Math.random() * (1000000 - 400000 + 1)) + 400000).toString());
        await browser.pause(2000);
        for (const el of await this.finPofRow2) {
            if (await el.isDisplayed().catch(() => false) && await el.isClickable().catch(() => false)) {
                await utils.setValueWithWait(el, (Math.random()).toFixed(2));
                break;
            }
        }

        const t3 = await this.transitionTextRow3.getText();
        console.log("Editing Transition " + t3);
        await utils.setValueWithWait(this.lastTransitionDateRow3, format(today));
        await browser.pause(2000);
        const getRandomRisk3 = () => assetRcmData.riskValues[Math.floor(Math.random() * assetRcmData.riskValues.length)];
        await utils.setValueWithWait(this.sheRiskDropdownRow3, getRandomRisk3());
        await browser.pause(2000);
        await utils.setValueWithWait(this.finRiskDropdownRow3, getRandomRisk3());
        await browser.pause(2000);
        await utils.setValueWithWait(this.finConsequenceRow3, (Math.floor(Math.random() * (1000000 - 400000 + 1)) + 400000).toString());
        await browser.pause(2000);
        for (const el of await this.finPofRow3) {
            if (await el.isDisplayed().catch(() => false) && await el.isClickable().catch(() => false)) {
                await utils.setValueWithWait(el, (Math.random()).toFixed(2));
                break;
            }
        }

        const t4 = await this.transitionTextRow4.getText();
        console.log("Editing Transition " + t4);
        await utils.setValueWithWait(this.lastTransitionDateRow4, format(today));
        await browser.pause(2000);
        const getRandomRisk4 = () => assetRcmData.riskValues[Math.floor(Math.random() * assetRcmData.riskValues.length)];
        await utils.setValueWithWait(this.sheRiskDropdownRow4, getRandomRisk4());
        await browser.pause(2000);
        await utils.setValueWithWait(this.finRiskDropdownRow4, getRandomRisk4());
        await browser.pause(2000);
        await utils.setValueWithWait(this.finConsequenceRow4, (Math.floor(Math.random() * (1000000 - 400000 + 1)) + 400000).toString());
        await browser.pause(2000);
        for (const el of await this.finPofRow4) {
            if (await el.isDisplayed().catch(() => false) && await el.isClickable().catch(() => false)) {
                await utils.setValueWithWait(el, (Math.random()).toFixed(2));
                break;
            }
        }

        await utils.clickWithWait(this.saveRiskBtn);
        await browser.pause(1500);
        console.log("Handle Risk Information ends");
    }

    public async verifyRiskMatrix()
    {
        console.log("Verification of risk matrix starts...");
            for (const el of await this.riskMatrixSections) {
            if (await el.isDisplayed()) {
                await utils.clickWithWait(el);
                await browser.pause(1000);
                break;
            }
        }
        console.log("Risk Matrix: " + await this.riskMatrixTitle.getText());
        console.log(await this.finTodayText.getText());
        console.log("FIN PoF = " + await this.finPofValue.getText());
        console.log("FIN CoF ($K) = " + await this.finCofValue.getText());
        for (const btn of await this.closeBtn) {
            if (await btn.isDisplayed() && await btn.isClickable()) {
                await utils.clickWithWait(btn);
                break;
            }
        }
        console.log("Risk matrix ends");
    }

    public async addFunLocTechObj()
    {
        utils.switchToIframe(this.rcmIframe);
        await utils.clickWithWait(this.infoTab);
        await browser.pause(5000);

        console.log("Navigating to Assessment Tab");
        utils.switchToIframe(this.rcmIframe);
        await utils.clickWithWait(this.assessmentTab);
        console.log("Navigated to Assessment tab");
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(3000);
        utils.switchToIframe(this.rcmIframe);
        await browser.pause(5000);

        console.log("Assigning Functional Location as technical object");

        let assigned = false;
        let i = 2;

        while (!assigned && i <= 50) {

            console.log(`Trying checkbox index: ${i}`);

            if (await this.hierarchyMoreBtn.isDisplayed().catch(() => false)) {
                await utils.clickWithWait(this.hierarchyMoreBtn);
                await browser.pause(1000);
            }

            await utils.clickWithWait(this.assignTechObjBtn);
            await browser.pause(1000);
            await browser.keys("ArrowDown");
            await browser.keys("ArrowDown");
            await browser.keys("Enter");

            await browser.pause(3000);
            await expect(this.functionalLocationHeader).toBeDisplayed();
            await browser.pause(5000);
            const checkBox = this.checkBoxByIndex(i);
            await checkBox.waitForClickable({ timeout: 60000 });
            await utils.clickWithWait(checkBox);

            // await this.selectFunctionalLocationAndStore(i);
            const isValidLocation=await this.selectFunctionalLocationAndStore(i);

            if(!isValidLocation){

                console.log("Unchecking invalid functional location");

                await utils.clickWithWait(checkBox);
                await browser.pause(1500);
                const close = await $("//footer//button[.//text()='Close']");
                await utils.clickWithWait(close);
                i++;

                continue;
            }

            await utils.switchToIframe(this.rcmIframe);
            await browser.pause(5000);
            await utils.clickWithWait(this.confirmBtn);
            await utils.waitForBusyIndicatorToDisappear();

            await browser.waitUntil(
                async () =>
                    (await this.okBtn.isDisplayed()) ||
                    (await this.warningMsg.isDisplayed()),
                { timeout: 60000 }
            );

            if (await this.okBtn.isDisplayed()) {
                console.log("Functional Location assigned successfully");
                await utils.clickWithWait(this.okBtn);
                assigned = true;
            } else {
                console.log("Warning displayed, retrying...");
                await utils.clickWithWait(this.warningOkBtn);
                i++;
            }
        }
        console.log("The functional location selected is :",this.selectedFunctionalLocation);
        console.log("Verifying if functional location is added or not...");
        const data = this.selectedFunctionalLocation;
        const cleanName = data.locationName.replace(/\\+/g, '\\');
        this.funcLocObj = `${cleanName} (${data.locationId})`;
        await this.functionalLocationRow(this.funcLocObj).waitForDisplayed({ timeout: 60000 });
        console.log("Functional location is added");
        console.log("Functional Location assigned");
    }

    // public async selectFunctionalLocationAndStore(i: number) {
    //     console.log("Store functional location data start");
    //     const row = await this.getRowByIndex(i);
    //     const locationId = await row.$(".//td[@aria-colindex='2']//span").getText();
    //     const locationName = await row.$("(.//td[@aria-colindex='2']//span/following::span[1])[1]").getText();
    //     this.selectedFunctionalLocation = { locationId, locationName };
    //     console.log("Store functional location data end");
    // }

    public async selectFunctionalLocationAndStore(i:number){
        console.log("Store functional location data start");

    const row=await this.getRowByIndex(i);

    const locationId=await row.$(".//td[@aria-colindex='2']//span").getText();

    const locationNameElements=await row.$$(".//td[@aria-colindex='2']//span");

    let locationName="";

    for(const el of locationNameElements){

        const text=(await el.getText()).trim();

        if(
            text &&
            text!==locationId &&
            !text.includes("Technical system")
        ){
            locationName=text;
            break;
        }
    }

    // ===== CHANGED START =====
    if(!locationName){

        console.log(`Invalid Functional Location at index ${i}`);

        return false;
    }
    // ===== CHANGED END =====

    this.selectedFunctionalLocation={locationId,locationName};

    console.log("Selected Functional Location :",this.selectedFunctionalLocation);

    console.log("Store functional location data end");

    return true;
    }

    public async verifyDetailPageFunLoc()
    {
        console.log("Navigating to detail page of functional location...");
        await utils.clickWithWait(this.functionalLocationRowClick(this.funcLocObj));
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2500);
        console.log("Navigated to Functional location detail page data");
        const data = this.selectedFunctionalLocation;
        const cleanName = data.locationName.replace(/\\+/g, '\\');
        const nameOnly = cleanName;
        const idOnly = data.locationId;
        await browser.pause(3000);
        await utils.waitForBusyIndicatorToDisappear();
        let isDisplayed2 = false;
        for (const el of await this.headerTechnicalObjectId(idOnly)) {
            if (await el.isDisplayed()) {
                isDisplayed2 = true;
                break;
            }
        }
        await expect(isDisplayed2).toBe(true);

        let isDisplayed = false;
        for (const el of await this.headerTechnicalObjectName(nameOnly)) {
            if (await el.isDisplayed()) {
                isDisplayed = true;
                break;
            }
        }

        await expect(isDisplayed).toBe(true);
        console.log(`Verified Functional Location -> ${nameOnly} (${idOnly})`);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(3000);
        console.log("Navigating to Risk Information");
        for (const el of await this.riskInformationSections) {
            if (await el.isDisplayed()) {
                await utils.clickWithWait(el);
                await browser.pause(2000);
                break;
            }
        }

        await expect(this.riskInformationHeader).toBeDisplayed();
        await browser.pause(2500);
        const riskVal = await utils.getAssignedValue(await this.riskInformationHeader.getText());
        console.log("Assigned Risk Informations is/are :", riskVal);
        let headerText = "";

        for (const el of await this.strategiesHeader) {
            if (await el.isDisplayed().catch(() => false)) {
                headerText = await el.getText();
                break;
            }
        }

        const strategyVal = await utils.getAssignedValue(headerText);
        console.log("Assigned strategies is/are :", strategyVal);

        if (strategyVal > 0) {
            await this.strategiesExpandBtn.waitForDisplayed({ timeout: 60000 });

            if ((await this.strategiesExpandBtn.getAttribute("aria-expanded")) === "false") {
                await utils.clickWithWait(this.strategiesExpandBtn);
                await browser.pause(2000);
            }

            for (const row of await this.strategiesRows) {
                if (await row.isDisplayed().catch(() => false)) {
                    console.log("Strategy Row: " + await row.getText());
                }
            }
        }

        await this.recommendationHeader.waitForDisplayed({ timeout: 60000 });
        const recommendationVal = await utils.getAssignedValue(await this.recommendationHeader.getText());
        console.log("Assigned Recoomendations is/are :", recommendationVal);

        if(await utils.getAssignedValue(await this.recommendationHeader.getText()) >0)
        {
            await this.recommendationExpandBtn.waitForDisplayed({ timeout: 60000 });
            if ((await this.recommendationExpandBtn.getAttribute("aria-expanded")) === "false") {
                await utils.clickWithWait(this.recommendationExpandBtn);
                await browser.pause(2500);
            }

            for (const val of await this.recommendationRCMValues) {
                if (await val.isDisplayed()) {
                    console.log("Recommendation RCM: " + await val.getText());
                }
            }
        }
        
        console.log("Navigating to maintenance and service sections...");
        for (const el of await this.maintenanceServiceSections) {
            if (await el.isDisplayed() && await el.isClickable()) {
                await utils.clickWithWait(el);
                await browser.pause(2500);
                break;
            }
        }


        let txt = await this.maintenanceNotifText.getText();
        console.log("Maintenance Notifications: " , await utils.getAssignedValue(txt));
        await utils.clickWithWait(this.maintenanceNotifAssignBtn);
        await browser.pause(2500);
        await expect(this.maintenanceNotifHeader).toBeDisplayed();
        console.log("Available Notifications: " , await utils.getAssignedValue(await this.maintenanceNotifHeader.getText()));
        await utils.clickWithWait(this.footerCancelBtn);
        await browser.pause(2500);
        txt = await this.maintenanceOrdersText.getText();
        console.log("Maintenance Orders: " , await utils.getAssignedValue(txt));

        await utils.clickWithWait(this.maintenanceOrdersAssignBtn);
        await browser.pause(2500);
        await expect(this.maintenanceOrdersHeader).toBeDisplayed();
        console.log("Available Orders: " , await utils.getAssignedValue(await this.maintenanceOrdersHeader.getText()));
        await utils.clickWithWait(this.footerCancelBtn);
        await browser.pause(2500);

        txt = await this.maintenancePlansText.getText();
        console.log("Maintenance Plans: " , await utils.getAssignedValue(txt));

        let clicked = false;
        for (const btn of await this.closeBtn) {
            try {
                if (await btn.isDisplayed()) {
                    await browser.execute((el) => el.click(), await btn);
                    clicked = true;
                    break;
                }
            } catch {}
        }
        if (!clicked) {
            console.log("No close button clicked");
        }
    }

    public async assignFunctions()
    {
        const data = this.selectedFunctionalLocation;

        console.log("---- Test start for assigning functions ----");

        await utils.clickWithWait(this.functionalLocationAddBtn(data.locationName, data.locationId));
        let functionClicked = false;

        for (const btn of await this.assignFunctionsBtn) {
            if (await btn.isDisplayed() && await btn.isClickable()) {
                await utils.clickWithWait(btn);
                await browser.pause(2500);
                functionClicked = true;
                break;
            }
        }

        if (!functionClicked) {
            console.log("Assign Functions not present, only Maintainable Items available");
            return;
        }
        await browser.pause(3000);
        await this.assignFunctionsHeader.waitForDisplayed({ timeout: 60000 });
        const fnText = await this.functionsCountText.getText();
        const fnCount = await utils.getAssignedValue(fnText);
        console.log("Available Functions: " + fnCount);

        if (fnCount === 0) {
            await utils.clickWithWait(this.cancelBtn);
            await browser.pause(2500);
            console.log("No Functions available");
        } else {
            const fnValue = await this.firstFunctionValue.getText();

            if (!fnValue) {
                throw new Error("Function Value is empty");
            }

            this.functionValue = fnValue;

            await utils.clickWithWait(this.firstFunctionCheckbox);
            await utils.clickWithWait(this.assignBtn);
            await browser.pause(2500);

            console.log("Functions assigned: " + fnValue);
        }

        await browser.pause(5000);

        for (const btn of await this.expandBtnForFuncLoc(data.locationName, data.locationId)) {
            if (await btn.isDisplayed() && (await btn.getAttribute("aria-expanded")) === "false") {
                await utils.clickWithWait(btn);
                await browser.pause(2500);
                break;
            }
        }

        let found = false;
        if (!this.functionValue) {
            throw new Error("functionValue not set");
        }

        for (const el of await this.functionRow(this.functionValue)) {
            if (await el.isDisplayed()) {
                found = true;
                await utils.clickWithWait(this.functionRowClick(this.functionValue));
                await browser.pause(2500);
                break;
            }
        }

        if (!found) {
            console.log("Function NOT found:", this.functionValue);
        }

        await expect(found).toBe(true);
        console.log("Function opened from list: " + this.functionValue);
        console.log("Closing detail page...");
        console.log("Closing detail page..."); 
        for (const btn of await this.closeBtn) 
            { if (await btn.isDisplayed() && await btn.isClickable()) 
            { await utils.clickWithWait(btn);
                await browser.pause(2500); break; 
            }
        }

        await this.assignFunctionsHeader.waitForDisplayed({ reverse: true, timeout: 10000 });
        console.log("Function detail view closed");
    }

    public async assignFunctionalFailure()
    {
        if(this.functionValue = "0")
        {
            return;
        }
        console.log("Assinging functional failures...")
        const data = this.selectedFunctionalLocation;
        await utils.clickWithWait(this.functionalFailureAddBtn(this.functionValue));
        await browser.pause(5000);
        for (const btn of await this.expandBtnForFuncLoc(data.locationName, data.locationId)) {
            if (await btn.isDisplayed() && (await btn.getAttribute("aria-expanded")) === "false") {
                await utils.clickWithWait(btn);
                await browser.pause(2500);
                break;
            }
        }
        await browser.pause(3000);
        let ffClicked = false;
        for (const btn of await this.assignFunctionalFailureBtn) {
            if (await btn.isDisplayed() && await btn.isClickable()) {
                await utils.clickWithWait(btn);
                await browser.pause(2500);
                ffClicked = true;
                break;
            }
        }

        if (!ffClicked) {
            console.log("Assign Functional Failure not present");
            return;
        }

        await this.assignFunctionalFailureHeader.waitForDisplayed({ timeout: 60000 });
        const ffText = await this.functionalFailureCountText.getText();
        const ffCount = await utils.getAssignedValue(ffText);
        console.log("Available Functional Failures: " + ffCount);

        if (ffCount === 0) {
            await utils.clickWithWait(this.cancelBtn);
            await browser.pause(2500);
            return;
        }

        const ffValue = await this.firstFunctionalFailureValue.getText();
        this.functionalFailureValue = ffValue;

        await utils.clickWithWait(this.firstFunctionalFailureCheckbox);
        await utils.clickWithWait(this.assignBtn);
        await browser.pause(2500);
        await utils.clickWithWait(this.okBtn);

        console.log("Functional Failure assigned: " + ffValue);
        await browser.pause(5000);

        for (const btn of await this.expandBtnForFunc(this.functionValue)) {
            if ((await btn.getAttribute("aria-expanded")) === "false") {
                await utils.clickWithWait(btn);
                break;
            }
        }

        let found = false;
        for (const el of await this.functionalFailureRow(this.functionalFailureValue)) {
            if (await el.isDisplayed()) {
                found = true;
                await utils.clickWithWait(this.functionalFailureRowClick(this.functionalFailureValue));
                await browser.pause(2500);
                break;
            }
        }

        await expect(found).toBe(true);

        console.log("Verified Functional Failure: " + this.functionalFailureValue);

        for (const btn of await this.closeBtn) {
            if (await btn.isDisplayed() && await btn.isClickable()) {
                await utils.clickWithWait(btn);
                await browser.pause(2500);
                break;
            }
        }
    }

    public async addMaintainableItemsForFuncLoc() {
        if(this.functionValue = "0")
        {
            return;
        }
        console.log("Add Maintainable Items For FuncLoc starts...");
        await utils.clickWithWait(this.addMaintainableBtn(this.functionalFailureValue));
        let clicked = false;
        for (const btn of await this.assignMaintainableItemsBtn) {
            if (await btn.isDisplayed() && await btn.isClickable()) {
                await utils.clickWithWait(btn);
                await browser.pause(2500);
                clicked = true;
                break;
            }
        }

        if (!clicked) {
            console.log("Assign Maintainable Items not present");
            return;
        }
        await browser.pause(3000);
        await this.assignMaintainableItemsHeader.waitForDisplayed({ timeout: 60000 });
        const txt = await this.maintainableItemsText.getText();
        const count = await utils.getAssignedValue(txt);
        console.log("Available Maintainable Items: " + count);
        if (count === 0) {
            await utils.clickWithWait(this.cancelBtn);
            this.maintenableItemFunLoc = true;
            await browser.pause(2500);
            return;
        }

        const value = await this.maintainableItemValue.getText();
        this.maintainableItemValueFunLoc = value;
        await utils.clickWithWait(this.maintainableItemRow);
        await utils.clickWithWait(this.assignBtn);
        await browser.pause(2500);
        await utils.clickWithWait(this.okBtn);
        await browser.pause(2500);

        console.log("Maintainable Item assigned: " + value);
        await browser.pause(5000);
        for (const btn of await this.expandBtnForFuncFail(this.functionalFailureValue)) {
            if ((await btn.getAttribute("aria-expanded")) === "false") {
                await utils.clickWithWait(btn);
                await browser.pause(2500);
                break;
            }
        }

        let found = false;
        for (const el of await this.assignedItem(this.maintainableItemValueFunLoc)) {
            if (await el.isDisplayed()) {
                found = true;
                await utils.clickWithWait(this.functionalFailureRowClick(this.maintainableItemValueFunLoc));
                break;
            }
        }
        await expect(found).toBe(true);

        console.log("Verified Maintainable Item: " + this.maintainableItemValueFunLoc);
        const riskText = await this.riskInfoText.getText();
        const riskValue = await utils.getAssignedValue(riskText);
        console.log("Risk Information value: " + riskValue);
        const strategyText = await this.strategyInfoText.getText();
        const strategyValue = await utils.getAssignedValue(strategyText);
        console.log("Strategy value: " + strategyValue);

        console.log("Closing detail page...");
        await utils.switchToIframe(this.rcmIframe);
        await browser.pause(5000);
        for (const btn of await this.closeBtn) {
            if (await btn.isDisplayed() && await btn.isClickable()) {
                await utils.clickWithWait(btn);
                await browser.pause(2500);
                break;
            }
        }

        console.log("Add Maintainable Items For FuncLoc ends");
    }

    public async addFailureModesForFuncLoc() {
        if(this.functionValue = "0")
        {
            return;
        }
        if(this.maintenableItemFunLoc === true)
        {
            return;
        }
        console.log("Adding Failure Modes...");
        await browser.pause(2000);
        await utils.clickWithWait(this.failureModeAddBtn(this.maintainableItemValueFunLoc));
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log("Clicking assign falilure mode button...");
        for (const btn of await this.assignFailureModeBtn) {
            if (await btn.isDisplayed() && await btn.isClickable()) {
                await utils.clickWithWait(btn);
                break;
            }
        }
        console.log("Assign falilure mode button clicked");

        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await expect(this.assignFailureModeHeader).toBeDisplayed();
        const fmText = await this.failureModeCountText.getText();
        const count = await utils.getAssignedValue(fmText);
        console.log("Failure Modes count: " + count);
        if (count === 0) {
            await utils.clickWithWait(this.cancelBtn);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(1500);
            await utils.waitForBusyIndicatorToDisappear();
            await browser.pause(2000);
            console.log("addFailureModes end");
            return;
        }
        this.failureModeValueFunLoc = await this.failureModeValue.getText();
        console.log("Failure mode selected :"+this.failureModeValueFunLoc);
        await utils.clickWithWait(this.failureModeCheckbox);
        await utils.clickWithWait(this.assignBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(1500);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        await utils.clickWithWait(this.okBtn);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(5000);
        const expandBtn = this.failureModeExpandBtn(this.maintainableItemValueFunLoc);
        await expandBtn.waitForDisplayed({ timeout: 60000 });
        await expandBtn.waitForClickable({ timeout: 60000 });
        this.failureModeFunLoc = true;
        if ((await expandBtn.getAttribute("aria-expanded")) === "false") {
            await utils.clickWithWait(expandBtn);
        }
        await browser.pause(5000);
        await expect(this.failureModeAssigned(this.failureModeValueFunLoc)).toBeDisplayed();
        console.log("Added Failure Modes");
    }

    async addDocument() {
        const addLinkBtn = await $('//button[.//bdi[text()="Add"]]');
        await utils.clickWithWait(addLinkBtn,1000);
        await browser.pause(2000);
        await utils.switchToIframe(this.rcmIframe);
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
        await utils.switchToIframe(this.rcmIframe);
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
        await utils.switchToIframe(this.rcmIframe);
        await this.attachmentTab.waitForDisplayed({ timeout: 50000 });
        await this.attachmentTab.click();
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(4000);
        const addAttachmentBtn = await $$('//button[.//text()="Assign"]');
        for (const btn of await addAttachmentBtn) 
        {   
            if (await btn.isDisplayed() && await btn.isClickable()) 
            { 
                await utils.clickWithWait(btn); 
                await browser.pause(2500); break; 
            } 
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
        await utils.switchToIframe(this.rcmIframe);
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

    public async downloadSummaryReport() {

        console.log("Downloading Summary Report for RCM...");
        await (await this.summaryReportBtn).click();
        await (await this.downloadReportHeader).waitForDisplayed({ timeout: 20000 });
        if (await (await this.includeAllTechObjText).isDisplayed().catch(() => false)) {
            await (await this.includeAllTechObjText).click();
        }
        await (await this.downloadReportOkBtn).click();
        await browser.pause(3000);
        await utils.waitForBusyIndicatorToDisappear();

        if (await (await this.confirmationYesBtn).isDisplayed().catch(() => false)) {
            await (await this.confirmationYesBtn).click();
        }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(4000);
        await utils.clickWithWait(this.okBtn);
        await utils.waitForBusyIndicatorToDisappear();

        const filePath = await utils.waitForDownload('.pdf');
        const pdfContent = await utils.extractTextFromPDF(filePath);

        console.log("----- PDF CONTENT START -----");
        console.log(pdfContent);
        console.log("----- PDF CONTENT END -----");

        const normalize = (val: string) =>
            (val || "").toLowerCase().replace(/[^a-z0-9]/g, "");

        const content = normalize(pdfContent);

        const verifyValue = (label: string, value: string) => {
            if (!value) {
                console.log(`${label} skipped (empty)`);
                return;
            }

            console.log(`\nVerifying ${label}: ${value}`);

            const norm = normalize(value);

            if (value.includes("(")) {
                const match = value.match(/(.*)\((.*)\)/);
                if (match) {
                    const name = normalize(match[1]);
                    const id = normalize(match[2]);

                    const hasName = content.includes(name);
                    const hasId = content.includes(id);

                    console.log(`Name check (${name}): ${hasName}`);
                    console.log(`ID check (${id}): ${hasId}`);

                    expect(hasName && hasId).toBe(true);
                    return;
                }
            }

            const result = content.includes(norm);
            console.log(`Check (${norm}): ${result}`);
            expect(result).toBe(true);
        };

        verifyValue("techObj", this.techObj);
        verifyValue("maintanableItems", this.maintanableItems);
        verifyValue("failureMode", this.failureMode);
        verifyValue("funcLocObj", this.funcLocObj);
        verifyValue("functionValue", this.functionValue);
        verifyValue("functionalFailureValue", this.functionalFailureValue);
        verifyValue("maintainableItemValueFunLoc", this.maintainableItemValueFunLoc);

        console.log("PDF Summary report verification completed");
    }

    public async deleteRCM()
    {
        console.log("Deleting the RCM...");
        console.log("Deleting :"+assetRCMListView.assetRCMDisplayID);
        if (await this.headerMoreBtn.isDisplayed().catch(() => false)) {
            await utils.clickWithWait(this.headerMoreBtn);
            await browser.pause(1000);
        }
        await utils.clickWithWait(this.manageBtn);
        await browser.pause(1000);
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        await this.deleteConfirmText.waitForDisplayed({ timeout: 60000 });
        await utils.clickWithWait(this.confirmOkBtn);
        await this.okBtn.waitForDisplayed({ timeout: 60000 });
        await utils.clickWithWait(this.okBtn);
        console.log("RCM deleted successfully");
    }
}
export default new assetRCMDetailView();