// API Configuration and utility functions

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

// Backend API file storage functions
export const saveFileToStorage = async (file, userId, uploadedBy = 'customer', category = 'general', folderId = null) => {
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

export const getFilesFromStorage = async (userId = null, uploadedBy = null, folderId = null) => {
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

export const deleteFileFromStorage = async (fileId) => {
  try {
    await apiCall(`${API}/files/${fileId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Backend API folder management functions
export const saveFolderToStorage = async (folderName, userId, parentId = null) => {
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

export const getFoldersFromStorage = async (userId = null, parentId = null) => {
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

export const deleteFolderFromStorage = async (folderId) => {
  try {
    await apiCall(`${API}/folders/${folderId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

// Create sustainable tourism folders via API
export const createSustainableTourismFolders = async (userId) => {
  try {
    await apiCall(`${API}/folders/sustainable-tourism/${userId}`, {
      method: 'POST'
    });
    console.log('Sürdürülebilir Turizm Yönetim Sistemi klasör yapısı oluşturuldu!');
  } catch (error) {
    console.error('Error creating sustainable tourism folders:', error);
  }
};

export { API, apiCall };
