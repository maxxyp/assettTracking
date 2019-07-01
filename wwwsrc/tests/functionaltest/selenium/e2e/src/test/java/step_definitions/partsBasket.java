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

public class partsBasket extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^Parts Basket - I select \"([^\"]*)\"$")
    public void partsBasketISelect(String arg0) throws Throwable {
        driver.findElement(By.cssSelector("div > div > div > form > div:nth-child(2) > div > div > button")).click();
//        driver.findElement(By.xpath("//div[2]/button")).click();
    }

    @And("^Parts Basket - I enter \"([^\"]*)\" stock reference ID$")
    public void partsBasketIEnterStockReferenceID(String value) throws Throwable {
        driver.findElement(By.cssSelector("input.au-target.form-control")).sendKeys(value);
        Thread.sleep(1000);
    }

    @And("^Parts Basket - I click Search for part$")
    public void partsBasketIClickSearchForPart() throws Throwable {
        driver.findElement(By.cssSelector("button.btn.btn-primary.arrow-blue-right.au-target")).click();
        Thread.sleep(2000);
    }

    @And("^Parts Basket - I click Add to order list$")
    public void partsBasketIClickAddToOrderList() throws Throwable {
        driver.findElement(By.cssSelector("button.btn.btn-primary.arrow-blue-right.au-target")).click();
        Thread.sleep(3000);
    }

    @And("^Parts Basket - I set quantity to (\\d+)$")
    public void partsBasketISetQuantityTo(int arg0) throws Throwable {
        driver.findElement(By.cssSelector("a.au-target.picker-buttons-plus")).click();
    }

    @And("^Parts Basket - I click Activities Tab$")
    public void partsBasketIClickActivitiesTab() throws Throwable {

        try {
            driver.findElement(By.xpath("//div[@id='nav-tab-buttons']/span[2]/button/span")).click();

        } catch (Exception e) {
            driver.findElement(By.cssSelector("div > div > tab-buttons > div > div:nth-child(2) > span:nth-child(2) > button > span")).click();
        }
        Thread.sleep(1000);
    }

    @And("^Parts Basket - Associated Activity - I select \"([^\"]*)\"$")
    public void applianceBookingActivityTypeISelect(String value) throws Throwable {

        driver.findElement(By.cssSelector("div > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")).click();
        Thread.sleep(1000);
        List<WebElement> activityType = driver.findElements(By.cssSelector("div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<activityType.size(); i++){

            WebElement element = activityType.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
//                System.out.println(innerhtml);
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(3000);
    }

}

