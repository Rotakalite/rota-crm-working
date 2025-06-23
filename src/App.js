import React, { useState, useEffect } from 'react';

// File storage utility functions
const saveFileToStorage = (file, userId) => {
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
        uploadDate: new Date().toISOString(),
        status: 'uploaded'
      };
      
      // Save to localStorage
      const existingFiles = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
      existingFiles.push(fileData);
      localStorage.setItem('rotaFiles', JSON.stringify(existingFiles));
      
      resolve(fileData);
    };
    reader.readAsDataURL(file);
  });
};

const getFilesFromStorage = (userId = null) => {
  const files = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
  return userId ? files.filter(f => f.userId === userId) : files;
};

const deleteFileFromStorage = (fileId) => {
  const files = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
  const updatedFiles = files.filter(f => f.id !== fileId);
  localStorage.setItem('rotaFiles', JSON.stringify(updatedFiles));
};

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          <p style={{ color: '#6b7280', margin: 0 }}>Kalite & Danışmanlık Sistemi v2.0</p>
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
          <strong>🚀 v2.0 Yenilikler:</strong><br/>
          📁 Gerçek dosya yükleme!<br/>
          🛡️ Gelişmiş admin paneli<br/>
          👤 test@otel.com / 123456<br/>
          🛡️ admin@rotakalite.com / admin123
        </div>
      </div>
    </div>
  );
};

const FileUpload = ({ user, onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    // Load existing files
    const files = getFilesFromStorage(user.id);
    setUploadedFiles(files);
  }, [user.id]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFileSelect(files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      handleFileSelect(files);
    }
  };

  const handleFileSelect = (files) => {
    // File type validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} desteklenmeyen dosya türü!`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`${file.name} çok büyük! Maksimum 10MB`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          setUploadProgress(((i * 100) + progress) / selectedFiles.length);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Save file
        const savedFile = await saveFileToStorage(file, user.id);
        setUploadedFiles(prev => [...prev, savedFile]);
      }

      setSelectedFiles([]);
      setUploadProgress(100);
      alert('Dosyalar başarıyla yüklendi!');
      
      if (onFileUpload) {
        onFileUpload(selectedFiles);
      }
    } catch (error) {
      alert('Dosya yükleme hatası!');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
      deleteFileFromStorage(fileId);
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div style={{ maxWidth: '4xl', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>📁 Belge Yükleme</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Danışmanlık süreciniz için gerekli belgeleri yükleyin
      </p>

      {/* Upload Area */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div
          style={{
            border: dragActive ? '2px dashed #10b981' : '2px dashed #d1d5db',
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center',
            background: dragActive ? '#f0fdf4' : '#fafafa',
            transition: 'all 0.3s ease'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            id="file-upload"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
          
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Dosyalarınızı buraya sürükleyin
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            veya dosya seçmek için tıklayın
          </p>
          <label
            htmlFor="file-upload"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              border: 'none',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            📎 Dosya Seç
          </label>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
            PDF, Word, Excel, Resim (Maks. 10MB)
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Seçilen Dosyalar:</h4>
            <div style={{ space: '0.75rem' }}>
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

            {/* Upload Progress */}
            {isUploading && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Yükleniyor...</span>
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

            <button
              onClick={handleUpload}
              disabled={isUploading}
              style={{
                width: '100%',
                background: isUploading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                marginTop: '1rem'
              }}
            >
              {isUploading ? '⏳ Yükleniyor...' : '🚀 Dosyaları Yükle'}
            </button>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            📋 Yüklenen Dosyalar ({uploadedFiles.length})
          </h3>
          <div style={{ space: '0.75rem' }}>
            {uploadedFiles.map((file) => (
              <div key={file.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '0.75rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '2rem', marginRight: '1rem' }}>
                    {getFileIcon(file.type)}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>{file.name}</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
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
                      fontSize: '0.875rem'
                    }}
                  >
                    ⬇️ İndir
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      padding: '0.25rem 0.75rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [allFiles, setAllFiles] = useState([]);
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
    // Load all files for admin view
    const files = getFilesFromStorage();
    setAllFiles(files);
  }, [activeTab]);

  const getCustomerName = (userId) => {
    const customer = customers.find(c => c.id === userId);
    return customer ? customer.companyName : 'Bilinmeyen Müşteri';
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
          🛡️ ROTA <span style={{ color: '#fbbf24' }}>ADMIN v2.0</span>
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
          { id: 'files', label: '📁 Dosyalar' },
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
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>💾 Toplam Boyut</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  {formatFileSize(allFiles.reduce((total, file) => total + file.size, 0))}
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>🆕 Bugün Yüklenen</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  {allFiles.filter(f => new Date(f.uploadDate).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🚀 v2.0 Yeni Özellikler</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <strong>📁 Gerçek Dosya Yükleme</strong><br/>
                  <small>Müşteriler artık gerçek dosya yükleyebilir!</small>
                </div>
                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem' }}>
                  <strong>👁️ Dosya Görüntüleme</strong><br/>
                  <small>Admin tüm dosyaları görebilir ve indirebilir</small>
                </div>
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                  <strong>🔄 Otomatik Kaydetme</strong><br/>
                  <small>Dosyalar güvenli şekilde saklanıyor</small>
                </div>
              </div>
            </div>
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
                <p style={{ color: '#6b7280' }}>Müşteriler dosya yüklediğinde burada görüntülenecek.</p>
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
                                onClick={() => {
                                  if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
                                    deleteFileFromStorage(file.id);
                                    setAllFiles(prev => prev.filter(f => f.id !== file.id));
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
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📅 Kayıt</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => {
                    const customerFiles = allFiles.filter(f => f.userId === customer.id);
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
                            {customerFiles.length} dosya
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

        {activeTab === 'reports' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📈 Dosya İstatistikleri</h2>
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>📊 Dosya Türleri</h3>
                <div>
                  <p>📄 PDF: <strong>{allFiles.filter(f => f.type.includes('pdf')).length}</strong></p>
                  <p>📝 Word: <strong>{allFiles.filter(f => f.type.includes('word') || f.type.includes('document')).length}</strong></p>
                  <p>📊 Excel: <strong>{allFiles.filter(f => f.type.includes('excel') || f.type.includes('sheet')).length}</strong></p>
                  <p>🖼️ Resim: <strong>{allFiles.filter(f => f.type.includes('image')).length}</strong></p>
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>📅 Bu Hafta</h3>
                <div>
                  <p>🟢 Yeni Dosyalar: <strong>{allFiles.filter(f => {
                    const fileDate = new Date(f.uploadDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return fileDate > weekAgo;
                  }).length}</strong></p>
                  <p>📁 Toplam Boyut: <strong>{formatFileSize(
                    allFiles
                      .filter(f => {
                        const fileDate = new Date(f.uploadDate);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return fileDate > weekAgo;
                      })
                      .reduce((total, f) => total + f.size, 0)
                  )}</strong></p>
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
  const [activeTab, setActiveTab] = useState('dashboard');

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
          ROTA <span style={{ color: '#10b981' }}>CRM v2.0</span>
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
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Yüklenen Belgeler</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                  {getFilesFromStorage(user.id).length}
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🚀 v2.0 Güncellemesi!</h3>
              <p style={{ marginBottom: '1rem', color: '#059669', fontWeight: '500' }}>
                Artık gerçek dosya yükleme sistemi aktif! Belgelerinizi güvenle yükleyebilirsiniz.
              </p>
              <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                <strong>✨ Yeni Özellikler:</strong><br/>
                📁 Gerçek dosya yükleme ve indirme<br/>
                🛡️ Güvenli dosya depolama<br/>
                👁️ Admin dosya görüntüleme<br/>
                📊 Gelişmiş dosya istatistikleri
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <FileUpload user={user} onFileUpload={() => {}} />
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
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Size özel raporlar hazırlanıyor...</h3>
              <p style={{ color: '#6b7280' }}>
                Danışmanlarımız sürecinizi değerlendirip size özel raporlar hazırlayacak.
              </p>
            </div>
          </div>
        )}
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
