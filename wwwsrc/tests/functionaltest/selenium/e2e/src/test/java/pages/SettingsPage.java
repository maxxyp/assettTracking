package pages;


import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

import java.util.regex.Pattern;

public class SettingsPage {


//    @FindBy(how = How.CSS, using = "div.card-block.fade-in-content.au-target > div.card-block.fade-in-content.au-target > div.row.json-viewer.pretty-print > pre")
    @FindBy(how = How.CSS, using = "div > div > div.card-block.fade-in-content.au-target > div.card-block.fade-in-content.au-target > div.row.json-viewer.pretty-print")
//    body > div > div.main-container.full-screen > router-view > compose:nth-child(2) > div:nth-child(5) > compose > div > div > div.card-block.fade-in-content.au-target > div.card-block.fade-in-content.au-target > div.row.json-viewer.pretty-print
    public static WebElement lastJobUdateJSON;

    @FindBy(how = How.CSS, using = "compose > div > div > div.card-header.card-title.au-target > i")
//                      router-view > compose:nth-child(2) > div:nth-child(5) > compose > div > div > div.card-header.card-title.au-target > i
    public static WebElement supportOperationsChevronDown;

    public void verifyLastJobUpdateJsonIsEqualTo(String expectedJsonFile) throws InterruptedException {
        String actualJsonFile = lastJobUdateJSON.getText();
        actualJsonFile = actualJsonFile.replace("\n", "").replace("\"","");
        actualJsonFile = actualJsonFile.replaceAll("(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)", "2018-08-23T09:29:53Z");
        Assert.assertEquals(expectedJsonFile, actualJsonFile);

    }

    public void iClickTheSupportOperationsChevronDown() throws InterruptedException {
        supportOperationsChevronDown.click();
    }
}
