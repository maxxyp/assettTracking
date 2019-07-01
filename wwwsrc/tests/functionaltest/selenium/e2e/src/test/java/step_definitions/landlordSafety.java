package step_definitions;

import base.testBase;
import cucumber.api.PendingException;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.util.List;

// todo rename to just Gas Safety, having landlord safety little confusing
public class landlordSafety extends testBase {

    @Before
    public void setup() throws IOException {
        initialize();
    }

    @And("^Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one$")
    public void landlordSafetyCertificateELIReadingsOhmsISelectLessThanOne() throws Throwable {
        Thread.sleep(5000);
        driver.findElement(By.cssSelector("div:nth-child(1) > div > span.col-xs-8 > button-list > div > button:nth-child(1) > span")).click();
        Thread.sleep(3000);
    }

    @And("^Landlord Safety Certificate - Safety Advice Notice Left - I select \"([^\"]*)\"$")
    public void landlordSafetyCertificateSafetyAdviceNoticeLeftISelect(String value) throws Throwable {
        List<WebElement> advice = driver.findElements(By.cssSelector("div:nth-child(2) > div > span.col-xs-8 > button-list > div > button > span"));

        for(int i=0; i<advice.size(); i++){

            WebElement element = advice.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Landlord Safety Certificate - Gas Installation Tightness Test Done - I select \"([^\"]*)\"$")
    public void landlordSafetyCertificateGasInstallationTightnessTestDoneISelect(String value) throws Throwable {
        List<WebElement> advice = driver.findElements(By.cssSelector("div:nth-child(3) > div > span.col-xs-8 > button-list > div > button > span"));

        for(int i=0; i<advice.size(); i++){

            WebElement element = advice.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(3000);
    }

    @And("^Landlord Safety Certificate - Pressure Drop - I type \"([^\"]*)\"$")
    public void landlordSafetyCertificatePressureDropIType(String value) throws Throwable {
        driver.findElement(By.cssSelector("div.row.au-target > div > span:nth-child(2) > number-box > input")).sendKeys(value);
        Thread.sleep(7000);
    }

    @And("^Landlord Safety Certificate - Gas meter and Installation satisfactory I click \"([^\"]*)\"$")
    public void landlordSafetyCertificateGasMeterAndInstallationSatisfactoryIClick(String value) throws Throwable {
        List<WebElement> advice = driver.findElements(By.cssSelector("div:nth-child(5) > div > span.col-xs-8 > button-list > div > button > span"));
        for(int i=0; i<advice.size(); i++){

            WebElement element = advice.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Landlord Safety Certificate - Report - I type \"([^\"]*)\"$")
    public void landlordSafetyCertificateReportIType(String value) throws Throwable {
        driver.findElement(By.cssSelector("div:nth-child(8) > div > span.col-xs-8 > text-area > textarea")).sendKeys(value);
    }

    @And("^Landlord Safety Certificate - Condition As Left - I click \"([^\"]*)\"$")
    public void landlordSafetyCertificateConditionAsLeftIClick(String value) throws Throwable {
        List<WebElement> condition = driver.findElements(By.cssSelector("div:nth-child(9) > div > span.col-xs-8 > button-list > div > button > span"));
        for(int i=0; i<condition.size(); i++){

            WebElement element = condition.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Landlord Safety Certificate - Capped Turn Off - I click \"([^\"]*)\"$")
    public void landlordSafetyCertificateCappedTurnOffIClick(String value) throws Throwable {
        List<WebElement> capped = driver.findElements(By.cssSelector("div:nth-child(10) > div > span.col-xs-8 > button-list > div > button > span"));
        for(int i=0; i<capped.size(); i++){

            WebElement element = capped.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Landlord Safety Certificate - Label Attached - I click \"([^\"]*)\"$")
    public void landlordSafetyCertificateLabelAttachedIClick(String value) throws Throwable {
        List<WebElement> label = driver.findElements(By.cssSelector("div:nth-child(11) > div > span.col-xs-8 > button-list > div > button > span"));
        for(int i=0; i<label.size(); i++){

            WebElement element = label.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Landlord Safety Certificate - Owned By Customer - I select \"([^\"]*)\"$")
    public void landlordSafetyCertificateOwnedByCustomerISelect(String value) throws Throwable {
        List<WebElement> customer = driver.findElements(By.cssSelector("div:nth-child(12) > div > span.col-xs-8 > button-list > div > button > span"));
        for(int i=0; i<customer.size(); i++){

            WebElement element = customer.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(1000);
    }

    @And("^Landlord Safety Certificate - Letter Left - I select \"([^\"]*)\"$")
    public void landlordSafetyCertificateLetterLeftISelect(String value) throws Throwable {
        List<WebElement> letter = driver.findElements(By.cssSelector("div:nth-child(13) > div > span.col-xs-8 > button-list > div > button > span"));
        for(int i=0; i<letter.size(); i++){

            WebElement element = letter.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
    }

    @And("^Landlord Safety Certificate - Signature Obtained - I select \"([^\"]*)\"$")
    public void landlordSafetyCertificateSignatureObtainedISelect(String value) throws Throwable {
        List<WebElement> signature = driver.findElements(By.cssSelector("div:nth-child(14) > div > span.col-xs-8 > button-list > div > button > span"));
        for(int i=0; i<signature.size(); i++){

            WebElement element = signature.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains(value)){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(1000);
    }

    @And("^I click Certificate button$")
    public void iClickCertificateButton() throws Throwable {
        List<WebElement> certi = driver.findElements(By.cssSelector("#nav-tab-buttons > span:nth-child(8) > button > span"));
        for(int i=0; i<certi.size(); i++){

            WebElement element = certi.get(i);
            String innerhtml = element.getAttribute("innerHTML");
            if(innerhtml.contains("Certificate")){
                element.click();
                break;
            }
            System.out.println("values from drop down is : "+innerhtml);
        }
        Thread.sleep(5000);
    }

    @And("^Certificate - I see Gas Installation Tightness Test with Text \"([^\"]*)\"$")
    public void certificateISeeGasInstallationTightnessTestWithText(String value) throws Throwable {
        String expected = value;
        String actual = driver.findElement(By.cssSelector("#landlord-cert > div:nth-child(5) > div > table > tbody > tr > td > span")).getText();
        System.out.println(actual);
        Assert.assertEquals(expected, actual);
    }
}
