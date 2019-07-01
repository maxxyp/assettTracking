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
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.ApplianceGasPage;
import pages.ChargesPage;
import pages.CommonPage;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.fail;

public class charges extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }


    @When("^I click on the Charges tab$")
    public void iClickOnTheChargesTab() throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("div > div > tab-buttons > div > div:nth-child(2) > span.au-target.state-border.state-not-visited > button > span"));
        JavascriptExecutor executor = (JavascriptExecutor) driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(5000);
    }

    @And("^I wait for the Charges tab to display \"([^\"]*)\"$")
    public void iWaitForTheChargesTabToDisplay(String expectedText) throws Throwable {

        String actualText = driver.findElement(By.cssSelector("form > div:nth-child(2) > div")).getText();
        System.out.println(actualText);
    }

    @And("^I select the Activity Status to \"([^\"]*)\"$")
    public void iSelectTheActivityStatusTo(String status) throws Throwable {
        WebElement myDynamicElement = (new WebDriverWait(driver, 10))
                .until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div.col-xs-4 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control")));

        WebElement ele = driver.findElement(By.cssSelector("div.col-xs-4 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control"));
        JavascriptExecutor executor = (JavascriptExecutor) driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(1000);

        List<WebElement> activityType = driver.findElements(By.cssSelector("div.au-target.lookup-items.open > div > div"));

        for (int i = 0; i < activityType.size(); i++) {

            WebElement element = activityType.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(status)) {
                element.click();
                break;
            }
            System.out.println("values from drop down is : " + innerhtml);
        }
        Thread.sleep(5000);

    }

    @When("^Activities - I click the first appliance on the list$")
    public void activitiesIClickTheFirstApplianceOnTheList() throws Throwable {
        ChargesPage chargespage = PageFactory.initElements(driver, ChargesPage.class);
        chargespage.click_first_appliance_on_the_list();
    }

    @Then("^I see activity charge price equals £(.*) for Labour$")
    public void iSeeActivityChargePriceEquals£ForLabour(String charge) throws Throwable {
        List<WebElement> price_charge = driver.findElements(By.cssSelector("div:nth-child(1) > div > div:nth-child(2) > div.col-xs-12 > div > div.col-xs-1.details-list-item-col.text-right > span"));

        for (int i = 0; i < price_charge.size(); i++) {

            WebElement element = price_charge.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(charge)) {
                System.out.println(innerhtml);
            } else {
                fail("Expected [ " + charge + " ], is NOT the same as [" + innerhtml + "]");
                break;
            }
        }
        Thread.sleep(1000);
    }


    @And("^I see charge total including VAT equals £(.*)$")
    public void iSeeChargeTotalIncludingVATEquals£(String total) throws Throwable {
        List<WebElement> total_charge = driver.findElements(By.cssSelector("div:nth-child(1) > div > div.row.details-list-item.details-list-item-dark.no-pointer > div.col-xs-1.details-list-item-col.text-right.bold-content.au-target"));

        for (int i = 0; i < total_charge.size(); i++) {

            WebElement element = total_charge.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(total)) {
                System.out.println(innerhtml);
            } else {
                fail("Expected [ " + total + " ], is NOT the same as [" + innerhtml + "]");
                break;
            }
        }
        Thread.sleep(1000);

    }

    @Then("^I verify that the charges mustashe tab is red$")
    public void iVerifyThatTheChargesMustasheTabIsRed() throws Throwable {
        Boolean iselementpresent = driver.findElements(By.cssSelector(".button-list-item.notactive")).size() != 0;
        if (iselementpresent == true) {
            System.out.print("Element Is Present On The Page");
        } else {
            System.out.print("Element NOT Present On The Page");
        }
    }

    @And("^Charges - I click on \"([^\"]*)\"$")
    public void chargesIClickOn(String option) throws Throwable {
        Thread.sleep(2000);
        List<WebElement> choice = driver.findElements(By.cssSelector("div:nth-child(5) > div > div > div.col-xs-11 > button-list > div > button > span"));

        for (int i = 0; i < choice.size(); i++) {

            WebElement element = choice.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(option)) {
                element.click();
                break;
            }
            System.out.println("Charges are : " + innerhtml);
        }
        Thread.sleep(2000);
    }

    @Then("^I verify that the charges mustashe tab is green$")
    public void iVerifyThatTheChargesMustasheTabIsGreen() throws Throwable {
//        driver.findElement(By.cssSelector("tab-buttons > div > div:nth-child(2) > span.au-target.state-border.state-valid")).isEnabled();
        driver.findElement(By.cssSelector(".state-border.state-valid")).isEnabled();
        //.tab-buttons .state-border.state-valid
    }

    @And("^I see a warning marker - Input is Required$")
    public void iSeeAWarningMarkerInputIsRequired() throws Throwable {
        driver.findElement(By.cssSelector("span.requiredFieldMessag.help-block.validation-message.validation-required-marker")).isDisplayed();
    }


    @And("^Remarks - I type in \"([^\"]*)\" in the Remarks textbox$")
    public void remarksITypeInInTheRemarksTextbox(String value) throws Throwable {
        driver.findElement(By.cssSelector("div > div:nth-child(7) > div > div.col-xs-8.details-list-item-col > text-area > textarea")).sendKeys(value);
    }


    @And("^Activity Description - I click the chevron$")
    public void activityDescriptionIClickTheChevron() throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(2) > p > task-description > task-action > catalog-lookup")).click();
    }

    @And("^Select Discount - I select \"([^\"]*)\" from the dropdown$")
    public void selectDiscountISelectFromTheDropdown(String option) throws Throwable {
        driver.findElement(By.cssSelector("div.col-xs-4.details-list-item-col > drop-down > div.au-target.dropdown-container")).click();
        List<WebElement> discount = driver.findElements(By.cssSelector("div.au-target.lookup-items.open > div > div"));

        for (int i = 0; i < discount.size(); i++) {

            WebElement element = discount.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(option)) {
                element.click();
                break;
            }
            System.out.println("Discount is : " + innerhtml);
        }
        Thread.sleep(1000);
    }

    @Then("^I verify that discount \"([^\"]*)\" is shown$")
    public void iVerifyThatDiscountIsShown(String expected) throws Throwable {
        Assert.assertEquals(expected, driver.findElement(By.cssSelector("div:nth-child(2) > div.col-xs-12 > div > div.col-xs-2.details-list-item-col > span")).getText());
    }

    @And("^I verify that the discount amount is \"([^\"]*)\"$")
    public void iVerifyThatTheDiscountAmountIs(String discount_amount) throws Throwable {
        Assert.assertEquals(discount_amount, driver.findElement(By.cssSelector("div:nth-child(2) > div.au-target > div:nth-child(5) > div.col-xs-1.details-list-item-col.text-right > span")).getText());
    }

    @And("^I verify that the total amount is \"([^\"]*)\"$")
    public void iVerifyThatTheTotalAmountIs(String total_amount) throws Throwable {
        Assert.assertEquals(total_amount, driver.findElement(By.cssSelector("div.col-xs-1.details-list-item-col.text-right.bold-content.au-target")).getText());
    }

    @And("^I verify total charge including VAT is \"([^\"]*)\"$")
    public void iVerifyTotalChargeIncludingVATIs(String total_charge) throws Throwable {
        Assert.assertEquals(total_charge, driver.findElement(By.cssSelector("div.col-xs-1.details-list-item-col.text-right.bold-content.au-target")).getText());
    }

    @Then("^I verify the followings activity \"([^\"]*)\" Charge \"([^\"]*)\" and Amount \"([^\"]*)\" is displayed$")
    public void iVerifyTheFollowingsActivityChargeAndAmountIsDisplayed(String activity, String charge, String amount) throws Throwable {
        Assert.assertEquals(activity, driver.findElement(By.cssSelector("div:nth-child(4) > div > div.col-xs-4.details-list-item-col")).getText());
        Assert.assertEquals(charge, driver.findElement(By.cssSelector("div:nth-child(4) > div > div.col-xs-3.details-list-item-col")).getText());
        Assert.assertEquals(amount, driver.findElement(By.cssSelector("div:nth-child(4) > div > div.col-xs-1.details-list-item-col.text-right")).getText());
    }

    @Then("^I verify additional activity \"([^\"]*)\" Charge \"([^\"]*)\" and Amount \"([^\"]*)\" is displayed$")
    public void iVerifyAdditionalActivityChargeAndAmountIsDisplayed(String activity, String charge, String amount) throws Throwable {
        Assert.assertEquals(activity, driver.findElement(By.cssSelector("div:nth-child(5) > div > div.col-xs-4.details-list-item-col")).getText());
        Assert.assertEquals(charge, driver.findElement(By.cssSelector("div:nth-child(5) > div > div.col-xs-3.details-list-item-col")).getText());
        Assert.assertEquals(amount, driver.findElement(By.cssSelector("div:nth-child(5) > div > div.col-xs-1.details-list-item-col.text-right")).getText());
    }

    @Then("^I verify activity description \"([^\"]*)\" Charge \"([^\"]*)\" VAT \"([^\"]*)\" and Amount \"([^\"]*)\" is displayed$")
    public void iVerifyActivityDescriptionChargeVATAndAmountIsDisplayed(String activity, String charge, String vat, String amount) throws Throwable {
        Assert.assertEquals(activity, driver.findElement(By.cssSelector("div.col-xs-12 > div > div:nth-child(2) > p > task-description")).getText());
        Assert.assertEquals(charge, driver.findElement(By.cssSelector("div.col-xs-12 > div > div:nth-child(3)")).getText());
        Assert.assertEquals(vat, driver.findElement(By.cssSelector("div.col-xs-12 > div > div:nth-child(5) > span")).getText());
        Assert.assertEquals(amount, driver.findElement(By.cssSelector("div.col-xs-12 > div > div.col-xs-1.details-list-item-col.text-right > span")).getText());
    }

    @And("^I verify first task description \"([^\"]*)\" Charge \"([^\"]*)\" VAT \"([^\"]*)\" and Amount \"([^\"]*)\"$")
    public void iVerifyFirstTaskDescriptionChargeVATAndAmount(String activity, String charge, String vat, String amount) throws Throwable {
//        ChargesPage chargespage = PageFactory.initElements(driver, ChargesPage.class);
//        chargespage.verify_activity_description(activity);
//        chargespage.verify_charge_description(charge);
//        chargespage.verify_vat_description(vat);
//        chargespage.verify_vat_amount(amount);
//        Thread.sleep(1000);
        Assert.assertEquals(activity, driver.findElement(By.cssSelector("div.col-xs-12 > div > div:nth-child(2) > p > task-description")).getText());
        Assert.assertEquals(charge, driver.findElement(By.cssSelector("div.col-xs-12 > div > div:nth-child(3)")).getText());
        Assert.assertEquals(vat, driver.findElement(By.cssSelector("div.col-xs-12 > div > div:nth-child(5) > span")).getText());
        Assert.assertEquals(amount, driver.findElement(By.cssSelector("div.col-xs-12 > div > div.col-xs-1.details-list-item-col.text-right > span")).getText());
        Thread.sleep(1000);
    }


    @And("^I verify second task description \"([^\"]*)\" Charge \"([^\"]*)\" VAT \"([^\"]*)\" and Amount \"([^\"]*)\"$")
    public void iVerifySecondTaskDescriptionChargeVATAndAmount(String activity, String charge, String vat, String amount) throws Throwable {
        Assert.assertEquals(activity, driver.findElement(By.cssSelector("div:nth-child(3) > div.col-xs-12 > div > div:nth-child(2) > p > task-description")).getText());
        Assert.assertEquals(charge, driver.findElement(By.cssSelector("div:nth-child(3) > div.col-xs-12 > div > div:nth-child(3)")).getText());
        Assert.assertEquals(vat, driver.findElement(By.cssSelector("div:nth-child(3) > div.col-xs-12 > div > div:nth-child(5) > span")).getText());
        Assert.assertEquals(amount, driver.findElement(By.cssSelector("div:nth-child(3) > div.col-xs-12 > div > div.col-xs-1.details-list-item-col.text-right > span")).getText());
    }

    @And("^Parts - I click Parts Basket Tab$")
    public void partsIClickPartsBasketTab() throws Throwable {
        try {
            WebElement ele = driver.findElement(By.cssSelector("view-state > div > div > div:nth-child(2) > span:nth-child(2)"));
            JavascriptExecutor executor = (JavascriptExecutor)driver;
            executor.executeScript("arguments[0].click();", ele);

        } catch (Exception e) {
            WebElement ele = driver.findElement(By.cssSelector("#parts-main > span:nth-child(2)"));
            JavascriptExecutor executor = (JavascriptExecutor)driver;
            executor.executeScript("arguments[0].click();", ele);
        }
        Thread.sleep(4000);

    }

    @And("^Parts Basket - I click Clear Order List$")
    public void partsBasketIClickClearOrderList() throws Throwable {
//        WebDriverWait wait = new WebDriverWait(driver, 30);
//        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div > button.btn.btn.btn-tertiary.arrow-blue-right.au-target")));

        WebElement myDynamicElement = (new WebDriverWait(driver, 30))
                .until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div > button.btn.btn.btn-tertiary.arrow-blue-right.au-target")));


        driver.findElement(By.cssSelector("div > button.btn.btn.btn-tertiary.arrow-blue-right.au-target")).click();
        Thread.sleep(1000);
    }

    @And("^(\\d+) - Gasket - Cover Plate - I checked Van Stock$")
    public void gasketCoverPlateICheckedVanStock(int arg0) throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("form > div.card-block > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(3) > checkbox > button"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(5000);
    }

    @And("^I select \"([^\"]*)\" for Is this part going to be returned as a Warranty claim$")
    public void iSelectForIsThisPartGoingToBeReturnedAsAWarrantyClaim(String option) throws Throwable {

        try {
            List<WebElement> claim = driver.findElements(By.cssSelector("div > button > span"));
            for (int i = 0; i < claim.size(); i++) {

                WebElement element = claim.get(i);
                String innerhtml = element.getAttribute("innerHTML");
                if (innerhtml.contains(option)) {
                    element.click();
                    break;
                }
            }


        } catch (Exception e) {
            driver.findElements(By.xpath("/html/body/div/div[1]/router-view/view-state/div/router-view/view-state/div/div/router-view/view-state/div/div/div[3]/router-view/view-state/div/div/div/form/div[3]/div[2]/div[1]/div/div[3]/div[2]/div/part-warranty/collapsible/div[2]/div/div/div/button-list/div/button[1]/span"));
        }


    }

    @When("^Parts Basket - Second - I select \"([^\"]*)\" for Is this part going to be returned as a Warranty claim$")
    public void parts_Basket_Second_I_select_for_Is_this_part_going_to_be_returned_as_a_Warranty_claim(String option) throws Throwable {
        driver.findElement(By.xpath("/html/body/div/div[1]/router-view/view-state/div/router-view/view-state/div/div/router-view/view-state/div/div/div[3]/router-view/view-state/div/div/div/form/div[2]/div[2]/div[2]/div/div[1]/collapsible/div[2]/div/div/div[2]/button-list/div/button[1]/span")).click();
        Thread.sleep(2000);
    }

    @And("^Parts Basket - I select \"([^\"]*)\" for Is this part going to be returned as a Warranty claim$")
    public void partsBasketISelectForIsThisPartGoingToBeReturnedAsAWarrantyClaim(String option) throws Throwable {

        List<WebElement> claim = driver.findElements(By.cssSelector("collapsible > div.au-target.content > div > div > div.col-xs-6 > button-list > div > button > span"));
        for(int i=0; i<claim.size(); i++){

            WebElement element = claim.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(option)){
                System.out.println(option);
                element.click();
                break;
            }
            System.out.println("Option is : "+innerhtml);
        }
        Thread.sleep(2000);
    }

    @And("^Van Stock - I Increase quantity for part (\\d+) - Gasket - Cover Plate to (\\d+)$")
    public void vanStockIIncreaseQuantityForPartGasketCoverPlateTo(int arg0, int arg1) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(4) > div:nth-child(1) > div.au-target.details-list-item-col.state-invalid > div > div.col-xs-10 > div.col-xs-3 > div > incremental-number-picker > div.each-side-buttons.au-target > div:nth-child(3)")).click();
    }

    @And("^I set Quantity to claim or return to (.*)$")
    public void iSetQuantityToClaimOrReturnTo(String value) throws Throwable {
        driver.findElement(By.cssSelector("incremental-number-picker > div.each-side-buttons.au-target > div:nth-child(2) > number-box > input")).sendKeys(value);
        Thread.sleep(2000);
    }

    @And("^I click the first not used return reason$")
    public void forPartIndexIClickTheFirstWarrantyReturnReason() throws Throwable {

        WebElement firstReasonReturnButton = driver.findElement(By.cssSelector("div:nth-child(2) > div > div.col-xs-8 > button-list > div > button:nth-child(1) > span"));
        firstReasonReturnButton.click();
        Thread.sleep(3000);
    }

    @And("^I click Same ID as Original$")
    public void iClickSameIDAsOriginal() throws Throwable {
        driver.findElement(By.cssSelector("collapsible > div.au-target.content > div:nth-child(3) > div > div:nth-child(3) > button")).click();
        Thread.sleep(3000);
    }

    @And("^I click the Warranty Return chevron$")
    public void iClickTheWarrantyReturnChevron() throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("collapsible > div.header.au-target > span"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(3000);
    }

    @And("^I click the Not used return chevron$")
    public void iClickTheNotUsedReturnChevron() throws Throwable {
        driver.findElement(By.cssSelector("div > div:nth-child(2) > collapsible > div.header.au-target > span")).click();
    }

    @And("^Activities - I select task \"([^\"]*)\"$")
    public void activitiesISelectTask(String value) throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("div > div.au-target.col-xs-3.details-list-item-col.state-not-visited > h4 > span > task-description > div > div > task-action > catalog-lookup"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(5000);
    }

    @And("^I Increase the End Time by approximately (\\d+) minutes$")
    public void
    iIncreaseTheEndTimeByApproximatelyMinutes(int value) throws Throwable {
        for (int i = 0; i < value; i++){
            driver.findElement(By.cssSelector("div:nth-child(4) > time-picker > div.each-side-btns.au-target > div:nth-child(3)")).click();
            Thread.sleep(1000);
        }
    }

    @And("^I ensure the Chargeable Time is within (\\d+) minutes$")
    public void iEnsureTheChargeableTimeIsWithinMinutes(int expectedVal) throws Throwable {
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_activity_btn();
        Thread.sleep(1000);
        driver.findElement(By.cssSelector("h4 > span:nth-child(1) > task-description > task-action > catalog-lookup")).click();
        Thread.sleep(2000);
        String actualValString = driver.findElement(By.cssSelector("div > div.col-xs-7.task-number-box > number-box > input")).getAttribute("value");
        int actualVal = Integer.parseInt(actualValString);
        Assert.assertEquals(expectedVal, actualVal);
    }

    @And("^I also ensure the Job Duration is within (\\d+) minutes$")
    public void iAlsoEnsureTheJobDurationIsWithinMinutes(int expectedVal) throws Throwable {
        String actualValString = driver.findElement(By.cssSelector("div:nth-child(6) > div:nth-child(4) > number-box > input")).getAttribute("value");
        int actualVal = Integer.parseInt(actualValString);
        Assert.assertEquals(expectedVal, actualVal);

    }

    @And("^I Increase the End Time to \"([^\"]*)\" minutes$")
    public void iIncreaseTheEndTimeToMinutes(String time) throws Throwable {
        driver.findElement(By.cssSelector("div > div.col-xs-7.task-number-box > number-box > input")).clear();
        Thread.sleep(1000);
        driver.findElement(By.cssSelector("div > div.col-xs-7.task-number-box > number-box > input")).sendKeys(time);
    }


    @And("^I Increase the Activity Duration for End Times to (\\d+) minutes$")
    public void iIncreaseTheActivityDurationForEndTimesToMinutes(int value) throws Throwable {
        for (int i = 0; i < value; i++) {
            driver.findElement(By.cssSelector("div:nth-child(5) > time-picker2 > div.each-side-btns.au-target > div:nth-child(3) > a")).click();
            Thread.sleep(1000);
        }

    }

    @And("^I click charges ok")
    public void i_click_the_got_it_risks_button() throws Throwable {
//        ChargesPage chargePage = PageFactory.initElements(driver, ChargesPage.class);
//        chargePage.click_charge_ok();
//        Thread.sleep(3000);

        WebElement ele = driver.findElement(By.cssSelector(".col-xs-11 .au-target:nth-child(1) > span"));
        JavascriptExecutor executor = (JavascriptExecutor) driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(3000);
    }

    @When("^Reason for claim - I type \"([^\"]*)\"$")
    public void reason_for_claim_I_type(String text) throws Throwable {
        driver.findElement(By.cssSelector("div > div > router-view > view-state > div > div > div.details-card > router-view > view-state > div > div > div > form > div:nth-child(2) > div.au-target.details-list-item-col.todays-parts-not-last-item.state-invalid > div:nth-child(3) > div > div:nth-child(1) > collapsible > div.au-target.content > div:nth-child(4) > div > div.col-xs-6 > text-area > textarea")).sendKeys(text);
    }

    @When("^I click the (\\d+) index Warranty Return chevron$")
    public void i_click_the_index_Warranty_Return_chevron(int arg1) throws Throwable {

        String css ="view-state > div > div > router-view > view-state > div > div > div.details-card > router-view > view-state > div > div > div > form > div:nth-child(2) > div.au-target.details-list-item-col.state-invalid > div:nth-child(3) > div > div:nth-child(1) > collapsible > div.header.au-target > div > i";

        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(css)));

        driver.findElement(By.cssSelector(css)).click();
        Thread.sleep(2000);
    }


    @When("^Second Index - I click Yes for warranty$")
    public void second_Index_I_click_yes_for_warranty() throws Throwable {
        driver.findElement(By.cssSelector("div.au-target.details-list-item-col.state-invalid > div:nth-child(3) > div > div:nth-child(1) > collapsible > div.au-target.content > div > div > div.col-xs-6 > button-list > div > button:nth-child(2) > span")).click();
        Thread.sleep(1000);
    }

    @When("^Second Index - I click Same ID as Original$")
    public void second_Index_I_click_Same_ID_as_Original() throws Throwable {

        driver.findElement(By.cssSelector("div.au-target.details-list-item-col.state-invalid > div:nth-child(3) > div > div:nth-child(1) > collapsible > div.au-target.content > div:nth-child(3) > div > div:nth-child(3) > button")).click();
        Thread.sleep(1000);
    }

    @When("^Second Index - Reason for claim - I type \"([^\"]*)\"$")
    public void second_Index_Reason_for_claim_I_type(String text) throws Throwable {
        driver.findElement(By.cssSelector("div > router-view > view-state > div > div > router-view > view-state > div > div > div.details-card > router-view > view-state > div > div > div > form > div:nth-child(2) > div.au-target.details-list-item-col.state-invalid > div:nth-child(3) > div > div:nth-child(1) > collapsible > div.au-target.content > div:nth-child(4) > div > div.col-xs-6 > text-area > textarea")).sendKeys(text);
        Thread.sleep(2000);
    }

    @When("I click I Understand. Click to continue")
    public void clearChargesWarningMessage() throws Throwable {

        String buttonXpath = "//button[contains(text(),'I understand. Click to continue....')]";

        try {
            WebDriverWait wait = new WebDriverWait(driver, 5);
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(buttonXpath)));

            List<WebElement> findButtons = driver.findElements(By.xpath(buttonXpath));

            if (findButtons.size() > 0) {
                findButtons.get(0).click();
            }
        } catch (Exception ex) {
            System.out.println(ex);
        }
        Thread.sleep(3000);
    }

    @When("^(\\d+) Index - I click \"([^\"]*)\" for warranty$")
    public void index_I_click_yes_for_warranty(int index, String option) throws Throwable {

        String cssChevron = String.format("body > div > div.main-container.full-screen > router-view > view-state > div > router-view > view-state > div > div > router-view > view-state > div > div > div.details-card > router-view > view-state > div > div > div > form > div:nth-child(2) > div:nth-child(%s) > div:nth-child(3) > div > div:nth-child(1) > collapsible > div.header.au-target > div > i", index);

        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(cssChevron)));

        WebElement chevron = driver.findElement(By.cssSelector(cssChevron));
        chevron.click();

        String buttonIndex = "1";

        if (option.equals("Yes")) {
            buttonIndex = "2";
        }

        String cssButton = String.format("body > div > div.main-container.full-screen > router-view > view-state > div > router-view > view-state > div > div > router-view > view-state > div > div > div.details-card > router-view > view-state > div > div > div > form > div:nth-child(2) > div:nth-child(%s) > div:nth-child(3) > div > div:nth-child(1) > collapsible > div.au-target.content > div > div > div.col-xs-6 > button-list > div > button:nth-child(%s) > span", index, buttonIndex);

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(cssButton)));

        WebElement button = driver.findElement(By.cssSelector(cssButton));

        button.click();
    }

    @And("^Parts Basket - I click Quick Add$")
    public void partsBasketIClickQuickAdd() throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("div > material-search-summary > div > div:nth-child(1) > div.col-xs-4 > button"));
        //div > div:nth-child(5) > div:nth-child(1) > div > material-search-summary > div > div:nth-child(1) > div.col-xs-4 > button
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(3000);

    }
}

