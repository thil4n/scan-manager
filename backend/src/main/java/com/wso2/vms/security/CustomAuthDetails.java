package com.wso2.vms.security;

public class CustomAuthDetails {
    private final String userId;

    public CustomAuthDetails(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }
}
