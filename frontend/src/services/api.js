import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const apis = axios.create({
    baseURL: API_URL,
});

// Request interceptor to attach JWT token
apis.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => apis.post('/auth/login', credentials),
    register: (userData) => apis.post('/auth/register', userData),
    resetPassword: (email, newPassword) => apis.put('/auth/reset-password', { email, newPassword }),
};

export const roomService = {
    getAllRooms: (params) => apis.get('/rooms', { params }),
    searchRooms: (params) => apis.get('/rooms/search', { params }),
    getRoomDetails: (id) => apis.get(`/rooms/${id}`),
};

export const bookingService = {
    createBooking: (data) => apis.post('/bookings', data),
    getMyBookings: () => apis.get('/bookings/my'),
    cancelBooking: (id) => apis.put(`/bookings/${id}/cancel`),
    payBooking: (id, paymentMethod, transactionId) => apis.put(`/bookings/${id}/pay`, { paymentMethod, transactionId }),
};

export const adminService = {
    getDashboardStats: () => apis.get('/admin/dashboard'),
    getAllBookings: (params) => apis.get('/admin/bookings', { params }),
    updateBookingStatus: (id, status) => apis.put(`/admin/bookings/${id}/status`, { status }),
    getAllRooms: () => apis.get('/admin/rooms'),
    createRoom: (data) => apis.post('/admin/rooms', data),
    updateRoom: (id, data) => apis.put(`/admin/rooms/${id}`, data),
    deleteRoom: (id) => apis.delete(`/admin/rooms/${id}`),
    getOccupancyReport: (params) => apis.get('/admin/reports/occupancy', { params }),
    getRevenueReport: (params) => apis.get('/admin/reports/revenue', { params }),
    getReports: (params) => apis.get('/admin/reports', { params }),
    getNotifications: () => apis.get('/admin/notifications'),
    markNotificationRead: (id) => apis.put(`/admin/notifications/${id}/read`),
    getAllUsers: () => apis.get('/admin/users'),
    getLogs: () => apis.get('/admin/logs'),
};

export const emailService = {
    getMyEmails: () => apis.get('/emails/my'),
};

export default apis;
