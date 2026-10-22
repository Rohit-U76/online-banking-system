package com.bank.online.service;

import com.bank.online.dto.DepositRequest;
import com.bank.online.dto.TransferRequest;
import com.bank.online.dto.WithdrawRequest;
import com.bank.online.model.*;
import com.bank.online.repository.AccountRepository;
import com.bank.online.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    public List<Transaction> getAccountTransactions(String accountNumber) {
        return transactionRepository.findAllByAccountNumber(accountNumber);
    }

    @Transactional
    public Transaction processDeposit(DepositRequest request, String authenticatedUsername) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + request.getAccountNumber()));

        if (!account.getUser().getUsername().equals(authenticatedUsername)) {
            throw new SecurityException("Unauthorized: Account does not belong to user.");
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        String txnId = "TXN-DEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Transaction transaction = new Transaction(
                txnId,
                "CASH-DEPOSIT-DESK",
                request.getAccountNumber(),
                request.getAmount(),
                TransactionType.DEPOSIT,
                TransactionStatus.SUCCESS,
                request.getDescription() != null && !request.getDescription().isBlank() ? request.getDescription() : "Cash Deposit Credit"
        );

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction processWithdrawal(WithdrawRequest request, String authenticatedUsername) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + request.getAccountNumber()));

        if (!account.getUser().getUsername().equals(authenticatedUsername)) {
            throw new SecurityException("Unauthorized: Account does not belong to user.");
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient account balance for withdrawal.");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        String txnId = "TXN-WTH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Transaction transaction = new Transaction(
                txnId,
                request.getAccountNumber(),
                "ATM-CASH-WITHDRAWAL",
                request.getAmount(),
                TransactionType.WITHDRAWAL,
                TransactionStatus.SUCCESS,
                request.getDescription() != null && !request.getDescription().isBlank() ? request.getDescription() : "ATM Cash Withdrawal"
        );

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction processTransfer(TransferRequest request, String authenticatedUsername) {
        Account sourceAccount = accountRepository.findByAccountNumber(request.getSourceAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Source account not found: " + request.getSourceAccountNumber()));

        if (!sourceAccount.getUser().getUsername().equals(authenticatedUsername)) {
            throw new SecurityException("Unauthorized: You do not own the source account!");
        }

        BigDecimal transferAmount = request.getAmount();

        if (sourceAccount.getBalance().compareTo(transferAmount) < 0) {
            throw new IllegalArgumentException("Insufficient funds in account: " + request.getSourceAccountNumber());
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(transferAmount));
        accountRepository.save(sourceAccount);

        Account targetAccount = accountRepository.findByAccountNumber(request.getTargetAccountNumber()).orElse(null);
        if (targetAccount != null) {
            targetAccount.setBalance(targetAccount.getBalance().add(transferAmount));
            accountRepository.save(targetAccount);
        }

        String txnId = "TXN-IN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Transaction transaction = new Transaction(
                txnId,
                request.getSourceAccountNumber(),
                request.getTargetAccountNumber(),
                transferAmount,
                TransactionType.TRANSFER,
                TransactionStatus.SUCCESS,
                request.getDescription() != null && !request.getDescription().isBlank() ? request.getDescription() : "Funds Transfer"
        );

        return transactionRepository.save(transaction);
    }
}
