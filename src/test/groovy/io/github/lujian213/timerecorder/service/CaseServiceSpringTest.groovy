package io.github.lujian213.timerecorder.service

import io.github.lujian213.timerecorder.dao.CaseDao
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

@SpringBootTest(classes = CaseService)
@Import([CaseDao])
class CaseServiceSpringTest extends Specification {
    @Autowired
    CaseService caseService

    def "check availability"() {
        expect:
        caseService
    }
}
