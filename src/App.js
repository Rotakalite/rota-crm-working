import React, { useState, useEffect } from 'react';
import './App.css';

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
        userId,
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
  if (userId) filteredFiles = filteredFiles.filter((f) => f.userId === userId);
  if (uploadedBy) filteredFiles = filteredFiles.filter((f) => f.uploadedBy === uploadedBy);
  return filteredFiles;
};

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const admins = [{ email: 'admin@rotakalite.com', password: 'admin123', name: 'Rota Admin' }];

  const customers = JSON.parse(localStorage.getItem('customers') || '[]');

  const handleSubmit = (e) => {
    e.preventDefault();
    const admin = admins.find((a) => a.email === email && a.password === password);
    if (admin) {
      onLogin({ id: 'admin', email, name: admin.name, role: 'admin', isAdmin: true });
      return;
    }
    const customer = customers.find((c) => c.email === email && c.password === password);
    if (customer) {
      onLogin({ ...customer, role: 'customer', isAdmin: false });
      return;
    }
    alert('Hatalı e-mail veya şifre!');
  };
  
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
        <h2>Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
            />
          </div>

          <button style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            marginTop: '1rem',
            display: 'block',
            width: '100%',
          }}>Giriş</button>
        </form>
      </div>
    </div>
  );
};

const AdminPanel = ({ customers, onLogout, refreshCustomers }) => {
  const handleEditPrice = (customerId, price) => {
    const updatedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    const index = updatedCustomers.findIndex((c) => c.id === customerId);
    if (index !== -1) {
      updatedCustomers[index].price = price;
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      refreshCustomers();
    }
  };
  
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
        <div><button onClick={onLogout}>Çıkış</button></div>
      </div>
      <div style={{ padding: '2rem' }}>
        <h2>Hoş Geldin, Admin!</h2>
        <div>
          {customers.map((customer) => (
            <div key={customer.id} style={{ marginBottom: '1rem' }}>
              <strong>{customer.companyName}</strong> ({customer.email})
              <div>Fiyat: {customer.price ? customer.price : 'Belirlenmemiş'}</div>
              <input
                placeholder="Fiyat gir..."
                style={{ marginRight: '0.5rem' }}
                onChange={(e) => customer.newPrice = e.target.value}
              />
              <button onClick={() => handleEditPrice(customer.id, customer.newPrice)}>Fiyatı Güncelle</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomerPanel = ({ user, onLogout }) => {
  const [files, setFiles] = useState(getFilesFromStorage(user.id));

  const handleUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    for (const file of selectedFiles) {
      await saveFileToStorage(file, user.id, 'customer');
    }
    setFiles(getFilesFromStorage(user.id));
  };
  
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
        <div>{user.email} <button onClick={onLogout}>Çıkış</button></div>
      </div>
      <div style={{ padding: '2rem' }}>
        <h2>Hoş Geldin, {user.companyName}</h2>
        <input
          type="file"
          multiple
          onChange={handleUpload}
        />
        <div>
          <h3>Yüklenen Dosyalar:</h3>
          {files.map((f) => (
            <div key={f.id}>{f.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState(() => {
    return JSON.parse(localStorage.getItem('customers') || '[]');
  });

  const handleLogin = (userData) => {
    setUser(userData);
  };
  
  const handleLogout = () => {
    setUser(null);
  };
  
  const refreshCustomers = () => {
    setCustomers(JSON.parse(localStorage.getItem('customers') || '[]'));
  };
  
  if (user && user.isAdmin) {
    return <AdminPanel customers={customers} onLogout={handleLogout} refreshCustomers={refreshCustomers} />;
  }
  if (user && !user.isAdmin) {
    return <CustomerPanel user={user} onLogout={handleLogout} />;
  }
  
  return <AdminLogin onLogin={handleLogin} />;
}

export default App;
