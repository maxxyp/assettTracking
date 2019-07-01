package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.util.List;

public class consumables extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @When("^I click Consumables Tab$")
    public void
    iClickConsumablesTab() throws Throwable {
        driver.findElement(By.cssSelector("div.au-target.nav-bar-icon.hema-icon-parts-basket.relative")).click();
        WebDriverWait wait = new WebDriverWait(driver, 15);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > input")));
    }

    @And("^I see Order History Tab$")
    public void iSeeOrderHistoryTab() throws Throwable {
        driver.findElement(By.cssSelector("router-view > div > div.child-tabs > span:nth-child(2)")).isDisplayed();
    }

    @And("^I see Favourites Tab$")
    public void iSeeFavouritesTab() throws Throwable {
        driver.findElement(By.cssSelector("router-view > div > div.child-tabs > span:nth-child(3)")).isDisplayed();
    }

    @When("^Consumables Basket - I select \"([^\"]*)\" as Part Search$")
    public void consumablesBasketISelectAsPartSearch(String search) throws Throwable {
        driver.findElement(By.cssSelector("div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > input")).click();
        Thread.sleep(1000);
        List<WebElement> partsearch = driver.findElements(By.cssSelector("div.au-target.dropdown-container > div.au-target.lookup-items.open > div > div"));

        for(int i=0; i<partsearch.size(); i++){

            WebElement element = partsearch.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(search)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(2000);
    }


    @And("^Consumables Basket - I Increase Quantity$")
    public void consumablesBasketIIncreaseQuantity() throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(2) > incremental-number-picker > div.each-side-buttons.au-target > div:nth-child(3) > a")).click();
        Thread.sleep(1000);
    }

    @And("^Consumables Basket - I click Add To Basket$")
    public void consumablesBasketIClickAddToBasket() throws Throwable {
        driver.findElement(By.cssSelector("button.btn.btn-primary.plus.au-target")).click();
    }


    @Then("^Consumables Basket - I see Container with Description \"([^\"]*)\"$")
    public void consumablesBasketISeeContainerWithDescription(String description) throws Throwable {
        List<WebElement> container = driver.findElements(By.cssSelector("div.card.details-card.details-list > div.card-block.hook-list-data-container.au-target > div:nth-child(2) > div"));

        for(int i=0; i<container.size(); i++){

            WebElement element = container.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(description)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(2000);
    }

    @When("^Consumables Basket - I click Delete button$")
    public void consumablesBasketIClickDeleteButton() throws Throwable {
        driver.findElement(By.cssSelector("div.card-block.hook-list-data-container.au-target > div:nth-child(2) > div:nth-child(5) > button")).click();
    }


    @When("^Consumables Basket - I click Place Order button$")
    public void consumablesBasketIClickPlaceOrderButton() throws Throwable {
        driver.findElement(By.cssSelector("div.card-block.hook-list-data-container.au-target > div:nth-child(4) > div > button")).click();
    }

}
