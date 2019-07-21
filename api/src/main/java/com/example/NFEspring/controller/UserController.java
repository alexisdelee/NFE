package com.example.NFEspring.controller;

import com.example.NFEspring.entity.User;
import com.example.NFEspring.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.NFEspring.utils.SerializableUtils;

import java.util.Collection;

@RestController
@RequestMapping("/users")
public class UserController extends ABaseController {

    @Autowired
    private IUserRepository users;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        Collection<User> users = this.users.findAll();
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("users", users));
    }

}
