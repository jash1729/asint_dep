import {safetydata} from '../../../../test_data/btp_applications/safety.data';
import utils from '../../../../utils/utils';

class safetyHAZOPListView {

  private get hazopTile() { return $("//a[@role='link' and contains(@aria-label, 'HAZOP') and contains(@href, 'apm-02-asint.launchpad.cfapps.us10')]"); }
  private get createNewHazop() { return $("//button[contains(@title,'Hazop')]"); }
  private get frame(): any { return $("iframe[data-help-id='application-hazop-manage']"); }
  private get hazopnameField() { return $("//textarea[@aria-required='true' and @rows='1']"); }
  private get hazopdesc() { return $("//textarea[@aria-required='true' and @rows='3']"); }
  private get flocdropdown() { return $("//span[@aria-label = 'Show Value Help']"); }
  private get startDate() { return $("//input[contains(@id,'StartDate')]"); }
  private get endDate() { return $("//input[contains(@id,'EndDate')]"); }
  private get riskmatrixDropdown() { return $("//input[.//@placeholder='Risk Matrix']/following-sibling::div"); }
  private get riskMatrixSelect() { return $("//span[contains (text(),'HAZOP 5*5')]"); }
  private get saveButton() { return $("//bdi[contains(text(),'Save')]"); }
  private get OKButton() { return $("//bdi[text()='OK']"); }
  private get createAssemtBtn() { return $("//bdi[text()='Create Assessment']"); }

  public async navigateToHazopTile(): Promise<void> {
    await utils.waitForBusyIndicatorToDisappear();
    await utils.clickWithWait(this.hazopTile);
    await utils.waitForBusyIndicatorToDisappear();
  }
    
  public async createHazopstudy(): Promise<void> {
    console.log("Creating Hazop");
    await utils.switchToIframe(this.frame);
    await utils.clickWithWait(this.createNewHazop);
    await utils.waitForBusyIndicatorToDisappear();    
    await utils.clickWithWait(this.hazopnameField);
    await utils.setValueWithWait(this.hazopnameField,await utils.generateRandomHazopName());
    console.log("Hazop Name entered :"+await utils.generateRandomHazopName());
  
    await utils.clickWithWait(this.hazopdesc);
    await utils.setValueWithWait(this.hazopdesc,safetydata.createHAZOP.Hzdescription);
    console.log("Hazop description entered :"+safetydata.createHAZOP.Hzdescription);

    await utils.clickWithWait(this.flocdropdown);
    const rowVal = await $("(//tr[@role='row'])[2]//td[2]//span");
    await rowVal.waitForDisplayed({ timeout: 30000 });
    let i = 2;
    while (true) {
      const row = $(`(//tr[@role='row'])[${i}]//td[2]//span`);
      await row.waitForDisplayed({ timeout: 30000 });
      const text = await row.getText();
      console.log("Choosing functiona location "+ text);
      await utils.clickWithWait(row);
      break;
    }
    await utils.clickWithWait(this.startDate);
    await utils.setValueWithWait(this.startDate,safetydata.createHAZOP.hzstartdate);
    console.log("Entered start date");
    await utils.clickWithWait(this.endDate);
    await utils.setValueWithWait(this.endDate,safetydata.createHAZOP.hzenddate);
    console.log("Entered end date");
    await utils.clickWithWait(this.riskmatrixDropdown);
    await utils.clickWithWait(this.riskMatrixSelect);
    console.log("Selected Risk Matrix");
    console.log("Clicking save button");
    await utils.clickWithWait(this.saveButton);
    console.log("Save button clicked");
    await utils.waitForBusyIndicatorToDisappear();
    await utils.clickWithWait(this.OKButton);
    await utils.waitForBusyIndicatorToDisappear();
    console.log("Entered Ok Button");
    console.log("Navigating to details page of newly created hazop");
    await this.createAssemtBtn.waitForDisplayed({ timeout: 30000 });
    console.log("Hazop Created");
  }
}
export default new safetyHAZOPListView ();