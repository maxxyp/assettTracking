package com.assettracking.testbase;

import io.restassured.RestAssured;
import org.junit.BeforeClass;

public class TestBase {

    @BeforeClass
    public static void init(){

        RestAssured.baseURI = "https://dt.pulsenow.co.uk";
    }
}
