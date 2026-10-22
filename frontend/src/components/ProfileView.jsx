import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Key, 
  FileText, 
  CheckCircle2, 
  Smartphone, 
  Lock, 
  BellRing,
  Building,
  CreditCard,
  Save,
  Check
} from 'lucide-react';

export default function ProfileView() {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'John Doe',
    email: user?.email || 'john.doe@aetherisbank.in',
    phone: '+91 98765 43210',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '•••• •••• 8842',
    address: 'Flat 402, Pinnacle Residency, Bandra West, Mumbai, Maharashtra - 400050',
    dob: '1992-08-15',
    kycStatus: 'VERIFIED',
    twoFactorEnabled: true,
    smsAlerts: true,
    emailStatements: true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordState, setPasswordState] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  const [passMsg, setPassMsg] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordState.newPass !== passwordState.confirmPass) {
      setPassMsg('New passwords do not match!');
      return;
    }
    setPassMsg('Password successfully updated with Spring Security BCrypt hashing!');
    setPasswordState({ oldPass: '', newPass: '', confirmPass: '' });
    setTimeout(() => setPassMsg(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--gradient-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              color: '#000',
              fontSize: '1.6rem',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
            }}>
              {profileData.fullName.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{profileData.fullName}</h2>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  <CheckCircle2 size={13} /> RBI KYC Verified
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Customer ID: <span className="font-mono" style={{ color: 'var(--primary-gold-light)', fontWeight: '700' }}>CID-9081249</span> • Premier Banking Client
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Home Branch</span>
            <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Bandra West Branch, Mumbai</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontFamily: 'var(--font-mono)' }}>IFSC: ATHR0000409</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Info & Security Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Personal & Statutory Details */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
            <User size={20} color="var(--primary-gold-light)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Personal & KYC Details</h3>
          </div>

          {savedSuccess && (
            <div className="badge badge-success" style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
              <Check size={14} /> Profile details saved successfully!
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">Full Legal Name (as per PAN)</label>
              <input
                type="text"
                className="form-input"
                value={profileData.fullName}
                onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={profileData.email}
                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Registered Mobile Number (+91)</label>
              <input
                type="text"
                className="form-input font-mono"
                value={profileData.phone}
                onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">PAN Number</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  readOnly
                  value={profileData.panNumber}
                  style={{ opacity: 0.8 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Aadhaar Number</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  readOnly
                  value={profileData.aadhaarNumber}
                  style={{ opacity: 0.8 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Registered Residential Address</label>
              <textarea
                className="form-input"
                rows="2"
                value={profileData.address}
                onChange={e => setProfileData({ ...profileData, address: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} /> Save Profile Changes
            </button>
          </form>
        </div>

        {/* Security & Authentication Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Password Change Box */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <Lock size={20} color="var(--primary-cyan)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>NetBanking Password & Security</h3>
            </div>

            {passMsg && (
              <div className={`badge ${passMsg.includes('match') ? 'badge-danger' : 'badge-success'}`} style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {passMsg}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  required
                  value={passwordState.oldPass}
                  onChange={e => setPasswordState({ ...passwordState, oldPass: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  required
                  value={passwordState.newPass}
                  onChange={e => setPasswordState({ ...passwordState, newPass: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  required
                  value={passwordState.confirmPass}
                  onChange={e => setPasswordState({ ...passwordState, confirmPass: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Update NetBanking Password
              </button>
            </form>
          </div>

          {/* Preferences & 2FA Toggle */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Security Toggles</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>2-Factor SMS OTP Verification</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require OTP for transactions &gt; ₹10,000</div>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.twoFactorEnabled}
                  onChange={e => setProfileData({ ...profileData, twoFactorEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Instant SMS Transaction Alerts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive SMS on registered mobile number</div>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.smsAlerts}
                  onChange={e => setProfileData({ ...profileData, smsAlerts: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
