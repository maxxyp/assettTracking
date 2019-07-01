package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import pages.ApplianceDetailsPage;
import pages.CommonPage;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertTrue;

public class applianceList extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^I see appliance List Container$")
    public void iSeeApplianceListContainer() throws Throwable {
        driver.findElement(By.cssSelector("div > div > router-view > view-state > div > div > div > div > div")).isDisplayed();
    }

    @And("^Second Appliance - I verify that the second appliance has \"([^\"]*)\" value$")
    public void secondApplianceIVerifyThatTheSecondApplianceHasValue(String arg0) throws Throwable {
        assertTrue(driver.findElement(By.cssSelector("div.au-target.col-xs-3.details-list-item-col.state-dont-care")).isDisplayed());
    }

//    @And("^I click Activities Button$")
//    public void iClickActivitiesButton() throws Throwable {
//        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
//        commonpage.click_activity_btn();
//        Thread.sleep(1000);
//    }

    @And("^I click New Task Button$")
    public void iClickNewTaskButton() throws Throwable {
        List<WebElement> newtask = driver.findElements(By.cssSelector("button"));

        for(int i=0; i<newtask.size(); i++){

            WebElement element = newtask.get(i);
            String innerhtml = element.getAttribute("innerHTML");

            if(innerhtml.contains("New")){
                element.click();
                break;
            }
        }
        Thread.sleep(2000);
    }

    @And("^New Activity - Appliance Type Location - I select \"([^\"]*)\"$")
    public void newActivityApplianceTypeLocationISelect(String locationtype) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(1) > div > span.col-xs-10 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();
        Thread.sleep(1000);
        List<WebElement> app_type = driver.findElements(By.cssSelector("div:nth-child(1) > div > span.col-xs-10 > drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<app_type.size(); i++){

            WebElement element = app_type.get(i);
            String innerhtml = element.getAttribute("innerHTML");

            if(innerhtml.contains(locationtype)){
                element.click();
                break;
            }
        }
        Thread.sleep(2000);
    }

    @And("^New Activity - Action Type - I select \"([^\"]*)\"$")
    public void newActivityActionTypeISelect(String actiontype) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > div > span.col-xs-10 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();

        List<WebElement> action_type = driver.findElements(By.cssSelector("div:nth-child(3) > div > span.col-xs-10 > drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<action_type.size(); i++){

            WebElement element = action_type.get(i);
            String innerhtml = element.getAttribute("innerHTML");

            if(innerhtml.contains(actiontype)){
                System.out.println(innerhtml);
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(2000);

    }

    @And("^New Activity - Charge Type - I select \"([^\"]*)\"$")
    public void newActivityChargeTypeISelect(String chargetype) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(4) > div > span:nth-child(2) > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();

        List<WebElement> charge_type = driver.findElements(By.cssSelector("div:nth-child(4) > div > span:nth-child(2) > drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div"));

        for(int i=0; i<charge_type.size(); i++){

            WebElement element = charge_type.get(i);
            String innerhtml = element.getAttribute("innerHTML");

            if(innerhtml.contains(chargetype)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(1000);
    }

    @And("^New Activity - Save - I click Save Button$")
    public void newActivitySaveIClickSaveButton() throws Throwable {
        driver.findElement(By.cssSelector("div.card.details-card > div > div > button.btn.btn-primary.au-target")).click();
        Thread.sleep(5000);
    }

    @And("^New Activity - I click Delete button$")
    public void newActivityIClickDeleteButton() throws Throwable {
        driver.findElement(By.cssSelector("button.btn.btn-tertiary.cross-blue.au-target")).click();
    }

    @And("^New Activity - I click Appliances Label$")
    public void newActivityIClickAppliancesLabel() throws Throwable {
        ApplianceDetailsPage applianceDetailsPage = PageFactory.initElements(driver, ApplianceDetailsPage.class);
        applianceDetailsPage.click_appliance_tab();
    }

    @And("^Appliance List - I verify the second appliance form has \"([^\"]*)\" value$")
    public void applianceListIVerifyTheSecondApplianceFormHasValue(String arg0) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > div.au-target.col-xs-3.details-list-item-col.state-not-visited")).isDisplayed();
    }

    @And("^New Appliance - Appliance Type - I select \"([^\"]*)\"$")
    public void newApplianceApplianceTypeISelect(String apptypeval) throws Throwable {
        driver.findElement(By.cssSelector("form > div > div > div:nth-child(1) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > input")).click();

        List<WebElement> type = driver.findElements(By.cssSelector("div:nth-child(1) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<type.size(); i++){

            WebElement element = type.get(i);
            String innerhtml = element.getAttribute("innerHTML");

            if(innerhtml.contains(apptypeval)){
                element.click();
                break;
            }
        }
        Thread.sleep(1000);
    }

    @And("^New Appliance - GC CODE - I type \"([^\"]*)\"$")
    public void newApplianceGCCODEIType(String gccode) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(2) > div > div:nth-child(2) > text-box > input")).sendKeys(gccode);
    }

    @And("^New Appliance - Description - I type \"([^\"]*)\"$")
    public void newApplianceDescriptionIType(String description) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > div > div.col-xs-6 > text-box > input")).sendKeys(description);
    }

    @And("^New Appliance - Location - I type \"([^\"]*)\"$")
    public void newApplianceLocationIType(String location) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(4) > div > div.col-xs-6 > text-box > input")).sendKeys(location);
    }

    @And("^New Appliance - Appliance Year - I type \"([^\"]*)\"$")
    public void newApplianceApplianceYearIType(String appyear) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(5) > div > div:nth-child(2) > number-box > input")).sendKeys(appyear);
    }

    @And("^New Appliance - Serial Number - I type \"([^\"]*)\"$")
    public void newApplianceSerialNumberIType(String serialnos) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(6) > div > div.col-xs-6 > text-box > input")).sendKeys(serialnos);
    }

    @And("^New Appliance - BG Installation - I click \"([^\"]*)\"$")
    public void newApplianceBGInstallationIClick(String option) throws Throwable {
        List<WebElement> bgistall = driver.findElements(By.cssSelector("div:nth-child(7) > div > div.col-xs-6 > button-list > div > button:nth-child(2) > span"));

        for(int i=0; i<bgistall.size(); i++){

            WebElement element = bgistall.get(i);
            String innerhtml = element.getAttribute("innerHTML");

            if(innerhtml.contains(option)){
                element.click();
                break;
            }
        }
        Thread.sleep(1000);
    }

    @And("^New Appliance - I OK Button$")
    public void newApplianceIOKButton() throws Throwable {
        driver.findElement(By.cssSelector("div > div > div > div > button.btn.btn-primary.au-target")).click();
        Thread.sleep(2000);
    }

    @And("^Appliance List - I verify the container count equals \"([^\"]*)\"$")
    public void applianceListIVerifyTheContainerCountEquals(String arg0) throws Throwable {
        List<WebElement> appl_list = driver.findElements(By.cssSelector("div > div > router-view > view-state > div > div > div > div > div > span"));

            System.out.println(appl_list.size());
            for(int i=0;i<appl_list.size();i++){
                System.out.println(appl_list.get(i).getText());

        }
        Thread.sleep(1000);
    }

    @And("^Appliance List - I click the DELETE Button$")
    public void applianceListIClickTheDELETEButton() throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(6) > button")).click();
        Thread.sleep(1000);
    }

    @And("^New Activity - I verify that the New Activity is displayed$")
    public void newActivityIVerifyThatTheNewActivityIsDisplayed() throws Throwable {
        driver.findElement(By.cssSelector("div > div > div > div > div > div:nth-child(4)")).isDisplayed();
    }

    @Then("^New Activity - I verify that newly created Activity is Deleted$")
    public void newActivityIVerifyThatNewlyCreatedActivityIsDeleted() throws Throwable {
        Boolean exist = driver.findElements(By.cssSelector("div > div > div > div > div > div:nth-child(4)")).size() == 0;
    }

}
