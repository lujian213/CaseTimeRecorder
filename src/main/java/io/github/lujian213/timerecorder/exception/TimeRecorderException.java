package io.github.lujian213.timerecorder.exception;

public class TimeRecorderException extends RuntimeException {
    public TimeRecorderException() {
    }

    public TimeRecorderException(String message) {
        super(message);
    }

    public TimeRecorderException(String message, Throwable cause) {
        super(message, cause);
    }

    public TimeRecorderException(Throwable cause) {
        super(cause);
    }
}
