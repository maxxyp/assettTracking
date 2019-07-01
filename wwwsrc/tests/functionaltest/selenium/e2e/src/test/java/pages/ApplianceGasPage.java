package pages;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

public class ApplianceGasPage {

    @FindBy(how= How.CSS, using="#appliance-child-tabs > span:nth-child(3)")
    public static WebElement gas_safety;

    @FindBy(how= How.XPATH, using="//div[4]/span[7]")
    public static WebElement other_safety;

    @FindBy(how= How.XPATH, using="/html/body/div/div[1]/router-view/view-state/div/router-view/view-state/div/div/router-view/view-state/div/div/div[3]/router-view/view-state/div/div/div/form/div/div/div[2]/button-list/div/button[1]/span")
    public static WebElement work_on_appliance_no;

    public static final String visual_check = "form > div:nth-child(2) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span";
    @FindBy(how= How.CSS, using=ApplianceGasPage.visual_check)
    public static WebElement visual_check_yes;

    @FindBy(how= How.CSS, using="form > div:nth-child(3) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span")
    public static WebElement appliance_safe_yes;

    @FindBy(how= How.CSS, using="form > div:nth-child(4) > div > div.col-xs-8 > button-list > div > button:nth-child(2) > span")
    public static WebElement current_standard_na;

    @FindBy(how= How.CSS, using="button.btn.btn-tertiary.arrow-blue-right.au-target")
    public static WebElement clear_button;



    public void click_gas_safety() throws InterruptedException {
        gas_safety.click();
    }

    public void click_other_safety() throws InterruptedException {
        other_safety.click();
    }

    public void click_work_on_appliance_no() throws InterruptedException {
        work_on_appliance_no.click();
    }

    public void click_visual_check_yes() throws InterruptedException {
        visual_check_yes.click();
    }

    public void click_appliance_safe_yes() throws InterruptedException {
        appliance_safe_yes.click();
    }

    public void click_current_standard_na() throws InterruptedException {
        current_standard_na.click();
    }

    public void click_clear_button() throws InterruptedException {
        clear_button.click();
    }

}
