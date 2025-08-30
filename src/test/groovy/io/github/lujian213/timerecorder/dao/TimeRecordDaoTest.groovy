package io.github.lujian213.timerecorder.dao

import io.github.lujian213.timerecorder.model.TimeRecord
import io.github.lujian213.timerecorder.utils.Constants
import spock.lang.Specification
import spock.lang.TempDir

class TimeRecordDaoTest extends Specification {
    @TempDir
    File tempDir

    def "Save and load"() {
        given:
        def timeRecordDao = new TimeRecordDao(tempDir, 11)

        expect:
        timeRecordDao.load().size() == 0

        when:
        def recordList = [
                new TimeRecord(1).with(true) {
                    userId = "id1"
                    caseId = 11
                    startTime = 10
                    endTime = 20
                    category = "review"
                    comments = "nothing"
                },
                new TimeRecord(2).with(true) {
                    userId = "id2"
                    caseId = 11
                    startTime = 30
                    endTime = 40
                    category = "development"
                    comments = "fix bug"
                }
        ] as List<TimeRecord>
        timeRecordDao.save(recordList)

        then:
        timeRecordDao.getFile().exists()
        new File(tempDir, "${Constants.TIME_RECORDER_FILE_NAME_PREFIX}11.json") == timeRecordDao.getFile()

        when:
        recordList = timeRecordDao.load()

        then:
        recordList.size() == 2
        with(recordList[0]) {
            recordId == 1
            userId == "id1"
            caseId == 11
            startTime == 10
            endTime == 20
            category == "review"
            comments == "nothing"
        }
        with(recordList[1]) {
            recordId == 2
            userId == "id2"
            caseId == 11
            startTime == 30
            endTime == 40
            category == "development"
            comments == "fix bug"
        }
    }
}
