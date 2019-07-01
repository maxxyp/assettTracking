package pages;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

public class CommonPage {

    @FindBy(how= How.CSS, using="div > compose:nth-child(2) > div > compose:nth-child(1) > div > div > div.col-xs-4 > div > div.job-address")
    public static WebElement first_job_on_the_list;

    @FindBy(how=How.CSS, using="i.au-target.job-state-enRoute")
    public static WebElement go_enroute;

    @FindBy(how=How.CSS, using="i.au-target.job-state-arrived")
    public static WebElement arrive;

    @FindBy(how=How.CSS, using="form.au-target.validation-state-indicator.state-valid")
    public static WebElement indicator_state;

    @FindBy(how=How.CSS, using="form.au-target.validation-state-indicator.state-invalid")
    public static WebElement invalid_indicator_state;

    @FindBy(how=How.CSS, using="tab-buttons > div > div:nth-child(2) > span:nth-child(2) > button > span")
    public static WebElement activities_btn;

    @FindBy(how=How.CSS, using="#nav-tab-buttons > span:nth-child(2) > button > span")
    public static WebElement property_safety;

    @FindBy(how=How.CSS, using="div:nth-child(2) > span:nth-child(4) > button > span.btn-label")
    public static WebElement appliances_btn;

    @FindBy(how=How.CSS, using="div:nth-child(2) > span:nth-child(5) > button > span")
    public static WebElement previous_activites_btn;

    @FindBy(how=How.XPATH, using="/html/body/div/div[1]/router-view/view-state/div/router-view/view-state/div/div/tab-buttons/div/div[2]/span[5]/button/span")
    public static WebElement parts_btn;

    public void click_first_job_on_the_list() throws InterruptedException {
        first_job_on_the_list.click();
        Thread.sleep(3000);
    }

    public void click_go_enroute_button() throws InterruptedException {
        go_enroute.click();
        Thread.sleep(1000);
    }

    public void click_arrive_button() throws InterruptedException {
        arrive.click();
        Thread.sleep(1000);
    }

    public void verify_state_is_valid() throws InterruptedException {
        Assert.assertTrue(indicator_state.isDisplayed());
    }

    public void verify_invalid_indicator() throws InterruptedException {
        Assert.assertTrue(invalid_indicator_state.isDisplayed());
    }

    public void click_activity_btn() throws InterruptedException {
        activities_btn.click();
    }

    public void click_property_safety() throws InterruptedException {
        property_safety.click();
    }

    public void click_appliances_btn() throws InterruptedException {
        appliances_btn.click();
    }

    public void click_previous_activites_btn() throws InterruptedException {
        previous_activites_btn.click();
    }

    public void click_parts_btn() throws InterruptedException {
        parts_btn.click();
    }

}
