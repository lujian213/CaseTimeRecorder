package io.github.lujian213.timerecorder.service


import io.github.lujian213.timerecorder.dao.CaseTimeRecordsDao
import io.github.lujian213.timerecorder.exception.TimeRecorderException
import io.github.lujian213.timerecorder.model.Case
import io.github.lujian213.timerecorder.model.CaseTimeRecords
import io.github.lujian213.timerecorder.model.TimeRecord
import io.github.lujian213.timerecorder.utils.Constants
import spock.lang.Specification
import spock.lang.TempDir

import static io.github.lujian213.timerecorder.model.Case.CaseStatus.ACTIVE
import static io.github.lujian213.timerecorder.model.Case.CaseStatus.CLOSED

class CaseTimeRecordsServiceTest extends Specification {
    @TempDir
    File tempDir

    CaseTimeRecordsDao caseTimeRecordsDao
    CaseTimeRecordsService caseTimeRecordsService
    CaseService caseService

    def setup() {
        caseTimeRecordsDao = new CaseTimeRecordsDao(tempDir)
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
                ] as List<TimeRecord>),
                new CaseTimeRecords(3, [
                        new TimeRecord(5).with(true){
                            userId = "id1"
                            caseId = 2
                            startTime = 1000
                            endTime = 2000
                        },
                        new TimeRecord(6).with(true){
                            userId = "id2"
                            caseId = 2
                            startTime = 2000
                            endTime = 3000
                        }
                ] as List<TimeRecord>)
        ] as List<CaseTimeRecords>
        caseTimeRecordsDao.save(caseTimeRecordsList)

        caseService = Spy(CaseService) {
            getResource(_) >> {int id  -> Optional.ofNullable(
                    switch (id) {
                        case 3 -> null
                        default -> new Case(id).with(true) {
                            caseName = "case${id}"
                            description = "description${id}"
                            status = id % 2 == 0 ? CLOSED : ACTIVE
                        }
                    })
            }
            checkResource(_) >> {int id  ->
                    switch (id) {
                        case 3 -> throw new TimeRecorderException()
                        default -> new Case(id).with(true) {
                            caseName = "case${id}"
                            description = "description${id}"
                            status = id % 2 == 0 ? CLOSED : ACTIVE
                        }
                    }
            }
        }
        caseTimeRecordsService = new CaseTimeRecordsService()
        caseTimeRecordsService.setCaseService(caseService)
        caseTimeRecordsService.setResourceDao(caseTimeRecordsDao)
        caseTimeRecordsService.init()
    }

    def "init"() {
        expect:
        caseTimeRecordsService.resourceMap.size() == 2
        caseTimeRecordsService.nextId == 7
        new File(tempDir, "${Constants.TIME_RECORDER_FILE_NAME_PREFIX}1.json").exists()
        new File(tempDir, "${Constants.TIME_RECORDER_FILE_NAME_PREFIX}2.json").exists()
        !new File(tempDir, "${Constants.TIME_RECORDER_FILE_NAME_PREFIX}3.json").exists()
    }

    def "addTimeRecord"() {
        when:
        def record = new TimeRecord(0).with(true) {
            userId = "id3"
            caseId = 4
            startTime = 3000
            endTime = 4000
        } as TimeRecord

        def addedRecord = caseTimeRecordsService.addTimeRecord(record)
        then:
        addedRecord.recordId == 7
        caseTimeRecordsService.resourceMap.size() == 3
        caseTimeRecordsService.resourceMap[4].timeRecords().size() == 1
        new File(tempDir, "${Constants.TIME_RECORDER_FILE_NAME_PREFIX}4.json").exists()
    }

    def "startRecord"() {
        when:
        def record = caseTimeRecordsService.startRecord(1, "id3", "email", "some comments")
        then:
        with(record) {
            recordId == 7
            userId == "id3"
            caseId == 1
            startTime > 0
            endTime == -1
            category == "email"
            comments == "some comments"
        }
        with(caseTimeRecordsService.resourceMap) {
            size() == 2
            it[1].timeRecords()[2].recordId == 7
        }
    }

    def "stopRecord"() {
        when:
        caseTimeRecordsService.stopRecord(1, 5)
        then:
        thrown(TimeRecorderException)

        when:
        caseTimeRecordsService.stopRecord(3, 5)
        then:
        thrown(TimeRecorderException)

        when:
        caseTimeRecordsService.startRecord(1, "id3", "email", "some comments")
        def record = caseTimeRecordsService.stopRecord(1, 7)
        then:
        with(record) {
            recordId == 7
            userId == "id3"
            caseId == 1
            startTime > 0
            endTime >= startTime
            category == "email"
            comments == "some comments"
        }
        with(caseTimeRecordsService.resourceMap) {
            size() == 2
            it[1].timeRecords()[2].recordId == 7
        }

        when:
        def recordsList = new CaseTimeRecordsDao(tempDir).load()
        then:
        recordsList.find {it.caseId() == 1}.findTimeRecord(7).get().category == "email"
    }

    def "updateTimeRecord"() {
        when:
        def record = new TimeRecord(7).with(true) {
            userId = "alex"
            caseId = 1
            startTime = 3000
            endTime = 4000
        } as TimeRecord

        caseTimeRecordsService.updateTimeRecord(record)
        then:
        thrown(TimeRecorderException)

        when:
        record.caseId = 3
        caseTimeRecordsService.updateTimeRecord(record)
        then:
        thrown(TimeRecorderException)

        when:
        record.caseId = 1
        record.recordId = 1
        record = caseTimeRecordsService.updateTimeRecord(record)
        then:
        with(record) {
            recordId == 1
            userId == "alex"
        }
        with(caseTimeRecordsService.resourceMap) {
            size() == 2
            it[1].timeRecords().find {it.recordId == 1}.userId == "alex"
        }

        when:
        def recordsList = new CaseTimeRecordsDao(tempDir).load()
        then:
        recordsList.find {it.caseId() == 1}.findTimeRecord(1).get().userId == "alex"
    }

    def "deleteTimeRecord"() {
        when:
        caseTimeRecordsService.deleteTimeRecord(1, 5)
        then:
        thrown(TimeRecorderException)

        when:
        caseTimeRecordsService.deleteTimeRecord(3, 5)
        then:
        thrown(TimeRecorderException)

        when:
        caseTimeRecordsService.deleteTimeRecord(1, 1)
        then:
        with(caseTimeRecordsService.resourceMap) {
            size() == 2
            !it[1].timeRecords().find {it.recordId == 1}
        }
    }

    def "findTimeRecord"() {
        when:
        def recOpt = caseTimeRecordsService.findTimeRecord(3, 1)
        then:
        recOpt.empty

        when:
        recOpt = caseTimeRecordsService.findTimeRecord(1, 4)
        then:
        recOpt.empty

        when:
        recOpt = caseTimeRecordsService.findTimeRecord(1, 1)
        then:
        with(recOpt.get()) {
            userId == "id1"
            caseId == 1
            startTime == 1000
            endTime == 2000
        }
    }

    def "exportTimeRecords"() {
        when:
        String csv = caseTimeRecordsService.exportTimeRecords(2)
        print csv
        then:
        csv.contains("用户")
        csv.contains("id1")
        csv.contains("id2")
    }

    def "getResource"() {
        when:
        def caseTimeRecords = caseTimeRecordsService.getResource(1)
        then:
        caseTimeRecords.get().caseId() == 1
        caseTimeRecords.get().timeRecords().size() == 2
        when:
        caseTimeRecords = caseTimeRecordsService.getResource(4)
        then:
        caseTimeRecords.get().caseId() == 4
        caseTimeRecords.get().timeRecords().empty

        when:
        caseTimeRecordsService.getResource(3)
        then:
        thrown(TimeRecorderException)
    }

    def "RecordToMap"() {
        given:
        def records = [
                new TimeRecord(1).with(true) {
                    userId = "id1"
                    caseId = 1
                    startTime = System.currentTimeMillis()
                    endTime = startTime + 3600 * 1000
                    category = "default"
                    comments = "some comments"
                },
                new TimeRecord(2).with(true) {
                    userId = "id2"
                    caseId = 1
                    startTime = System.currentTimeMillis()
                    endTime = -1
                    category = "default"
                    comments = "some comments"
                }
        ] as List<TimeRecord>
        when:
        def map = CaseTimeRecordsService.recordToMap(records[0])
        then:
        with(map) {
            it["用户"] == "id1"
            it["耗时（分钟）"] == 60
            it["类别"] == "default"
            it["备注"] == "some comments"
            it["开始时间"]
            it["结束时间"]
        }

        when:
        map = CaseTimeRecordsService.recordToMap(records[1])
        then:
        with(map) {
            it["用户"] == "id2"
            it["耗时（分钟）"] == 0
            it["类别"] == "default"
            it["备注"] == "some comments"
            it["开始时间"]
            !it["结束时间"]
        }
    }

    def "serializeMapListToCsv"() {
        when:
        def mapList = [
                [
                        "用户": "id1",
                        "开始时间": "2024-01-01 10:00:00",
                        "结束时间": "2024-01-01 11:00:00",
                        "耗时（分钟）": 60,
                        "类别": "default",
                        "备注": "some comments"
                ],
                [
                        "用户": "id2",
                        "开始时间": "2024-01-01 11:00:00",
                        "结束时间": "",
                        "耗时（分钟）": 0,
                        "类别": "default",
                        "备注": "some comments"
                ]
        ]
        String csv = CaseTimeRecordsService.serializeMapListToCsv(mapList)
        print csv
        then:
        csv.contains("用户")
    }
}
