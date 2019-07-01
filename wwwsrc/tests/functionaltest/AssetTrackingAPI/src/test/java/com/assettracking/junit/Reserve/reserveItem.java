package com.assettracking.junit.Reserve;

import com.assettracking.data.Materials;
import com.assettracking.data.Reserve;
import com.assettracking.testbase.TestBase;
import io.restassured.http.ContentType;
import net.serenitybdd.junit.runners.SerenityRunner;
import net.serenitybdd.rest.SerenityRest;
import net.thucydides.core.annotations.Title;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;

@RunWith(SerenityRunner.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class reserveItem extends TestBase{

    static String materialCode = "350075";
    static String description = "22mm Pump Valve Heavy Duty TOTE";
    static String engineer = "0013846";
    static String owner = "BGS";
    static String quantity = "1";
    static String date = "20190202";
    static String time = "14090100";
    static String requestingEngineer = "0013865";


    @Title("04 - Reserve Item from Engineer Nearby")
    @Test
    public void reserveItemEngineerNearBy(){
        Reserve reserve = new Reserve();

        reserve.setMaterialCode(materialCode);
        reserve.setDescription(description);
        reserve.setEngineer(engineer);
        reserve.setOwner(owner);
        reserve.setQuantity(quantity);
        reserve.setDate(date);
        reserve.setTime(time);
        reserve.setRequestingEngineer(requestingEngineer);


        SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")

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

}
