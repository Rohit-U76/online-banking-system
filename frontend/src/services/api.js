// API service layer connecting to Spring Boot backend (/api) with automatic Mock Mode fallback

const API_BASE_URL = 'http://localhost:8080/api';

// Initial Mock State formatted in Indian Rupees (INR - ₹)
let mockAccounts = [
  {
    id: 1,
    accountNumber: 'SB-4091008842',
    ifscCode: 'ATHR0000409',
    accountType: 'SAVINGS',
    balance: 285400.50,
    currency: 'INR',
    createdAt: '2025-01-15T08:30:00'
  },
  {
    id: 2,
    accountNumber: 'CA-8091009951',
    ifscCode: 'ATHR0000409',
    accountType: 'CHECKING',
    balance: 94250.00,
    currency: 'INR',
    createdAt: '2025-01-20T10:15:00'
  }
];

let mockTransactions = [
  {
    id: 1,
    transactionId: 'TXN-IN89412',
    sourceAccountNumber: 'CORP-SALARY-NEFT',
    targetAccountNumber: 'SB-4091008842',
    amount: 125000.00,
    transactionType: 'DEPOSIT',
    status: 'SUCCESS',
    description: 'Monthly Direct Salary Credit via NEFT',
    createdAt: '2026-08-10T14:30:00'
  },
  {
    id: 2,
    transactionId: 'TXN-IN89413',
    sourceAccountNumber: 'SB-4091008842',
    targetAccountNumber: 'CA-8091009951',
    amount: 25000.00,
    transactionType: 'TRANSFER',
    status: 'SUCCESS',
    description: 'Internal Transfer to Current Account',
    createdAt: '2026-08-12T09:20:00'
  },
  {
    id: 3,
    transactionId: 'TXN-IN89414',
    sourceAccountNumber: 'CA-8091009951',
    targetAccountNumber: 'UPI-9876543210@pay',
    amount: 4850.00,
    transactionType: 'TRANSFER',
    status: 'SUCCESS',
    description: 'Electricity & Utility Bill via IMPS',
    createdAt: '2026-08-14T11:45:00'
  }
];

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  const jwt = token || localStorage.getItem('jwt_token');
  if (jwt) {
    headers['Authorization'] = `Bearer ${jwt}`;
  }
  return headers;
};

export const apiService = {
  // Auth API
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) throw new Error('Invalid username or password');
      const data = await response.json();
      localStorage.setItem('jwt_token', data.token);
      return { data, isMock: false };
    } catch (err) {
      console.warn('Backend offline, running in Mock Mode:', err.message);
      const data = {
        token: 'mock-jwt-token-aetheris-8849',
        id: 1,
        username: username || 'john_doe',
        email: `${username || 'john'}@aetherisbank.in`,
        fullName: username ? username.toUpperCase().replace('_', ' ') : 'John Doe'
      };
      localStorage.setItem('jwt_token', data.token);
      return { data, isMock: true };
    }
  },

  async register(username, email, password, fullName) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, email, password, fullName })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      return await response.json();
    } catch (err) {
      console.warn('Backend offline, running Register Mock Mode:', err.message);
      return { success: true, message: 'Account registered successfully in Demo Mode!' };
    }
  },

  // Accounts API
  async getAccounts() {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      return { accounts: data, isMock: false };
    } catch (err) {
      console.warn('Backend offline, using fallback mock accounts');
      return { accounts: mockAccounts, isMock: true };
    }
  },

  // Transactions API
  async getTransactions(accountNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${accountNumber}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      return { transactions: data, isMock: false };
    } catch (err) {
      console.warn('Backend offline, using fallback mock transactions');
      const filtered = mockTransactions.filter(
        t => t.sourceAccountNumber === accountNumber || t.targetAccountNumber === accountNumber
      );
      return { transactions: filtered.length ? filtered : mockTransactions, isMock: true };
    }
  },

  async depositCash(accountNumber, amount, description) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/deposit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ accountNumber, amount: parseFloat(amount), description })
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.message || 'Deposit failed');
      }
      const data = await response.json();
      return { transaction: data, isMock: false };
    } catch (err) {
      console.warn('Executing deposit in Mock Mode');
      const parsedAmount = parseFloat(amount);
      const acc = mockAccounts.find(a => a.accountNumber === accountNumber);
      if (acc) {
        acc.balance += parsedAmount;
      }
      const newTxn = {
        id: mockTransactions.length + 1,
        transactionId: `TXN-DEP-${Math.floor(10000 + Math.random() * 90000)}`,
        sourceAccountNumber: 'CASH-CDM-DESK',
        targetAccountNumber: accountNumber,
        amount: parsedAmount,
        transactionType: 'DEPOSIT',
        status: 'SUCCESS',
        description: description || 'CDM Cash Deposit Credit',
        createdAt: new Date().toISOString()
      };
      mockTransactions.unshift(newTxn);
      return { transaction: newTxn, isMock: true };
    }
  },

  async withdrawCash(accountNumber, amount, description) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/withdraw`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ accountNumber, amount: parseFloat(amount), description })
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.message || 'Withdrawal failed');
      }
      const data = await response.json();
      return { transaction: data, isMock: false };
    } catch (err) {
      console.warn('Executing withdrawal in Mock Mode');
      const parsedAmount = parseFloat(amount);
      const acc = mockAccounts.find(a => a.accountNumber === accountNumber);
      if (acc) {
        if (acc.balance < parsedAmount) {
          throw new Error('Insufficient account balance for withdrawal!');
        }
        acc.balance -= parsedAmount;
      }
      const newTxn = {
        id: mockTransactions.length + 1,
        transactionId: `TXN-WTH-${Math.floor(10000 + Math.random() * 90000)}`,
        sourceAccountNumber: accountNumber,
        targetAccountNumber: 'ATM-CASH-WITHDRAWAL',
        amount: parsedAmount,
        transactionType: 'WITHDRAWAL',
        status: 'SUCCESS',
        description: description || 'ATM Cash Debit',
        createdAt: new Date().toISOString()
      };
      mockTransactions.unshift(newTxn);
      return { transaction: newTxn, isMock: true };
    }
  },

  async transferFunds(sourceAccountNumber, targetAccountNumber, amount, description) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/transfer`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ sourceAccountNumber, targetAccountNumber, amount: parseFloat(amount), description })
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.message || 'Transfer failed');
      }
      const data = await response.json();
      return { transaction: data, isMock: false };
    } catch (err) {
      console.warn('Executing transfer in Mock Mode (INR)');
      const parsedAmount = parseFloat(amount);
      const srcAcc = mockAccounts.find(a => a.accountNumber === sourceAccountNumber);
      if (srcAcc) {
        if (srcAcc.balance < parsedAmount) {
          throw new Error('Insufficient balance in selected account!');
        }
        srcAcc.balance -= parsedAmount;
      }
      const tgtAcc = mockAccounts.find(a => a.accountNumber === targetAccountNumber);
      if (tgtAcc) {
        tgtAcc.balance += parsedAmount;
      }

      const newTxn = {
        id: mockTransactions.length + 1,
        transactionId: `TXN-IN${Math.floor(10000 + Math.random() * 90000)}`,
        sourceAccountNumber,
        targetAccountNumber,
        amount: parsedAmount,
        transactionType: 'TRANSFER',
        status: 'SUCCESS',
        description: description || 'Instant IMPS Transfer',
        createdAt: new Date().toISOString()
      };
      mockTransactions.unshift(newTxn);
      return { transaction: newTxn, isMock: true };
    }
  }
};
