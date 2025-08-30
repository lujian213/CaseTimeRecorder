package io.github.lujian213.timerecorder.dao;

import java.io.File;

public class FileSystemDao {
    protected File repoFile;

    public FileSystemDao(File repoFile) {
        this.repoFile = repoFile;
        init();
    }

    protected void init() {
        if (!repoFile.exists()) {
            repoFile.mkdirs();
        }
    }
}