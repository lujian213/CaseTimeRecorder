package io.github.lujian213.timerecorder.service;

import io.github.lujian213.timerecorder.dao.BaseDao;
import io.github.lujian213.timerecorder.exception.TimeRecorderException;
import io.github.lujian213.timerecorder.model.Resource;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

public class ResourceService<K, R extends Resource<K>, D extends BaseDao<R>> {
    private static final Logger log = LoggerFactory.getLogger(ResourceService.class);
    protected D resourceDao;
    protected final Map<K, R> resourceMap = new ConcurrentHashMap<>();

    @Autowired
    public void setResourceDao(D resourceDao) {
        this.resourceDao = resourceDao;
    }

    @PostConstruct
    protected void init() {
        try {
            List<R> resourceList = resourceDao.load();
            resourceMap.putAll(resourceList.stream().collect(Collectors.toMap(R::getKey, Function.identity())));
            log.info("loaded {} {}", resourceList.size(), getResourceType());
        } catch (IOException e) {
            log.error("failed to load cases", e);
            throw new TimeRecorderException(e);
        }
    }
    protected Class<R> getResourceType() {
        return resourceDao.getType();
    }

    public List<R> getAllResources() {
        return new ArrayList<>(resourceMap.values());
    }

    public R checkResource(K resourceId) {
        R ret = resourceMap.get(resourceId);
        if (ret == null) {
            throw new TimeRecorderException("Resource(%s) not found: %s".formatted(getResourceType(), resourceId));
        }
        return ret;
    }

    public Optional<R> getResource(K resourceId) {
        return Optional.ofNullable(resourceMap.get(resourceId));
    }

    public R addResource(R resource) {
        synchronized (resourceMap) {
            if (resourceMap.containsKey(resource.getKey())) {
                throw new TimeRecorderException("Resource (%s) already exists: %s".formatted(getResourceType(), resource.getKey()));
            }
            safeSave(this.resourceMap, resourceDao,
                    HashMap::new,
                    map -> map.put(resource.getKey(), resource),
                    (map, dao) -> dao.save(new ArrayList<>(map.values())),
                    "failed to add resource (%s): %s".formatted(getResourceType(), resource.getKey()));
            return resource;
        }
    }

    public R updateResource(R resource) {
        synchronized (resourceMap) {
            checkResource(resource.getKey());
            safeSave(this.resourceMap, resourceDao,
                    HashMap::new,
                    map -> map.put(resource.getKey(), resource),
                    (map, dao) -> dao.save(new ArrayList<>(map.values())),
                    "failed to update resource (%s): %s".formatted(getResourceType(), resource.getKey()));
            return resource;
        }
    }

    public void removeResource(K resourceId) {
        synchronized (resourceMap) {
            checkResource(resourceId);
            safeSave(this.resourceMap, resourceDao,
                    HashMap::new,
                    map -> map.remove(resourceId),
                    (map, dao) -> dao.save(new ArrayList<>(map.values())),
                    "failed to remove resource (%s): %s".formatted(getResourceType(), resourceId));
        }
    }

    protected static <S, D, R> R safeSaveWithReturn(S source, D dao, Function<S, S> creator, Function<S, R> consumer, SaveFunction<S, D> saveFunc, String errMsg) {
        try {
            S sourceCopy = creator.apply(source);
            consumer.apply(sourceCopy);
            saveFunc.save(sourceCopy, dao);
            return consumer.apply(source);
        } catch (IOException e) {
            log.error(errMsg, e);
            throw new TimeRecorderException(errMsg, e);
        }
    }

    protected static <S, D> void safeSave(S source, D dao, Function<S, S> creator, Consumer<S> consumer, SaveFunction<S, D> saveFunc, String errMsg) {
        try {
            S sourceCopy = creator.apply(source);
            consumer.accept(sourceCopy);
            saveFunc.save(sourceCopy, dao);
            consumer.accept(source);
        } catch (IOException e) {
            log.error(errMsg, e);
            throw new TimeRecorderException(errMsg, e);
        }
    }

    public interface SaveFunction<S, D> {
        void save(S data, D dao) throws IOException;
    }
}
