package io.github.lujian213.timerecorder.model

import spock.lang.Specification

class TimeRecordTest extends Specification {
    def "GetKey and DurationMinute"() {
        when:
        def tr = new TimeRecord(1).with(true) {
            caseId = 123
        } as TimeRecord

        then:
        tr.key == 1
        tr.durationMinute == 0

        when:
        tr.endTime = tr.startTime + 30 * 60 * 1000
        then:
        tr.durationMinute == 30
    }

    def "Stop"() {
        when:
        def tr = new TimeRecord(1).with(true) {
            caseId = 123
        } as TimeRecord
        Thread.sleep(10)
        tr.stop()

        then:
        tr.endTime > tr.startTime
    }

    def "Copy"() {
        when:
        def tr = new TimeRecord(1).with(true) {
            caseId = 123
            startTime = System.currentTimeMillis()
            userId = "id1"
            category = "cat1"
            comments = "test"
            endTime = startTime + 30 * 60 * 1000
        } as TimeRecord
        def tr2 = tr.copy()

        then:
        tr2.recordId == tr.recordId
        tr2.userId == tr.userId
        tr2.caseId == tr.caseId
        tr2.startTime == tr.startTime
        tr2.endTime == tr.endTime
        tr2.comments == tr.comments
        tr2.category == tr.category
    }

    def "CopyFrom"() {
        when:
        def tr = new TimeRecord(1).with(true) {
            caseId = 123
            startTime = System.currentTimeMillis()
            userId = "id1"
            category = "cat1"
            comments = "test"
            endTime = startTime + 30 * 60 * 1000
        } as TimeRecord
        def tr2 = new TimeRecord(2).with(true) {
            caseId = 456
            startTime = System.currentTimeMillis() - 1000 * 60 * 60
            userId = "id2"
            category = "cat2"
            comments = "test2"
            endTime = startTime + 15 * 60 * 1000
        } as TimeRecord
        tr2.copyFrom(tr)

        then:
        tr2.recordId == 2
        tr2.caseId == 456
        tr2.userId == tr.userId
        tr2.startTime == tr.startTime
        tr2.endTime == tr.endTime
        tr2.comments == tr.comments
        tr2.category == tr.category
    }
}
