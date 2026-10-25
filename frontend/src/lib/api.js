const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Add auth token if available in localStorage (browser only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('port_sin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    return { success: false, message: 'Gagal terhubung ke backend server API.' };
  }
};

export const uploadFileAPI = async (file) => {
  const url = `${API_BASE}/uploads`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('port_sin_token') : null;
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });
    return await res.json();
  } catch (err) {
    console.error('File Upload Error:', err);
    return { success: false, message: 'Gagal mengunggah file ke server.' };
  }
};

export const uploadMultipleFilesAPI = async (fileList) => {
  const url = `${API_BASE}/uploads/multiple`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('port_sin_token') : null;
  const formData = new FormData();
  for (let i = 0; i < fileList.length; i++) {
    formData.append('files', fileList[i]);
  }

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });
    return await res.json();
  } catch (err) {
    console.error('Multiple File Upload Error:', err);
    return { success: false, message: 'Gagal mengunggah berkas-berkas ke server.' };
  }
};

