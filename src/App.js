import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Admin giriş kontrolü
      if (email === 'admin@rotakalite.com' && password === 'admin123') {
        onLogin({ 
          email, 
          name: 'ROTA Admin', 
          role: 'admin',
          isAdmin: true 
        });
      } else {
        // Normal müşteri girişi
        onLogin({ 
          email, 
          companyName: 'Örnek Otel A.Ş.', 
          stage: 2,
          role: 'customer',
          isAdmin: false 
        });
      }
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #059669 50%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>R</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>ROTA CRM</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Kalite & Danışmanlık Sistemi</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@otel.com veya admin@rotakalite.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Giriş Yap
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
          <strong>🧪 Test Bilgileri:</strong><br/>
          👤 Müşteri: test@otel.com / 123456<br/>
          🛡️ Admin: admin@rotakalite.com / admin123
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [customers] = useState([
    {
      id: 1,
      companyName: 'Grand Hotel Istanbul',
      email: 'info@grandhotel.com',
      stage: 2,
      startDate: '2024-01-15',
      documents: ['lisans.pdf', 'sertifika.pdf'],
      status: 'active'
    },
    {
      id: 2,
      companyName: 'Seaside Resort',
      email: 'contact@seaside.com',
      stage: 1,
      startDate: '2024-02-01',
      documents: ['basvuru.pdf'],
      status: 'active'
    },
    {
      id: 3,
      companyName: 'Mountain Lodge',
      email: 'hello@mountain.com',
      stage: 3,
      startDate: '2023-12-10',
      documents: ['tamamlandi.pdf'],
      status: 'completed'
    }
  ]);

  const getStageText = (stage) => {
    switch(stage) {
      case 1: return '1. Aşama - Ön Değerlendirme';
      case 2: return '2. Aşama - Süreç Analizi';
      case 3: return '3. Aşama - Sertifikasyon';
      default: return 'Başlangıç';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return { background: '#dbeafe', color: '#1e40af' };
      case 'completed': return { background: '#dcfce7', color: '#166534' };
      case 'pending': return { background: '#fef3c7', color: '#92400e' };
      default: return { background: '#f3f4f6', color: '#6b7280' };
    }
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
          🛡️ ROTA <span style={{ color: '#fbbf24' }}>ADMIN</span>
        </h1>
        <div>
          <span style={{ marginRight: '1rem' }}>👋 Hoş geldiniz, {user.name}</span>
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
          { id: 'documents', label: '📄 Dokümanlar' },
          { id: 'reports', label: '📈 Raporlar' }
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
            
            {/* Stats Cards */}
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
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>✅ Tamamlanan</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  {customers.filter(c => c.status === 'completed').length}
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>⏳ Devam Eden</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  {customers.filter(c => c.status === 'active').length}
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>📄 Toplam Belge</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  {customers.reduce((total, c) => total + c.documents.length, 0)}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🕒 Son Aktiviteler</h3>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ marginRight: '0.75rem' }}>🟢</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>Grand Hotel Istanbul 2. aşamaya geçti</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>2 saat önce</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ marginRight: '0.75rem' }}>📄</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>Seaside Resort yeni belge yükledi</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>5 saat önce</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 0' }}>
                  <span style={{ marginRight: '0.75rem' }}>🎉</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>Mountain Lodge sertifikasyonu tamamladı</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>1 gün önce</p>
                  </div>
                </div>
              </div>
            </div>
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
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>🏢 Şirket</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>📧 Email</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>🎯 Aşama</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>📄 Belgeler</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>📊 Durum</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>⚡ İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => (
                      <tr key={customer.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: '500' }}>{customer.companyName}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{customer.startDate}</p>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', color: '#6b7280' }}>{customer.email}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            background: customer.stage === 3 ? '#dcfce7' : customer.stage === 2 ? '#dbeafe' : '#fef3c7',
                            color: customer.stage === 3 ? '#166534' : customer.stage === 2 ? '#1e40af' : '#92400e'
                          }}>
                            {getStageText(customer.stage)}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            background: '#f3f4f6',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}>
                            {customer.documents.length} dosya
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            ...getStatusColor(customer.status)
                          }}>
                            {customer.status === 'active' ? '🟢 Aktif' : customer.status === 'completed' ? '✅ Tamamlandı' : '⏳ Beklemede'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{
                              padding: '0.25rem 0.5rem',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}>
                              👁️ Görüntüle
                            </button>
                            <button style={{
                              padding: '0.25rem 0.5rem',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}>
                              ✏️ Düzenle
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📄 Doküman Yönetimi</h2>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📤 Müşterilere Doküman Gönder</h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Müşterilerinize özel raporlar, sertifikalar ve belgeler yükleyebilirsiniz.
              </p>
              <button style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                📎 Doküman Yükle
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📈 Raporlar & Analitik</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>📊 Aylık İstatistikler</h3>
                <div>
                  <p>🟢 Yeni Müşteriler: <strong>3</strong></p>
                  <p>✅ Tamamlanan: <strong>1</strong></p>
                  <p>📄 Yüklenen Belgeler: <strong>12</strong></p>
                  <p>💰 Gelir: <strong>₺25,000</strong></p>
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🎯 Süreç Dağılımı</h3>
                <div>
                  <p>1️⃣ 1. Aşama: <strong>1 müşteri</strong></p>
                  <p>2️⃣ 2. Aşama: <strong>1 müşteri</strong></p>
                  <p>3️⃣ 3. Aşama: <strong>1 müşteri</strong></p>
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>⏱️ Ortalama Süreler</h3>
                <div>
                  <p>📅 Ortalama tamamlanma: <strong>6 hafta</strong></p>
                  <p>⚡ En hızlı: <strong>4 hafta</strong></p>
                  <p>🐌 En yavaş: <strong>8 hafta</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Dashboard = ({ user, onLogout }) => {
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
          ROTA <span style={{ color: '#10b981' }}>CRM</span>
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

      <main style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Dashboard</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Sürdürülebilir turizm danışmanlığı sürecinizi takip edin
        </p>

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
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Yüklenen Belgeler</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>3</p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #8b5cf6'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Tahmini Süre</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>4-6 Hafta</p>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🎉 ROTA CRM + ADMIN PANELİ HAZIR!</h3>
          <p style={{ marginBottom: '1rem' }}>Tebrikler! CRM sisteminiz ve admin paneliniz canlıda ve kullanılabilir.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
              <strong>👤 Müşteri Girişi:</strong><br/>
              📧 test@otel.com<br/>
              🔒 123456
            </div>
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
              <strong>🛡️ Admin Girişi:</strong><br/>
              📧 admin@rotakalite.com<br/>
              🔒 admin123
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <LoginForm onLogin={setUser} />
      ) : user.isAdmin ? (
        <AdminDashboard user={user} onLogout={() => setUser(null)} />
      ) : (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  );
}

export default App;
