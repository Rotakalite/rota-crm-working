import React, { useState } from 'react';
import { API } from '../utils/api';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const userData = await response.json();
          onLogin(userData);
        } else {
          alert('Giriş başarısız!');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Giriş sırasında bir hata oluştu!');
      } finally {
        setIsLoading(false);
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
          <p style={{ color: '#6b7280', margin: 0 }}>v2.4 - Sürdürülebilir Turizm Yönetimi! 🌿</p>
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #3b82f6)',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '🔄 Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
          <strong>🚀 Sürdürülebilir Turizm Sistemi:</strong><br/>
          🗄️ MongoDB ile gerçek veritabanı depolaması!<br/>
          🌿 A,B,C,D sütunları ile organize klasör sistemi!<br/>
          📁 Otomatik hiyerarşik klasör yönetimi!<br/>
          ☁️ Bulut tabanlı dosya saklama!<br/>
          👤 test@otel.com / herhangi şifre<br/>
          🛡️ admin@rotakalite.com / admin123
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
