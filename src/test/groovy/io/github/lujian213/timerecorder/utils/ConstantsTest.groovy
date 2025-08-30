package io.github.lujian213.timerecorder.utils


import io.github.lujian213.timerecorder.model.TimeRecord
import spock.lang.Specification

class ConstantsTest extends Specification {
    def "file pattern match"() {
        when:
        def matcher = Constants.TIME_RECORDER_FILE_NAME_PATTERN.matcher(_str)
        def caseId = null
        if (matcher.matches()) {
            caseId = matcher.group("caseId")
        }
        then:
        caseId == _caseId

        where:
        _str                 | _caseId
        "${Constants.TIME_RECORDER_FILE_NAME_PREFIX}1234.json"  | "1234"
    }

    def "csv mapper with TimeRecord"() {
        when:
        def records = [
                new TimeRecord(1).with(true) {
                    userId = "id1"
                    caseId = 1
                    category = "default"
                },
                new TimeRecord(2).with(true) {
                    userId = "id2"
                    caseId = 1
                    category = "default"
                },
                new TimeRecord(3).with(true) {
                    userId = "id3"
                    caseId = 1
                    category = "default"
                },
        ]

        def schema = Constants.CSV_MAPPER.schemaFor(TimeRecord).withHeader()
        String csv = Constants.CSV_MAPPER.writer(schema).writeValueAsString(records)
        print csv
        records = Constants.CSV_MAPPER.readerWithSchemaFor(TimeRecord.class).with(schema)
                .readValues(csv)
                .readAll()
        then:
        records.size() == 3
    }
}
