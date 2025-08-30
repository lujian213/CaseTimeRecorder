package io.github.lujian213.timerecorder.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UserInfo implements Resource<String> {
    private final String userId;
    private String userName;
    private String role;

    @JsonCreator
    public UserInfo(@JsonProperty("userId") String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public UserInfo setUserName(String userName) {
        this.userName = userName;
        return this;
    }

    public String getRole() {
        return role;
    }

    public UserInfo setRole(String role) {
        this.role = role;
        return this;
    }

    public String getUserId() {
        return userId;
    }

    @Override
    public String toString() {
        return "UserInfo{" +
                "userId='" + userId + '\'' +
                ", userName='" + userName + '\'' +
                ", role='" + role + '\'' +
                '}';
    }

    @Override
    @JsonIgnore
    public String getKey() {
        return this.userId;
    }
}
