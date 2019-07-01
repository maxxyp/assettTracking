package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.ApplianceDetailsPage;

import java.io.IOException;
import java.util.List;

public class applianceDetails extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^Appliance Details - I click the first appliance$")
    public void applianceDetailsIClickTheFirstAppliance() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_first_appliance();
//        Thread.sleep(5000);
        Thread.sleep(3000);
    }

    @Given("^Appliances - I click the first appliance on the list \"([^\"]*)\"$")
    public void appliances_I_click_the_first_appliance_on_the_list(String first) throws Throwable {

        WebElement ele = driver.findElement(By.cssSelector("div > div.au-target.col-xs-3.details-list-item-col.state-not-visited > span"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(1000);

        List<WebElement> firstappliance = driver.findElements(By.cssSelector("div > div.au-target.col-xs-3.details-list-item-col.state-not-visited > span"));

        for(int i=0; i<firstappliance.size(); i++){

            WebElement element = firstappliance.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(first)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(4000);
    }

    @And("^Appliance Details - I click Show Default button$")
    public void applianceDetailsIClickShowDefaultButton() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_show_default();
    }

    @And("^Appliance Details - I select default GC Code the first option$")
    public void applianceDetailsISelectDefaultGCCodeTheFirstOption() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_gc_code();
        applianceDetailsPage.click_gc_code_first_option();
//        Thread.sleep(2000);
    }

    @And("^Appliance Details - I type Location \"([^\"]*)\" Location$")
    public void applianceDetailsITypeLocationLocation(String Location) throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.enter_location(Location);
        Thread.sleep(1000);
    }

    @And("^Appliance Details - I type Installation year as \"([^\"]*)\"$")
    public void applianceDetailsITypeInstallationYearAs(String year) throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.enter_appliance_year(year);
    }

    @And("^Appliance Details - I select Flue Type the first option$")
    public void applianceDetailsISelectFlueTypeTheFirstOption() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);

        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.col-xs-6 > drop-down.au-target > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div.selection-container > div.input-container > div.select.search-box")));

        applianceDetailsPage.click_flue_type();

        Thread.sleep(1000);

        applianceDetailsPage.click_flue_type_first_option();

        Thread.sleep(1000);
    }

    @And("^Appliance Details - I click BG Installation - NO$")
    public void applianceDetailsIClickBGInstallationNO() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_bg_installation_no();
    }

    @And("^Appliance Details - I select Appliance Condition the first option$")
    public void applianceDetailsISelectApplianceConditionTheFirstOption() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_appliance_condition();
        applianceDetailsPage.click_appliance_condition_first_option();
    }

    @And("^Appliance Details - I select System Type the first option$")
    public void applianceDetailsISelectSystemTypeTheFirstOption() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_system_type();
        applianceDetailsPage.click_system_type_first_option();
    }

    @And("^Appliance Details - I select System Type 2 the first option$")
    public void applianceDetailsISelectSystemType2TheFirstOption() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_system_type_2();
        applianceDetailsPage.click_system_type_first_option();
    }

    @And("^Appliance Details - I select System Design Condition the first option$")
    public void applianceDetailsISelectSystemDesignConditionTheFirstOption() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_system_design_condition_first_option();
    }

    @And("^Appliance Details - I type Radiators as \"([^\"]*)\"$")
    public void applianceDetailsITypeRadiatorsAs(String value) throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.enter_radiator(value);
    }

    @And("^Appliance Details - I type Radiators Special as \"([^\"]*)\"$")
    public void applianceDetailsITypeRadiatorsSpecialAs(String value) throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.enter_radiator_special(value);
    }

    @And("^Appliance Details - I type Boiler Size Units as \"([^\"]*)\"$")
    public void applianceDetailsITypeBoilerSizeUnitsAs(String value) throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.enter_boiler_size(value);
    }

    @And("^Appliance Details - I select Cylinder Type the first option$")
    public void applianceDetailsISelectCylinderTypeTheFirstOption() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_cylinder_type_first_option();
    }

    @And("^Appliance Details - I select Energy Controls the first option$")
    public void applianceDetailsISelectEnergyControlsTheFirstOption() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_energy_control_first_option();
        Thread.sleep(3000);
    }


    @And("^Appliance Details - GC Code I type \"([^\"]*)\"$")
    public void applianceDetailsGCCodeIType(String value) throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.enter_gc_code(value);
    }

    @And("^Appliance Details - Description I type \"([^\"]*)\"$")
    public void applianceDetailsDescriptionIType(String value) throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.enter_description(value);
    }

    @And("^Appliance Details - Serial Number - I type \"([^\"]*)\"$")
    public void applianceDetailsSerialNumberIType(String number) throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.enter_serial_number(number);
//        Thread.sleep(2000);
    }

    @And("^Appliances - I click Appliance Detail Tab")
    public void appliancesIClickApplianceDetailTab() throws Throwable {
        driver.findElement(By.xpath("//div/div/div/div[4]/span")).click();
        Thread.sleep(2000);
    }


}

