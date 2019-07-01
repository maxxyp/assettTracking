package pages;


import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

public class RisksPage {

    @FindBy(how = How.CSS, using = "button.btn.btn-primary.text-center.au-target")
    public static WebElement got_it_button;

    public void click_got_it_button() throws InterruptedException {
        got_it_button.click();
    }
}
