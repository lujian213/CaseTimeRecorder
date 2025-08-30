package io.github.lujian213.timerecorder.model

import spock.lang.Specification

class CaseTimeRecordsTest extends Specification {
    CaseTimeRecords caseTimeRecords

    def setup() {
        caseTimeRecords = new CaseTimeRecords(1, [
                new TimeRecord(1).with(true) {
                    caseId = 1
                    userId = "id1"
                }
        ] as List<TimeRecord>)
    }

    def "AddTimeRecord"() {
        when:
        def record = new TimeRecord(2).with(true) {
            caseId = 1
            userId = "id1"
        } as TimeRecord
        caseTimeRecords.addTimeRecord(record)

        then:
        caseTimeRecords.timeRecords().size() == 2
        caseTimeRecords.timeRecords().get(1).recordId == 2
    }

    def "RemoveTimeRecord"() {
        when:
        caseTimeRecords.removeTimeRecord(2)
        then:
        caseTimeRecords.timeRecords().size() == 1

        when:
        caseTimeRecords.removeTimeRecord(1)
        then:
        caseTimeRecords.timeRecords().size() == 0
    }

    def "FindTimeRecord"() {
        when:
        def recOpt = caseTimeRecords.findTimeRecord(2)
        then:
        recOpt.empty

        when:
        recOpt = caseTimeRecords.findTimeRecord(1)
        then:
        recOpt.get().recordId == 1
    }

    def "UpdateTimeRecord"() {
        when:
        def record = new TimeRecord(2).with(true) {
            caseId = 1
            userId = "id2"
        } as TimeRecord
        caseTimeRecords.updateTimeRecord(record)
        then:
        caseTimeRecords.timeRecords().size() == 1
        caseTimeRecords.timeRecords().get(0).userId == "id1"

        when:
        record = new TimeRecord(1).with(true) {
            caseId = 1
            userId = "id2"
        } as TimeRecord
        caseTimeRecords.updateTimeRecord(record)
        then:
        caseTimeRecords.timeRecords().size() == 1
        caseTimeRecords.timeRecords().get(0).userId == "id2"
    }
}
