import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { X, CheckCircle2 } from 'lucide-react';

export default function TransferModal({ onClose, onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [sourceAcc, setSourceAcc] = useState('');
  const [targetAcc, setTargetAcc] = useState('');
  const [ifsc, setIfsc] = useState('ATHR0000409');
  const [transferMode, setTransferMode] = useState('IMPS');
  const [amount, setAmount] = useState('');
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
        setSourceAcc(res.accounts[0].accountNumber);
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

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!sourceAcc || !targetAcc || !amount) {
      setError('Please fill in all required transfer details.');
      return;
    }
    if (sourceAcc === targetAcc) {
      setError('Source and target accounts cannot be the same.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullNote = `[${transferMode}] ${description || 'Direct Money Transfer'}`;
      const res = await apiService.transferFunds(sourceAcc, targetAcc, amount, fullNote);
      setReceipt(res.transaction);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Transfer execution failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel" style={{ padding: '32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>IMPS / NEFT / UPI Transfer</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instant beneficiary payment transfer in INR (₹)</p>
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

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>Transfer Successful!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Reference UTR: <span className="font-mono" style={{ color: 'var(--primary-gold)', fontWeight: '700' }}>{receipt.transactionId}</span>
            </p>

            <div className="glass-panel" style={{ padding: '18px', textAlign: 'left', marginBottom: '24px', background: 'var(--bg-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Amount Transferred:</span>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--primary-emerald)' }}>{formatINR(receipt.amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Remitter Account:</span>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{receipt.sourceAccountNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Beneficiary Account / UPI:</span>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{receipt.targetAccountNumber}</span>
              </div>
            </div>

            <button className="btn-gold" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleTransfer}>
            {error && (
              <div className="badge badge-danger" style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Transfer Mode Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['IMPS', 'NEFT', 'RTGS', 'UPI'].map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTransferMode(mode)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '10px',
                    background: transferMode === mode ? 'var(--gradient-gold)' : 'var(--bg-glass)',
                    color: transferMode === mode ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border-glass)',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Debiting Account</label>
              <select
                className="form-select"
                value={sourceAcc}
                onChange={e => setSourceAcc(e.target.value)}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.accountNumber}>
                    {a.accountType} ({a.accountNumber}) - {formatINR(a.balance)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Beneficiary Account / UPI ID</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="e.g. CA-8091009951 or user@upi"
                  required
                  value={targetAcc}
                  onChange={e => setTargetAcc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="ATHR0000409"
                  value={ifsc}
                  onChange={e => setIfsc(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Beneficiary Presets */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {accounts.filter(a => a.accountNumber !== sourceAcc).map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setTargetAcc(a.accountNumber)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  My {a.accountType} Account
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTargetAcc('UPI-9876543210@pay')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                UPI Quick Pay
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Transfer Amount (INR - ₹)</label>
              <div style={{ position: 'relative' }}>
                <span className="rupee-symbol" style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '1.2rem', color: 'var(--primary-gold)' }}>
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

            {/* Quick Amount Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[1000, 5000, 10000, 50000].map(val => (
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
              <label className="form-label">Payment Remarks (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Vendor Payment / Gift"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(217, 119, 6, 0.08)',
              border: '1px solid rgba(217, 119, 6, 0.25)',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>IMPS Service Fee:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary-emerald)' }}>₹ 0.00 (Zero Charge)</span>
            </div>

            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Processing IMPS Transfer...' : 'Authorize & Execute Transfer'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
