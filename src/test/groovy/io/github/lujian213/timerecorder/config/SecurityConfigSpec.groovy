package io.github.lujian213.timerecorder.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.security.access.hierarchicalroles.RoleHierarchy
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.test.web.servlet.MockMvc
import spock.lang.Specification

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
@Import(SecurityConfig.class)
class SecurityConfigSpec extends Specification {

    @Autowired
    SecurityFilterChain defaultSecurityFilterChain
    @Autowired
    PasswordEncoder passwordEncoder
    @Autowired
    RoleHierarchy roleHierarchy
    @Autowired
    MockMvc mockMvc

    def "bean registration"() {
        expect:
        defaultSecurityFilterChain
        passwordEncoder
        roleHierarchy
    }

    def "should allow swagger endpoints without auth"() {
        expect:
        mockMvc.perform(get(path)).andExpect(status().is(returnCode))

        where:
        path                     | returnCode
        "/swagger-ui.html"       | 302
        "/swagger-ui/index.html" | 200
        "/v3/api-docs"           | 200
        "/v3/api-docs/"          | 404
        "/v3/api-docs/123"       | 404
        "/some/v3/api-docs"      | 401
    }

    def "should not allow resources endpoints without auth"() {
        expect:
        mockMvc.perform(get(path)).andExpect(status().is(returnCode))

        where:
        path     | returnCode
        "/user"  | 401
        "/cases" | 401
    }

}