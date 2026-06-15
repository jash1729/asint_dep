import assetStrategyAnalysisForClassesPage from 'page_object_model/btp_applications_page/reliability/asset_strategy_analysis_for_classes/asset_strategy_analysis_for_classes.page';
import { fleetAssessmentTestData } from 'test_data/btp_applications/reliability/fleet_assessment.data';

const assessmentDescription = fleetAssessmentTestData.createMandatory.description;

describe('BTP - (Fleet) - Asset Strategy Analysis for Classes App - Flow 3 (Create & Delete without Baseline)', () => {

    it('should create a new assessment with all mandatory fields (without baseline)', async () => {
        await assetStrategyAnalysisForClassesPage.navigateToApp();
        await assetStrategyAnalysisForClassesPage.clickCreateButton();
        await assetStrategyAnalysisForClassesPage.fillCreateAssessmentForm({
            description: assessmentDescription,
            className: fleetAssessmentTestData.createMandatory.className,
            failureDataProfile: fleetAssessmentTestData.createMandatory.failureDataProfile
        });
        await assetStrategyAnalysisForClassesPage.clickDialogCreate();
        await assetStrategyAnalysisForClassesPage.confirmSuccessPopup();
    });

    it('should open the Assessment section and click Create Operating Context and Condition', async () => {
        await assetStrategyAnalysisForClassesPage.openAssessmentAndCreateOperatingContextAndCondition();
    });

    it('should add characteristics (incl. FLUID_CR), set their values, and create the OCC', async () => {
        await assetStrategyAnalysisForClassesPage.createOperatingContextAndConditionFlow(
            fleetAssessmentTestData.operatingContextAndConditionFlow2,
            { useBaseline: false }
        );
    });

    it('should click the "+" Add button on the newly created Operating Context and select "Assign Maintainable Items"', async () => {
        await assetStrategyAnalysisForClassesPage.clickOccAddButton(
            fleetAssessmentTestData.operatingContextAndConditionFlow2.name
        );
        await assetStrategyAnalysisForClassesPage.clickAssignMaintainableItemsMenuItem();
    });

    it('should select a maintainable item row and click Assign', async () => {
        await assetStrategyAnalysisForClassesPage.searchAndAssignFirstMaintainableItem(
            fleetAssessmentTestData.maintainableItemFlow2.searchText
        );
    });

    it('should expand the newly created Operating Context row in the Assessment Hierarchy', async () => {
        await assetStrategyAnalysisForClassesPage.expandAssessmentHierarchyRow();
    });

    it('should click the "+" Add button on the assigned maintainable item row', async () => {
        await assetStrategyAnalysisForClassesPage.clickAssessmentHierarchyRowAddButton(
            fleetAssessmentTestData.maintainableItemFlow2.searchText,
            1
        );
    });

    it('should select "Assign Failure Modes", search, tick the matching row and click Assign', async () => {
        await assetStrategyAnalysisForClassesPage.clickAssignFailureModesMenuItem();
        await assetStrategyAnalysisForClassesPage.searchAndAssignFailureMode(
            fleetAssessmentTestData.failureModeFlow2.searchText
        );
    });

    it('should expand the Inspection Ports row to reveal the assigned failure mode', async () => {
        await assetStrategyAnalysisForClassesPage.expandAssessmentHierarchyRow(1);
    });

    it('should click on the assigned failure mode (False alarms)', async () => {
        await assetStrategyAnalysisForClassesPage.clickAssessmentHierarchyRowByText(
            fleetAssessmentTestData.failureModeFlow2.searchText
        );
    });

    it('should click "Assign" on the Failure Effect section, tick "Slow Down" and confirm', async () => {
        await assetStrategyAnalysisForClassesPage.assignSectionItemByText(
            'Failure Effect',
            fleetAssessmentTestData.failureEffectFlow3.itemText
        );
    });

    it('should click "Assign" on the Failure Mechanism section, tick "Loose Hub" and "Corrosion/Erosion" and confirm', async () => {
        await assetStrategyAnalysisForClassesPage.assignSectionItemByText(
            'Failure Mechanism',
            [...fleetAssessmentTestData.failureMechanismFlow3.itemTexts]
        );
    });

    it('should expand the Failure Mechanism section, tick "Loose Hub", click Remove and confirm', async () => {
        await assetStrategyAnalysisForClassesPage.removeSectionItemByText(
            'Failure Mechanism',
            fleetAssessmentTestData.failureMechanismRemoveFlow3.itemText
        );
    });

    it('should click "Assign" on the Causes section, tick "Misaligned" and "EROSION" and confirm', async () => {
        await assetStrategyAnalysisForClassesPage.assignSectionItemByText(
            'Causes',
            [...fleetAssessmentTestData.causesFlow3.itemTexts]
        );
    });

    it('should expand the Causes section, tick "EROSION", click Remove and confirm', async () => {
        await assetStrategyAnalysisForClassesPage.removeSectionItemByText(
            'Causes',
            fleetAssessmentTestData.causesRemoveFlow3.itemText
        );
    });

    it('should expand the Strategies section', async () => {
        await assetStrategyAnalysisForClassesPage.expandSection('Strategies');
    });

    it('should click "Create" on the Strategies section, fill the form and submit', async () => {
        await assetStrategyAnalysisForClassesPage.createStrategy({
            description: fleetAssessmentTestData.strategyFlow3.description,
            longDescription: fleetAssessmentTestData.strategyFlow3.longDescription,
            type: fleetAssessmentTestData.strategyFlow3.type,
            inspectionType: fleetAssessmentTestData.strategyFlow3.inspectionType,
            inspectionStage: fleetAssessmentTestData.strategyFlow3.inspectionStage,
            startDate: fleetAssessmentTestData.strategyFlow3.startDate,
            dueDate: fleetAssessmentTestData.strategyFlow3.dueDate
        });
    });

    it('should tick the created strategy, click "Edit & Update", change the description, save and confirm', async () => {
        await assetStrategyAnalysisForClassesPage.editStrategyDescription(
            fleetAssessmentTestData.strategyEditFlow3.currentDescription,
            fleetAssessmentTestData.strategyEditFlow3.newDescription
        );
    });

    it('should click on the Operating Context (TestOCC1)', async () => {
        await assetStrategyAnalysisForClassesPage.clickOperatingContextByName(
            fleetAssessmentTestData.operatingContextAndConditionFlow2.name
        );
    });

    it('should click "Assign/Unassign Technical Object" → Assign → Equipment', async () => {
        await assetStrategyAnalysisForClassesPage.assignTechnicalObject('Equipment');
    });

    it('should tick the first equipment, click Confirm, OK, then close the column', async () => {
        await assetStrategyAnalysisForClassesPage.confirmFirstEquipmentAndCloseColumn();
    });


    it('should delete the assessment and verify it is removed', async () => {
        await assetStrategyAnalysisForClassesPage.refreshApp();
        await assetStrategyAnalysisForClassesPage.deleteAssessment();
        await assetStrategyAnalysisForClassesPage.searchInListView(assessmentDescription);
        await assetStrategyAnalysisForClassesPage.verifyAssessmentDeleted(assessmentDescription);
    });

});
