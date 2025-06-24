import React, { useState, useEffect } from 'react';

const FOLDER_TEMPLATE = {
  'A SÜTUNU': ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7.1', 'A7.2', 'A7.3', 'A7.4', 'A8', 'A9', 'A10'],
  'B SÜTUNU': ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'],
  'C SÜTUNU': ['C1', 'C2', 'C3', 'C4'],
  'D SÜTUNU': {
    'D1': ['D1.1', 'D1.2', 'D1.3', 'D1.4'], 
    'D2': ['D2.1', 'D2.2', 'D2.3', 'D2.4', 'D2.5', 'D2.6'], 
    'D3': ['D3.1', 'D3.2', 'D3.3', 'D3.4', 'D3.5', 'D3.6']
  }
};

const saveFileToStorage = (file, userId, uploadedBy = 'customer', category = 'general', folderPath = '') => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        content: e.target.result,
        userId: userId,
        uploadedBy,
        category,
        folderPath,
        uploadDate: new Date().toISOString(),
        status: 'uploaded',
      };
      const existingFiles = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
      existingFiles.push(fileData);
      localStorage.setItem('rotaFiles', JSON.stringify(existingFiles));
      resolve(fileData);
    };
    reader.readAsDataURL(file);
  });
};

const getFilesFromStorage = (userId = null, uploadedBy = null) => {
  const files = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
  let filteredFiles = files;
  if (userId) {
    filteredFiles = filteredFiles.filter((f) => f.userId === userId);
  }
  if (uploadedBy) {
    filteredFiles = filteredFiles.filter((f) => f.uploadedBy === uploadedBy);
  }
  return filteredFiles;
};

const deleteFileFromStorage = (fileId) => {
  const files = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
  const updatedFiles = files.filter((f) => f.id !== fileId);
  localStorage.setItem('rotaFiles', JSON.stringify(updatedFiles));
};

function App() {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([
    { id: 'customer1', companyName: 'Örnek Otel A.Ş.', email: 'info@ornekhotel.com', stage: 2 },
    { id: 'customer2', companyName: 'Kalite Restoran Ltd.', email: 'info@kaliterestoran.com', stage: 1 },
    { id: 'customer3', companyName: 'Güvenlik Şirketi A.Ş.', email: 'info@guvenlik.com', stage: 3 },
  ]);

  const handleLogin = (userData) => {
    setUser(userData);
  };
  const handleLogout = () => {
    setUser(null);
  };
  
  // Eğer Admin ise
  if (user && user.isAdmin) {
    return (
      <div style={{ fontFamily: ' Arial, sans-serif' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div>Rota CRM Admin Panel</div>
          <div>👋 {user.name} <button onClick={handleLogout}>Çıkış</button></div>
        </div>
        <div style={{ padding: '2rem' }}>
          <h2>Hoş Geldin, Admin!</h2>
        </div>
      </div>
    );
  }

  // Eğer Müşteri ise
  if (user && !user.isAdmin) {
    return (
      <div style={{ fontFamily: ' Arial, sans-serif' }}>
        <div style={{
          background: 'linear-gradient(135deg, #059669, #10b981)',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div>{user.companyName}</div>
          <div>👋 {user.email} <button onClick={handleLogout}>Çıkış</button></div>
        </div>
        <div style={{ padding: '2rem' }}>
          <h2>Hoş Geldin, {user.companyName}</h2>
        </div>
      </div>
    );
  }

  // Eğer Giriş Yapmamışsa
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #059669 50%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: ' Arial, sans-serif',
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>ROTA CRM</h2>
        <p>Hoş geldin! Lütfen giriş yap veya şifre sıfırla.</p>
        <button
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            marginTop: '1rem',
          }}
        >
          Giriş
        </button>
      </div>
    </div>
  );
}

export default App;

