import React, { useState, useEffect } from 'react';

// API Configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// API utility functions
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// NEW: Backend API file storage functions
const saveFileToStorage = async (file, userId, uploadedBy = 'customer', category = 'general', folderId = null) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          content: e.target.result,
          userId: userId,
          uploadedBy: uploadedBy,
          category: category,
          folderId: folderId
        };
        
        const result = await apiCall(`${API}/files`, {
          method: 'POST',
          body: JSON.stringify(fileData)
        });
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(file);
  });
};

const getFilesFromStorage = async (userId = null, uploadedBy = null, folderId = null) => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (uploadedBy) params.append('uploadedBy', uploadedBy);
    if (folderId !== null) params.append('folderId', folderId);
    
    const url = `${API}/files${params.toString() ? '?' + params.toString() : ''}`;
    return await apiCall(url);
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
};

const deleteFileFromStorage = async (fileId) => {
  try {
    await apiCall(`${API}/files/${fileId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// NEW: Backend API folder management functions
const saveFolderToStorage = async (folderName, userId, parentId = null) => {
  try {
    const folderData = {
      name: folderName,
      userId: userId,
      parentId: parentId
    };
    
    return await apiCall(`${API}/folders`, {
      method: 'POST',
      body: JSON.stringify(folderData)
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

const getFoldersFromStorage = async (userId = null, parentId = null) => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (parentId !== null) params.append('parentId', parentId);
    
    const url = `${API}/folders${params.toString() ? '?' + params.toString() : ''}`;
    return await apiCall(url);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
};

const deleteFolderFromStorage = async (folderId) => {
  try {
    await apiCall(`${API}/folders/${folderId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

// Helper functions for folder hierarchy
const buildFolderPath = (folderId, allFolders) => {
  if (!folderId) return [];
  
  const path = [];
  let currentId = folderId;
  
  while (currentId && path.length < 10) {
    const folder = allFolders.find(f => f.id === currentId);
    if (!folder) break;
    
    path.unshift(folder);
    currentId = folder.parentId;
  }
  
  return path;
};

const getFolderHierarchy = (folders) => {
  return folders.map(folder => {
    const path = buildFolderPath(folder.id, folders);
    const depth = path.length - 1;
    const displayName = path.map(p => p.name).join(' > ');
    
    return {
      ...folder,
      path,
      depth,
      displayName,
      fullPath: displayName
    };
  }).sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    return a.displayName.localeCompare(b.displayName, 'tr');
  });
};

// NEW: Create sustainable tourism folders via API
const createSustainableTourismFolders = async (userId) => {
  try {
    await apiCall(`${API}/folders/sustainable-tourism/${userId}`, {
      method: 'POST'
    });
    console.log('Sürdürülebilir Turizm Yönetim Sistemi klasör yapısı oluşturuldu!');
  } catch (error) {
    console.error('Error creating sustainable tourism folders:', error);
  }
};

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
        // Fallback to hardcoded login for demo
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
          <p style={{ color: '#6b7280', margin: 0 }}>v2.4 - MongoDB Gerçek Depolama! 🗄️</p>
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
          <strong>🚀 Test Bilgileri:</strong><br/>
          🗄️ MongoDB ile gerçek veritabanı depolaması!<br/>
          🌿 Sürdürülebilir Turizm Yönetim Sistemi!<br/>
          📁 Hiyerarşik klasör yönetimi!<br/>
          ☁️ Bulut tabanlı dosya saklama!<br/>
          👤 test@otel.com / herhangi şifre<br/>
          🛡️ admin@rotakalite.com / admin123
        </div>
      </div>
    </div>
  );
};

// Updated AdminSendFile component with API calls
const AdminSendFile = ({ customers, onFileUpload }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('report');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [folderHierarchy, setFolderHierarchy] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    { id: 'report', label: '📊 Rapor', color: '#3b82f6' },
    { id: 'certificate', label: '🏆 Sertifika', color: '#10b981' },
    { id: 'form', label: '📋 Form', color: '#f59e0b' },
    { id: 'document', label: '📄 Belge', color: '#8b5cf6' }
  ];

  useEffect(() => {
    const loadFolders = async () => {
      if (selectedCustomer) {
        const customerFolders = await getFoldersFromStorage(selectedCustomer);
        setFolders(customerFolders);
        
        const hierarchy = getFolderHierarchy(customerFolders);
        setFolderHierarchy(hierarchy);
      } else {
        setFolders([]);
        setFolderHierarchy([]);
      }
    };
    
    loadFolders();
  }, [selectedCustomer]);

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
        
        const maxSize = file.name.toLowerCase().endsWith('.zip') ? 500 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          const maxSizeMB = file.name.toLowerCase().endsWith('.zip') ? 500 : 10;
          alert(`${file.name} çok büyük! Maksimum ${maxSizeMB}MB`);
          continue;
        }
        
        for (let progress = 0; progress <= 100; progress += 25) {
          setUploadProgress(((i * 100) + progress) / selectedFiles.length);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        await saveFileToStorage(file, selectedCustomer, 'admin', category, selectedFolder);
      }

      setSelectedFiles([]);
      setSelectedCustomer('');
      setSelectedFolder(null);
      setUploadProgress(100);
      alert(`Dosyalar ${customers.find(c => c.id === selectedCustomer)?.companyName} için başarıyla gönderildi!`);
      
      if (onFileUpload) {
        onFileUpload();
      }
    } catch (error) {
      alert('Dosya gönderme hatası: ' + error.message);
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
    if (type.includes('zip')) return '🗜️';
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

      {/* Folder Selection */}
      {selectedCustomer && folderHierarchy.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            📁 Klasör Seçin (Opsiyonel)
          </label>
          <select
            value={selectedFolder || ''}
            onChange={(e) => setSelectedFolder(e.target.value || null)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontFamily: 'monospace'
            }}
          >
            <option value="">📁 Ana klasör</option>
            {folderHierarchy.map(folder => {
              const indent = '　'.repeat(folder.depth);
              return (
                <option key={folder.id} value={folder.id}>
                  {indent}📁 {folder.name}
                </option>
              );
            })}
          </select>
        </div>
      )}

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
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
        />
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
          🗜️ ZIP dosyaları için maksimum 500MB, diğer dosyalar için 10MB
        </p>
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

// Updated CustomerReceivedFiles component with API calls
const CustomerReceivedFiles = ({ user }) => {
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [files, customerFolders] = await Promise.all([
          getFilesFromStorage(user.id, 'admin', currentFolder),
          getFoldersFromStorage(user.id, currentFolder)
        ]);
        
        setReceivedFiles(files);
        setFolders(customerFolders);
        
        if (currentFolder) {
          const allFolders = await getFoldersFromStorage(user.id);
          const path = buildFolderPath(currentFolder, allFolders);
          setFolderPath(path);
        } else {
          setFolderPath([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user.id, currentFolder]);

  const navigateToFolder = (folderId) => {
    setCurrentFolder(folderId);
  };

  const navigateToParent = () => {
    if (!currentFolder || folderPath.length === 0) {
      setCurrentFolder(null);
      return;
    }
    
    const currentFolderData = folderPath[folderPath.length - 1];
    if (currentFolderData && currentFolderData.parentId !== undefined) {
      setCurrentFolder(currentFolderData.parentId);
    } else {
      setCurrentFolder(null);
    }
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    if (type.includes('zip')) return '🗜️';
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

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <p>Veriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        📥 Size Özel Belgeler
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Danışmanlarımız tarafından size özel hazırlanan belgeler ve raporlar
      </p>

      {/* Navigation */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button
            onClick={() => navigateToFolder(null)}
            style={{
              background: !currentFolder ? '#e5e7eb' : '#f3f4f6',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: !currentFolder ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: !currentFolder ? '600' : '400'
            }}
            disabled={!currentFolder}
          >
            🏠 Ana Sayfa
          </button>
          
          {currentFolder && (
            <button
              onClick={navigateToParent}
              style={{
                background: '#fef3c7',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#92400e',
                fontWeight: '500'
              }}
            >
              ⬆️ Bir Üst Klasör
            </button>
          )}
        </div>
        
        {/* Breadcrumb Path */}
        {folderPath.length > 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: '#f8fafc',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            <span>📍 Konum:</span>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                {index > 0 && <span>{'>'}</span>}
                <button
                  onClick={() => navigateToFolder(folder.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: index === folderPath.length - 1 ? '#1e40af' : '#64748b',
                    cursor: index === folderPath.length - 1 ? 'default' : 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: index === folderPath.length - 1 ? '600' : '400'
                  }}
                  disabled={index === folderPath.length - 1}
                >
                  📁 {folder.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {(receivedFiles.length === 0 && folders.length === 0) ? (
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
              📋 Size Gönderilen Belgeler ({receivedFiles.length + folders.length})
            </h3>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            <div style={{ space: '1rem' }}>
              {/* Klasörler */}
              {folders.map((folder) => (
                <div key={folder.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fffbeb',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  marginBottom: '1rem',
                  border: '1px solid #fde68a',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => navigateToFolder(folder.id)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fef3c7'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fffbeb'}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.5rem',
                      background: '#fbbf24',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginRight: '1rem'
                    }}>
                      📁
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '1.125rem' }}>{folder.name}</p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(folder.createdDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.5rem', color: '#fbbf24' }}>→</div>
                </div>
              ))}

              {/* Dosyalar */}
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

// Updated FileUpload component with API calls
const FileUpload = ({ user, onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [folderPath, setFolderPath] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [files, customerFolders] = await Promise.all([
          getFilesFromStorage(user.id, 'customer', currentFolder),
          getFoldersFromStorage(user.id, currentFolder)
        ]);
        
        setUploadedFiles(files);
        setFolders(customerFolders);
        
        if (currentFolder) {
          const allFolders = await getFoldersFromStorage(user.id);
          const path = buildFolderPath(currentFolder, allFolders);
          setFolderPath(path);
        } else {
          setFolderPath([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user.id, currentFolder]);

  const navigateToFolder = (folderId) => {
    setCurrentFolder(folderId);
  };

  const navigateToParent = () => {
    if (!currentFolder || folderPath.length === 0) {
      setCurrentFolder(null);
      return;
    }
    
    const currentFolderData = folderPath[folderPath.length - 1];
    if (currentFolderData && currentFolderData.parentId !== undefined) {
      setCurrentFolder(currentFolderData.parentId);
    } else {
      setCurrentFolder(null);
    }
  };

  const createNewFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await saveFolderToStorage(newFolderName.trim(), user.id, currentFolder);
        setNewFolderName('');
        setShowNewFolderInput(false);
        
        // Refresh folders
        const customerFolders = await getFoldersFromStorage(user.id, currentFolder);
        setFolders(customerFolders);
      } catch (error) {
        alert('Klasör oluşturma hatası: ' + error.message);
      }
    }
  };

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
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/zip',
      'application/x-zip-compressed'
    ];

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.zip')) {
        alert(`${file.name} desteklenmeyen dosya türü!`);
        return false;
      }
      
      const maxSize = file.name.toLowerCase().endsWith('.zip') ? 500 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        const maxSizeMB = file.name.toLowerCase().endsWith('.zip') ? 500 : 10;
        alert(`${file.name} çok büyük! Maksimum ${maxSizeMB}MB`);
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
        
        for (let progress = 0; progress <= 100; progress += 20) {
          setUploadProgress(((i * 100) + progress) / selectedFiles.length);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const savedFile = await saveFileToStorage(file, user.id, 'customer', 'general', currentFolder);
        setUploadedFiles(prev => [...prev, savedFile]);
      }

      setSelectedFiles([]);
      setUploadProgress(100);
      alert('Dosyalar başarıyla yüklendi!');
      
      if (onFileUpload) {
        onFileUpload(selectedFiles);
      }
    } catch (error) {
      alert('Dosya yükleme hatası: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteFileFromStorage(fileId);
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      } catch (error) {
        alert('Dosya silme hatası: ' + error.message);
      }
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (confirm('Bu klasörü ve içindeki tüm dosyaları silmek istediğinizden emin misiniz?')) {
      try {
        await deleteFolderFromStorage(folderId);
        setFolders(prev => prev.filter(f => f.id !== folderId));
        setUploadedFiles(prev => prev.filter(f => f.folderId !== folderId));
      } catch (error) {
        alert('Klasör silme hatası: ' + error.message);
      }
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
    if (type.includes('zip')) return '🗜️';
    return '📎';
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <p>Veriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '4xl', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        📁 Belge Yönetimi
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Belgelerinizi yükleyin ve organize edin
      </p>

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1rem',
        background: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => navigateToFolder(null)}
            style={{
              background: !currentFolder ? '#e5e7eb' : '#f3f4f6',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: !currentFolder ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: !currentFolder ? '600' : '400'
            }}
            disabled={!currentFolder}
          >
            🏠 Ana Sayfa
          </button>
          
          {currentFolder && (
            <button
              onClick={navigateToParent}
              style={{
                background: '#fef3c7',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#92400e',
                fontWeight: '500'
              }}
            >
              ⬆️ Bir Üst Klasör
            </button>
          )}
        </div>

        {/* Breadcrumb Path */}
        {folderPath.length > 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: '#f8fafc',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            <span>📍 Konum:</span>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                {index > 0 && <span>{'>'}</span>}
                <button
                  onClick={() => navigateToFolder(folder.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: index === folderPath.length - 1 ? '#1e40af' : '#64748b',
                    cursor: index === folderPath.length - 1 ? 'default' : 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: index === folderPath.length - 1 ? '600' : '400'
                  }}
                  disabled={index === folderPath.length - 1}
                >
                  📁 {folder.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* New Folder Button */}
        <button
          onClick={() => setShowNewFolderInput(true)}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          📁 Yeni Klasör
        </button>
      </div>

      {/* New Folder Input */}
      {showNewFolderInput && (
        <div style={{
          background: '#fef3c7',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Klasör adı"
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem'
            }}
          />
          <button
            onClick={createNewFolder}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Oluştur
          </button>
          <button
            onClick={() => {
              setShowNewFolderInput(false);
              setNewFolderName('');
            }}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            İptal
          </button>
        </div>
      )}

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
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
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
            PDF, Word, Excel, Resim, ZIP (Maks. 10MB, ZIP için 500MB)
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

      {/* Folders and Files List */}
      {(folders.length > 0 || uploadedFiles.length > 0) && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            📋 Dosyalarınız ({folders.length + uploadedFiles.length})
          </h3>
          <div style={{ space: '0.75rem' }}>
            {/* Klasörler */}
            {folders.map((folder) => (
              <div key={folder.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fffbeb',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '0.75rem',
                border: '1px solid #fde68a'
              }}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }}
                  onClick={() => navigateToFolder(folder.id)}
                >
                  <span style={{ fontSize: '2rem', marginRight: '1rem' }}>📁</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>{folder.name}</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                      {new Date(folder.createdDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteFolder(folder.id)}
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
            ))}

            {/* Dosyalar */}
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

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    if (type.includes('zip')) return '🗜️';
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
                  <strong>📁 Hiyerarşik Klasör Sistemi</strong><br/>
                  <small>A, B, C, D sütunları ile organize!</small>
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
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Klasörleriniz</h3>
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
                🗄️ MongoDB ile gerçek veritabanı depolaması aktif!
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <strong>🗄️ MongoDB Depolaması</strong><br/>
                  <small>Kalıcı veri saklama ile güvenli dosya yönetimi!</small>
                </div>
                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem' }}>
                  <strong>📁 Otomatik Klasörler</strong><br/>
                  <small>Sistem kurulumunda otomatik oluşturulur!</small>
                </div>
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                  <strong>🔄 Hiyerarşik Yapı</strong><br/>
                  <small>D sütunu alt klasörleri ile detaylı!</small>
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
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Size özel raporlar hazırlanıyor...</h3>
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

export default App;
