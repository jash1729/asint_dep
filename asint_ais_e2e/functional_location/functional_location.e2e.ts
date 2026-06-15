import functionalLocationListView from '../page_object_model/btp_applications_page/master_data/functional_location/functional_location.listview.page';
import functionalLocationDetailView from '../page_object_model/btp_applications_page/master_data/functional_location/functional_location.detail.page';
import {funcLocTestData} from '../test_data/btp_applications/functional_location.data';
import utils from '../utils/utils';
describe('BTP - Functional Location - Functional Test', () => {

    it('should navigate to functional location list view', async () => {
        await functionalLocationListView.navigateFunctionalLocationListView();
    });

    it('should add and verify all the adapt filters', async () => {
        await utils.addAllAdaptFilter();
        await utils.resetAllAdaptFilter();
    });

    it('should create new advanced filter and verify', async () => {
        const createdFilterName = await utils.createNewAdvancedFilter();
        console.log(`Created filter for this run: ${createdFilterName}`);
    });
 
    it('should apply the created advanced filter and verify', async () => {
        await utils.applyAdvancedFilter();
    });
 
    it('should reset and delete the created advanced filter and verify', async () => {
        await utils.resetAdvancedFilter();
        await utils.deleteAdvancedFilter();
    });

    it('should verify fields in list view using setting option', async () => {
        await utils.verifyFieldsInListView();
        await utils.resetFieldsInListView();
    });

    it('should verify show hierarchy option in list View', async () => {
        await utils.verifyShowHierarchy();
    });

    it('should verify Analytic chart option in list View', async () => {
        await utils.verifyAnalyticsChart();
    });

    it('should create a new functional location', async () => {
        await functionalLocationListView.createFunctionalLocation
        (funcLocTestData.createMandatory.funLocTemp);
    });

    it('should navigate to newly created functional location' , async () => {
        await functionalLocationListView.navigateFunctionalLocation();
    });

    it('should verify and edit header information' , async () => {
        await functionalLocationDetailView.verifyHeader();
        await functionalLocationDetailView.editHeader();
    });

    it('should verify and edit general information tab' , async () => {
        await functionalLocationDetailView.verifyAndEditGeneralInfo();
    });

    it('should verify and edit structure tab' , async () => {
        await functionalLocationDetailView.verifyAndEditStructure();
        await functionalLocationDetailView.assignEquipment(2);
        await functionalLocationDetailView.assignFuncLoc(2);
        await functionalLocationDetailView.verifyGroups();
    });

    it('should assign functional location template and classes and characterstics in assignments' , async () => {
        await functionalLocationDetailView.asgnFunLocTemplate(
            funcLocTestData.assignmentEdit.noOfFunLocTempToAssign,
            funcLocTestData.assignmentEdit.isAutoAssignClass);
        await functionalLocationDetailView.assignFunLocClass(
            funcLocTestData.assignmentEdit.noOfFunctionalClassesToAssign,
            funcLocTestData.assignmentEdit.isAutoAssignClass);
    });

    it('Should verify classification and MDA tab' , async () => {
        await functionalLocationDetailView.assignFunLocChar(
            funcLocTestData.classificationMDA.noOfCharacteristics);
    });

    it('should verify asset Intelligence' , async () => {
        await functionalLocationDetailView.verifyAssetIntelligence();
    });

    it('should verify risk summary' , async () => {
        await functionalLocationDetailView.verifyRiskSummary();
    });
    it('should verify maintenance and service' , async () => {
        await functionalLocationDetailView.verifyMainAndSum();
    });

    it('should verify attachment section' , async () => {
        await functionalLocationDetailView.gotoAttachmentsTabAndAssignAttachment();
//        await functionalLocationDetailView.addDocument();
//        await functionalLocationDetailView.addLink();
//        await functionalLocationDetailView.deleteAttachmentAndVerify();

    });

    it('should verify change history' , async () => {
        await functionalLocationDetailView.verifyChangeHistory();
    });

    it('should verify CML from header section of functional location' , async () => {
        await functionalLocationDetailView.verifyCML();
    });

    it('should download and verify PDF document of functional location' , async () => {
        await functionalLocationDetailView.downloadAndVerifyPDF();
    });

    it('should delete the created functional location and verify', async () => {
        await functionalLocationDetailView.deleteFunctionalLocation();
        await functionalLocationListView.verifyDeletionOfFunctionalLocation();
    });
     
});
