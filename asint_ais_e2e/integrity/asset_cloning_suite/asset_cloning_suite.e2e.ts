import assetCloningSuiteListViewPage from '../../page_object_model/btp_applications_page/integrity/asset_cloning_suite/asset_cloning_suite.listview.page';
import assetCloningSuiteDetailViewPage from '../../page_object_model/btp_applications_page/integrity/asset_cloning_suite/asset_cloning_suite.detailview.page';
import { assetCloningSuiteTestData } from '../../test_data/btp_applications/integrity/asset_cloning_suite.data';

describe('BTP - Asset Cloning Suite Application - Functional Test', () => {

	const { searchTerms, cloneDescriptions, cloningTemplate } = assetCloningSuiteTestData;

	it('should click on asset cloning suite application', async () => {
		await assetCloningSuiteListViewPage.navigateToAssetCloningSuiteListView();
	});

	it('should open Asset Strategy Assessments, search "pala", clone an assessment, verify its title and delete it', async () => {
		await assetCloningSuiteListViewPage.openAssetStrategyAssessments();
		await assetCloningSuiteListViewPage.searchAssessment(searchTerms.asd);
		await assetCloningSuiteListViewPage.selectFirstSearchedAssessment();
		await assetCloningSuiteDetailViewPage.updateCloneDescription(cloneDescriptions.asd);
		await assetCloningSuiteDetailViewPage.submitClone();
		await assetCloningSuiteDetailViewPage.verifyClonedAssessmentTitle(cloneDescriptions.asd);
		await assetCloningSuiteDetailViewPage.deleteClonedAssessment();
	});

	it('should open Asset RCM Analysis, search "Automation Test (DND)", clone the first assessment, verify its title and delete it', async () => {
		await assetCloningSuiteListViewPage.returnToAssetCloningSuiteHome();
		await assetCloningSuiteListViewPage.openAssetRCMAnalysis();
		await assetCloningSuiteListViewPage.searchListAssessment(searchTerms.rcm);
		await assetCloningSuiteListViewPage.selectFirstListAssessment();
		await assetCloningSuiteDetailViewPage.updateRCMCloneDescription(cloneDescriptions.rcm);
		await assetCloningSuiteDetailViewPage.submitRCMClone();
		await assetCloningSuiteDetailViewPage.verifyClonedAssessmentTitle(cloneDescriptions.rcm);
		await assetCloningSuiteDetailViewPage.deleteClonedAssessmentViaManage();
	});

	it('should open Asset RCM Analysis, clone it with baseline checkbox enabled, verify and delete it', async () => {
		await assetCloningSuiteListViewPage.returnToAssetCloningSuiteHome();
		await assetCloningSuiteListViewPage.openAssetRCMAnalysis();
		await assetCloningSuiteListViewPage.searchListAssessment(searchTerms.rcm);
		await assetCloningSuiteListViewPage.selectFirstListAssessment();
		await assetCloningSuiteDetailViewPage.updateRCMCloneDescription(cloneDescriptions.rcmWithCheckbox);
		await assetCloningSuiteDetailViewPage.toggleRCMCloneOptionCheckbox();
		await assetCloningSuiteDetailViewPage.submitRCMClone();
		await assetCloningSuiteDetailViewPage.verifyClonedAssessmentTitle(cloneDescriptions.rcmWithCheckbox);
		await assetCloningSuiteDetailViewPage.deleteClonedAssessmentViaManage();
	});

	it('should open Asset Strategy Analysis for Classes, search "Automation_Test (DND)", clone it, verify and delete', async () => {
		await assetCloningSuiteListViewPage.returnToAssetCloningSuiteHome();
		await assetCloningSuiteListViewPage.openAssetStrategyAnalysisForClasses();
		await assetCloningSuiteListViewPage.searchListAssessment(searchTerms.asa);
		await assetCloningSuiteListViewPage.selectFirstListAssessment();
		await assetCloningSuiteDetailViewPage.updateRCMCloneDescription(cloneDescriptions.asa);
		await assetCloningSuiteDetailViewPage.toggleRCMCloneOptionCheckbox();
		await assetCloningSuiteDetailViewPage.submitRCMClone();
		await assetCloningSuiteDetailViewPage.verifyClonedAssessmentTitle(cloneDescriptions.asa);
		await assetCloningSuiteDetailViewPage.deleteClonedAssessmentViaManage();
	});

	it('should open Asset Strategy Analysis for Classes, search "Automation_Test (DND)", clone it with baseline checkbox enabled, verify and delete', async () => {
		await assetCloningSuiteListViewPage.returnToAssetCloningSuiteHome();
		await assetCloningSuiteListViewPage.openAssetStrategyAnalysisForClasses();
		await assetCloningSuiteListViewPage.searchListAssessment(searchTerms.asa);
		await assetCloningSuiteListViewPage.selectFirstListAssessment();
		await assetCloningSuiteDetailViewPage.updateRCMCloneDescription(cloneDescriptions.asa);
		await assetCloningSuiteDetailViewPage.toggleRCMCloneOptionCheckbox();
		await assetCloningSuiteDetailViewPage.submitRCMClone();
		await assetCloningSuiteDetailViewPage.verifyClonedAssessmentTitle(cloneDescriptions.asa);
		await assetCloningSuiteDetailViewPage.deleteClonedAssessmentViaManage();
	});

	it('should open Risk and Criticality Assessments, clone an assessment, verify and delete', async () => {
		await assetCloningSuiteListViewPage.returnToAssetCloningSuiteHome();
		await assetCloningSuiteListViewPage.openRiskAndCriticalityAssessments();
		await assetCloningSuiteListViewPage.searchListAssessment(searchTerms.rca);
		await assetCloningSuiteListViewPage.selectFirstListAssessment();
		await assetCloningSuiteDetailViewPage.updateRCACloneDescription(cloneDescriptions.rca);
		await assetCloningSuiteDetailViewPage.submitRCAClone();
		await assetCloningSuiteDetailViewPage.verifyClonedAssessmentTitle(cloneDescriptions.rca);
		await assetCloningSuiteDetailViewPage.deleteClonedAssessmentViaManage();
	});

	it('should open Asset Cloning Templates, open the Create New Tasks dialog and clone a new task', async () => {
		await assetCloningSuiteListViewPage.returnToAssetCloningSuiteHome();
		await assetCloningSuiteListViewPage.openAssetCloningTemplates();
		await assetCloningSuiteListViewPage.clickAddCloningTemplateButton();
		await assetCloningSuiteListViewPage.fillCreateTaskShortDescription(cloningTemplate.shortDescription);
		await assetCloningSuiteListViewPage.selectObjectTypeFirstOption();
		await assetCloningSuiteListViewPage.selectAssessmentTemplateByName(cloningTemplate.assessmentName);
		await assetCloningSuiteListViewPage.selectRelevantForOption(cloningTemplate.relevantFor);
		await assetCloningSuiteListViewPage.submitCreateTaskClone();
		await assetCloningSuiteListViewPage.acknowledgeCloningTemplateSuccessPopup();
		await assetCloningSuiteListViewPage.searchAssessment(cloningTemplate.shortDescription);
		await assetCloningSuiteListViewPage.verifyAndOpenCloningTemplate(cloningTemplate.shortDescription);
	});

});
