package io.github.lujian213.timerecorder.dao

import io.github.lujian213.timerecorder.model.CaseTimeRecords
import io.github.lujian213.timerecorder.model.TimeRecord
import spock.lang.Specification
import spock.lang.TempDir

class CaseTimeRecordsDaoTest extends Specification {
    @TempDir
    File tempDir

    def "Save and load"() {
        given:
        def caseTimeRecordsDao = new CaseTimeRecordsDao(tempDir)

        expect:
        caseTimeRecordsDao.load().size() == 0

        when:
        def caseTimeRecordsList = [
                new CaseTimeRecords(1, [
                    new TimeRecord(1).with(true){
                        userId = "id1"
                        caseId = 1
                        startTime = 1000
                        endTime = 2000
                    },
                    new TimeRecord(2).with(true){
                        userId = "id2"
                        caseId = 1
                        startTime = 2000
                        endTime = 3000
                    }
                 ] as List<TimeRecord>),
                new CaseTimeRecords(2, [
                   new TimeRecord(3).with(true){
                       userId = "id1"
                       caseId = 2
                       startTime = 1000
                       endTime = 2000
                   },
                   new TimeRecord(4).with(true){
                       userId = "id2"
                       caseId = 2
                       startTime = 2000
                       endTime = 3000
                   }
                ] as List<TimeRecord>)
        ] as List<CaseTimeRecords>
        caseTimeRecordsDao.save(caseTimeRecordsList)

        then:
        caseTimeRecordsDao.getTimeRecordDao(1).file.exists()
        caseTimeRecordsDao.getTimeRecordDao(2).file.exists()

        when:
        caseTimeRecordsList = caseTimeRecordsDao.load()

        then:
        caseTimeRecordsList.size() == 2
        with(caseTimeRecordsList[0])    {
            caseId() == 1
            timeRecords().size() == 2
            with(timeRecords().get(0)) {
                recordId == 1
                userId == "id1"
                caseId == 1
                startTime == 1000
                endTime == 2000
            }
            with(timeRecords().get(1)) {
                recordId == 2
                userId == "id2"
            }
        }
        with(caseTimeRecordsList[1])    {
            caseId() == 2
            timeRecords().size() == 2
            with(timeRecords().get(0)) {
                recordId == 3
                userId == "id1"
                caseId == 2
            }
            with(timeRecords().get(1)) {
                recordId == 4
                userId == "id2"
            }
        }
    }
}
