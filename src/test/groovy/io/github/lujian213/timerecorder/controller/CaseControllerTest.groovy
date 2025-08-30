package io.github.lujian213.timerecorder.controller

import io.github.lujian213.timerecorder.model.Case
import io.github.lujian213.timerecorder.service.CaseService
import io.github.lujian213.timerecorder.utils.Constants
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import spock.lang.Specification

import static io.github.lujian213.timerecorder.model.Case.CaseStatus.ACTIVE
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(CaseController)
class CaseControllerTest extends Specification {

    @SpringBean
    CaseService caseService = Mock(CaseService)
    @Autowired
    MockMvc mockMvc

    def "GetCases"() {
        when:
        def caseList = [new Case(1).with(true) {
            caseName = "Case 1"
            description = "Description 1"
            status = ACTIVE
        }]
        caseService.getAllResources() >> caseList
        then:
        mockMvc.perform(get("/cases"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(caseList)))
    }

    def "AddCase"() {
        when:
        def caseInfo = new Case(1).with(true) {
            caseName = "Case 1"
            description = "Description 1"
            status = ACTIVE
        }
        caseService.addResource(_) >> caseInfo
        then:
        mockMvc.perform(put("/case").contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Constants.MAPPER.writeValueAsString(caseInfo)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(caseInfo)))
    }

    def "UpdateCase"() {
        when:
        def caseInfo = new Case(1).with(true) {
            caseName = "Case 1"
            description = "Description 1"
            status = ACTIVE
        }
        caseService.updateResource(_) >> caseInfo
        then:
        mockMvc.perform(post("/case").contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Constants.MAPPER.writeValueAsString(caseInfo)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(caseInfo)))
    }

    def "DeleteCase"() {
        when:
        1 * caseService.deleteCase(1) >> {}
        then:
        mockMvc.perform(delete("/case/{caseId}", 1))
                .andExpect(status().isOk())
    }
}
