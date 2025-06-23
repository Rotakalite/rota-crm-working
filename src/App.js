import React, { useState, useEffect } from 'react';
import "./App.css";

// Folder template structure
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

// File storage utility functions
const saveFileToStorage = (file, userId, uploadedBy = 'customer', category = 'general', folderPath = '') => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const fileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        content: e.target.result,
        userId: userId,
        uploadedBy: uploadedBy,
        category: category,
        folderPath: folderPath, // New field for folder structure
        uploadDate: new Date().toISOString(),
        status: 'uploaded'
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
    filteredFiles = filteredFiles.filter(f => f.userId === userId);
  }
  
  if (uploadedBy) {
    filteredFiles = filteredFiles.filter(f => f.uploadedBy === uploadedBy);
  }
  
  return filteredFiles;
};

const deleteFileFromStorage = (fileId) => {
  const files = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
  const updatedFiles = files.filter(f => f.id !== fileId);
  localStorage.setItem('rotaFiles', JSON.stringify(updatedFiles));
};

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      if (email === 'admin@rotakalite.com' && password === 'admin123') {
        onLogin({ 
          id: 'admin',
          email, 
          name: 'ROTA Admin', 
          role: 'admin',
          isAdmin: true 
        });
      } else {
        onLogin({ 
          id: 'customer1',
          email, 
          companyName: 'Örnek Otel A.Ş.', 
          stage: 2,
          role: 'customer',
          isAdmin: false 
        });
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (resetEmail) {
      alert(`Şifre sıfırlama linki ${resetEmail} adresine gönderildi. E-postanızı kontrol edin.`);
      setShowForgotPassword(false);
      setResetEmail('');
    }
  };

  if (showForgotPassword) {
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
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>🔐</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>Şifremi Unuttum</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>E-mail adresinizi girin, şifre sıfırlama linki gönderelim</p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>E-mail</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="ornek@sirket.com"
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
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              📧 Şifre Sıfırlama Linki Gönder
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              style={{
                width: '100%',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ← Giriş Ekranına Dön
            </button>
          </form>
        </div>
      </div>
    );
  }

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
              placeholder="E-mail adresiniz"
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
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Giriş Yap
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setShowForgotPassword(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#10b981',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'underline'
            }}
          >
            🔐 Şifremi Unuttum
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
          <strong>🚀 v3.0 Özellikler:</strong><br/>
          📁 Klasör şablonu sistemi<br/>
          🔐 Şifre sıfırlama<br/>
          ✨ Profesyonel arayüz
        </div>
      </div>
    </div>
  );
};

const FolderTemplateUpload = ({ customers, onFileUpload }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedSubfolder, setSelectedSubfolder] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getFolderStructure = () => {
    if (!selectedFolder) return [];
    
    const structure = FOLDER_TEMPLATE[selectedFolder];
    
    if (selectedFolder === 'D SÜTUNU') {
      return Object.keys(structure);
    }
    
    return structure;
  };

  const getSubfolderItems = () => {
    if (selectedFolder !== 'D SÜTUNU' || !selectedSubfolder) return [];
    return FOLDER_TEMPLATE[selectedFolder][selectedSubfolder];
  };

  const handleFileSelect = (item, event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(prev => ({
        ...prev,
        [item]: files[0]
      }));
    }
  };

  const removeFile = (item) => {
    setSelectedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[item];
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (!selectedCustomer || Object.keys(selectedFiles).length === 0) {
      alert('Lütfen müşteri seçin ve dosya ekleyin!');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileEntries = Object.entries(selectedFiles);
      
      for (let i = 0; i < fileEntries.length; i++) {
        const [item, file] = fileEntries[i];
        
        for (let progress = 0; progress <= 100; progress += 25) {
          setUploadProgress(((i * 100) + progress) / fileEntries.length);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        let folderPath = selectedFolder;
        if (selectedFolder === 'D SÜTUNU' && selectedSubfolder) {
          folderPath = `${selectedFolder}/${selectedSubfolder}`;
        }
        folderPath += `/${item}`;

        await saveFileToStorage(file, selectedCustomer, 'admin', 'template', folderPath);
      }

      setSelectedFiles({});
      setUploadProgress(100);
      alert(`Klasör şablonu ${customers.find(c => c.id === selectedCustomer)?.companyName} için başarıyla gönderildi!`);
      
      if (onFileUpload) {
        onFileUpload();
      }
    } catch (error) {
      alert('Dosya gönderme hatası!');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (type) => {
    if (!type) return '📎';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      marginBottom: '2rem'
    }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
        📁 Klasör Şablonu ile Toplu Yükleme
      </h3>

      {/* Customer Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          🏢 Müşteri Seçin
        </label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        >
          <option value="">Müşteri seçin...</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.companyName} ({customer.email})
            </option>
          ))}
        </select>
      </div>

      {/* Folder Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          📂 Ana Klasör Seçin
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
          {Object.keys(FOLDER_TEMPLATE).map(folder => (
            <button
              key={folder}
              onClick={() => {
                setSelectedFolder(folder);
                setSelectedSubfolder('');
                setSelectedFiles({});
              }}
              style={{
                padding: '0.75rem',
                border: selectedFolder === folder ? '2px solid #10b981' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: selectedFolder === folder ? '#f0fdf4' : 'white',
                color: selectedFolder === folder ? '#059669' : '#6b7280',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: selectedFolder === folder ? '600' : '400'
              }}
            >
              📁 {folder}
            </button>
          ))}
        </div>
      </div>

      {/* Subfolder Selection for D SÜTUNU */}
      {selectedFolder === 'D SÜTUNU' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            📂 Alt Klasör Seçin
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
            {getFolderStructure().map(subfolder => (
              <button
                key={subfolder}
                onClick={() => {
                  setSelectedSubfolder(subfolder);
                  setSelectedFiles({});
                }}
                style={{
                  padding: '0.75rem',
                  border: selectedSubfolder === subfolder ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: selectedSubfolder === subfolder ? '#eff6ff' : 'white',
                  color: selectedSubfolder === subfolder ? '#1e40af' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: selectedSubfolder === subfolder ? '600' : '400'
                }}
              >
                📁 {subfolder}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File Upload Grid */}
      {selectedFolder && (selectedFolder !== 'D SÜTUNU' || selectedSubfolder) && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontWeight: '500', marginBottom: '1rem' }}>
            📎 Dosya Yükleme Şablonu
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            background: '#fafafa'
          }}>
            {(selectedFolder === 'D SÜTUNU' ? getSubfolderItems() : getFolderStructure()).map(item => (
              <div key={item} style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  📄 {item}
                </div>
                
                {selectedFiles[item] ? (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem',
                      background: '#f0fdf4',
                      borderRadius: '0.25rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>
                        {getFileIcon(selectedFiles[item].type)}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '500', truncate: true }}>
                          {selectedFiles[item].name}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.625rem', color: '#6b7280' }}>
                          {formatFileSize(selectedFiles[item].size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(item)}
                      style={{
                        width: '100%',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        padding: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      🗑️ Kaldır
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      onChange={(e) => handleFileSelect(item, e)}
                      style={{ display: 'none' }}
                      id={`file-${item}`}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor={`file-${item}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        background: '#f3f4f6',
                        border: '1px dashed #d1d5db',
                        borderRadius: '0.25rem',
                        padding: '0.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}
                    >
                      📎 Dosya Seç
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Klasör şablonu yükleniyor...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div style={{
            width: '100%',
            background: '#e5e7eb',
            borderRadius: '0.25rem',
            height: '0.5rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              height: '100%',
              borderRadius: '0.25rem',
              width: `${uploadProgress}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        <div>
          <strong>Seçilen Dosyalar: {Object.keys(selectedFiles).length}</strong>
          {selectedFolder && (
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Klasör: {selectedFolder}
              {selectedSubfolder && ` / ${selectedSubfolder}`}
            </div>
          )}
        </div>
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedCustomer || Object.keys(selectedFiles).length === 0}
          style={{
            background: isUploading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {isUploading ? '📤 Yükleniyor...' : '🚀 Klasör Şablonunu Gönder'}
        </button>
      </div>
    </div>
  );
};

const AdminSendFile = ({ customers, onFileUpload }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('report');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMode, setUploadMode] = useState('single'); // 'single' or 'template'

  const categories = [
    { id: 'report', label: '📊 Rapor', color: '#3b82f6' },
    { id: 'certificate', label: '🏆 Sertifika', color: '#10b981' },
    { id: 'form', label: '📋 Form', color: '#f59e0b' },
    { id: 'document', label: '📄 Belge', color: '#8b5cf6' }
  ];

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (!selectedCustomer || selectedFiles.length === 0) {
      alert('Lütfen müşteri seçin ve dosya ekleyin!');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        for (let progress = 0; progress <= 100; progress += 25) {
          setUploadProgress(((i * 100) + progress) / selectedFiles.length);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        await saveFileToStorage(file, selectedCustomer, 'admin', category);
      }

      setSelectedFiles([]);
      setSelectedCustomer('');
      setUploadProgress(100);
      alert(`Dosyalar ${customers.find(c => c.id === selectedCustomer)?.companyName} için başarıyla gönderildi!`);
      
      if (onFileUpload) {
        onFileUpload();
      }
    } catch (error) {
      alert('Dosya gönderme hatası!');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      {/* Upload Mode Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setUploadMode('single')}
            style={{
              padding: '1rem 2rem',
              border: uploadMode === 'single' ? '2px solid #10b981' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              background: uploadMode === 'single' ? '#f0fdf4' : 'white',
              color: uploadMode === 'single' ? '#059669' : '#6b7280',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: uploadMode === 'single' ? '600' : '400'
            }}
          >
            📄 Tekil Dosya Gönderimi
          </button>
          <button
            onClick={() => setUploadMode('template')}
            style={{
              padding: '1rem 2rem',
              border: uploadMode === 'template' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              background: uploadMode === 'template' ? '#eff6ff' : 'white',
              color: uploadMode === 'template' ? '#1e40af' : '#6b7280',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: uploadMode === 'template' ? '600' : '400'
            }}
          >
            📁 Klasör Şablonu Gönderimi
          </button>
        </div>
      </div>

      {uploadMode === 'template' ? (
        <FolderTemplateUpload customers={customers} onFileUpload={onFileUpload} />
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            📤 Müşteriye Tekil Dosya Gönder
          </h3>

          {/* Customer Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              🏢 Müşteri Seçin
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            >
              <option value="">Müşteri seçin...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.companyName} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              📂 Dosya Kategorisi
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: '0.75rem',
                    border: category === cat.id ? `2px solid ${cat.color}` : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    background: category === cat.id ? `${cat.color}15` : 'white',
                    color: category === cat.id ? cat.color : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: category === cat.id ? '600' : '400'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* File Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              📎 Dosya Seçin
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: '500', marginBottom: '0.75rem' }}>Seçilen Dosyalar:</h4>
              {selectedFiles.map((file, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f9fafb',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                      {getFileIcon(file.type)}
                    </span>
                    <div>
                      <p style={{ margin: 0, fontWeight: '500' }}>{file.name}</p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Gönderiliyor...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div style={{
                width: '100%',
                background: '#e5e7eb',
                borderRadius: '0.25rem',
                height: '0.5rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  height: '100%',
                  borderRadius: '0.25rem',
                  width: `${uploadProgress}%`,
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedCustomer || selectedFiles.length === 0}
            style={{
              width: '100%',
              background: isUploading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {isUploading ? '📤 Gönderiliyor...' : '🚀 Müşteriye Gönder'}
          </button>
        </div>
      )}
    </div>
  );
};

const CustomerReceivedFiles = ({ user }) => {
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [folderView, setFolderView] = useState(false);

  useEffect(() => {
    const files = getFilesFromStorage(user.id, 'admin');
    setReceivedFiles(files);
  }, [user.id]);

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'report': return '📊';
      case 'certificate': return '🏆';
      case 'form': return '📋';
      case 'document': return '📄';
      case 'template': return '📁';
      default: return '📎';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'report': return { background: '#eff6ff', color: '#1e40af' };
      case 'certificate': return { background: '#f0fdf4', color: '#166534' };
      case 'form': return { background: '#fefbf0', color: '#92400e' };
      case 'document': return { background: '#f5f3ff', color: '#7c3aed' };
      case 'template': return { background: '#f0f9ff', color: '#1e40af' };
      default: return { background: '#f3f4f6', color: '#6b7280' };
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const organizeFilesByFolder = () => {
    const organized = {};
    receivedFiles.forEach(file => {
      if (file.folderPath) {
        const pathParts = file.folderPath.split('/');
        const mainFolder = pathParts[0];
        
        if (!organized[mainFolder]) {
          organized[mainFolder] = {};
        }
        
        if (pathParts.length > 2) {
          // Has subfolder
          const subfolder = pathParts[1];
          if (!organized[mainFolder][subfolder]) {
            organized[mainFolder][subfolder] = [];
          }
          organized[mainFolder][subfolder].push(file);
        } else {
          // Direct file in main folder
          if (!organized[mainFolder]['_files']) {
            organized[mainFolder]['_files'] = [];
          }
          organized[mainFolder]['_files'].push(file);
        }
      }
    });
    return organized;
  };

  const templateFiles = receivedFiles.filter(f => f.category === 'template');
  const regularFiles = receivedFiles.filter(f => f.category !== 'template');
  const organizedFiles = organizeFilesByFolder();

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        📥 Size Özel Belgeler
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Danışmanlarımız tarafından size özel hazırlanan belgeler ve raporlar
      </p>

      {/* View Toggle */}
      {templateFiles.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setFolderView(false)}
              style={{
                padding: '0.75rem 1.5rem',
                border: !folderView ? '2px solid #10b981' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: !folderView ? '#f0fdf4' : 'white',
                color: !folderView ? '#059669' : '#6b7280',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: !folderView ? '600' : '400'
              }}
            >
              📄 Liste Görünümü
            </button>
            <button
              onClick={() => setFolderView(true)}
              style={{
                padding: '0.75rem 1.5rem',
                border: folderView ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: folderView ? '#eff6ff' : 'white',
                color: folderView ? '#1e40af' : '#6b7280',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: folderView ? '600' : '400'
              }}
            >
              📁 Klasör Görünümü
            </button>
          </div>
        </div>
      )}

      {receivedFiles.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3>Henüz size özel belge gönderilmemiş</h3>
          <p style={{ color: '#6b7280' }}>
            Danışmanlarımız size özel belgeler hazırladığında burada görüntülenecek.
          </p>
        </div>
      ) : folderView && Object.keys(organizedFiles).length > 0 ? (
        /* Folder View */
        <div style={{ space: '2rem' }}>
          {Object.entries(organizedFiles).map(([mainFolder, subfolders]) => (
            <div key={mainFolder} style={{
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              marginBottom: '2rem',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                padding: '1rem 1.5rem'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                  📁 {mainFolder}
                </h3>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                {Object.entries(subfolders).map(([subfolder, files]) => (
                  <div key={subfolder} style={{ marginBottom: '1.5rem' }}>
                    {subfolder !== '_files' && (
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.75rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        📂 {subfolder}
                      </h4>
                    )}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '0.75rem'
                    }}>
                      {files.map((file) => (
                        <div key={file.id} style={{
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          padding: '0.75rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
                              {getFileIcon(file.type)}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', truncate: true }}>
                                {file.name}
                              </p>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <a
                            href={file.content}
                            download={file.name}
                            style={{
                              display: 'block',
                              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              color: 'white',
                              textDecoration: 'none',
                              padding: '0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}
                          >
                            ⬇️ İndir
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              📋 Size Gönderilen Belgeler ({receivedFiles.length})
            </h3>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            <div style={{ space: '1rem' }}>
              {receivedFiles.map((file) => (
                <div key={file.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f9fafb',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  marginBottom: '1rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.5rem',
                      ...getCategoryColor(file.category),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginRight: '1rem'
                    }}>
                      {getCategoryIcon(file.category)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
                          {getFileIcon(file.type)}
                        </span>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '1.125rem' }}>{file.name}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{
                          fontSize: '0.875rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          ...getCategoryColor(file.category)
                        }}>
                          {getCategoryIcon(file.category)} {
                            file.category === 'report' ? 'Rapor' :
                            file.category === 'certificate' ? 'Sertifika' :
                            file.category === 'form' ? 'Form' :
                            file.category === 'template' ? 'Şablon' : 'Belge'
                          }
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {formatFileSize(file.size)}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(file.uploadDate).toLocaleDateString('tr-TR')}
                        </span>
                        {file.folderPath && (
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            background: '#f0f9ff',
                            color: '#1e40af',
                            borderRadius: '0.25rem'
                          }}>
                            📁 {file.folderPath}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a
                      href={file.content}
                      download={file.name}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      ⬇️ İndir
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [customers] = useState([
    { id: 'customer1', companyName: 'Örnek Otel A.Ş.', email: 'info@ornekhotel.com', stage: 2 },
    { id: 'customer2', companyName: 'Kalite Restoran Ltd.', email: 'info@kaliterestoran.com', stage: 1 },
    { id: 'customer3', companyName: 'Güvenlik Şirketi A.Ş.', email: 'info@guvenlik.com', stage: 3 }
  ]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Admin Dashboard
  if (user && user.isAdmin) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f0f9ff 100%)',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          color: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'white',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              color: '#1e3a8a',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>R</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>ROTA CRM Admin Panel</h1>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Müşteri Dosya Yönetim Sistemi</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>👋 Hoş geldin, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              🚪 Çıkış
            </button>
          </div>
        </div>

        {/* Admin Content */}
        <div style={{ padding: '2rem' }}>
          <AdminSendFile customers={customers} />
        </div>
      </div>
    );
  }

  // Customer Dashboard
  if (user && !user.isAdmin) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f0f9ff 100%)',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #059669, #10b981)',
          color: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'white',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              color: '#059669',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>🏢</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{user.companyName}</h1>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Müşteri Portalı</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>👋 Hoş geldin, {user.email}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              🚪 Çıkış
            </button>
          </div>
        </div>

        {/* Customer Content */}
        <CustomerReceivedFiles user={user} />
      </div>
    );
  }

  // Login Screen
  return <LoginForm onLogin={handleLogin} />;
}

export default App;
