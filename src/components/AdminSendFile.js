import React, { useState, useEffect } from 'react';
import { saveFileToStorage, getFoldersFromStorage } from '../utils/api';
import { getFolderHierarchy, getFileIcon, formatFileSize } from '../utils/helpers';

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
            📁 Sürdürülebilir Turizm Klasörü Seçin (Opsiyonel)
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

export default AdminSendFile;
3. /src/components/CustomerReceivedFiles.js
import React, { useState, useEffect } from 'react';
import { getFilesFromStorage, getFoldersFromStorage } from '../utils/api';
import { buildFolderPath, getFileIcon, getCategoryIcon, getCategoryColor, formatFileSize } from '../utils/helpers';

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

export default CustomerReceivedFiles;
