package com.bank.online.controller;

import com.bank.online.model.Account;
import com.bank.online.service.AccountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;


    // =========================================================
    // GET ALL ACCOUNTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Account>> getUserAccounts(
            Authentication authentication
    ) {

        String username = authentication.getName();

        List<Account> accounts =
                accountService.getUserAccounts(username);

        return ResponseEntity.ok(accounts);
    }


    // =========================================================
    // GET ACCOUNT BY ACCOUNT NUMBER
    // =========================================================

    @GetMapping("/{accountNumber}")
    public ResponseEntity<Account> getAccountByNumber(
            @PathVariable String accountNumber
    ) {

        Account account =
                accountService.getAccountByNumber(accountNumber);

        return ResponseEntity.ok(account);
    }


    // =========================================================
    // DEPOSIT
    // =========================================================

    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<Account> deposit(
            @PathVariable String accountNumber,
            @RequestParam BigDecimal amount
    ) {

        Account updatedAccount =
                accountService.deposit(accountNumber, amount);

        return ResponseEntity.ok(updatedAccount);
    }


    // =========================================================
    // WITHDRAW
    // =========================================================

    @PostMapping("/{accountNumber}/withdraw")
    public ResponseEntity<Account> withdraw(
            @PathVariable String accountNumber,
            @RequestParam BigDecimal amount
    ) {

        Account updatedAccount =
                accountService.withdraw(accountNumber, amount);

        return ResponseEntity.ok(updatedAccount);
    }
}