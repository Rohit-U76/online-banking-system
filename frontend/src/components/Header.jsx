import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Bell, 
  LogOut, 
  LogIn, 
  ChevronDown,
  User,
  PhoneCall,
  Sun,
  Moon
} from 'lucide-react';

export default function Header({ onOpenAuth, onOpenProfile }) {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-IN'));
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme_preference') === 'dark';
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-IN')), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme_preference', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme_preference', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '16px 36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Corporate Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--gradient-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(217, 119, 6, 0.35)'
          }}>
            <ShieldCheck size={28} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                AETHERIS <span className="gold-text">BANK</span>
              </h1>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>PREMIER</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              IFSC: <span className="font-mono" style={{ color: 'var(--primary-gold)', fontWeight: '700' }}>ATHR0000409</span>
            </p>
          </div>
        </div>

        {/* Support Line & Live IST Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="hide-mobile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            <PhoneCall size={15} color="var(--primary-gold)" />
            <span>24x7 Helpline: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>1800-100-8842</strong></span>
          </div>

          <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-glass)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
            {time}
          </div>
        </div>

        {/* Right User Controls & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Light / Dark Mode Toggle */}
          <button 
            className="btn-icon" 
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Pristine Light Mode' : 'Switch to Dark Mode'}
            style={{ borderRadius: '50%' }}
          >
            {isDarkMode ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#475569" />}
          </button>

          <button 
            className="btn-icon" 
            style={{ position: 'relative' }}
            onClick={() => setNotificationsCount(0)}
            title="Notifications"
          >
            <Bell size={18} />
            {notificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--primary-gold)'
              }} />
            )}
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  padding: '6px 14px 6px 8px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--gradient-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}>
                  {user.fullName ? user.fullName.charAt(0) : 'U'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user.fullName || user.username}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--primary-emerald)', fontWeight: '700' }}>KYC Verified</div>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {showUserMenu && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '230px',
                  padding: '8px',
                  zIndex: 50
                }}>
                  <div style={{ padding: '10px', borderBottom: '1px solid var(--border-glass)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Signed in as</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>

                  <button
                    onClick={() => { setShowUserMenu(false); if (onOpenProfile) onOpenProfile(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}
                  >
                    <User size={16} color="var(--primary-gold)" /> My Profile & KYC
                  </button>

                  <button
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-gold" onClick={onOpenAuth}>
              <LogIn size={18} /> NetBanking Login
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
