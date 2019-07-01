package pages;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

public class AssetsPage {

    @FindBy(how=How.CSS, using=".hema-icon-vanstock")
    public static WebElement my_van;

    @FindBy(how=How.CSS, using="div.details-list-item.details-list-item-header")
    public static WebElement assets_lists;

    @FindBy(how=How.CSS, using="div.row > div > text-box > input")
    public static WebElement search;

    @FindBy(how=How.CSS, using=".details-list-item:nth-child(2) .btn:nth-child(1)")
    public static WebElement edit;

    @FindBy(how=How.CSS, using="body > div > div.main-container.full-screen > router-view > div > div.details-card > router-view > view-state > div > div > div.card-block.hook-list-data-container > div:nth-child(2) > div:nth-child(6) > span:nth-child(2) > i")
    public static WebElement return_icon;

    @FindBy(how=How.CSS, using="ai-dialog-header > div > label")
    public static WebElement content_header;

    @FindBy(how=How.CSS, using="input.form-control.au-target")
    public static WebElement area_input_box;

    @FindBy(how=How.CSS, using=".col-xs-2:nth-child(3) > .btn")
    public static WebElement high_value_tools;

    @FindBy(how=How.CSS, using="input.au-target.form-control")
    public static WebElement search_tools;

    @FindBy(how=How.CSS, using=".details-list-item-col:nth-child(1)")
    public static WebElement select_tools;

    @FindBy(how=How.CSS, using=".row:nth-child(2) span")
    public static WebElement van_stock;

    @FindBy(how=How.CSS, using=".row:nth-child(3) span")
    public static WebElement part_nearby;

    @FindBy(how=How.CSS, using=".col-xs-4 > .au-target > .au-target")
    public static WebElement stock_reference;

    @FindBy(how=How.CSS, using=".btn")
    public static WebElement search_btn;


    public void click_my_van() throws InterruptedException {
        my_van.click();
    }

    public void i_see_assetLists() throws InterruptedException {
        assets_lists.isDisplayed();
    }

    public void search_for_product(String tools) throws InterruptedException {
        search.sendKeys(tools);
    }

    public void click_edit_label() throws InterruptedException {
        edit.click();
    }

    public void click_return_icon() throws InterruptedException {
        return_icon.click();
    }

    public void i_see_content_header() throws InterruptedException {
        String text = content_header.getText();
        content_header.isDisplayed();
    }

    public void edit_area_input_box(String area) throws InterruptedException {
        area_input_box.clear();
        area_input_box.sendKeys(area);
    }

    public void click_high_value_tools() throws InterruptedException {
        high_value_tools.click();
    }

    public void i_search_for_tools(String text) throws InterruptedException {
        search_tools.click();
        Thread.sleep(1000);
        search_tools.sendKeys(text);
    }

    public void i_select_tools(String arg0, String arg1) throws InterruptedException {
        select_tools.click();
    }

    public void i_see_van_stock_displayed(String van) throws InterruptedException {
        Assert.assertEquals(van, van_stock.getText());
    }

    public void i_see_parts_nearby_displayed(String remote) throws InterruptedException {
        Assert.assertEquals(remote, part_nearby.getText());
    }

    public void i_search_for_stock_reference(String item) throws InterruptedException {
        stock_reference.sendKeys(item);
    }

    public void i_click_search_btn() throws InterruptedException {
        search_btn.click();
    }

}
