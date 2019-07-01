package com.assettracking.step_definitions;
import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;


@RunWith(Cucumber.class)
//@RunWith(CucumberWithSerenity.class)
@CucumberOptions(

        features = "src/test/resources",
        //This executes all the scenarios tagged as smokeTest and regressionTest
        //format = {"pretty", "html:target/cucumber"},
        format = { "pretty", "json:target/cucumber.json" },
        tags = {"@materials"}
        //glue = {"src/test/java/cucumber/junit/maven/cucumber_jvm/maven"}
      //  glue = {"package com.assettracking.step_definitions;\n"}

)
public class RunTheTest {
}



