package io.github.lujian213.timerecorder.controller;

import io.github.lujian213.timerecorder.exception.TimeRecorderException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.concurrent.Callable;

public class BaseController {
    public interface ThrowingRunnable {
        void run() throws Throwable;
    }

    protected static final Logger log = LoggerFactory.getLogger(BaseController.class);

    protected void runWithExceptionHandling(String errMsg, ThrowingRunnable runnable) {
        try {
            runnable.run();
        } catch (Throwable e) {
            handleException(errMsg, e);
        }
    }

    protected <T> T runWithExceptionHandling(String errMsg, Callable<T> callable) {
        try {
            return callable.call();
        } catch (Throwable e) {
            return handleException(errMsg, e);
        }
    }

    protected <T> T handleException(String msg, Throwable e) {
        log.error(msg, e);
        if (e instanceof TimeRecorderException) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } else {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}