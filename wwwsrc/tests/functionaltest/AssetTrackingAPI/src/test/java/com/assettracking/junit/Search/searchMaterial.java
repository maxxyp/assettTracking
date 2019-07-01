package com.assettracking.junit.Search;

import io.restassured.RestAssured;
import net.serenitybdd.junit.runners.SerenityRunner;
import net.serenitybdd.rest.SerenityRest;
import net.thucydides.core.annotations.Title;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;

@RunWith(SerenityRunner.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class searchMaterial {

    @BeforeClass
    public static void init(){

        RestAssured.baseURI="https://dt.pulsenow.co.uk";

    }


    @Title("03 - Search Item")
    @Test

    public void SearchForMaterial() {
        SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
                .header("X-Engineer-Lat", "49.123456")
                .header("X-Engineer-Lon", "0.123456")
                .header("X-Engineer-Status", "true")
                .header("X-Request-Id", "0bf74a89-e4d1-4914-9e47-c755154d157b")
                .header("cache-control", "no-cache")
                .when()
                .get("/assettracking/material/350075")
                .then()
                .log()
                .all()
                .statusCode(200);
    }
}
