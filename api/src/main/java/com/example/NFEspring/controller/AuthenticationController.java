package com.example.NFEspring.controller;

import com.example.NFEspring.entity.Permission;
import com.example.NFEspring.entity.User;
import com.example.NFEspring.provider.AuthenticationProvider;
import com.example.NFEspring.repository.IPermissionRepository;
import com.example.NFEspring.repository.IUserRepository;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.NFEspring.utils.SecurityUtils;
import com.example.NFEspring.utils.SerializableUtils;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
public class AuthenticationController extends ABaseController {

    @Autowired
    private IUserRepository users;

    @Autowired
    private IPermissionRepository permissionRepository;

    @PostMapping("/login")
    public ResponseEntity<?> findById(@RequestBody ObjectNode objectNode) throws NoSuchFieldException, NoSuchAlgorithmException, InvalidKeySpecException {
        String nfeid = objectNode.get("nfeid").asText();
        String password = objectNode.get("password").asText();

        User user = new ArrayList<>(this.users
                .findByNfeid(nfeid))
                .stream()
                .findFirst()
                .orElseThrow(() -> new NoSuchFieldException("user with nfeid " + nfeid + " not found"));

        if (!SecurityUtils.createPbkdf2(password, user.getSalt(), user.getIterations()).equals(user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(SerializableUtils.singletonMap("error", "Forbidden: access denied - bad nfeid / password"));
        }

        Collection<Permission> permissions = this.permissionRepository
                .findByRole(user.getRole().getId());

        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap(
                        "token",
                        AuthenticationProvider.getToken(new HashMap<>() {{
                            put("userId", user.getId());
                            put("pseudo", user.getPseudo());
                            put("roleId", user.getRole().getId());
                            put("permissions", permissions);
                        }})
                ));
    }

}
