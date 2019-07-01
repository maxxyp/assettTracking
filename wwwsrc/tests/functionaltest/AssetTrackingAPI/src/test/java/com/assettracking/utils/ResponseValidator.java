package com.assettracking.utils;

import io.restassured.response.Response;
import org.junit.Assert;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class ResponseValidator {



    public static Material constructMaterial(String materialCode,String description,String owner,String quantity,String expectedQuantity,String storageZone){
        Material mat1= new Material();
        mat1.setMaterialCode(materialCode);
        mat1.setDescription(description);
        mat1.setOwner(owner);
        mat1.setQuantity(quantity);
        mat1.setExpectedReturnQuantity(expectedQuantity);
        mat1.setStorageZone(storageZone);

        return mat1;
    }

    public static void validateResponse(Response response){

        Material material1 = constructMaterial("109007","Thermistor Sime Special","BGS","0","0","Staines");
        Material material2 = constructMaterial("109007","Thermistor Sime Special","BGS","0","0","AreaG? ");

        List<Material> matList= new ArrayList<>();
        matList.add(material1);
        matList.add(material2);

        Material m= null;

        String obj =  response.asString();
        //  response.jsonPath().get().toString();
        // ArrayList<Map<String,?>> jsonAsArrayList = RestAssured.from(jsonAsString).get("");
        System.out.println("-------------> Response Object :"+obj);


        List<Map<String, String>> materialDetail = response.jsonPath().get("");

        System.out.println("List size is : "+materialDetail.size());

        Iterator itr = (Iterator) materialDetail.iterator();
        int listCounter=0;

        while (itr.hasNext() && listCounter<matList.size()){
            Map<String,String> material = (Map<String,String>)itr.next();

            m=matList.get(listCounter);

            System.out.println("Expected Values");
            System.out.println(m.toString());

            System.out.println("Actual Values");

            System.out.println("materialCode:"+material.get("materialCode")+", description: "+material.get("description")+",storageZone:"+material.get("storageZone")+" Quantity: "+(Object)material.get("quantity"));

            listCounter++;

            Assert.assertEquals("Material Code is not equal",m.getMaterialCode(),material.get("materialCode"));

            Assert.assertEquals("Quantity is not equal",Integer.parseInt(m.getQuantity()),(Object)material.get("quantity"));

            Assert.assertEquals("Expected Return Quantity is not equal",Integer.parseInt(m.getExpectedReturnQuantity()),(Object)material.get("expectedReturnQuantity"));
            Assert.assertEquals("Storage Zone is not equal",m.getStorageZone(),(Object)material.get("storageZone"));
            Assert.assertEquals("Owner is not equal",m.getOwner(),material.get("owner"));
            Assert.assertEquals("Description is not equal",m.getDescription(),material.get("description"));

        }
    }
}
