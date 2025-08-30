package io.github.lujian213.timerecorder.controller;

import io.github.lujian213.timerecorder.model.Case;
import io.github.lujian213.timerecorder.model.UserCaseBinding;
import io.github.lujian213.timerecorder.model.UserInfo;
import io.github.lujian213.timerecorder.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/")
@Tag(name = "User Service", description = "User Service")
public class UserController extends BaseController {
    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "get all users")
    @GetMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<UserInfo> getUsers() {
        return runWithExceptionHandling("get all users error", () -> userService.getAllResources());
    }

    @Operation(summary = "login")
    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserInfo login(@RequestParam String userId) {
        return runWithExceptionHandling("login error", () -> userService.checkResource(userId));
    }

    @Operation(summary = "add new user")
    @PutMapping(value = "/user", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public UserInfo addUser(@RequestBody UserInfo userInfo) {
        return runWithExceptionHandling("add new user error", () -> userService.addResource(userInfo));
    }

    @Operation(summary = "update user")
    @PostMapping(value = "/user", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public UserInfo updateUser(@RequestBody UserInfo userInfo) {
        return runWithExceptionHandling("update user error", () -> userService.updateResource(userInfo));
    }

    @Operation(summary = "delete user")
    @DeleteMapping(value = "/user", consumes = MediaType.TEXT_PLAIN_VALUE)
    public void deleteUser(@RequestBody String userId) {
        runWithExceptionHandling("delete user error", () -> userService.removeResource(userId));
    }

    @Operation(summary = "get user bindings")
    @GetMapping(value = "/user/{userId}/bindings", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Case> getUserBindings(@PathVariable String userId) {
        return runWithExceptionHandling("get user bindings", () -> userService.getUserBindings(userId));
    }

    //    @Operation(summary = "get current user's bindings")
//    @GetMapping(value = "/user/bindings", produces = MediaType.APPLICATION_JSON_VALUE)
//    public List<Case> getUserBindings(Authentication authentication) {
//        return runWithExceptionHandling("get user bindings", () -> userService.getUserBindings(userId));
//    }

    @Operation(summary = "update user bindings")
    @PostMapping(value = "/user/bindings", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Case> updateUserBindings(@RequestBody UserCaseBinding userCaseBindings) {
        return runWithExceptionHandling("update user bindings", () -> userService.updateUserBinding(userCaseBindings));
    }
}