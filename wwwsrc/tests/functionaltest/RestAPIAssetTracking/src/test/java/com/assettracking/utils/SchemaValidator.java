package com.assettracking.utils;

import org.everit.json.schema.Schema;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.json.JSONTokener;
import java.io.File;
import java.io.FileInputStream;

import java.io.InputStream;

public class SchemaValidator {

    public  void validateSchema(){

        System.out.println("------------- In Schema Validator ");

        try {
            File schemaFile = new File("src/test/resources/schema.json");
            InputStream inputStream = new FileInputStream(schemaFile);

            JSONObject jsonSchema = new JSONObject(new JSONTokener(inputStream));

            System.out.println("------------- Json Schema :  " + jsonSchema);

            File dataFile = new File("src/test/resources/validJson.json");
            InputStream dataInputStream = new FileInputStream(dataFile);

            JSONObject jsonOubject = new JSONObject(new JSONTokener(dataInputStream));

            Schema schema = SchemaLoader.load(jsonSchema);
            System.out.println("------------- Json Object :   " + jsonOubject);
            schema.validate(jsonOubject);
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}
