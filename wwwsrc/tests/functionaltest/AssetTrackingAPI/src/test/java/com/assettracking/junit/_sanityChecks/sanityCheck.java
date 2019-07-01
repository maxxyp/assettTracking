package com.assettracking.junit._sanityChecks;

import io.restassured.RestAssured;
import net.serenitybdd.rest.SerenityRest;
import net.thucydides.core.annotations.Manual;
import net.thucydides.core.annotations.Pending;
import net.thucydides.core.annotations.Title;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;

public class sanityCheck {


    @BeforeClass
    public static void init(){

        RestAssured.baseURI="https://dt.pulsenow.co.uk";

    }


    @Title("This is a Sanity Check for Reporting")
    @Test
    public void Material_HVT() {
        SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
                .when()
                .get("/assettracking/material/hvt")
                .then()
                .log()
                .all()
                .statusCode(200);
    }

    @Test
    public void thisIsaFailing(){
        SerenityRest.given().auth().basic("lambda_dev_team", "Lambda123!")
                .when()
                .get("/assettracking/material/hvt")
                .then()
                .statusCode(500);
    }

    @Pending
    @Test
    public void thisIsAPendingTest(){

    }

    @Ignore
    @Test
    public void thisIsASkippedTest(){

    }

    @Test
    public void thisIsATestWithError(){
        System.out.println("This is an error"+(5/0));

    }

    @Test
    public void fileDoesNotExist() throws FileNotFoundException {
        File file = new File("/Users/maxwellnwajei/Documents/file.txt");
        FileReader fr = new FileReader(file);

    }

    @Manual
    @Test
    public void thisIsManualTest(){

        System.out.println("This is manual testing");

    }
}
