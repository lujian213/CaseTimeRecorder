package io.github.lujian213.timerecorder.dao

import io.github.lujian213.timerecorder.model.UserCaseBinding
import spock.lang.Specification
import spock.lang.TempDir

class UserCaseBindingDaoTest extends Specification {
    @TempDir
    File tempDir

    def "Save and load"() {
        given:
        def userCaseBindingDao = new UserCaseBindingDao(tempDir)

        expect:
        userCaseBindingDao.load().size() == 0

        when:
        def bindingList = [
                new UserCaseBinding("user1", [10, 11] as Set<Integer>),
                new UserCaseBinding("user2", [20, 21] as Set<Integer>)
        ] as List<UserCaseBinding>
        userCaseBindingDao.save(bindingList)

        then:
        userCaseBindingDao.getFile().exists()

        when:
        bindingList = userCaseBindingDao.load()

        then:
        bindingList.size() == 2
        with (bindingList[0])    {
            userId() == "user1"
            caseSet() == [10, 11] as Set<Integer>
        }
        with (bindingList[1]) {
            userId() == "user2"
            caseSet() == [20, 21] as Set<Integer>
        }
    }

}
