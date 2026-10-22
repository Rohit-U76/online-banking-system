import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProfileView from './components/ProfileView';
import CardsView from './components/CardsView';
import TransactionsView from './components/TransactionsView';
import TransferModal from './components/TransferModal';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import BillPayModal from './components/BillPayModal';
import AuthModal from './components/AuthModal';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBillPayModal, setShowBillPayModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleActionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Header */}
      <Header 
        onOpenAuth={() => setShowAuthModal(true)} 
        onOpenProfile={() => setActiveTab('profile')}
      />

      {/* Main Layout Container */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenTransfer={() => setShowTransferModal(true)}
          onOpenDeposit={() => setShowDepositModal(true)}
          onOpenWithdraw={() => setShowWithdrawModal(true)}
          onOpenBillPay={() => setShowBillPayModal(true)}
        />

        {/* Dynamic Views */}
        <main style={{ flex: 1, padding: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {activeTab === 'dashboard' && (
            <Dashboard 
              key={refreshTrigger}
              onOpenTransfer={() => setShowTransferModal(true)} 
              onOpenDeposit={() => setShowDepositModal(true)}
              onOpenWithdraw={() => setShowWithdrawModal(true)}
              onOpenBillPay={() => setShowBillPayModal(true)}
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'profile' && <ProfileView />}

          {activeTab === 'cards' && <CardsView />}

          {activeTab === 'transactions' && <TransactionsView key={refreshTrigger} />}
        </main>

      </div>

      {/* Action Modals */}
      {showTransferModal && (
        <TransferModal 
          onClose={() => setShowTransferModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {showBillPayModal && (
        <BillPayModal
          onClose={() => setShowBillPayModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
