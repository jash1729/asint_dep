import safetyHAZOPDetailView from '../page_object_model/btp_applications_page/safety_group/hazop/hazop.detail.page';
import safetyHAZOPListView from '../page_object_model/btp_applications_page/safety_group/hazop/hazop.listview.page';
import utils from '../utils/utils';

describe("BTP - HAZOP - Functional Test", () => {

  it('should navigate to HAZOP Application', async () => {
    await safetyHAZOPListView.navigateToHazopTile();
  });

  it('should add and verify all the adapt filters', async () => {
    await utils.addAllAdaptFilter();
    await utils.resetAllAdaptFilter();
  });

  it('should verify fields in list view using setting option', async () => {
    await utils.verifyFieldsInListView();
    await utils.resetFieldsInListView();
  });
 
  it('should create Hazops Study', async () => {
    await safetyHAZOPListView.createHazopstudy();
  });

  it('should create new assesment for HAZOP Application', async () => {
    await safetyHAZOPDetailView.createAssessment();
  });

  it('should add deviation for new assesment for HAZOP Application', async () => {
    await safetyHAZOPDetailView.addDeviationInAssesment();
  });

  it('should add cause for new deviation for HAZOP Application', async () => {
    await safetyHAZOPDetailView.addCause();
  });

  it('should add Consequence for new cause for HAZOP Application', async () => {
    await safetyHAZOPDetailView.addConsequence();
    await safetyHAZOPDetailView.addDetailsOfConsequence();
    await safetyHAZOPDetailView.completeConsequence();
  });
  
  it('should publish the completed Hazop', async () => {
    await safetyHAZOPDetailView.publishHazop();
  });

});

