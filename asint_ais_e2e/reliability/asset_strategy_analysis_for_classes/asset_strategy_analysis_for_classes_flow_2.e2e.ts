import assetStrategyAnalysisForClassesPage from 'page_object_model/btp_applications_page/reliability/asset_strategy_analysis_for_classes/asset_strategy_analysis_for_classes.page';
import { fleetAssessmentTestData } from 'test_data/btp_applications/reliability/fleet_assessment.data';

const assessmentDescription = fleetAssessmentTestData.createMandatory.description;

describe('BTP - (Fleet) - Asset Strategy Analysis for Classes App - Flow 2 (Create & Delete)', () => {

    it('should create a new assessment with all mandatory fields', async () => {
        await assetStrategyAnalysisForClassesPage.navigateToApp();
        await assetStrategyAnalysisForClassesPage.clickCreateButton();
        await assetStrategyAnalysisForClassesPage.fillCreateAssessmentForm({
            description: assessmentDescription,
            className: fleetAssessmentTestData.createMandatory.className,
            failureDataProfile: fleetAssessmentTestData.createMandatory.failureDataProfile
        });
        await assetStrategyAnalysisForClassesPage.checkCreateAsBaselineCheckbox();
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

    it('should click the edit button on TestOCC1 and rename the Operating Context', async () => {
        await assetStrategyAnalysisForClassesPage.editOccName(
            fleetAssessmentTestData.operatingContextAndConditionFlow2.name,
            fleetAssessmentTestData.occRenameFlow2.newName
        );
    });

    it('should delete the assessment and verify it is removed', async () => {
        await assetStrategyAnalysisForClassesPage.refreshApp();
        await assetStrategyAnalysisForClassesPage.deleteAssessment();
        await assetStrategyAnalysisForClassesPage.searchInListView(assessmentDescription);
        await assetStrategyAnalysisForClassesPage.verifyAssessmentDeleted(assessmentDescription);
    });

});
