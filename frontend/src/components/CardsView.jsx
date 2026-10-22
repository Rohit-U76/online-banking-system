import React, { useState } from 'react';
import { CreditCard, Lock, Unlock, Eye, EyeOff, ShieldCheck, Plus, Sparkles, Award } from 'lucide-react';

export default function CardsView() {
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [showNumbers, setShowNumbers] = useState(false);
  const [cards, setCards] = useState([
    {
      id: 1,
      name: 'Aetheris RuPay Select Platinum',
      number: '6521 •••• •••• 9921',
      fullNumber: '6521 8140 2291 9921',
      expiry: '08/29',
      cvv: '849',
      type: 'RUPAY',
      network: 'RuPay Platinum',
      style: 'card-front',
      limit: 250000,
      spent: 85400,
      isFrozen: false
    },
    {
      id: 2,
      name: 'Aetheris Sovereign Gold Debit',
      number: '4219 •••• •••• 3410',
      fullNumber: '4219 9012 4432 3410',
      expiry: '11/28',
      cvv: '124',
      type: 'GOLD',
      network: 'Visa Signature',
      style: 'card-gold',
      limit: 500000,
      spent: 142500,
      isFrozen: false
    }
  ]);

  const toggleFreeze = (id) => {
    setCards(cards.map(c => c.id === id ? { ...c, isFrozen: !c.isFrozen } : c));
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>RuPay & Virtual Cards</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage domestic RuPay and international contactless card parameters</p>
        </div>
        <button 
          className="btn-gold"
          onClick={() => alert('New RuPay Select Virtual Card issue request initiated with Spring Security 2FA Audit.')}
        >
          <Plus size={18} /> Issue RuPay Card
        </button>
      </div>

      {/* Cards List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {cards.map(card => {
          const isFlipped = flippedCardId === card.id;
          const usagePercent = Math.round((card.spent / card.limit) * 100);

          return (
            <div key={card.id} className="glass-panel" style={{ padding: '24px' }}>
              
              {/* Interactive 3D Metallic Card */}
              <div className="card-container" onClick={() => setFlippedCardId(isFlipped ? null : card.id)}>
                <div className={`credit-card ${isFlipped ? 'flipped' : ''}`}>
                  
                  {/* Front Side */}
                  <div className={`card-front ${card.type === 'GOLD' ? 'card-gold' : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px' }}>
                        {card.name}
                      </span>
                      <Award size={22} color={card.type === 'GOLD' ? '#fff' : 'var(--primary-gold-light)'} />
                    </div>

                    <div className="font-mono" style={{ fontSize: '1.25rem', letterSpacing: '2px', fontWeight: '800', margin: '20px 0' }}>
                      {showNumbers ? card.fullNumber : card.number}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>CARDHOLDER</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>JOHN DOE</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>EXPIRES</div>
                        <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '800' }}>{card.expiry}</div>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="card-back">
                    <div style={{ background: '#000', height: '40px', margin: '-24px -24px 16px', borderRadius: '20px 20px 0 0' }}></div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, background: '#fff', height: '34px', borderRadius: '6px', color: '#000', display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '0.8rem', fontWeight: '700' }}>
                        Authorized Signature
                      </div>
                      <div style={{ background: '#e2e8f0', padding: '6px 10px', borderRadius: '6px', color: '#0f172a', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
                        CVV: {card.cvv}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
                      Tap card to flip. Issued by Aetheris Bank India under Reserve Bank Guidelines.
                    </div>
                  </div>

                </div>
              </div>

              {/* Card Control Actions */}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    onClick={() => setShowNumbers(!showNumbers)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-gold-light)', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {showNumbers ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showNumbers ? 'Hide Card Details' : 'Show Full Card Number'}
                  </button>

                  <button
                    onClick={() => toggleFreeze(card.id)}
                    className={`badge ${card.isFrozen ? 'badge-danger' : 'badge-success'}`}
                    style={{ cursor: 'pointer', padding: '6px 12px' }}
                  >
                    {card.isFrozen ? <Lock size={14} /> : <Unlock size={14} />}
                    {card.isFrozen ? 'Card Frozen' : 'Active'}
                  </button>
                </div>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Monthly Limit Utilized ({usagePercent}%):</span>
                    <span style={{ fontWeight: '800' }}>{formatINR(card.spent)} / {formatINR(card.limit)}</span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${usagePercent}%`, height: '100%', background: 'var(--gradient-gold)' }}></div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
