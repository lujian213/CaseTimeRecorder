package io.github.lujian213.timerecorder.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import io.github.lujian213.timerecorder.dao.CaseTimeRecordsDao;
import io.github.lujian213.timerecorder.exception.TimeRecorderException;
import io.github.lujian213.timerecorder.model.CaseTimeRecords;
import io.github.lujian213.timerecorder.model.TimeRecord;
import io.github.lujian213.timerecorder.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class CaseTimeRecordsService extends ResourceService<Integer, CaseTimeRecords, CaseTimeRecordsDao> {
    private final AtomicInteger maxId = new AtomicInteger(0);
    private CaseService caseService;

    @Autowired
    public void setCaseService(CaseService caseService) {
        this.caseService = caseService;
    }

    @Override
    protected void init() {
        super.init();
        resourceMap.values().stream()
                .flatMap(records->records.timeRecords().stream())
                .map(TimeRecord::getRecordId)
                .max(Integer::compareTo).ifPresent(maxId::set);
        new ArrayList<>(resourceMap.values()).forEach(records-> {
            if (caseService.getResource(records.caseId()).isEmpty()) {
                resourceDao.deleteCase(records.caseId());
                resourceMap.remove(records.caseId());
            }
        });
    }

    protected int getNextId() {
        return maxId.addAndGet(1);
    }

    public TimeRecord addTimeRecord(TimeRecord timeRecord) {
        var caseId = timeRecord.getCaseId();
        caseService.checkResource(caseId);
        synchronized (resourceMap) {
            CaseTimeRecords records = checkResource(caseId);
            timeRecord.setRecordId(getNextId());
            return safeSaveWithReturn(records, resourceDao,
                    r -> new CaseTimeRecords(caseId, new ArrayList<>(r.timeRecords())),
                    r -> r.addTimeRecord(timeRecord),
                    (r, dao) -> dao.save(r),
                    "add time record to case {%d} failed".formatted(caseId));
        }
    }

    public TimeRecord startRecord(int caseId, String userId, String category, String comments) {
        caseService.checkResource(caseId);
        var record = new TimeRecord().setCaseId(caseId)
                .setUserId(userId).setCategory(category).setComments(comments);
        return addTimeRecord(record);
    }

    public TimeRecord stopRecord(int caseId, int recordId, String userId) {
        synchronized (resourceMap) {
            var record = findTimeRecord(caseId, recordId)
                    .orElseThrow(()->new TimeRecorderException("time record {%d} is not found".formatted(recordId)));
            if (!Objects.equals(record.getUserId(), userId)) {
                throw new AccessDeniedException("access denied");
            }
            return updateTimeRecord(record.setEndTime(System.currentTimeMillis()));
        }
    }

    public TimeRecord updateTimeRecord(TimeRecord timeRecord) {
        var caseId = timeRecord.getCaseId();
        caseService.checkResource(caseId);
        synchronized(resourceMap) {
            CaseTimeRecords records = checkResource(caseId);
            var recordOpt = records.findTimeRecord(timeRecord.getRecordId());
            if (recordOpt.isPresent()) {
                var record = recordOpt.get().copyFrom(timeRecord);
                return safeSaveWithReturn(records, resourceDao,
                        r -> new CaseTimeRecords(caseId, new ArrayList<>(r.timeRecords())),
                        r -> r.updateTimeRecord(record),
                        (r, dao) -> dao.save(r),
                        "update time record {%d} failed".formatted(timeRecord.getRecordId()));
            } else {
                throw new TimeRecorderException("time record {%d} is not found".formatted(timeRecord.getRecordId()));
            }
        }
    }

    public void deleteTimeRecord(int caseId, int recordId) {
        synchronized(resourceMap) {
            var records = checkResource(caseId);
            safeSave(records, resourceDao,
                    r -> new CaseTimeRecords(caseId, new ArrayList<>(r.timeRecords())),
                    r -> {
                        if (!r.removeTimeRecord(recordId)) {
                            throw new TimeRecorderException("time record {%d} is not found".formatted(recordId));
                        }
                    },
                    (r, dao) -> dao.save(r),
                    "delete time record {%d} failed".formatted(recordId));
        }
    }

    protected Optional<TimeRecord> findTimeRecord(int caseId, int recordId) {
        if (caseService.getResource(caseId).isEmpty()) {
            return Optional.empty();
        }
        synchronized(resourceMap) {
            var records = checkResource(caseId);
            return records.findTimeRecord(recordId);
        }
    }

    @Override
    public Optional<CaseTimeRecords> getResource(Integer resourceId) {
        caseService.checkResource(resourceId);
        synchronized(resourceMap) {
            return Optional.of(resourceMap.computeIfAbsent(resourceId, caseId ->new CaseTimeRecords(caseId, new ArrayList<>())));
        }
    }

    @Override
    public CaseTimeRecords checkResource(Integer resourceId) {
        caseService.checkResource(resourceId);
        synchronized(resourceMap) {
            return resourceMap.computeIfAbsent(resourceId, caseId ->new CaseTimeRecords(caseId, new ArrayList<>()));
        }
    }

    public String exportTimeRecords(int caseId) {
        caseService.checkResource(caseId);
        var records = checkResource(caseId);
        var mapList = records.timeRecords().stream().map(CaseTimeRecordsService::recordToMap).toList();
        return serializeMapListToCsv(mapList);
    }

    protected static String serializeMapListToCsv(List<Map<String, Object>> recordMapList) {
        var schema = CsvSchema.builder()
                .addColumn("用户")
                .addColumn("开始时间")
                .addColumn("结束时间")
                .addColumn("耗时（分钟）")
                .addColumn("类别")
                .addColumn("备注")
                .setUseHeader(true)
                .build();
        try {
            return Constants.CSV_MAPPER.writer(schema).writeValueAsString(recordMapList);
        } catch (JsonProcessingException e) {
            throw new TimeRecorderException("serialize to csv error", e);
        }
    }

    protected static Map<String, Object> recordToMap(TimeRecord record) {
        Map<String, Object> ret = new LinkedHashMap<>();
        ret.put("用户", record.getUserId());
        ret.put("开始时间", millisToDateTimeString(record.getStartTime()));
        ret.put("结束时间", millisToDateTimeString(record.getEndTime()));
        ret.put("耗时（分钟）", record.getDurationMinute());
        ret.put("类别", record.getCategory());
        ret.put("备注", record.getComments());
        return ret;
    }

    private static String millisToDateTimeString(long millis) {
        if (millis <= 0) {
            return "";
        }
        Instant instant = Instant.ofEpochMilli(millis);
        ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(instant, Constants.ZONE_ID);
        return zonedDateTime.format(Constants.MINUTE_FORMAT);
    }
}
