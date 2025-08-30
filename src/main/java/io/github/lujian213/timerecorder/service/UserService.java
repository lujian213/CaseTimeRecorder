package io.github.lujian213.timerecorder.service;

import io.github.lujian213.timerecorder.dao.UserCaseBindingDao;
import io.github.lujian213.timerecorder.dao.UserInfoDao;
import io.github.lujian213.timerecorder.exception.TimeRecorderException;
import io.github.lujian213.timerecorder.model.Case;
import io.github.lujian213.timerecorder.model.UserCaseBinding;
import io.github.lujian213.timerecorder.model.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class UserService extends ResourceService<String, UserInfo, UserInfoDao> {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private CaseService caseService;
    private UserCaseBindingDao userCaseBindingDao;

    Map<String, UserCaseBinding> bindingMap = new ConcurrentHashMap<>();

    @Autowired
    public void setCaseService(CaseService caseService) {
        this.caseService = caseService;
    }
    @Autowired
    public void setUserCaseBindingDao(UserCaseBindingDao userCaseBindingDao) {
        this.userCaseBindingDao = userCaseBindingDao;
    }

    protected void init() {
        super.init();
        try {
            List<UserCaseBinding> bindingList = userCaseBindingDao.load();
            for (UserCaseBinding binding : bindingList) {
                if (!resourceMap.containsKey(binding.userId())) {
                    log.warn("binding user not found: {}, skip", binding.userId());
                } else {
                    for (int caseId : new ArrayList<>(binding.caseSet())) {
                        if (caseService.getResource(caseId).isEmpty()) {
                            log.warn("binding case not found: {}, skip", caseId);
                            binding.caseSet().remove(caseId);
                        }
                    }
                    bindingMap.put(binding.userId(), binding);
                }
            }
            userCaseBindingDao.save(new ArrayList<>(bindingMap.values()));
        } catch (IOException e) {
            log.error("failed to load user case bindings", e);
            throw new TimeRecorderException(e);
        }
    }

    @Override
    public void removeResource(String userId) {
        synchronized (resourceMap) {
            super.removeResource(userId);
            safeSave(bindingMap, userCaseBindingDao,
                    HashMap::new,
                    map -> map.remove(userId),
                    (map, dao) -> dao.save(new ArrayList<>(map.values())),
                    "failed to remove user case binding for user: %s".formatted(userId));
        }
    }

    public List<Case> getUserBindings(String userId) {
        synchronized (resourceMap) {
            checkResource(userId);
            UserCaseBinding binding = bindingMap.computeIfAbsent(userId, k-> new UserCaseBinding(userId, new HashSet<>()));
            return binding.caseSet().stream().map(caseId-> caseService.getResource(caseId))
                    .filter(Optional::isPresent).map(Optional::get).toList();
        }
    }

    public List<Case> updateUserBinding(UserCaseBinding binding) {
        synchronized (resourceMap) {
            String userId = binding.userId();
            checkResource(userId);
            binding.caseSet().removeIf(caseId -> caseService.getResource(caseId).isEmpty());

            safeSave(bindingMap, userCaseBindingDao,
                    HashMap::new,
                    map -> map.put(userId, binding),
                    (map, dao) -> dao.save(new ArrayList<>(map.values())),
                    "failed to save user case binding for user: %s".formatted(userId));
            return binding.caseSet().stream().map(caseId-> caseService.getResource(caseId))
                    .filter(Optional::isPresent).map(Optional::get).toList();
        }
    }
}
