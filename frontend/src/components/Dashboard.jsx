import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  Copy, 
  Check, 
  TrendingUp, 
  Building2,
  Zap,
  PlusCircle,
  MinusCircle,
  Sparkles
} from 'lucide-react';

export default function Dashboard({ 
  onOpenTransfer, 
  onOpenDeposit, 
  onOpenWithdraw, 
  onOpenBillPay,
  setActiveTab 
}) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [copiedAcc, setCopiedAcc] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accRes = await apiService.getAccounts();
      setAccounts(accRes.accounts);

      if (accRes.accounts.length > 0) {
        const txnRes = await apiService.getTransactions(accRes.accounts[0].accountNumber);
        setTransactions(txnRes.transactions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (accNo) => {
    navigator.clipboard.writeText(accNo);
    setCopiedAcc(accNo);
    setTimeout(() => setCopiedAcc(''), 2000);
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + (parseFloat(curr.balance) || 0), 0);

  const weeklyData = [
    { day: 'Mon', amount: '₹14,200', percent: '40%' },
    { day: 'Tue', amount: '₹28,500', percent: '65%' },
    { day: 'Wed', amount: '₹12,100', percent: '30%' },
    { day: 'Thu', amount: '₹48,900', percent: '90%' },
    { day: 'Fri', amount: '₹22,400', percent: '55%' },
    { day: 'Sat', amount: '₹35,800', percent: '75%' },
    { day: 'Sun', amount: '₹18,200', percent: '42%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Total Net Worth Hero Card */}
      <div className="glass-panel-hero" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-gold">
                <Sparkles size={12} /> Total Net Worth
              </span>
              <span className="hero-subtitle" style={{ fontSize: '0.8rem' }}>DICGC Insured Portfolio</span>
            </div>
            <h2 className="hero-number" style={{ fontSize: '3.2rem', letterSpacing: '-1px' }}>
              {formatINR(totalBalance)}
            </h2>
            <p className="hero-subtitle" style={{ fontSize: '0.875rem', marginTop: '6px' }}>
              Combined liquidity across {accounts.length} linked accounts • IFSC: <span className="font-mono" style={{ color: 'var(--primary-gold)', fontWeight: '700' }}>ATHR0000409</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-gold" onClick={onOpenTransfer}>
              <Send size={18} /> IMPS Transfer
            </button>
            <button className="btn-primary" onClick={onOpenDeposit}>
              <PlusCircle size={18} /> Deposit Cash
            </button>
          </div>
        </div>
      </div>

      {/* Quick Banking Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        
        {/* Deposit Cash */}
        <button 
          onClick={onOpenDeposit}
          className="glass-panel"
          style={{
            padding: '20px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(5, 150, 105, 0.3)'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-emerald)' }}>
            <PlusCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>Deposit Cash</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CDM / Cheque Credit</div>
          </div>
        </button>

        {/* Withdraw Cash */}
        <button 
          onClick={onOpenWithdraw}
          className="glass-panel"
          style={{
            padding: '20px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(220, 38, 38, 0.3)'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(220, 38, 38, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
            <MinusCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>Withdraw Cash</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ATM PIN Debit</div>
          </div>
        </button>

        {/* IMPS / NEFT Transfer */}
        <button 
          onClick={onOpenTransfer}
          className="glass-panel"
          style={{
            padding: '20px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(217, 119, 6, 0.3)'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-gold)' }}>
            <Send size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>IMPS / NEFT</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant Transfer</div>
          </div>
        </button>

        {/* Bill Pay & BBPS */}
        <button 
          onClick={onOpenBillPay}
          className="glass-panel"
          style={{
            padding: '20px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(37, 99, 235, 0.3)'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>Bill Pay & BBPS</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Utility Settlement</div>
          </div>
        </button>

      </div>

      {/* Account Summary Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>Active Accounts</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-emerald)', fontWeight: '700' }}>
            RBI Regulated • Zero Fees
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '22px' }}>
          {accounts.map(acc => (
            <div key={acc.id} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className={`badge ${acc.accountType === 'SAVINGS' ? 'badge-gold' : 'badge-info'}`}>
                    {acc.accountType} ACCOUNT
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <span className="font-mono" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                      {acc.accountNumber}
                    </span>
                    <button 
                      onClick={() => handleCopy(acc.accountNumber)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      {copiedAcc === acc.accountNumber ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'var(--bg-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 size={24} color="var(--primary-gold)" />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Available Balance</div>
                <div style={{ fontSize: '1.9rem', fontWeight: '800', marginTop: '2px', color: 'var(--text-main)' }}>
                  {formatINR(acc.balance)}
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={onOpenDeposit}
                  style={{ flex: 1, padding: '8px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.3)', color: 'var(--primary-emerald)', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  + Deposit
                </button>
                <button 
                  onClick={onOpenWithdraw}
                  style={{ flex: 1, padding: '8px', borderRadius: '10px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  - Withdraw
                </button>
                <button 
                  onClick={onOpenTransfer}
                  style={{ flex: 1, padding: '8px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', color: 'var(--primary-gold)', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  Transfer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics & Passbook Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Outflow Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>Outflow Volume (INR)</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weekly IMPS / NEFT transactions</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-emerald)', fontSize: '0.85rem', fontWeight: '800' }}>
              <TrendingUp size={16} /> +8.6%
            </div>
          </div>

          <div className="chart-bar-container" style={{ height: '160px' }}>
            {weeklyData.map((item, idx) => (
              <div key={idx} className="chart-bar-wrapper">
                <div 
                  className="chart-bar" 
                  style={{ height: item.percent }}
                  title={item.amount}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Passbook Transactions */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>Passbook Activity</h3>
            <button 
              onClick={() => setActiveTab('transactions')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer' }}
            >
              Full Statement
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.slice(0, 4).map(txn => {
              const isCredit = txn.transactionType === 'DEPOSIT';
              return (
                <div key={txn.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isCredit ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCredit ? 'var(--primary-emerald)' : 'var(--danger)'
                    }}>
                      {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{txn.description}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }} className="font-mono">{txn.transactionId}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '800',
                      color: isCredit ? 'var(--primary-emerald)' : 'var(--text-main)'
                    }}>
                      {isCredit ? '+' : '-'}{formatINR(txn.amount)}
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
