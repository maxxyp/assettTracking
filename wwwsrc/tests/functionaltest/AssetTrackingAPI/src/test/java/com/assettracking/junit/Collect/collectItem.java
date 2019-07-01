package com.assettracking.junit.Collect;

import com.assettracking.data.Reserve;
import io.restassured.http.ContentType;
import net.serenitybdd.junit.runners.SerenityRunner;
import net.serenitybdd.rest.SerenityRest;
import net.thucydides.core.annotations.Title;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;

import java.util.HashMap;

@RunWith(SerenityRunner.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class collectItem {

    static String materialCode = "350075";
    static String description = "22mm Pump Valve Heavy Duty TOTE";
    static String engineer = "0013846";
    static String owner = "BGS";
    static String quantity = "1";
    static String date = "20190202";
    static String time = "14090100";
    static String requestingEngineer = "0013865";


    @Title("06 - Collect Item")
    @Test
    public void collectItem(){
        Reserve reserve = new Reserve();

        reserve.setMaterialCode(materialCode);
        reserve.setDescription(description);
        reserve.setEngineer(engineer);
        reserve.setOwner(owner);
        reserve.setQuantity(quantity);
        reserve.setDate(date);
        reserve.setTime(time);
        reserve.setRequestingEngineer(requestingEngineer);

       // SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
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

//    @Title("07 - Verify that Item is collected")
//    @Test
//    public void verifyItemIsCollected(){
//
//        String p1 = "findAll{it.quantity=='";
//        String p2 = "'}.get(0)";
//
//        //The findAll function will return an array list and from the array list we are getting the first value.
//        // This array list is actually harsh map
//
//        HashMap<String, Object> value = SerenityRest.rest().given().auth().basic("lambda_dev_team", "Lambda123!")
//                .when()
//                .get("/assettracking/engineer/0013865/materials")
//                .then()
////                .log()
////                .all()
//                .statusCode(200)
//                .extract()
//                .path("findAll{it.quantity==''}.get(4)");
//        System.out.println("The value is: "+value);
//
//
//
//    }

}
