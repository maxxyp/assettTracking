package com.assettracking.junit.LocalVanStock;

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
public class materials {

    @BeforeClass
    public static void init(){

        RestAssured.baseURI="https://dt.pulsenow.co.uk";
    }


    @Title("01 - Materials in van stock Engineer - 0013846")
    @Test
    public void MaterialsForEngineer0013846() {
        SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
                .when()
                .get("/assettracking/engineer/0013846/materials")
                .then()
                .log()
                .all()
                .statusCode(200);
    }

    @Title("02 - Materials in van stock Engineer - 0013865")
    @Test
    public void MaterialsForEngineer0013865() {
        SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
                .when()
                .get("/assettracking/engineer/0013865/materials")
                .then()
                .log()
                .all()
                .statusCode(200);
    }

}
