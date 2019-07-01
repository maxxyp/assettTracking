package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.CommonPage;

import java.io.File;
import java.io.IOException;

public class applianceReading extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^I click appliance Reading Tab$")
    public void iClickApplianceReadingTab() throws Throwable {
//        driver.findElement(By.cssSelector("#appliance-child-tabs > span:nth-child(2)")).click();
        Thread.sleep(2000);
        WebDriverWait wait2 = new WebDriverWait(driver, 10);
        wait2.until(ExpectedConditions.elementToBeClickable(By.cssSelector("#appliance-child-tabs > span:nth-child(2)")));
        Thread.sleep(2000);
    }

    @And("^Appliance Reading - I type Burner Pressure \"([^\"]*)\"$")
    public void applianceReadingITypeBurnerPressure(String pressure) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(1) > div > div:nth-child(2) > number-box > input")).clear();
        driver.findElement(By.cssSelector("div:nth-child(1) > div > div:nth-child(2) > number-box > input")).sendKeys(pressure);
    }

    @And("^Appliance Reading - I type Reading Final Ratio \"([^\"]*)\"$")
    public void applianceReadingITypeReadingFinalRatio(String ratio) throws Throwable {
        driver.findElement(By.cssSelector("div > div:nth-child(5) > div:nth-child(2) > div.col-xs-3 > number-box > input")).clear();
        driver.findElement(By.cssSelector("div > div:nth-child(5) > div:nth-child(2) > div.col-xs-3 > number-box > input")).sendKeys(ratio);
        Thread.sleep(3000);
    }

    @And("^Appliance Reading - I click Supplementary Button$")
    public void applianceReadingIClickSupplementaryButton() throws Throwable {
        driver.findElement(By.cssSelector("div > div > div > div > button:nth-child(2)")).click();
    }

    @And("^Appliance Reading - I type Supplementary Burner Pressure \"([^\"]*)\"$")
    public void applianceReadingITypeSupplementaryBurnerPressure(String bpressure) throws Throwable {
        driver.findElement(By.cssSelector("form > div.au-target > div > div.col-xs-12 > div:nth-child(2) > div > div:nth-child(2) > number-box > input")).clear();
        driver.findElement(By.cssSelector("form > div.au-target > div > div.col-xs-12 > div:nth-child(2) > div > div:nth-child(2) > number-box > input")).sendKeys(bpressure);
    }

    @And("^Appliance Reading - I type Supplementary Reading Final Ratio \"([^\"]*)\"$")
    public void applianceReadingITypeSupplementaryReadingFinalRatio(String sration) throws Throwable {
        driver.findElement(By.cssSelector("form > div.au-target > div > div.row > div > div:nth-child(5) > div:nth-child(2) > div.col-xs-3 > number-box > input")).clear();
        driver.findElement(By.cssSelector("form > div.au-target > div > div.row > div > div:nth-child(5) > div:nth-child(2) > div.col-xs-3 > number-box > input")).sendKeys(sration);
        Thread.sleep(3000);
    }

}
