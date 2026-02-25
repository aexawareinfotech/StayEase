import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const apis = axios.create({
    baseURL: API_URL,
});

// Request interceptor to attach JWT token
apis.interceptors.request.use(
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

export const authService = {
    login: (credentials) => apis.post('/auth/login', credentials),
    register: (userData) => apis.post('/auth/register', userData),
    forgotPassword: (email) => apis.post('/auth/reset-password', { email }),
};

export const roomService = {
    getAllRooms: () => apis.get('/rooms'),
    searchRooms: (params) => apis.get('/rooms/search', { params }),
    getRoomDetails: (id) => apis.get(`/rooms/${id}`),
};

export const bookingService = {
    createBooking: (data) => apis.post('/bookings', data),
    getMyBookings: () => apis.get('/bookings/my'),
    cancelBooking: (id) => apis.put(`/bookings/${id}/cancel`),
    payBooking: (id, paymentMethod) => apis.put(`/bookings/${id}/pay`, { paymentMethod }),
};

export const adminService = {
    getDashboardStats: () => apis.get('/admin/dashboard'),
    getAllBookings: () => apis.get('/admin/bookings'),
    updateBookingStatus: (id, status) => apis.put(`/admin/bookings/${id}/status`, { status }),
    getAllRooms: () => apis.get('/rooms'),
    createRoom: (data) => apis.post('/rooms', data),
    updateRoom: (id, data) => apis.put(`/rooms/${id}`, data),
    deleteRoom: (id) => apis.delete(`/rooms/${id}`),
    getOccupancyReport: (params) => apis.get('/admin/reports/occupancy', { params }),
    getRevenueReport: (params) => apis.get('/admin/reports/revenue', { params }),
};

export default apis;
