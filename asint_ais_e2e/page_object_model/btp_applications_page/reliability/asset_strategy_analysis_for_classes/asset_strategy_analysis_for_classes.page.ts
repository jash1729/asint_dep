import { $, browser } from '@wdio/globals';
import utils from '../../../../utils/utils';

export interface CreateAssessmentInput {
    description: string;
    className: string;
    /** Optional Failure Data Profile description (e.g. "Pump - Centrifugal V"). If omitted, the first row is selected. */
    failureDataProfile?: string;
}

export interface PlanningDataInput {
    lastReviewDate?: string;
    nextReviewDate?: string;
    plannedReviewDate?: string;
    nextTADate?: string;
    secondTADate?: string;
}

export interface OrganizationalDataInput {
    planningPlant?: string;
    maintenancePlant?: string;
}

export interface RolesAssignmentInput {
    /** Role names to add (must match the labels in the Add Role dialog list, e.g. "Facilitator", "Reliability Engineer"). */
    roles: readonly string[];
    /** Display name of the user to assign to each role (e.g. "Krishna Pala"). */
    user: string;
}

export interface CharacteristicSelection {
    /** Stable characteristic id as shown in the row label, e.g. "CENF_IMPELLER". */
    id: string;
    /** Value to pick from the characteristic's multi-combobox dropdown, e.g. "OPEN". */
    value?: string;
    /**
     * 1-based index of the option to pick from the characteristic's dropdown.
     * Takes precedence over `value` when supplied.
     */
    valueIndex?: number;
}

export interface OperatingContextAndConditionInput {
    /** Operating Context and Condition Name (the textarea at the top of the dialog). */
    name: string;
    /** Characteristics to add and assign values for, in the order they should be processed. */
    characteristics: readonly CharacteristicSelection[];
}

class AssetStrategyAnalysisForClassesPage {

    /* ========================
       SELECTORS
       ======================== */

    private get appTile() { return $('//a[starts-with(@aria-label, "Asset Strategy Analysis for Classes")]'); }
    private get appIframe() { return $('iframe[data-help-id="application-fleet-manage"]'); }
    private get createButton() { return $('button[aria-label="Create"]'); }
    private get createDialog() { return $('//div[@role="dialog"][.//h1[normalize-space()="Create Assessment"]]'); }
    private get descriptionInput() { return $('//div[@role="dialog"][.//h1[normalize-space()="Create Assessment"]]//bdi[normalize-space()="Description"]/ancestor::label/following::textarea[1]'); }
    private get classValueHelpIcon() { return $('//div[@role="dialog"][.//h1[normalize-space()="Create Assessment"]]//bdi[normalize-space()="Class"]/ancestor::label/following::span[@aria-label="Show Value Help"][1]'); }
    private get failureDataProfileValueHelpIcon() { return $('//div[@role="dialog"][.//h1[normalize-space()="Create Assessment"]]//bdi[normalize-space()="Failure Data Profile"]/ancestor::label/following::span[@aria-label="Show Value Help"][1]'); }
    private get templateArrow() { return $('//div[@role="dialog"][.//h1[normalize-space()="Create Assessment"]]//bdi[normalize-space()="Select Template"]/ancestor::label/following::span[@role="button"][1]'); }
    private get createAsBaselineCheckbox() { return $('//div[@role="dialog"][.//h1[normalize-space()="Create Assessment"]]//div[contains(@class,"sapMCb")][.//bdi[contains(normalize-space(),"Baseline")] or .//label[contains(normalize-space(),"Baseline")] or @aria-labelledby[contains(.,"Baseline")]] | //div[@role="dialog"][.//h1[normalize-space()="Create Assessment"]]//*[self::label or self::span or self::bdi][contains(normalize-space(),"Create as Baseline") or contains(normalize-space(),"Create As Baseline")]/preceding::div[contains(@class,"sapMCb")][1]'); }
    private get dialogCreateButton() { return $('//div[@role="dialog"][.//h1[normalize-space()="Create Assessment"]]//footer//bdi[normalize-space()="Create"]/ancestor::button'); }
    private get valueHelpFirstRow() { return $('(//div[contains(@class,"sapMDialog")][.//table or .//tbody]//tbody/tr[@role="row"])[1]'); }
    private failureDataProfileRowByDescription(description: string) { return $(`//div[contains(@class,"sapMDialog")]//tbody/tr[@role="row"][.//*[normalize-space()=${utils.xpathString(description)}]]`); }
    private classValueHelpRow(className: string) { return $(`//div[contains(@class,"sapMDialog")]//tr[@role="row"][.//*[normalize-space()=${utils.xpathString(className)}]]`); }
    private get comboboxFirstOption() { return $('(//ul[@role="listbox" and not(ancestor::*[contains(@style,"display: none")])]//li[@role="option"])[1]'); }
    private get saveButton() { return $('//button[@data-ui5-accesskey="s"][.//bdi[normalize-space()="Save"]]'); }
    private get okButton() { return $('//button[@data-ui5-accesskey="o" or @data-ui5-accesskey="y" or ancestor::*[contains(@class,"sapMMessageBox") or contains(@class,"sapMDialogMessage") or @role="alertdialog"]][.//bdi[normalize-space()="OK" or normalize-space()="Ok" or normalize-space()="Yes"]]'); }
    private get manageButton() { return $('//button[@aria-haspopup="menu"][.//bdi[normalize-space()="Manage"]]'); }
    private get deleteMenuItem() { return $('//div[@role="menu"]//li[.//*[normalize-space()="Delete"]] | //ul[@role="menu"]//li[.//*[normalize-space()="Delete"]]'); }
    private get listSearchInput() { return $('//input[@type="search" and @aria-label="Search"]'); }
    private listRowByDescription(description: string) { return $(`//tr[@role="row"][.//*[normalize-space()=${utils.xpathString(description)}]]`); }
    private get editButton() { return $('//button[@data-ui5-accesskey="e"][.//bdi[normalize-space()="Edit"]]'); }
    private get editDescriptionInput() { return $('//bdi[normalize-space()="Description"]/ancestor::label/following::textarea[1] | //bdi[normalize-space()="Description"]/ancestor::label/following::input[1]'); }
    private editButtonByIndex(index: number) { return $(`(//button[@data-ui5-accesskey="e"][.//bdi[normalize-space()="Edit"]])[${index}]`); }
    private planningDataPickerIcon(label: string) { return $(`//label[.//bdi[normalize-space()=${utils.xpathString(label)}]]/following::span[@aria-label="Open Picker"][1]`); }
    /**
     * Selectors for the calendar popover. SAPUI5 keeps previously-opened popovers
     * in the DOM (hidden via CSS class, not inline style) so we must always pick
     * the LAST popover that is not aria-hidden, otherwise waitForDisplayed will
     * latch onto a stale, invisible one and time out.
     */
    private static readonly OPEN_POPOVER_XPATH =
        '(//div[contains(@class,"sapMPopover") and not(contains(@style,"display: none")) and not(contains(@style,"visibility: hidden")) and not(@aria-hidden="true")][.//*[contains(@class,"sapUiCal")]])[last()]';
    private get visibleCalendarPopover() { return $(AssetStrategyAnalysisForClassesPage.OPEN_POPOVER_XPATH); }
    private get calendarHeaderMonthButton() { return $(`${AssetStrategyAnalysisForClassesPage.OPEN_POPOVER_XPATH}//button[contains(@class,"sapUiCalHeadB")][1]`); }
    private get calendarHeaderYearButton() { return $(`${AssetStrategyAnalysisForClassesPage.OPEN_POPOVER_XPATH}//button[contains(@class,"sapUiCalHeadB")][2]`); }
    private get calendarPrevButton() { return $(`${AssetStrategyAnalysisForClassesPage.OPEN_POPOVER_XPATH}//button[contains(@class,"sapUiCalHeadBPrev") or @aria-label="Previous"]`); }
    private get calendarNextButton() { return $(`${AssetStrategyAnalysisForClassesPage.OPEN_POPOVER_XPATH}//button[contains(@class,"sapUiCalHeadBNext") or @aria-label="Next"]`); }
    private calendarDayByDataAttr(yyyymmdd: string) { return $(`${AssetStrategyAnalysisForClassesPage.OPEN_POPOVER_XPATH}//*[(@data-sap-day=${utils.xpathString(yyyymmdd)} or @data-sap-ui-date=${utils.xpathString(yyyymmdd)}) and not(contains(@class,"sapUiCalItemOtherMonth"))]`); }
    private organizationalDataValueHelpIcon(label: string) { return $(`//label[.//bdi[normalize-space()=${utils.xpathString(label)}]]/following::span[@aria-label="Show Value Help"][1]`); }

    /* --- Roles section --- */
    private get addRoleButton() { return $('//button[@data-ui5-accesskey="a"][.//bdi[normalize-space()="Add Role"]]'); }
    private get rolesEditButton() { return $('//button[.//bdi[normalize-space()="Add Role"]]/ancestor::*[contains(@class,"sapMTB") or contains(@class,"sapMOTB")][1]//button[@data-ui5-accesskey="e"][.//bdi[normalize-space()="Edit"]]'); }
    private get roleSelectionDialog() { return $('//div[contains(@class,"sapMDialog") and not(contains(@style,"display: none"))][.//li[@role="listitem"][.//div[@role="checkbox"]]]'); }
    private roleSelectionCheckbox(roleName: string) { return $(`//div[contains(@class,"sapMDialog")]//li[@role="listitem"][.//*[normalize-space()=${utils.xpathString(roleName)}]]//div[@role="checkbox"]`); }
    private roleAssignmentValueHelpIcon(roleName: string) { return $(`//label[.//bdi[normalize-space()=${utils.xpathString(roleName)}]]/following::span[@aria-label="Show Value Help"][1]`); }

    /* --- User-selection dialog --- */
    private get userSelectionDialog() { return $('//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Select Users"]]'); }
    private get userSelectionSearchInput() { return $('//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Select Users"]]//input[@type="search"]'); }
    private userSelectionRow(userName: string) { return $(`//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Select Users"]]//tr[@role="row"][.//*[normalize-space()=${utils.xpathString(userName)}]]`); }
    private userSelectionRowCheckbox(userName: string) { return $(`//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Select Users"]]//tr[@role="row"][.//*[normalize-space()=${utils.xpathString(userName)}]]//div[@role="checkbox"]`); }
    private get userSelectionOkButton() { return $('//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Select Users"]]//footer//button[.//bdi[normalize-space()="Ok" or normalize-space()="OK"]]'); }
    private roleAssignmentRemoveTokenIcon(roleName: string, userName: string) { return $(`//label[.//bdi[normalize-space()=${utils.xpathString(roleName)}]]/following::div[contains(@class,"sapMToken")][.//*[normalize-space()=${utils.xpathString(userName)}]][1]//span[@aria-label="Remove" or @title="Remove"]`); }

    /* --- Assessment section --- */
    private get assessmentAnchorButton() { return $('//button[@role="tab"][.//bdi[normalize-space()="Assessment"]]'); }
    private get createOperatingContextAndConditionButton() { return $('//button[.//bdi[normalize-space()="Create Operating Context and Condition"]]'); }

    /* --- "Operating Context and Condition" dialog --- */
    private get occDialog() { return $('//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Operating Context and Condition"]]'); }
    private get occNameTextarea() { return $('//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Operating Context and Condition"]]//bdi[normalize-space()="Operating Context and Condition Name"]/ancestor::label/following::textarea[1]'); }
    private get addCharacteristicsButton() { return $('//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Operating Context and Condition"]]//button[.//bdi[normalize-space()="Add Characterstics" or normalize-space()="Add Characteristics"]]'); }
    private get occCreateButton() { return $('//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Operating Context and Condition"]]//footer//button[@data-ui5-accesskey="c"][.//bdi[normalize-space()="Create"]]'); }
    private characteristicsRowCheckbox(charId: string) { return $(`//div[contains(@class,"sapMDialog")]//tr[@role="row"][.//*[normalize-space()=${utils.xpathString(charId)} or contains(normalize-space(),${utils.xpathString(`(${charId})`)})]]//div[@role="checkbox"]`); }
    private get characteristicsAssignButton() { return $('//div[contains(@class,"sapMDialog")]//footer//button[.//bdi[normalize-space()="Assign" or normalize-space()="OK" or normalize-space()="Ok" or normalize-space()="Select"]]'); }
    private characteristicComboboxArrow(charId: string) { return $(`//div[contains(@class,"sapMDialog")][.//h1[normalize-space()="Operating Context and Condition"]]//label[.//bdi[contains(normalize-space(),${utils.xpathString(`(${charId})`)})]]/following::div[contains(@class,"sapMComboBoxBase") or contains(@class,"sapMMultiComboBox")][1]//span[@role="button" and (@aria-label="Select Options" or @aria-label="Open")]`); }
    private comboboxOptionByText(value: string) { return $(`//div[(contains(@class,"sapMPopover") or contains(@class,"sapMSelectList")) and not(contains(@style,"display: none")) and not(contains(@style,"visibility: hidden"))]//li[@role="option"][normalize-space()=${utils.xpathString(value)} or contains(normalize-space(),${utils.xpathString(`(${value})`)}) or .//bdi[normalize-space()=${utils.xpathString(value)} or contains(normalize-space(),${utils.xpathString(`(${value})`)})] or .//span[normalize-space()=${utils.xpathString(value)} or contains(normalize-space(),${utils.xpathString(`(${value})`)})]]`); }
    /** Nth selectable checkbox tile inside the currently open MultiComboBox popover (1-based). */
    private comboboxCheckboxByIndex(index: number) { return $(`(//div[(contains(@class,"sapMPopover") or contains(@class,"sapMSelectList") or contains(@class,"sapMComboBoxBasePicker")) and not(contains(@style,"display: none")) and not(contains(@style,"visibility: hidden"))][.//li[@role="option"]])[last()]//li[@role="option"][${index}]//div[@role="checkbox"]`); }
    /** Nth option <li> inside the currently open MultiComboBox popover (1-based). */
    private comboboxLiByIndex(index: number) { return $(`(//div[(contains(@class,"sapMPopover") or contains(@class,"sapMSelectList") or contains(@class,"sapMComboBoxBasePicker")) and not(contains(@style,"display: none")) and not(contains(@style,"visibility: hidden"))][.//li[@role="option"]])[last()]//li[@role="option"][${index}]`); }
    private get useBaselineButton() { return $('//button[@data-ui5-accesskey="u"][.//bdi[normalize-space()="Use Baseline"]]'); }
    private occAddButtonByName(occName: string) { return $(`(//*[normalize-space()=${utils.xpathString(occName)}]/ancestor::*[.//button[@aria-label="Add" or @title="Add"]][1]//button[@aria-label="Add" or @title="Add"])[1]`); }
    private occEditButtonByName(occName: string) { return $(`(//*[normalize-space()=${utils.xpathString(occName)}]/ancestor::*[.//button[@aria-label="edit" or @title="edit" or @aria-label="Edit" or @title="Edit"]][1]//button[@aria-label="edit" or @title="edit" or @aria-label="Edit" or @title="Edit"])[1]`); }
    private get assignMaintainableItemsMenuItem() { return $('//li[@role="listitem" and (@title="Assign Maintainable Items" or .//div[normalize-space()="Assign Maintainable Items"])]'); }
    private get assignFailureModesMenuItem() { return $('//li[@role="listitem" and (@title="Assign Failure Modes" or .//div[normalize-space()="Assign Failure Modes"] or .//*[normalize-space()="Assign Failure Modes"])]'); }
    private maintainableItemRowCheckbox(rowText: string) { return $(`//tr[@role="row"][.//*[contains(normalize-space(),${utils.xpathString(rowText)})]]//td[contains(@class,"sapMListTblSelCol")]//div[@role="checkbox"]`); }
    private maintainableItemRow(rowText: string) { return $(`//tr[@role="row"][.//*[contains(normalize-space(),${utils.xpathString(rowText)})]]`); }
    private get firstMaintainableItemMultiSelectCheckbox() { return $('(//div[contains(@class,"sapMDialog") and not(contains(@style,"display: none"))]//tr[@role="row"]//td[contains(@class,"sapMListTblSelCol")]//div[@role="checkbox" or contains(@class,"sapMCb")])[1]'); }
    private get assignDialogSearchInput() { return $('(//div[(contains(@class,"sapMPopover") or contains(@class,"sapMDialog")) and not(contains(@style,"display: none"))]//input[@type="search"])[last()]'); }
    private get firstAssignDialogItemCheckbox() { return $('(//li[@role="option" or @role="listitem"][.//div[@role="checkbox"]][not(.//*[normalize-space()="Codes"])])[1]//div[@role="checkbox"] | (//tr[@role="row"]//td[contains(@class,"sapMListTblSelCol")]//div[@role="checkbox"])[1] | (//div[contains(@class,"sapMCb")][@role="checkbox"])[2]'); }
    private firstAssignDialogItemCheckboxByText(text: string) { return $(`((//li[.//*[contains(normalize-space(),${utils.xpathString(text)})]] | //tr[@role="row"][.//*[contains(normalize-space(),${utils.xpathString(text)})]])[1]//input[translate(@type,"checkbox","CHECKBOX")="CHECKBOX"]/parent::*)[1] | ((//li[.//*[contains(normalize-space(),${utils.xpathString(text)})]] | //tr[@role="row"][.//*[contains(normalize-space(),${utils.xpathString(text)})]])[1]//*[@role="checkbox"])[1]`); }
    private get assignDialogAssignButton() { return $('//div[contains(@class,"sapMDialog")]//footer//button[.//bdi[normalize-space()="Assign"]]'); }
    private sectionAssignButtonByName(sectionName: string) { return $(`(//*[self::span or self::bdi or self::div][starts-with(normalize-space(),${utils.xpathString(sectionName)})]/ancestor::*[.//*[(self::a or self::button or @role="button") and (.//bdi[normalize-space()="Assign"] or normalize-space()="Assign")]][1]//*[(self::a or self::button or @role="button") and (.//bdi[normalize-space()="Assign"] or normalize-space()="Assign")])[1]`); }
    private sectionRemoveButtonByName(sectionName: string) { return $(`(//*[self::span or self::bdi or self::div][starts-with(normalize-space(),${utils.xpathString(sectionName)})]/ancestor::*[.//*[(self::a or self::button or @role="button") and (.//bdi[normalize-space()="Remove"] or normalize-space()="Remove")]][1]//*[(self::a or self::button or @role="button") and (.//bdi[normalize-space()="Remove"] or normalize-space()="Remove")])[1]`); }
    private sectionExpandIconByName(sectionName: string) { return $(`(//*[self::span or self::bdi or self::div][starts-with(normalize-space(),${utils.xpathString(sectionName)})]/ancestor::*[.//button[@aria-label="Expand/Collapse" or @title="Expand/Collapse"]][1]//button[@aria-label="Expand/Collapse" or @title="Expand/Collapse"])[1]`); }
    private sectionRowCheckboxByText(itemText: string) { return $(`(//tr[@role="row"][.//*[normalize-space()=${utils.xpathString(itemText)} or starts-with(normalize-space(),${utils.xpathString(itemText)})]]//td[contains(@class,"sapMListTblSelCol")]//div[@role="checkbox" or contains(@class,"sapMCb")])[1]`); }
    private sectionCreateButtonByName(sectionName: string) { return $(`(//*[self::span or self::bdi or self::div][starts-with(normalize-space(),${utils.xpathString(sectionName)})]/ancestor::*[.//*[(self::a or self::button or @role="button") and (.//bdi[normalize-space()="Create"] or normalize-space()="Create")]][1]//*[(self::a or self::button or @role="button") and (.//bdi[normalize-space()="Create"] or normalize-space()="Create")])[1]`); }

    /* --- Create Strategy dialog --- */
    private get createStrategyDialog() { return $('//div[contains(@class,"sapMDialog") and not(contains(@style,"display: none"))][.//*[normalize-space()="Create Strategy"]]'); }
    private createStrategyDialogField(label: string) { return $(`//div[contains(@class,"sapMDialog")][.//*[normalize-space()="Create Strategy"]]//label[.//bdi[starts-with(normalize-space(),${utils.xpathString(label)})] or starts-with(normalize-space(),${utils.xpathString(label)})]/following::*[self::input or self::textarea][1]`); }
    private createStrategyDialogSelectArrow(label: string) { return $(`//div[contains(@class,"sapMDialog")][.//*[normalize-space()="Create Strategy"]]//label[.//bdi[starts-with(normalize-space(),${utils.xpathString(label)})] or starts-with(normalize-space(),${utils.xpathString(label)})]/following::*[(@role="button") and (.//span[normalize-space()="Select Options" or normalize-space()="Open"] or @aria-label="Select Options" or @aria-label="Open")][1]`); }
    private createStrategyDialogPickerIcon(label: string) { return $(`//div[contains(@class,"sapMDialog")][.//*[normalize-space()="Create Strategy"]]//label[.//bdi[starts-with(normalize-space(),${utils.xpathString(label)})] or starts-with(normalize-space(),${utils.xpathString(label)})]/following::span[@aria-label="Open Picker"][1]`); }
    private get createStrategyDialogCreateButton() { return $('//div[contains(@class,"sapMDialog")][.//*[normalize-space()="Create Strategy"]]//footer//button[.//bdi[normalize-space()="Create"]]'); }

    /* --- Edit Strategy dialog --- */
    private get editStrategyDialog() { return $('//div[contains(@class,"sapMDialog") and not(contains(@style,"display: none"))][.//*[normalize-space()="Edit Strategy"]]'); }
    private editStrategyDialogField(label: string) { return $(`//div[contains(@class,"sapMDialog")][.//*[normalize-space()="Edit Strategy"]]//label[.//bdi[starts-with(normalize-space(),${utils.xpathString(label)})] or starts-with(normalize-space(),${utils.xpathString(label)})]/following::*[self::input or self::textarea][1]`); }
    private get editStrategyDialogSaveButton() { return $('//div[contains(@class,"sapMDialog")][.//*[normalize-space()="Edit Strategy"]]//footer//button[.//bdi[normalize-space()="Save"]]'); }
    private strategyRowCheckboxByText(itemText: string) { return $(`(//tr[@role="row"][.//*[normalize-space()=${utils.xpathString(itemText)} or starts-with(normalize-space(),${utils.xpathString(itemText)})]]//td[contains(@class,"sapMListTblSelCol")]//div[@role="checkbox" or contains(@class,"sapMCb")])[1]`); }
    private sectionToolbarButtonByName(sectionName: string, buttonText: string) { return $(`(//*[self::span or self::bdi or self::div][starts-with(normalize-space(),${utils.xpathString(sectionName)})]/ancestor::*[.//*[(self::a or self::button or @role="button") and (.//bdi[normalize-space()=${utils.xpathString(buttonText)}] or normalize-space()=${utils.xpathString(buttonText)})]][1]//*[(self::a or self::button or @role="button") and (.//bdi[normalize-space()=${utils.xpathString(buttonText)}] or normalize-space()=${utils.xpathString(buttonText)})])[1]`); }
    private operatingContextLabelByName(occName: string) { return $(`(//span[contains(@class,"sapMText")][normalize-space()=${utils.xpathString(occName)}])[1]`); }

    /* --- Assign/Unassign Technical Object --- */
    private get assignUnassignTechnicalObjectButton() { return $('//button[@data-ui5-accesskey="a" and @aria-haspopup="menu"][.//bdi[normalize-space()="Assign/Unassign Technical Object"]]'); }
    private unifiedMenuItemByText(text: string) { return $(`(//ul[@role="menu"]//li[@role="menuitem"][.//div[contains(@class,"sapUiMnuItmTxt") and normalize-space()=${utils.xpathString(text)}] or .//*[normalize-space()=${utils.xpathString(text)}]])[last()]`); }
    private get equipmentDialog() { return $('(//*[self::div or self::section][.//*[starts-with(normalize-space(),"Equipment (")]][.//tr[@role="row"]])[last()]'); }
    private get firstEquipmentRowCheckbox() {
        const root = '(//*[self::div or self::section][.//*[starts-with(normalize-space(),"Equipment (")]][.//tr[@role="row"]])[last()]';
        return $(`(${root}//tr[@role="row"][.//td]//td[contains(@class,"sapMListTblSelCol")]//*[@role="checkbox"])[1] | (${root}//tr[@role="row"][.//td]//td[contains(@class,"sapMListTblSelCol")]//div[contains(@class,"sapMCb")])[1] | (${root}//tr[@role="row"][.//td]//td[contains(@class,"sapMListTblSelCol")]//input[translate(@type,"checkbox","CHECKBOX")="CHECKBOX"]/parent::*)[1]`);
    }
    private get equipmentDialogConfirmButton() { return $('//button[.//bdi[normalize-space()="Confirm"]]'); }
    private get closeColumnButton() { return $('//button[@aria-label="Close column" or @title="Close column"]'); }

    /** Tree icon for an Assessment Hierarchy row (default row0 = newly-created OCC). */
    private assessmentHierarchyTreeIcon(rowIndex: number = 0) { return $(`//span[contains(@id,"idAssessmentHierarchy-rows-row${rowIndex}-treeicon") and @role="button"]`); }
    /** sapUiTable splits a logical row into multiple <tr> siblings sharing the same -rows-rowN- id segment. */
    private assessmentHierarchyAddButtonByRowIndex(rowIndex: number) { return $(`//tr[contains(@id,"idAssessmentHierarchy-rows-row${rowIndex}-") or substring-after(@id,"idAssessmentHierarchy-rows-row")="${rowIndex}"]//button[@aria-label="Add" or @title="Add"]`); }
    private assessmentHierarchyAddButtonByRowText(rowText: string) { return $(`//*[contains(@id,"idAssessmentHierarchy-rows-row") and .//*[normalize-space()=${utils.xpathString(rowText)} or contains(normalize-space(),${utils.xpathString(rowText)})]][not(.//*[contains(@id,"idAssessmentHierarchy-rows-row") and not(.//*[normalize-space()=${utils.xpathString(rowText)} or contains(normalize-space(),${utils.xpathString(rowText)})])])]//button[@aria-label="Add" or @title="Add"]`); }
    private assessmentHierarchyRowByText(rowText: string) { return $(`(//tr[@role="row"]//span[contains(@class,"sapMText")][normalize-space()=${utils.xpathString(rowText)} or starts-with(normalize-space(),${utils.xpathString(rowText)})])[1]`); }

    /* --- Select Baselines dialog --- */
    private get selectBaselinesDialog() { return $('//div[contains(@class,"sapMDialog") and not(contains(@style,"display: none"))][.//*[normalize-space()="Select Baselines"]]'); }
    /** Radio button in the first data row of the Recommended Baselines table. */
    private get firstBaselineRadioButton() { return $('(//div[contains(@class,"sapMDialog")][.//*[normalize-space()="Select Baselines"]]//tr[@role="row"][.//td]//*[@role="radio" or contains(@class,"sapMRb")])[1]'); }
    private get selectBaselinesApplyButton() { return $('//div[contains(@class,"sapMDialog")][.//*[normalize-space()="Select Baselines"]]//footer//button[.//bdi[normalize-space()="Apply"]]'); }

    /* --- Summary Report --- */
    private get summaryReportButton() { return $('//button[.//bdi[normalize-space()="Summary Report"]] | //a[.//bdi[normalize-space()="Summary Report"]]'); }
    private get yesButton() { return $('//div[contains(@class,"sapMDialog") or contains(@class,"sapMMessageBox") or @role="alertdialog"][not(contains(@style,"display: none"))]//footer//button[.//bdi[normalize-space()="Yes"]] | //div[contains(@class,"sapMMessageBox") or @role="alertdialog"][not(contains(@style,"display: none"))]//button[.//bdi[normalize-space()="Yes"]]'); }

    /* ========================
       ACTIONS
       ======================== */

    async navigateToApp(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForSAPPopupAndClose(10);
        await utils.clickWithWait(this.appTile);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.appIframe);
        await browser.pause(2000);
        console.log('[ACTION] Navigated to Asset Strategy Analysis for Classes app');
    }

    /**
     * Refresh the browser page and re-enter the app iframe so subsequent
     * steps can continue interacting with the app.
     */
    async refreshApp(): Promise<void> {
        await browser.switchToParentFrame();
        await browser.refresh();
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForSAPPopupAndClose(10);
        await utils.switchToIframe(this.appIframe);
        await browser.pause(2000);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Page refreshed and re-entered app iframe');
    }

    async clickCreateButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.createButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.createDialog.waitForDisplayed({ timeout: 30000 });
        console.log('[ACTION] Create button clicked, dialog displayed');
    }

    async fillDescription(description: string): Promise<void> {
        const el = await this.descriptionInput;
        await el.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.descriptionInput);
        await el.clearValue();
        await el.setValue(description);
        await browser.keys('Tab');
        console.log(`[ACTION] Description entered: ${description}`);
    }

    async selectClass(className: string): Promise<void> {
        await utils.clickWithWait(this.classValueHelpIcon);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.classValueHelpRow(className));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Class selected: ${className}`);
    }

    async selectFailureDataProfileFirstRow(): Promise<void> {
        await utils.clickWithWait(this.failureDataProfileValueHelpIcon);
        await utils.waitForBusyIndicatorToDisappear();
        await this.valueHelpFirstRow.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.valueHelpFirstRow);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Failure Data Profile — first row selected');
    }

    /**
     * Open the Failure Data Profile value-help dialog and select the row whose
     * Description matches the supplied text (e.g. "Pump - Centrifugal V").
     */
    async selectFailureDataProfileByDescription(description: string): Promise<void> {
        await utils.clickWithWait(this.failureDataProfileValueHelpIcon);
        await utils.waitForBusyIndicatorToDisappear();
        const row = await this.failureDataProfileRowByDescription(description);
        await row.waitForDisplayed({ timeout: 30000 });
        await row.scrollIntoView({ block: 'center' });
        await utils.clickWithWait(this.failureDataProfileRowByDescription(description));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Failure Data Profile selected: ${description}`);
    }

    async selectTemplateFirstOption(): Promise<void> {
        await utils.clickWithWait(this.templateArrow);
        await utils.waitForBusyIndicatorToDisappear();
        await this.comboboxFirstOption.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.comboboxFirstOption);
        console.log('[ACTION] Template — first option selected');
    }

    /**
     * Tick the "Create as Baseline" checkbox in the Create Assessment dialog.
     * The underlying SAPUI5 checkbox uses dynamic IDs, so we locate it by its
     * adjacent "Baseline" label.
     */
    async checkCreateAsBaselineCheckbox(): Promise<void> {
        const checkbox = await this.createAsBaselineCheckbox;
        await checkbox.waitForDisplayed({ timeout: 30000 });
        await checkbox.scrollIntoView({ block: 'center' });
        await utils.clickWithWait(this.createAsBaselineCheckbox);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] "Create as Baseline" checkbox checked');
    }

    async clickDialogCreate(): Promise<void> {
        await utils.clickWithWait(this.dialogCreateButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Dialog Create button clicked');
    }

    async confirmSuccessPopup(): Promise<void> {
        const ok = await this.okButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(4000);
        console.log('[ACTION] Success popup OK clicked, assessment opened');
    }

    async clickEditButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.editButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Edit button clicked');
    }

    /**
     * Click the Nth Edit button on the page (1-based index).
     * 1 → General Information, 2 → Planning Data, 3 → Organizational Data, 4 → Roles, ...
     */
    async clickEditButtonByIndex(index: number): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.editButtonByIndex(index);
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.editButtonByIndex(index));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Edit button #${index} clicked`);
    }

    /**
     * Click the Edit button inside a specific section panel
     * (e.g. "Planning Data", "Organizational Data").
     * @deprecated Prefer clickEditButtonByIndex for stability.
     */
    async clickSectionEditButton(sectionTitle: string): Promise<void> {
        const indexMap: Record<string, number> = {
            'General Information': 1,
            'Planning Data': 2,
            'Organizational Data': 3,
            'Roles': 4
        };
        const idx = indexMap[sectionTitle] ?? 1;
        await this.clickEditButtonByIndex(idx);
        console.log(`[ACTION] Edit button clicked for section: ${sectionTitle}`);
    }

    /**
     * Pick a date in a Planning Data field by opening its calendar picker and
     * clicking the day cell — no typing into the readonly input. Accepts dates
     * formatted like "Dec 31, 2026" / "Jan 31, 2027".
     */
    private async fillPlanningDataField(label: string, value: string): Promise<void> {
        const target = this.parseDate(value);
        const targetYmd = this.toYyyymmdd(target);

        // 0. Make sure no previous calendar popover is still on screen.
        await this.dismissAnyOpenCalendarPopover();

        // 1. Open the picker for this field.
        const icon = await this.planningDataPickerIcon(label);
        await icon.scrollIntoView({ block: 'center' });
        await icon.waitForExist({ timeout: 30000 });
        await icon.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.planningDataPickerIcon(label));

        // 2. Wait for the calendar popover.
        const popover = await this.visibleCalendarPopover;
        await popover.waitForDisplayed({ timeout: 30000 });
        await browser.pause(300);

        // 3. Navigate the calendar header to the target month/year.
        await this.navigateCalendarToMonth(target);

        // 4. Click the day cell for the exact date.
        const day = await this.calendarDayByDataAttr(targetYmd);
        await day.waitForExist({ timeout: 30000 });
        await day.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.calendarDayByDataAttr(targetYmd));

        // 5. Wait for the popover to close before the caller opens the next one.
        try {
            await browser.waitUntil(
                async () => {
                    const p = await this.visibleCalendarPopover;
                    return !(await p.isExisting()) || !(await p.isDisplayed());
                },
                { timeout: 5000, interval: 200, timeoutMsg: 'Calendar popover did not close' }
            );
        } catch {
            await this.dismissAnyOpenCalendarPopover();
        }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(300);
        console.log(`[ACTION] Planning Data — ${label}: ${value}`);
    }

    /** If a calendar popover is still visible from a prior interaction, close it. */
    private async dismissAnyOpenCalendarPopover(): Promise<void> {
        for (let attempt = 0; attempt < 3; attempt++) {
            const popover = await this.visibleCalendarPopover;
            if (!(await popover.isExisting()) || !(await popover.isDisplayed())) {
                return;
            }
            await browser.keys('Escape');
            await browser.pause(300);
        }
        // Last-resort: click on the body to dismiss.
        try {
            await browser.execute(() => document.body.click());
            await browser.pause(300);
        } catch {
            /* ignore */
        }
    }

    /** Parse strings like "Dec 31, 2026" into a Date (local time, day precision). */
    private parseDate(value: string): Date {
        const d = new Date(value);
        if (isNaN(d.getTime())) {
            throw new Error(`Unrecognized date format: "${value}". Expected e.g. "Dec 31, 2026".`);
        }
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    /** Convert a Date to the SAP `data-sap-day` format (YYYYMMDD). */
    private toYyyymmdd(d: Date): string {
        const y = d.getFullYear().toString().padStart(4, '0');
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${y}${m}${day}`;
    }

    /**
     * Step the calendar header forward/backward until the displayed month/year
     * matches the target date's month/year. The SAP header has two separate
     * buttons (month, year) so we read them individually each iteration.
     */
    private async navigateCalendarToMonth(target: Date): Promise<void> {
        const targetYear = target.getFullYear();
        const targetMonth = target.getMonth(); // 0-11

        for (let i = 0; i < 600; i++) {
            const monthEl = await this.calendarHeaderMonthButton;
            const yearEl = await this.calendarHeaderYearButton;
            await monthEl.waitForExist({ timeout: 30000 });
            await yearEl.waitForExist({ timeout: 30000 });

            const monthText = (await monthEl.getText()).trim();
            const yearText = (await yearEl.getText()).trim();

            const currentYear = parseInt(yearText, 10);
            // Parse "May" / "September" via a fixed reference year so locale doesn't bite us.
            const parsedMonth = new Date(`${monthText} 1, 2000`);
            const currentMonth = isNaN(parsedMonth.getTime()) ? NaN : parsedMonth.getMonth();

            if (!isNaN(currentYear) && !isNaN(currentMonth)
                && currentYear === targetYear && currentMonth === targetMonth) {
                return;
            }

            const goForward = isNaN(currentYear) || isNaN(currentMonth)
                ? true
                : (currentYear < targetYear
                    || (currentYear === targetYear && currentMonth < targetMonth));

            await utils.clickWithWait(goForward ? this.calendarNextButton : this.calendarPrevButton);
            await browser.pause(120);
        }
        throw new Error(`Could not navigate calendar to ${target.toDateString()}`);
    }

    /**
     * Fill the Planning Data form with the provided date values
     * (only fields that are supplied will be written).
     */
    async fillPlanningDataForm(data: PlanningDataInput): Promise<void> {
        if (data.lastReviewDate)    await this.fillPlanningDataField('Last Review Date', data.lastReviewDate);
        if (data.nextReviewDate)    await this.fillPlanningDataField('Next Review Date', data.nextReviewDate);
        if (data.plannedReviewDate) await this.fillPlanningDataField('Planned Review Date (Next Refresh)', data.plannedReviewDate);
        if (data.nextTADate)        await this.fillPlanningDataField('Next TA Date (Unit Level)', data.nextTADate);
        if (data.secondTADate)      await this.fillPlanningDataField('2nd TA Date (Unit Level)', data.secondTADate);
        console.log('[ACTION] Planning Data form filled');
    }

    /**
     * Save the Planning Data section after editing.
     */
    async clickPlanningDataSave(): Promise<void> {
        await this.clickSaveButton();
        await this.confirmSuccessPopup();
        console.log('[ACTION] Planning Data Save clicked');
    }

    /**
     * High-level helper: Edit Planning Data → fill date fields → Save.
     */
    async editPlanningData(data: PlanningDataInput): Promise<void> {
        await this.clickEditButtonByIndex(2);
        await this.fillPlanningDataForm(data);
        await this.clickPlanningDataSave();
    }

    /**
     * Pick an Organizational Data value via the value-help (F4) dialog.
     * Opens the value-help dialog, clicks the radio button in the row matching `value`,
     * then clicks the dialog's Save button to confirm the selection.
     * If no exact match is found, falls back to the first row.
     */
    async selectOrganizationalDataViaValueHelp(label: string, value: string): Promise<void> {
        await utils.clickWithWait(this.organizationalDataValueHelpIcon(label));
        await utils.waitForBusyIndicatorToDisappear();

        // The dialog row's radio button (sapMRbB) is what actually marks a selection;
        // simply clicking the row text doesn't toggle the radio.
        const rowRadio = $(
            `(//div[contains(@class,"sapMDialog")]//tr[@role="row"][.//*[normalize-space()=${utils.xpathString(value)}]]//div[contains(@class,"sapMRbB")])[1]`
        );
        const fallbackRadio = $(
            `(//div[contains(@class,"sapMDialog")]//tbody/tr[@role="row"]//div[contains(@class,"sapMRbB")])[1]`
        );

        if (await rowRadio.isExisting()) {
            await rowRadio.waitForDisplayed({ timeout: 30000 });
            await utils.clickWithWait(rowRadio);
        } else {
            await fallbackRadio.waitForDisplayed({ timeout: 30000 });
            await utils.clickWithWait(fallbackRadio);
        }
        await utils.waitForBusyIndicatorToDisappear();

        // Confirm the dialog with its Save button (the dialog footer's Save).
        const dialogSave = $(
            `(//div[contains(@class,"sapMDialog")]//button[.//bdi[normalize-space()="Save"]])[1]`
        );
        await dialogSave.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(dialogSave);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Organizational Data — ${label} selected via value help: ${value}`);
    }

    /**
     * Fill the Organizational Data form by opening each field's value-help (F4)
     * dialog and selecting the row matching the supplied value.
     */
    async fillOrganizationalDataForm(data: OrganizationalDataInput): Promise<void> {
        if (data.planningPlant)    await this.selectOrganizationalDataViaValueHelp('Planning Plant', data.planningPlant);
        if (data.maintenancePlant) await this.selectOrganizationalDataViaValueHelp('Maintenance Plant', data.maintenancePlant);
        console.log('[ACTION] Organizational Data form filled via value help');
    }

    /**
     * Save the Organizational Data section after editing.
     */
    async clickOrganizationalDataSave(): Promise<void> {
        await this.clickSaveButton();
        await this.confirmSuccessPopup();
        console.log('[ACTION] Organizational Data Save clicked');
    }

    /**
     * High-level helper: Edit Organizational Data → fill fields → Save.
     */
    async editOrganizationalData(data: OrganizationalDataInput): Promise<void> {
        await this.clickEditButtonByIndex(3);
        await this.fillOrganizationalDataForm(data);
        await this.clickOrganizationalDataSave();
    }

    /**
     * High-level helper: edit Planning Data and Organizational Data sections back-to-back.
     */
    async editPlanningAndOrganizationalData(
        planning: PlanningDataInput,
        organizational: OrganizationalDataInput
    ): Promise<void> {
        await this.editPlanningData(planning);
        await this.editOrganizationalData(organizational);
    }

    async editDescription(newDescription: string): Promise<void> {
        const el = await this.editDescriptionInput;
        await el.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.editDescriptionInput);
        await el.clearValue();
        await el.setValue(newDescription);
        await browser.keys('Tab');
        console.log(`[ACTION] Description edited to: ${newDescription}`);
    }

    async clickSaveButton(): Promise<void> {
        // Make sure no value-help / suggestion dialog is still open and intercepting clicks.
        const openDialog = $('//div[contains(@class,"sapMDialog") and not(contains(@style,"display: none"))]');
        try {
            await openDialog.waitForDisplayed({ timeout: 3000, reverse: true });
        } catch {
            // dialog still around — continue, the click fallback below will handle overlay
        }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(500);

        const btn = await this.saveButton;
        await btn.waitForExist({ timeout: 30000 });
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });

        // Try a normal click; fall back to a JS click if an overlay intercepts the event.
        try {
            await btn.waitForClickable({ timeout: 10000 });
            await btn.click();
        } catch {
            await browser.execute((el: HTMLButtonElement) => el.click(), btn as unknown as HTMLButtonElement);
        }
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Save button clicked');
    }

    async editAssessmentDescription(newDescription: string): Promise<void> {
        await this.clickEditButton();
        await this.editDescription(newDescription);
        await this.clickSaveButton();
        await this.confirmSuccessPopup();
    }

    async clickManageButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.manageButton);
        await this.deleteMenuItem.waitForDisplayed({ timeout: 30000 });
        console.log('[ACTION] Manage button clicked');
    }

    async clickDeleteMenuItem(): Promise<void> {
        await utils.clickWithWait(this.deleteMenuItem);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Delete menu item clicked');
    }

    async confirmDelete(): Promise<void> {
        const ok = await this.okButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log('[ACTION] Delete confirmation OK clicked');
    }

    async deleteAssessment(): Promise<void> {
        await this.clickManageButton();
        await this.clickDeleteMenuItem();
        await this.confirmDelete();
        // second popup: "successfully deleted" — click OK again
        await this.confirmDelete();
    }

    async searchInListView(description: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const search = await this.listSearchInput;
        await search.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.listSearchInput);
        await search.clearValue();
        await search.setValue(description);
        await browser.keys('Enter');
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(2000);
        console.log(`[ACTION] List view searched for: ${description}`);
    }

    async verifyAssessmentDeleted(description: string): Promise<void> {
        const row = await this.listRowByDescription(description);
        const exists = await row.isExisting();
        if (exists) {
            const displayed = await row.isDisplayed();
            if (displayed) {
                throw new Error(`Assessment "${description}" is still present after deletion`);
            }
        }
        console.log(`[VERIFY] Assessment "${description}" is deleted`);
        await browser.pause(4000);
    }

    async fillCreateAssessmentForm(data: CreateAssessmentInput): Promise<void> {
        await this.fillDescription(data.description);
        await this.selectClass(data.className);
        if (data.failureDataProfile) {
            await this.selectFailureDataProfileByDescription(data.failureDataProfile);
        } else {
            await this.selectFailureDataProfileFirstRow();
        }
        await this.selectTemplateFirstOption();
        console.log('[ACTION] Create Assessment form filled');
    }

    /* ---------- Roles section actions ---------- */

    /**
     * Click the "Add Role" button inside the Roles toolbar.
     */
    async clickAddRoleButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.addRoleButton;
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addRoleButton);
        await this.roleSelectionDialog.waitForDisplayed({ timeout: 30000 });
        console.log('[ACTION] Add Role button clicked, role-selection dialog displayed');
    }

    /**
     * Tick the checkbox for a single role in the role-selection dialog (no-op if already checked).
     */
    private async toggleRoleCheckbox(roleName: string): Promise<void> {
        const cb = await this.roleSelectionCheckbox(roleName);
        await cb.waitForExist({ timeout: 30000 });
        await cb.scrollIntoView({ block: 'center' });
        const checked = await cb.getAttribute('aria-checked');
        if (checked !== 'true') {
            await utils.clickWithWait(this.roleSelectionCheckbox(roleName));
            console.log(`[ACTION] Role checked: ${roleName}`);
        } else {
            console.log(`[ACTION] Role already checked: ${roleName}`);
        }
    }

    /**
     * Select the supplied roles in the role-selection dialog and confirm with OK.
     */
    async selectRolesInDialog(roles: readonly string[]): Promise<void> {
        for (const r of roles) await this.toggleRoleCheckbox(r);
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(500);
        console.log(`[ACTION] Roles selected and confirmed: ${roles.join(', ')}`);
    }

    /**
     * Assign a user (by display name) to a single role by:
     *   1. clicking the role row's "Show Value Help" (F4) icon
     *   2. waiting for the user-selection dialog
     *   3. searching for the user by name
     *   4. ticking the matching row's checkbox
     *   5. clicking the dialog's "Ok" button
     */
    private async assignUserToRole(roleName: string, userName: string): Promise<void> {
        // 1. Open user-selection dialog via the role row's value-help icon.
        const vhi = await this.roleAssignmentValueHelpIcon(roleName);
        await vhi.scrollIntoView({ block: 'center' });
        await vhi.waitForExist({ timeout: 30000 });
        await vhi.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.roleAssignmentValueHelpIcon(roleName));

        // 2. Wait for the user-selection dialog to appear.
        const dialog = await this.userSelectionDialog;
        await dialog.waitForDisplayed({ timeout: 30000 });

        // 3. Search for the user by display name.
        const search = await this.userSelectionSearchInput;
        await search.waitForDisplayed({ timeout: 30000 });
        await search.clearValue();
        await search.setValue(userName);
        await browser.keys('Enter');
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(800);

        // 4. Tick the matching row's checkbox (no-op if already checked).
        const row = await this.userSelectionRow(userName);
        await row.waitForExist({ timeout: 30000 });
        await row.scrollIntoView({ block: 'center' });
        const cb = await this.userSelectionRowCheckbox(userName);
        await cb.waitForDisplayed({ timeout: 30000 });
        const checked = await cb.getAttribute('aria-checked');
        if (checked !== 'true') {
            await utils.clickWithWait(this.userSelectionRowCheckbox(userName));
        }

        // 5. Confirm with Ok.
        await utils.clickWithWait(this.userSelectionOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(500);
        console.log(`[ACTION] User "${userName}" assigned to role "${roleName}" via user-selection dialog`);
    }

    /**
     * High-level helper: open Add Role dialog, pick the supplied roles, confirm,
     * then assign the supplied user to each newly added role and click Save.
     * Finally dismisses any post-save success popup.
     */
    async addRolesAndAssignUser(data: RolesAssignmentInput): Promise<void> {
        await this.clickAddRoleButton();
        await this.selectRolesInDialog(data.roles);
        for (const r of data.roles) await this.assignUserToRole(r, data.user);
        await this.clickSaveButton();
        await this.confirmSuccessPopup();
        console.log('[ACTION] Roles added, user assigned, and saved');
    }

    /**
     * Click the Edit button inside the Roles toolbar.
     */
    async clickRolesEditButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.rolesEditButton;
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.rolesEditButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Roles section Edit button clicked');
    }

    /**
     * Remove a user assignment from a specific role row by clicking the token's "Remove" icon.
     */
    private async removeUserFromRole(roleName: string, userName: string): Promise<void> {
        const icon = await this.roleAssignmentRemoveTokenIcon(roleName, userName);
        await icon.scrollIntoView({ block: 'center' });
        await icon.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.roleAssignmentRemoveTokenIcon(roleName, userName));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] User "${userName}" removed from role "${roleName}"`);
    }

    /**
     * High-level helper: enter Roles edit mode, unassign the user from the given role, and Save.
     */
    async unassignUserFromRoleAndSave(roleName: string, userName: string): Promise<void> {
        await this.clickRolesEditButton();
        await this.removeUserFromRole(roleName, userName);
        await this.clickSaveButton();
        await this.confirmSuccessPopup();
        console.log(`[ACTION] User "${userName}" unassigned from role "${roleName}" and saved`);
    }

    /* ---------- Assessment section actions ---------- */

    /**
     * Click the "Assessment" tab in the object-page anchor bar to scroll/navigate
     * to the Assessment section.
     */
    async navigateToAssessmentSection(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.assessmentAnchorButton;
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assessmentAnchorButton);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(800);
        console.log('[ACTION] Navigated to Assessment section');
    }

    /**
     * Click the "Create Operating Context and Condition" button inside the
     * Assessment section.
     */
    async clickCreateOperatingContextAndCondition(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.createOperatingContextAndConditionButton;
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.createOperatingContextAndConditionButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] "Create Operating Context and Condition" button clicked');
    }

    /**
     * High-level helper: open the Assessment section and click the
     * "Create Operating Context and Condition" button.
     */
    async openAssessmentAndCreateOperatingContextAndCondition(): Promise<void> {
        await this.navigateToAssessmentSection();
        await this.clickCreateOperatingContextAndCondition();
    }

    /* ---------- Operating Context and Condition dialog actions ---------- */

    /**
     * Type the OCC name into the required textarea at the top of the dialog.
     */
    async fillOccName(name: string): Promise<void> {
        await this.occDialog.waitForDisplayed({ timeout: 30000 });
        const ta = await this.occNameTextarea;
        await ta.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.occNameTextarea);
        await ta.clearValue();
        await ta.setValue(name);
        await browser.keys('Tab');
        console.log(`[ACTION] OCC name entered: ${name}`);
    }

    /**
     * Click the "Add Characterstics" button inside the OCC dialog.
     */
    async clickAddCharacteristicsButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.addCharacteristicsButton;
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addCharacteristicsButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] "Add Characterstics" button clicked');
    }

    /**
     * Tick the row checkbox for each characteristic id in the Add Characterstics
     * sub-dialog, then confirm with the dialog's Assign/OK button.
     */
    async selectCharacteristicsAndAssign(charIds: readonly string[]): Promise<void> {
        for (const id of charIds) {
            const cb = await this.characteristicsRowCheckbox(id);
            await cb.waitForExist({ timeout: 30000 });
            await cb.scrollIntoView({ block: 'center' });
            await cb.waitForDisplayed({ timeout: 30000 });
            const checked = await cb.getAttribute('aria-checked');
            if (checked !== 'true') {
                await utils.clickWithWait(this.characteristicsRowCheckbox(id));
                console.log(`[ACTION] Characteristic checked: ${id}`);
            } else {
                console.log(`[ACTION] Characteristic already checked: ${id}`);
            }
        }
        await utils.clickWithWait(this.characteristicsAssignButton);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(500);
        console.log(`[ACTION] Characteristics assigned: ${charIds.join(', ')}`);
    }

    /**
     * Open the multi-combobox dropdown for a specific characteristic row
     * (identified by its id, e.g. "CENF_IMPELLER") by clicking the row's
     * "Select Options" arrow icon, then pick the supplied value from the popover.
     * Does NOT type into the input — selection is made entirely via the dropdown.
     */
    async selectCharacteristicValue(charId: string, value: string): Promise<void> {
        // 1. Click the row's dropdown arrow.
        const arrow = await this.characteristicComboboxArrow(charId);
        await arrow.scrollIntoView({ block: 'center' });
        await arrow.waitForExist({ timeout: 30000 });
        await arrow.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.characteristicComboboxArrow(charId));

        // 2. Wait for the popover to render the options.
        await browser.pause(800);

        // 3. Pick the matching option from the open popover.
        const opt = await this.comboboxOptionByText(value);
        await opt.waitForExist({ timeout: 30000 });
        await opt.scrollIntoView({ block: 'center' });
        await opt.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.comboboxOptionByText(value));

        // 4. Some MultiComboBox popovers stay open after selection — close it
        //    by clicking the arrow again (toggles closed). Guarded so we don't
        //    fail the test if the popover already auto-closed.
        try {
            const stillOpen = await opt.isDisplayed();
            if (stillOpen) {
                await utils.clickWithWait(this.characteristicComboboxArrow(charId));
            }
        } catch {
            /* popover already closed — nothing to do */
        }

        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Characteristic "${charId}" set to "${value}"`);
    }

    /**
     * Same as selectCharacteristicValue but picks the Nth option (1-based)
     * from the open popover instead of matching by visible text. Useful when
     * option labels are unstable but row order is.
     */
    async selectCharacteristicValueByIndex(charId: string, index: number): Promise<void> {
        const arrow = await this.characteristicComboboxArrow(charId);
        await arrow.scrollIntoView({ block: 'center' });
        await arrow.waitForExist({ timeout: 30000 });
        await arrow.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.characteristicComboboxArrow(charId));

        await browser.pause(800);

        // MultiComboBox popovers render each option as <li role="option"> with
        // a role="checkbox" tile inside. Try the checkbox tile first; if it's
        // not in the DOM, fall back to clicking the <li> itself.
        const checkbox = await this.comboboxCheckboxByIndex(index);
        const li = await this.comboboxLiByIndex(index);

        if (await checkbox.isExisting()) {
            await checkbox.scrollIntoView({ block: 'center' });
            await checkbox.waitForDisplayed({ timeout: 30000 });
            await utils.clickWithWait(this.comboboxCheckboxByIndex(index));
            console.log(`[ACTION] Characteristic "${charId}" — option #${index} checkbox ticked`);
        } else {
            await li.waitForExist({ timeout: 30000 });
            await li.scrollIntoView({ block: 'center' });
            await li.waitForDisplayed({ timeout: 30000 });
            await utils.clickWithWait(this.comboboxLiByIndex(index));
            console.log(`[ACTION] Characteristic "${charId}" — option #${index} <li> clicked`);
        }

        // Close the popover by clicking outside (on the OCC dialog title area).
        try {
            const occTitle = await $('//div[contains(@class,"sapMDialog")]//h1[normalize-space()="Operating Context and Condition"]');
            if (await occTitle.isExisting()) {
                await occTitle.click();
            } else {
                await browser.keys('Escape');
            }
        } catch {
            await browser.keys('Escape');
        }

        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Characteristic "${charId}" set to option #${index}`);
    }

    /**
     * Click the OCC dialog's footer "Create" button.
     */
    async clickOccCreateButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.occCreateButton;
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.occCreateButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] OCC dialog Create button clicked');
    }

    /**
     * Click the "Use Baseline" button (appears after OCC creation in the
     * Assessment section).
     */
    async clickUseBaselineButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.useBaselineButton;
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.useBaselineButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] "Use Baseline" button clicked');
    }

    /**
     * In the "Select Baselines" dialog, pick the first recommended baseline
     * (its row radio button) and click Apply.
     */
    async selectFirstBaselineAndApply(): Promise<void> {
        const dialog = await this.selectBaselinesDialog;
        await dialog.waitForDisplayed({ timeout: 30000 });

        const radio = await this.firstBaselineRadioButton;
        await radio.waitForExist({ timeout: 30000 });
        await radio.scrollIntoView({ block: 'center' });
        await radio.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.firstBaselineRadioButton);
        console.log('[ACTION] First recommended baseline selected');

        const apply = await this.selectBaselinesApplyButton;
        await apply.waitForExist({ timeout: 30000 });
        await apply.waitForDisplayed({ timeout: 30000 });
        await browser.waitUntil(
            async () => apply.isEnabled().catch(() => false),
            { timeout: 15000, interval: 200, timeoutMsg: 'Apply button never became enabled' }
        );
        await utils.clickWithWait(this.selectBaselinesApplyButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Select Baselines — Apply clicked');
        await this.confirmSuccessPopup();
    }

    /**
     * High-level helper: with the OCC dialog open, add the supplied characteristics,
     * assign each one's value, fill the OCC name, click Create, dismiss the
     * success popup, then click "Use Baseline".
     */
    async createOperatingContextAndConditionFlow(
        data: OperatingContextAndConditionInput,
        options: { useBaseline?: boolean } = {}
    ): Promise<void> {
        const { useBaseline = true } = options;

        // 1. Open the Add Characterstics sub-dialog and tick the requested ids.
        await this.clickAddCharacteristicsButton();
        await this.selectCharacteristicsAndAssign(data.characteristics.map(c => c.id));

        // 2. For each characteristic row, pick its dropdown value (by index when
        //    supplied, otherwise by visible text).
        for (const c of data.characteristics) {
            if (typeof c.valueIndex === 'number') {
                await this.selectCharacteristicValueByIndex(c.id, c.valueIndex);
            } else if (c.value) {
                await this.selectCharacteristicValue(c.id, c.value);
            } else {
                throw new Error(`Characteristic "${c.id}" has neither value nor valueIndex`);
            }
        }

        // 3. Fill the required OCC name and submit the dialog.
        await this.fillOccName(data.name);
        await this.clickOccCreateButton();

        // 4. Dismiss the post-create success popup.
        await this.confirmSuccessPopup();

        // 5. Optional: click "Use Baseline" + Apply. Skipped when the parent
        //    assessment was itself created as a baseline (no Use Baseline button).
        if (useBaseline) {
            await this.clickUseBaselineButton();
            await this.selectFirstBaselineAndApply();
            console.log('[ACTION] OCC creation flow complete; baseline applied');
        } else {
            console.log('[ACTION] OCC creation flow complete; Use Baseline skipped');
        }
    }

    /**
     * Click the "+" (Add) button on the Operating Context tile/row identified
     * by its name (e.g. "TestOCC1").
     */
    async clickOccAddButton(occName: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.occAddButtonByName(occName);
        await btn.waitForExist({ timeout: 30000 });
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.occAddButtonByName(occName));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "+" Add button clicked on Operating Context "${occName}"`);
    }

    /**
     * Click the "edit" (pencil) button on the Operating Context tile/row
     * identified by its current name (e.g. "TestOCC1") and rename it to the
     * supplied new name in the OCC dialog's name textarea.
     */
    async editOccName(currentName: string, newName: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.occEditButtonByName(currentName);
        await btn.waitForExist({ timeout: 30000 });
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.occEditButtonByName(currentName));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Edit button clicked on Operating Context "${currentName}"`);

        await this.fillOccName(newName);

        // Click the dialog footer Save button.
        const save = await this.saveButton;
        await save.waitForExist({ timeout: 30000 });
        await save.scrollIntoView({ block: 'center' });
        await save.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.saveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] OCC edit dialog — Save clicked');

        // Confirm the follow-up success popup.
        const ok = await this.okButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] OCC edit confirmation OK clicked');
    }

    /**
     * Click the "Assign Maintainable Items" entry in the popover that opens
     * after clicking an Operating Context's "+" button.
     */
    async clickAssignMaintainableItemsMenuItem(): Promise<void> {
        const item = await this.assignMaintainableItemsMenuItem;
        await item.waitForExist({ timeout: 30000 });
        await item.scrollIntoView({ block: 'center' });
        await item.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assignMaintainableItemsMenuItem);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] "Assign Maintainable Items" menu item clicked');
    }

    /**
     * In the Assign Maintainable Items dialog, tick the row matching the
     * supplied text (or, if blank, the first selectable multi-select
     * checkbox), click the footer Assign button, then confirm the follow-up
     * OK popup. If a dedicated row checkbox isn't found, falls back to
     * clicking the row itself (which toggles selection on most SAPUI5
     * selectable lists).
     */
    async assignMaintainableItem(rowText: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        if (rowText && rowText.trim().length > 0) {
            const checkbox = await this.maintainableItemRowCheckbox(rowText);
            if (await checkbox.isExisting()) {
                await checkbox.scrollIntoView({ block: 'center' });
                await checkbox.waitForDisplayed({ timeout: 30000 });
                await utils.clickWithWait(this.maintainableItemRowCheckbox(rowText));
                console.log(`[ACTION] Maintainable item row checkbox ticked: "${rowText}"`);
            } else {
                const row = await this.maintainableItemRow(rowText);
                await row.waitForExist({ timeout: 30000 });
                await row.scrollIntoView({ block: 'center' });
                await row.waitForDisplayed({ timeout: 30000 });
                await utils.clickWithWait(this.maintainableItemRow(rowText));
                console.log(`[ACTION] Maintainable item row clicked: "${rowText}"`);
            }
        } else {
            const firstCb = await this.firstMaintainableItemMultiSelectCheckbox;
            await firstCb.waitForExist({ timeout: 30000 });
            await firstCb.scrollIntoView({ block: 'center' });
            await firstCb.waitForDisplayed({ timeout: 30000 });
            await utils.clickWithWait(this.firstMaintainableItemMultiSelectCheckbox);
            console.log('[ACTION] First maintainable item multi-select checkbox ticked');
        }

        const assign = await this.assignDialogAssignButton;
        await assign.waitForExist({ timeout: 30000 });
        await assign.scrollIntoView({ block: 'center' });
        await assign.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assignDialogAssignButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Assign Maintainable Items dialog Assign button clicked');

        // Confirm the follow-up OK popup that now appears after Assign.
        const ok = await this.okButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Assign Maintainable Items confirmation OK clicked');
    }

    /**
     * In the Assign Maintainable Items popover/dialog, type into the search
     * field, tick the first matching row's checkbox, click Assign, then
     * confirm the follow-up OK popup.
     */
    async searchAndAssignFirstMaintainableItem(searchText: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        const search = await this.assignDialogSearchInput;
        await search.waitForExist({ timeout: 30000 });
        await search.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assignDialogSearchInput);
        await search.clearValue();
        await search.setValue(searchText);
        await browser.keys('Enter');
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(800);
        console.log(`[ACTION] Assign Maintainable Items — searched: "${searchText}"`);

        // Prefer the row matched by the search text; fall back to "first row" locator.
        let firstCb = await this.firstAssignDialogItemCheckboxByText(searchText);
        if (!(await firstCb.isExisting())) {
            firstCb = await this.firstAssignDialogItemCheckbox;
        }
        await firstCb.waitForExist({ timeout: 30000 });
        await firstCb.scrollIntoView({ block: 'center' });
        await firstCb.waitForDisplayed({ timeout: 30000 });
        await firstCb.click();
        console.log('[ACTION] First filtered maintainable item checkbox ticked');

        const assign = await this.assignDialogAssignButton;
        await assign.waitForExist({ timeout: 30000 });
        await assign.scrollIntoView({ block: 'center' });
        await assign.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assignDialogAssignButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Assign Maintainable Items dialog Assign button clicked');

        const ok = await this.okButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Assign Maintainable Items confirmation OK clicked');
    }

    /**
     * Click the "Assign Failure Modes" entry in the popover that opens
     * after clicking an Assessment Hierarchy row's "+" button.
     */
    async clickAssignFailureModesMenuItem(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const item = await this.assignFailureModesMenuItem;
        await item.waitForExist({ timeout: 30000 });
        await item.scrollIntoView({ block: 'center' });
        await item.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assignFailureModesMenuItem);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] "Assign Failure Modes" menu item clicked');
    }

    /**
     * In the Assign Failure Modes dialog, type into the search field, tick
     * the first matching row's checkbox, then click Assign.
     */
    async searchAndAssignFailureMode(searchText: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        const search = await this.assignDialogSearchInput;
        await search.waitForExist({ timeout: 30000 });
        await search.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assignDialogSearchInput);
        await search.clearValue();
        await search.setValue(searchText);
        await browser.keys('Enter');
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(800);
        console.log(`[ACTION] Assign Failure Modes — searched: "${searchText}"`);

        let firstCb = await this.firstAssignDialogItemCheckboxByText(searchText);
        if (!(await firstCb.isExisting())) {
            firstCb = await this.firstAssignDialogItemCheckbox;
        }
        await firstCb.waitForExist({ timeout: 30000 });
        await firstCb.scrollIntoView({ block: 'center' });
        await firstCb.waitForDisplayed({ timeout: 30000 });
        await firstCb.click();
        console.log(`[ACTION] Failure mode checkbox ticked: "${searchText}"`);

        const assign = await this.assignDialogAssignButton;
        await assign.waitForExist({ timeout: 30000 });
        await assign.scrollIntoView({ block: 'center' });
        await assign.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assignDialogAssignButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Assign Failure Modes dialog Assign button clicked');

        const ok = await this.okButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Assign Failure Modes confirmation OK clicked');
    }
    async expandAssessmentHierarchyRow(rowIndex: number = 0): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const icon = await this.assessmentHierarchyTreeIcon(rowIndex);
        await icon.waitForExist({ timeout: 30000 });
        await icon.scrollIntoView({ block: 'center' });
        await icon.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assessmentHierarchyTreeIcon(rowIndex));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Assessment Hierarchy row${rowIndex} expand arrow clicked`);
    }

    async clickAssessmentHierarchyRowAddButton(rowText?: string, rowIndex?: number): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        let btn;
        if (typeof rowIndex === 'number') {
            btn = await this.assessmentHierarchyAddButtonByRowIndex(rowIndex);
        } else if (rowText && rowText.trim().length > 0) {
            btn = await this.assessmentHierarchyAddButtonByRowText(rowText);
        } else {
            throw new Error('clickAssessmentHierarchyRowAddButton: provide rowText or rowIndex');
        }

        await btn.waitForExist({ timeout: 30000 });
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await btn.click();
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "+" Add button clicked on Assessment Hierarchy row (${typeof rowIndex === 'number' ? `row${rowIndex}` : `"${rowText}"`})`);
    }

    /**
     * Click an Assessment Hierarchy row (e.g. "False alarms") by its visible
     * text to select/open it.
     */
    async clickAssessmentHierarchyRowByText(rowText: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const row = await this.assessmentHierarchyRowByText(rowText);
        await row.waitForExist({ timeout: 30000 });
        await row.scrollIntoView({ block: 'center' });
        await row.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assessmentHierarchyRowByText(rowText));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Assessment Hierarchy row clicked: "${rowText}"`);
    }

    /**
     * Click the "Assign" 
     */
    async assignSectionItemByText(sectionName: string, itemText: string | string[]): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const sectionAssign = await this.sectionAssignButtonByName(sectionName);
        await sectionAssign.waitForExist({ timeout: 30000 });
        await sectionAssign.scrollIntoView({ block: 'center' });
        await sectionAssign.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.sectionAssignButtonByName(sectionName));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "${sectionName}" Assign button clicked`);

        const items = Array.isArray(itemText) ? itemText : [itemText];
        for (const item of items) {
            const cb = await this.firstAssignDialogItemCheckboxByText(item);
            await cb.waitForExist({ timeout: 30000 });
            await cb.scrollIntoView({ block: 'center' });
            await cb.waitForDisplayed({ timeout: 30000 });
            await cb.click();
            console.log(`[ACTION] "${sectionName}" item checkbox ticked: "${item}"`);
        }

        const assign = await this.assignDialogAssignButton;
        await assign.waitForExist({ timeout: 30000 });
        await assign.scrollIntoView({ block: 'center' });
        await assign.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assignDialogAssignButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "${sectionName}" dialog Assign button clicked`);

        const ok = await this.okButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.okButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "${sectionName}" assignment confirmation OK clicked`);
    }

    /**
     * Expand the supplied Failure Mode detail section (e.g. "Failure
     * Mechanism"), tick the row matching the supplied item text, click the
     * section's "Remove" button, then confirm the follow-up Yes + OK popups.
     */
    async removeSectionItemByText(sectionName: string, itemText: string | string[]): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        const expand = await this.sectionExpandIconByName(sectionName);
        await expand.waitForExist({ timeout: 30000 });
        await expand.scrollIntoView({ block: 'center' });
        await expand.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.sectionExpandIconByName(sectionName));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "${sectionName}" section expanded`);

        const items = Array.isArray(itemText) ? itemText : [itemText];
        for (const item of items) {
            const cb = await this.sectionRowCheckboxByText(item);
            await cb.waitForExist({ timeout: 30000 });
            await cb.scrollIntoView({ block: 'center' });
            await cb.waitForDisplayed({ timeout: 30000 });
            await cb.click();
            console.log(`[ACTION] "${sectionName}" row checkbox ticked: "${item}"`);
        }

        const remove = await this.sectionRemoveButtonByName(sectionName);
        await remove.waitForExist({ timeout: 30000 });
        await remove.scrollIntoView({ block: 'center' });
        await remove.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.sectionRemoveButtonByName(sectionName));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "${sectionName}" Remove button clicked`);

        const yes = await this.yesButton;
        await yes.waitForExist({ timeout: 30000 });
        await yes.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.yesButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "${sectionName}" remove confirmation Yes clicked`);

        // Wait for the original confirmation dialog to close before looking
        // for the follow-up success popup (otherwise the okButton locator
        // can re-match the Yes button that's still present in the DOM).
        await yes.waitForDisplayed({ reverse: true, timeout: 30000 }).catch(() => { /* may already be gone */ });
        await browser.pause(500);
        await this.confirmSuccessPopup();
        console.log(`[ACTION] "${sectionName}" remove success popup OK clicked`);
    }

    /**
     * Expand a Failure Mode detail section panel (e.g. "Strategies") via its
     * header Expand/Collapse button. No-op if already expanded.
     */
    async expandSection(sectionName: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const expand = await this.sectionExpandIconByName(sectionName);
        await expand.waitForExist({ timeout: 30000 });
        await expand.scrollIntoView({ block: 'center' });
        await expand.waitForDisplayed({ timeout: 30000 });
        const expanded = await expand.getAttribute('aria-expanded');
        if (expanded === 'true') {
            console.log(`[ACTION] "${sectionName}" section already expanded`);
            return;
        }
        await utils.clickWithWait(this.sectionExpandIconByName(sectionName));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "${sectionName}" section expanded`);
    }

    /**
     * Click the "Create" link on the Strategies section header to open the
     * Create Strategy dialog, fill its fields, and submit.
     */
    async createStrategy(data: {
        description: string;
        longDescription?: string;
        type: string;
        inspectionType?: string;
        inspectionStage?: string;
        startDate: string;
        dueDate: string;
    }): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        // 1. Click the section "Create" link.
        const createLink = await this.sectionCreateButtonByName('Strategies');
        await createLink.waitForExist({ timeout: 30000 });
        await createLink.scrollIntoView({ block: 'center' });
        await createLink.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.sectionCreateButtonByName('Strategies'));
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Strategies — Create link clicked');

        // 2. Wait for the dialog.
        const dialog = await this.createStrategyDialog;
        await dialog.waitForExist({ timeout: 30000 });
        await dialog.waitForDisplayed({ timeout: 30000 });

        // 3. Description.
        const descInput = await this.createStrategyDialogField('Description');
        await descInput.waitForDisplayed({ timeout: 30000 });
        await descInput.click();
        await descInput.setValue(data.description);
        console.log(`[ACTION] Create Strategy — Description: "${data.description}"`);

        // 4. Long Description (optional).
        if (data.longDescription && data.longDescription.length > 0) {
            const longInput = await this.createStrategyDialogField('Long Description');
            await longInput.waitForDisplayed({ timeout: 30000 });
            await longInput.click();
            await longInput.setValue(data.longDescription);
            console.log(`[ACTION] Create Strategy — Long Description set`);
        }

        // 5. Type / Inspection Type / Inspection Stage dropdowns.
        await this.selectCreateStrategyDropdown('Type', data.type);
        if (data.inspectionType) {
            await this.selectCreateStrategyDropdown('Inspection Type', data.inspectionType);
        }
        if (data.inspectionStage) {
            await this.selectCreateStrategyDropdown('Inspection Stage', data.inspectionStage);
        }

        // 6. Dates.
        await this.fillCreateStrategyDate('Start Date', data.startDate);
        await this.fillCreateStrategyDate('Due Date', data.dueDate);

        // 7. Submit.
        const create = await this.createStrategyDialogCreateButton;
        await create.waitForExist({ timeout: 30000 });
        await create.scrollIntoView({ block: 'center' });
        await create.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.createStrategyDialogCreateButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Create Strategy — Create clicked');

        // 8. Confirm any success popup if it appears.
        try { await this.confirmSuccessPopup(); } catch { /* no popup */ }
    }

    /**
     * Tick the checkbox of the strategy row matching `currentDescription`,
     * click the Strategies section "Edit & Update" toolbar button, change the
     * Description in the Edit Strategy dialog to `newDescription`, click
     * Save and confirm the follow-up success popup.
     */
    async editStrategyDescription(currentDescription: string, newDescription: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        // 1. Tick the strategy row checkbox.
        const cb = await this.strategyRowCheckboxByText(currentDescription);
        await cb.waitForExist({ timeout: 30000 });
        await cb.scrollIntoView({ block: 'center' });
        await cb.waitForDisplayed({ timeout: 30000 });
        await cb.click();
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Strategies — row checkbox ticked: "${currentDescription}"`);

        // 2. Click "Edit & Update" toolbar button on Strategies section.
        const editUpdate = await this.sectionToolbarButtonByName('Strategies', 'Edit & Update');
        await editUpdate.waitForExist({ timeout: 30000 });
        await editUpdate.scrollIntoView({ block: 'center' });
        await editUpdate.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.sectionToolbarButtonByName('Strategies', 'Edit & Update'));
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Strategies — "Edit & Update" clicked');

        // 3. Wait for Edit Strategy dialog and update Description.
        const dialog = await this.editStrategyDialog;
        await dialog.waitForExist({ timeout: 30000 });
        await dialog.waitForDisplayed({ timeout: 30000 });

        const descInput = await this.editStrategyDialogField('Description');
        await descInput.waitForDisplayed({ timeout: 30000 });
        await descInput.click();
        // Clear existing value before setting the new one.
        await descInput.setValue('');
        await descInput.setValue(newDescription);
        console.log(`[ACTION] Edit Strategy — Description: "${newDescription}"`);

        // 4. Click Save.
        const save = await this.editStrategyDialogSaveButton;
        await save.waitForExist({ timeout: 30000 });
        await save.scrollIntoView({ block: 'center' });
        await save.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.editStrategyDialogSaveButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Edit Strategy — Save clicked');

        // 5. Confirm success popup (OK).
        await dialog.waitForDisplayed({ reverse: true, timeout: 30000 }).catch(() => { /* may already be gone */ });
        await browser.pause(500);
        await this.confirmSuccessPopup();
        console.log('[ACTION] Edit Strategy — success popup OK clicked');
    }

    /**
     * Click the Operating Context tile/row by its visible name (e.g.
     * "TestOCC1") to navigate back to its detail view.
     */
    async clickOperatingContextByName(occName: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const label = await this.operatingContextLabelByName(occName);
        await label.waitForExist({ timeout: 30000 });
        await label.scrollIntoView({ block: 'center' });
        await label.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.operatingContextLabelByName(occName));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Operating Context clicked: "${occName}"`);
    }

    /**
     * Click "Assign/Unassign Technical Object" → "Assign" → submenu entry
     * (e.g. "Equipment" or "Functional Location"). Opens the Equipment
     * selection column on the right.
     */
    async assignTechnicalObject(type: 'Equipment' | 'Functional Location' = 'Equipment'): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        const dropdown = await this.assignUnassignTechnicalObjectButton;
        await dropdown.waitForExist({ timeout: 30000 });
        await dropdown.scrollIntoView({ block: 'center' });
        await dropdown.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.assignUnassignTechnicalObjectButton);
        await browser.pause(400);
        console.log('[ACTION] "Assign/Unassign Technical Object" dropdown clicked');

        const assignItem = await this.unifiedMenuItemByText('Assign');
        await assignItem.waitForExist({ timeout: 30000 });
        await assignItem.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.unifiedMenuItemByText('Assign'));
        await browser.pause(400);
        console.log('[ACTION] Assign menu item clicked');

        const typeItem = await this.unifiedMenuItemByText(type);
        await typeItem.waitForExist({ timeout: 30000 });
        await typeItem.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.unifiedMenuItemByText(type));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] "${type}" submenu item clicked`);
    }

    /**
     * In the Equipment selection column, tick the first row checkbox, click
     * Confirm, confirm the success popup OK, then click the Close column "x".
     */
    async confirmFirstEquipmentAndCloseColumn(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        const dialog = await this.equipmentDialog;
        await dialog.waitForExist({ timeout: 30000 });
        await dialog.waitForDisplayed({ timeout: 30000 });
        await browser.pause(800);

        const cb = await this.firstEquipmentRowCheckbox;
        await cb.waitForExist({ timeout: 30000 });
        await cb.scrollIntoView({ block: 'center' });
        await cb.waitForDisplayed({ timeout: 30000 });
        await cb.click();
        console.log('[ACTION] Equipment — first row checkbox ticked');

        const confirm = await this.equipmentDialogConfirmButton;
        await confirm.waitForExist({ timeout: 30000 });
        await confirm.scrollIntoView({ block: 'center' });
        await confirm.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.equipmentDialogConfirmButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Equipment — Confirm clicked');

        await browser.pause(500);
        await this.confirmSuccessPopup();
        console.log('[ACTION] Equipment — success popup OK clicked');

        const close = await this.closeColumnButton;
        await close.waitForExist({ timeout: 30000 });
        await close.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.closeColumnButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Equipment column closed');
    }

    /** Open a dropdown in the Create Strategy dialog and pick the option by visible text. */
    private async selectCreateStrategyDropdown(label: string, value: string): Promise<void> {
        const arrow = await this.createStrategyDialogSelectArrow(label);
        await arrow.waitForExist({ timeout: 30000 });
        await arrow.scrollIntoView({ block: 'center' });
        await arrow.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.createStrategyDialogSelectArrow(label));
        await browser.pause(400);

        const option = await this.comboboxOptionByText(value);
        await option.waitForExist({ timeout: 30000 });
        await option.scrollIntoView({ block: 'center' });
        await option.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.comboboxOptionByText(value));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Create Strategy — ${label}: "${value}"`);
    }

    /** Pick a date in a Create Strategy dialog field via the calendar popover. */
    private async fillCreateStrategyDate(label: string, value: string): Promise<void> {
        const target = this.parseDate(value);
        const targetYmd = this.toYyyymmdd(target);

        await this.dismissAnyOpenCalendarPopover();

        const icon = await this.createStrategyDialogPickerIcon(label);
        await icon.scrollIntoView({ block: 'center' });
        await icon.waitForExist({ timeout: 30000 });
        await icon.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.createStrategyDialogPickerIcon(label));

        const popover = await this.visibleCalendarPopover;
        await popover.waitForDisplayed({ timeout: 30000 });
        await browser.pause(300);

        await this.navigateCalendarToMonth(target);

        const day = await this.calendarDayByDataAttr(targetYmd);
        await day.waitForExist({ timeout: 30000 });
        await day.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.calendarDayByDataAttr(targetYmd));

        try {
            await browser.waitUntil(
                async () => {
                    const p = await this.visibleCalendarPopover;
                    return !(await p.isExisting()) || !(await p.isDisplayed());
                },
                { timeout: 5000, interval: 200, timeoutMsg: 'Calendar popover did not close' }
            );
        } catch {
            await this.dismissAnyOpenCalendarPopover();
        }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(300);
        console.log(`[ACTION] Create Strategy — ${label}: ${value}`);
    }

    /**
     * Click the "Summary Report" button and confirm the follow-up "Yes" dialog.
     */
    async openSummaryReportAndConfirm(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.summaryReportButton;
        await btn.waitForExist({ timeout: 30000 });
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.summaryReportButton);
        console.log('[ACTION] Summary Report button clicked');

        const yes = await this.yesButton;
        await yes.waitForExist({ timeout: 30000 });
        await yes.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.yesButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Summary Report confirmation — Yes clicked');
        await browser.pause(5000);
        // A second popup appears after Yes — dismiss it with OK.
        await this.confirmSuccessPopup();
        console.log('[ACTION] Summary Report final popup — OK clicked');
    }
}

export default new AssetStrategyAnalysisForClassesPage();
