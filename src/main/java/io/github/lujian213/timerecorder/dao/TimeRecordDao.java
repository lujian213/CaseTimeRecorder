package io.github.lujian213.timerecorder.dao;

import io.github.lujian213.timerecorder.model.TimeRecord;
import io.github.lujian213.timerecorder.utils.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

public class TimeRecordDao extends BaseDao<TimeRecord> {
    private static final Logger log = LoggerFactory.getLogger(TimeRecordDao.class);
    private final String fileName;

    public TimeRecordDao(File repoFile, int caseId) {
        super(repoFile);
        this.fileName = String.format(Constants.TIME_RECORDER_FILE_NAME, caseId);
    }

    @Override
    protected String getFileName() {
        return fileName;
    }

    @Override
    public Class<TimeRecord> getType() {
        return TimeRecord.class;
    }

    public void delete() {
        File file = new File(repoFile, fileName);
        try {
            Files.deleteIfExists(file.toPath());
        } catch (IOException e) {
            log.warn("error to delete file {}, ignore", file, e);
        }
    }
}
