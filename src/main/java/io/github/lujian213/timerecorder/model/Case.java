package io.github.lujian213.timerecorder.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Case implements Resource<Integer> {
    public enum CaseStatus {
        ACTIVE,
        CLOSED,
        DELETED
    }
    private int caseId;
    private String description;
    private String caseName;
    private CaseStatus status = CaseStatus.ACTIVE;

    @JsonCreator
    public Case(@JsonProperty("caseId") int caseId) {
        this.caseId = caseId;
    }

    public Case() {
        this(-1);
    }

    @Override
    @JsonIgnore
    public Integer getKey() {
        return caseId;
    }

    public String getDescription() {
        return description;
    }

    public Case setDescription(String description) {
        this.description = description;
        return this;
    }

    public String getCaseName() {
        return caseName;
    }

    public Case setCaseName(String caseName) {
        this.caseName = caseName;
        return this;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public Case setStatus(CaseStatus status) {
        this.status = status;
        return this;
    }

    public int getCaseId() {
        return caseId;
    }

    public Case setCaseId(int caseId) {
        this.caseId = caseId;
        return this;
    }

    public Case copy() {
        Case c = new Case(caseId);
        c.setCaseName(caseName);
        c.setDescription(description);
        c.setStatus(status);
        return c;
    }

    @Override
    public String toString() {
        return "Case{" +
                "caseId=" + caseId +
                ", description='" + description + '\'' +
                ", caseName='" + caseName + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
