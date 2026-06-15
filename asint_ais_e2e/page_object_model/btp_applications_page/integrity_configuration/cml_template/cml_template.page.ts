import { $, browser } from '@wdio/globals';
import utils from '../../../../utils/utils';

export interface CreateCmlTemplateInput {
    shortDescription: string;
    longDescription?: string;
}

export interface EditCmlTemplateInput {
    shortDescription?: string;
    longDescription?: string;
}

class CmlTemplatePage {

    /* ========================
       SELECTORS  (no id / no class — aria-label, role, bdi-text only)
       ======================== */

    /* --- Home tile --- */
    private get appTile() { return $('//a[starts-with(@aria-label, "CML Templates")]'); }
    private get appIframe() { return $('iframe[data-help-id="application-cmlconfig-manage"]'); }
    // Creattion of the CML Template
    private get createButton() { return $('//button[@aria-label="Add" or @title="Add"]'); }
    private static readonly DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Create New CML Template"]]';
    private get createDialog() { return $(CmlTemplatePage.DIALOG_XPATH); }
    private fieldInputByLabel(label: string) { return $(`${CmlTemplatePage.DIALOG_XPATH}//div[contains(@class,"sapUiFormCLElement") or contains(@class,"sapUiFormElement")][.//bdi[normalize-space()=${utils.xpathString(label)}]]//input[not(@readonly)]`); }
    private fieldEditableByLabel(label: string) { return $(`${CmlTemplatePage.DIALOG_XPATH}//div[contains(@class,"sapUiFormCLElement") or contains(@class,"sapUiFormElement")][.//bdi[normalize-space()=${utils.xpathString(label)}]]//*[(self::input or self::textarea) and not(@readonly)]`); }
    private get shortDescriptionInput() { return this.fieldInputByLabel('Short Description'); }
    private get longDescriptionInput() { return this.fieldEditableByLabel('Long Description'); }
    private get objectTemplateValueHelpIcon() { return $(`${CmlTemplatePage.DIALOG_XPATH}//div[contains(@class,"sapUiFormCLElement") or contains(@class,"sapUiFormElement")][.//bdi[normalize-space()="Object Template"]]//span[@aria-label="Show Value Help"][1]`); }
    private get valueHelpFirstRow() { return $('(//div[@role="dialog" or @role="alertdialog"][.//table or .//tbody]//tbody/tr[@role="row"])[1]'); }
    private valueHelpRowByIndex(index: number) { return $(`(//div[@role="dialog" or @role="alertdialog"][.//table or .//tbody]//tbody/tr[@role="row"])[${index}]`); }
    private get dialogCreateButton() { return $(`${CmlTemplatePage.DIALOG_XPATH}//button[normalize-space()="Create" or .//bdi[normalize-space()="Create"]]`); }

    /* --- Open / Delete CML Template --- */
    private listRowByDescription(description: string) { return $(`//tr[@role="row"][.//*[normalize-space()=${utils.xpathString(description)}]]`); }
    private get deleteButton() { return $('//button[@data-ui5-accesskey="d"][.//bdi[normalize-space()="Delete"]] | //button[.//bdi[normalize-space()="Delete"]]'); }
    private get confirmYesButton() { return $('//div[contains(@class,"sapMMessageBox") or @role="alertdialog"]//button[normalize-space()="Yes" or .//bdi[normalize-space()="Yes"]]'); }
    private get confirmOkButton() { return $('//div[contains(@class,"sapMMessageBox") or @role="alertdialog"]//button[normalize-space()="OK" or normalize-space()="Ok" or .//bdi[normalize-space()="OK" or normalize-space()="Ok"]]'); }

    /* --- Edit (Publish) header button + Save --- */
    private get editHeaderButton() { return $('//button[@data-ui5-accesskey="e"][.//bdi[normalize-space()="Edit Header"]] | //button[.//bdi[normalize-space()="Edit Header"]]'); }
    private get dialogSaveButton() { return $(`${CmlTemplatePage.DIALOG_XPATH}//button[normalize-space()="Save" or .//bdi[normalize-space()="Save"]]`); }

    /* --- "Add CML Template" (child) dialog --- */
    private get addCmlTemplateButton() { return $('//button[@aria-label="Add CML Template" or @title="Add CML Template"]'); }
    private static readonly ADD_CML_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Add CML Template"]]';
    private get addCmlTemplateDialog() { return $(CmlTemplatePage.ADD_CML_DIALOG_XPATH); }
    private get addCmlTemplateDescriptionInput() { return $(`${CmlTemplatePage.ADD_CML_DIALOG_XPATH}//input[not(@readonly) and @aria-required="true"] | ${CmlTemplatePage.ADD_CML_DIALOG_XPATH}//bdi[normalize-space()="Description"]/ancestor::label[1]/following::input[not(@readonly)][1]`); }
    private get addCmlTemplateCreateButton() { return $(`${CmlTemplatePage.ADD_CML_DIALOG_XPATH}//button[normalize-space()="Create" or .//bdi[normalize-space()="Create"]]`); }

    /* --- "Add Persona" dialog --- */
    private addPersonaButtonByIndex(index: number) { return $(`(//button[@aria-label="Add Persona" or @title="Add Persona"])[${index}]`); }
    private static readonly ADD_PERSONA_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Add Persona"]]';
    private get addPersonaDialog() { return $(CmlTemplatePage.ADD_PERSONA_DIALOG_XPATH); }
    private get personaTypeDropdownArrow() { return $(`${CmlTemplatePage.ADD_PERSONA_DIALOG_XPATH}//bdi[normalize-space()="Persona Type"]/ancestor::label[1]/following::span[contains(@class,"sapMSltArrow")][1]`); }
    private personaTypeOption(label: string) { return $(`//li[@role="option"][.//bdi[normalize-space()=${utils.xpathString(label)}] or normalize-space()=${utils.xpathString(label)}]`); }
    private get addPersonaDescriptionInput() { return $(`${CmlTemplatePage.ADD_PERSONA_DIALOG_XPATH}//bdi[normalize-space()="Description"]/ancestor::label[1]/following::input[not(@readonly)][1]`); }
    private get addPersonaCreateButton() { return $(`${CmlTemplatePage.ADD_PERSONA_DIALOG_XPATH}//button[normalize-space()="Create" or .//bdi[normalize-space()="Create"]]`); }

    /* --- Tree expand / per-row delete buttons --- */
    private expandNodeByIndex(index: number) { return $(`(//*[@aria-label="Expand Node"])[${index}]`); }
    private deletePersonaButtonByDescription(description: string) { return $(`//*[normalize-space()=${utils.xpathString(description)}]/ancestor::*[.//button[@aria-label="Delete Persona"]][1]//button[@aria-label="Delete Persona"]`); }
    private deleteCmlTemplateEntryButtonByDescription(description: string) { return $(`//*[normalize-space()=${utils.xpathString(description)}]/ancestor::*[.//button[@aria-label="Delete CML Template"]][1]//button[@aria-label="Delete CML Template"]`); }

    /* --- Persona row + Add Data Store dialog --- */
    private personaRowByDescription(description: string) { return $(`//li[@role="treeitem"][.//*[normalize-space()=${utils.xpathString(description)}]] | //tr[@role="row"][.//*[normalize-space()=${utils.xpathString(description)}]]`); }
    private get addDataStoreButton() { return $('//button[@aria-label="Add Data Store" or @title="Add Data Store"]'); }
    private static readonly ADD_DATA_STORE_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Add Data Store"]]';
    private get addDataStoreDialog() { return $(CmlTemplatePage.ADD_DATA_STORE_DIALOG_XPATH); }
    /** Match a form field by its label text — works for Form, SimpleForm and VBox layouts. */
    private dataStoreFieldInputByLabel(label: string) { return $(`${CmlTemplatePage.ADD_DATA_STORE_DIALOG_XPATH}//label[.//bdi[normalize-space()=${utils.xpathString(label)}] or normalize-space()=${utils.xpathString(label)} or normalize-space()=${utils.xpathString(`${label}:`)}]/following::input[not(@readonly)][1]`); }
    private get dataStoreNameInput() { return this.dataStoreFieldInputByLabel('Name'); }
    private get dataStoreDescriptionInput() { return this.dataStoreFieldInputByLabel('Description'); }
    /** Click the Select control itself (role="combobox") rather than the inner arrow span — the arrow span doesn't always trigger the open handler. */
    private get dataStoreDataTypeDropdownArrow() { return $(`${CmlTemplatePage.ADD_DATA_STORE_DIALOG_XPATH}//label[.//bdi[normalize-space()=${utils.xpathString('Data Type')}] or normalize-space()=${utils.xpathString('Data Type')} or normalize-space()=${utils.xpathString('Data Type:')}]/following::div[@role="combobox" or contains(@class,"sapMSlt ") or (contains(@class,"sapMSlt") and not(contains(@class,"sapMSltArrow")) and not(contains(@class,"sapMSltLabel")) and not(contains(@class,"sapMSltList")))][1]`); }
    private dataStoreDataTypeOptionByLabel(label: string) { return $(`//div[contains(@class,"sapMSltPopover") or contains(@class,"sapMSelectList")]//li[@role="option"][normalize-space()=${utils.xpathString(label)} or .//bdi[normalize-space()=${utils.xpathString(label)}]] | //ul[contains(@class,"sapMSelectList") or contains(@class,"sapMSltList") or @role="listbox"]//li[@role="option"][normalize-space()=${utils.xpathString(label)} or .//bdi[normalize-space()=${utils.xpathString(label)}]]`); }
    private get dataStoreCodeListValueHelpIcon() { return $(`${CmlTemplatePage.ADD_DATA_STORE_DIALOG_XPATH}//label[.//bdi[normalize-space()=${utils.xpathString('CodeList')} or normalize-space()=${utils.xpathString('CodeList (Optional)')}] or normalize-space()=${utils.xpathString('CodeList')} or normalize-space()=${utils.xpathString('CodeList (Optional):')} or normalize-space()=${utils.xpathString('CodeList (Optional)')}]/following::span[@aria-label="Show Value Help" or contains(@class,"sapMInputBaseIcon")][1]`); }
    private get addDataStoreCreateButton() { return $(`${CmlTemplatePage.ADD_DATA_STORE_DIALOG_XPATH}//button[normalize-space()="Create" or .//bdi[normalize-space()="Create"]]`); }

    /* --- Add Reading dialog --- */
    private get addReadingButton() { return $('//button[@aria-label="Add Reading Data Store" or @title="Add Reading Data Store" or .//bdi[normalize-space()="Add Reading"]]'); }
    private static readonly ADD_READING_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Add Reading" or normalize-space()="Add Reading Data Store" or normalize-space()="Reading Count" or normalize-space()="Number of Readings"]]';
    private get addReadingDialog() { return $(CmlTemplatePage.ADD_READING_DIALOG_XPATH); }
    private get addReadingIncrementButton() { return $(`${CmlTemplatePage.ADD_READING_DIALOG_XPATH}//span[@aria-label="Increase" or contains(@id,"-incrementBtn")]`); }
    private get addReadingSaveButton() { return $(`${CmlTemplatePage.ADD_READING_DIALOG_XPATH}//button[normalize-space()="Save" or .//bdi[normalize-space()="Save"]]`); }

    /* --- Add Section dialog --- */
    private get addSectionButton() { return $('//button[@aria-label="Add Section" or @title="Add Section"]'); }
    private static readonly ADD_SECTION_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Add Section"]]';
    private get addSectionDialog() { return $(CmlTemplatePage.ADD_SECTION_DIALOG_XPATH); }
    private addSectionFieldEditableByLabel(label: string) { return $(`${CmlTemplatePage.ADD_SECTION_DIALOG_XPATH}//label[.//bdi[normalize-space()=${utils.xpathString(label)}] or normalize-space()=${utils.xpathString(label)} or normalize-space()=${utils.xpathString(`${label}:`)}]/following::*[(self::input or self::textarea) and not(@readonly)][1]`); }
    private get addSectionNameInput() { return this.addSectionFieldEditableByLabel('Name'); }
    private get addSectionDescriptionInput() { return this.addSectionFieldEditableByLabel('Description'); }
    private get addSectionLongDescriptionInput() { return this.addSectionFieldEditableByLabel('Long Description'); }
    private get addSectionPublishSequenceInput() { return this.addSectionFieldEditableByLabel('Publish Sequence'); }
    private get addSectionCreateButton() { return $(`${CmlTemplatePage.ADD_SECTION_DIALOG_XPATH}//button[normalize-space()="Create" or .//bdi[normalize-space()="Create"]]`); }

    /* --- Add Visualization dialog --- */
    private get newVisualizationConfigButton() { return $('//button[.//bdi[normalize-space()="New Visualization Configuration"] or normalize-space()="New Visualization Configuration"]'); }
    private static readonly ADD_VIS_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Add Visualization"]]';
    private get addVisualizationDialog() { return $(CmlTemplatePage.ADD_VIS_DIALOG_XPATH); }
    private addVisualizationFieldEditableByLabel(label: string) { return $(`${CmlTemplatePage.ADD_VIS_DIALOG_XPATH}//label[.//bdi[normalize-space()=${utils.xpathString(label)}] or normalize-space()=${utils.xpathString(label)} or normalize-space()=${utils.xpathString(`${label}:`)}]/following::*[(self::input or self::textarea) and not(@readonly)][1]`); }
    private get addVisualizationDescriptionInput() { return this.addVisualizationFieldEditableByLabel('Description'); }
    private get addVisualizationTypeDropdownArrow() { return $(`${CmlTemplatePage.ADD_VIS_DIALOG_XPATH}//label[.//bdi[normalize-space()=${utils.xpathString('Visualization Type')}] or normalize-space()=${utils.xpathString('Visualization Type')} or normalize-space()=${utils.xpathString('Visualization Type:')}]/following::div[@role="combobox" or contains(@class,"sapMSlt ") or (contains(@class,"sapMSlt") and not(contains(@class,"sapMSltArrow")) and not(contains(@class,"sapMSltLabel")) and not(contains(@class,"sapMSltList")))][1]`); }
    private addVisualizationTypeOptionByLabel(label: string) { return $(`//div[contains(@class,"sapMSltPopover") or contains(@class,"sapMSelectList")]//li[@role="option"][normalize-space()=${utils.xpathString(label)} or .//bdi[normalize-space()=${utils.xpathString(label)}]] | //ul[contains(@class,"sapMSelectList") or contains(@class,"sapMSltList") or @role="listbox"]//li[@role="option"][normalize-space()=${utils.xpathString(label)} or .//bdi[normalize-space()=${utils.xpathString(label)}]]`); }
    private get addVisualizationCreateButton() { return $(`${CmlTemplatePage.ADD_VIS_DIALOG_XPATH}//button[normalize-space()="Create" or .//bdi[normalize-space()="Create"]]`); }

    /* --- Add Visualization Mapping dialog --- */
    private get addVisualizationMappingButton() { return $('//button[@aria-label="Add Visualization Mapping" or @title="Add Visualization Mapping"]'); }
    private static readonly ADD_VIS_MAPPING_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Add Mapping" or normalize-space()="Add Visualization Mapping"]]';
    private get addVisualizationMappingDialog() { return $(CmlTemplatePage.ADD_VIS_MAPPING_DIALOG_XPATH); }
    private addVisualizationMappingFieldEditableByLabel(label: string) { return $(`${CmlTemplatePage.ADD_VIS_MAPPING_DIALOG_XPATH}//label[.//bdi[normalize-space()=${utils.xpathString(label)}] or normalize-space()=${utils.xpathString(label)} or normalize-space()=${utils.xpathString(`${label}:`)}]/following::*[(self::input or self::textarea) and not(@readonly)][1]`); }
    private get addVisualizationMappingLabelInput() { return this.addVisualizationMappingFieldEditableByLabel('Label'); }
    /** `<label>` element of a field inside the Add Mapping dialog (e.g. "Option"). */
    private addVisualizationMappingLabelByText(label: string) {
        const labelMatch = `.//bdi[normalize-space()=${utils.xpathString(label)}] or normalize-space()=${utils.xpathString(label)} or normalize-space()=${utils.xpathString(`${label}:`)}`;
        return $(`${CmlTemplatePage.ADD_VIS_MAPPING_DIALOG_XPATH}//label[${labelMatch}]`);
    }
    /** Resolve the dropdown "arrow" (role="button", id ends with "-arrow") that belongs to the field
     *  whose `<label>` text matches `label`. Works for sap.m.Select (no editable input), ComboBox and MultiComboBox.
     *  Resolution order:
     *    1) <label for="X"> → control with id=X (or one of its descendants); look for "-arrow" inside.
     *    2) <label id="L"> → element with aria-labelledby containing L (the arrow is typically labelled by the field label).
     *    3) Fallback: from the label, walk to the nearest SAP input-base container and find "-arrow" inside.
     */
    private async addVisualizationMappingDropdownArrowByLabel(label: string): Promise<WebdriverIO.Element> {
        const labelEl = await this.addVisualizationMappingLabelByText(label);
        await labelEl.waitForExist({ timeout: 30000 });

        const forId = await labelEl.getAttribute('for');
        const labelId = await labelEl.getAttribute('id');

        const arrow = await browser.execute((forIdIn: string | null, labelIdIn: string | null) => {
            const closestContainer = (el: Element | null): Element | null =>
                el ? (el.closest('.sapMSlt, .sapMComboBox, .sapMMultiComboBox, .sapMComboBoxBase, .sapMInputBase') || el) : null;
            const findArrowIn = (root: Element | null): Element | null => {
                if (!root) return null;
                return (
                    root.querySelector('span[role="button"][id$="-arrow"]') ||
                    (root.id && root.id.endsWith('-arrow') && root.getAttribute('role') === 'button' ? root : null)
                );
            };

            // 1) label[for]
            if (forIdIn) {
                const control = document.getElementById(forIdIn);
                const direct = findArrowIn(control);
                if (direct) return direct;
                const container = closestContainer(control);
                const inContainer = findArrowIn(container);
                if (inContainer) return inContainer;
            }

            // 2) aria-labelledby reverse lookup
            if (labelIdIn) {
                const candidates = Array.from(document.querySelectorAll(
                    `span[role="button"][id$="-arrow"][aria-labelledby~="${labelIdIn}"]`
                ));
                if (candidates.length) return candidates[0];
                const labelledControl = document.querySelector(`[aria-labelledby~="${labelIdIn}"]`);
                const container = closestContainer(labelledControl);
                const inContainer = findArrowIn(container);
                if (inContainer) return inContainer;
            }

            return null;
        }, forId || null, labelId || null) as unknown as WebdriverIO.Element | null;

        if (arrow) {
            return arrow as WebdriverIO.Element;
        }

        // 3) Fallback XPath used previously (works for ComboBox/MultiComboBox with editable inputs)
        const labelMatch = `.//bdi[normalize-space()=${utils.xpathString(label)}] or normalize-space()=${utils.xpathString(label)} or normalize-space()=${utils.xpathString(`${label}:`)}`;
        const fallback = await $(
            `${CmlTemplatePage.ADD_VIS_MAPPING_DIALOG_XPATH}//label[${labelMatch}]` +
            `/following::*[(self::input or self::textarea)][1]` +
            `/ancestor::div[contains(@class,"sapMComboBoxBase") or contains(@class,"sapMMultiComboBox") or contains(@class,"sapMComboBox") or contains(@class,"sapMSlt") or contains(@class,"sapMInputBase")][1]` +
            `//span[@role="button" and substring(@id, string-length(@id) - 5)="-arrow"]`
        );
        return fallback as unknown as WebdriverIO.Element;
    }
    /** First editable input that follows a given field label inside the Add Mapping dialog. */
    private addVisualizationMappingInputByLabel(label: string) {
        const labelMatch = `.//bdi[normalize-space()=${utils.xpathString(label)}] or normalize-space()=${utils.xpathString(label)} or normalize-space()=${utils.xpathString(`${label}:`)}`;
        return $(`${CmlTemplatePage.ADD_VIS_MAPPING_DIALOG_XPATH}//label[${labelMatch}]/following::input[not(@readonly)][1]`);
    }
    /** Broad option matcher: any visible li[@role="option"] (or listitem) anywhere whose text equals/contains the label, case-insensitive. */
    private addVisualizationMappingOptionByLabel(label: string) {
        const upper = label.toUpperCase();
        const tr = `translate(normalize-space(.), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')`;
        return $(`//li[(@role="option" or @role="listitem") and (${tr}=${utils.xpathString(upper)} or contains(${tr}, ${utils.xpathString(upper)}))]`);
    }
    private get addVisualizationMappingCreateButton() { return $(`${CmlTemplatePage.ADD_VIS_MAPPING_DIALOG_XPATH}//button[normalize-space()="Create" or .//bdi[normalize-space()="Create"]]`); }

    /* --- New API Configuration dialog --- */
    private get newApiConfigButton() { return $('//button[.//bdi[normalize-space()="New API Configuration"] or normalize-space()="New API Configuration"]'); }
    private static readonly ADD_API_CONFIG_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="New API Configuration" or normalize-space()="Add API Configuration" or normalize-space()="API Configuration"]]';
    private get addApiConfigDialog() { return $(CmlTemplatePage.ADD_API_CONFIG_DIALOG_XPATH); }
    /** First dropdown arrow inside the New API Configuration dialog (the API field is a sap.m.Select). */
    private get addApiConfigFirstDropdownArrow() { return $(`(${CmlTemplatePage.ADD_API_CONFIG_DIALOG_XPATH}//span[@role="button" and substring(@id, string-length(@id) - 5)="-arrow"])[1]`); }
    private get addApiConfigCreateButton() { return $(`${CmlTemplatePage.ADD_API_CONFIG_DIALOG_XPATH}//button[normalize-space()="Create" or .//bdi[normalize-space()="Create"]]`); }

    /* --- Edit API Configuration (Save_API section) --- */
    private get saveApiAnchorButton() { return $('//button[@role="tab"][.//bdi[normalize-space()="Save_API"]] | //button[.//bdi[normalize-space()="Save_API"]]'); }
    private get editApiConfigButton() { return $('//button[@aria-label="Edit API Configuration" or @title="Edit API Configuration"]'); }
    /** Dialog opened by the "Edit API Configuration" pencil — its actual title is "Add API Configuration". */
    private static readonly EDIT_API_CONFIG_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Edit API Configuration" or normalize-space()="Add API Configuration" or normalize-space()="API Configuration"]]';
    private get editApiConfigDialog() { return $(CmlTemplatePage.EDIT_API_CONFIG_DIALOG_XPATH); }
    private get editApiConfigCreateButton() { return $(`${CmlTemplatePage.EDIT_API_CONFIG_DIALOG_XPATH}//button[normalize-space()="Create" or normalize-space()="Save" or .//bdi[normalize-space()="Create" or normalize-space()="Save"]]`); }

    /* --- Add API Mapping dialog --- */
    private get addApiMappingButton() { return $('//button[@aria-label="Add API Mapping" or @title="Add API Mapping"]'); }
    private static readonly ADD_API_MAPPING_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Add API Mapping" or normalize-space()="New API Mapping" or normalize-space()="API Mapping"]]';
    private get addApiMappingDialog() { return $(CmlTemplatePage.ADD_API_MAPPING_DIALOG_XPATH); }
    private get addApiMappingCreateButton() { return $(`${CmlTemplatePage.ADD_API_MAPPING_DIALOG_XPATH}//button[normalize-space()="Create" or .//bdi[normalize-space()="Create"]]`); }

    /* --- Picklist section + Add Picklist dialog --- */
    private get picklistTab() { return $('//div[@role="tab"][.//span[normalize-space()="Picklist"] or .//bdi[normalize-space()="Picklist"]]'); }
    /** "edit" split / menu button inside the Picklist section (aria-haspopup="menu"). */
    private get picklistEditMenuButton() { return $('//button[@aria-haspopup="menu" and (@aria-label="edit" or @title="edit")]'); }
    /** Menu item rendered after opening the picklist edit menu — could be a menuitem in an open menu/popover. */
    private get picklistAddMenuItem() { return $('//li[(@role="menuitem" or @role="option") and (.//*[normalize-space()="Add"] or normalize-space()="Add" or normalize-space()="+ Add")] | //div[contains(@class,"sapMMenu") or contains(@class,"sapUiMenu")]//*[normalize-space()="Add"]/ancestor::*[(@role="menuitem" or @role="option")][1]'); }
    private static readonly ADD_PICKLIST_DIALOG_XPATH = '//div[@role="dialog"][.//*[normalize-space()="Backend Picklist Mapping" or normalize-space()="Add Picklist" or normalize-space()="New Picklist" or normalize-space()="Picklist Mapping" or normalize-space()="Picklist"]]';
    private get addPicklistDialog() { return $(CmlTemplatePage.ADD_PICKLIST_DIALOG_XPATH); }
    private picklistFieldEditableByLabel(label: string) { return $(`${CmlTemplatePage.ADD_PICKLIST_DIALOG_XPATH}//label[.//bdi[contains(normalize-space(.), ${utils.xpathString(label)})] or contains(normalize-space(.), ${utils.xpathString(label)})]/following::*[(self::input or self::textarea) and not(@readonly)][1]`); }
    /** Fallback: first editable input inside the dialog (Picklist Description is the first text field). */
    private get picklistFirstEditableInput() { return $(`${CmlTemplatePage.ADD_PICKLIST_DIALOG_XPATH}//*[(self::input or self::textarea) and not(@readonly) and not(@type="hidden")][1]`); }
    private get picklistDescriptionInput() { return this.picklistFieldEditableByLabel('Picklist Description'); }
    private get addPicklistSaveButton() { return $(`${CmlTemplatePage.ADD_PICKLIST_DIALOG_XPATH}//button[normalize-space()="Save" or normalize-space()="Create" or .//bdi[normalize-space()="Save" or normalize-space()="Create"]]`); }

    /* ========================
       ACTIONS
       ======================== */

    async clickCmlTemplatesTile(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.waitForSAPPopupAndClose(10);
        await utils.clickWithWait(this.appTile);
        await utils.waitForBusyIndicatorToDisappear();
        await utils.switchToIframe(this.appIframe);
        await browser.pause(2000);
        console.log('[ACTION] Clicked "CML Templates" tile and switched into app iframe');
    }

    /** Click the "+" Create button to open the "Create New CML Template" dialog. */
    async clickCreateButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.createButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.createDialog.waitForDisplayed({ timeout: 30000 });
        console.log('[ACTION] "+" Create button clicked, "Create New CML Template" dialog displayed');
    }

    private async fillShortDescription(value: string): Promise<void> {
        const el = await this.shortDescriptionInput;
        await el.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.shortDescriptionInput);
        await el.clearValue();
        await el.setValue(value);
        await browser.keys('Tab');
        console.log(`[ACTION] Short Description entered: ${value}`);
    }

    private async fillLongDescription(value: string): Promise<void> {
        const el = await this.longDescriptionInput;
        await el.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.longDescriptionInput);
        await el.clearValue();
        await el.setValue(value);
        await browser.keys('Tab');
        console.log(`[ACTION] Long Description entered: ${value}`);
    }

    private async selectFirstObjectTemplate(): Promise<void> {
        await utils.clickWithWait(this.objectTemplateValueHelpIcon);
        await utils.waitForBusyIndicatorToDisappear();
        const row = await this.valueHelpFirstRow;
        await row.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.valueHelpFirstRow);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Object Template — first row selected');
    }

    async fillCreateCmlTemplateForm(input: CreateCmlTemplateInput): Promise<void> {
        await this.fillShortDescription(input.shortDescription);
        if (input.longDescription !== undefined) {
            await this.fillLongDescription(input.longDescription);
        }
        await this.selectFirstObjectTemplate();
        console.log('[ACTION] Create New CML Template form filled');
    }

    async clickDialogCreate(): Promise<void> {
        await utils.clickWithWait(this.dialogCreateButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Dialog "Create" button clicked');
    }

    /** Open the CML Template row whose Short Description matches. */
    async openCmlTemplateByDescription(description: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const row = await this.listRowByDescription(description);
        await row.waitForDisplayed({ timeout: 30000 });
        await row.scrollIntoView({ block: 'center' });
        await utils.clickWithWait(this.listRowByDescription(description));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Opened CML Template: ${description}`);
    }

    /** Click the Publish (edit header) button to open the edit dialog. */
    async clickEditHeaderButton(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.editHeaderButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.createDialog.waitForDisplayed({ timeout: 30000 });
        console.log('[ACTION] "Publish" (edit header) button clicked, edit dialog displayed');
    }

    /** Update the Short Description and/or Long Description in the edit dialog. */
    async editCmlTemplateForm(input: EditCmlTemplateInput): Promise<void> {
        if (input.shortDescription !== undefined) {
            await this.fillShortDescription(input.shortDescription);
        }
        if (input.longDescription !== undefined) {
            await this.fillLongDescription(input.longDescription);
        }
        console.log('[ACTION] Edit CML Template form updated');
    }

    /** Click the dialog Save button, then confirm the success popup with OK. */
    async clickDialogSaveAndConfirm(): Promise<void> {
        await utils.clickWithWait(this.dialogSaveButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Dialog "Save" clicked and confirmation OK acknowledged');
    }

    async addCmlTemplate(description: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.addCmlTemplateButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addCmlTemplateDialog.waitForDisplayed({ timeout: 30000 });

        const desc = await this.addCmlTemplateDescriptionInput;
        await desc.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addCmlTemplateDescriptionInput);
        await desc.clearValue();
        await desc.setValue(description);
        await browser.keys('Tab');

        await utils.clickWithWait(this.addCmlTemplateCreateButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Added CML Template entry: ${description}`);
    }

    // Add a Persona after adding the CML Template.
    async addPersona(description: string, personaType: string = 'Inspection Reading', templateIndex: number = 1): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const addBtn = await this.addPersonaButtonByIndex(templateIndex);
        await addBtn.scrollIntoView({ block: 'center' });
        await addBtn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addPersonaButtonByIndex(templateIndex));
        await utils.waitForBusyIndicatorToDisappear();
        await this.addPersonaDialog.waitForDisplayed({ timeout: 30000 });

        await utils.clickWithWait(this.personaTypeDropdownArrow);
        const option = await this.personaTypeOption(personaType);
        await option.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.personaTypeOption(personaType));
        await utils.waitForBusyIndicatorToDisappear();

        const desc = await this.addPersonaDescriptionInput;
        await desc.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addPersonaDescriptionInput);
        await desc.clearValue();
        await desc.setValue(description);
        await browser.keys('Tab');

        await utils.clickWithWait(this.addPersonaCreateButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Added Persona: ${description}`);
    }

    /** Add multiple Personas sequentially under a given CML Template (1-based index). */
    async addPersonas(personas: ReadonlyArray<{ description: string; personaType?: string }>, templateIndex: number = 1): Promise<void> {
        for (const p of personas) {
            await this.addPersona(p.description, p.personaType, templateIndex);
        }
        console.log(`[ACTION] Added ${personas.length} Persona(s) under template #${templateIndex}`);
    }

    /** Click the expand-node arrow on the Nth (1-based) CML Template tree row. */
    async expandTemplateByIndex(templateIndex: number): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const expander = await this.expandNodeByIndex(templateIndex);
        await expander.scrollIntoView({ block: 'center' });
        await expander.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.expandNodeByIndex(templateIndex));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Expanded CML Template #${templateIndex}`);
    }

    /** Confirm a Yes-then-OK two-popup sequence triggered by a previous click. */
    private async confirmYesThenOk(): Promise<void> {
        const yes = await this.confirmYesButton;
        await yes.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmYesButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
    }

    async deletePersonaByDescription(description: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.deletePersonaButtonByDescription(description);
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.deletePersonaButtonByDescription(description));
        await utils.waitForBusyIndicatorToDisappear();
        await this.confirmYesThenOk();
        console.log(`[ACTION] Deleted Persona: ${description}`);
    }

    async deleteCmlTemplateEntryByDescription(description: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const btn = await this.deleteCmlTemplateEntryButtonByDescription(description);
        await btn.scrollIntoView({ block: 'center' });
        await btn.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.deleteCmlTemplateEntryButtonByDescription(description));
        await utils.waitForBusyIndicatorToDisappear();
        await this.confirmYesThenOk();
        console.log(`[ACTION] Deleted CML Template entry: ${description}`);
    }

    async selectPersonaByDescription(description: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        const row = await this.personaRowByDescription(description);
        await row.scrollIntoView({ block: 'center' });
        await row.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.personaRowByDescription(description));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Selected Persona: ${description}`);
    }
    
    async addDataStore(name: string, description: string, dataType: string = 'Boolean', codeListRowIndex: number = 1): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.addDataStoreButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addDataStoreDialog.waitForDisplayed({ timeout: 30000 });

        const nameEl = await this.dataStoreNameInput;
        await nameEl.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.dataStoreNameInput);
        await nameEl.clearValue();
        await nameEl.setValue(name);
        await browser.keys('Tab');

        const descEl = await this.dataStoreDescriptionInput;
        await descEl.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.dataStoreDescriptionInput);
        await descEl.clearValue();
        await descEl.setValue(description);
        await browser.keys('Tab');

        await utils.clickWithWait(this.dataStoreDataTypeDropdownArrow);
        const opt = await this.dataStoreDataTypeOptionByLabel(dataType);
        await opt.waitForDisplayed({ timeout: 30000 });
        await opt.scrollIntoView({ block: 'center' });
        await utils.clickWithWait(this.dataStoreDataTypeOptionByLabel(dataType));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Data Type selected: ${dataType}`);

        await utils.clickWithWait(this.dataStoreCodeListValueHelpIcon);
        await utils.waitForBusyIndicatorToDisappear();
        const codeListRow = await this.valueHelpRowByIndex(codeListRowIndex);
        await codeListRow.waitForDisplayed({ timeout: 30000 });
        await codeListRow.scrollIntoView({ block: 'center' });
        await utils.clickWithWait(this.valueHelpRowByIndex(codeListRowIndex));
        await utils.waitForBusyIndicatorToDisappear();

        await utils.clickWithWait(this.addDataStoreCreateButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Added Data Store: ${name}`);
    }

    async addReading(clicks: number = 1): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.addReadingButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addReadingDialog.waitForDisplayed({ timeout: 30000 });

        const incBtn = await this.addReadingIncrementButton;
        await incBtn.waitForDisplayed({ timeout: 30000 });
        for (let i = 0; i < clicks; i++) {
            await utils.clickWithWait(this.addReadingIncrementButton);
        }
        console.log(`[ACTION] Reading count incremented ${clicks} time(s)`);

        await utils.clickWithWait(this.addReadingSaveButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] Reading added (Save → OK)');
    }

    async addSection(name: string, description: string, longDescription: string, publishSequence?: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.addSectionButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addSectionDialog.waitForDisplayed({ timeout: 30000 });

        const nameEl = await this.addSectionNameInput;
        await nameEl.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addSectionNameInput);
        await nameEl.clearValue();
        await nameEl.setValue(name);
        await browser.keys('Tab');

        const descEl = await this.addSectionDescriptionInput;
        await descEl.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addSectionDescriptionInput);
        await descEl.clearValue();
        await descEl.setValue(description);
        await browser.keys('Tab');

        const longEl = await this.addSectionLongDescriptionInput;
        await longEl.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addSectionLongDescriptionInput);
        await longEl.clearValue();
        await longEl.setValue(longDescription);
        await browser.keys('Tab');

        if (publishSequence !== undefined) {
            const seqEl = await this.addSectionPublishSequenceInput;
            await seqEl.waitForDisplayed({ timeout: 30000 });
            await utils.clickWithWait(this.addSectionPublishSequenceInput);
            await seqEl.clearValue();
            await seqEl.setValue(publishSequence);
            await browser.keys('Tab');
        }

        await utils.clickWithWait(this.addSectionCreateButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Added Section: ${name}`);
    }

    async addVisualization(description: string, visualizationType: string = 'Form'): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.newVisualizationConfigButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addVisualizationDialog.waitForDisplayed({ timeout: 30000 });

        const descEl = await this.addVisualizationDescriptionInput;
        await descEl.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addVisualizationDescriptionInput);
        await descEl.clearValue();
        await descEl.setValue(description);
        await browser.keys('Tab');

        await utils.clickWithWait(this.addVisualizationTypeDropdownArrow);
        const opt = await this.addVisualizationTypeOptionByLabel(visualizationType);
        await opt.waitForDisplayed({ timeout: 30000 });
        await opt.scrollIntoView({ block: 'center' });
        await utils.clickWithWait(this.addVisualizationTypeOptionByLabel(visualizationType));
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Visualization Type selected: ${visualizationType}`);

        await utils.clickWithWait(this.addVisualizationCreateButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Added Visualization: ${description}`);
    }

    async addVisualizationMapping(label: string, dataStoreReference: string, optionLabel: string): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.addVisualizationMappingButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addVisualizationMappingDialog.waitForDisplayed({ timeout: 30000 });

        const labelEl = await this.addVisualizationMappingLabelInput;
        await labelEl.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.addVisualizationMappingLabelInput);
        await labelEl.clearValue();
        await labelEl.setValue(label);
        await browser.keys('Tab');

        await this.pickMappingDropdownValueByLabel('Data Store/Reference', dataStoreReference);
        console.log(`[ACTION] Data Store/Reference selected: ${dataStoreReference}`);

        await this.pickMappingDropdownValueByLabel('Option', optionLabel);
        console.log(`[ACTION] Option selected: ${optionLabel}`);

        await utils.clickWithWait(this.addVisualizationMappingCreateButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Added Visualization Mapping: ${label} (${dataStoreReference} / ${optionLabel})`);
    }

    /** Click "New API Configuration", pick the API option whose title matches `apiName`, click Create, and confirm OK. */
    async addApiConfiguration(apiName: string = '/v1/thicknessminimum/cylindrical/outside'): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.newApiConfigButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addApiConfigDialog.waitForDisplayed({ timeout: 30000 });

        const arrow = await this.addApiConfigFirstDropdownArrow;
        await arrow.waitForExist({ timeout: 30000 });
        await arrow.scrollIntoView({ block: 'center' });

        // Find the matching API option (visible popover, title text matches apiName).
        const findOptionByName = async (name: string): Promise<{ found: boolean; text?: string; total?: number }> =>
            browser.execute((targetName: string) => {
                const items = Array.from(document.querySelectorAll('li[role="option"]')) as HTMLElement[];
                const visibles = items.filter(el => el.offsetParent !== null);
                const match = visibles.find(el => {
                    const title = el.querySelector('[id$="-titleText"]') || el;
                    return (title.textContent || '').trim() === targetName;
                });
                if (match) { return { found: true, text: targetName, total: visibles.length }; }
                return { found: false, total: visibles.length };
            }, name) as unknown as Promise<{ found: boolean; text?: string; total?: number }>;

        const openStrategies: Array<() => Promise<void>> = [
            async () => { await utils.clickWithWait(this.addApiConfigFirstDropdownArrow); },
            async () => {
                const a = await this.addApiConfigFirstDropdownArrow;
                await browser.execute((el: HTMLElement) => el.click(), a as unknown as HTMLElement);
            },
            async () => {
                const a = await this.addApiConfigFirstDropdownArrow;
                await browser.execute((el: HTMLElement) => {
                    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    el.click();
                }, a as unknown as HTMLElement);
            }
        ];

        let opened = false;
        for (const open of openStrategies) {
            try { await open(); } catch { /* try next */ }
            // Poll for the list to populate and the requested option to be present.
            for (let i = 0; i < 20; i++) {
                await browser.pause(300);
                const v = await findOptionByName(apiName);
                if (v.found) {
                    console.log(`[INFO] API dropdown open — found "${apiName}" among ${v.total} visible options`);
                    opened = true;
                    break;
                }
            }
            if (opened) break;
        }
        if (!opened) { throw new Error(`Could not find API option "${apiName}" in open dropdown.`); }

        // Click the matching option via JS, dispatching mousedown/mouseup/click/tap so the UI5 ComboBox tap handler fires.
        const clickResult = await browser.execute((targetName: string) => {
            const items = Array.from(document.querySelectorAll('li[role="option"]')) as HTMLElement[];
            const match = items.find(el => {
                if (el.offsetParent === null) { return false; }
                const title = el.querySelector('[id$="-titleText"]') || el;
                return (title.textContent || '').trim() === targetName;
            });
            if (!match) { return { ok: false, reason: `no visible option titled "${targetName}"` }; }
            match.scrollIntoView({ block: 'center' });
            const opts: MouseEventInit = { bubbles: true, cancelable: true, view: window };
            match.dispatchEvent(new MouseEvent('mousedown', opts));
            match.dispatchEvent(new MouseEvent('mouseup', opts));
            match.dispatchEvent(new MouseEvent('click', opts));
            match.dispatchEvent(new Event('tap', { bubbles: true }));
            return { ok: true, text: (match.textContent || '').trim().slice(0, 80) };
        }, apiName) as unknown as { ok: boolean; text?: string; reason?: string };
        if (!clickResult.ok) { throw new Error(`Failed to click API option "${apiName}": ${clickResult.reason}`); }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(500);
        console.log(`[ACTION] API Configuration — selected option: "${clickResult.text}"`);

        await utils.clickWithWait(this.addApiConfigCreateButton);
        await utils.waitForBusyIndicatorToDisappear();

        // Confirmation popup may be a MessageBox/alertdialog OR a regular sapMDialog. Try strict first, then broad fallback.
        const strictOk = await this.confirmOkButton;
        let okClicked = false;
        try {
            await strictOk.waitForDisplayed({ timeout: 8000 });
            await utils.clickWithWait(this.confirmOkButton);
            okClicked = true;
        } catch { /* fall through */ }
        if (!okClicked) {
            const broadOk = $('//div[(@role="dialog" or @role="alertdialog" or contains(@class,"sapMDialog") or contains(@class,"sapMMessageBox"))][not(contains(@style,"display: none")) and not(contains(@style,"visibility: hidden"))]//button[normalize-space()="OK" or normalize-space()="Ok" or .//bdi[normalize-space()="OK" or normalize-space()="Ok"]]');
            const broadEl = await broadOk;
            await broadEl.waitForDisplayed({ timeout: 30000 });
            try { await utils.clickWithWait(broadOk); }
            catch { await browser.execute((el: HTMLElement) => el.click(), broadEl as unknown as HTMLElement); }
        }
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Added API Configuration ("${apiName}") and confirmed OK`);
    }

    /**
     * Navigate to the "Save_API" section (anchor bar tab), click the "Edit API Configuration" pencil button,
     * then open the API dropdown in the popup and select the option whose title matches `apiName`.
     */
    async editApiConfiguration(apiName: string = '/v1/thicknessminimum/cylindrical/outside'): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.saveApiAnchorButton);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(500);
        console.log('[ACTION] Clicked "Save_API" anchor bar tab');

        await utils.clickWithWait(this.editApiConfigButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.editApiConfigDialog.waitForDisplayed({ timeout: 30000 });
        console.log('[ACTION] Opened "Edit API Configuration" popup');

        // Resolve the arrow span for the field whose <label> text matches "API" (the dialog also has a "Destination" select above it).
        const resolveArrow = async (): Promise<WebdriverIO.Element> =>
            browser.execute((dxp: string, lbl: string) => {
                const dialogXPathEval = document.evaluate(dxp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const dialog = dialogXPathEval.singleNodeValue as HTMLElement | null;
                if (!dialog) { return null; }
                const labels = Array.from(dialog.querySelectorAll('label')) as HTMLLabelElement[];
                const norm = (s: string) => s.replace(/[\s*:]+$/g, '').trim();
                const label = labels.find(l => norm(l.textContent || '') === lbl);
                if (!label) { return null; }
                const forId = label.getAttribute('for');
                if (forId) {
                    const arrow = document.getElementById(forId + '-arrow') as HTMLElement | null;
                    if (arrow) { return arrow; }
                    const container = document.getElementById(forId);
                    if (container) {
                        const inner = container.querySelector('span[role="button"][id$="-arrow"]') as HTMLElement | null;
                        if (inner) { return inner; }
                    }
                }
                if (label.id) {
                    const arrow = dialog.querySelector(`span[role="button"][id$="-arrow"][aria-labelledby~="${label.id}"]`) as HTMLElement | null;
                    if (arrow) { return arrow; }
                }
                const all = Array.from(dialog.querySelectorAll('span[role="button"][id$="-arrow"]')) as HTMLElement[];
                const after = all.find(a => label.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING);
                return after || null;
            }, CmlTemplatePage.EDIT_API_CONFIG_DIALOG_XPATH, 'API') as unknown as WebdriverIO.Element;

        const arrow = await resolveArrow();
        if (!arrow) { throw new Error('Could not resolve the API dropdown arrow inside the Edit API Configuration popup.'); }
        await browser.execute((el: HTMLElement) => el.scrollIntoView({ block: 'center' }), arrow as unknown as HTMLElement);

        const findOptionByName = async (name: string): Promise<{ found: boolean; total?: number }> =>
            browser.execute((targetName: string) => {
                const items = Array.from(document.querySelectorAll('li[role="option"]')) as HTMLElement[];
                const visibles = items.filter(el => el.offsetParent !== null);
                const match = visibles.find(el => {
                    const title = el.querySelector('[id$="-titleText"]') || el;
                    return (title.textContent || '').trim() === targetName;
                });
                return { found: !!match, total: visibles.length };
            }, name) as unknown as Promise<{ found: boolean; total?: number }>;

        const openStrategies: Array<() => Promise<void>> = [
            async () => {
                const a = await resolveArrow();
                if (!a) { throw new Error('arrow not resolved'); }
                await browser.execute((el: HTMLElement) => el.scrollIntoView({ block: 'center' }), a as unknown as HTMLElement);
                await (a as unknown as WebdriverIO.Element).click();
            },
            async () => {
                const a = await resolveArrow();
                if (!a) { throw new Error('arrow not resolved'); }
                await browser.execute((el: HTMLElement) => el.click(), a as unknown as HTMLElement);
            },
            async () => {
                const a = await resolveArrow();
                if (!a) { throw new Error('arrow not resolved'); }
                await browser.execute((el: HTMLElement) => {
                    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    el.click();
                }, a as unknown as HTMLElement);
            }
        ];

        let opened = false;
        for (const open of openStrategies) {
            try { await open(); } catch { /* try next */ }
            for (let i = 0; i < 20; i++) {
                await browser.pause(300);
                const v = await findOptionByName(apiName);
                if (v.found) {
                    console.log(`[INFO] Edit API dropdown open — found "${apiName}" among ${v.total} visible options`);
                    opened = true;
                    break;
                }
            }
            if (opened) break;
        }
        if (!opened) { throw new Error(`Could not find API option "${apiName}" in Edit API Configuration dropdown.`); }

        const clickResult = await browser.execute((targetName: string) => {
            const items = Array.from(document.querySelectorAll('li[role="option"]')) as HTMLElement[];
            const match = items.find(el => {
                if (el.offsetParent === null) { return false; }
                const title = el.querySelector('[id$="-titleText"]') || el;
                return (title.textContent || '').trim() === targetName;
            });
            if (!match) { return { ok: false, reason: `no visible option titled "${targetName}"` }; }
            match.scrollIntoView({ block: 'center' });
            const opts: MouseEventInit = { bubbles: true, cancelable: true, view: window };
            match.dispatchEvent(new MouseEvent('mousedown', opts));
            match.dispatchEvent(new MouseEvent('mouseup', opts));
            match.dispatchEvent(new MouseEvent('click', opts));
            match.dispatchEvent(new Event('tap', { bubbles: true }));
            return { ok: true, text: (match.textContent || '').trim().slice(0, 80) };
        }, apiName) as unknown as { ok: boolean; text?: string; reason?: string };
        if (!clickResult.ok) { throw new Error(`Failed to click API option "${apiName}": ${clickResult.reason}`); }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(500);
        console.log(`[ACTION] Edit API Configuration — selected API: "${clickResult.text}"`);

        // Click Create (or Save) to commit the popup, then confirm any OK popup that follows.
        await utils.clickWithWait(this.editApiConfigCreateButton);
        await utils.waitForBusyIndicatorToDisappear();

        const strictOk = await this.confirmOkButton;
        let okClicked = false;
        try {
            await strictOk.waitForDisplayed({ timeout: 8000 });
            await utils.clickWithWait(this.confirmOkButton);
            okClicked = true;
        } catch { /* fall through */ }
        if (!okClicked) {
            const broadOk = $('//div[(@role="dialog" or @role="alertdialog" or contains(@class,"sapMDialog") or contains(@class,"sapMMessageBox"))][not(contains(@style,"display: none")) and not(contains(@style,"visibility: hidden"))]//button[normalize-space()="OK" or normalize-space()="Ok" or .//bdi[normalize-space()="OK" or normalize-space()="Ok"]]');
            const broadEl = await broadOk;
            try {
                await broadEl.waitForDisplayed({ timeout: 8000 });
                try { await utils.clickWithWait(broadOk); }
                catch { await browser.execute((el: HTMLElement) => el.click(), broadEl as unknown as HTMLElement); }
            } catch { /* no confirmation popup appeared — that's fine */ }
        }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(400);
        console.log('[ACTION] Edit API Configuration popup committed (Create → OK)');
    }

    /**
     * Click the "Picklist" section tab → open its "edit" menu → click "Add" → in the popup, enter the picklist
     * description, open the "General Picklist" dropdown and pick `generalPicklistOption`, then click Save.
     */
    async addPicklist(
        description: string = 'Automated Picklist',
        generalPicklistOption: string = 'AutomationTestSample'
    ): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.picklistTab);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(500);
        console.log('[ACTION] Clicked the "Picklist" section tab');

        await utils.clickWithWait(this.picklistEditMenuButton);
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(400);

        // Click the "Add" menu item. Some menus render in a portal — also try a broad XPath fallback.
        let addClicked = false;
        try {
            const addItem = await this.picklistAddMenuItem;
            await addItem.waitForDisplayed({ timeout: 8000 });
            await utils.clickWithWait(this.picklistAddMenuItem);
            addClicked = true;
        } catch { /* fall through */ }
        if (!addClicked) {
            const broadAdd = $('//*[(@role="menuitem" or @role="option")][.//*[normalize-space()="Add"] or normalize-space()="Add" or normalize-space()="+ Add"]');
            const el = await broadAdd;
            await el.waitForDisplayed({ timeout: 15000 });
            try { await utils.clickWithWait(broadAdd); }
            catch { await browser.execute((node: HTMLElement) => node.click(), el as unknown as HTMLElement); }
        }
        await utils.waitForBusyIndicatorToDisappear();
        await this.addPicklistDialog.waitForDisplayed({ timeout: 30000 });
        console.log('[ACTION] Opened "Add Picklist" dialog');

        // Fill the picklist description. If the label-based locator doesn't resolve (e.g. required asterisk
        // markup variations), fall back to the dialog's first editable input.
        let descInput = await this.picklistDescriptionInput;
        if (!(await descInput.isExisting())) {
            console.log('[INFO] Picklist Description input not found by label — falling back to first editable input in dialog');
            descInput = await this.picklistFirstEditableInput;
        }
        await descInput.waitForDisplayed({ timeout: 30000 });
        await descInput.scrollIntoView({ block: 'center' });
        await browser.execute((el: HTMLInputElement) => el.focus(), descInput as unknown as HTMLInputElement);
        await descInput.click();
        await descInput.clearValue();
        await descInput.setValue(description);
        await browser.keys('Tab');
        console.log(`[ACTION] Picklist Description entered: ${description}`);

        // Open the "General Picklist" dropdown and select the requested option.
        await this.pickPicklistDropdownValueByLabel('General Picklist', generalPicklistOption);

        // Save.
        await utils.clickWithWait(this.addPicklistSaveButton);
        await utils.waitForBusyIndicatorToDisappear();

        // Optional confirmation popup.
        const broadOk = $('//div[(@role="dialog" or @role="alertdialog" or contains(@class,"sapMDialog") or contains(@class,"sapMMessageBox"))][not(contains(@style,"display: none")) and not(contains(@style,"visibility: hidden"))]//button[normalize-space()="OK" or normalize-space()="Ok" or .//bdi[normalize-space()="OK" or normalize-space()="Ok"]]');
        try {
            const broadEl = await broadOk;
            await broadEl.waitForDisplayed({ timeout: 5000 });
            try { await utils.clickWithWait(broadOk); }
            catch { await browser.execute((node: HTMLElement) => node.click(), broadEl as unknown as HTMLElement); }
        } catch { /* no confirmation appeared */ }
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Picklist saved (description="${description}", General Picklist="${generalPicklistOption}")`);
    }

    /**
     * After the "Backend Picklist Mapping" has been saved, click the section "Add" button to open the
     * "Add Picklist" dialog, pick the Parameter and Column Name from their respective dropdowns
     * (resolved by their stable arrow IDs), enter the Sequence value, then click Save.
     */
    async addPicklistMapping(
        parameter: string = 'AUTODATASTORE2',
        columnName: string = 'factor',
        sequence: string = '12345'
    ): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();

        // The section "Add" button — accesskey="a", bdi text "Add", visible on the Picklist subsection toolbar.
        const sectionAddButton = $('//button[@data-ui5-accesskey="a"][.//bdi[normalize-space()="Add"]] | //button[contains(@class,"asintRbiAddButton")][.//bdi[normalize-space()="Add"]]');
        await utils.clickWithWait(sectionAddButton);
        await utils.waitForBusyIndicatorToDisappear();

        const dialogXp = '//div[@role="dialog"][.//*[normalize-space()="Add Picklist"]]';
        const dialog = await $(dialogXp);
        await dialog.waitForDisplayed({ timeout: 30000 });
        console.log('[ACTION] Opened "Add Picklist" mapping dialog');

        // Parameter — sap.m.Select. Drive via UI5 API: setSelectedItem(byText) + fire change.
        await this.setUi5SelectValueByText('idAsintRbiPicklistSelSection', parameter);
        console.log(`[ACTION] Parameter set: "${parameter}"`);

        // Column Name — sap.m.ComboBox. Drive via UI5 API: setSelectedItem(byText) + set input value + fire change.
        await this.setUi5ComboBoxValueByText('idAsintRbiPicklistSelColumn', columnName);
        console.log(`[ACTION] Column Name set: "${columnName}"`);

        // Sequence input — the only remaining editable input in the dialog.
        const sequenceInput = await $(`${dialogXp}//label[contains(normalize-space(.), "Sequence")]/following::input[not(@readonly) and not(@type="hidden")][1]`);
        await sequenceInput.waitForDisplayed({ timeout: 30000 });
        await sequenceInput.scrollIntoView({ block: 'center' });
        await sequenceInput.click();
        await sequenceInput.clearValue();
        await sequenceInput.setValue(sequence);
        await browser.keys('Tab');
        console.log(`[ACTION] Sequence entered: ${sequence}`);

        const saveBtn = await $(`${dialogXp}//button[normalize-space()="Save" or .//bdi[normalize-space()="Save"]]`);
        await utils.clickWithWait(saveBtn);
        await utils.waitForBusyIndicatorToDisappear();

        // Optional follow-up OK confirmation.
        const broadOk = $('//div[(@role="dialog" or @role="alertdialog" or contains(@class,"sapMDialog") or contains(@class,"sapMMessageBox"))][not(contains(@style,"display: none")) and not(contains(@style,"visibility: hidden"))]//button[normalize-space()="OK" or normalize-space()="Ok" or .//bdi[normalize-space()="OK" or normalize-space()="Ok"]]');
        try {
            const broadEl = await broadOk;
            await broadEl.waitForDisplayed({ timeout: 5000 });
            try { await utils.clickWithWait(broadOk); }
            catch { await browser.execute((node: HTMLElement) => node.click(), broadEl as unknown as HTMLElement); }
        } catch { /* no confirmation appeared */ }
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Picklist mapping saved (Parameter="${parameter}", Column Name="${columnName}", Sequence="${sequence}")`);
    }

    /**
     * Set a sap.m.Select value by matching an item's visible text via the UI5 control API. This is far
     * more reliable than synthesizing DOM clicks on the bare <li> elements inside `.sapMSelectList`,
     * which UI5 ignores. Throws if no item matches.
     */
    private async setUi5SelectValueByText(controlId: string, optionText: string): Promise<void> {
        const result = await browser.execute((id: string, text: string) => {
            // sap.ui.getCore() is the standard UI5 entry point.
            const core = (window as unknown as { sap?: { ui?: { getCore?: () => unknown } } }).sap?.ui?.getCore?.();
            if (!core) { return { ok: false, reason: 'sap.ui.getCore() unavailable' }; }
            const ctrl = (core as { byId: (id: string) => unknown }).byId(id) as
                | { getItems: () => Array<{ getText: () => string; getKey?: () => string }>; setSelectedItem: (it: unknown) => void; fireChange: (p: unknown) => void; getId: () => string }
                | undefined;
            if (!ctrl || typeof ctrl.getItems !== 'function') { return { ok: false, reason: `control #${id} not found` }; }
            const items = ctrl.getItems();
            const item = items.find(it => (it.getText() || '').trim() === text);
            if (!item) { return { ok: false, reason: `no item with text "${text}" in #${id}`, available: items.map(it => it.getText()) }; }
            ctrl.setSelectedItem(item);
            try { ctrl.fireChange({ selectedItem: item }); } catch { /* some Select implementations use different change payload */ }
            return { ok: true, text: item.getText() };
        }, controlId, optionText) as unknown as { ok: boolean; reason?: string; text?: string; available?: string[] };
        if (!result.ok) {
            throw new Error(`setUi5SelectValueByText(#${controlId}, "${optionText}") failed: ${result.reason}${result.available ? ` — available: ${result.available.join(', ')}` : ''}`);
        }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(200);
    }

    /**
     * Set a sap.m.ComboBox value by matching an item's visible text via the UI5 control API. Also writes
     * the displayed input value and fires change so any bound logic re-runs. Throws if no item matches.
     */
    private async setUi5ComboBoxValueByText(controlId: string, optionText: string): Promise<void> {
        const result = await browser.execute((id: string, text: string) => {
            const core = (window as unknown as { sap?: { ui?: { getCore?: () => unknown } } }).sap?.ui?.getCore?.();
            if (!core) { return { ok: false, reason: 'sap.ui.getCore() unavailable' }; }
            const ctrl = (core as { byId: (id: string) => unknown }).byId(id) as
                | {
                    getItems: () => Array<{ getText: () => string; getKey?: () => string }>;
                    setSelectedItem: (it: unknown) => void;
                    setValue: (v: string) => void;
                    fireChange: (p: unknown) => void;
                    fireSelectionChange?: (p: unknown) => void;
                }
                | undefined;
            if (!ctrl || typeof ctrl.getItems !== 'function') { return { ok: false, reason: `control #${id} not found` }; }
            const items = ctrl.getItems();
            const item = items.find(it => (it.getText() || '').trim() === text);
            if (!item) { return { ok: false, reason: `no item with text "${text}" in #${id}`, available: items.map(it => it.getText()) }; }
            ctrl.setSelectedItem(item);
            ctrl.setValue(item.getText());
            try { ctrl.fireSelectionChange?.({ selectedItem: item }); } catch { /* ignore */ }
            try { ctrl.fireChange({ value: item.getText(), selectedItem: item }); } catch { /* ignore */ }
            return { ok: true, text: item.getText() };
        }, controlId, optionText) as unknown as { ok: boolean; reason?: string; text?: string; available?: string[] };
        if (!result.ok) {
            throw new Error(`setUi5ComboBoxValueByText(#${controlId}, "${optionText}") failed: ${result.reason}${result.available ? ` — available: ${result.available.join(', ')}` : ''}`);
        }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(200);
    }

    /**
     * Inside the Add Picklist dialog: resolve the dropdown arrow for the field whose <label> text matches
     * `fieldLabel`, open it (multi-strategy), then click the option whose title text exactly matches `optionLabel`.
     */
    private async pickPicklistDropdownValueByLabel(fieldLabel: string, optionLabel: string): Promise<void> {
        const dialogXp = CmlTemplatePage.ADD_PICKLIST_DIALOG_XPATH;

        const resolveArrow = async (): Promise<WebdriverIO.Element> =>
            browser.execute((dxp: string, lbl: string) => {
                const dialogXPathEval = document.evaluate(dxp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const dialog = dialogXPathEval.singleNodeValue as HTMLElement | null;
                if (!dialog) { return null; }
                const labels = Array.from(dialog.querySelectorAll('label')) as HTMLLabelElement[];
                const norm = (s: string) => s.replace(/[\s*:]+$/g, '').trim();
                const label = labels.find(l => norm(l.textContent || '') === lbl);
                if (!label) { return null; }
                const forId = label.getAttribute('for');
                if (forId) {
                    const arrow = document.getElementById(forId + '-arrow') as HTMLElement | null;
                    if (arrow) { return arrow; }
                    const container = document.getElementById(forId);
                    if (container) {
                        const inner = container.querySelector('span[role="button"][id$="-arrow"]') as HTMLElement | null;
                        if (inner) { return inner; }
                    }
                }
                if (label.id) {
                    const arrow = dialog.querySelector(`span[role="button"][id$="-arrow"][aria-labelledby~="${label.id}"]`) as HTMLElement | null;
                    if (arrow) { return arrow; }
                }
                const all = Array.from(dialog.querySelectorAll('span[role="button"][id$="-arrow"]')) as HTMLElement[];
                const after = all.find(a => label.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING);
                return after || null;
            }, dialogXp, fieldLabel) as unknown as WebdriverIO.Element;

        const findOptionByName = async (name: string): Promise<{ found: boolean; total?: number }> =>
            browser.execute((targetName: string) => {
                const items = Array.from(document.querySelectorAll('li[role="option"]')) as HTMLElement[];
                const visibles = items.filter(el => el.offsetParent !== null);
                const match = visibles.find(el => {
                    const title = el.querySelector('[id$="-titleText"]') || el;
                    return (title.textContent || '').trim() === targetName;
                });
                return { found: !!match, total: visibles.length };
            }, name) as unknown as Promise<{ found: boolean; total?: number }>;

        const openStrategies: Array<() => Promise<void>> = [
            async () => {
                const a = await resolveArrow();
                if (!a) { throw new Error('arrow not resolved'); }
                await browser.execute((el: HTMLElement) => el.scrollIntoView({ block: 'center' }), a as unknown as HTMLElement);
                await (a as unknown as WebdriverIO.Element).click();
            },
            async () => {
                const a = await resolveArrow();
                if (!a) { throw new Error('arrow not resolved'); }
                await browser.execute((el: HTMLElement) => el.click(), a as unknown as HTMLElement);
            },
            async () => {
                const a = await resolveArrow();
                if (!a) { throw new Error('arrow not resolved'); }
                await browser.execute((el: HTMLElement) => {
                    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    el.click();
                }, a as unknown as HTMLElement);
            }
        ];

        let opened = false;
        for (const open of openStrategies) {
            try { await open(); } catch { /* try next */ }
            for (let i = 0; i < 20; i++) {
                await browser.pause(300);
                const v = await findOptionByName(optionLabel);
                if (v.found) { console.log(`[INFO] ${fieldLabel} dropdown open — found "${optionLabel}" among ${v.total} visible options`); opened = true; break; }
            }
            if (opened) break;
        }
        if (!opened) { throw new Error(`Could not find ${fieldLabel} option "${optionLabel}" in open dropdown.`); }

        const clickResult = await browser.execute((targetName: string) => {
            const items = Array.from(document.querySelectorAll('li[role="option"]')) as HTMLElement[];
            const match = items.find(el => {
                if (el.offsetParent === null) { return false; }
                const title = el.querySelector('[id$="-titleText"]') || el;
                return (title.textContent || '').trim() === targetName;
            });
            if (!match) { return { ok: false, reason: `no visible option titled "${targetName}"` }; }
            match.scrollIntoView({ block: 'center' });
            const opts: MouseEventInit = { bubbles: true, cancelable: true, view: window };
            match.dispatchEvent(new MouseEvent('mousedown', opts));
            match.dispatchEvent(new MouseEvent('mouseup', opts));
            match.dispatchEvent(new MouseEvent('click', opts));
            match.dispatchEvent(new Event('tap', { bubbles: true }));
            return { ok: true, text: (match.textContent || '').trim().slice(0, 80) };
        }, optionLabel) as unknown as { ok: boolean; text?: string; reason?: string };
        if (!clickResult.ok) { throw new Error(`Failed to click ${fieldLabel} option "${optionLabel}": ${clickResult.reason}`); }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(400);
        console.log(`[ACTION] ${fieldLabel} selected: "${optionLabel}"`);
    }

    /** Click "Add API Mapping" (+) button, pick the API Parameter and Data Store/Reference from their dropdowns, click Create, then click OK on the confirmation popup. */
    async addApiMapping(apiParameter: string = 'designPressure', dataStoreReference: string = 'EQUIPMENT_ID'): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.addApiMappingButton);
        await utils.waitForBusyIndicatorToDisappear();
        await this.addApiMappingDialog.waitForDisplayed({ timeout: 30000 });

        await this.pickApiMappingDropdownValueByLabel('API Parameter', apiParameter);
        await this.pickApiMappingDropdownValueByLabel('Data Store/Reference', dataStoreReference);

        await utils.clickWithWait(this.addApiMappingCreateButton);
        await utils.waitForBusyIndicatorToDisappear();

        // Confirmation popup after Create — may be a MessageBox/alertdialog OR a regular sapMDialog.
        const strictOk = await this.confirmOkButton;
        let okClicked = false;
        try {
            await strictOk.waitForDisplayed({ timeout: 8000 });
            await utils.clickWithWait(this.confirmOkButton);
            okClicked = true;
        } catch { /* fall through */ }
        if (!okClicked) {
            const broadOk = $('//div[(@role="dialog" or @role="alertdialog" or contains(@class,"sapMDialog") or contains(@class,"sapMMessageBox"))][not(contains(@style,"display: none")) and not(contains(@style,"visibility: hidden"))]//button[normalize-space()="OK" or normalize-space()="Ok" or .//bdi[normalize-space()="OK" or normalize-space()="Ok"]]');
            const broadEl = await broadOk;
            await broadEl.waitForDisplayed({ timeout: 30000 });
            try { await utils.clickWithWait(broadOk); }
            catch { await browser.execute((el: HTMLElement) => el.click(), broadEl as unknown as HTMLElement); }
        }
        await utils.waitForBusyIndicatorToDisappear();
        console.log(`[ACTION] Added API Mapping (${apiParameter} / ${dataStoreReference}) and confirmed OK`);
    }

    /**
     * Inside the Add API Mapping dialog: locate the arrow for the field whose visible label matches `fieldLabel`,
     * open the dropdown (multi-strategy), then click the option whose title text exactly matches `optionLabel`.
     */
    private async pickApiMappingDropdownValueByLabel(fieldLabel: string, optionLabel: string): Promise<void> {
        const dialogXp = CmlTemplatePage.ADD_API_MAPPING_DIALOG_XPATH;

        // Resolve the arrow span inside the dialog whose adjacent/labelled field label text matches fieldLabel.
        const resolveArrow = async (): Promise<WebdriverIO.Element> =>
            browser.execute((dxp: string, lbl: string) => {
                const dialogXPathEval = document.evaluate(dxp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const dialog = dialogXPathEval.singleNodeValue as HTMLElement | null;
                if (!dialog) { return null; }
                const labels = Array.from(dialog.querySelectorAll('label')) as HTMLLabelElement[];
                const norm = (s: string) => s.replace(/[\s*:]+$/g, '').trim();
                const label = labels.find(l => norm(l.textContent || '') === lbl);
                if (!label) { return null; }
                // Strategy A: <label for="controlId"> then arrow id = controlId + '-arrow'.
                const forId = label.getAttribute('for');
                if (forId) {
                    const arrow = document.getElementById(forId + '-arrow') as HTMLElement | null;
                    if (arrow) { return arrow; }
                }
                // Strategy B: arrow whose aria-labelledby contains label.id.
                if (label.id) {
                    const arrow = dialog.querySelector(`span[role="button"][id$="-arrow"][aria-labelledby~="${label.id}"]`) as HTMLElement | null;
                    if (arrow) { return arrow; }
                }
                // Strategy C: nearest following arrow span in DOM order within the dialog.
                const all = Array.from(dialog.querySelectorAll('span[role="button"][id$="-arrow"]')) as HTMLElement[];
                const after = all.find(a => label.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING);
                return after || null;
            }, dialogXp, fieldLabel) as unknown as WebdriverIO.Element;

        const findOptionByName = async (name: string): Promise<{ found: boolean; total?: number }> =>
            browser.execute((targetName: string) => {
                const items = Array.from(document.querySelectorAll('li[role="option"]')) as HTMLElement[];
                const visibles = items.filter(el => el.offsetParent !== null);
                const match = visibles.find(el => {
                    const title = el.querySelector('[id$="-titleText"]') || el;
                    return (title.textContent || '').trim() === targetName;
                });
                return { found: !!match, total: visibles.length };
            }, name) as unknown as Promise<{ found: boolean; total?: number }>;

        const openStrategies: Array<() => Promise<void>> = [
            async () => {
                const a = await resolveArrow();
                if (!a) { throw new Error('arrow not resolved'); }
                await browser.execute((el: HTMLElement) => el.scrollIntoView({ block: 'center' }), a as unknown as HTMLElement);
                await (a as unknown as WebdriverIO.Element).click();
            },
            async () => {
                const a = await resolveArrow();
                if (!a) { throw new Error('arrow not resolved'); }
                await browser.execute((el: HTMLElement) => el.click(), a as unknown as HTMLElement);
            },
            async () => {
                const a = await resolveArrow();
                if (!a) { throw new Error('arrow not resolved'); }
                await browser.execute((el: HTMLElement) => {
                    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    el.click();
                }, a as unknown as HTMLElement);
            }
        ];

        let opened = false;
        for (const open of openStrategies) {
            try { await open(); } catch { /* try next */ }
            for (let i = 0; i < 20; i++) {
                await browser.pause(300);
                const v = await findOptionByName(optionLabel);
                if (v.found) { console.log(`[INFO] ${fieldLabel} dropdown open — found "${optionLabel}" among ${v.total} visible options`); opened = true; break; }
            }
            if (opened) break;
        }
        if (!opened) { throw new Error(`Could not find ${fieldLabel} option "${optionLabel}" in open dropdown.`); }

        const clickResult = await browser.execute((targetName: string) => {
            const items = Array.from(document.querySelectorAll('li[role="option"]')) as HTMLElement[];
            const match = items.find(el => {
                if (el.offsetParent === null) { return false; }
                const title = el.querySelector('[id$="-titleText"]') || el;
                return (title.textContent || '').trim() === targetName;
            });
            if (!match) { return { ok: false, reason: `no visible option titled "${targetName}"` }; }
            match.scrollIntoView({ block: 'center' });
            const opts: MouseEventInit = { bubbles: true, cancelable: true, view: window };
            match.dispatchEvent(new MouseEvent('mousedown', opts));
            match.dispatchEvent(new MouseEvent('mouseup', opts));
            match.dispatchEvent(new MouseEvent('click', opts));
            match.dispatchEvent(new Event('tap', { bubbles: true }));
            return { ok: true, text: (match.textContent || '').trim().slice(0, 80) };
        }, optionLabel) as unknown as { ok: boolean; text?: string; reason?: string };
        if (!clickResult.ok) { throw new Error(`Failed to click ${fieldLabel} option "${optionLabel}": ${clickResult.reason}`); }
        await utils.waitForBusyIndicatorToDisappear();
        await browser.pause(400);
        console.log(`[ACTION] ${fieldLabel} selected: "${optionLabel}"`);
    }

    
    /** Open the dropdown for the field whose label matches `fieldLabel`, then pick the option matching `optionLabel`. */
    private async pickMappingDropdownValueByLabel(fieldLabel: string, optionLabel: string): Promise<void> {
        const input = await this.addVisualizationMappingInputByLabel(fieldLabel);

        const isOptionVisible = async (): Promise<boolean> => {
            const o = await this.addVisualizationMappingOptionByLabel(optionLabel);
            return (await o.isExisting()) && (await o.isDisplayed());
        };

        const resolveArrow = async (): Promise<WebdriverIO.Element> => this.addVisualizationMappingDropdownArrowByLabel(fieldLabel);

        // Try several strategies in order: native click on arrow → JS click on arrow → input focus + Alt+Down → input focus + F4.
        const openStrategies: Array<() => Promise<void>> = [
            async () => {
                const arrow = await resolveArrow();
                await arrow.scrollIntoView({ block: 'center' });
                await arrow.click();
            },
            async () => {
                const arrow = await resolveArrow();
                await browser.execute((el: HTMLElement) => el.click(), arrow as unknown as HTMLElement);
            },
            async () => {
                await input.waitForExist({ timeout: 30000 });
                await input.scrollIntoView({ block: 'center' });
                await utils.clickWithWait(this.addVisualizationMappingInputByLabel(fieldLabel));
                await browser.keys(['Alt', 'ArrowDown']);
            },
            async () => {
                await input.waitForExist({ timeout: 30000 });
                await browser.execute((el: HTMLElement) => el.focus(), input as unknown as HTMLElement);
                await browser.keys('F4');
            }
        ];

        for (const open of openStrategies) {
            try { await open(); } catch { /* try next */ }
            await browser.pause(700);
            if (await isOptionVisible()) break;
        }

        const opt = await this.addVisualizationMappingOptionByLabel(optionLabel);
        await opt.waitForDisplayed({ timeout: 30000 });
        await opt.scrollIntoView({ block: 'center' });
        await utils.clickWithWait(this.addVisualizationMappingOptionByLabel(optionLabel));

        const titleBar = await $(`${CmlTemplatePage.ADD_VIS_MAPPING_DIALOG_XPATH}//*[contains(@class,"sapMDialogTitle") or contains(@class,"sapMIBar")][1]`);
        if (await titleBar.isExisting()) {
            await browser.execute((el: HTMLElement) => el.click(), titleBar as unknown as HTMLElement);
        }
        await browser.pause(400);
        await utils.waitForBusyIndicatorToDisappear();
    }

    async deleteCmlTemplate(): Promise<void> {
        await utils.waitForBusyIndicatorToDisappear();
        await utils.clickWithWait(this.deleteButton);
        await utils.waitForBusyIndicatorToDisappear();

        const yes = await this.confirmYesButton;
        await yes.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmYesButton);
        await utils.waitForBusyIndicatorToDisappear();

        const ok = await this.confirmOkButton;
        await ok.waitForDisplayed({ timeout: 30000 });
        await utils.clickWithWait(this.confirmOkButton);
        await utils.waitForBusyIndicatorToDisappear();
        console.log('[ACTION] CML Template deleted (Delete → Yes → OK)');
    }
}

export default new CmlTemplatePage();
