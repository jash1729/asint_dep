import cmlTemplatePage from 'page_object_model/btp_applications_page/integrity_configuration/cml_template/cml_template.page';

const shortDescription = 'Automated CML Template';
const longDescription = 'Created by WDIO automated test';
const editedShortDescription = `${shortDescription} - Edited`;
const editedLongDescription = 'Updated by WDIO automated test';
const cmlTemplateEntryDescription = 'Automated CML Entry';
const personaDescription = 'Automated Persona';
const personaDefinitionDescription = 'Automated Persona Definition';
const dataStoreName = 'AutoDataStore';
const dataStoreDescription = 'Automated Data Store';
const sectionName = 'AutoSection';
const sectionDescription = 'Automated Section';
const sectionLongDescription = 'Section created by WDIO automated test';
const sectionPublishSequence = '1';

describe('BTP - (Integrity Configuration) - CML Templates App - Functional Test', () => {

    it('should click the "CML Templates" tile on the home page', async () => {
        await cmlTemplatePage.clickCmlTemplatesTile();
    });

    it('should open the "Create New CML Template" dialog, fill all fields and submit', async () => {
        await cmlTemplatePage.clickCreateButton();
        await cmlTemplatePage.fillCreateCmlTemplateForm({
            shortDescription,
            longDescription
        });
        await cmlTemplatePage.clickDialogCreate();
    });

    it('should open the created CML Template and edit Short/Long Description', async () => {
        await cmlTemplatePage.openCmlTemplateByDescription(shortDescription);
        await cmlTemplatePage.clickEditHeaderButton();
        await cmlTemplatePage.editCmlTemplateForm({
            shortDescription: editedShortDescription,
            longDescription: editedLongDescription
        });
        await cmlTemplatePage.clickDialogSaveAndConfirm();
    });

    it('should add a CML Template entry via the "+" button', async () => {
        await cmlTemplatePage.addCmlTemplate(cmlTemplateEntryDescription);
    });

    it('should add two Personas to the CML Template', async () => {
        await cmlTemplatePage.addPersonas([
            { description: personaDescription, personaType: 'Inspection Reading' },
            { description: personaDefinitionDescription, personaType: 'Definition' }
        ]);
    });

    it('should expand the CML Template, select the first Persona and add a Data Store', async () => {
        await cmlTemplatePage.expandTemplateByIndex(1);
        await cmlTemplatePage.selectPersonaByDescription(personaDescription);
        await cmlTemplatePage.addDataStore(dataStoreName, dataStoreDescription);
    });

    it('should add a second Data Store (String, CodeList row 2)', async () => {
        await cmlTemplatePage.addDataStore(`${dataStoreName}2`, `${dataStoreDescription} 2`, 'String', 2);
    });

    it('should add a third Data Store (Date, CodeList row 3)', async () => {
        await cmlTemplatePage.addDataStore(`${dataStoreName}3`, `${dataStoreDescription} 3`, 'Date', 3);
    });
    it('should click "Add Reading", increment the count and save', async () => {
        await cmlTemplatePage.addReading(1);
    });

    it('should add a Section via the "Add Section" button', async () => {
        await cmlTemplatePage.addSection(sectionName, sectionDescription, sectionLongDescription, sectionPublishSequence);
    });

    it('should click "New Visualization Configuration" and add a Form visualization', async () => {
        await cmlTemplatePage.addVisualization('Automated Visualization', 'Form');
    });

    it('should add a Visualization Mapping (AutoDataStore / Optional)', async () => {
        await cmlTemplatePage.addVisualizationMapping('Automated Mapping', dataStoreName, 'Optional');
    });

    it('should click "New API Configuration", select the first API and confirm', async () => {
        await cmlTemplatePage.addApiConfiguration();
    });

    it('should open Save_API section, click Edit API Configuration and select the API in the popup', async () => {
        await cmlTemplatePage.editApiConfiguration('/v1/thicknessminimum/cylindrical/outside');
    });

    it('should add an API Mapping (designPressure / EQUIPMENT_ID) and confirm OK', async () => {
        await cmlTemplatePage.addApiMapping('designPressure', 'EQUIPMENT_ID');
    });


    it('should select the "Automated Persona Definition" persona', async () => {
        await cmlTemplatePage.selectPersonaByDescription(personaDefinitionDescription);
    });
    
    it('should add a Section via the "Add Section" button', async () => {
        await cmlTemplatePage.addSection(sectionName, sectionDescription, sectionLongDescription, sectionPublishSequence);
    });

    it('should click "New Visualization Configuration" and add a Form visualization', async () => {
        await cmlTemplatePage.addVisualization('Automated Visualization', 'Form');
    });

    it('should add a Visualization Mapping (AutoDataStore / Optional)', async () => {
        await cmlTemplatePage.addVisualizationMapping('Automated Mapping', dataStoreName, 'Optional');
    });

    it('should click "New API Configuration", select the first API and confirm', async () => {
        await cmlTemplatePage.addApiConfiguration();
    });

    it('should open Save_API section, click Edit API Configuration and select the API in the popup', async () => {
        await cmlTemplatePage.editApiConfiguration('/v1/thicknessminimum/cylindrical/outside');
    });

    it('should add an API Mapping (designPressure / EQUIPMENT_ID) and confirm OK', async () => {
        await cmlTemplatePage.addApiMapping('designPressure', 'EQUIPMENT_ID');
    });

    it('should open the Picklist section, click Edit → Add and create a picklist with "AutomationTestSample"', async () => {
        await cmlTemplatePage.addPicklist('Automated Picklist', 'AutomationTestSample');
    });

    it('should click "Add" on the picklist section and create an Add Picklist mapping (AUTODATASTORE / factor / 12345)', async () => {
        await cmlTemplatePage.addPicklistMapping('AUTODATASTORE2', 'factor', '12345');
    });
    
    it('should delete the CML Template', async () => {
        await cmlTemplatePage.deleteCmlTemplate();
    });

});
