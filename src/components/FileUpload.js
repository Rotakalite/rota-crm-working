import React, { useState, useEffect } from 'react';
import { 
  saveFileToStorage, 
  getFilesFromStorage, 
  getFoldersFromStorage, 
  deleteFileFromStorage,
  saveFolderToStorage,
  deleteFolderFromStorage 
} from '../utils/api';
import { buildFolderPath, getFileIcon, formatFileSize } from '../utils/helpers';

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
    if (window.confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteFileFromStorage(fileId);
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      } catch (error) {
        alert('Dosya silme hatası: ' + error.message);
      }
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm('Bu klasörü ve içindeki tüm dosyaları silmek istediğinizden emin misiniz?')) {
      try {
        await deleteFolderFromStorage(folderId);
        setFolders(prev => prev.filter(f => f.id !== folderId));
        setUploadedFiles(prev => prev.filter(f => f.folderId !== folderId));
      } catch (error) {
        alert('Klasör silme hatası: ' + error.message);
      }
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
    <div style={{ maxWidth: '4xl', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        📁 Belge Yükleme Sistemi
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Sürdürülebilir turizm belgelerinizi organize bir şekilde yükleyin ve saklayın
      </p>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
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

export default FileUpload;
