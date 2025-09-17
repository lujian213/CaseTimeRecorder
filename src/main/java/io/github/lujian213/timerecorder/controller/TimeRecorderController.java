package io.github.lujian213.timerecorder.controller;

import io.github.lujian213.timerecorder.model.CaseTimeRecords;
import io.github.lujian213.timerecorder.model.Category;
import io.github.lujian213.timerecorder.model.TimeRecord;
import io.github.lujian213.timerecorder.service.CaseService;
import io.github.lujian213.timerecorder.service.CaseTimeRecordsService;
import io.github.lujian213.timerecorder.service.MiscService;
import io.github.lujian213.timerecorder.utils.CaseTimeRecorderUtils;
import io.github.lujian213.timerecorder.utils.Constants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/")
@Tag(name = "CaseTimeRecorder Service", description = "Case Time Recorder Service")
public class TimeRecorderController extends BaseController {
    private MiscService miscService;
    private CaseTimeRecordsService caseTimeRecordersService;
    private CaseService caseService;

    @Autowired
    public void setMiscService(MiscService miscService) {
        this.miscService = miscService;
    }

    @Autowired
    public void setCaseTimeRecordersService(CaseTimeRecordsService caseTimeRecordersService) {
        this.caseTimeRecordersService = caseTimeRecordersService;
    }

    @Autowired
    public void setCaseService(CaseService caseService) {
        this.caseService = caseService;
    }

    @Operation(summary = "get all categories")
    @GetMapping(value = "/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Category> getCategories() {
        return runWithExceptionHandling("get all categories error", () -> miscService.getAllResources());
    }

    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "start a new case time recorder")
    @PostMapping(value = "/record/start", produces = MediaType.APPLICATION_JSON_VALUE)
    public TimeRecord startTimeRecord(Authentication authentication, @RequestParam int caseId,
                                      @RequestParam String category, @RequestParam String comments) {
        return runWithExceptionHandling("start time record error",
                () -> caseTimeRecordersService.startRecord(caseId, authentication.getName(), category, comments));
    }

    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "stop a time recorder")
    @PostMapping(value = "/record/stop", produces = MediaType.APPLICATION_JSON_VALUE)
    public TimeRecord stopTimeRecord(@RequestParam int caseId, @RequestParam int recordId) {
        return runWithExceptionHandling("stop time record error",
                () -> caseTimeRecordersService.stopRecord(caseId, recordId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "add a new time recorder")
    @PutMapping(value = "/record", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public TimeRecord newTimeRecord(@RequestBody TimeRecord timeRecord) {
        return runWithExceptionHandling("add time record error",
                () -> caseTimeRecordersService.addTimeRecord(timeRecord));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "update a time recorder")
    @PostMapping(value = "/record", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public TimeRecord updateTimeRecord(@RequestBody TimeRecord timeRecord) {
        return runWithExceptionHandling("update time record error",
                () -> caseTimeRecordersService.updateTimeRecord(timeRecord));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "delete a time recorder")
    @DeleteMapping(value = "/record")
    public void deleteTimeRecord(@RequestParam int caseId, @RequestParam int recordId) {
        runWithExceptionHandling("delete time record error",
                () -> caseTimeRecordersService.deleteTimeRecord(caseId, recordId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "get all time records")
    @GetMapping(value = "/records/{caseId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CaseTimeRecords getAllTimeRecords(@PathVariable int caseId) {
        return runWithExceptionHandling("get time records error",
                () -> caseTimeRecordersService.checkResource(caseId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "export time records")
    @GetMapping(value = "/exportrecords/{caseId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> exportInvests(@PathVariable int caseId) {
        return runWithExceptionHandling("export case (%s) records error: ".formatted(caseId), () -> {
            var caseInfo = caseService.checkResource(caseId);
            var content = caseTimeRecordersService.exportTimeRecords(caseId);
            String filename = CaseTimeRecorderUtils.fileNameInResponse(Constants.EXPORT_FILE_NAME_FORMAT.formatted(caseInfo.getCaseName()));
            log.info("export case ({}) records, filename: {}", caseId, filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .header("Access-Control-Expose-Headers", "Content-Disposition")
                    .header("Content-Disposition", "attachment; filename*=" + filename)
                    .body(CaseTimeRecorderUtils.toBytesWithBOM(content));
        });
    }
}