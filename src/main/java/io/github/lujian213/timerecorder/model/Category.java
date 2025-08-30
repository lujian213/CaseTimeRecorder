package io.github.lujian213.timerecorder.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Category implements Resource<String> {
    private final String name;

    @JsonCreator
    public Category(@JsonProperty("name") String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    @JsonIgnore
    public String getKey() {
        return name;
    }
}
