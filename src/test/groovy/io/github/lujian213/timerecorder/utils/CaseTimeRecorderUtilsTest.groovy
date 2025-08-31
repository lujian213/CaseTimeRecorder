package io.github.lujian213.timerecorder.utils

import spock.lang.Specification

class CaseTimeRecorderUtilsTest extends Specification {
    def "ToBytesWithBOM"() {
        expect:
        CaseTimeRecorderUtils.toBytesWithBOM(str).length == expectedLength
        where:
        str       | expectedLength
        ""        | 3
        "abc"     | 6
        "中文"    | 9
        "abc中文" | 12
    }
}
