package io.github.lujian213.timerecorder.dao;

import io.github.lujian213.timerecorder.model.Case;
import io.github.lujian213.timerecorder.utils.Constants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class CaseDao extends BaseDao<Case> {
    public CaseDao(@Value("${repo.folder}") File repoFile) {
        super(repoFile);
    }

    @Override
    protected String getFileName() {
        return Constants.CASES_FILE_NAME;
    }

    @Override
    public Class<Case> getType() {
        return Case.class;
    }
}
