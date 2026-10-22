import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldAlert } from 'lucide-react';

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isLoginView) {
        await login(formData.username, formData.password);
        onClose();
      } else {
        const res = await register(formData.username, formData.email, formData.password, formData.fullName);
        setSuccessMsg(res.message || 'Account created! You can now log in.');
        setIsLoginView(true);
      }
    } catch (err) {
      setError(err.message || 'Authentication operation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel" style={{ padding: '32px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {isLoginView ? 'NetBanking Client Login' : 'Create NetBanking Profile'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isLoginView ? 'Enter your credentials to access your bank accounts' : 'Register for Aetheris NetBanking'}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        {successMsg && (
          <div className="badge badge-success" style={{ width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <>
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Johnathan Doe"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@aetherisbank.in"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="john_doe"
              required
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">NetBanking Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn-gold"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          >
            {loading ? 'Authenticating Credentials...' : (isLoginView ? 'Sign In & Access Accounts' : 'Register Account')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isLoginView ? "Don't have a NetBanking account? " : "Already registered? "}
          <button
            onClick={() => { setIsLoginView(!isLoginView); setError(''); setSuccessMsg(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', fontWeight: '800', cursor: 'pointer' }}
          >
            {isLoginView ? 'Register Now' : 'Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
}
