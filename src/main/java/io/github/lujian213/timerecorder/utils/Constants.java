package io.github.lujian213.timerecorder.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

public final class Constants {
    private Constants() {
    }

    public static final String TIME_RECORDER_FILE_NAME_PREFIX = "time-recorder-";
    public static final Pattern TIME_RECORDER_FILE_NAME_PATTERN = Pattern.compile(TIME_RECORDER_FILE_NAME_PREFIX + "(?<caseId>\\d+)\\.json");
    public static final String EXPORT_FILE_NAME_FORMAT = "%s_time_records.csv";
    public static final String USERS_FILE_NAME = "users.json";
    public static final String CASES_FILE_NAME = "cases.json";
    public static final String BINDINGS_FILE_NAME = "bindings.json";
    public static final String TIME_RECORDER_FILE_NAME = TIME_RECORDER_FILE_NAME_PREFIX + "%d.json";
    public static final String CATEGORY_FILE_NAME = "categories.json";
    public static final ObjectMapper MAPPER = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    public static final CsvMapper CSV_MAPPER = new CsvMapper();
    public static final ZoneId ZONE_ID = ZoneId.of(System.getProperty("zone.id","UTC+08:00"));
    public static final DateTimeFormatter MINUTE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZONE_ID);
}