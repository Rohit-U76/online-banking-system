import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { X, CheckCircle2 } from 'lucide-react';

export default function DepositModal({ onClose, onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('CDM'); // CDM, CHEQUE, UPI
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const res = await apiService.getAccounts();
      setAccounts(res.accounts);
      if (res.accounts.length > 0) {
        setAccountNumber(res.accounts[0].accountNumber);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val || 0);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!accountNumber || !amount) {
      setError('Please select an account and specify amount.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const note = `[${depositMethod}] ${description || 'Cash Deposit'}`;
      const res = await apiService.depositCash(accountNumber, amount, note);
      setReceipt(res.transaction);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Deposit operation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel" style={{ padding: '32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>Deposit Cash / Cheque</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Credit funds directly into your account in INR (₹)</p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {receipt ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(5, 150, 105, 0.15)',
              color: 'var(--primary-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>Deposit Credited!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Reference ID: <span className="font-mono" style={{ color: 'var(--primary-emerald)', fontWeight: '700' }}>{receipt.transactionId}</span>
            </p>

            <div className="glass-panel" style={{ padding: '18px', textAlign: 'left', marginBottom: '24px', background: 'var(--bg-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Amount Credited:</span>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--primary-emerald)' }}>+{formatINR(receipt.amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Beneficiary Account:</span>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{receipt.targetAccountNumber}</span>
              </div>
            </div>

            <button className="btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleDeposit}>
            {error && (
              <div className="badge badge-danger" style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Deposit Channel Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[
                { id: 'CDM', label: 'Cash Machine (CDM)' },
                { id: 'CHEQUE', label: 'Cheque Clearance' },
                { id: 'UPI_ADD', label: 'UPI Add Money' }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setDepositMethod(method.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '10px',
                    background: depositMethod === method.id ? 'var(--gradient-emerald)' : 'var(--bg-glass)',
                    color: depositMethod === method.id ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border-glass)',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Select Beneficiary Account</label>
              <select
                className="form-select"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.accountNumber}>
                    {a.accountType} ({a.accountNumber}) - Balance: {formatINR(a.balance)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Deposit Amount (INR - ₹)</label>
              <div style={{ position: 'relative' }}>
                <span className="rupee-symbol" style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '1.2rem', color: 'var(--primary-emerald)' }}>
                  ₹
                </span>
                <input
                  type="number"
                  step="100"
                  min="100"
                  className="form-input font-mono"
                  style={{ paddingLeft: '38px', fontSize: '1.2rem', fontWeight: '800' }}
                  placeholder="0.00"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[2000, 5000, 10000, 25000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '8px',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  +₹{val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Deposit Remarks / Slip No (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Salary Cash Deposit"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Crediting Deposit...' : 'Confirm & Credit Deposit'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
