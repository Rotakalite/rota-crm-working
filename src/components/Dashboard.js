import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import CustomerReceivedFiles from './CustomerReceivedFiles';
import { createSustainableTourismFolders, getFilesFromStorage, getFoldersFromStorage } from '../utils/api';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customerFileCount, setCustomerFileCount] = useState(0);
  const [adminFileCount, setAdminFileCount] = useState(0);
  const [folderCount, setFolderCount] = useState(0);

  // Kullanıcı giriş yaptığında Sürdürülebilir Turizm klasör sistemini oluştur ve verileri yükle
  useEffect(() => {
    const initializeData = async () => {
      try {
        await createSustainableTourismFolders(user.id);

        // Load counts
        const [customerFiles, adminFiles, folders] = await Promise.all([
          getFilesFromStorage(user.id, 'customer'),
          getFilesFromStorage(user.id, 'admin'),
          getFoldersFromStorage(user.id)
        ]);

        setCustomerFileCount(customerFiles.length);
        setAdminFileCount(adminFiles.length);
        setFolderCount(folders.length);
      } catch (error) {
        console.error('Error initializing dashboard data:', error);
      }
    };

    initializeData();
  }, [user.id]);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      <header style={{
        background: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          ROTA <span style={{ color: '#10b981' }}>CRM v2.4</span>
        </h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Hoş geldiniz, {user.companyName}</span>
          <button
            onClick={onLogout}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Çıkış
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'upload', label: '📁 Belge Yükle' },
            { id: 'received', label: '📥 Size Özel Belgeler' },
            { id: 'reports', label: '📋 Raporlarım' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 0',
                border: 'none',
                background: 'none',
                color: activeTab === tab.id ? '#10b981' : '#6b7280',
                borderBottom: activeTab === tab.id ? '2px solid #10b981' : '2px solid transparent',
                fontWeight: activeTab === tab.id ? '600' : '400',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main>
        {activeTab === 'dashboard' && (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📊 Dashboard</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #10b981'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Mevcut Aşama</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{user.stage}. Aşama</p>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Yüklediğiniz Belgeler</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                  {customerFileCount}
                </p>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #f59e0b'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Size Özel Belgeler</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                  {adminFileCount}
                </p>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #8b5cf6'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Sürdürülebilir Turizm Klasörleriniz</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                  {folderCount}
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🎉 v2.4 SÜPER GÜNCELLEME!</h3>
              <p style={{ marginBottom: '1rem', color: '#059669', fontWeight: '500' }}>
                🗄️ MongoDB ile gerçek veritabanı depolaması ve sürdürülebilir turizm klasör sistemi aktif!
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <strong>🗄️ MongoDB Depolaması</strong><br/>
                  <small>Kalıcı veri saklama ile güvenli dosya yönetimi!</small>
                </div>
                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem' }}>
                  <strong>📁 Otomatik Sürdürülebilir Turizm Klasörleri</strong><br/>
                  <small>A, B, C, D sütunları sisteminizde otomatik oluşturulur!</small>
                </div>
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                  <strong>🔄 Hiyerarşik Yapı</strong><br/>
                  <small>D sütunu alt klasörleri ile detaylı organizasyon!</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <FileUpload user={user} onFileUpload={() => {}} />
        )}

        {activeTab === 'received' && (
          <CustomerReceivedFiles user={user} />
        )}

        {activeTab === 'reports' && (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📋 Raporlarım</h2>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Size özel sürdürülebilir turizm raporları hazırlanıyor...</h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Danışmanlarımız sürecinizi değerlendirip A, B, C, D sütunlarına göre size özel raporlar hazırlayacak.
              </p>
              <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
                <strong>💡 İpucu:</strong> Size özel belgeler "Size Özel Belgeler" sekmesinde sürdürülebilir turizm klasörlerinizde kategorize edilerek görüntülenir!
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
