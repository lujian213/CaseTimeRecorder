package io.github.lujian213.timerecorder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TimeRecorderApplication {

    private static final Logger log = LoggerFactory.getLogger(TimeRecorderApplication.class);

    public static void main(String[] args) {
        log.info("start...");
        SpringApplication.run(TimeRecorderApplication.class, args);
    }
}
