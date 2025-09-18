package io.github.lujian213.timerecorder.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UserInfo implements Resource<String> {
    private final String userId;
    private String userName;
    private Role role;
    private String password;

    public UserInfo(@JsonProperty("userId") String userId) {
        this(userId, userId, Role.USER, userId);
    }

    @JsonCreator
    public UserInfo(@JsonProperty("userId") String userId,
                    @JsonProperty("userName") String userName,
                    @JsonProperty("role") Role role,
                    @JsonProperty("password") String password) {
        this.userId = userId;
        this.userName = userName;
        this.role = role;
        this.password = password;
    }

    public UserInfo(UserInfo userInfo) {
        this.userId = userInfo.userId;
        this.userName = userInfo.userName;
        this.role = userInfo.role;
        this.password = "***";
    }

    public String getUserName() {
        return userName;
    }

    public UserInfo setUserName(String userName) {
        this.userName = userName;
        return this;
    }

    public Role getRole() {
        return role;
    }

    public UserInfo setRole(Role role) {
        this.role = role;
        return this;
    }

    public String getUserId() {
        return userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserInfo{" +
                "userId='" + userId + '\'' +
                ", userName='" + userName + '\'' +
                ", password='" + "[PROTECTED]" + '\'' +
                ", role='" + role + '\'' +
                '}';
    }

    @Override
    @JsonIgnore
    public String getKey() {
        return this.userId;
    }
}
