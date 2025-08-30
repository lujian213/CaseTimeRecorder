package io.github.lujian213.timerecorder.dao

import io.github.lujian213.timerecorder.model.UserInfo
import spock.lang.Specification
import spock.lang.TempDir

class UserDaoTest extends Specification {
    @TempDir
    File tempDir

    def "Save and load"() {
        given:
        def userDao = new UserInfoDao(tempDir)

        expect:
        userDao.load().size() == 0

        when:
        def userList = [
                new UserInfo("id1").with(true){
                    userName = "user1"
                    role = "admin"
                },
                new UserInfo("id2").with(true) {
                    userName = "user2"
                    role = "user"
                }
        ] as List<UserInfo>
        userDao.save(userList)

        then:
        userDao.getFile().exists()

        when:
        userList = userDao.load()

        then:
        userList.size() == 2
        with(userList[0])    {
            userId == "id1"
            userName == "user1"
            role == "admin"
        }
        with(userList[1]) {
            userId == "id2"
            userName == "user2"
            role == "user"
        }
    }
}
