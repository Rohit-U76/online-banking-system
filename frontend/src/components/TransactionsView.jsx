import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Search, Download, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

export default function TransactionsView() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await apiService.getTransactions('SB-4091008842');
      setTransactions(res.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val || 0);
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
                          t.transactionId.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || t.transactionType === filterType;
    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Transaction Reference,Source Account,Beneficiary Account,Amount (INR),Type,Status,Date"]
      .concat(filtered.map(t => `${t.transactionId},${t.sourceAccountNumber},${t.targetAccountNumber},INR ${t.amount},${t.transactionType},${t.status},${t.createdAt}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aetheris_Passbook_Statement_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>Passbook & Statement Ledger</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Official audit record of IMPS, NEFT, RTGS, and UPI transactions in INR</p>
        </div>
        <button className="btn-gold" onClick={exportCSV}>
          <Download size={18} /> Download Statement (.CSV)
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by remark, beneficiary, or reference ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select
            className="form-select"
            style={{ width: '180px' }}
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="ALL">All Payments</option>
            <option value="TRANSFER">Transfers (IMPS/NEFT)</option>
            <option value="DEPOSIT">Credits / Deposits</option>
            <option value="WITHDRAWAL">Debits</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '16px 20px' }}>UTR / Reference</th>
              <th style={{ padding: '16px 20px' }}>Payment Remarks</th>
              <th style={{ padding: '16px 20px' }}>Remitter / Beneficiary</th>
              <th style={{ padding: '16px 20px' }}>Amount (INR)</th>
              <th style={{ padding: '16px 20px' }}>Status</th>
              <th style={{ padding: '16px 20px' }}>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No transactions found matching your search filter.
                </td>
              </tr>
            ) : (
              filtered.map(txn => {
                const isCredit = txn.transactionType === 'DEPOSIT';

                return (
                  <tr key={txn.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '16px 20px' }} className="font-mono">
                      <span style={{ color: 'var(--primary-gold)', fontWeight: '700' }}>{txn.transactionId}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {txn.description}
                    </td>
                    <td style={{ padding: '16px 20px' }} className="font-mono">
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From: {txn.sourceAccountNumber}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>To: {txn.targetAccountNumber}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '800', color: isCredit ? 'var(--primary-emerald)' : 'var(--text-main)' }}>
                      {isCredit ? '+' : '-'}{formatINR(txn.amount)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-success">
                        {txn.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(txn.createdAt).toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
