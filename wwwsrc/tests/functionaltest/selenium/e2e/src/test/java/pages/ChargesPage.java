package pages;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ChargesPage {

    @FindBy(how= How.CSS, using="h4 > span:nth-child(1) > task-description > task-action")
    public static WebElement first_appliance_on_list;

    @FindBy(how=How.CSS, using="div.col-xs-12 > div > div:nth-child(2) > p > task-description")
    public static WebElement activity_description;

    @FindBy(how=How.CSS, using="div.col-xs-12 > div > div:nth-child(3)")
    public static WebElement charge_description;

    @FindBy(how=How.CSS, using="div.col-xs-12 > div > div:nth-child(5) > span")
    public static WebElement vat_description;

    @FindBy(how=How.CSS, using="div.col-xs-12 > div > div.col-xs-1.details-list-item-col.text-right > span")
    public static WebElement vat_amount;


    public static final String i_understand_button_css = "div > div > form > div:nth-child(1) > div > div:nth-child(4) > div > button";

    @FindBy(how=How.CSS, using=i_understand_button_css)
    public static WebElement i_understand_button;

    @FindBy(how=How.CSS, using="form.au-target.validation-state-indicator.state-valid")
    public static WebElement indicator_state;

    @FindBy(how=How.CSS, using=".col-xs-11 .au-target:nth-child(1) > span")
    public static WebElement charge_ok_button;


    public void click_first_appliance_on_the_list() throws InterruptedException {
        first_appliance_on_list.click();
        Thread.sleep(2000);
    }

    public void verify_activity_description(String activity) throws InterruptedException {
        activity_description.getText();
        Assert.assertEquals(activity, activity_description);
    }

    public void verify_charge_description(String charge) throws InterruptedException {
        charge_description.getText();
        Assert.assertEquals(charge, charge_description);
    }

    public void verify_vat_description(String vat) throws InterruptedException {
        vat_description.getText();
        Assert.assertEquals(vat, vat_description);
    }

    public void verify_vat_amount(String amount) throws InterruptedException {
        vat_amount.getText();
        Assert.assertEquals(amount, vat_amount);
    }

    public void click_charge_ok() throws InterruptedException {
        charge_ok_button.click();
    }

    public void verify_state_is_valid() throws InterruptedException {
        Assert.assertTrue(indicator_state.isDisplayed());
    }


}
