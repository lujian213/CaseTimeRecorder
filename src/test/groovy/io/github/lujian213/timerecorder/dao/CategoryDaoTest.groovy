package io.github.lujian213.timerecorder.dao


import spock.lang.Specification
import io.github.lujian213.timerecorder.model.Category
import spock.lang.TempDir

class CategoryDaoTest extends Specification {
    @TempDir
    File tempDir

    def "Save and load"() {
        given:
        def categoryDao = new CategoryDao(tempDir)

        expect:
        categoryDao.load().size() == 0

        when:
        def categoryList = [new Category("会议"), new Category("邮件"), new Category("阅卷"), new Category("其他")] as List<Category>
        categoryDao.save(categoryList)

        then:
        categoryDao.getFile().exists()

        when:
        categoryList = categoryDao.load()

        then:
        categoryList.size() == 4
    }
}
