package io.github.lujian213.timerecorder.service;

import io.github.lujian213.timerecorder.dao.CaseDao;
import io.github.lujian213.timerecorder.exception.TimeRecorderException;
import io.github.lujian213.timerecorder.model.Case;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static io.github.lujian213.timerecorder.model.Case.CaseStatus.DELETED;

@Component
public class CaseService extends ResourceService<Integer, Case, CaseDao> {
    private final AtomicInteger maxId = new AtomicInteger(0);

    @Override
    protected void init() {
        super.init();
        maxId.set(resourceMap.keySet().stream().max(Integer::compareTo).orElse(0));
        resourceMap.entrySet().removeIf(entry -> entry.getValue().getStatus() == DELETED);
        try {
            resourceDao.save(resourceMap.values());
        } catch (IOException e) {
            throw new TimeRecorderException("save case error", e);
        }
    }

    protected int getNextId() {
        return maxId.addAndGet(1);
    }

    @Override
    public Case addResource(Case caseInfo) {
        caseInfo.setCaseId(getNextId());
        return super.addResource(caseInfo);
    }

    @Override
    public List<Case> getAllResources() {
        synchronized (resourceMap) {
            List<Case> ret = super.getAllResources();
            ret.removeIf(caseInfo->caseInfo.getStatus()!=DELETED);
            return ret;
        }
    }

    @Override
    public Optional<Case> getResource(Integer resourceId) {
        return super.getResource(resourceId).filter(caseInfo->caseInfo.getStatus()!=DELETED);
    }

    @Override
    public Case checkResource(Integer resourceId) {
        var caseInfo = super.checkResource(resourceId);
        if (caseInfo.getStatus() == DELETED) {
            throw new TimeRecorderException("case {%d} is not found or deleted".formatted(resourceId));
        }
        return caseInfo;
    }

    public void deleteCase(Integer caseId) {
        synchronized (resourceMap) {
            var caseInfo = checkResource(caseId).copy().setStatus(DELETED);
            updateResource(caseInfo);
        }
    }
}
