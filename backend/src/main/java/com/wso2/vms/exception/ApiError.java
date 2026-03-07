package com.wso2.vms.exception;

import java.util.ArrayList;
import java.util.List;

public class ApiError {

    private int status;
    private String error;
    private String message;
    private String path;
    private long timestamp;
    private List<ApiFieldError> fieldErrors = new ArrayList<>();

    // Full constructor
    public ApiError(int status, String error, String message, String path) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.timestamp = System.currentTimeMillis();
    }

    // Getters & Setters
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public void addFieldError(String field, String message) {
        ApiFieldError error = new ApiFieldError(field, message);
        fieldErrors.add(error);
    }

    public List<ApiFieldError> getFieldErrors() {
        return fieldErrors;
    }
}
