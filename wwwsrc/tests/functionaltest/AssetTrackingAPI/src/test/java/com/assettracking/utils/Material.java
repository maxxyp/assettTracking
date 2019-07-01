package com.assettracking.utils;

public class Material {
    String materialCode;
    String owner;
    String expectedReturnQuantity;
    String quantity;

    String reservedQuantity;
    String storageZone;
    String description;
    String expectedReceiptQuantity;

    public String getMaterialCode() {
        return materialCode;
    }

    public void setMaterialCode(String materialCode) {
        this.materialCode = materialCode;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getExpectedReturnQuantity() {
        return expectedReturnQuantity;
    }

    public void setExpectedReturnQuantity(String expectedReturnQuantity) {
        this.expectedReturnQuantity = expectedReturnQuantity;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getReservedQuantity() {
        return reservedQuantity;
    }

    public void setReservedQuantity(String reservedQuantity) {
        this.reservedQuantity = reservedQuantity;
    }

    public String getStorageZone() {
        return storageZone;
    }

    public void setStorageZone(String storageZone) {
        this.storageZone = storageZone;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExpectedReceiptQuantity() {
        return expectedReceiptQuantity;
    }

    public void setExpectedReceiptQuantity(String expectedReceiptQuantity) {
        this.expectedReceiptQuantity = expectedReceiptQuantity;
    }

    @Override
    public String toString() {
        return "Material{" +
                "materialCode='" + materialCode + '\'' +
                ", owner='" + owner + '\'' +
                ", expectedReturnQuantity='" + expectedReturnQuantity + '\'' +
                ", quantity='" + quantity + '\'' +
                ", reservedQuantity='" + reservedQuantity + '\'' +
                ", storageZone='" + storageZone + '\'' +
                ", description='" + description + '\'' +
                ", expectedReceiptQuantity='" + expectedReceiptQuantity + '\'' +
                '}';
    }

}


