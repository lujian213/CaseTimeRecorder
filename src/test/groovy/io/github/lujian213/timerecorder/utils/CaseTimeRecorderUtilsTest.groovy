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

    def "fileNameInResponse"() {
        expect:
        CaseTimeRecorderUtils.fileNameInResponse(name) == expected
        where:
        name          | expected
        "abc"         | "UTF-8''abc"
        "a b c.txt"   | "UTF-8''a%20b%20c.txt"
        "中文.txt"    | "UTF-8''%E4%B8%AD%E6%96%87.txt"
        "a 中文 .txt" | "UTF-8''a%20%E4%B8%AD%E6%96%87%20.txt"
    }
}
