package com.bank.online.service;

import com.bank.online.dto.AuthRequest;
import com.bank.online.dto.JwtResponse;
import com.bank.online.dto.RegisterRequest;
import com.bank.online.model.Account;
import com.bank.online.model.AccountType;
import com.bank.online.model.User;
import com.bank.online.repository.AccountRepository;
import com.bank.online.repository.UserRepository;
import com.bank.online.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public JwtResponse authenticateUser(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getFullName());
    }

    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new IllegalArgumentException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already in use!");
        }

        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFullName()
        );

        User savedUser = userRepository.save(user);

        // Auto-create default Savings (INR 1,50,000) and Checking (INR 45,000) accounts for new users
        String savingsAccNo = "SB-" + (4000000000L + savedUser.getId() * 1000 + (long)(Math.random() * 9000));
        Account savingsAccount = new Account(savingsAccNo, AccountType.SAVINGS, new BigDecimal("150000.00"), "INR", savedUser);
        accountRepository.save(savingsAccount);

        String checkingAccNo = "CA-" + (8000000000L + savedUser.getId() * 1000 + (long)(Math.random() * 9000));
        Account checkingAccount = new Account(checkingAccNo, AccountType.CHECKING, new BigDecimal("45000.00"), "INR", savedUser);
        accountRepository.save(checkingAccount);

        return savedUser;
    }
}
