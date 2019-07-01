package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.util.List;

public class risks extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^I click on Risk Tab$")
    public void iClickOnRiskTab() throws Throwable {
        driver.findElement(By.xpath("//div[2]/span/button/span")).click();
    }

    @And("^I click Got it button$")
    public void iClickGotItButton() throws Throwable {
        driver.findElement(By.cssSelector("button.btn.btn-primary.text-center.au-target")).click();
    }

    @And("^Risk - Reason - I select Animal$")
    public void riskReasonISelectAnimal() throws Throwable {
        driver.findElement(By.xpath("//div[2]/button-list/div/button")).click();
    }

    @And("^Risk - I type Report \"([^\"]*)\"$")
    public void riskITypeReport(String value) throws Throwable {
        driver.findElement(By.cssSelector("textarea.au-target.form-control")).sendKeys(value);
    }

    @Then("^I verify New Risk - Reason \"([^\"]*)\" Report \"([^\"]*)\" are displayed$")
    public void iVerifyNewRiskReasonReportAreDisplayed(String reason, String appliance) throws Throwable {
        driver.findElement(By.cssSelector("catalog-lookup.au-target")).isDisplayed();
        driver.findElement(By.cssSelector("form > div:nth-child(2) > div.col-xs-6.details-list-item-col.wrap")).isDisplayed();
    }

    @And("^Risks - I click Delete button$")
    public void risksIClickDeleteButton() throws Throwable {
        driver.findElement(By.cssSelector("button.btn.btn-secondary.cross-blue.au-target")).click();
    }

    @Then("^I see that the risk delete is deleted$")
    public void iSeeThatTheRiskDeleteIsDeleted() throws Throwable {
        driver.findElement(By.cssSelector("form > div.details-list-item.disabled.au-target > div")).isDisplayed();
    }

}
