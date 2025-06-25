// Helper functions for folder hierarchy and file management

export const buildFolderPath = (folderId, allFolders) => {
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

export const getFolderHierarchy = (folders) => {
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

export const getFileIcon = (type) => {
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('excel') || type.includes('sheet')) return '📊';
  if (type.includes('image')) return '🖼️';
  if (type.includes('zip')) return '🗜️';
  return '📎';
};

export const getCategoryIcon = (category) => {
  switch(category) {
    case 'report': return '📊';
    case 'certificate': return '🏆';
    case 'form': return '📋';
    case 'document': return '📄';
    default: return '📎';
  }
};

export const getCategoryColor = (category) => {
  switch(category) {
    case 'report': return { background: '#eff6ff', color: '#1e40af' };
    case 'certificate': return { background: '#f0fdf4', color: '#166534' };
    case 'form': return { background: '#fefbf0', color: '#92400e' };
    case 'document': return { background: '#f5f3ff', color: '#7c3aed' };
    default: return { background: '#f3f4f6', color: '#6b7280' };
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
