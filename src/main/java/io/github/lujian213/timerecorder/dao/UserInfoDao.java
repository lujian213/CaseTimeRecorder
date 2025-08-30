package io.github.lujian213.timerecorder.dao;

import io.github.lujian213.timerecorder.model.UserInfo;
import io.github.lujian213.timerecorder.utils.Constants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class UserInfoDao extends BaseDao<UserInfo> {
    public UserInfoDao(@Value("${repo.folder}") File repoFile) {
        super(repoFile);
    }

    @Override
    protected String getFileName() {
        return Constants.USERS_FILE_NAME;
    }

    @Override
    public Class<UserInfo> getType() {
        return UserInfo.class;
    }

}
