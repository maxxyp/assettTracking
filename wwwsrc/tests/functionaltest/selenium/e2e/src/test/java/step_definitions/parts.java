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

public class parts extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @Then("^I see local van stock message \"([^\"]*)\" displayed$")
    public void iSeeLocalVanStockMessageDisplayed(String expected_local_message) throws Throwable {
        String actual_local_message = driver.findElement(By.cssSelector(".child-tabs-item:nth-child(2)")).getText();
        System.out.println(actual_local_message);
        Assert.assertEquals(expected_local_message, actual_local_message);
    }

    @Then("^I see remote van stock message \"([^\"]*)\" displayed$")
    public void iSeeRemoteVanStockMessageDisplayed(String expected_remote_message) throws Throwable {
        String actual_remote_message = driver.findElement(By.cssSelector("div > material-search-summary > div > div:nth-child(3) > div")).getText();
        Assert.assertEquals(expected_remote_message, actual_remote_message);
    }

    @Then("^I see remote van stock error message \"([^\"]*)\" displayed$")
    public void iSeeRemoteVanStockErrorMessageDisplayed(String expected_error_message) throws Throwable {
        String actual_error_message = driver.findElement(By.cssSelector("material-search-summary > div > div:nth-child(3) > div > span:nth-child(2)")).getText();
        Assert.assertEquals(expected_error_message, actual_error_message);

    }

}

