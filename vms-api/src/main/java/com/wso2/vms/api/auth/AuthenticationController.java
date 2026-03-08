package com.wso2.vms.api.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wso2.vms.api.security.JwtService;
import com.wso2.vms.api.user.User;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(
            @Valid @RequestBody LoginDTO loginUserDto,
            HttpServletResponse response) {

        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        Map<String, Object> extraClaims = new HashMap<>();
        String jwtToken = jwtService.generateToken(extraClaims, authenticatedUser);

        String cookie = String.format(
                "auth_token=%s; Max-Age=%d; Path=/; Secure; HttpOnly; SameSite=None",
                jwtToken,
                7 * 24 * 60 * 60);

        response.addHeader("Set-Cookie", cookie);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setEmail(authenticatedUser.getUsername());
        loginResponse.setRole(authenticatedUser.getRole().toString());

        return ResponseEntity.ok(loginResponse);
    }
}