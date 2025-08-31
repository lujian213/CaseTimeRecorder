FROM alpine/java:17.0.12-jre
COPY ./dist/lib/casetimerecorder-1.0.0.jar casetimerecorder-1.0.0.jar
LABEL org.opencontainers.image.source=https://github.com/lujian213/CaseTimeRecorder
EXPOSE 9733
ENTRYPOINT ["java", "-jar", "casetimerecorder-1.0.0.jar"]