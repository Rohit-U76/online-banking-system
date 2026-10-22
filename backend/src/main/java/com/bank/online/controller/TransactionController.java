package com.bank.online.controller;

import com.bank.online.dto.ApiResponse;
import com.bank.online.dto.DepositRequest;
import com.bank.online.dto.TransferRequest;
import com.bank.online.dto.WithdrawRequest;
import com.bank.online.model.Transaction;
import com.bank.online.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{accountNumber}")
    public ResponseEntity<List<Transaction>> getTransactionsForAccount(@PathVariable String accountNumber) {
        List<Transaction> transactions = transactionService.getAccountTransactions(accountNumber);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> depositCash(@Valid @RequestBody DepositRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Transaction transaction = transactionService.processDeposit(request, username);
            return ResponseEntity.ok(transaction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Deposit failed."));
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdrawCash(@Valid @RequestBody WithdrawRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Transaction transaction = transactionService.processWithdrawal(request, username);
            return ResponseEntity.ok(transaction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Withdrawal failed."));
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(@Valid @RequestBody TransferRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Transaction transaction = transactionService.processTransfer(request, username);
            return ResponseEntity.ok(transaction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to execute transfer."));
        }
    }
}
