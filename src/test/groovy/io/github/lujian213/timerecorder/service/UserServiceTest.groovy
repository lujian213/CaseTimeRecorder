package io.github.lujian213.timerecorder.service


import io.github.lujian213.timerecorder.dao.UserCaseBindingDao
import io.github.lujian213.timerecorder.dao.UserInfoDao
import io.github.lujian213.timerecorder.exception.TimeRecorderException
import io.github.lujian213.timerecorder.model.Case
import io.github.lujian213.timerecorder.model.Role
import io.github.lujian213.timerecorder.model.UserCaseBinding
import io.github.lujian213.timerecorder.model.UserInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.crypto.password.PasswordEncoder
import spock.lang.Specification
import spock.lang.TempDir

import static io.github.lujian213.timerecorder.model.Case.CaseStatus.ACTIVE
import static io.github.lujian213.timerecorder.model.Case.CaseStatus.CLOSED

@SpringBootTest
class UserServiceTest extends Specification {
    @TempDir
    File tempDir

    UserInfoDao userInfoDao
    UserCaseBindingDao userCaseBindingDao
    CaseService caseService
    @Autowired
    UserService userService

    def setup() {
        userInfoDao = new UserInfoDao(tempDir)
        def users = [
                new UserInfo("id1").with(true) {
                    userName = "user1"
                    role = Role.USER
                },
                new UserInfo("id100").with(true) {
                    userName = "user100"
                    role = Role.USER
                }
        ] as List<UserInfo>
        userInfoDao.save(users)

        userCaseBindingDao = new UserCaseBindingDao(tempDir)
        def bindings = [
                new UserCaseBinding("admin", [1, 2, 3] as Set<Integer>),
                new UserCaseBinding("id1",  [3, 4, 5] as Set<Integer>),
                new UserCaseBinding("id11", [3, 4, 5] as Set<Integer>)
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

        userService.resourceDao = userInfoDao
        userService.userCaseBindingDao = userCaseBindingDao
        userService.caseService = caseService
        userService.passwordEncoder = Mock(PasswordEncoder)
        userService.init()

    }

    def "init"() {
        expect:
        userService.resourceMap.size() == 3
        with(userService.resourceMap["admin"]) {
            userId == "admin"
            userName == "admin"
            role == Role.ADMIN
        }
        with(userService.resourceMap["id1"]) {
            userId == "id1"
            userName == "user1"
            role == Role.USER
        }
        with(userService.resourceMap["id100"]) {
            userId == "id100"
            userName == "user100"
            role == Role.USER
        }
        userService.bindingMap.size() == 2
        with(userService.bindingMap["admin"]) {
            userId() == "admin"
            caseSet() == [1, 2] as Set<Integer>
        }
        with(userService.bindingMap["id1"]) {
            userId() == "id1"
            caseSet() == [4, 5] as Set<Integer>
        }
    }

    def "addResource"() {
        when:
        def userInfo = new UserInfo("id2", "user2", Role.USER, "user2-pass")
        userInfo = userService.addResource(userInfo)
        userService.updateUserBinding(new UserCaseBinding("id2", [3, 4, 5] as Set<Integer>))

        then:
        1 * userService.passwordEncoder.encode(_) >> {}
        with(userInfo) {
            userId == "id2"
            userName == "user2"
            role == Role.USER
            password == "***"
        }
        with(userService.resourceMap["id2"]) {
            userId == "id2"
            userName == "user2"
            role == Role.USER
        }
        with(userService.bindingMap["id2"]) {
            userId() == "id2"
            caseSet() == [4, 5] as Set<Integer>
        }

        when:
        userInfo = new UserInfo("id2", "user2", Role.USER, "user2-pass")
        userService.addResource(userInfo)

        then:
        thrown(TimeRecorderException)
    }

    def "updateResource"() {
        when:
        def userInfo = new UserInfo("id100", "user100-updated", Role.USER, "user100-updated")
        userInfo = userService.updateResource(userInfo)

        then:
        1 * userService.passwordEncoder.encode(_) >> {}
        with(userInfo) {
            userId == "id100"
            userName == "user100-updated"
            role == Role.USER
            password == "***"
        }
        with(userService.resourceMap["id100"]) {
            userId == "id100"
            userName == "user100-updated"
            role == Role.USER
        }

        when: // update without new password
        userInfo = new UserInfo("id100", "user100-updated-updated", Role.USER, "")
        userInfo = userService.updateResource(userInfo)

        then:
        0 * userService.passwordEncoder.encode(_) >> {}
        with(userInfo) {
            userId == "id100"
            userName == "user100-updated-updated"
            role == Role.USER
            password == "***"
        }

        when:
        userInfo = new UserInfo("id200").with(true) {
            userName = "user200-updated"
            role = Role.USER
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
        userService.resourceMap.size() == 3
        userService.bindingMap.size() == 2
        userService.resourceMap.containsKey("id2")
        userService.resourceMap.containsKey("id100")
        userService.bindingMap.containsKey("admin")
        userService.bindingMap.containsKey("id2")
        bindings.size() == 2
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
