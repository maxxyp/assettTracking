package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static base.testBase.driver;

public class HomePage {

    @FindBy(how= How.CSS, using="input.au-target.form-control")
    public static WebElement training_id;

    @FindBy(how=How.CSS, using="button.au-target.hook-select-custom-engineer.btn-secondary.btn-sm.active")
    public static WebElement select;

    @FindBy(how=How.CSS, using="div.au-target.nav-bar-icon.icon-engineerappointments")
    public static WebElement customer;

    @FindBy(how=How.CSS, using=".select")
    public static WebElement signin_dropdown;

    @FindBy(how=How.CSS, using="div.au-target.lookup-items.open > div:nth-child(2) > div > span")
    public static WebElement ready_for_work;

    @FindBy(how=How.CSS, using="router-view > view-state > div > worklist-notification > div")
    public static WebElement notification_worklist;


    public void enter_training_id(String engineerID) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div:nth-child(2) > div.col-xs-7 > text-box > input")));
        training_id.clear();
        Thread.sleep(1000);
        training_id.sendKeys(engineerID);
        Thread.sleep(1000);
    }

    public void click_select_button() throws InterruptedException {
        Thread.sleep(1000);
        select.click();
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input.au-target.form-control")));
//        WebElement myDynamicElement = (new WebDriverWait(driver, 300))
//                .until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("span.simulation.au-target")));
    }

    public void click_customers_tab() throws InterruptedException {
        customer.click();
    }

    public void select_readyforwork_dropdown() throws InterruptedException {
        signin_dropdown.click();
        Thread.sleep(1000);
        ready_for_work.click();
    }

    public void check_notification_worklist(String worklist) throws InterruptedException {
        Thread.sleep(5000);
        WebDriverWait wait = new WebDriverWait(driver, 60);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div > worklist-notification > div")));
        String ActualMessage = notification_worklist.getText();
        System.out.println(ActualMessage);

    }
}
