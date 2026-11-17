import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
};

// Activities
export const activityService = {
  getAll: (params) => api.get('/activities', { params }),
  getById: (id) => api.get(`/activities/${id}`),
  create: (data) => api.post('/activities', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/activities/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/activities/${id}`),
  getStats: () => api.get('/activities/stats'),
};

// Applications
export const applicationService = {
  apply: (activityId, data) => api.post(`/applications/activity/${activityId}`, data),
  getMyApplications: () => api.get('/applications/my'),
  cancel: (id) => api.delete(`/applications/${id}`),
  getAll: (params) => api.get('/applications', { params }),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  getStats: () => api.get('/applications/stats/overview'),
};

// Attendance
export const attendanceService = {
  getMyAttendance: () => api.get('/attendance/my'),
  getActivityAttendance: (activityId) => api.get(`/attendance/activity/${activityId}`),
  markAttendance: (data) => api.post('/attendance/mark', data),
  getStats: () => api.get('/attendance/stats'),
};

// Certificates
export const certificateService = {
  getMyCertificates: () => api.get('/certificates/my'),
  getAll: () => api.get('/certificates'),
  verify: (certId) => api.get(`/certificates/verify/${certId}`),
};

// Volunteers
export const volunteerService = {
  getAll: (params) => api.get('/volunteers', { params }),
  getById: (id) => api.get(`/volunteers/${id}`),
  toggleStatus: (id) => api.put(`/volunteers/${id}/toggle-status`),
  getStats: () => api.get('/volunteers/stats'),
};

// Contact
export const contactService = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  markRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

// Reports
export const reportService = {
  getAdminDashboard: () => api.get('/reports/admin-dashboard'),
  getVolunteerDashboard: () => api.get('/reports/volunteer-dashboard'),
};
