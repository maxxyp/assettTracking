package com.assettracking.data;

public class Materials {

    private String materialCode;
    private int engineer;
    private String owner;
    private int quantity;

    private int date;
    private int time;
    private int receiptQuantity;
    private int id;
    private String jobId;

    public String getMaterialCode(String materialCode) {

        return this.materialCode;
    }

    public void setMaterialCode(String materialCode) {
        this.materialCode = materialCode;
    }

    public int getEngineer(int engineer) {
        return this.engineer;
    }

    public void setEngineer(int engineer) {
        this.engineer = engineer;
    }

    public String getOwner(String owner) {
        return this.owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public int getQuantity(int quantity) {
        return this.quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getDate(int date) {
        return this.date;
    }

    public void setDate(int date) {
        this.date = date;
    }

    public int getTime(int time) {
        return this.time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    public int getReceiptQuantity(int receiptQuantity) {
        return this.receiptQuantity;
    }

    public void setReceiptQuantity(int receiptQuantity) {
        this.receiptQuantity = receiptQuantity;
    }

    public int getId(int id) {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getJobId(String jobId) {
        return this.jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }
}
