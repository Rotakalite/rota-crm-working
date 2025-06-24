import React, { useState, useEffect } from 'react';

// File storage utility functions
const saveFileToStorage = (file, userId, uploadedBy = 'customer', category = 'general') => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function(e) {
        type: file.type,
        content: e.target.result,
        userId: userId,
        uploadedBy: uploadedBy, // 'customer' or 'admin'
        category: category, // 'general', 'report', 'certificate', 'form'
        uploadDate: new Date().toISOString(),
        status: 'uploaded'
      };

      // Save to localStorage
      const existingFiles = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
      existingFiles.push(fileData);
      localStorage.setItem('rotaFiles', JSON.stringify(existingFiles));
  });
};

const getFilesFromStorage = (userId = null) => {
const getFilesFromStorage = (userId = null, uploadedBy = null) => {
  const files = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
  return userId ? files.filter(f => f.userId === userId) : files;
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
            fontWeight: 'bold'
          }}>R</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>ROTA CRM</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Kalite & Danışmanlık Sistemi v2.0</p>
          <p style={{ color: '#6b7280', margin: 0 }}>v2.1 - Admin Dosya Gönderimi!</p>
        </div>

        <form onSubmit={handleSubmit}>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
          <strong>🚀 v2.0 Yenilikler:</strong><br/>
          📁 Gerçek dosya yükleme!<br/>
          🛡️ Gelişmiş admin paneli<br/>
          <strong>🚀 v2.1 BOMBA Özellik:</strong><br/>
          📤 Admin müşterilere dosya gönderebilir!<br/>
          📥 Müşteriler admin dosyalarını görür!<br/>
          👤 test@otel.com / 123456<br/>
          🛡️ admin@rotakalite.com / admin123
        </div>
  );
};

const AdminSendFile = ({ customers, onFileUpload }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('report');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      marginBottom: '2rem'
    }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
        📤 Müşteriye Dosya Gönder
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
  );
};

const CustomerReceivedFiles = ({ user }) => {
  const [receivedFiles, setReceivedFiles] = useState([]);

  useEffect(() => {
    // Load files sent by admin to this customer
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
      default: return '📎';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'report': return { background: '#eff6ff', color: '#1e40af' };
      case 'certificate': return { background: '#f0fdf4', color: '#166534' };
      case 'form': return { background: '#fefbf0', color: '#92400e' };
      case 'document': return { background: '#f5f3ff', color: '#7c3aed' };
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

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        📥 Size Özel Belgeler
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Danışmanlarımız tarafından size özel hazırlanan belgeler ve raporlar
      </p>

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
      ) : (
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
                            file.category === 'form' ? 'Form' : 'Belge'
                          }
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {formatFileSize(file.size)}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(file.uploadDate).toLocaleDateString('tr-TR')}
                        </span>
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

const FileUpload = ({ user, onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    // Load existing files
    const files = getFilesFromStorage(user.id);
    // Load customer's own uploaded files
    const files = getFilesFromStorage(user.id, 'customer');
    setUploadedFiles(files);
  }, [user.id]);

  };

  const handleFileSelect = (files) => {
    // File type validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
        alert(`${file.name} desteklenmeyen dosya türü!`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} çok büyük! Maksimum 10MB`);
        return false;
      }
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          setUploadProgress(((i * 100) + progress) / selectedFiles.length);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Save file
        const savedFile = await saveFileToStorage(file, user.id);
        const savedFile = await saveFileToStorage(file, user.id, 'customer', 'general');
        setUploadedFiles(prev => [...prev, savedFile]);
      }

          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            📋 Yüklenen Dosyalar ({uploadedFiles.length})
            📋 Yüklediğiniz Dosyalar ({uploadedFiles.length})
          </h3>
          <div style={{ space: '0.75rem' }}>
            {uploadedFiles.map((file) => (
  ]);

  useEffect(() => {
    // Load all files for admin view
    const files = getFilesFromStorage();
    setAllFiles(files);
  }, [activeTab]);

  const refreshFiles = () => {
    const files = getFilesFromStorage();
    setAllFiles(files);
  };

  const getCustomerName = (userId) => {
    const customer = customers.find(c => c.id === userId);
    return customer ? customer.companyName : 'Bilinmeyen Müşteri';
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          🛡️ ROTA <span style={{ color: '#fbbf24' }}>ADMIN v2.0</span>
          🛡️ ROTA <span style={{ color: '#fbbf24' }}>ADMIN v2.1</span>
        </h1>
        <div>
          <span style={{ marginRight: '1rem' }}>👋 {user.name}</span>
        {[
          { id: 'overview', label: '📊 Genel Bakış' },
          { id: 'customers', label: '👥 Müşteriler' },
          { id: 'files', label: '📁 Dosyalar' },
          { id: 'reports', label: '📈 Raporlar' }
          { id: 'send-files', label: '📤 Dosya Gönder' },
          { id: 'files', label: '📁 Tüm Dosyalar' }
        ].map(tab => (
          <button
            key={tab.id}
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>💾 Toplam Boyut</h3>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>📤 Gönderilen</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  {formatFileSize(allFiles.reduce((total, file) => total + file.size, 0))}
                  {allFiles.filter(f => f.uploadedBy === 'admin').length}
                </p>
              </div>

                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>🆕 Bugün Yüklenen</h3>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>📥 Alınan</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  {allFiles.filter(f => new Date(f.uploadDate).toDateString() === new Date().toDateString()).length}
                  {allFiles.filter(f => f.uploadedBy === 'customer').length}
                </p>
              </div>
            </div>
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🚀 v2.0 Yeni Özellikler</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🚀 v2.1 BOMBA ÖZELLİK!</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <strong>📁 Gerçek Dosya Yükleme</strong><br/>
                  <small>Müşteriler artık gerçek dosya yükleyebilir!</small>
                  <strong>📤 Admin Dosya Gönderimi</strong><br/>
                  <small>Müşterilere rapor, sertifika gönderebilirsiniz!</small>
                </div>
                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem' }}>
                  <strong>👁️ Dosya Görüntüleme</strong><br/>
                  <small>Admin tüm dosyaları görebilir ve indirebilir</small>
                  <strong>📥 Müşteri Görüntüleme</strong><br/>
                  <small>Müşteriler size özel belgeleri görebilir!</small>
                </div>
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                  <strong>🔄 Otomatik Kaydetme</strong><br/>
                  <small>Dosyalar güvenli şekilde saklanıyor</small>
                  <strong>📂 Kategori Sistemi</strong><br/>
                  <small>Rapor, Sertifika, Form, Belge kategorileri!</small>
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
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3>Henüz dosya yüklenmemiş</h3>
                <p style={{ color: '#6b7280' }}>Müşteriler dosya yüklediğinde burada görüntülenecek.</p>
                <p style={{ color: '#6b7280' }}>Dosya yüklendiğinde burada görüntülenecek.</p>
              </div>
            ) : (
              <div style={{
                      <tr>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📎 Dosya</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>🏢 Müşteri</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>👤 Yükleyen</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📏 Boyut</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📅 Tarih</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>⚡ İşlemler</th>
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
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>🏢 Şirket</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📧 Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📁 Dosyalar</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📤 Gönderilenler</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📅 Kayıt</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => {
                    const customerFiles = allFiles.filter(f => f.userId === customer.id);
                    const customerFiles = allFiles.filter(f => f.userId === customer.id && f.uploadedBy === 'customer');
                    const sentFiles = allFiles.filter(f => f.userId === customer.id && f.uploadedBy === 'admin');
                    return (
                      <tr key={customer.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '1rem' }}>
                            borderRadius: '1rem',
                            fontSize: '0.75rem'
                          }}>
                            {customerFiles.length} dosya
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
                        <td style={{ padding: '1rem', color: '#6b7280' }}>
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
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          ROTA <span style={{ color: '#10b981' }}>CRM v2.0</span>
          ROTA <span style={{ color: '#10b981' }}>CRM v2.1</span>
        </h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Hoş geldiniz, {user.companyName}</span>
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'upload', label: '📁 Belge Yükle' },
            { id: 'received', label: '📥 Size Özel Belgeler' },
            { id: 'reports', label: '📋 Raporlarım' }
          ].map(tab => (
            <button
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Yüklenen Belgeler</h3>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Yüklediğiniz Belgeler</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                  {getFilesFromStorage(user.id).length}
                  {getFilesFromStorage(user.id, 'customer').length}
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
                  {getFilesFromStorage(user.id, 'admin').length}
                </p>
              </div>
            </div>
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🚀 v2.0 Güncellemesi!</h3>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🎉 v2.1 BOMBA GÜNCELLEME!</h3>
              <p style={{ marginBottom: '1rem', color: '#059669', fontWeight: '500' }}>
                Artık gerçek dosya yükleme sistemi aktif! Belgelerinizi güvenle yükleyebilirsiniz.
                Artık danışmanlarınız size özel belgeler gönderebilir!
              </p>
              <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                <strong>✨ Yeni Özellikler:</strong><br/>
                📁 Gerçek dosya yükleme ve indirme<br/>
                🛡️ Güvenli dosya depolama<br/>
                👁️ Admin dosya görüntüleme<br/>
                📊 Gelişmiş dosya istatistikleri
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <strong>📥 Size Özel Belgeler</strong><br/>
                  <small>Raporlar, sertifikalar ve belgeler!</small>
                </div>
                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem' }}>
                  <strong>📊 Kategori Sistemi</strong><br/>
                  <small>Düzenli dosya kategorileri</small>
                </div>
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                  <strong>🔄 Anlık Güncelleme</strong><br/>
                  <small>Yeni belgeler anında görünür</small>
                </div>
              </div>
            </div>
          </div>
          <FileUpload user={user} onFileUpload={() => {}} />
        )}

        {activeTab === 'received' && (
          <CustomerReceivedFiles user={user} />
        )}

        {activeTab === 'reports' && (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📋 Raporlarım</h2>
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Size özel raporlar hazırlanıyor...</h3>
              <p style={{ color: '#6b7280' }}>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Danışmanlarımız sürecinizi değerlendirip size özel raporlar hazırlayacak.
              </p>
              <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
                <strong>💡 İpucu:</strong> Size özel belgeler "Size Özel Belgeler" sekmesinde görüntülenir!
              </div>
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
