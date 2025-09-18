package io.github.lujian213.timerecorder.service;

import io.github.lujian213.timerecorder.dao.UserCaseBindingDao;
import io.github.lujian213.timerecorder.dao.UserInfoDao;
import io.github.lujian213.timerecorder.exception.TimeRecorderException;
import io.github.lujian213.timerecorder.model.Case;
import io.github.lujian213.timerecorder.model.Role;
import io.github.lujian213.timerecorder.model.UserCaseBinding;
import io.github.lujian213.timerecorder.model.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class UserService extends ResourceService<String, UserInfo, UserInfoDao> implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private String adminUserId;
    private String adminPassword;
    private CaseService caseService;
    private UserCaseBindingDao userCaseBindingDao;
    private PasswordEncoder passwordEncoder;

    Map<String, UserCaseBinding> bindingMap = new ConcurrentHashMap<>();

    @Autowired
    public void setCaseService(CaseService caseService) {
        this.caseService = caseService;
    }
    @Autowired
    public void setUserCaseBindingDao(UserCaseBindingDao userCaseBindingDao) {
        this.userCaseBindingDao = userCaseBindingDao;
    }
    @Value("${admin.userId:admin}")
    public void setAdminUserId(String adminUserId) {
        this.adminUserId = adminUserId;
    }
    @Value("${admin.password:admin}")
    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }
    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    protected void init() {
        super.init();
        initAdminAccount();
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

    private void initAdminAccount() {
        UserInfo admin = new UserInfo(adminUserId, adminUserId, Role.ADMIN, passwordEncoder.encode(adminPassword));
        resourceMap.putIfAbsent(admin.getUserId(), admin);
    }

    @Override
    public UserInfo addResource(UserInfo userInfo) {
        userInfo.setPassword(passwordEncoder.encode(userInfo.getUserId()));
        return new UserInfo(super.addResource(userInfo));
    }

    @Override
    public UserInfo updateResource(UserInfo userInfo) {
        if (userInfo.getPassword() != null && !userInfo.getPassword().isEmpty()) {
            userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        } else {
            var existing = super.checkResource(userInfo.getUserId());
            userInfo.setPassword(existing.getPassword());
        }
        return new UserInfo(super.updateResource(userInfo));
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

    @Override
    public UserInfo checkResource(String resourceId) {
        var userInfo = super.checkResource(resourceId);
        return new UserInfo(userInfo);
    }

    @Override
    public List<UserInfo> getAllResources() {
        synchronized (resourceMap) {
            List<UserInfo> ret = super.getAllResources();
            return ret.stream().map(UserInfo::new).toList();
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return super.getResource(username)
                .map(this::convertToSpringUser)
                .orElseThrow(() -> new UsernameNotFoundException("User '" + username + "' not found"));
    }

    private UserDetails convertToSpringUser(UserInfo userInfo) {
        return new User(
                userInfo.getUserId(),
                userInfo.getPassword(),
                mapRolesToAuthorities(userInfo.getRole())
        );
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Role role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }
}
