package io.github.lujian213.timerecorder.controller

import io.github.lujian213.timerecorder.model.Case
import io.github.lujian213.timerecorder.model.CaseTimeRecords
import io.github.lujian213.timerecorder.model.Category
import io.github.lujian213.timerecorder.model.TimeRecord
import io.github.lujian213.timerecorder.service.CaseService
import io.github.lujian213.timerecorder.service.CaseTimeRecordsService
import io.github.lujian213.timerecorder.service.MiscService
import io.github.lujian213.timerecorder.utils.CaseTimeRecorderUtils
import io.github.lujian213.timerecorder.utils.Constants
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import spock.lang.Specification

import static io.github.lujian213.timerecorder.model.Case.CaseStatus.ACTIVE
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@WebMvcTest(TimeRecorderController)
class TimeRecorderControllerTest extends Specification {
    @SpringBean
    CaseService caseService = Mock(CaseService)
    @SpringBean
    CaseTimeRecordsService caseTimeRecordsService = Mock(CaseTimeRecordsService)
    @SpringBean
    MiscService miscService = Mock(MiscService)

    @Autowired
    MockMvc mockMvc

    def "getCategories"() {
        when:
        def categories = [new Category("cat1"), new Category("cat2")] as List<Category>
        miscService.getAllResources() >> categories
        then:
        mockMvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(categories)))
    }

    def "startTimeRecord"() {
        when:
        def record = new TimeRecord(1).with(true) {
            caseId = 1
            userId = "user1"
            category = "cat1"
            comments = "comm1"
        }
        1 * caseTimeRecordsService.startRecord(1, "user1", "cat1", "comm1") >> record
        then:
        mockMvc.perform(post("/record/start").param("caseId", "1")
                .param("userId", "user1").param("category", "cat1")
                .param("comments", "comm1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(record)))
    }

    def "stopTimeRecord"() {
        when:
        def record = new TimeRecord(1).with(true) {
            caseId = 2
            userId = "user1"
            category = "cat1"
            comments = "comm1"
        }
        1 * caseTimeRecordsService.stopRecord(2, 1) >> record
        then:
        mockMvc.perform(post("/record/stop")
                .param("caseId", "2")
                .param("recordId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(record)))
    }

    def "newTimeRecord"() {
        when:
        def record = new TimeRecord(1).with(true) {
            caseId = 2
            userId = "user1"
            category = "cat1"
            comments = "comm1"
        }
        1 * caseTimeRecordsService.addTimeRecord(_) >> record
        then:
        mockMvc.perform(put("/record").contentType(MediaType.APPLICATION_JSON)
                .content(Constants.MAPPER.writeValueAsString(record)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(record)))
    }

    def "updateTimeRecord"() {
        when:
        def record = new TimeRecord(1).with(true) {
            caseId = 2
            userId = "user1"
            category = "cat1"
            comments = "comm1"
        }
        1 * caseTimeRecordsService.updateTimeRecord(_) >> record
        then:
        mockMvc.perform(post("/record").contentType(MediaType.APPLICATION_JSON)
                .content(Constants.MAPPER.writeValueAsString(record)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(record)))
    }

    def "deleteTimeRecord"() {
        when:
        1 * caseTimeRecordsService.deleteTimeRecord(2, 1) >> {}
        then:
        mockMvc.perform(delete("/record").param("caseId", "2")
                .param("recordId", "1"))
                .andExpect(status().isOk())
    }

    def "getAllTimeRecords"() {
        when:
        def records = new CaseTimeRecords(1, [
                new TimeRecord(1).with(true) {
                    caseId = 1
                    userId = "user1"
                    category = "cat1"
                    comments = "comm1"
                },
                new TimeRecord(2).with(true) {
                    caseId = 1
                    userId = "user2"
                    category = "cat2"
                    comments = "comm2"
                }
        ] as List<TimeRecord>)
        1 * caseTimeRecordsService.checkResource(1) >> records
        then:
        mockMvc.perform(get("/records/{caseId}", 1))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(records)))
    }

    def "exportInvests"() {
        when:
        def fileContent = "a,b,c\n1,2,3"
        1 * caseTimeRecordsService.exportTimeRecords(1) >> fileContent
        1 * caseService.checkResource(1) >> new Case(1).with(true) {
            caseName = "case1"
            status = ACTIVE
        }
        then:
        mockMvc.perform(get("/exportrecords/{caseId}", 1))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.valueOf("text/csv;charset=UTF-8")))
                .andExpect(content().bytes(CaseTimeRecorderUtils.toBytesWithBOM(fileContent)))
                .andExpect(header().string("Content-Disposition", 'attachment; filename=case1_time_records.csv;'))
    }
}
