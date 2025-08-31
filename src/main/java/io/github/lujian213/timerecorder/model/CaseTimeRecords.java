package io.github.lujian213.timerecorder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.Optional;

public record CaseTimeRecords(int caseId, List<TimeRecord> timeRecords) implements Resource<Integer>{
    @Override
    @JsonIgnore
    public Integer getKey() {
        return caseId;
    }

    public TimeRecord addTimeRecord(TimeRecord timeRecord) {
        this.timeRecords.add(timeRecord);
        return timeRecord;
    }

    public boolean removeTimeRecord(int recordId) {
        return this.timeRecords.removeIf(record->record.getRecordId() == recordId);
    }

    public Optional<TimeRecord> findTimeRecord(int recordId) {
        return this.timeRecords.stream().filter(record->record.getRecordId() == recordId)
                .findFirst()
                .map(TimeRecord::copy);
    }

    public TimeRecord updateTimeRecord(TimeRecord timeRecord) {
        if (this.timeRecords.removeIf(record->record.getRecordId() == timeRecord.getRecordId())) {
            this.timeRecords.add(timeRecord);
        }
        return timeRecord;
    }
}
