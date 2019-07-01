package com.assettracking.data;

public class Reserve {

    private String materialCode;
    private String description;
    private String engineer;
    private String owner;
    private String quantity;
    private String date;
    private String time;
    private String requestingEngineer;

    public String getMaterialCode() {
        return materialCode;
    }

    public void setMaterialCode(String materialCode) {
        this.materialCode = materialCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEngineer() {
        return engineer;
    }

    public void setEngineer(String engineer) {
        this.engineer = engineer;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getRequestingEngineer() {
        return requestingEngineer;
    }

    public void setRequestingEngineer(String requestingEngineer) {
        this.requestingEngineer = requestingEngineer;
    }

}
