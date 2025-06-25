import React, { useState, useEffect } from 'react';
import AdminSendFile from './AdminSendFile';
import { getFilesFromStorage, getFoldersFromStorage, deleteFileFromStorage } from '../utils/api';
import { getFileIcon, formatFileSize } from '../utils/helpers';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [allFiles, setAllFiles] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [customers] = useState([
    {
      id: 'customer1',
      companyName: 'Örnek Otel A.Ş.',
      email: 'test@otel.com',
      stage: 2,
      startDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 'customer2',
      companyName: 'Grand Hotel Istanbul',
      email: 'info@grandhotel.com',
      stage: 1,
      startDate: '2024-02-01',
      status: 'active'
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [files, folders] = await Promise.all([
          getFilesFromStorage(),
          getFoldersFromStorage()
        ]);
        setAllFiles(files);
        setAllFolders(folders);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    loadData();
  }, [activeTab]);

  const refreshFiles = async () => {
    try {
      const [files, folders] = await Promise.all([
        getFilesFromStorage(),
        getFoldersFromStorage()
      ]);
      setAllFiles(files);
      setAllFolders(folders);
    } catch (error) {
      console.error('Error refreshing files:', error);
    }
  };

  const getCustomerName = (userId) => {
    const customer = customers.find(c => c.id === userId);
    return customer ? customer.companyName : 'Bilinmeyen Müşteri';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      {/* Admin Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1e40af, #059669)',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          🛡️ ROTA <span style={{ color: '#fbbf24' }}>ADMIN v2.4</span>
        </h1>
        <div>
          <span style={{ marginRight: '1rem' }}>👋 {user.name}</span>
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
            🚪 Çıkış
          </button>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav style={{
        background: 'white',
        padding: '0 2rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        gap: '2rem'
      }}>
        {[
          { id: 'overview', label: '📊 Genel Bakış' },
          { id: 'customers', label: '👥 Müşteriler' },
          { id: 'send-files', label: '📤 Dosya Gönder' },
          { id: 'files', label: '📁 Tüm Dosyalar' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 0',
              border: 'none',
              background: 'none',
              color: activeTab === tab.id ? '#059669' : '#6b7280',
              borderBottom: activeTab === tab.id ? '2px solid #059669' : '2px solid transparent',
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Admin Content */}
      <main style={{ padding: '2rem' }}>
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📊 Genel Bakış</h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>👥 Toplam Müşteri</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{customers.length}</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>📁 Toplam Dosya</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{allFiles.length}</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>📤 Gönderilen</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  {allFiles.filter(f => f.uploadedBy === 'admin').length}
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>📁 Klasörler</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  {allFolders.length}
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🚀 v2.4 YENİ ÖZELLİKLER!</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <strong>🗄️ MongoDB Depolaması</strong><br/>
                  <small>Gerçek veritabanı ile kalıcı veri saklama!</small>
                </div>
                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem' }}>
                  <strong>📁 Sürdürülebilir Turizm Klasörleri</strong><br/>
                  <small>A, B, C, D sütunları ile otomatik organize!</small>
                </div>
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                  <strong>🔄 Gelişmiş Navigasyon</strong><br/>
                  <small>Breadcrumb ile kolay gezinme!</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'send-files' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📤 Müşterilere Dosya Gönder</h2>
            <AdminSendFile customers={customers} onFileUpload={refreshFiles} />
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              📁 Tüm Dosyalar ({allFiles.length})
            </h2>

            {allFiles.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3>Henüz dosya yüklenmemiş</h3>
                <p style={{ color: '#6b7280' }}>Dosya yüklendiğinde burada görüntülenecek.</p>
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb' }}>
                      <tr>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📎 Dosya</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>🏢 Müşteri</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>👤 Yükleyen</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📏 Boyut</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📅 Tarih</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>⚡ İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allFiles.map((file) => (
                        <tr key={file.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                                {getFileIcon(file.type)}
                              </span>
                              <div>
                                <p style={{ margin: 0, fontWeight: '500' }}>{file.name}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{file.type}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem'
                            }}>
                              {getCustomerName(file.userId)}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              background: file.uploadedBy === 'admin' ? '#f0fdf4' : '#fef3c7',
                              color: file.uploadedBy === 'admin' ? '#166534' : '#92400e',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem'
                            }}>
                              {file.uploadedBy === 'admin' ? '🛡️ Admin' : '👤 Müşteri'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#6b7280' }}>
                            {formatFileSize(file.size)}
                          </td>
                          <td style={{ padding: '1rem', color: '#6b7280' }}>
                            {new Date(file.uploadDate).toLocaleString('tr-TR')}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <a
                                href={file.content}
                                download={file.name}
                                style={{
                                  background: '#3b82f6',
                                  color: 'white',
                                  textDecoration: 'none',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.75rem'
                                }}
                              >
                                ⬇️ İndir
                              </a>
                              <button
                                onClick={async () => {
                                  if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
                                    try {
                                      await deleteFileFromStorage(file.id);
                                      setAllFiles(prev => prev.filter(f => f.id !== file.id));
                                    } catch (error) {
                                      alert('Dosya silme hatası: ' + error.message);
                                    }
                                  }
                                }}
                                style={{
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.25rem',
                                  padding: '0.25rem 0.75rem',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem'
                                }}
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>👥 Müşteri Yönetimi</h2>
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>🏢 Şirket</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📧 Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📁 Dosyalar</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📤 Gönderilenler</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>🗂️ Klasörler</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📅 Kayıt</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => {
                    const customerFiles = allFiles.filter(f => f.userId === customer.id && f.uploadedBy === 'customer');
                    const sentFiles = allFiles.filter(f => f.userId === customer.id && f.uploadedBy === 'admin');
                    const customerFolders = allFolders.filter(f => f.userId === customer.id);

                    return (
                      <tr key={customer.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '1rem' }}>
                          <p style={{ margin: 0, fontWeight: '500' }}>{customer.companyName}</p>
                        </td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{customer.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            background: customerFiles.length > 0 ? '#dcfce7' : '#fef3c7',
                            color: customerFiles.length > 0 ? '#166534' : '#92400e',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem'
                          }}>
                            📥 {customerFiles.length} dosya
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            background: sentFiles.length > 0 ? '#eff6ff' : '#f3f4f6',
                            color: sentFiles.length > 0 ? '#1e40af' : '#6b7280',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem'
                          }}>
                            📤 {sentFiles.length} gönderildi
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            background: customerFolders.length > 0 ? '#fef3c7' : '#f3f4f6',
                            color: customerFolders.length > 0 ? '#92400e' : '#6b7280',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem'
                          }}>
                            📁 {customerFolders.length} klasör
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>
                          {new Date(customer.startDate).toLocaleDateString('tr-TR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
