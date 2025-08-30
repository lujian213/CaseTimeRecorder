package io.github.lujian213.timerecorder.dao;

import io.github.lujian213.timerecorder.model.UserCaseBinding;
import io.github.lujian213.timerecorder.utils.Constants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class UserCaseBindingDao extends BaseDao<UserCaseBinding> {
    public UserCaseBindingDao(@Value("${repo.folder}") File repoFile) {
        super(repoFile);
    }

    @Override
    protected String getFileName() {
        return Constants.BINDINGS_FILE_NAME;
    }

    @Override
    public Class<UserCaseBinding> getType() {
        return UserCaseBinding.class;
    }
}
