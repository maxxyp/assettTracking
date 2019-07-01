package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static base.testBase.driver;

public class ApplianceDetailsPage {

    @FindBy(how= How.CSS, using="tab-buttons > div > div:nth-child(2) > span:nth-child(4) > button > span")
    public static WebElement appliance_tab;

    @FindBy(how=How.XPATH, using="/html/body/div/div[1]/router-view/view-state/div/router-view/view-state/div/div/router-view/view-state/div/div/div/div[2]/div[1]")
    public static WebElement first_appliance;

    @FindBy(how=How.XPATH, using="//div[3]/button")
    public static WebElement show_default;

    @FindBy(how=How.CSS, using="form > div > div > div:nth-child(3) > div > div:nth-child(2) > text-box > input")
    public static WebElement gc_code;

    @FindBy(how=How.CSS, using="form > div > div > div:nth-child(4) > div > div.col-xs-4 > drop-down > div.au-target.dropdown-container > div.au-target.lookup-items.open > div:nth-child(1) > div")
    public static WebElement gc_code_first_option;

    @FindBy(how=How.CSS, using="div:nth-child(5) > div > div.col-xs-6 > text-box > input")
    public static WebElement location;

    @FindBy(how=How.CSS, using="div:nth-child(6) > div > div:nth-child(2) > number-box > input")
    public static WebElement appliance_year;

    @FindBy(how=How.CSS, using="div.col-xs-6 > drop-down.au-target > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div.selection-container > div.input-container > div.select.search-box")
    public static WebElement flue_type;

    @FindBy(how=How.CSS, using="div.au-target.lookup-items.open > div.au-target > div")
    public static WebElement flue_type_first_option;

    @FindBy(how=How.CSS, using="div:nth-child(10) > div > div.col-xs-6 > button-list > div > button:nth-child(1) > span")
    public static WebElement bg_installation_no;

    @FindBy(how=How.CSS, using="div:nth-child(9) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")
    public static WebElement appliance_condition;

    @FindBy(how=How.CSS, using="div.au-target.lookup-items.open > div:nth-child(1) > div")
    public static WebElement appliance_condition_first_option;

    @FindBy(how=How.CSS, using="form > div > div > div:nth-child(12) > div > div:nth-child(2) > number-box > input")
    public static WebElement system_installation_year;

    @FindBy(how=How.CSS, using="div:nth-child(10) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")
    public static WebElement system_type;

    // todo had to add this as sometimes extra fields are available
    @FindBy(how=How.CSS, using="div:nth-child(12) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")
    public static WebElement system_type_2;

    @FindBy(how=How.CSS, using="div.au-target.lookup-items.open > div:nth-child(1) > div")
    public static WebElement system_type_first_option;

    @FindBy(how=How.CSS, using="div:nth-child(11) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")
    public static WebElement system_design_condition;

    @FindBy(how=How.CSS, using="div.au-target.lookup-items.open > div:nth-child(1) > div")
    public static WebElement system_design_condition_first_option;

    @FindBy(how=How.CSS, using="div:nth-child(12) > div > div:nth-child(2) > number-box > input")
    public static WebElement radiator;

    @FindBy(how=How.CSS, using="div:nth-child(13) > div > div:nth-child(2) > number-box > input")
    public static WebElement radiator_special;

    @FindBy(how=How.CSS, using="div:nth-child(14) > div > div:nth-child(2) > number-box > input")
    public static WebElement boiler_size;

    @FindBy(how=How.CSS, using="div:nth-child(15) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")
    public static WebElement cylinder_type;

    @FindBy(how=How.CSS, using="div.au-target.lookup-items.open > div:nth-child(1) > div")
    public static WebElement cylinder_type_first_option;

    @FindBy(how=How.CSS, using="div:nth-child(16) > div > div.col-xs-6 > drop-down > div.au-target.dropdown-container > div.au-target.input-base.selected-items.form-control > div > div > div")
    public static WebElement energy_control;

    @FindBy(how=How.CSS, using="div.au-target.lookup-items.open > div:nth-child(1) > div")
    public static WebElement energy_control_first_option;

    @FindBy(how=How.CSS, using="div.col-xs-6 > text-box.au-target > input.au-target.form-control")
    public static WebElement description;

    @FindBy(how=How.CSS, using="div:nth-child(8) > div > div.col-xs-6 > text-box > input")
    public static WebElement serial_number;


    public void click_appliance_tab() throws InterruptedException {
        appliance_tab.click();
        WebDriverWait wait = new WebDriverWait(driver, 300);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.au-target.col-xs-3.details-list-item-col.state-not-visited")));
    }

    public void click_first_appliance() throws InterruptedException {
        first_appliance.click();
    }

    public void click_show_default() throws InterruptedException {
        show_default.click();
        Thread.sleep(1000);
    }

    public void click_gc_code() throws InterruptedException {
        gc_code.click();
        Thread.sleep(1000);
    }

    public void click_gc_code_first_option() throws InterruptedException {
        gc_code_first_option.click();
    }

    public void enter_location(String Location) throws InterruptedException {
        location.clear();
        location.sendKeys(Location);
    }

    public void enter_appliance_year(String year) throws InterruptedException {
        appliance_year.clear();
        appliance_year.sendKeys(year);
    }

    public void click_flue_type() throws InterruptedException {
        flue_type.click();
    }

    public void click_flue_type_first_option() throws InterruptedException {
        flue_type_first_option.click();
    }

    public void click_bg_installation_no() throws InterruptedException {
        bg_installation_no.click();
    }

    public void click_appliance_condition() throws InterruptedException {
        appliance_condition.click();
        Thread.sleep(1000);
    }

    public void click_appliance_condition_first_option() throws InterruptedException {
        appliance_condition_first_option.click();
    }

    public void enter_system_installation_year(String year) throws InterruptedException {
        system_installation_year.sendKeys(year);
    }

    public void click_system_type() throws InterruptedException {
        system_type.click();
        Thread.sleep(1000);
    }

    public void click_system_type_2() throws InterruptedException {
        system_type_2.click();
        Thread.sleep(1000);
    }

    public void click_system_type_first_option() throws InterruptedException {
        system_type_first_option.click();
    }


    public void click_system_design_condition_first_option() throws InterruptedException {
        system_design_condition.click();
        Thread.sleep(1000);
        system_design_condition_first_option.click();
    }

    public void enter_radiator(String value) throws InterruptedException {
        radiator.clear();
        radiator.sendKeys(value);
    }

    public void enter_radiator_special(String value) throws InterruptedException {
        radiator_special.clear();
        radiator_special.sendKeys(value);
    }
    public void enter_boiler_size(String value) throws InterruptedException {
        boiler_size.clear();
        boiler_size.sendKeys(value);
    }

    public void click_cylinder_type_first_option() throws InterruptedException {
        cylinder_type.click();
        cylinder_type_first_option.click();
    }

    public void click_energy_control_first_option() throws InterruptedException {
        energy_control.click();
        energy_control_first_option.click();
    }

    public void enter_gc_code(String value) throws InterruptedException {
        gc_code.sendKeys(value);
        Thread.sleep(1000);
    }

    public void enter_description(String value) throws InterruptedException {
        description.sendKeys(value);
        Thread.sleep(1000);
    }


    public void enter_serial_number(String number) throws InterruptedException {
        serial_number.clear();
        serial_number.sendKeys(number);
    }
}
