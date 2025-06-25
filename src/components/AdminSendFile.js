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
