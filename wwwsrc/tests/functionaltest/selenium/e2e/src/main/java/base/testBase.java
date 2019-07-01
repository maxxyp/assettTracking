package base;

import org.junit.After;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

public class testBase {

    //initializing the property file reading
    public static Properties CONFIG=null;
    public static WebDriver driver=null;
    public int random;

    public void initialize() throws IOException {
        if(driver == null){

            //config property file
            CONFIG= new Properties();
            FileInputStream fn =new FileInputStream(System.getProperty("user.dir")+"/src/main/java/config/config.properties");
            CONFIG.load(fn);


            //Initialize the webdriver
            if (CONFIG.getProperty("browser").equals("firefox")){
                driver = new FirefoxDriver();

            }else if(CONFIG.getProperty("browser").equals("edge")){
                System.setProperty("webdriver.ie.driver", "C:\\IEDriverServer.exe");
                driver = new InternetExplorerDriver();
//                System.setProperty("webdriver.edge.driver", "C:\\Selenium\\MicrosoftWebDriver.exe");
//                WebDriver driver = new EdgeDriver();
            }

            else if(CONFIG.getProperty("browser").equals("chrome")){
//                System.setProperty("webdriver.chrome.logfile", "TestLog.txt");
//                  System.setProperty("webdriver.chrome.driver", "drivers/chromedriver");
                  driver = new ChromeDriver();

//                // Running Test on Headless Browser
//                System.setProperty("webdriver.chrome.driver", "C:\\Selenium\\chromedriver.exe");
//                ChromeOptions options = new ChromeOptions();
//                options.addArguments("window-size=1400,800");
//                options.addArguments("headless");
//                driver = new ChromeDriver(options);
                // driver = new HtmlUnitDriver(true);
            }

            driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        }
    }



//    public void closeBrowsers() {
//        if (this.driver != null);
//        this.driver.quit();
//
//    }
}
