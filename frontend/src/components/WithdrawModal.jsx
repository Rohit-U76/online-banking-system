import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { X, ArrowUpRight, CheckCircle2, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

export default function WithdrawModal({ onClose, onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [atmPin, setAtmPin] = useState('');
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

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    if (!accountNumber || !amount || !atmPin) {
      setError('Please fill in account, amount, and 4-digit ATM Security PIN.');
      return;
    }
    if (atmPin.length !== 4) {
      setError('ATM PIN must be exactly 4 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const note = `[ATM-WITHDRAWAL] ${description || 'Cash Withdrawal'}`;
      const res = await apiService.withdrawCash(accountNumber, amount, note);
      setReceipt(res.transaction);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Withdrawal failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel" style={{ padding: '32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>ATM Cash Withdrawal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Debit cash from account with 4-digit PIN verification</p>
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
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Cash Dispensed!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              ATM Slip Ref: <span className="font-mono" style={{ color: '#ef4444', fontWeight: '700' }}>{receipt.transactionId}</span>
            </p>

            <div className="glass-panel" style={{ padding: '18px', textAlign: 'left', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Amount Debited:</span>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#ef4444' }}>-{formatINR(receipt.amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Debited Account:</span>
                <span className="font-mono" style={{ fontSize: '0.85rem' }}>{receipt.sourceAccountNumber}</span>
              </div>
            </div>

            <button className="btn-secondary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Close & Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleWithdrawal}>
            {error && (
              <div className="badge badge-danger" style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Select Account to Debit</label>
              <select
                className="form-select"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.accountNumber}>
                    {a.accountType} ({a.accountNumber}) - Available: {formatINR(a.balance)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Withdrawal Amount (INR - ₹)</label>
              <div style={{ position: 'relative' }}>
                <span className="rupee-symbol" style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '1.2rem', color: '#ef4444' }}>
                  ₹
                </span>
                <input
                  type="number"
                  step="500"
                  min="500"
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
              {[1000, 2000, 5000, 10000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ₹{val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">4-Digit Security ATM PIN</label>
              <input
                type="password"
                maxLength="4"
                className="form-input font-mono"
                placeholder="••••"
                required
                value={atmPin}
                onChange={e => setAtmPin(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Withdrawal Purpose (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Travel Cash"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-secondary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', borderColor: '#ef4444', color: '#ef4444' }}
            >
              {loading ? 'Authorizing Withdrawal...' : 'Withdraw Cash'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
