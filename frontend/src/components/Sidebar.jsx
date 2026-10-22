import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Send, 
  CreditCard, 
  Receipt, 
  PlusCircle,
  MinusCircle,
  Zap,
  PhoneCall
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenTransfer,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenBillPay
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile & KYC', icon: User },
    { id: 'deposit', label: 'Deposit Cash', icon: PlusCircle, isAction: true, onClick: onOpenDeposit, color: '#047857' },
    { id: 'withdraw', label: 'Withdraw Cash', icon: MinusCircle, isAction: true, onClick: onOpenWithdraw, color: '#b91c1c' },
    { id: 'transfer', label: 'IMPS / NEFT Transfer', icon: Send, isAction: true, onClick: onOpenTransfer, color: '#b45309' },
    { id: 'billpay', label: 'Bill Pay & BBPS', icon: Zap, isAction: true, onClick: onOpenBillPay, color: '#0284c7' },
    { id: 'cards', label: 'RuPay & Virtual Cards', icon: CreditCard },
    { id: 'transactions', label: 'Passbook Ledger', icon: Receipt },
  ];

  return (
    <aside className="glass-panel" style={{
      width: '270px',
      borderRadius: 0,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 'calc(100vh - 75px)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-dim)', padding: '0 12px 6px', letterSpacing: '1px' }}>
          NETBANKING SERVICES
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={item.color || 'var(--primary-gold)'} />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '12px',
                background: isActive ? 'rgba(217, 119, 6, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(217, 119, 6, 0.35)' : '1px solid transparent',
                color: isActive ? 'var(--primary-gold)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--primary-gold)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Customer Helpline Drawer */}
      <div className="glass-panel" style={{
        padding: '16px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-glass)',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <PhoneCall size={16} color="var(--primary-gold)" />
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)' }}>24x7 Helpline</span>
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-gold)', fontFamily: 'var(--font-mono)' }}>
          1800-100-8842
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Toll-free customer care & card blocking
        </p>
      </div>

    </aside>
  );
}
