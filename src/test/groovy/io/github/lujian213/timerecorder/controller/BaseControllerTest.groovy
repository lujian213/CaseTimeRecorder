package io.github.lujian213.timerecorder.controller

import io.github.lujian213.timerecorder.controller.BaseController.ThrowingRunnable
import io.github.lujian213.timerecorder.exception.TimeRecorderException
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.web.server.ResponseStatusException
import spock.lang.Specification

class BaseControllerTest extends Specification {
    def "RunWithExceptionHandling for Callable"() {
        given:
        def controller = new BaseController();

        when:
        def result = controller.runWithExceptionHandling("error message") {
            "success"
        }

        then:
        result == "success"

        when:
        controller.runWithExceptionHandling("error message") {
            throw new IOException("test exception")
        }

        then:
        def e = thrown(ResponseStatusException)
        e.statusCode == HttpStatus.INTERNAL_SERVER_ERROR

        when:
        controller.runWithExceptionHandling("error message") {
            throw new AccessDeniedException("test exception")
        }

        then:
        e = thrown(ResponseStatusException)
        e.statusCode == HttpStatus.FORBIDDEN

        when:
        controller.runWithExceptionHandling("error message") {
            throw new TimeRecorderException("test exception")
        }

        then:
        e = thrown(ResponseStatusException)
        e.statusCode == HttpStatus.BAD_REQUEST
    }

    def "RunWithExceptionHandling for ThrowingRunnable"() {
        given:
        def controller = new BaseController();

        when:
        controller.runWithExceptionHandling("error message",  {} as ThrowingRunnable)

        then:
        noExceptionThrown()

        when:
        controller.runWithExceptionHandling("error message", {
            throw new IOException("test exception")
        } as ThrowingRunnable)

        then:
        def e = thrown(ResponseStatusException)
        e.statusCode == HttpStatus.INTERNAL_SERVER_ERROR

        when:
        controller.runWithExceptionHandling("error message") {
            throw new AccessDeniedException("test exception")
        }

        then:
        e = thrown(ResponseStatusException)
        e.statusCode == HttpStatus.FORBIDDEN

        when:
        controller.runWithExceptionHandling("error message", {
            throw new TimeRecorderException("test exception")
        } as ThrowingRunnable)

        then:
        e = thrown(ResponseStatusException)
        e.statusCode == HttpStatus.BAD_REQUEST
    }
}
