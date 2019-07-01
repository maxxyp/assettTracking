package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.util.List;
// todo rename this to activity, should not be called appointment
public class appointmentBooking extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^I click Book An Appointment Button$")
    public void iClickBookAnAppointmentButton() throws Throwable {
        driver.findElement(By.cssSelector("div > div > div.action-container > div.job-shortcut-container > a:nth-child(3)")).click();
    }

    @And("^I see a message \"([^\"]*)\" displayed$")
    public void iSeeAMessageDisplayed(String arg0) throws Throwable {
        driver.findElement(By.cssSelector("view-state > div > div > div > div.card.details-card > div > p")).isDisplayed();
    }

    @And("^I click the Back Button$")
    public void iClickTheBackButton() throws Throwable {
        driver.findElement(By.cssSelector("div > div > div > div.card.details-card > div > button")).click();
        Thread.sleep(2000);
    }

    @And("^Appliance Booking - I click the first appliance on the List$")
    public void applianceBookingIClickTheFirstApplianceOnTheList() throws Throwable {
        driver.findElement(By.cssSelector("view-state > div > div > div > div > div > div:nth-child(3) > div.au-target.col-xs-3.details-list-item-col.state-not-visited > h4 > span:nth-child(1) > task-description > task-action > catalog-lookup")).click();
        Thread.sleep(2000);
    }

    @And("^Appliance Booking - Activities Status - I select \"([^\"]*)\"$")
    public void applianceBookingActivitiesStatusISelect(String option) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(1) > div > div.col-xs-4 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();
        Thread.sleep(1000);
        driver.findElement(By.cssSelector("div:nth-child(1) > div > div.col-xs-4 > drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div:nth-child(1) > div")).click();
    }

    @And("^Appliance Booking - Worked On - I click \"([^\"]*)\"$")
    public void applianceBookingWorkedOnIClick(String arg0) throws Throwable {
//        driver.findElement(By.cssSelector("div:nth-child(2) > div > div.col-xs-10 > button-list > div > button:nth-child(1) > span")).click();
//        Thread.sleep(2000);
        WebElement ele = driver.findElement(By.cssSelector("div:nth-child(2) > div > div.col-xs-10 > button-list > div > button:nth-child(1) > span"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(2000);

    }

    @And("^Appliance Booking - Activity Type - I select \"([^\"]*)\"$")
    public void applianceBookingActivityTypeISelect(String value) throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("div:nth-child(3) > div > div.col-xs-4 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(1000);

        List<WebElement> activityType = driver.findElements(By.cssSelector("drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<activityType.size(); i++){

            WebElement element = activityType.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(2000);
    }

    @And("^Appliance Booking - Fault Action Code - I select \"([^\"]*)\"$")
    public void applianceBookingFaultActionCodeSelect(String value) throws Throwable {

        WebElement ele = driver.findElement(By.cssSelector("div:nth-child(4) > div > div.col-xs-4 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(1000);


        List<WebElement> faultActionCodes = driver.findElements(By.cssSelector("div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<faultActionCodes.size(); i++){

            WebElement element = faultActionCodes.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(2000);
    }

    @And("^Appliance Booking - CHIRP Outcome Code - I select \"([^\"]*)\"$")
    public void applianceBookingCHIRPOutcomeCodeISelect(String code) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(7) > div > div:nth-child(2) > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();
        List<WebElement> outcome = driver.findElements(By.cssSelector("div:nth-child(7) > div > div:nth-child(2) > drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<outcome.size(); i++){

            WebElement element = outcome.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(code)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Appliance Booking - Activity Report - I select \"([^\"]*)\"$")
    public void applianceBookingActivityReportISelect(String text) throws Throwable {
        driver.findElement(By.cssSelector("div.details-card > router-view > view-state > div > div > div > form > div > div:nth-child(8) > div > div.col-xs-10 > div > text-area > textarea")).sendKeys(text);
    }

    @And("^Appliance Booking - Customer Advice - I click \"([^\"]*)\"$")
    public void applianceBookingCustomerAdviceIClick(String button) throws Throwable {

        List<WebElement> advice = driver.findElements(By.cssSelector("div:nth-child(9) > div > div.col-xs-10 > button-list > div > button > span"));

        for(int i=0; i<advice.size(); i++){

            WebElement element = advice.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(button)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(1000);
    }

    @And("^Appliance Booking - Is the job part L/J reportable\\? - I select \"([^\"]*)\"$")
    public void appliance_Booking_Is_the_job_part_L_J_reportable_I_select(String arg1) throws Throwable {
        if (arg1.equals("Yes")) {
            driver.findElement(By.cssSelector("div:nth-child(11) > div > div.col-xs-10 > button-list > div > button:nth-child(1)")).click();
        } else {
            driver.findElement(By.cssSelector("div:nth-child(11) > div > div.col-xs-10 > button-list > div > button:nth-child(2)")).click();
        }
        Thread.sleep(3000);
    }

}
