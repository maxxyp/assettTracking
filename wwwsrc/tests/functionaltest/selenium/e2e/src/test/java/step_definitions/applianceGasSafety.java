package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.ApplianceDetailsPage;
import pages.ApplianceGasPage;
import pages.CommonPage;

import java.io.IOException;
import java.util.List;

public class applianceGasSafety extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^I click Gas Safety button$")
    public void iClickGasSafetyButton() throws Throwable {
        try {
            driver.findElement(By.cssSelector("view-state > div > div > div:nth-child(1) > div:nth-child(4) > span:nth-child(3)")).click();
        } catch (Exception e) {
            WebElement element = driver.findElement(By.xpath("//*[@id=\'appliance-child-tabs\']/span[3]"));
            Actions actions = new Actions(driver);
            actions.moveToElement(element);
            actions.perform();
            ApplianceGasPage applianceGasPage = PageFactory.initElements(driver, ApplianceGasPage.class);
            applianceGasPage.click_gas_safety();
        }
        Thread.sleep(3000);
    }

    @And("^Gas Safety - Did you work on the appliance - I click No$")
    public void gasSafetyDidYouWorkOnTheApplianceIClickNo() throws Throwable {
        ApplianceGasPage applianceGasPage = PageFactory.initElements(driver, ApplianceGasPage.class);
        applianceGasPage.click_work_on_appliance_no();
        Thread.sleep(2000);
    }

    @And("^Gas Safety - Did you visually check - I click Yes$")
    public void gasSafetyDidYouVisuallyCheckIClickYes() throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("form > div:nth-child(2) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(1000);
    }

    @And("^Gas Safety - Is appliance Safe - I click Yes$")
    public void gasSafetyIsApplianceSafeIClickYes() throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("form > div:nth-child(3) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(1000);
    }


    @And("^Gas Safety - Safety - Is appliance Safe - I click Yes$")
    public void gasSafetySafetyIsApplianceSafeIClickYes() throws Throwable {
        driver.findElement(By.cssSelector("form > div:nth-child(8) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span")).click();
    }

    @And("^Gas Safety - To current standards - I click NA$")
    public void gasSafetyToCurrentStandardsIClickNA() throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("form > div:nth-child(4) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
//        Thread.sleep(5000);
        Thread.sleep(3000);
    }

    @And("^Gas Safety - Safety - To current standards - I click NA$")
    public void gasSafetySafetyToCurrentStandardsIClickNA() throws Throwable {
        driver.findElement(By.cssSelector("form > div:nth-child(9) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span")).click();
    }

    @Then("^I verify that Appliance Gas Safety form has \"([^\"]*)\" value$")
    public void iVerifyThatApplianceGasSafetyFormHasValue(String arg0) throws Throwable {
        Assert.assertTrue(driver.findElement(By.cssSelector("form.au-target.validation-state-indicator.state-valid")).isDisplayed());
    }

    @And("^Gas Safety - Did you work on the appliance - I click yes$")
    public void gasSafetyDidYouWorkOnTheApplianceIClickYes() throws Throwable {
        driver.findElement(By.cssSelector("div.col-xs-8 > button-list > div > button:nth-child(2) > span")).click();
    }

    @And("^Gas Safety - Performance test not carried out why - Installation not available$")
    public void gasSafetyPerformanceTestNotCarriedOutWhyInstallationNotAvailable() throws Throwable {
        driver.findElement(By.cssSelector("form > div:nth-child(2) > div > div.col-xs-8 > button-list > div > button:nth-child(1) > span")).click();
    }

    @And("^Gas Safety - Whats the appliance tightness OK - I click \"([^\"]*)\"$")
    public void gasSafetyWhatsTheApplianceTightnessOKIClick(String tightness) throws Throwable {
        List<WebElement> applianceOK = driver.findElements(By.cssSelector("div:nth-child(4) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span"));

        for(int i=0; i<applianceOK.size(); i++){

            WebElement element = applianceOK.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(tightness)){
                element.click();
                break;
            }
        }
    }

    @And("^Gas Safety - Chimney installation and applicable test okay - I click \"([^\"]*)\"$")
    public void gasSafetyChimneyInstallationAndApplicableTestOkayIClick(String applicable) throws Throwable {
        List<WebElement> chimney_installation = driver.findElements(By.cssSelector("div:nth-child(5) > div > div.col-xs-8 > button-list > div > button:nth-child(2)"));

        for(int i=0; i<chimney_installation.size(); i++){

            WebElement element = chimney_installation.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(applicable)){
                element.click();
                break;
            }
        }
    }

    @And("^Gas Safety - Vent size and configuration okay - I click \"([^\"]*)\"$")
    public void gasSafetyVentSizeAndConfigurationOkayIClick(String configuration) throws Throwable {
        List<WebElement> vent_size = driver.findElements(By.cssSelector("div:nth-child(6) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span"));

        for(int i=0; i<vent_size.size(); i++){

            WebElement element = vent_size.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(configuration)){
                element.click();
                break;
            }
        }
    }

    @And("^Gas Safety - Safety device correction operation - I select yes$")
    public void gasSafetySafetyDeviceCorrectionOperationISelectYes() throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(7) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span")).click();
    }

    @And("^Gas Safety - Safety device correction operation - I click \"([^\"]*)\"$")
    public void gasSafetySafetyDeviceCorrectionOperationIClick(String operation) throws Throwable {
        List<WebElement> safety_device = driver.findElements(By.cssSelector("div:nth-child(7) > div > div.col-xs-8 > button-list > div > button > span"));

        for(int i=0; i<safety_device.size(); i++){

            WebElement element = safety_device.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(operation)){
                element.click();
                break;
            }
        }
    }


    @And("^Gas Safety - Is appliance to current standard - I click yes$")
    public void gasSafetyIsApplianceToCurrentStandardIClickYes() throws Throwable {
        driver.findElement(By.cssSelector("form > div:nth-child(5) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span")).click();
    }

    @And("^Gas Safety - Whats the appliance stripped and cleaned in accordance with TOPs - I click \"([^\"]*)\"$")
    public void gasSafetyWhatsTheApplianceStrippedAndCleanedInAccordanceWithTOPsIClick(String no) throws Throwable {

        List<WebElement> cleaned = driver.findElements(By.cssSelector("form > div:nth-child(3) > div > div.col-xs-8 > button-list > div > button > span"));

        for(int i=0; i<cleaned.size(); i++){

            WebElement element = cleaned.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(no)){
                element.click();
                break;
            }
        }
        Thread.sleep(7000);
    }


    @And("^Gas Safety - Unsafety situation - I enter report \"([^\"]*)\" details$")
    public void gasSafetyUnsafetySituationIEnterReportDetails(String report) throws Throwable {
        driver.findElement(By.cssSelector("form > div.card.details-card > div.card-block > div:nth-child(2) > div > div.col-xs-8 > text-area > textarea")).sendKeys(report);
    }

    @And("^Gas Safety - Unsafety situation - I click \"([^\"]*)\" Condition as Left$")
    public void gasSafetyUnsafetySituationIClickConditionAsLeft(String left) throws Throwable {
        List<WebElement> condition = driver.findElements(By.cssSelector("form > div.card.details-card > div.card-block > div:nth-child(3) > div > div.col-xs-8 > button-list > div > button > span"));

        for(int i=0; i<condition.size(); i++){

            WebElement element = condition.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains("IMMEDIATELY DANGEROUS")){
                element.click();
                break;
            }
        }
        Thread.sleep(2000);
    }

    @And("^Gas Safety - Unsafety situation - I click \"([^\"]*)\" Capped Turn Off$")
    public void gasSafetyUnsafetySituationIClickCappedTurnOff(String turnoff) throws Throwable {
        List<WebElement> capped = driver.findElements(By.cssSelector("form > div.card.details-card > div.card-block > div:nth-child(4) > div > div.col-xs-8 > button-list > div > button > span"));

        for(int i=0; i<capped.size(); i++){

            WebElement element = capped.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(turnoff)){
                element.click();
                break;
            }
        }
        Thread.sleep(2000);
    }

    @And("^Gas Safety - Unsafety situation - I click \"([^\"]*)\" Label Attached or Removed$")
    public void gasSafetyUnsafetySituationIClickLabelAttachedOrRemoved(String attached) throws Throwable {
        List<WebElement> label = driver.findElements(By.cssSelector("div:nth-child(5) > div > div.col-xs-8 > button-list > div > button:nth-child(1) > span"));

        for(int i=0; i<label.size(); i++){

            WebElement element = label.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(attached)){
                element.click();
                break;
            }
        }
    }

    @And("^Gas Safety - Unsafety situation - I click \"([^\"]*)\" Owned by Customer$")
    public void gasSafetyUnsafetySituationIClickOwnedByCustomer(String owned) throws Throwable {

        List<WebElement> customer = driver.findElements(By.cssSelector("form > div.card.details-card > div.card-block > div:nth-child(6) > div > div.col-xs-8 > button-list > div > button > span"));

        for(int i=0; i<customer.size(); i++){

            WebElement element = customer.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(owned)){
                element.click();
                break;
            }
        }
    }

    @And("^Gas Safety - Unsafety situation - I click \"([^\"]*)\" Letter Left$")
    public void gasSafetyUnsafetySituationIClickLetterLeft(String situatn) throws Throwable {
        List<WebElement> unsafe = driver.findElements(By.cssSelector("form > div.card.details-card > div.card-block > div:nth-child(7) > div > div.col-xs-8 > button-list > div > button > span"));

        for(int i=0; i<unsafe.size(); i++){

            WebElement element = unsafe.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(situatn)){
                element.click();
                break;
            }
        }
    }

    @And("^Gas Safety - Unsafety situation - I click \"([^\"]*)\" Signature Obtained$")
    public void gasSafetyUnsafetySituationIClickSignatureObtained(String obtain) throws Throwable {
        List<WebElement> signature = driver.findElements(By.cssSelector("form > div.card.details-card > div.card-block > div:nth-child(8) > div > div.col-xs-8 > button-list > div > button > span"));

        for(int i=0; i<signature.size(); i++){

            WebElement element = signature.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(obtain)){
                element.click();
                break;
            }
        }
    }

    @And("^I verify that form has \"([^\"]*)\" value$")
    public void iVerifyThatFormHasValue(String arg0) throws Throwable {
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.verify_state_is_valid();
        Thread.sleep(1000);
    }

    @Then("^I verify that form has invalid indicator \"([^\"]*)\" value$")
    public void iVerifyThatFormHasInvalidIndicatorValue(String arg0) throws Throwable {
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.verify_invalid_indicator();
        Thread.sleep(1000);
    }

    @And("^I click Other Safety button$")
    public void iClickOtherSafetyButton() throws Throwable {
        ApplianceGasPage applianceGasPage = PageFactory.initElements(driver, ApplianceGasPage.class);
        applianceGasPage.click_other_safety();
        Thread.sleep(2000);
    }

    @And("^Gas Safety - Safety - Is appliance Safe - I click \"([^\"]*)\"$")
    public void gasSafetySafetyIsApplianceSafeIClick(String safe) throws Throwable {
        List<WebElement> appliance_safe = driver.findElements(By.cssSelector("div:nth-child(3) > div > div.col-xs-8 > button-list > div > button:nth-child(2)"));

        for(int i=0; i<appliance_safe.size(); i++){

            WebElement element = appliance_safe.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(safe)){
                element.click();
                break;
            }
        }
        Thread.sleep(1000);
    }

    @And("^Gas Safety - To current standards - I click \"([^\"]*)\"$")
    public void gasSafetyToCurrentStandardsIClick(String standards) throws Throwable {
        List<WebElement> current_standards = driver.findElements(By.cssSelector("div:nth-child(4) > div > div.col-xs-8 > button-list > div > button.au-target.btn.btn-primary.form-control.notactive.button-list-item > span"));
        for(int i=0; i<current_standards.size(); i++){

            WebElement element = current_standards.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(standards)){
                element.click();
                break;
            }
        }
        Thread.sleep(5000);
    }
}

