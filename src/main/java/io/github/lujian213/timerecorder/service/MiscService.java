package io.github.lujian213.timerecorder.service;

import io.github.lujian213.timerecorder.dao.CategoryDao;
import io.github.lujian213.timerecorder.model.Category;
import org.springframework.stereotype.Component;

@Component
public class MiscService extends ResourceService<String, Category, CategoryDao>{
}
