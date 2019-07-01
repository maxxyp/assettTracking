package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import pages.ApplianceDetailsPage;

import java.io.IOException;
import java.util.List;

public class applianceElectricalSafety extends testBase{

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^User Settings - Gas - I select Working Area \"([^\"]*)\" Patch Area \"([^\"]*)\" and Region \"([^\"]*)\"$")
    public void userSettingsGasISelectWorkingAreaPatchAreaAndRegion(String workarea, String patch, String region) throws Throwable {
        try {
            driver.findElement(By.cssSelector("div:nth-child(1) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control")).click();

            List<WebElement> working_area = driver.findElements(By.cssSelector("drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div > div"));

            for(int i=0; i<working_area.size(); i++){

            WebElement element = working_area.get(i);
            String innerhtml = element.getAttribute("innerHTML");

            if(innerhtml.contentEquals(workarea)){
                element.click();
                break;
            }
        }
            Thread.sleep(1000);

        driver.findElement(By.cssSelector("div:nth-child(2) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();

        List<WebElement> patch_dropdown = driver.findElements(By.cssSelector("div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<patch_dropdown.size(); i++){

            WebElement element = patch_dropdown.get(i);
            String innerhtml = element.getAttribute("innerHTML");

            if(innerhtml.contentEquals(patch)){
                element.click();
                break;
            }
        }
            Thread.sleep(1000);

        driver.findElement(By.cssSelector("div:nth-child(3) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();

        List<WebElement> region_dropdown = driver.findElements(By.cssSelector("div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<region_dropdown.size(); i++){

            WebElement element = region_dropdown.get(i);
            String innerhtml = element.getAttribute("innerHTML");

            if(innerhtml.contentEquals("1 - Scotland")){
                element.click();
                break;
            }
        }
        Thread.sleep(3000);

        } catch (Exception e) {
            System.out.println("User Settings already set");
        }

    }

    @And("^Training Settings - I select \"([^\"]*)\" as Training Engineer$")
    public void trainingSettingsISelectAsTrainingEngineer(String settings) throws Throwable {
        driver.findElement(By.cssSelector("div.col-xs-9 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();
        List<WebElement> training = driver.findElements(By.cssSelector("div.au-target.dropdown-container > div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<training.size(); i++){

            WebElement element = training.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(settings)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(2000);
    }

    @And("^Property Safety Details - I enter \"([^\"]*)\" ELI Readings Ohms$")
    public void propertySafetyDetailsIEnterELIReadingsOhms(String value) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(1) > div > span:nth-child(2) > number-box > input")).sendKeys(value);
        Thread.sleep(1000);
    }

    @And("^Property Safety Details - I click Yes consumer unit fuse box satisfactory$")
    public void propertySafetyDetailsIClickYesConsumerUnitFuseBoxSatisfactory() throws Throwable {
        driver.findElement(By.cssSelector("button.au-target.btn.btn-primary.form-control.button-list-item.notactive")).click();
        driver.findElement(By.cssSelector("form > div > div:nth-child(2) > div > span.col-xs-8 > button-list > div > button:nth-child(2) > span")).click();
    }

    @And("^Property Safety Details - I click TNS System type$")
    public void propertySafetyDetailsIClickTNSSystemType() throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > div > span.col-xs-8 > button-list > div > button:nth-child(2) > span")).click();
        Thread.sleep(3000);
    }

    @And("^I click the first appliance on the list$")
    public void iClickTheFirstApplianceOnTheList() throws Throwable {
        driver.findElement(By.cssSelector("div.au-target.col-xs-3.details-list-item-col.state-not-visited")).click();
        Thread.sleep(2000);
    }

    @And("^I click Electrical Safety button$")
    public void iClickElectricalSafetyButton() throws Throwable {
        driver.findElement(By.xpath("/html/body/div/div[1]/router-view/view-state/div/router-view/view-state/div/div/router-view/view-state/div/div/div[1]/div[4]/span[5]")).click();
        Thread.sleep(5000);
    }

    @And("^Electrical Safety - Main Earth Okay - I click \"([^\"]*)\"$")
    public void electricalSafetyMainEarthOkayIClick(String option) throws Throwable {
        List<WebElement> earth = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(1) > div > div.col-xs-9 > button-list > div > button > span"));

        for(int i=0; i<earth.size(); i++){

            WebElement element = earth.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
        }
        Thread.sleep(1000);
    }

    @And("^Electrical Safety - Gas Bonding Okay - I click \"([^\"]*)\"$")
    public void electricalSafetyGasBondingOkayIClick(String option) throws Throwable {

        List<WebElement> gas = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(2) > div > div.col-xs-9 > button-list > div > button > span"));

        for(int i=0; i<gas.size(); i++){

            WebElement element = gas.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Electrical Safety - Water Bonding Okay - I click \"([^\"]*)\"$")
    public void electricalSafetyWaterBondingOkayIClick(String option) throws Throwable {
        List<WebElement> water = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(3) > div > div.col-xs-9 > button-list > div > button > span"));
        for(int i=0; i<water.size(); i++){

            WebElement element = water.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Electrical Safety - Other Bonding Checked Okay - I click \"([^\"]*)\"$")
    public void electricalSafetyOtherBondingCheckedOkayIClick(String option) throws Throwable {
        List<WebElement> bonding = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(4) > div > div.col-xs-9 > button-list > div > button > span"));
        for(int i=0; i<bonding.size(); i++){

            WebElement element = bonding.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Electrical Safety - Supplementary Bonding or Full RCD Protection Okay - I click \"([^\"]*)\"$")
    public void electricalSafetySupplementaryBondingOrFullRCDProtectionOkayIClick(String option) throws Throwable {
        List<WebElement> supplemantary = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(5) > div > div.col-xs-9 > button-list > div > button > span"));
        for(int i=0; i<supplemantary.size(); i++){

            WebElement element = supplemantary.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Electrical Safety - Ring Continuity Reading Done - I click \"([^\"]*)\"$")
    public void electricalSafetyRingContinuityReadingDoneIClick(String option) throws Throwable {
        List<WebElement> supplemantary = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(6) > div > div.col-xs-9 > button-list > div > button > span"));
        for(int i=0; i<supplemantary.size(); i++){

            WebElement element = supplemantary.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(1000);
    }

    @And("^Electrical Safety - LEIR - I type \"([^\"]*)\" Reading$")
    public void electricalSafetyLEIRITypeReading(String value) throws Throwable {
       driver.findElement(By.cssSelector("div:nth-child(3) > div:nth-child(7) > div > div:nth-child(2) > number-box > input")).sendKeys(value);
    }

    @And("^Electrical Safety - NEIR - I type \"([^\"]*)\" Reading$")
    public void electricalSafetyNEIRITypeReading(String value) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > div:nth-child(9) > div > div:nth-child(2) > number-box > input")).sendKeys(value);
    }

    @And("^Electrical Safety - LNIR - I type \"([^\"]*)\" Reading$")
    public void electricalSafetyLNIRITypeReading(String value) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > div:nth-child(11) > div > div:nth-child(2) > number-box > input")).sendKeys(value);
    }

    @And("^Electrical Safety - Final ELI Reading done - I click \"([^\"]*)\"$")
    public void electricalSafetyFinalELIReadingDoneIClick(String option) throws Throwable {

        List<WebElement> eli = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(14) > div > div.col-xs-9 > button-list > div > button > span"));
        for(int i=0; i<eli.size(); i++){

            WebElement element = eli.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(1000);
    }

    @And("^Electrical Safety - I type \"([^\"]*)\" Final ELI Reading$")
    public void electricalSafetyITypeFinalELIReading(String value) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > div:nth-child(15) > div > div:nth-child(2) > number-box > input")).sendKeys(value);
    }

    @And("^Electrical Safety - Customer RCD RCBO Protected - Bonding Okay - I click \"([^\"]*)\"$")
    public void electricalSafetyCustomerRCDRCBOProtectedBondingOkayIClick(String option) throws Throwable {
        List<WebElement> rcbo = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(18) > div > div.col-xs-9 > button-list > div > button > span"));
        for(int i=0; i<rcbo.size(); i++){

            WebElement element = rcbo.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Electrical Safety - RCD Trip Time - I type \"([^\"]*)\" Reading$")
    public void electricalSafetyRCDTripTimeITypeReading(String value) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > div:nth-child(19) > div > div:nth-child(2) > number-box > input")).sendKeys(value);
        Thread.sleep(5000);
    }

    @And("^Electrical Safety - Fuse MCB Rating - I select \"([^\"]*)\"$")
    public void electricalSafetyFuseMCBRatingISelect(String option) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > div:nth-child(25) > div > div:nth-child(2) > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();
        List<WebElement> fuse = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(25) > div > div:nth-child(2) > drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div > div"));
        for(int i=0; i<fuse.size(); i++){

            WebElement element = fuse.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Electrical Safety - Is Part P - I click \"([^\"]*)\"$")
    public void electricalSafetyIsPartPIClick(String option) throws Throwable {
        List<WebElement> part = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(29) > div > div.col-xs-9 > button-list > div > button > span"));
        for(int i=0; i<part.size(); i++){

            WebElement element = part.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
        }
    }

    @And("^Electrical Safety - Worked on lighting circuit - I click \"([^\"]*)\"$")
    public void electricalSafetyWorkedOnLightingCircuitIClick(String option) throws Throwable {
        List<WebElement> lighting = driver.findElements(By.cssSelector("div:nth-child(3) > div:nth-child(31) > div > div.col-xs-9 > button-list > div > button > span"));
        for(int i=0; i<lighting.size(); i++){

            WebElement element = lighting.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                element.click();
                break;
            }
        }
        Thread.sleep(2000);
    }

    @And("^Electrical Safety - Installation Satisfactory - I click \"([^\"]*)\"$")
    public void electricalSafetyInstallationSatisfactoryIClick(String option) throws Throwable {
//        List<WebElement> satisfactory = driver.findElements(By.cssSelector("div:nth-child(33) > div > div.col-xs-9 > button-list > div > button > span"));
//                                                                            //div:nth-child(3) > div:nth-child(33) > div > div.col-xs-9 > button-list > div > button:nth-child(1) > span
//        for(int i=0; i<satisfactory.size(); i++){
//
//            WebElement element = satisfactory.get(i);
//            String innerhtml = element.getAttribute("innerHTML");
//            if(innerhtml.contains(option)){
//                element.click();
//                break;
//            }
//            System.out.println("values from drop down is : "+innerhtml);
//        }
        WebElement ele = driver.findElement(By.cssSelector("div:nth-child(3) > div:nth-child(33) > div > div.col-xs-9 > button-list > div > button:nth-child(1) > span"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(2000);
    }
}
