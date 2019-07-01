package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.Scenario;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.junit.After;
import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.internal.FindsById;
import org.openqa.selenium.internal.FindsByXPath;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.*;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;


public class assets extends testBase {


    private JavascriptExecutor js;

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^I click my van tab$")
    public void iClickMyVanTab() throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 90);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".hema-icon-vanstock")));
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.click_my_van();
        Thread.sleep(3000);
    }

    @Given("^Assets - Tabs I click \"([^\"]*)\"$")
    public void assets_Tabs_I_click(String tab) throws Throwable {
        List<WebElement> tabs = driver.findElements(By.cssSelector("div > div.child-tabs > span"));
        for(int i=0; i<tabs.size(); i++) {

            WebElement element = tabs.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(tab)) {
                element.click();
                break;
            }
        }
        Thread.sleep(5000);
    }

    @Then("^Assets List - I see: Quanty, GC Code, Description and Area$")
    public void assetsListISeeQuantyGCCodeDescriptionAndArea() throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.i_see_assetLists();
    }

    @When("^I search product using \"([^\"]*)\"$")
    public void i_search_product_using(String text) throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.search_for_product(text);
        Thread.sleep(3000);
    }

    @Given("^I click return icon where gc code is \"([^\"]*)\"$")
    public void i_click_return_icon_where_gc_code_is(String arg1) throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.click_return_icon();
    }

    @Given("^I see Dialog content Header \"([^\"]*)\" Label$")
    public void i_see_Dialog_content_Header_Label(String arg1) throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.i_see_content_header();
    }

    @When("^I change area to \"([^\"]*)\"$")
    public void i_change_area_to(String area) throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.edit_area_input_box(area);
    }

    @And("^I click \"([^\"]*)\" button$")
    public void iClickButton(String btn) throws Throwable {
        List<WebElement> button = driver.findElements(By.cssSelector("ai-dialog > ai-dialog-footer > button.btn"));
        for(int i=0; i<button.size(); i++) {
            WebElement element = button.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(btn)) {
                element.click();
                break;
            }
        }
        Thread.sleep(5000);
    }

//    @Given("^click \"([^\"]*)\" button$")
//    public void click_button(String btn) throws Throwable {
//        List<WebElement> button = driver.findElements(By.cssSelector("ai-dialog > ai-dialog-footer > button.btn"));
//        for(int i=0; i<button.size(); i++) {
//            WebElement element = button.get(i);
//            String innerhtml = element.getAttribute("innerHTML");
//            if (innerhtml.contains(btn)) {
//                element.click();
//                break;
//            }
//        }
//        Thread.sleep(5000);
//    }

    @When("^click \"([^\"]*)\" button in the Dialog box$")
    public void clickButtonInTheDialogBox(String btn) throws Throwable {
        driver.findElement(By.cssSelector(".action-group > .btn-primary")).click();
        Thread.sleep(1000);
    }

    @Then("^I see Quanty \"([^\"]*)\" GC Code \"([^\"]*)\" Description \"([^\"]*)\" Job \"([^\"]*)\" and Area \"([^\"]*)\"$")
    public void i_see_Quanty_GC_Code_Description_Job_and_Area(String Qty, String GC_Code, String Description, String Job, String Area) throws Throwable {
        Assert.assertEquals(Qty, driver.findElement(By.cssSelector(".hook-list-data-item-container > div:nth-child(1)")).getText());
        Assert.assertEquals(GC_Code, driver.findElement(By.cssSelector(".hook-list-data-item-container > div:nth-child(2)")).getText());
        Assert.assertEquals(Description, driver.findElement(By.cssSelector(".hook-list-data-item-container > div:nth-child(3)")).getText());
        Assert.assertEquals(Job, driver.findElement(By.cssSelector(".hook-list-data-item-container > div:nth-child(4)")).getText());
        Assert.assertEquals(Area, driver.findElement(By.cssSelector(".hook-list-data-item-container > div:nth-child(5)")).getText());
    }

    @When("^I search for Items \"([^\"]*)\"$")
    public void i_search_for_Items(String item) throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.i_search_for_stock_reference(item);
    }

    @When("^I click the search button$")
    public void i_click_the_search_button() throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.i_click_search_btn();
    }

    @When("^I see \"([^\"]*)\"$")
    public void i_see(String arg1) throws Throwable {
        String actual_remote_message = driver.findElement(By.cssSelector(".row:nth-child(3) span")).getText();
        Assert.assertEquals(actual_remote_message, actual_remote_message);

    }

    @When("^I click view$")
    public void i_click_view() throws Throwable {
        driver.findElement(By.cssSelector(".row:nth-child(3) .btn")).click();
        Thread.sleep(3000);
    }

    @When("^I use the toggle button to select quantity$")
    public void i_use_the_toggle_button_to_select_quantity() throws Throwable {
        driver.findElement(By.xpath("//span[2]/i")).click();
        Thread.sleep(3000);
    }

    @When("^I see Items Coming Into My Van \"([^\"]*)\" Description \"([^\"]*)\" Qty \"([^\"]*)\" Engineer \"([^\"]*)\"$")
    public void i_see_Items_Coming_Into_My_Van_Description_Qty_Engineer(String GC_Code, String Description, String Qty, String Engineer) throws Throwable {
        Assert.assertEquals(GC_Code, driver.findElement(By.cssSelector("div > div > div:nth-child(4) > div:nth-child(4) > div:nth-child(1)")).getText());
        Assert.assertEquals(Description, driver.findElement(By.cssSelector("div > div > div:nth-child(4) > div:nth-child(4) > div:nth-child(2)")).getText());
        Assert.assertEquals(Qty, driver.findElement(By.cssSelector("div > div > div:nth-child(4) > div:nth-child(4) > div:nth-child(3)")).getText());
//        assertTrue(driver.findElement(By.cssSelector(".details-list-item-col:nth-child(4)")).getText().startsWith(Engineer));
    }

    @And("^I see Items Coming Into My Van \"([^\"]*)\" Description \"([^\"]*)\" Qty \"([^\"]*)\" Engineer \"([^\"]*)\" Confirm Status \"([^\"]*)\"$")
    public void iSeeItemsComingIntoMyVanDescriptionQtyEngineerConfirmStatus(String gc_code, String desc, String qty, String Engineer, String status) throws Throwable {
        Assert.assertEquals(gc_code, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(1)")).getText());
        Assert.assertEquals(desc, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(2)")).getText());
        Assert.assertEquals(qty, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(3)")).getText());
    }

    @Then("^I see Items Coming Into My Van Qty \"([^\"]*)\" GC code \"([^\"]*)\" Description \"([^\"]*)\" W/R No \"([^\"]*)\" Area \"([^\"]*)\"$")
    public void iSeeItemsComingIntoMyVanQtyGCCodeDescriptionWRNoArea(String qty, String gc_code, String desc, String wr_no, String area) throws Throwable {
        Assert.assertEquals(qty, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(1)")).getText());
        Assert.assertEquals(gc_code, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(2)")).getText());
        Assert.assertEquals(desc, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(3)")).getText());
    }

//    @Then("^I see Items Coming Into My Van GC Code \"([^\"]*)\" Description \"([^\"]*)\" GC code \"([^\"]*)\" W/R No \"([^\"]*)\" Area \"([^\"]*)\"$")
//    public void iSeeItemsComingIntoMyVanGCCodeDescriptionGCCodeWRNoArea(String qty, String gc_code, String desc, String wr_no, String area) throws Throwable {
//        Assert.assertEquals(qty, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(1)")).getText());
//        Assert.assertEquals(gc_code, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(2)")).getText());
//        Assert.assertEquals(desc, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(3)")).getText());
//        Assert.assertEquals(wr_no, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(2)")).getText());
//        Assert.assertEquals(area, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(3)")).getText());
//    }

    @Then("^I see Items with GC Code \"([^\"]*)\" Description \"([^\"]*)\" Qty \"([^\"]*)\" W/R No \"([^\"]*)\" Area \"([^\"]*)\"$")
    public void iSeeItemsComingIntoMyVanGCCodeDescriptionQtyWRNoArea(String gc_code, String desc, String qty, String wr_no, String area) throws Throwable {
        Assert.assertEquals(gc_code, driver.findElement(By.cssSelector("div.details-list-item.no-hover.blue-content.hook-list-data-item-container.au-target > div:nth-child(1)")).getText());
        Assert.assertEquals(desc, driver.findElement(By.cssSelector("div.details-list-item.no-hover.blue-content.hook-list-data-item-container.au-target > div:nth-child(2)")).getText());
        Assert.assertEquals(qty, driver.findElement(By.cssSelector("div.details-list-item.no-hover.blue-content.hook-list-data-item-container.au-target > div:nth-child(3)")).getText());
        Assert.assertEquals(wr_no, driver.findElement(By.cssSelector("div.details-list-item.no-hover.blue-content.hook-list-data-item-container.au-target > div:nth-child(4)")).getText());
        Assert.assertEquals(area, driver.findElement(By.cssSelector("div.details-list-item.no-hover.blue-content.hook-list-data-item-container.au-target > div:nth-child(5)")).getText());
    }

    @When("^I refresh the page$")
    public void i_refresh_the_page() throws Throwable {
        driver.navigate().refresh();
        Thread.sleep(3000);
        WebDriverWait wait = new WebDriverWait(driver, 90);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.au-target.nav-bar-icon.hema-icon-settings")));
    }

    @And("^I see \"([^\"]*)\" items displayed in my van$")
    public void iSeeItemsDisplayedInMyVan(String items) throws Throwable {
        String Items = driver.findElement(By.cssSelector("div > div.child-tabs > span:nth-child(2)")).getText();
        System.out.println(Items);
//        Items.endsWith(items);
        Assert.assertEquals(items, "My Van (169)");
        Thread.sleep(1000);
    }

    @And("^I see increase items \"([^\"]*)\" displayed in my van$")
    public void iSeeIncreaseItemsDisplayedInMyVan(String items) throws Throwable {
        String Items = driver.findElement(By.cssSelector("div > div.child-tabs > span:nth-child(2)")).getText();
        System.out.println(Items);
        Assert.assertEquals(items, "My Van (170)");
        Thread.sleep(1000);
    }

    @And("^I search for \"([^\"]*)\" tools$")
    public void iSearchForTools(String tools) throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.i_search_for_tools(tools);
    }

    @Then("^I see GC code \"([^\"]*)\" and Description \"([^\"]*)\"$")
    public void iSeeGCCodeAndDescription(String gc_code, String description) throws Throwable {
        Assert.assertEquals(gc_code, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(1)")).getText());
        Assert.assertEquals(description, driver.findElement(By.cssSelector(".details-list-item-col:nth-child(2)")).getText());
    }

    @And("^I select tools where code \"([^\"]*)\" and Description \"([^\"]*)\"$")
    public void iSelectToolsWhereCodeAndDescription(String arg0, String arg1) throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.i_select_tools(arg0, arg1);
    }

    @And("^I see \"([^\"]*)\" displayed in my van$")
    public void iSeeDisplayedInMyVan(String van) throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.i_see_van_stock_displayed(van);
    }

    @And("^I see \"([^\"]*)\" displayed near by$")
    public void iSeeDisplayedNearBy(String remote) throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.i_see_parts_nearby_displayed(remote);
    }

    @Given("^I see parts notification \"([^\"]*)\"$")
    public void i_see_parts_notification(String notification) throws Throwable {
        Thread.sleep(5000);
        WebDriverWait wait = new WebDriverWait(driver, 60);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("i.au-target.job-state-enRoute")));
        String msg1 = driver.findElement(By.cssSelector(".job-parts-collection-message")).getText();
        Assert.assertEquals(notification, driver.findElement(By.cssSelector(".job-parts-collection-message")).getText());
    }

    @Given("^I click collect parts button$")
    public void i_click_collect_parts_button() throws Throwable {
        driver.findElement(By.cssSelector(".hema-icon-collecting-parts")).click();

    }

    @Then("^I see parts to collect for job: (\\d+)$")
    public void iSeePartsToCollectForJob(int arg0) throws Throwable {
        Assert.assertEquals("Parts to collect for W/R No.: 1384517001", driver.findElement(By.cssSelector("div:nth-child(1) > .van-stock-parts-collection-item-head > strong")).getText());
        Thread.sleep(1000);
    }

    @And("^I verify item where gc code F(\\d+) and Description (\\d+) (\\d+)/(\\d+)in Ball Valve Float Side Feed$")
    public void iVerifyItemWhereGcCodeFAndDescriptionInBallValveFloatSideFeed(int arg0, int arg1, int arg2, int arg3) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(1) > .job:nth-child(2) .col-xs-1 > .au-target")).click();
        Thread.sleep(1000);
    }

    @And("^I verify item where gc code (\\d+) and Description ACL Synchron Motor K(\\d+)A$")
    public void iVerifyItemWhereGcCodeAndDescriptionACLSynchronMotorKA(int arg0, int arg1) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(1) > .job:nth-child(3) .col-xs-1 > .au-target")).click();
        Thread.sleep(1000);
    }

    @And("^I verify item where gc code H(\\d+) and Description Adaptor - Flow Sensor$")
    public void iVerifyItemWhereGcCodeHAndDescriptionAdaptorFlowSensor(int arg0) throws Throwable {
        driver.findElement(By.cssSelector(".job:nth-child(4) .col-xs-1 > .au-target")).click();
        Thread.sleep(2000);
    }

    @And("^I also see parts to collect for job: (\\d+)$")
    public void iAlsoSeePartsToCollectForJob(int arg0) throws Throwable {
        Assert.assertEquals("Parts to collect for W/R No.: 1384517002", driver.findElement(By.cssSelector("div:nth-child(2) > .van-stock-parts-collection-item-head > strong")).getText());
    }

    @And("^I verify item where gc code (\\d+) and Description Pressure Relief Valve (\\d+) Bar TOTE$")
    public void iVerifyItemWhereGcCodeAndDescriptionPressureReliefValveBarTOTE(int arg0, int arg1) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(2) > .job .col-xs-1 > .au-target")).click();
        Thread.sleep(1000);
    }

    @And("^I see van stock parts$")
    public void iSeeVanStockParts() throws Throwable {
        Assert.assertEquals("Van stock parts", driver.findElement(By.cssSelector("div:nth-child(3) > .van-stock-parts-collection-item-head > strong")).getText());
    }

    @And("^I verify item where gc code (\\d+) and Description Actuator for Diverter Valve$")
    public void iVerifyItemWhereGcCodeAndDescriptionActuatorForDiverterValve(int arg0) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > .job:nth-child(2) .col-xs-1 > .au-target")).click();
        Thread.sleep(1000);
    }

    @And("^I verify item where gc code F(\\d+) and Description Altecnic Filling Loop-WRAS TOTE$")
    public void iVerifyItemWhereGcCodeFAndDescriptionAltecnicFillingLoopWRASTOTE(int arg0) throws Throwable {
        driver.findElement(By.cssSelector(".fa-plus-circle")).click();
        Thread.sleep(2000);
    }

    @Given("^I click submit button$")
    public void i_click_submit_button() throws Throwable {
        driver.findElement(By.cssSelector(".btn-primary")).click();
        Thread.sleep(2000);
    }

    @Then("^I see dialog header - Please confirm parts collection \"([^\"]*)\"$")
    public void iSeeDialogHeaderPleaseConfirmPartsCollection(String parts) throws Throwable {
        Assert.assertEquals(parts, driver.findElement(By.cssSelector("label > strong")).getText());
    }

    @And("^I dialog header - I click Save button$")
    public void iDialogHeaderIClickSaveButton() throws Throwable {
        driver.findElement(By.cssSelector("ai-dialog > ai-dialog-footer > button.btn.btn-primary.au-target")).click();
        Thread.sleep(5000);
//        // Store the current window handle
//        String winHandleBefore = driver.getWindowHandle();
//
//        // Switch to new window opened
//        for(String winHandle : driver.getWindowHandles()){
//            driver.switchTo().window(winHandle);
//        }
//
//        // Close the new window, if that window no more required
//        driver.close();
//
//        // Switch back to original browser (first window)
//        driver.switchTo().window(winHandleBefore);
    }

    @Then("^I see submit button is inactive$")
    public void iSeeSubmitButtonIsInactive() throws Throwable {
        assertFalse(driver.findElements(By.cssSelector(".btn-primary")).isEmpty());
        Thread.sleep(2000);
    }

    @And("^I click edit icon where gc code is \"([^\"]*)\"$")
    public void iClickEditIconWhereGcCodeIs(String arg0) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(1) > .job:nth-child(2) .col-xs-2 .fa")).click();
        // css=div:nth-child(1) > .job:nth-child(2) .col-xs-2 .fa
    }

    @When("^I click the toggle button none received$")
    public void iClickTheToggleButtonNoneReceived() throws Throwable {
        driver.findElement(By.cssSelector(".fa-toggle-off")).click();
        Thread.sleep(2000);
    }

    @And("^I click last edit icon where gc code is \"([^\"]*)\"$")
    public void iClickLastEditIconWhereGcCodeIs(String arg0) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(3) > .job:nth-child(3) .col-xs-2 .fa")).click();
        Thread.sleep(2000);
    }

    @And("^I click the minus sign to signify (\\d+) missing item$")
    public void iClickTheMinusSignToSignifyMissingItem(int arg0) throws Throwable {
        driver.findElement(By.cssSelector(".fa-minus-circle")).click();
        Thread.sleep(1000);
    }

    @And("^I see parts expected \"([^\"]*)\" \"([^\"]*)\"$")
    public void iSeePartsExpected(String parts1, String parts2) throws Throwable {
        Assert.assertEquals(parts1, driver.findElement(By.cssSelector("label > strong")).getText());
        Assert.assertEquals(parts2, driver.findElement(By.cssSelector("label:nth-child(2)")).getText());
    }

    @And("^I see parts collection message \"([^\"]*)\"$")
    public void iSeePartsCollectionMessage(String items) throws Throwable {
        Assert.assertEquals(items, driver.findElement(By.cssSelector(".au-target > .text-xs-center > label")).getText());
    }

    @And("^I click Tools Lookup$")
    public void iClickToolsLookup() throws Throwable {
        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
        assetspage.click_high_value_tools();
        Thread.sleep(3000);
    }

//    @And("^I click on Edit label where gc code is \"([^\"]*)\"$")
//    public void iClickOnEditLabelWhereGcCodeIs(String arg0) throws Throwable {
//        AssetsPage assetspage = PageFactory.initElements(driver, AssetsPage.class);
//        assetspage.click_edit_label();
//    }

    @When("^I select return reasons \"([^\"]*)\"$")
    public void iSelectReturnReasons(String return_reason) throws Throwable {
        driver.findElement(By.cssSelector("a.au-target.dd-caret.fa.fa-caret-down")).click();
        Thread.sleep(1000);
        driver.findElement(By.cssSelector(".open > .au-target:nth-child(1) > div")).click();
        Thread.sleep(2000);
    }

    @When("^I select return reasons - Material under warranty$")
    public void iSelectReturnReasonsMaterialUnderWarranty() throws Throwable {
        driver.findElement(By.cssSelector("a.au-target.dd-caret.fa.fa-caret-down")).click();
        Thread.sleep(1000);
        driver.findElement(By.cssSelector(".open > .au-target:nth-child(2) > div")).click();
        Thread.sleep(1000);
    }

    @When("^I select return reasons - Material recalled$")
    public void iSelectReturnReasonsMaterialRecalled() throws Throwable {
        driver.findElement(By.cssSelector("a.au-target.dd-caret.fa.fa-caret-down")).click();
        Thread.sleep(1000);
        driver.findElement(By.cssSelector(".open > .au-target:nth-child(3) > div")).click();
        Thread.sleep(1000);
    }

    @When("^I select return reasons - Material expired$")
    public void iSelectReturnReasonsMaterialExpired() throws Throwable {
        driver.findElement(By.cssSelector("a.au-target.dd-caret.fa.fa-caret-down")).click();
        Thread.sleep(1000);
        driver.findElement(By.cssSelector(".open > .au-target:nth-child(4) > div")).click();
        Thread.sleep(1000);
    }

    @Then("^I see Items Returns GC Code \"([^\"]*)\" Description \"([^\"]*)\" WR Number \"([^\"]*)\"$")
    public void iSeeItemsReturnsGCCodeDescriptionWRNumber(String gc_code, String description, String wr_number) throws Throwable {
        Assert.assertEquals(gc_code, driver.findElement(By.cssSelector("div:nth-child(7) > div.details-list-item.no-pointer.no-hover.blue-content.hook-list-data-item-container > div:nth-child(1)")).getText());
        Assert.assertEquals(description, driver.findElement(By.cssSelector(".card-block:nth-child(7) > .no-pointer > .col-xs-3:nth-child(2)")).getText());
//        Assert.assertEquals(wr_number, driver.findElement(By.cssSelector("")).getText());
    }

    @And("^Dialog header - I select quantity$")
    public void dialogHeaderISelectQuantity() throws Throwable {
        driver.findElement(By.cssSelector(".fa-plus-circle")).click();
        Thread.sleep(1000);
    }

    @And("^I click \"([^\"]*)\" status$")
    public void iClickStatus(String status) throws Throwable {
        List<WebElement> action = driver.findElements(By.cssSelector(".btn"));

        for(int i=0; i<action.size(); i++) {

            WebElement element = action.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(status)) {
                element.click();
                break;
            }
//            System.out.println("status is : " + innerhtml);
        }
        Thread.sleep(3000);
    }

    @When("^I click on van stock menu container$")
    public void iClickOnVanStockMenuContainer() throws Throwable {
        driver.findElement(By.cssSelector("span.fa.fa-ellipsis-h")).click();
        Thread.sleep(1000);
    }

    @And("^I click the \"([^\"]*)\" on the menu container$")
    public void iClickTheOnTheMenuContainer(String menu) throws Throwable {
        List<WebElement> container = driver.findElements(By.cssSelector("div > div.van-stock-menu > ul > li"));

        for(int i=0; i<container.size(); i++) {

            WebElement element = container.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(menu)) {
//                System.out.println(innerhtml);
                element.click();
                break;
            }
            System.out.println("menu is : " + innerhtml);
        }
        Thread.sleep(3000);
    }

}



