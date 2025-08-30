package io.github.lujian213.timerecorder.service

import io.github.lujian213.timerecorder.dao.CaseDao
import io.github.lujian213.timerecorder.exception.TimeRecorderException
import io.github.lujian213.timerecorder.model.Case
import spock.lang.Specification
import spock.lang.TempDir

import static io.github.lujian213.timerecorder.model.Case.CaseStatus.*

class CaseServiceTest extends Specification {
    @TempDir
    File tempDir

    CaseDao caseDao
    CaseService caseService

    def setup() {
        caseDao = new CaseDao(tempDir)
        def cases = [
                new Case(1).with(true) {
                    caseName = "case1"
                    description = "description1"
                    status = ACTIVE
                },
                new Case(2).with(true) {
                    caseName = "case2"
                    description = "description2"
                    status = CLOSED
                },
                new Case(3).with(true) {
                    caseName = "case3"
                    description = "description3"
                    status = DELETED
                }
        ] as List<Case>

        caseDao.save(cases)

        caseService = new CaseService()
        caseService.setResourceDao(caseDao)
        caseService.init()
    }

    def "init"() {
        expect:
        caseService.resourceMap.size() == 2
        caseService.nextId == 4
    }

    def "getCases"() {
        when:
        caseService.updateResource(new Case(1).with(true) {
            caseName = "case1"
            description = "description1-updated"
            status = DELETED
        } as Case)
        def cases = caseService.getAllResources()

        then:
        cases.size() == 1
        caseService.resourceMap[1].description == "description1-updated"
        caseService.resourceMap[1].status == DELETED
    }

    def "addResource"() {
        when:
        def caseInfo = new Case(caseName: "case4", description: "description4", status: ACTIVE)
        def ret = caseService.addResource(caseInfo)

        then:
        ret.caseId == 4
        caseService.resourceMap.size() == 3
        caseService.resourceMap[4].caseName == "case4"
        caseService.resourceMap[4].description == "description4"
        caseService.resourceMap[4].status == ACTIVE
    }

    def "deleteCase"() {
        when:
        caseService.deleteCase(1)

        then:
        caseService.resourceMap.size() == 2
        caseService.resourceMap[1].caseName == "case1"
        caseService.resourceMap[1].status == DELETED
    }

    def "getCase"() {
        when:
        def caseInfo = caseService.getResource(1)
        then:
        with(caseInfo.get()) {
            caseName == "case1"
            description == "description1"
            status == ACTIVE
        }

        when:
        caseService.updateResource(new Case(1).with(true) {
            caseName = "case1"
            description = "description1-updated"
            status = DELETED
        } as Case)
        caseInfo = caseService.getResource(1)

        then:
        caseInfo.empty
    }

    def "checkCase"() {
        when:
        def caseInfo = caseService.checkResource(1)
        then:
        with(caseInfo) {
            caseName == "case1"
            description == "description1"
            status == ACTIVE
        }

        when:
        caseService.updateResource(new Case(1).with(true) {
            caseName = "case1"
            description = "description1-updated"
            status = DELETED
        } as Case)
        caseService.checkResource(1)

        then:
        thrown(TimeRecorderException)
    }
}
