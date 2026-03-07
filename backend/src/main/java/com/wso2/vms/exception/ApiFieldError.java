package com.wso2.vms.exception;

public class ApiFieldError {
    private String field;
    private String message;

    public ApiFieldError(String field, String message) {
        this.field = field;
        this.message = message;
    }

    // Getters & Setters
    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
