package io.github.lujian213.timerecorder.dao;

import io.github.lujian213.timerecorder.model.Category;
import io.github.lujian213.timerecorder.utils.Constants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Component
public class CategoryDao extends BaseDao<Category> {
    public CategoryDao(@Value("${repo.folder}") File repoFile) {
        super(repoFile);
    }

    @Override
    protected String getFileName() {
        return Constants.CATEGORY_FILE_NAME;
    }

    @Override
    public Class<Category> getType() {
        return Category.class;
    }

    public static void main(String[] args) throws IOException {
        CategoryDao dao = new CategoryDao(new File("repo"));
        List<Category> categoryList = List.of(new Category("会议"),
                new Category("邮件"),
                new Category("阅卷"),
                new Category("其他")
                );
        dao.save(categoryList);
    }
}
