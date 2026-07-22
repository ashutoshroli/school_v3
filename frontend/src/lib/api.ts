import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  loginSuperAdmin: (username: string, password: string) =>
    api.post('/auth/login/super-admin', { username, password }),
  
  loginUser: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  loginWithGoogle: () =>
    window.location.href = `${API_URL}/auth/google`,
  
  logout: () =>
    api.post('/auth/logout'),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data: any) =>
    api.put('/auth/profile', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
};

// Branches API
export const branchAPI = {
  list: () => api.get('/branches'),
  
  get: (id: string) => api.get(`/branches/${id}`),
  
  create: (data: any) => api.post('/branches', data),
  
  update: (id: string, data: any) => api.put(`/branches/${id}`, data),
  
  delete: (id: string) => api.delete(`/branches/${id}`),
  
  getSettings: (id: string) => api.get(`/branches/${id}/settings`),
  
  updateSettings: (id: string, data: any) => api.put(`/branches/${id}/settings`, data),
  
  getStats: (id: string) => api.get(`/branches/${id}/stats`),
};

// Students API
export const studentAPI = {
  list: (branchId: string, params?: any) =>
    api.get(`/branches/${branchId}/students`, { params }),
  
  get: (branchId: string, id: string) =>
    api.get(`/branches/${branchId}/students/${id}`),
  
  create: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/students`, data),
  
  update: (branchId: string, id: string, data: any) =>
    api.put(`/branches/${branchId}/students/${id}`, data),
  
  delete: (branchId: string, id: string) =>
    api.delete(`/branches/${branchId}/students/${id}`),
  
  assignRollNumber: (branchId: string, id: string) =>
    api.post(`/branches/${branchId}/students/${id}/assign-roll-number`),
};

// Staff API
export const staffAPI = {
  list: (branchId: string, params?: any) =>
    api.get(`/branches/${branchId}/staff`, { params }),
  
  get: (branchId: string, id: string) =>
    api.get(`/branches/${branchId}/staff/${id}`),
  
  create: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/staff`, data),
  
  update: (branchId: string, id: string, data: any) =>
    api.put(`/branches/${branchId}/staff/${id}`, data),
  
  delete: (branchId: string, id: string) =>
    api.delete(`/branches/${branchId}/staff/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getStudentAttendance: (branchId: string, studentId: string, params?: any) =>
    api.get(`/branches/${branchId}/attendance/student/${studentId}`, { params }),
  
  markStudentAttendance: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/attendance/student`, data),
  
  bulkMarkAttendance: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/attendance/student/bulk`, data),
  
  getStaffAttendance: (branchId: string, staffId: string, params?: any) =>
    api.get(`/branches/${branchId}/attendance/staff/${staffId}`, { params }),
  
  recordStaffRFID: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/attendance/staff/rfid`, data),
  
  getSummary: (branchId: string, params?: any) =>
    api.get(`/branches/${branchId}/attendance/summary`, { params }),
};

// Fee API
export const feeAPI = {
  getCategories: (branchId: string) =>
    api.get(`/branches/${branchId}/fees/categories`),
  
  createCategory: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/fees/categories`, data),
  
  getFeeStructure: (branchId: string, classId: string, academicYear?: string) =>
    api.get(`/branches/${branchId}/fees/structure/${classId}`, {
      params: { academicYear }
    }),
  
  setFeeStructure: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/fees/structure`, data),
  
  getStudentFees: (branchId: string, studentId: string, academicYear?: string) =>
    api.get(`/branches/${branchId}/fees/student/${studentId}`, {
      params: { academicYear }
    }),
  
  assignFee: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/fees/student`, data),
  
  getPaymentHistory: (branchId: string, studentId: string) =>
    api.get(`/branches/${branchId}/fees/payments/${studentId}`),
  
  recordPayment: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/fees/payments`, data),
  
  requestWaiver: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/fees/waiver`, data),
};

// Leave API
export const leaveAPI = {
  getTypes: (branchId: string) =>
    api.get(`/branches/${branchId}/leaves/types`),
  
  getBalance: (branchId: string, staffId: string, year?: number) =>
    api.get(`/branches/${branchId}/leaves/balance/${staffId}`, {
      params: { year }
    }),
  
  getRequests: (branchId: string, params?: any) =>
    api.get(`/branches/${branchId}/leaves`, { params }),
  
  applyLeave: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/leaves`, data),
  
  approveLeave: (branchId: string, leaveId: string, data: any) =>
    api.post(`/branches/${branchId}/leaves/${leaveId}/approve`, data),
};

// Exam API
export const examAPI = {
  getTypes: (branchId: string) =>
    api.get(`/branches/${branchId}/exams/types`),
  
  list: (branchId: string, params?: any) =>
    api.get(`/branches/${branchId}/exams`, { params }),
  
  create: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/exams`, data),
  
  updateStatus: (branchId: string, examId: string, status: string) =>
    api.put(`/branches/${branchId}/exams/${examId}/status`, { status }),
  
  getSchedule: (branchId: string, examId: string) =>
    api.get(`/branches/${branchId}/exams/${examId}/schedule`),
  
  addSchedule: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/exams/schedule`, data),
  
  getMarks: (branchId: string, scheduleId: string) =>
    api.get(`/branches/${branchId}/exams/schedule/${scheduleId}/marks`),
  
  enterMarks: (branchId: string, data: any) =>
    api.post(`/branches/${branchId}/exams/marks`, data),
  
  verifyMarks: (branchId: string, scheduleId: string, level: string) =>
    api.post(`/branches/${branchId}/exams/schedule/${scheduleId}/verify`, null, {
      params: { level }
    }),
  
  getReportCard: (branchId: string, examId: string, studentId: string) =>
    api.get(`/branches/${branchId}/exams/${examId}/report/${studentId}`),
};

// Dashboard API
export const dashboardAPI = {
  getSuperAdmin: () =>
    api.get('/branches/default/dashboard/super-admin'),
  
  getBranch: (branchId: string) =>
    api.get(`/branches/${branchId}/dashboard`),
  
  getTeacher: (branchId: string, staffId: string) =>
    api.get(`/branches/${branchId}/dashboard/teacher/${staffId}`),
  
  getStudent: (branchId: string, studentId: string) =>
    api.get(`/branches/${branchId}/dashboard/student/${studentId}`),
  
  getParent: (branchId: string, parentId: string) =>
    api.get(`/branches/${branchId}/dashboard/parent/${parentId}`),
};

export default api;
