package io.github.lujian213.timerecorder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Set;

public record UserCaseBinding(String userId, Set<Integer> caseSet) implements Resource<String> {
    public void addCase(int caseId) {
        synchronized(caseSet) {
            caseSet.add(caseId);
        }
    }
    public void removeCase(int caseId) {
        synchronized(caseSet) {
            caseSet.remove(caseId);
        }
    }

    @Override
    @JsonIgnore
    public String getKey() {
        return userId;
    }
}
