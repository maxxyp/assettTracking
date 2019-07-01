package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.Scenario;
//import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.junit.After;
import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.internal.FindsById;
import org.openqa.selenium.internal.FindsByXPath;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.*;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;

public class common extends testBase {


    public JavascriptExecutor js;

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @Given("^I am on the home page$")
    public void iAmOnTheHomePage() throws Throwable {
        driver.navigate().to(CONFIG.getProperty("URL"));
        driver.manage().window().maximize();
        WebDriverWait wait = new WebDriverWait(driver, 90);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.au-target.nav-bar-icon.hema-icon-settings")));
    }

    @Given("^I am on the SettingsPage$")
    public void i_am_on_the_SettingsPage() throws Throwable {
        driver.navigate().to(CONFIG.getProperty("URL"));
        driver.manage().window().maximize();
        Thread.sleep(2000);
        WebDriverWait wait = new WebDriverWait(driver, 300);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.au-target.nav-bar-icon.hema-icon-settings")));
    }

    @Given("^I navigate to customer Infomation Page$")
    public void iNavigateToCustomerInfomationPage() throws Throwable {
        driver.navigate().to("https://localhost:9000/#/customers/to-do");
        Thread.sleep(2000);
    }

    @Given("^I wait for the app data to load$")
    public void i_wait_for_the_app_data_to_load() throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 300);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("span.simulation.au-target")));
    }

    @And("^I enter training engineer ID \"([^\"]*)\"$")
    public void i_enter_training_engineer_ID(String trainingID) throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 90);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("span.simulation.au-target")));
        HomePage homepage = PageFactory.initElements(driver, HomePage.class);
        homepage.enter_training_id(trainingID);
        Thread.sleep(3000);
    }

    @And("^I click the select button Tab$")
    public void i_click_the_select_button_Tab() throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("button.au-target.hook-select-custom-engineer.btn-secondary.btn-sm.active")));

        driver.findElement(By.cssSelector("button.au-target.hook-select-custom-engineer.btn-secondary.btn-sm.active")).click();
        Thread.sleep(9000);
    }

    @Given("^I click Customer Details Tab$")
    public void i_click_Customer_Details_Tab() throws Throwable {
        HomePage homepage = PageFactory.initElements(driver, HomePage.class);
        homepage.click_customers_tab();
        Thread.sleep(4000);
    }

    @And("^I click Gas Property Safety button$")
    public void iClickGasPropertySafetyButton() throws Throwable {
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_property_safety();
    }

    @Given("^Tabs - I click \"([^\"]*)\" button$")
    public void tabs_I_click_button(String button) throws Throwable {

        List<WebElement> tabs = driver.findElements(By.cssSelector("tab-buttons > div > div:nth-child(2) > span > button > span"));

        for(int i=0; i<tabs.size(); i++) {

            WebElement element = tabs.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if (innerhtml.contains(button)) {
                System.out.println(innerhtml);
                element.click();
                break;
            }
            System.out.println("values from drop down is : " + innerhtml);
        }
        Thread.sleep(4000);
    }

    @And("^Tabs - I click Activities tab$")
    public void tabsIClickActivitiesTab() throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("span:nth-child(4) > button > span"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(5000);
    }


    @Given("^I select Ready for work$")
    public void i_select_Ready_for_work() throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".select")));
        HomePage homepage = PageFactory.initElements(driver, HomePage.class);
        homepage.select_readyforwork_dropdown();
        Thread.sleep(4000);
    }

    @And("^I wait for Job Details to load and displayed \"([^\"]*)\"$")
    public void iWaitForJobDetailsToLoadAndDisplayed(String worklist) throws Throwable {
        HomePage homepage = PageFactory.initElements(driver, HomePage.class);
        homepage.check_notification_worklist(worklist);
        Thread.sleep(2000);
    }

    @And("^I click on first customer info on the Job List$")
    public void iClickOnFirstCustomerInfoOnTheJobList() throws Throwable {
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_first_job_on_the_list();
    }

    @And("^Job List - I click on Customer Information \"([^\"]*)\" on the Job List$")
    public void jobListIClickOnCustomerInformationOnTheJobList(String info) throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div > compose:nth-child(1) > div > div > div.col-xs-4 > div > div:nth-child(3)")));

//        WebElement myDynamicElement = (new WebDriverWait(driver, 30))
//                .until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div > compose:nth-child(1) > div > div > div.col-xs-4 > div > div:nth-child(3)")));

        List<WebElement> joblist = driver.findElements(By.cssSelector("div > compose:nth-child(1) > div > div > div.col-xs-4 > div > div:nth-child(3)"));

        for(int i=0; i<joblist.size(); i++){

            WebElement element = joblist.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(info)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(4000);
    }

    @And("^I click on the Complete button")
    public void iClickOnTheCompleteButton() throws Throwable {
        WebElement ele = driver.findElement(By.cssSelector("i.au-target.job-state-complete"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(5000);
    }

    @And("^I click on the Go en-route button and click Arrive Label$")
    public void iClickOnTheGoEnRouteButtonAndClickArriveLabel() throws Throwable {
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_go_enroute_button();
        commonpage.click_arrive_button();
        Thread.sleep(1000);
    }


    @And("^Gas Job - I click on the Go en-route button and click Arrive Label$")
    public void gasJobIClickOnTheGoEnRouteButtonAndClickArriveLabel() throws Throwable {
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_go_enroute_button();

        // Store the current window handle
        String winHandleBefore = driver.getWindowHandle();

        // Switch to new window opened
        for(String winHandle : driver.getWindowHandles()){
            driver.switchTo().window(winHandle);
        }

        // Close the new window, if that window no more required
        driver.close();

        // Switch back to original browser (first window)
        driver.switchTo().window(winHandleBefore);

        commonpage.click_arrive_button();
    }

    @And("^Job List - I click on the Go en-route button$")
    public void jobListIClickOnTheGoEnRouteButton() throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("i.au-target.job-state-enRoute")));
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_go_enroute_button();
        Thread.sleep(1000);

        // Store the current window handle
        String winHandleBefore = driver.getWindowHandle();

        // Switch to new window opened
        for(String winHandle : driver.getWindowHandles()){
            driver.switchTo().window(winHandle);
        }

        // Close the new window, if that window no more required
        driver.close();
        Thread.sleep(1000);

        // Switch back to original browser (first window)
        driver.switchTo().window(winHandleBefore);
        driver.findElement(By.cssSelector("div > div > ai-dialog > ai-dialog-footer > button")).click();
        Thread.sleep(2000);
        commonpage.click_arrive_button();
        Thread.sleep(2000);
    }

    @And("^Job List - I click on the Go en-route button and click Arrive Label$")
    public void jobListIClickOnTheGoEnRouteButtonAndClickArriveLabel() throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.status-buttons-container.au-target > state-buttons > button-list > div > button > span > span.button-list-item-icon > i")));
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_go_enroute_button();
        Thread.sleep(1000);
        commonpage.click_arrive_button();
        Thread.sleep(7000);

//        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
//        commonpage.click_go_enroute_button();
//
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
//
//        commonpage.click_arrive_button();
//        Thread.sleep(3000);
    }

    @And("^Job List - I click on the Go en-route button and click Arrive Label Single Tab$")
    public void jobListIClickOnTheGoEnRouteButtonAndClickArriveLabel2() throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.status-buttons-container.au-target > state-buttons > button-list > div > button > span > span.button-list-item-icon > i")));
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_go_enroute_button();
        Thread.sleep(1000);
        commonpage.click_arrive_button();
        Thread.sleep(7000);
    }


    @And("^I click Clear Button$")
    public void iClickClearButton() throws Throwable {
        ApplianceGasPage applianceGasPage = PageFactory.initElements(driver, ApplianceGasPage.class);
        applianceGasPage.click_clear_button();
    }

    @And("^Dialog Box - I see a warning message displaying \"([^\"]*)\"$")
    public void dialogBoxISeeAWarningMessageDisplaying(String alertMessage) throws Throwable {
        try {
            WebDriverWait wait = new WebDriverWait(driver, 3);
            wait.until(ExpectedConditions.alertIsPresent());
            Alert simpleAlert = driver.switchTo().alert();
            simpleAlert.accept();
        } catch (Exception e) {
            Assert.assertEquals(alertMessage, driver.findElement(By.cssSelector("body > ai-dialog-container > div > div > ai-dialog > ai-dialog-body > div")).getText());
        }
        Thread.sleep(1000);
    }

//    @And("^Dialog Box - I see a confirmation message displaying \"([^\"]*)\"$")
//    public void dialogBoxISeeAConfirmationMessageDisplaying(String alertMessage) throws Throwable {
//        try {
//            WebDriverWait wait = new WebDriverWait(driver, 3);
//            wait.until(ExpectedConditions.alertIsPresent());
//            Alert simpleAlert = driver.switchTo().alert();
//            simpleAlert.accept();
//        } catch (Exception e) {
//            Assert.assertEquals(alertMessage, driver.findElement(By.cssSelector("ai-dialog-container > div > div > ai-dialog > ai-dialog-body > label")).getText());
//        }
//        Thread.sleep(1000);
//    }

    @And("^Dialog Box - I see a confirmation message displaying \"([^\"]*)\"$")
    public void dialogBoxISeeAConfirmationMessageDisplaying(String alertMessage) throws Throwable {
        Assert.assertEquals(alertMessage, driver.findElement(By.cssSelector("ai-dialog-container > div > div > ai-dialog > ai-dialog-body > label")).getText());
//      System.out.println(alertMessage);
        Thread.sleep(1000);
    }

    @And("^Dialog box - I click Yes button$")
    public void dialogBoxIClickYesButton() throws Throwable {
        driver.findElement(By.cssSelector("ai-dialog > ai-dialog-footer > button.btn.btn-primary.au-target")).click();
        Thread.sleep(3000);
    }

    @And("^Dialog box - I click Confirm button$")
    public void dialogBoxIClickConfirmButton() throws Throwable {
        driver.findElement(By.xpath("//button[contains(.,'Confirm')]")).click();
        Thread.sleep(3000);
    }

    @And("^I confirm that form has \"([^\"]*)\" class state$")
    public void iConfirmThatFormHasClassState(String state) throws Throwable {
        driver.findElement(By.cssSelector("button.au-target.btn.btn-primary.button-list-item.active")).isDisplayed();
        Thread.sleep(2000);
    }

    @When("^I click Appliances button$")
    public void iClickAppliancesButton() throws Throwable {
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_appliances_btn();
    }

    @When("^I click Parts button$")
    public void iClickPartsButton() throws Throwable {
//        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
//        commonpage.click_parts_btn();
//        Thread.sleep(5000);
        WebElement ele = driver.findElement(By.xpath("//div[@id='nav-tab-buttons']/span[5]/button/span"));
        JavascriptExecutor executor = (JavascriptExecutor)driver;
        executor.executeScript("arguments[0].click();", ele);
        Thread.sleep(5000);
    }

    @When("^I click Previous Activities button$")
    public void iClickPreviousActivitiesButton() throws Throwable {
        CommonPage commonpage = PageFactory.initElements(driver, CommonPage.class);
        commonpage.click_previous_activites_btn();
        Thread.sleep(2000);
    }

    @And("^I see Error message pop up$")
    public void iSeeErrorMessagePopUp() throws Throwable {
        driver.findElement(By.cssSelector("toast-manager div.title")).isDisplayed();
    }

    @Then("^I close the browser$")
    public void i_close_the_browser() throws Throwable {
        driver.quit();
    }

    @And("^I click the settings Tab$")
    public void iClickTheSettingsTab() throws Throwable {
        driver.findElement(By.cssSelector("div.au-target.nav-bar-icon.hema-icon-settings")).click();
        Thread.sleep(5000);
    }

    @And("^I clear Local Storage$")
    public void iClearLocalStorage() throws Throwable {
        js.executeScript(String.format("window.localStorage.clear();"));
        driver.get("javascript:localStorage.clear();");
    }

    @When("^I click Got It on risks page$")
    public void i_click_the_got_it_risks_button() throws Throwable {
//        WebDriverWait wait = new WebDriverWait(driver, 90);
//        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("button.btn.btn-primary.text-center.au-target")));
        Thread.sleep(5000);
        RisksPage risksPage = PageFactory.initElements(driver, RisksPage.class);
        risksPage.click_got_it_button();
        Thread.sleep(1000);
    }

    @And("^I click the support operations chevron down")
    public void iClickTheSupportOperationsChevronDown() throws Throwable {
//        SettingsPage settingsPage = PageFactory.initElements(driver, SettingsPage.class);
//        settingsPage.iClickTheSupportOperationsChevronDown();
        driver.findElement(By.cssSelector("compose:nth-child(2) > div:nth-child(5) > compose > div > div > div.card-header.card-title.au-target")).click();
        Thread.sleep(5000);
    }

    @Then("^I verify that last job update is \"([^\"]*)\"$")
    public void iVerifyThatLastJobUpdateIs(String expectedJsonFile) throws Throwable {
        SettingsPage settingsPage = PageFactory.initElements(driver, SettingsPage.class);
        settingsPage.verifyLastJobUpdateJsonIsEqualTo(expectedJsonFile);
        Thread.sleep(2000);
    }

    @When("^Gas Safety - click next task$")
    public void gas_Safety_click_next_task() throws Throwable {
        WebDriverWait wait = new WebDriverWait(driver, 2);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("/html/body/div/div[1]/router-view/view-state/div/router-view/view-state/div/div/router-view/view-state/div/div/div[1]/div[2]/prev-next-buttons/div/a[2]")));
        driver.findElement(By.xpath("/html/body/div/div[1]/router-view/view-state/div/router-view/view-state/div/div/router-view/view-state/div/div/div[1]/div[2]/prev-next-buttons/div/a[2]")).click();
        Thread.sleep(5000);
    }

//        @After
//        public void embedScreenshot(Scenario scenario) throws Exception {
//            if (scenario.isFailed()) {
//                try {
//                    byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
//                    String testName = scenario.getName();
//                    scenario.embed(screenshot, "image/png");
//                    scenario.write(testName);
//                } catch (WebDriverException wde) {
//                    System.err.println(wde.getMessage());
//                } catch (ClassCastException cce) {
//                    cce.printStackTrace();}
//            }
//        }

    @After
    public void embedScreenshot(Scenario scenario) throws Exception {

        if (scenario.isFailed()) {
            scenario.embed(((TakesScreenshot)driver).getScreenshotAs(OutputType.BYTES), "image/png");
        }
//        driver.close();
        driver.quit();
    }

    @And("^I clear the local storage and session$")
    public void iClearTheLocalStorageAndSession() throws Throwable {
        //To Remove a specific Key along with it's value
        JavascriptExecutor jsExecutor = (JavascriptExecutor) driver;
        jsExecutor.executeScript("window.sessionStorage.clear();");
        Thread.sleep(5000);
        driver.navigate().refresh();
        Thread.sleep(3000);
    }


    public static class ByE2eId extends By implements Serializable {
        private static final long serialVersionUID = 5341968046120372169L;
        private final String id;

        public ByE2eId(String id) {
            this.id = id;
        }

        public List<WebElement> findElements(SearchContext context) {
            return context instanceof FindsById ? ((FindsById)context).findElementsById(this.id) : ((FindsByXPath)context).findElementsByXPath(".//*[@data-e2e = '" + this.id + "']");
        }

        public WebElement findElement(SearchContext context) {
            return context instanceof FindsById ? ((FindsById)context).findElementById(this.id) : ((FindsByXPath)context).findElementByXPath(".//*[@data-e2e = '" + this.id + "']");
        }

        public String toString() {
            return "By.ByE2eId: " + this.id;
        }
    }

}



