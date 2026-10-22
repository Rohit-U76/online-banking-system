package com.bank.online.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class BillPayRequest {

    @NotBlank(message = "Source account number is required")
    private String sourceAccountNumber;

    @NotBlank(message = "Biller name is required")
    private String billerName;

    @NotBlank(message = "Bill category is required")
    private String billCategory;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Payment amount must be greater than 0")
    private BigDecimal amount;

    private String referenceNumber;

    public BillPayRequest() {}

    public BillPayRequest(String sourceAccountNumber, String billerName, String billCategory, BigDecimal amount, String referenceNumber) {
        this.sourceAccountNumber = sourceAccountNumber;
        this.billerName = billerName;
        this.billCategory = billCategory;
        this.amount = amount;
        this.referenceNumber = referenceNumber;
    }

    public String getSourceAccountNumber() { return sourceAccountNumber; }
    public void setSourceAccountNumber(String sourceAccountNumber) { this.sourceAccountNumber = sourceAccountNumber; }

    public String getBillerName() { return billerName; }
    public void setBillerName(String billerName) { this.billerName = billerName; }

    public String getBillCategory() { return billCategory; }
    public void setBillCategory(String billCategory) { this.billCategory = billCategory; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }
}
