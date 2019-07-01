package com.assettracking.step_definitions;

import com.assettracking.data.Reserve;
import com.assettracking.utils.ResponseValidator;
import cucumber.api.PendingException;
import cucumber.api.Scenario;

import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.ValidatableResponse;
import net.serenitybdd.rest.SerenityRest;

import io.restassured.response.Response;

import java.util.*;


import org.junit.Assert;
import org.junit.BeforeClass;

import java.io.IOException;

public class CucumberSteps {

    static String searchUri  = null;
    static String bulkSerachUri = null;
    static ValidatableResponse response = null;
    static Reserve reservedItem = null;
    static Response jsonResponse = null;


    @Before
    public void setup() throws IOException {
        searchUri = "/assettracking/material/";
        String bulkSerachUri = "/assettracking/engineer/";
        ValidatableResponse response = null;
    }


    @Given("^I navigate to the api URI$")
    public void i_navigate_to_the_api_URI() {
        RestAssured.baseURI = "https://dt.pulsenow.co.uk";
    }

    @When("^I search for item \"([^\"]*)\"$")
    public void i_am_able_to_search_for_item(String materialId) {

        if (searchUri!=null) searchUri = null;
        searchUri = "/assettracking/material/";

        searchUri = searchUri+materialId;
        System.out.println("----------Search uri is :"+searchUri);

        response = SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
                .header("X-Engineer-Lat", "49.123456")
                .header("X-Engineer-Lon", "0.123456")
                .header("X-Engineer-Status", "true")
                .header("X-Request-Id", "0bf74a89-e4d1-4914-9e47-c755154d157b")
                .header("cache-control", "no-cache")
                .when()
                .get(searchUri)
               // .get("/assettracking/material/248147")
                .then()
                .log()
                .all();
                //.statusCode(200);
    }

    @Then("^I get Http response code \"([^\"]*)\"$")
    public void i_get_Http_response_code(String arg1) {
        // Write code here that turns the phrase above into concrete actions
        response.statusCode(Integer.parseInt(arg1));
    }

    @Then("^I should see a HTTP response$")
    public void i_should_see_a_HTTP_response() {
        SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
                .when()
                .get("/assettracking/engineer/0013846/materials")
                .then()
                .log()
                .all()
                .statusCode(200);
    }

    @Then("^I am able to search the materials for Engineer \"([^\"]*)\" with HTTP response \"([^\"]*)\"$")
    public void i_am_able_to_search_the_materials_for_Engineer_with_HTTP_response(String engineer, String status) {
        // Write code here that turns the phrase above into concrete actions
        if (bulkSerachUri!=null) bulkSerachUri = null;
        bulkSerachUri = "/assettracking/engineer/";
        bulkSerachUri = bulkSerachUri.concat(engineer).concat("/materials");
        System.out.println("----------- in Bulk Serach Material URI: "+bulkSerachUri);
        //ResponseOptions
        //ValidatableResponse
       // RestAssuredResponseImpl response =
        Response response =    SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
                .when()
               // .get("/assettracking/engineer/0013846/materials")
                .get(bulkSerachUri)
                .then().contentType(ContentType.JSON).extract().response();
        if (response!=null){
            System.out.println("-------Response  is not null");
            jsonResponse = response;
        }else{
            System.out.println("--------Did not gety any response");
        }

//        validateResponse(response);
//                .log()
//                .all();
              //  .statusCode(Integer.parseInt(status));

       // String respMessage = response.
        //System.out.println("-----------Respinse Message : "+ response);
    }

    @Then("^I should see a HTTP response \"([^\"]*)\"$")
    public void i_should_see_a_HTTP_response(String arg1) {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

    @Then("^I am able to search the material$")
    public void searchMaterial() {
        // Write code here that turns the phrase above into concrete actions
        System.out.println("-------------In Step Definition  then part -----");


        SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
                .when()
                .get("/assettracking/engineer/0013846/materials")
                .then()
                .log()
                .all()
                .statusCode(200);
    }

    @When("^I am able to perform cancel for materialCode \"([^\"]*)\",description \"([^\"]*)\",engineer \"([^\"]*)\", owner \"([^\"]*)\", quantity \"([^\"]*)\", date \"([^\"]*)\", time \"([^\"]*)\", requestingEngineer \"([^\"]*)\"$")
    public void i_am_able_to_perform_cancel_for_materialCode_description_engineer_owner_quantity_date_time_requestingEngineer(String materialCode,String description,String engineer,String owner,String quantity,String date, String time, String requestingEngineer) {
        // Write code here that turns the phrase above into concrete actions
        Reserve reserve = getReserve(materialCode, description, engineer, owner, quantity, date,  time,  requestingEngineer);

        response = SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")

                .header("X-Engineer-Lat", "49.123456")
                .header("X-Engineer-Lon", "0.123456")
                .header("X-Engineer-Status", "true")
                .header("X-Request-Id", "0bf74a89-e4d1-4914-9e47-c755154d157b")
                .header("Content-Type", "application/json")
                .header("Authorization", "Basic bGFtYmRhX2Rldl90ZWFtOkxhbWJkYTEyMyE=")
                .header("cache-control", "no-cache")
                .contentType(ContentType.JSON)
                .log().all()  //This will print the request information
                .when()
                .body(reserve)
                .put("/assettracking/material/350075/reservation")
                .then()
                .log()
                .all()
                .statusCode(200);


    }

    private static Reserve getReserve(String materialCode,String description,String engineer,String owner,String quantity,String date, String time, String requestingEngineer){
        Reserve reserve = new Reserve();
        reserve.setMaterialCode(materialCode);
        reserve.setDescription(description);
        reserve.setEngineer(engineer);
        reserve.setOwner(owner);
        reserve.setQuantity(quantity);
        reserve.setDate(date);
        reserve.setTime(time);
        reserve.setRequestingEngineer(requestingEngineer);
        return reserve;

    }

    @When("^I am an engineer able to reserve for materialCode \"([^\"]*)\",description \"([^\"]*)\",engineer \"([^\"]*)\", owner \"([^\"]*)\", quantity \"([^\"]*)\", date \"([^\"]*)\", time \"([^\"]*)\", requestingEngineer \"([^\"]*)\"$")
    public void i_am_able_to_reserve_for_materialCode_description_engineer_owner_quantity_date_time_requestingEngineer(String materialCode,String description,String engineer,String owner,String quantity,String date, String time, String requestingEngineer) {
        // Write code here that turns the phrase above into concrete actions
        Reserve reserve = getReserve(materialCode, description, engineer, owner, quantity, date,  time,  requestingEngineer);
        reservedItem = reserve;
        response = SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")

                .header("X-Engineer-Lat", "49.123456")
                .header("X-Engineer-Lon", "0.123456")
                .header("X-Engineer-Status", "true")
                .header("X-Request-Id", "0bf74a89-e4d1-4914-9e47-c755154d157b")
                .header("Content-Type", "application/json")
                .header("Authorization", "Basic bGFtYmRhX2Rldl90ZWFtOkxhbWJkYTEyMyE=")
                .header("cache-control", "no-cache")
                .contentType(ContentType.JSON)
                .log().all()  //This will print the request information
                .when()
                .body(reserve)
                .post("/assettracking/material/350075/reservation")
                .then()
                .log()
                .all()
                .statusCode(200);

    }

    @When("^I am able to collect the same item$")
    public void i_am_able_to_collect_the_same_item() {
        // Write code here that turns the phrase above into concrete actions
        Reserve reserve = reservedItem;
        SerenityRest.rest().given().auth().basic("lambda_dev_team", "Lambda123!")

                .header("X-Engineer-Lat", "49.123456")
                .header("X-Engineer-Lon", "0.123456")
                .header("X-Engineer-Status", "true")
                .header("X-Request-Id", "0bf74a89-e4d1-4914-9e47-c755154d157b")
                .header("Content-Type", "application/json")
                .header("Authorization", "Basic bGFtYmRhX2Rldl90ZWFtOkxhbWJkYTEyMyE=")
                .header("cache-control", "no-cache")

                .contentType(ContentType.JSON)
                .log().all()  //This will print the request information
                .when()
                .body(reserve)
                .post("/assettracking/material/350075/transfer")
                .then()
//                .log()
//                .all()
                .statusCode(200);
    }

    @Then("^I am able to validate materials for Engineer (\\d+)$")
    public void i_am_able_to_validate_materials_for_Engineer(int arg1) {
        // Write code here that turns the phrase above into concrete actions
        if(jsonResponse!=null){
            ResponseValidator.validateResponse(jsonResponse);
        }else{
            System.out.println("---------------- No Response");
        }

    }

}
