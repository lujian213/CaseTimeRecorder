package io.github.lujian213.timerecorder.dao;

import io.github.lujian213.timerecorder.utils.Constants;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.List;

public abstract class BaseDao<T> extends FileSystemDao {
    public BaseDao(File repoFile) {
        super(repoFile);
    }

    protected abstract String getFileName();
    protected File getFile() {
        return new File(repoFile, getFileName());
    }
    public void save(Collection<T> beanList) throws IOException {
        Constants.MAPPER.writeValue(getFile(), beanList);
    }

    public List<T> load() throws IOException {
        File file = getFile();
        if (!file.exists()) {
            return List.of();
        }
        return Constants.MAPPER.readerForListOf(getType()).readValue(getFile());
    }

    public abstract Class<T> getType();
}
