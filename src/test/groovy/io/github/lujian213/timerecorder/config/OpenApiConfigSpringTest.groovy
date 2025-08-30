package io.github.lujian213.timerecorder.config


import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = OpenApiConfig)
class OpenApiConfigSpringTest extends Specification {
    @Autowired
    OpenApiConfig openApiConfig

    def "check availability"() {
        expect:
        openApiConfig
    }
}
