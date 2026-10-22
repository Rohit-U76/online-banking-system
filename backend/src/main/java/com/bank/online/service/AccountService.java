package com.bank.online.service;

import com.bank.online.model.Account;
import com.bank.online.model.User;
import com.bank.online.repository.AccountRepository;
import com.bank.online.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;


    // =========================================================
    // GET ALL ACCOUNTS OF LOGGED-IN USER
    // =========================================================

    public List<Account> getUserAccounts(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + username)
                );

        return accountRepository.findByUserId(user.getId());
    }


    // =========================================================
    // GET ACCOUNT BY ACCOUNT NUMBER
    // =========================================================

    public Account getAccountByNumber(String accountNumber) {

        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Account not found: " + accountNumber
                        )
                );
    }


    // =========================================================
    // DEPOSIT MONEY
    // =========================================================

    @Transactional
    public Account deposit(String accountNumber, BigDecimal amount) {

        // Validate amount
        if (amount == null) {
            throw new RuntimeException("Deposit amount cannot be null");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Deposit amount must be greater than zero"
            );
        }

        // Find account
        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Account not found: " + accountNumber
                        )
                );

        // Calculate new balance
        BigDecimal currentBalance = account.getBalance();

        BigDecimal newBalance = currentBalance.add(amount);

        // Update balance
        account.setBalance(newBalance);

        // Save to MySQL
        return accountRepository.save(account);
    }


    // =========================================================
    // WITHDRAW MONEY
    // =========================================================

    @Transactional
    public Account withdraw(String accountNumber, BigDecimal amount) {

        // Validate amount
        if (amount == null) {
            throw new RuntimeException("Withdrawal amount cannot be null");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Withdrawal amount must be greater than zero"
            );
        }

        // Find account
        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Account not found: " + accountNumber
                        )
                );

        BigDecimal currentBalance = account.getBalance();

        // Check sufficient balance
        if (currentBalance.compareTo(amount) < 0) {
            throw new RuntimeException(
                    "Insufficient balance"
            );
        }

        // Calculate new balance
        BigDecimal newBalance = currentBalance.subtract(amount);

        // Update balance
        account.setBalance(newBalance);

        // Save to MySQL
        return accountRepository.save(account);
    }
}