package io.github.lujian213.timerecorder.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TimeRecord implements Resource<Integer>{
    private int recordId;
    private String userId;
    private int caseId;
    private long startTime = System.currentTimeMillis();
    private long endTime = -1;
    private String category;
    private String comments;

    @JsonCreator
    public TimeRecord(@JsonProperty("recordId") int recordId) {
        this.recordId = recordId;
    }

    public TimeRecord() {
        this(-1);
    }

    public TimeRecord setRecordId(int recordId) {
        this.recordId = recordId;
        return this;
    }

    public String getUserId() {
        return userId;
    }

    public TimeRecord setUserId(String userId) {
        this.userId = userId;
        return this;
    }

    public int getCaseId() {
        return caseId;
    }

    public TimeRecord setCaseId(int caseId) {
        this.caseId = caseId;
        return this;
    }

    public long getStartTime() {
        return startTime;
    }

    public TimeRecord setStartTime(long startTime) {
        this.startTime = startTime;
        return this;
    }

    public long getEndTime() {
        return endTime;
    }

    public TimeRecord setEndTime(long endTime) {
        this.endTime = endTime;
        return this;
    }

    public String getCategory() {
        return category;
    }

    public TimeRecord setCategory(String category) {
        this.category = category;
        return this;
    }

    public String getComments() {
        return comments;
    }

    public TimeRecord setComments(String comments) {
        this.comments = comments;
        return this;
    }

    public int getRecordId() {
        return recordId;
    }

    @Override
    @JsonIgnore
    public Integer getKey() {
        return this.recordId;
    }

    @JsonIgnore
    public int getDurationMinute() {
        return endTime < 0 ? 0 : (int) ((endTime - startTime) / 60000);
    }

    public void stop() {
        this.endTime = System.currentTimeMillis();
    }

    public TimeRecord copy() {
        TimeRecord tr = new TimeRecord(this.recordId);
        tr.setUserId(this.userId);
        tr.setCaseId(this.caseId);
        tr.setStartTime(this.startTime);
        tr.setEndTime(this.endTime);
        tr.setCategory(this.category);
        tr.setComments(this.comments);
        return tr;
    }

    public TimeRecord copyFrom(TimeRecord other) {
        this.userId = other.userId;
        this.startTime = other.startTime;
        this.endTime = other.endTime;
        this.category = other.category;
        this.comments = other.comments;
        return this;
    }
}
