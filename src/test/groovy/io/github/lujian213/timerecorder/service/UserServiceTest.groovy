package io.github.lujian213.timerecorder.service


import io.github.lujian213.timerecorder.dao.UserCaseBindingDao
import io.github.lujian213.timerecorder.dao.UserInfoDao
import io.github.lujian213.timerecorder.exception.TimeRecorderException
import io.github.lujian213.timerecorder.model.Case
import io.github.lujian213.timerecorder.model.UserCaseBinding
import io.github.lujian213.timerecorder.model.UserInfo
import spock.lang.Specification
import spock.lang.TempDir

import static io.github.lujian213.timerecorder.model.Case.CaseStatus.ACTIVE
import static io.github.lujian213.timerecorder.model.Case.CaseStatus.CLOSED

class UserServiceTest extends Specification {
    @TempDir
    File tempDir

    UserInfoDao userInfoDao
    UserCaseBindingDao userCaseBindingDao
    CaseService caseService
    UserService userService

    def setup() {
        userInfoDao = new UserInfoDao(tempDir)
        def users = [
                new UserInfo("id1").with(true) {
                    userName = "user1"
                    role = "admin"
                },
                new UserInfo("id2").with(true) {
                    userName = "user2"
                    role = "user"
                },
                new UserInfo("id100").with(true) {
                    userName = "user100"
                    role = "user"
                }
        ] as List<UserInfo>
        userInfoDao.save(users)

        userCaseBindingDao = new UserCaseBindingDao(tempDir)
        def bindings = [
                new UserCaseBinding("id1", [1, 2, 3] as Set<Integer>),
                new UserCaseBinding("id2", [3, 4, 5] as Set<Integer>),
                new UserCaseBinding("id3", [3, 4, 5] as Set<Integer>)
        ] as List<UserCaseBinding>
        userCaseBindingDao.save(bindings)

        caseService = Spy(CaseService) {
            getResource(_) >> {int id  -> Optional.ofNullable(
                switch (id) {
                    case 3 -> null
                    default -> new Case(id).with(true) {
                        caseName = "case${id}"
                        description = "description${id}"
                        status = id % 2 == 0 ? CLOSED : ACTIVE
                    }
                })
            }
        }

        userService = new UserService()
        userService.resourceDao = userInfoDao
        userService.userCaseBindingDao = userCaseBindingDao
        userService.caseService = caseService
        userService.init()

    }

    def "init"() {
        expect:
        userService.resourceMap.size() == 3
        with(userService.resourceMap["id1"]) {
            userId == "id1"
            userName == "user1"
            role == "admin"
        }
        with(userService.resourceMap["id2"]) {
            userId == "id2"
            userName == "user2"
            role == "user"
        }
        with(userService.resourceMap["id100"]) {
            userId == "id100"
            userName == "user100"
            role == "user"
        }
        userService.bindingMap.size() == 2
        with(userService.bindingMap["id1"]) {
            userId() == "id1"
            caseSet() == [1, 2] as Set<Integer>
        }
        with(userService.bindingMap["id2"]) {
            userId() == "id2"
            caseSet() == [4, 5] as Set<Integer>
        }
    }

    def "updateResource"() {
        when:
        def userInfo = new UserInfo("id100").with(true) {
            userName = "user100-updated"
            role = "user-updated"
        }
        userInfo = userService.updateResource(userInfo)

        then:
        with(userInfo) {
            userId == "id100"
            userName == "user100-updated"
            role == "user-updated"
        }
        with(userService.resourceMap["id100"]) {
            userId == "id100"
            userName == "user100-updated"
            role == "user-updated"
        }

        when:
        userInfo = new UserInfo("id200").with(true) {
            userName = "user200-updated"
            role = "user-updated"
        }
        userService.updateResource(userInfo)

        then:
        thrown(TimeRecorderException)
    }

    def "removeResource"() {
        when:
        userService.removeResource("id1")
        def bindings = userCaseBindingDao.load()

        then:
        userService.resourceMap.size() == 2
        userService.bindingMap.size() == 1
        userService.resourceMap.containsKey("id2")
        userService.resourceMap.containsKey("id100")
        userService.bindingMap.containsKey("id2")
        bindings.size() == 1
    }

    def "getUserBindings"() {
        when:
        userService.getUserBindings("non-exist")

        then:
        thrown(TimeRecorderException)

        when:
        def bindings = userService.getUserBindings("id100")

        then:
        bindings.size()== 0

        when:
        bindings = userService.getUserBindings("id2")

        then:
        bindings.size() == 2
        bindings[0].caseName == "case4"
        bindings[1].caseName == "case5"
    }

    def "UpdateUserBindings"() {
        when:
        def binding = new UserCaseBinding("id1", [1, 2, 3, 4] as Set<Integer>)
        binding = userService.updateUserBinding(binding)

        then:
        binding.size() == 3
        binding[0].caseName == "case1"
        binding[1].caseName == "case2"
        binding[2].caseName == "case4"
        userService.bindingMap["id1"].caseSet().size() == 3
    }
}
