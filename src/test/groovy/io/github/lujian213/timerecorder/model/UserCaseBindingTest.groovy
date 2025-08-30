package io.github.lujian213.timerecorder.model

import spock.lang.Specification

class UserCaseBindingTest extends Specification {
    UserCaseBinding binding

    def setup() {
        binding = new UserCaseBinding("id1", [1,2] as Set<Integer>)
    }

    def "AddCase"() {
        when:
        binding.addCase(3)
        then:
        binding.caseSet().size() == 3
        binding.caseSet().containsAll([1,2,3] as Set<Integer>)
    }

    def "RemoveCase"() {
        when:
        binding.removeCase(2)
        then:
        binding.caseSet().size() == 1
        binding.caseSet().containsAll([1] as Set<Integer>)
    }

    def "GetKey"() {
        expect:
        binding.getKey() == "id1"
    }
}
