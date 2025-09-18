package io.github.lujian213.timerecorder.controller;

import io.github.lujian213.timerecorder.model.Case;
import io.github.lujian213.timerecorder.service.CaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/")
@Tag(name = "Case Service", description = "Case Service")
public class CaseController extends BaseController {
    private CaseService caseService;

    @Autowired
    public void setCaseService(CaseService caseService) {
        this.caseService = caseService;
    }

    @Operation(summary = "get all cases")
    @GetMapping(value = "/cases", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Case> getCases() {
        return runWithExceptionHandling("get all cases error", () -> caseService.getAllResources());
    }

    @Operation(summary = "add new case")
    @PutMapping(value = "/case", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Case addCase(@RequestBody Case caseInfo) {
        return runWithExceptionHandling("add new case error", () -> caseService.addResource(caseInfo));
    }

    @Operation(summary = "update case")
    @PostMapping(value = "/case", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Case updateCase(@RequestBody Case caseInfo) {
        return runWithExceptionHandling("update case error", () -> caseService.updateResource(caseInfo));
    }

    @Operation(summary = "delete case")
    @DeleteMapping(value = "/case/{caseId}")
    public void deleteCase(@PathVariable int caseId) {
        runWithExceptionHandling("delete case error", () -> caseService.deleteCase(caseId));
    }
}