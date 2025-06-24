Tabii! İşte güncel kodlarınız:
Action: file_editor view /app/frontend/src/App.js
Observation: Here's the result of running `cat -n` on /app/frontend/src/App.js:
1|import React, { useState, useEffect } from 'react';
2|
3|// File storage utility functions
4|const saveFileToStorage = (file, userId, uploadedBy = 'customer', category = 'general', folderId = null) => {
5|  return new Promise((resolve) => {
6|    const reader = new FileReader();
7|    reader.onload = function(e) {
8|      const fileData = {
9|        id: Date.now() + Math.random(),
10|        name: file.name,
11|        size: file.size,
12|        type: file.type,
13|        content: e.target.result,
14|        userId: userId,
15|        uploadedBy: uploadedBy, // 'customer' or 'admin'
16|        category: category, // 'general', 'report', 'certificate', 'form'
17|        folderId: folderId, // NEW: Klasör ID'si
18|        uploadDate: new Date().toISOString(),
19|        status: 'uploaded'
20|      };
21|      
22|      const existingFiles = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
23|      existingFiles.push(fileData);
24|      localStorage.setItem('rotaFiles', JSON.stringify(existingFiles));
25|      
26|      resolve(fileData);
27|    };
28|    reader.readAsDataURL(file);
29|  });
30|};
31|
32|const getFilesFromStorage = (userId = null, uploadedBy = null, folderId = null) => {
33|  const files = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
34|  let filteredFiles = files;
35|  
36|  if (userId) {
37|    filteredFiles = filteredFiles.filter(f => f.userId === userId);
38|  }
39|  
40|  if (uploadedBy) {
41|    filteredFiles = filteredFiles.filter(f => f.uploadedBy === uploadedBy);
42|  }
43|
44|  if (folderId !== null) {
45|    filteredFiles = filteredFiles.filter(f => f.folderId === folderId);
46|  }
47|  
48|  return filteredFiles;
49|};
50|
51|const deleteFileFromStorage = (fileId) => {
52|  const files = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
53|  const updatedFiles = files.filter(f => f.id !== fileId);
54|  localStorage.setItem('rotaFiles', JSON.stringify(updatedFiles));
55|};
56|
57|// NEW: Klasör yönetimi fonksiyonları
58|const saveFolderToStorage = (folderName, userId, parentId = null) => {
59|  const folderData = {
60|    id: Date.now() + Math.random(),
61|    name: folderName,
62|    userId: userId,
63|    parentId: parentId,
64|    createdDate: new Date().toISOString(),
65|    type: 'folder'
66|  };
67|  
68|  const existingFolders = JSON.parse(localStorage.getItem('rotaFolders') || '[]');
69|  existingFolders.push(folderData);
70|  localStorage.setItem('rotaFolders', JSON.stringify(existingFolders));
71|  
72|  return folderData;
73|};
74|
75|const getFoldersFromStorage = (userId = null, parentId = null) => {
76|  const folders = JSON.parse(localStorage.getItem('rotaFolders') || '[]');
77|  let filteredFolders = folders;
78|  
79|  if (userId) {
80|    filteredFolders = filteredFolders.filter(f => f.userId === userId);
81|  }
82|  
83|  if (parentId !== undefined) {
84|    filteredFolders = filteredFolders.filter(f => f.parentId === parentId);
85|  }
86|  
87|  return filteredFolders;
88|};
89|
90|const deleteFolderFromStorage = (folderId) => {
91|  const folders = JSON.parse(localStorage.getItem('rotaFolders') || '[]');
92|  const updatedFolders = folders.filter(f => f.id !== folderId);
93|  localStorage.setItem('rotaFolders', JSON.stringify(updatedFolders));
94|  
95|  // Klasördeki dosyaları da sil
96|  const files = JSON.parse(localStorage.getItem('rotaFiles') || '[]');
97|  const updatedFiles = files.filter(f => f.folderId !== folderId);
98|  localStorage.setItem('rotaFiles', JSON.stringify(updatedFiles));
99|};
100|
101|// NEW: Sürdürülebilir Turizm Yönetim Sistemi klasör yapısını oluşturma
102|const createSustainableTourismFolders = (userId) => {
103|  const existingFolders = JSON.parse(localStorage.getItem('rotaFolders') || '[]');
104|  
105|  // Ana klasör zaten var mı kontrol et
106|  const mainFolderExists = existingFolders.some(f => 
107|    f.name === 'Sürdürülebilir Turizm Yönetim Sistemi' && 
108|    f.userId === userId && 
109|    f.parentId === null
110|  );
111|  
112|  if (mainFolderExists) {
113|    return; // Zaten oluşturulmuş
114|  }
115|  
116|  // Ana klasörü oluştur
117|  const mainFolder = saveFolderToStorage('Sürdürülebilir Turizm Yönetim Sistemi', userId, null);
118|  
119|  // A Sütunu klasörü ve alt klasörleri
120|  const aFolder = saveFolderToStorage('A SÜTUNU', userId, mainFolder.id);
121|  const aSubfolders = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7.1', 'A7.2', 'A7.3', 'A7.4', 'A8', 'A9', 'A10'];
122|  aSubfolders.forEach(name => {
123|    saveFolderToStorage(name, userId, aFolder.id);
124|  });
125|  
126|  // B Sütunu klasörü ve alt klasörleri
127|  const bFolder = saveFolderToStorage('B SÜTUNU', userId, mainFolder.id);
128|  const bSubfolders = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'];
129|  bSubfolders.forEach(name => {
130|    saveFolderToStorage(name, userId, bFolder.id);
131|  });
132|  
133|  // C Sütunu klasörü ve alt klasörleri
134|  const cFolder = saveFolderToStorage('C SÜTUNU', userId, mainFolder.id);
135|  const cSubfolders = ['C1', 'C2', 'C3', 'C4'];
136|  cSubfolders.forEach(name => {
137|    saveFolderToStorage(name, userId, cFolder.id);
138|  });
139|  
140|  // D Sütunu klasörü ve karmaşık alt yapısı
141|  const dFolder = saveFolderToStorage('D SÜTUNU', userId, mainFolder.id);
142|  
143|  // D1 ve alt klasörleri
144|  const d1Folder = saveFolderToStorage('D1', userId, dFolder.id);
145|  const d1Subfolders = ['D1.1', 'D1.2', 'D1.3', 'D1.4'];
146|  d1Subfolders.forEach(name => {
147|    saveFolderToStorage(name, userId, d1Folder.id);
148|  });
149|  
150|  // D2 ve alt klasörleri
151|  const d2Folder = saveFolderToStorage('D2', userId, dFolder.id);
152|  const d2Subfolders = ['D2.1', 'D2.2', 'D2.3', 'D2.4', 'D2.5', 'D2.6'];
153|  d2Subfolders.forEach(name => {
154|    saveFolderToStorage(name, userId, d2Folder.id);
155|  });
156|  
157|  // D3 ve alt klasörleri
158|  const d3Folder = saveFolderToStorage('D3', userId, dFolder.id);
159|  const d3Subfolders = ['D3.1', 'D3.2', 'D3.3', 'D3.4', 'D3.5', 'D3.6'];
160|  d3Subfolders.forEach(name => {
161|    saveFolderToStorage(name, userId, d3Folder.id);
162|  });
163|  
164|  console.log('Sürdürülebilir Turizm Yönetim Sistemi klasör yapısı oluşturuldu!');
165|};
166|
167|const LoginForm = ({ onLogin }) => {
168|  const [email, setEmail] = useState('');
169|  const [password, setPassword] = useState('');
170|
171|  const handleSubmit = (e) => {
172|    e.preventDefault();
173|    if (email && password) {
174|      if (email === 'admin@rotakalite.com' && password === 'admin123') {
175|        onLogin({ 
176|          id: 'admin',
177|          email, 
178|          name: 'ROTA Admin', 
179|          role: 'admin',
180|          isAdmin: true 
181|        });
182|      } else {
183|        onLogin({ 
184|          id: 'customer1',
185|          email, 
186|          companyName: 'Örnek Otel A.Ş.', 
187|          stage: 2,
188|          role: 'customer',
189|          isAdmin: false 
190|        });
191|      }
192|    }
193|  };
194|
195|  return (
196|    <div style={{ 
197|      minHeight: '100vh', 
198|      background: 'linear-gradient(135deg, #1e3a8a 0%, #059669 50%, #3b82f6 100%)',
199|      display: 'flex',
200|      alignItems: 'center',
201|      justifyContent: 'center',
202|      fontFamily: 'Arial, sans-serif'
203|    }}>
204|      <div style={{
205|        background: 'white',
206|        padding: '3rem',
207|        borderRadius: '1rem',
208|        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
209|        width: '100%',
210|        maxWidth: '400px'
211|      }}>
212|        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
213|          <div style={{
214|            width: '64px',
215|            height: '64px',
216|            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
217|            borderRadius: '1rem',
218|            display: 'flex',
219|            alignItems: 'center',
220|            justifyContent: 'center',
221|            margin: '0 auto 1rem',
222|            color: 'white',
223|            fontSize: '2rem',
224|            fontWeight: 'bold'
225|          }}>R</div>
226|          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>ROTA CRM</h2>
227|          <p style={{ color: '#6b7280', margin: 0 }}>v2.3 - Sürdürülebilir Turizm Sistemi! 🌿</p>
228|        </div>
229|
230|        <form onSubmit={handleSubmit}>
231|          <div style={{ marginBottom: '1.5rem' }}>
232|            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>E-mail</label>
233|            <input
234|              type="email"
235|              value={email}
236|              onChange={(e) => setEmail(e.target.value)}
237|              placeholder="test@otel.com veya admin@rotakalite.com"
238|              style={{
239|                width: '100%',
240|                padding: '0.75rem',
241|                border: '1px solid #d1d5db',
242|                borderRadius: '0.5rem',
243|                fontSize: '1rem'
244|              }}
245|              required
246|            />
247|          </div>
248|          
249|          <div style={{ marginBottom: '1.5rem' }}>
250|            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Şifre</label>
251|            <input
252|              type="password"
253|              value={password}
254|              onChange={(e) => setPassword(e.target.value)}
255|              placeholder="••••••••"
256|              style={{
257|                width: '100%',
258|                padding: '0.75rem',
259|                border: '1px solid #d1d5db',
260|                borderRadius: '0.5rem',
261|                fontSize: '1rem'
262|              }}
263|              required
264|            />
265|          </div>
266|
267|          <button
268|            type="submit"
269|            style={{
270|              width: '100%',
271|              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
272|              color: 'white',
273|              border: 'none',
274|              padding: '0.75rem',
275|              borderRadius: '0.5rem',
276|              fontSize: '1rem',
277|              fontWeight: '600',
278|              cursor: 'pointer'
279|            }}
280|          >
281|            Giriş Yap
282|          </button>
283|        </form>
284|
285|        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
286|          <strong>🚀 v2.3 YENİ ÖZELLİKLER:</strong><br/>
287|          🌿 Sürdürülebilir Turizm Yönetim Sistemi!<br/>
288|          🗂️ Otomatik klasör yapısı oluşturma!<br/>
289|          📁 A, B, C, D sütunları ile organize sistem!<br/>
290|          🔄 Hiyerarşik klasör yönetimi!<br/>
291|          👤 test@otel.com / 123456<br/>
292|          🛡️ admin@rotakalite.com / admin123
293|        </div>
294|      </div>
295|    </div>
296|  );
297|};
298|
299|const AdminSendFile = ({ customers, onFileUpload }) => {
300|  const [selectedCustomer, setSelectedCustomer] = useState('');
301|  const [selectedFiles, setSelectedFiles] = useState([]);
302|  const [category, setCategory] = useState('report');
303|  const [selectedFolder, setSelectedFolder] = useState(null);
304|  const [folders, setFolders] = useState([]);
305|  const [isUploading, setIsUploading] = useState(false);
306|  const [uploadProgress, setUploadProgress] = useState(0);
307|
308|  const categories = [
309|    { id: 'report', label: '📊 Rapor', color: '#3b82f6' },
310|    { id: 'certificate', label: '🏆 Sertifika', color: '#10b981' },
311|    { id: 'form', label: '📋 Form', color: '#f59e0b' },
312|    { id: 'document', label: '📄 Belge', color: '#8b5cf6' }
313|  ];
314|
315|  useEffect(() => {
316|    if (selectedCustomer) {
317|      const customerFolders = getFoldersFromStorage(selectedCustomer);
318|      setFolders(customerFolders);
319|    }
320|  }, [selectedCustomer]);
321|
322|  const handleFileSelect = (e) => {
323|    if (e.target.files && e.target.files[0]) {
324|      const files = Array.from(e.target.files);
325|      setSelectedFiles(files);
326|    }
327|  };
328|
329|  const handleUpload = async () => {
330|    if (!selectedCustomer || selectedFiles.length === 0) {
331|      alert('Lütfen müşteri seçin ve dosya ekleyin!');
332|      return;
333|    }
334|
335|    setIsUploading(true);
336|    setUploadProgress(0);
337|
338|    try {
339|      for (let i = 0; i < selectedFiles.length; i++) {
340|        const file = selectedFiles[i];
341|        
342|        // ZIP dosyası boyut kontrolü
343|        const maxSize = file.name.toLowerCase().endsWith('.zip') ? 500 * 1024 * 1024 : 10 * 1024 * 1024;
344|        if (file.size > maxSize) {
345|          const maxSizeMB = file.name.toLowerCase().endsWith('.zip') ? 500 : 10;
346|          alert(`${file.name} çok büyük! Maksimum ${maxSizeMB}MB`);
347|          continue;
348|        }
349|        
350|        for (let progress = 0; progress <= 100; progress += 25) {
351|          setUploadProgress(((i * 100) + progress) / selectedFiles.length);
352|          await new Promise(resolve => setTimeout(resolve, 100));
353|        }
354|
355|        await saveFileToStorage(file, selectedCustomer, 'admin', category, selectedFolder);
356|      }
357|
358|      setSelectedFiles([]);
359|      setSelectedCustomer('');
360|      setSelectedFolder(null);
361|      setUploadProgress(100);
362|      alert(`Dosyalar ${customers.find(c => c.id === selectedCustomer)?.companyName} için başarıyla gönderildi!`);
363|      
364|      if (onFileUpload) {
365|        onFileUpload();
366|      }
367|    } catch (error) {
368|      alert('Dosya gönderme hatası!');
369|    } finally {
370|      setIsUploading(false);
371|      setUploadProgress(0);
372|    }
373|  };
374|
375|  const getFileIcon = (type) => {
376|    if (type.includes('pdf')) return '📄';
377|    if (type.includes('word') || type.includes('document')) return '📝';
378|    if (type.includes('excel') || type.includes('sheet')) return '📊';
379|    if (type.includes('image')) return '🖼️';
380|    if (type.includes('zip')) return '🗜️';
381|    return '📎';
382|  };
383|
384|  const formatFileSize = (bytes) => {
385|    if (bytes === 0) return '0 Bytes';
386|    const k = 1024;
387|    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
388|    const i = Math.floor(Math.log(bytes) / Math.log(k));
389|    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
390|  };
391|
392|  return (
393|    <div style={{
394|      background: 'white',
395|      borderRadius: '1rem',
396|      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
397|      padding: '2rem',
398|      marginBottom: '2rem'
399|    }}>
400|      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
401|        📤 Müşteriye Dosya Gönder
402|      </h3>
403|
404|      {/* Customer Selection */}
405|      <div style={{ marginBottom: '1.5rem' }}>
406|        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
407|          🏢 Müşteri Seçin
408|        </label>
409|        <select
410|          value={selectedCustomer}
411|          onChange={(e) => setSelectedCustomer(e.target.value)}
412|          style={{
413|            width: '100%',
414|            padding: '0.75rem',
415|            border: '1px solid #d1d5db',
416|            borderRadius: '0.5rem',
417|            fontSize: '1rem'
418|          }}
419|        >
420|          <option value="">Müşteri seçin...</option>
421|          {customers.map(customer => (
422|            <option key={customer.id} value={customer.id}>
423|              {customer.companyName} ({customer.email})
424|            </option>
425|          ))}
426|        </select>
427|      </div>
428|
429|      {/* Folder Selection */}
430|      {selectedCustomer && folders.length > 0 && (
431|        <div style={{ marginBottom: '1.5rem' }}>
432|          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
433|            📁 Klasör Seçin (Opsiyonel)
434|          </label>
435|          <select
436|            value={selectedFolder || ''}
437|            onChange={(e) => setSelectedFolder(e.target.value || null)}
438|            style={{
439|              width: '100%',
440|              padding: '0.75rem',
441|              border: '1px solid #d1d5db',
442|              borderRadius: '0.5rem',
443|              fontSize: '1rem'
444|            }}
445|          >
446|            <option value="">Ana klasör</option>
447|            {folders.map(folder => (
448|              <option key={folder.id} value={folder.id}>
449|                📁 {folder.name}
450|              </option>
451|            ))}
452|          </select>
453|        </div>
454|      )}
455|
456|      {/* Category Selection */}
457|      <div style={{ marginBottom: '1.5rem' }}>
458|        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
459|          📂 Dosya Kategorisi
460|        </label>
461|        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
462|          {categories.map(cat => (
463|            <button
464|              key={cat.id}
465|              onClick={() => setCategory(cat.id)}
466|              style={{
467|                padding: '0.75rem',
468|                border: category === cat.id ? `2px solid ${cat.color}` : '1px solid #e5e7eb',
469|                borderRadius: '0.5rem',
470|                background: category === cat.id ? `${cat.color}15` : 'white',
471|                color: category === cat.id ? cat.color : '#6b7280',
472|                cursor: 'pointer',
473|                fontSize: '0.875rem',
474|                fontWeight: category === cat.id ? '600' : '400'
475|              }}
476|            >
477|              {cat.label}
478|            </button>
479|          ))}
480|        </div>
481|      </div>
482|
483|      {/* File Selection */}
484|      <div style={{ marginBottom: '1.5rem' }}>
485|        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
486|          📎 Dosya Seçin
487|        </label>
488|        <input
489|          type="file"
490|          multiple
491|          onChange={handleFileSelect}
492|          style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
493|          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
494|        />
495|        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
496|          🗜️ ZIP dosyaları için maksimum 500MB, diğer dosyalar için 10MB
497|        </p>
498|      </div>
499|
500|      {/* Selected Files */}
501|      {selectedFiles.length > 0 && (
502|        <div style={{ marginBottom: '1.5rem' }}>
503|          <h4 style={{ fontWeight: '500', marginBottom: '0.75rem' }}>Seçilen Dosyalar:</h4>
504|          {selectedFiles.map((file, index) => (
505|            <div key={index} style={{
506|              display: 'flex',
507|              alignItems: 'center',
508|              justifyContent: 'space-between',
509|              background: '#f9fafb',
510|              padding: '0.75rem',
511|              borderRadius: '0.5rem',
512|              marginBottom: '0.5rem'
513|            }}>
514|              <div style={{ display: 'flex', alignItems: 'center' }}>
515|                <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
516|                  {getFileIcon(file.type)}
517|                </span>
518|                <div>
519|                  <p style={{ margin: 0, fontWeight: '500' }}>{file.name}</p>
520|                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
521|                    {formatFileSize(file.size)}
522|                  </p>
523|                </div>
524|              </div>
525|              <button
526|                onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
527|                style={{
528|                  background: '#ef4444',
529|                  color: 'white',
530|                  border: 'none',
531|                  borderRadius: '0.25rem',
532|                  padding: '0.25rem 0.5rem',
533|                  cursor: 'pointer',
534|                  fontSize: '0.75rem'
535|                }}
536|              >
537|                ❌
538|              </button>
539|            </div>
540|          ))}
541|        </div>
542|      )}
543|
544|      {/* Upload Progress */}
545|      {isUploading && (
546|        <div style={{ marginBottom: '1.5rem' }}>
547|          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
548|            <span>Gönderiliyor...</span>
549|            <span>{Math.round(uploadProgress)}%</span>
550|          </div>
551|          <div style={{
552|            width: '100%',
553|            background: '#e5e7eb',
554|            borderRadius: '0.25rem',
555|            height: '0.5rem'
556|          }}>
557|            <div style={{
558|              background: 'linear-gradient(135deg, #10b981, #059669)',
559|              height: '100%',
560|              borderRadius: '0.25rem',
561|              width: `${uploadProgress}%`,
562|              transition: 'width 0.3s ease'
563|            }}></div>
564|          </div>
565|        </div>
566|      )}
567|
568|      {/* Upload Button */}
569|      <button
570|        onClick={handleUpload}
571|        disabled={isUploading || !selectedCustomer || selectedFiles.length === 0}
572|        style={{
573|          width: '100%',
574|          background: isUploading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
575|          color: 'white',
576|          border: 'none',
577|          padding: '1rem',
578|          borderRadius: '0.5rem',
579|          fontWeight: '600',
580|          cursor: isUploading ? 'not-allowed' : 'pointer',
581|          fontSize: '1rem'
582|        }}
583|      >
584|        {isUploading ? '📤 Gönderiliyor...' : '🚀 Müşteriye Gönder'}
585|      </button>
586|    </div>
587|  );
588|};
589|
590|const CustomerReceivedFiles = ({ user }) => {
591|  const [receivedFiles, setReceivedFiles] = useState([]);
592|  const [folders, setFolders] = useState([]);
593|  const [currentFolder, setCurrentFolder] = useState(null);
594|  const [breadcrumb, setBreadcrumb] = useState([]);
595|
596|  useEffect(() => {
597|    // Load files sent by admin to this customer
598|    const files = getFilesFromStorage(user.id, 'admin', currentFolder);
599|    setReceivedFiles(files);
600|    
601|    // Load folders for this customer
602|    const customerFolders = getFoldersFromStorage(user.id, currentFolder);
603|    setFolders(customerFolders);
604|    
605|    // Update breadcrumb
606|    updateBreadcrumb(currentFolder);
607|  }, [user.id, currentFolder]);
608|
609|  const updateBreadcrumb = (folderId) => {
610|    if (!folderId) {
611|      setBreadcrumb([]);
612|      return;
613|    }
614|    
615|    const allFolders = getFoldersFromStorage(user.id);
616|    const path = [];
617|    let currentId = folderId;
618|    
619|    while (currentId) {
620|      const folder = allFolders.find(f => f.id === currentId);
621|      if (folder) {
622|        path.unshift(folder);
623|        currentId = folder.parentId;
624|      } else {
625|        break;
626|      }
627|    }
628|    
629|    setBreadcrumb(path);
630|  };
631|
632|  const navigateToFolder = (folderId) => {
633|    setCurrentFolder(folderId);
634|  };
635|
636|  const getFileIcon = (type) => {
637|    if (type.includes('pdf')) return '📄';
638|    if (type.includes('word') || type.includes('document')) return '📝';
639|    if (type.includes('excel') || type.includes('sheet')) return '📊';
640|    if (type.includes('image')) return '🖼️';
641|    if (type.includes('zip')) return '🗜️';
642|    return '📎';
643|  };
644|
645|  const getCategoryIcon = (category) => {
646|    switch(category) {
647|      case 'report': return '📊';
648|      case 'certificate': return '🏆';
649|      case 'form': return '📋';
650|      case 'document': return '📄';
651|      default: return '📎';
652|    }
653|  };
654|
655|  const getCategoryColor = (category) => {
656|    switch(category) {
657|      case 'report': return { background: '#eff6ff', color: '#1e40af' };
658|      case 'certificate': return { background: '#f0fdf4', color: '#166534' };
659|      case 'form': return { background: '#fefbf0', color: '#92400e' };
660|      case 'document': return { background: '#f5f3ff', color: '#7c3aed' };
661|      default: return { background: '#f3f4f6', color: '#6b7280' };
662|    }
663|  };
664|
665|  const formatFileSize = (bytes) => {
666|    if (bytes === 0) return '0 Bytes';
667|    const k = 1024;
668|    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
669|    const i = Math.floor(Math.log(bytes) / Math.log(k));
670|    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
671|  };
672|
673|  return (
674|    <div style={{ padding: '2rem' }}>
675|      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
676|        📥 Size Özel Belgeler
677|      </h2>
678|      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
679|        Danışmanlarımız tarafından size özel hazırlanan belgeler ve raporlar
680|      </p>
681|
682|      {/* Breadcrumb & Back Button */}
683|      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
684|        <button
685|          onClick={() => navigateToFolder(null)}
686|          style={{
687|            background: currentFolder ? '#f3f4f6' : '#e5e7eb',
688|            border: 'none',
689|            padding: '0.5rem 1rem',
690|            borderRadius: '0.5rem',
691|            cursor: currentFolder ? 'pointer' : 'not-allowed',
692|            fontSize: '0.875rem'
693|          }}
694|          disabled={!currentFolder}
695|        >
696|          🏠 Ana Sayfa
697|        </button>
698|        
699|        {breadcrumb.map((folder, index) => (
700|          <React.Fragment key={folder.id}>
701|            <span style={{ color: '#6b7280' }}>{'>'}</span>
702|            <button
703|              onClick={() => navigateToFolder(folder.id)}
704|              style={{
705|                background: index === breadcrumb.length - 1 ? '#e5e7eb' : '#f3f4f6',
706|                border: 'none',
707|                padding: '0.5rem 1rem',
708|                borderRadius: '0.5rem',
709|                cursor: index === breadcrumb.length - 1 ? 'not-allowed' : 'pointer',
710|                fontSize: '0.875rem'
711|              }}
712|              disabled={index === breadcrumb.length - 1}
713|            >
714|              📁 {folder.name}
715|            </button>
716|          </React.Fragment>
717|        ))}
718|      </div>
719|
720|      {(receivedFiles.length === 0 && folders.length === 0) ? (
721|        <div style={{
722|          background: 'white',
723|          padding: '3rem',
724|          borderRadius: '0.75rem',
725|          textAlign: 'center',
726|          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
727|        }}>
728|          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
729|          <h3>Henüz size özel belge gönderilmemiş</h3>
730|          <p style={{ color: '#6b7280' }}>
731|            Danışmanlarımız size özel belgeler hazırladığında burada görüntülenecek.
732|          </p>
733|        </div>
734|      ) : (
735|        <div style={{
736|          background: 'white',
737|          borderRadius: '0.75rem',
738|          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
739|          overflow: 'hidden'
740|        }}>
741|          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
742|            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
743|              📋 Size Gönderilen Belgeler ({receivedFiles.length + folders.length})
744|            </h3>
745|          </div>
746|          
747|          <div style={{ padding: '1.5rem' }}>
748|            <div style={{ space: '1rem' }}>
749|              {/* Klasörler */}
750|              {folders.map((folder) => (
751|                <div key={folder.id} style={{
752|                  display: 'flex',
753|                  alignItems: 'center',
754|                  justifyContent: 'space-between',
755|                  background: '#fffbeb',
756|                  padding: '1.5rem',
757|                  borderRadius: '0.75rem',
758|                  marginBottom: '1rem',
759|                  border: '1px solid #fde68a',
760|                  cursor: 'pointer'
761|                }}
762|                onClick={() => navigateToFolder(folder.id)}
763|                >
764|                  <div style={{ display: 'flex', alignItems: 'center' }}>
765|                    <div style={{
766|                      width: '3rem',
767|                      height: '3rem',
768|                      borderRadius: '0.5rem',
769|                      background: '#fbbf24',
770|                      color: 'white',
771|                      display: 'flex',
772|                      alignItems: 'center',
773|                      justifyContent: 'center',
774|                      fontSize: '1.5rem',
775|                      marginRight: '1rem'
776|                    }}>
777|                      📁
778|                    </div>
779|                    <div>
780|                      <p style={{ margin: 0, fontWeight: '600', fontSize: '1.125rem' }}>{folder.name}</p>
781|                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
782|                        {new Date(folder.createdDate).toLocaleDateString('tr-TR')}
783|                      </p>
784|                    </div>
785|                  </div>
786|                </div>
787|              ))}
788|
789|              {/* Dosyalar */}
790|              {receivedFiles.map((file) => (
791|                <div key={file.id} style={{
792|                  display: 'flex',
793|                  alignItems: 'center',
794|                  justifyContent: 'space-between',
795|                  background: '#f9fafb',
796|                  padding: '1.5rem',
797|                  borderRadius: '0.75rem',
798|                  marginBottom: '1rem',
799|                  border: '1px solid #e5e7eb'
800|                }}>
801|                  <div style={{ display: 'flex', alignItems: 'center' }}>
802|                    <div style={{
803|                      width: '3rem',
804|                      height: '3rem',
805|                      borderRadius: '0.5rem',
806|                      ...getCategoryColor(file.category),
807|                      display: 'flex',
808|                      alignItems: 'center',
809|                      justifyContent: 'center',
810|                      fontSize: '1.5rem',
811|                      marginRight: '1rem'
812|                    }}>
813|                      {getCategoryIcon(file.category)}
814|                    </div>
815|                    <div>
816|                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
817|                        <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
818|                          {getFileIcon(file.type)}
819|                        </span>
820|                        <p style={{ margin: 0, fontWeight: '600', fontSize: '1.125rem' }}>{file.name}</p>
821|                      </div>
822|                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
823|                        <span style={{
824|                          fontSize: '0.875rem',
825|                          padding: '0.25rem 0.75rem',
826|                          borderRadius: '1rem',
827|                          ...getCategoryColor(file.category)
828|                        }}>
829|                          {getCategoryIcon(file.category)} {
830|                            file.category === 'report' ? 'Rapor' :
831|                            file.category === 'certificate' ? 'Sertifika' :
832|                            file.category === 'form' ? 'Form' : 'Belge'
833|                          }
834|                        </span>
835|                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
836|                          {formatFileSize(file.size)}
837|                        </span>
838|                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
839|                          {new Date(file.uploadDate).toLocaleDateString('tr-TR')}
840|                        </span>
841|                      </div>
842|                    </div>
843|                  </div>
844|                  <div style={{ display: 'flex', gap: '0.5rem' }}>
845|                    <a
846|                      href={file.content}
847|                      download={file.name}
848|                      style={{
849|                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
850|                        color: 'white',
851|                        textDecoration: 'none',
852|                        padding: '0.75rem 1.5rem',
853|                        borderRadius: '0.5rem',
854|                        fontSize: '0.875rem',
855|                        fontWeight: '500',
856|                        display: 'flex',
857|                        alignItems: 'center',
858|                        gap: '0.5rem'
859|                      }}
860|                    >
861|                      ⬇️ İndir
862|                    </a>
863|                  </div>
864|                </div>
865|              ))}
866|            </div>
867|          </div>
868|        </div>
869|      )}
870|    </div>
871|  );
872|};
873|
874|const FileUpload = ({ user, onFileUpload }) => {
875|  const [dragActive, setDragActive] = useState(false);
876|  const [selectedFiles, setSelectedFiles] = useState([]);
877|  const [uploadProgress, setUploadProgress] = useState(0);
878|  const [isUploading, setIsUploading] = useState(false);
879|  const [uploadedFiles, setUploadedFiles] = useState([]);
880|  const [folders, setFolders] = useState([]);
881|  const [currentFolder, setCurrentFolder] = useState(null);
882|  const [newFolderName, setNewFolderName] = useState('');
883|  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
884|  const [breadcrumb, setBreadcrumb] = useState([]);
885|
886|  useEffect(() => {
887|    // Load customer's own uploaded files in current folder
888|    const files = getFilesFromStorage(user.id, 'customer', currentFolder);
889|    setUploadedFiles(files);
890|    
891|    // Load folders for current directory
892|    const customerFolders = getFoldersFromStorage(user.id, currentFolder);
893|    setFolders(customerFolders);
894|    
895|    // Update breadcrumb
896|    updateBreadcrumb(currentFolder);
897|  }, [user.id, currentFolder]);
898|
899|  const updateBreadcrumb = (folderId) => {
900|    if (!folderId) {
901|      setBreadcrumb([]);
902|      return;
903|    }
904|    
905|    const allFolders = getFoldersFromStorage(user.id);
906|    const path = [];
907|    let currentId = folderId;
908|    
909|    while (currentId) {
910|      const folder = allFolders.find(f => f.id === currentId);
911|      if (folder) {
912|        path.unshift(folder);
913|        currentId = folder.parentId;
914|      } else {
915|        break;
916|      }
917|    }
918|    
919|    setBreadcrumb(path);
920|  };
921|
922|  const navigateToFolder = (folderId) => {
923|    setCurrentFolder(folderId);
924|  };
925|
926|  const createNewFolder = () => {
927|    if (newFolderName.trim()) {
928|      saveFolderToStorage(newFolderName.trim(), user.id, currentFolder);
929|      setNewFolderName('');
930|      setShowNewFolderInput(false);
931|      
932|      // Refresh folders
933|      const customerFolders = getFoldersFromStorage(user.id, currentFolder);
934|      setFolders(customerFolders);
935|    }
936|  };
937|
938|  const handleDrag = (e) => {
939|    e.preventDefault();
940|    e.stopPropagation();
941|    if (e.type === "dragenter" || e.type === "dragover") {
942|      setDragActive(true);
943|    } else if (e.type === "dragleave") {
944|      setDragActive(false);
945|    }
946|  };
947|
948|  const handleDrop = (e) => {
949|    e.preventDefault();
950|    e.stopPropagation();
951|    setDragActive(false);
952|    
953|    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
954|      const files = Array.from(e.dataTransfer.files);
955|      handleFileSelect(files);
956|    }
957|  };
958|
959|  const handleFileInputChange = (e) => {
960|    if (e.target.files && e.target.files[0]) {
961|      const files = Array.from(e.target.files);
962|      handleFileSelect(files);
963|    }
964|  };
965|
966|  const handleFileSelect = (files) => {
967|    const allowedTypes = [
968|      'application/pdf',
969|      'application/msword',
970|      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
971|      'application/vnd.ms-excel',
972|      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
973|      'image/jpeg',
974|      'image/png',
975|      'image/jpg',
976|      'application/zip',
977|      'application/x-zip-compressed'
978|    ];
979|
980|    const validFiles = files.filter(file => {
981|      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.zip')) {
982|        alert(`${file.name} desteklenmeyen dosya türü!`);
983|        return false;
984|      }
985|      
986|      // ZIP dosyası için 500MB, diğerleri için 10MB
987|      const maxSize = file.name.toLowerCase().endsWith('.zip') ? 500 * 1024 * 1024 : 10 * 1024 * 1024;
988|      if (file.size > maxSize) {
989|        const maxSizeMB = file.name.toLowerCase().endsWith('.zip') ? 500 : 10;
990|        alert(`${file.name} çok büyük! Maksimum ${maxSizeMB}MB`);
991|        return false;
992|      }
993|      return true;
994|    });
995|
996|    setSelectedFiles(validFiles);
997|  };
998|
999|  const handleUpload = async () => {
1000|    if (selectedFiles.length === 0) return;
1001|
1002|    setIsUploading(true);
1003|    setUploadProgress(0);
1004|
1005|    try {
1006|      for (let i = 0; i < selectedFiles.length; i++) {
1007|        const file = selectedFiles[i];
1008|        
1009|        for (let progress = 0; progress <= 100; progress += 20) {
1010|          setUploadProgress(((i * 100) + progress) / selectedFiles.length);
1011|          await new Promise(resolve => setTimeout(resolve, 100));
1012|        }
1013|
1014|        const savedFile = await saveFileToStorage(file, user.id, 'customer', 'general', currentFolder);
1015|        setUploadedFiles(prev => [...prev, savedFile]);
1016|      }
1017|
1018|      setSelectedFiles([]);
1019|      setUploadProgress(100);
1020|      alert('Dosyalar başarıyla yüklendi!');
1021|      
1022|      if (onFileUpload) {
1023|        onFileUpload(selectedFiles);
1024|      }
1025|    } catch (error) {
1026|      alert('Dosya yükleme hatası!');
1027|    } finally {
1028|      setIsUploading(false);
1029|      setUploadProgress(0);
1030|    }
1031|  };
1032|
1033|  const handleDeleteFile = (fileId) => {
1034|    if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
1035|      deleteFileFromStorage(fileId);
1036|      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
1037|    }
1038|  };
1039|
1040|  const handleDeleteFolder = (folderId) => {
1041|    if (confirm('Bu klasörü ve içindeki tüm dosyaları silmek istediğinizden emin misiniz?')) {
1042|      deleteFolderFromStorage(folderId);
1043|      setFolders(prev => prev.filter(f => f.id !== folderId));
1044|      setUploadedFiles(prev => prev.filter(f => f.folderId !== folderId));
1045|    }
1046|  };
1047|
1048|  const formatFileSize = (bytes) => {
1049|    if (bytes === 0) return '0 Bytes';
1050|    const k = 1024;
1051|    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
1052|    const i = Math.floor(Math.log(bytes) / Math.log(k));
1053|    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
1054|  };
1055|
1056|  const getFileIcon = (type) => {
1057|    if (type.includes('pdf')) return '📄';
1058|    if (type.includes('word') || type.includes('document')) return '📝';
1059|    if (type.includes('excel') || type.includes('sheet')) return '📊';
1060|    if (type.includes('image')) return '🖼️';
1061|    if (type.includes('zip')) return '🗜️';
1062|    return '📎';
1063|  };
1064|
1065|  return (
1066|    <div style={{ maxWidth: '4xl', margin: '0 auto', padding: '2rem' }}>
1067|      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>📁 Belge Yükleme</h1>
1068|      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
1069|        Danışmanlık süreciniz için gerekli belgeleri yükleyin (ZIP desteği: 500MB'a kadar!)
1070|      </p>
1071|
1072|      {/* Breadcrumb & Navigation */}
1073|      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
1074|        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
1075|          <button
1076|            onClick={() => navigateToFolder(null)}
1077|            style={{
1078|              background: currentFolder ? '#f3f4f6' : '#e5e7eb',
1079|              border: 'none',
1080|              padding: '0.5rem 1rem',
1081|              borderRadius: '0.5rem',
1082|              cursor: currentFolder ? 'pointer' : 'not-allowed',
1083|              fontSize: '0.875rem'
1084|            }}
1085|            disabled={!currentFolder}
1086|          >
1087|            🏠 Ana Sayfa
1088|          </button>
1089|          
1090|          {breadcrumb.map((folder, index) => (
1091|            <React.Fragment key={folder.id}>
1092|              <span style={{ color: '#6b7280' }}>{'>'}</span>
1093|              <button
1094|                onClick={() => navigateToFolder(folder.id)}
1095|                style={{
1096|                  background: index === breadcrumb.length - 1 ? '#e5e7eb' : '#f3f4f6',
1097|                  border: 'none',
1098|                  padding: '0.5rem 1rem',
1099|                  borderRadius: '0.5rem',
1100|                  cursor: index === breadcrumb.length - 1 ? 'not-allowed' : 'pointer',
1101|                  fontSize: '0.875rem'
1102|                }}
1103|                disabled={index === breadcrumb.length - 1}
1104|              >
1105|                📁 {folder.name}
1106|              </button>
1107|            </React.Fragment>
1108|          ))}
1109|        </div>
1110|
1111|        {/* New Folder Button */}
1112|        <button
1113|          onClick={() => setShowNewFolderInput(true)}
1114|          style={{
1115|            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
1116|            color: 'white',
1117|            border: 'none',
1118|            padding: '0.5rem 1rem',
1119|            borderRadius: '0.5rem',
1120|            cursor: 'pointer',
1121|            fontSize: '0.875rem',
1122|            fontWeight: '500'
1123|          }}
1124|        >
1125|          📁 Yeni Klasör
1126|        </button>
1127|      </div>
1128|
1129|      {/* New Folder Input */}
1130|      {showNewFolderInput && (
1131|        <div style={{
1132|          background: '#fef3c7',
1133|          padding: '1rem',
1134|          borderRadius: '0.5rem',
1135|          marginBottom: '1rem',
1136|          display: 'flex',
1137|          gap: '0.5rem',
1138|          alignItems: 'center'
1139|        }}>
1140|          <input
1141|            type="text"
1142|            value={newFolderName}
1143|            onChange={(e) => setNewFolderName(e.target.value)}
1144|            placeholder="Klasör adı"
1145|            style={{
1146|              flex: 1,
1147|              padding: '0.5rem',
1148|              border: '1px solid #d1d5db',
1149|              borderRadius: '0.25rem'
1150|            }}
1151|          />
1152|          <button
1153|            onClick={createNewFolder}
1154|            style={{
1155|              background: '#10b981',
1156|              color: 'white',
1157|              border: 'none',
1158|              padding: '0.5rem 1rem',
1159|              borderRadius: '0.25rem',
1160|              cursor: 'pointer'
1161|            }}
1162|          >
1163|            Oluştur
1164|          </button>
1165|          <button
1166|            onClick={() => {
1167|              setShowNewFolderInput(false);
1168|              setNewFolderName('');
1169|            }}
1170|            style={{
1171|              background: '#ef4444',
1172|              color: 'white',
1173|              border: 'none',
1174|              padding: '0.5rem 1rem',
1175|              borderRadius: '0.25rem',
1176|              cursor: 'pointer'
1177|            }}
1178|          >
1179|            İptal
1180|          </button>
1181|        </div>
1182|      )}
1183|
1184|      {/* Upload Area */}
1185|      <div style={{
1186|        background: 'white',
1187|        borderRadius: '1rem',
1188|        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
1189|        padding: '2rem',
1190|        marginBottom: '2rem'
1191|      }}>
1192|        <div
1193|          style={{
1194|            border: dragActive ? '2px dashed #10b981' : '2px dashed #d1d5db',
1195|            borderRadius: '0.75rem',
1196|            padding: '2rem',
1197|            textAlign: 'center',
1198|            background: dragActive ? '#f0fdf4' : '#fafafa',
1199|            transition: 'all 0.3s ease'
1200|          }}
1201|          onDragEnter={handleDrag}
1202|          onDragLeave={handleDrag}
1203|          onDragOver={handleDrag}
1204|          onDrop={handleDrop}
1205|        >
1206|          <input
1207|            type="file"
1208|            multiple
1209|            onChange={handleFileInputChange}
1210|            style={{ display: 'none' }}
1211|            id="file-upload"
1212|            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
1213|          />
1214|          
1215|          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
1216|          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
1217|            Dosyalarınızı buraya sürükleyin
1218|          </h3>
1219|          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
1220|            veya dosya seçmek için tıklayın
1221|          </p>
1222|          <label
1223|            htmlFor="file-upload"
1224|            style={{
1225|              background: 'linear-gradient(135deg, #10b981, #059669)',
1226|              color: 'white',
1227|              padding: '0.75rem 1.5rem',
1228|              borderRadius: '0.5rem',
1229|              cursor: 'pointer',
1230|              border: 'none',
1231|              fontWeight: '500',
1232|              display: 'inline-block'
1233|            }}
1234|          >
1235|            📎 Dosya Seç
1236|          </label>
1237|          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
1238|            PDF, Word, Excel, Resim, ZIP (Maks. 10MB, ZIP için 500MB)
1239|          </p>
1240|        </div>
1241|
1242|        {/* Selected Files */}
1243|        {selectedFiles.length > 0 && (
1244|          <div style={{ marginTop: '1.5rem' }}>
1245|            <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Seçilen Dosyalar:</h4>
1246|            <div style={{ space: '0.75rem' }}>
1247|              {selectedFiles.map((file, index) => (
1248|                <div key={index} style={{
1249|                  display: 'flex',
1250|                  alignItems: 'center',
1251|                  justifyContent: 'space-between',
1252|                  background: '#f9fafb',
1253|                  padding: '0.75rem',
1254|                  borderRadius: '0.5rem',
1255|                  marginBottom: '0.5rem'
1256|                }}>
1257|                  <div style={{ display: 'flex', alignItems: 'center' }}>
1258|                    <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
1259|                      {getFileIcon(file.type)}
1260|                    </span>
1261|                    <div>
1262|                      <p style={{ margin: 0, fontWeight: '500' }}>{file.name}</p>
1263|                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
1264|                        {formatFileSize(file.size)}
1265|                      </p>
1266|                    </div>
1267|                  </div>
1268|                  <button
1269|                    onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
1270|                    style={{
1271|                      background: '#ef4444',
1272|                      color: 'white',
1273|                      border: 'none',
1274|                      borderRadius: '0.25rem',
1275|                      padding: '0.25rem 0.5rem',
1276|                      cursor: 'pointer',
1277|                      fontSize: '0.75rem'
1278|                    }}
1279|                  >
1280|                    ❌
1281|                  </button>
1282|                </div>
1283|              ))}
1284|            </div>
1285|
1286|            {/* Upload Progress */}
1287|            {isUploading && (
1288|              <div style={{ marginTop: '1rem' }}>
1289|                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
1290|                  <span>Yükleniyor...</span>
1291|                  <span>{Math.round(uploadProgress)}%</span>
1292|                </div>
1293|                <div style={{
1294|                  width: '100%',
1295|                  background: '#e5e7eb',
1296|                  borderRadius: '0.25rem',
1297|                  height: '0.5rem'
1298|                }}>
1299|                  <div style={{
1300|                    background: 'linear-gradient(135deg, #10b981, #059669)',
1301|                    height: '100%',
1302|                    borderRadius: '0.25rem',
1303|                    width: `${uploadProgress}%`,
1304|                    transition: 'width 0.3s ease'
1305|                  }}></div>
1306|                </div>
1307|              </div>
1308|            )}
1309|
1310|            <button
1311|              onClick={handleUpload}
1312|              disabled={isUploading}
1313|              style={{
1314|                width: '100%',
1315|                background: isUploading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
1316|                color: 'white',
1317|                border: 'none',
1318|                padding: '0.75rem',
1319|                borderRadius: '0.5rem',
1320|                fontWeight: '500',
1321|                cursor: isUploading ? 'not-allowed' : 'pointer',
1322|                marginTop: '1rem'
1323|              }}
1324|            >
1325|              {isUploading ? '⏳ Yükleniyor...' : '🚀 Dosyaları Yükle'}
1326|            </button>
1327|          </div>
1328|        )}
1329|      </div>
1330|
1331|      {/* Folders and Files List */}
1332|      {(folders.length > 0 || uploadedFiles.length > 0) && (
1333|        <div style={{
1334|          background: 'white',
1335|          borderRadius: '1rem',
1336|          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
1337|          padding: '2rem'
1338|        }}>
1339|          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
1340|            📋 Dosyalarınız ({folders.length + uploadedFiles.length})
1341|          </h3>
1342|          <div style={{ space: '0.75rem' }}>
1343|            {/* Klasörler */}
1344|            {folders.map((folder) => (
1345|              <div key={folder.id} style={{
1346|                display: 'flex',
1347|                alignItems: 'center',
1348|                justifyContent: 'space-between',
1349|                background: '#fffbeb',
1350|                padding: '1rem',
1351|                borderRadius: '0.5rem',
1352|                marginBottom: '0.75rem',
1353|                border: '1px solid #fde68a'
1354|              }}>
1355|                <div 
1356|                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }}
1357|                  onClick={() => navigateToFolder(folder.id)}
1358|                >
1359|                  <span style={{ fontSize: '2rem', marginRight: '1rem' }}>📁</span>
1360|                  <div>
1361|                    <p style={{ margin: 0, fontWeight: '500' }}>{folder.name}</p>
1362|                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
1363|                      {new Date(folder.createdDate).toLocaleDateString('tr-TR')}
1364|                    </p>
1365|                  </div>
1366|                </div>
1367|                <button
1368|                  onClick={() => handleDeleteFolder(folder.id)}
1369|                  style={{
1370|                    background: '#ef4444',
1371|                    color: 'white',
1372|                    border: 'none',
1373|                    borderRadius: '0.25rem',
1374|                    padding: '0.25rem 0.75rem',
1375|                    cursor: 'pointer',
1376|                    fontSize: '0.875rem'
1377|                  }}
1378|                >
1379|                  🗑️ Sil
1380|                </button>
1381|              </div>
1382|            ))}
1383|
1384|            {/* Dosyalar */}
1385|            {uploadedFiles.map((file) => (
1386|              <div key={file.id} style={{
1387|                display: 'flex',
1388|                alignItems: 'center',
1389|                justifyContent: 'space-between',
1390|                background: '#f9fafb',
1391|                padding: '1rem',
1392|                borderRadius: '0.5rem',
1393|                marginBottom: '0.75rem',
1394|                border: '1px solid #e5e7eb'
1395|              }}>
1396|                <div style={{ display: 'flex', alignItems: 'center' }}>
1397|                  <span style={{ fontSize: '2rem', marginRight: '1rem' }}>
1398|                    {getFileIcon(file.type)}
1399|                  </span>
1400|                  <div>
1401|                    <p style={{ margin: 0, fontWeight: '500' }}>{file.name}</p>
1402|                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
1403|                      {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString('tr-TR')}
1404|                    </p>
1405|                  </div>
1406|                </div>
1407|                <div style={{ display: 'flex', gap: '0.5rem' }}>
1408|                  <a
1409|                    href={file.content}
1410|                    download={file.name}
1411|                    style={{
1412|                      background: '#3b82f6',
1413|                      color: 'white',
1414|                      textDecoration: 'none',
1415|                      padding: '0.25rem 0.75rem',
1416|                      borderRadius: '0.25rem',
1417|                      fontSize: '0.875rem'
1418|                    }}
1419|                  >
1420|                    ⬇️ İndir
1421|                  </a>
1422|                  <button
1423|                    onClick={() => handleDeleteFile(file.id)}
1424|                    style={{
1425|                      background: '#ef4444',
1426|                      color: 'white',
1427|                      border: 'none',
1428|                      borderRadius: '0.25rem',
1429|                      padding: '0.25rem 0.75rem',
1430|                      cursor: 'pointer',
1431|                      fontSize: '0.875rem'
1432|                    }}
1433|                  >
1434|                    🗑️ Sil
1435|                  </button>
1436|                </div>
1437|              </div>
1438|            ))}
1439|          </div>
1440|        </div>
1441|      )}
1442|    </div>
1443|  );
1444|};
1445|
1446|const AdminDashboard = ({ user, onLogout }) => {
1447|  const [activeTab, setActiveTab] = useState('overview');
1448|  const [allFiles, setAllFiles] = useState([]);
1449|  const [allFolders, setAllFolders] = useState([]);
1450|  const [customers] = useState([
1451|    {
1452|      id: 'customer1',
1453|      companyName: 'Örnek Otel A.Ş.',
1454|      email: 'test@otel.com',
1455|      stage: 2,
1456|      startDate: '2024-01-15',
1457|      status: 'active'
1458|    },
1459|    {
1460|      id: 'customer2',
1461|      companyName: 'Grand Hotel Istanbul',
1462|      email: 'info@grandhotel.com',
1463|      stage: 1,
1464|      startDate: '2024-02-01',
1465|      status: 'active'
1466|    }
1467|  ]);
1468|
1469|  useEffect(() => {
1470|    const files = getFilesFromStorage();
1471|    setAllFiles(files);
1472|    const folders = getFoldersFromStorage();
1473|    setAllFolders(folders);
1474|  }, [activeTab]);
1475|
1476|  const refreshFiles = () => {
1477|    const files = getFilesFromStorage();
1478|    setAllFiles(files);
1479|    const folders = getFoldersFromStorage();
1480|    setAllFolders(folders);
1481|  };
1482|
1483|  const getCustomerName = (userId) => {
1484|    const customer = customers.find(c => c.id === userId);
1485|    return customer ? customer.companyName : 'Bilinmeyen Müşteri';
1486|  };
1487|
1488|  const getFileIcon = (type) => {
1489|    if (type.includes('pdf')) return '📄';
1490|    if (type.includes('word') || type.includes('document')) return '📝';
1491|    if (type.includes('excel') || type.includes('sheet')) return '📊';
1492|    if (type.includes('image')) return '🖼️';
1493|    if (type.includes('zip')) return '🗜️';
1494|    return '📎';
1495|  };
1496|
1497|  const formatFileSize = (bytes) => {
1498|    if (bytes === 0) return '0 Bytes';
1499|    const k = 1024;
1500|    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
1501|    const i = Math.floor(Math.log(bytes) / Math.log(k));
1502|    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
1503|  };
1504|
1505|  return (
1506|    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
1507|      {/* Admin Header */}
1508|      <header style={{
1509|        background: 'linear-gradient(135deg, #1e40af, #059669)',
1510|        color: 'white',
1511|        padding: '1rem 2rem',
1512|        display: 'flex',
1513|        justifyContent: 'space-between',
1514|        alignItems: 'center'
1515|      }}>
1516|        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
1517|          🛡️ ROTA <span style={{ color: '#fbbf24' }}>ADMIN v2.3</span>
1518|        </h1>
1519|        <div>
1520|          <span style={{ marginRight: '1rem' }}>👋 {user.name}</span>
1521|          <button
1522|            onClick={onLogout}
1523|            style={{
1524|              background: '#dc2626',
1525|              color: 'white',
1526|              border: 'none',
1527|              padding: '0.5rem 1rem',
1528|              borderRadius: '0.25rem',
1529|              cursor: 'pointer'
1530|            }}
1531|          >
1532|            🚪 Çıkış
1533|          </button>
1534|        </div>
1535|      </header>
1536|
1537|      {/* Admin Navigation */}
1538|      <nav style={{
1539|        background: 'white',
1540|        padding: '0 2rem',
1541|        borderBottom: '1px solid #e5e7eb',
1542|        display: 'flex',
1543|        gap: '2rem'
1544|      }}>
1545|        {[
1546|          { id: 'overview', label: '📊 Genel Bakış' },
1547|          { id: 'customers', label: '👥 Müşteriler' },
1548|          { id: 'send-files', label: '📤 Dosya Gönder' },
1549|          { id: 'files', label: '📁 Tüm Dosyalar' }
1550|        ].map(tab => (
1551|          <button
1552|            key={tab.id}
1553|            onClick={() => setActiveTab(tab.id)}
1554|            style={{
1555|              padding: '1rem 0',
1556|              border: 'none',
1557|              background: 'none',
1558|              color: activeTab === tab.id ? '#059669' : '#6b7280',
1559|              borderBottom: activeTab === tab.id ? '2px solid #059669' : '2px solid transparent',
1560|              fontWeight: activeTab === tab.id ? '600' : '400',
1561|              cursor: 'pointer'
1562|            }}
1563|          >
1564|            {tab.label}
1565|          </button>
1566|        ))}
1567|      </nav>
1568|
1569|      {/* Admin Content */}
1570|      <main style={{ padding: '2rem' }}>
1571|        {activeTab === 'overview' && (
1572|          <div>
1573|            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📊 Genel Bakış</h2>
1574|            
1575|            <div style={{
1576|              display: 'grid',
1577|              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
1578|              gap: '1.5rem',
1579|              marginBottom: '2rem'
1580|            }}>
1581|              <div style={{
1582|                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
1583|                color: 'white',
1584|                padding: '1.5rem',
1585|                borderRadius: '0.75rem',
1586|                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
1587|              }}>
1588|                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>👥 Toplam Müşteri</h3>
1589|                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{customers.length}</p>
1590|              </div>
1591|
1592|              <div style={{
1593|                background: 'linear-gradient(135deg, #10b981, #059669)',
1594|                color: 'white',
1595|                padding: '1.5rem',
1596|                borderRadius: '0.75rem',
1597|                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
1598|              }}>
1599|                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>📁 Toplam Dosya</h3>
1600|                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{allFiles.length}</p>
1601|              </div>
1602|
1603|              <div style={{
1604|                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
1605|                color: 'white',
1606|                padding: '1.5rem',
1607|                borderRadius: '0.75rem',
1608|                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
1609|              }}>
1610|                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>📤 Gönderilen</h3>
1611|                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
1612|                  {allFiles.filter(f => f.uploadedBy === 'admin').length}
1613|                </p>
1614|              </div>
1615|
1616|              <div style={{
1617|                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
1618|                color: 'white',
1619|                padding: '1.5rem',
1620|                borderRadius: '0.75rem',
1621|                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
1622|              }}>
1623|                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>📁 Klasörler</h3>
1624|                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
1625|                  {allFolders.length}
1626|                </p>
1627|              </div>
1628|            </div>
1629|
1630|            <div style={{
1631|              background: 'white',
1632|              padding: '1.5rem',
1633|              borderRadius: '0.75rem',
1634|              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
1635|            }}>
1636|              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🚀 v2.3 YENİ ÖZELLİKLER!</h3>
1637|              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
1638|                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
1639|                  <strong>🌿 Sürdürülebilir Turizm Sistemi</strong><br/>
1640|                  <small>Otomatik klasör yapısı oluşturma!</small>
1641|                </div>
1642|                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem' }}>
1643|                  <strong>📁 Hiyerarşik Klasör Sistemi</strong><br/>
1644|                  <small>A, B, C, D sütunları ile organize!</small>
1645|                </div>
1646|                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
1647|                  <strong>🔄 Gelişmiş Navigasyon</strong><br/>
1648|                  <small>Breadcrumb ile kolay gezinme!</small>
1649|                </div>
1650|              </div>
1651|            </div>
1652|          </div>
1653|        )}
1654|
1655|        {activeTab === 'send-files' && (
1656|          <div>
1657|            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>📤 Müşterilere Dosya Gönder</h2>
1658|            <AdminSendFile customers={customers} onFileUpload={refreshFiles} />
1659|          </div>
1660|        )}
1661|
1662|        {activeTab === 'files' && (
1663|          <div>
1664|            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
1665|              📁 Tüm Dosyalar ({allFiles.length})
1666|            </h2>
1667|            
1668|            {allFiles.length === 0 ? (
1669|              <div style={{
1670|                background: 'white',
1671|                padding: '3rem',
1672|                borderRadius: '0.75rem',
1673|                textAlign: 'center',
1674|                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
1675|              }}>
1676|                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
1677|                <h3>Henüz dosya yüklenmemiş</h3>
1678|                <p style={{ color: '#6b7280' }}>Dosya yüklendiğinde burada görüntülenecek.</p>
1679|              </div>
1680|            ) : (
1681|              <div style={{
1682|                background: 'white',
1683|                borderRadius: '0.75rem',
1684|                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
1685|                overflow: 'hidden'
1686|              }}>
1687|                <div style={{ overflowX: 'auto' }}>
1688|                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
1689|                    <thead style={{ background: '#f9fafb' }}>
1690|                      <tr>
1691|                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📎 Dosya</th>
1692|                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>🏢 Müşteri</th>
1693|                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>👤 Yükleyen</th>
1694|                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📏 Boyut</th>
1695|                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📅 Tarih</th>
1696|                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>⚡ İşlemler</th>
1697|                      </tr>
1698|                    </thead>
1699|                    <tbody>
1700|                      {allFiles.map((file) => (
1701|                        <tr key={file.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
1702|                          <td style={{ padding: '1rem' }}>
1703|                            <div style={{ display: 'flex', alignItems: 'center' }}>
1704|                              <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
1705|                                {getFileIcon(file.type)}
1706|                              </span>
1707|                              <div>
1708|                                <p style={{ margin: 0, fontWeight: '500' }}>{file.name}</p>
1709|                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{file.type}</p>
1710|                              </div>
1711|                            </div>
1712|                          </td>
1713|                          <td style={{ padding: '1rem' }}>
1714|                            <span style={{ 
1715|                              background: '#e0f2fe',
1716|                              color: '#0369a1',
1717|                              padding: '0.25rem 0.5rem',
1718|                              borderRadius: '0.25rem',
1719|                              fontSize: '0.875rem'
1720|                            }}>
1721|                              {getCustomerName(file.userId)}
1722|                            </span>
1723|                          </td>
1724|                          <td style={{ padding: '1rem' }}>
1725|                            <span style={{
1726|                              background: file.uploadedBy === 'admin' ? '#f0fdf4' : '#fef3c7',
1727|                              color: file.uploadedBy === 'admin' ? '#166534' : '#92400e',
1728|                              padding: '0.25rem 0.5rem',
1729|                              borderRadius: '0.25rem',
1730|                              fontSize: '0.875rem'
1731|                            }}>
1732|                              {file.uploadedBy === 'admin' ? '🛡️ Admin' : '👤 Müşteri'}
1733|                            </span>
1734|                          </td>
1735|                          <td style={{ padding: '1rem', color: '#6b7280' }}>
1736|                            {formatFileSize(file.size)}
1737|                          </td>
1738|                          <td style={{ padding: '1rem', color: '#6b7280' }}>
1739|                            {new Date(file.uploadDate).toLocaleString('tr-TR')}
1740|                          </td>
1741|                          <td style={{ padding: '1rem' }}>
1742|                            <div style={{ display: 'flex', gap: '0.5rem' }}>
1743|                              <a
1744|                                href={file.content}
1745|                                download={file.name}
1746|                                style={{
1747|                                  background: '#3b82f6',
1748|                                  color: 'white',
1749|                                  textDecoration: 'none',
1750|                                  padding: '0.25rem 0.75rem',
1751|                                  borderRadius: '0.25rem',
1752|                                  fontSize: '0.75rem'
1753|                                }}
1754|                              >
1755|                                ⬇️ İndir
1756|                              </a>
1757|                              <button
1758|                                onClick={() => {
1759|                                  if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
1760|                                    deleteFileFromStorage(file.id);
1761|                                    setAllFiles(prev => prev.filter(f => f.id !== file.id));
1762|                                  }
1763|                                }}
1764|                                style={{
1765|                                  background: '#ef4444',
1766|                                  color: 'white',
1767|                                  border: 'none',
1768|                                  borderRadius: '0.25rem',
1769|                                  padding: '0.25rem 0.75rem',
1770|                                  cursor: 'pointer',
1771|                                  fontSize: '0.75rem'
1772|                                }}
1773|                              >
1774|                                🗑️ Sil
1775|                              </button>
1776|     <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>

