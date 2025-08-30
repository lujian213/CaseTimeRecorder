package io.github.lujian213.timerecorder.service


import io.github.lujian213.timerecorder.dao.CategoryDao
import io.github.lujian213.timerecorder.model.Category
import spock.lang.Specification
import spock.lang.TempDir

class MiscServiceTest extends Specification {
    @TempDir
    File tempDir

    CategoryDao categoryDao
    MiscService miscService

    def setup() {
        categoryDao = new CategoryDao(tempDir)
        def categories = [new Category("email"), new Category("meeting"), new Category("development")]

        categoryDao.save(categories)

        miscService = new MiscService()
        miscService.setResourceDao(categoryDao)
        miscService.init()
    }

    def "init"() {
        expect:
        miscService.resourceMap.size() == 3
        miscService.resourceMap.keySet().containsAll(["email", "meeting", "development"])
    }

    def "GetAllCategories"() {
        when:
        def categories = miscService.getAllResources()
        then:
        categories.size() == 3
        categories*.name.containsAll(["email", "meeting", "development"])
    }
}
