package io.github.lujian213.timerecorder.filter

import io.github.lujian213.timerecorder.utils.Constants
import jakarta.servlet.FilterChain
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import spock.lang.Specification

class JWTTokenGeneratorFilterSpec extends Specification {

    JWTTokenGeneratorFilter targetClass = new JWTTokenGeneratorFilter()
    def request = new MockHttpServletRequest()
    def response = new MockHttpServletResponse()
    def filterChain = Spy(FilterChain) {
        doFilter(request, response) >> {}
    }

    def setup() {
        Authentication auth = Mock() {
            getName() >> "testUser"
            getAuthorities() >> [new SimpleGrantedAuthority("ROLE_ADMIN")]
            isAuthenticated() >> true
        }
        SecurityContextHolder.setContext(new SecurityContextImpl(auth))
    }

    def "generate JWTToken if authorized"() {
        when:
        targetClass.doFilterInternal(request, response, filterChain)
        def token = response.getHeader(Constants.JWT_HEADER)

        then:
        token != null
        token.startsWith("Bearer ")
    }

    def "reuse token if request header has JWTToken"() {
        given:
        request.addHeader(Constants.JWT_HEADER, "Bearer testToken")

        when:
        targetClass.doFilterInternal(request, response, filterChain)
        def token = response.getHeader(Constants.JWT_HEADER)

        then:
        token == "Bearer testToken"
    }
}