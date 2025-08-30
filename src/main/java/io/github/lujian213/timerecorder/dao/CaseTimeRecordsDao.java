package io.github.lujian213.timerecorder.dao;

import io.github.lujian213.timerecorder.model.CaseTimeRecords;
import io.github.lujian213.timerecorder.utils.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;

@Component
public class CaseTimeRecordsDao extends BaseDao<CaseTimeRecords>{
    private static final Logger log = LoggerFactory.getLogger(CaseTimeRecordsDao.class);
    public CaseTimeRecordsDao(@Value("${repo.folder}") File repoFile) {
        super(repoFile);
    }

    @Override
    protected String getFileName() {
        return Constants.TIME_RECORDER_FILE_NAME;
    }

    @Override
    public Class<CaseTimeRecords> getType() {
        return CaseTimeRecords.class;
    }

    protected TimeRecordDao getTimeRecordDao(int caseId) {
        return new TimeRecordDao(repoFile, caseId);
    }

    @Override
    public void save(Collection<CaseTimeRecords> beanList) throws IOException {
        beanList.forEach(this::save);
    }

    @Override
    public List<CaseTimeRecords> load() throws IOException {
        return Arrays.stream(Objects.requireNonNull(repoFile.list()))
                .map(Constants.TIME_RECORDER_FILE_NAME_PATTERN::matcher)
                .filter(Matcher::matches)
                .map(matcher->matcher.group("caseId"))
                .map(Integer::parseInt)
                .map(this::load)
                .toList();
    }

    protected CaseTimeRecords load(int caseId) {
        try {
            return new CaseTimeRecords(caseId, getTimeRecordDao(caseId).load());
        } catch (IOException e) {
            log.warn("load time records for case {} failed, ignore", caseId, e);
            return null;
        }
    }

    public void save(CaseTimeRecords records) {
        try {
            getTimeRecordDao(records.caseId()).save(records.timeRecords());
        } catch (IOException e) {
            log.warn("save time records for case {} failed, ignore", records.caseId(), e);
        }
    }

    public void deleteCase(int caseId) {
        getTimeRecordDao(caseId).delete();
    }
}
