-- Initial Sample Data for Testing (Indian Rupees INR - ₹)
-- Default Password is 'password123' encoded with BCrypt: $2a$10$e7W7J/5w.0Wq5hN3gGvSde4k31bW12xW/Wd9c2e0f1g2h3i4j5k6
INSERT IGNORE INTO users (id, username, email, password, full_name, role) 
VALUES (1, 'john_doe', 'john@example.com', '$2a$10$e7W7J/5w.0Wq5hN3gGvSde4k31bW12xW/Wd9c2e0f1g2h3i4j5k6', 'John Doe', 'ROLE_USER');

INSERT IGNORE INTO accounts (id, account_number, account_type, balance, currency, user_id) 
VALUES 
(1, 'SB-4091008842', 'SAVINGS', 285400.50, 'INR', 1),
(2, 'CA-8091009951', 'CHECKING', 94250.00, 'INR', 1);

INSERT IGNORE INTO transactions (id, transaction_id, source_account_number, target_account_number, amount, transaction_type, status, description)
VALUES
(1, 'TXN-IN89412', 'SALARY-CORP-NEFT', 'SB-4091008842', 125000.00, 'DEPOSIT', 'SUCCESS', 'Direct Salary Credit via NEFT'),
(2, 'TXN-IN89413', 'SB-4091008842', 'CA-8091009951', 25000.00, 'TRANSFER', 'SUCCESS', 'Internal Transfer to Current Account'),
(3, 'TXN-IN89414', 'CA-8091009951', 'UPI-9876543210@pay', 4850.00, 'TRANSFER', 'SUCCESS', 'Utility Bill Payment via IMPS');


SELECT account_number, balance
FROM accounts;