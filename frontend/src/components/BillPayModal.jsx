import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { X, Zap, CheckCircle2, Smartphone, Wifi, Tv, Flame } from 'lucide-react';

export default function BillPayModal({ onClose, onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [billCategory, setBillCategory] = useState('ELECTRICITY');
  const [billerName, setBillerName] = useState('Tata Power / State Electricity Board');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');
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

  const handleBillPay = async (e) => {
    e.preventDefault();
    if (!accountNumber || !consumerNumber || !amount) {
      setError('Please provide Consumer Number and Bill Amount.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const note = `[BBPS-${billCategory}] ${billerName} (Cons No: ${consumerNumber})`;
      const res = await apiService.transferFunds(accountNumber, `BBPS-${billCategory}`, amount, note);
      setReceipt(res.transaction);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Bill payment failed.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'ELECTRICITY', name: 'Electricity', icon: Zap },
    { id: 'MOBILE', name: 'Mobile Recharge', icon: Smartphone },
    { id: 'BROADBAND', name: 'Broadband / Fiber', icon: Wifi },
    { id: 'DTH', name: 'DTH / Cable', icon: Tv },
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel" style={{ padding: '32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Bharat BillPay & Recharges</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instant utility bill settlement via BBPS</p>
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
              background: 'rgba(0, 242, 254, 0.15)',
              color: 'var(--primary-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Bill Payment Successful!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              BBPS Reference: <span className="font-mono" style={{ color: 'var(--primary-cyan)', fontWeight: '700' }}>{receipt.transactionId}</span>
            </p>

            <div className="glass-panel" style={{ padding: '18px', textAlign: 'left', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Amount Paid:</span>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--primary-cyan)' }}>{formatINR(receipt.amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Biller & Category:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{billCategory}</span>
              </div>
            </div>

            <button className="btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleBillPay}>
            {error && (
              <div className="badge badge-danger" style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Bill Category selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSel = billCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setBillCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isSel ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSel ? '1px solid rgba(0, 242, 254, 0.35)' : '1px solid var(--border-glass)',
                      color: isSel ? 'var(--primary-cyan)' : 'var(--text-muted)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={18} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="form-group">
              <label className="form-label">Debiting Account</label>
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
              <label className="form-label">Consumer / Account / Mobile Number</label>
              <input
                type="text"
                className="form-input font-mono"
                placeholder="e.g. 10049281049"
                required
                value={consumerNumber}
                onChange={e => setConsumerNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bill Amount (INR - ₹)</label>
              <div style={{ position: 'relative' }}>
                <span className="rupee-symbol" style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '1.2rem', color: 'var(--primary-cyan)' }}>
                  ₹
                </span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  className="form-input font-mono"
                  style={{ paddingLeft: '38px', fontSize: '1.2rem', fontWeight: '800' }}
                  placeholder="0.00"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Settling Utility Bill...' : 'Pay Bill Now'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
