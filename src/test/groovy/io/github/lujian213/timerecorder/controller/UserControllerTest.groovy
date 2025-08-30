package io.github.lujian213.timerecorder.controller

import io.github.lujian213.timerecorder.model.Case
import io.github.lujian213.timerecorder.model.UserCaseBinding
import io.github.lujian213.timerecorder.model.UserInfo
import io.github.lujian213.timerecorder.service.UserService
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

@WebMvcTest(UserController)
class UserControllerTest extends Specification {
    @SpringBean
    UserService userService = Mock(UserService)
    @Autowired
    MockMvc mockMvc

    def "GetUsers"() {
        when:
        def userList = [new UserInfo("id1").with(true) {
            userName = "user1"
            role = "user"
        }]
        userService.getAllResources() >> userList
        then:
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(userList)))
    }

    def "Login"() {
        when:
        def userInfo = new UserInfo("id1").with(true) {
            userName = "user1"
            role = "user"
        }
        1 * userService.checkResource("id1") >> userInfo
        then:
        mockMvc.perform(post("/login").param("userId", "id1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(userInfo)))
    }

    def "AddUser"() {
        when:
        def userInfo = new UserInfo("id1").with(true) {
            userName = "user1"
            role = "user"
        }
        userService.addResource(_) >> userInfo
        then:
        mockMvc.perform(put("/user").contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Constants.MAPPER.writeValueAsString(userInfo)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(userInfo)))
    }

    def "UpdateUser"() {
        when:
        def userInfo = new UserInfo("id1").with(true) {
            userName = "user1"
            role = "user"
        }
        userService.updateResource(_) >> userInfo
        then:
        mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Constants.MAPPER.writeValueAsString(userInfo)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(userInfo)))
    }

    def "DeleteUser"() {
        when:
        1 * userService.removeResource("id1") >> {}
        then:
        mockMvc.perform(delete("/user").contentType(MediaType.TEXT_PLAIN_VALUE)
                .content("id1"))
                .andExpect(status().isOk())
    }

    def "GetUserBindings"() {
        when:
        def caseList= [new Case(1).with(true) {
            caseName = "case1"
            description = "desc1"
            status = ACTIVE
        }]
        1 * userService.getUserBindings("id1") >> caseList
        then:
        mockMvc.perform(get("/user/{userId}/bindings", "id1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(caseList)))
    }

    def "UpdateUserBindings"() {
        when:
        def caseList= [new Case(1).with(true) {
            caseName = "case1"
            description = "desc1"
            status = ACTIVE
        }]
        def userCaseBinding= new UserCaseBinding("id1", [1, 2] as Set<Integer>)
        userService.updateUserBinding(_) >> caseList
        then:
        mockMvc.perform(post("/user/bindings").contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Constants.MAPPER.writeValueAsString(userCaseBinding)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json(Constants.MAPPER.writeValueAsString(caseList)))
    }
}
