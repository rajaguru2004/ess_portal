import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Unauthorized - clear token and redirect to login
                    this.clearAuth();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }

    private clearAuth(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    }

    // Auth endpoints
    async login(username: string, password: string) {
        const response = await this.client.post('/api/v1/auth/login', {
            username,
            password,
        });
        return response.data;
    }

    // Role endpoints
    async getRoles() {
        const response = await this.client.get('/api/v1/roles');
        return response.data;
    }

    async createRole(data: any) {
        const response = await this.client.post('/api/v1/roles', data);
        return response.data;
    }

    // Department endpoints
    async getDepartments() {
        const response = await this.client.get('/api/v1/departments');
        return response.data;
    }

    async createDepartment(data: any) {
        const response = await this.client.post('/api/v1/departments', data);
        return response.data;
    }

    // Shift endpoints
    async getShifts() {
        const response = await this.client.get('/api/v1/shifts');
        return response.data;
    }

    async createShift(data: any) {
        const response = await this.client.post('/api/v1/shifts', data);
        return response.data;
    }

    // Leave Type endpoints
    async getLeaveTypes() {
        const response = await this.client.get('/api/v1/leave-types');
        return response.data;
    }

    async createLeaveType(data: any) {
        const response = await this.client.post('/api/v1/leave-types', data);
        return response.data;
    }

    // Holiday endpoints
    async getHolidays() {
        const response = await this.client.get('/api/v1/holidays');
        return response.data;
    }

    async createHoliday(data: any) {
        const response = await this.client.post('/api/v1/holidays', data);
        return response.data;
    }

    // Designation endpoints
    async getDesignations() {
        const response = await this.client.get('/api/v1/designations');
        return response.data;
    }

    async createDesignation(data: any) {
        const response = await this.client.post('/api/v1/designations', data);
        return response.data;
    }

    // Role Leave Policy endpoints
    async getRoleLeavePolicies() {
        const response = await this.client.get('/api/v1/role-leave-policies');
        return response.data;
    }

    async createRoleLeavePolicy(data: any) {
        const response = await this.client.post('/api/v1/role-leave-policies', data);
        return response.data;
    }

    // User endpoints
    async getUsers() {
        const response = await this.client.get('/api/v1/users');
        return response.data;
    }

    async createUser(data: any) {
        const response = await this.client.post('/api/v1/users', data);
        return response.data;
    }

    // Attendance endpoints
    async getAttendanceLogs(startDate?: string, endDate?: string) {
        const params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await this.client.get('/api/v1/attendance/logs', { params });
        return response.data;
    }

    // Shift Assignment endpoints
    async getShiftAssignments(status?: string, date?: string, userId?: string) {
        const params: any = {};
        if (status) params.status = status;
        if (date) params.date = date;
        if (userId) params.userId = userId;

        const response = await this.client.get('/api/v1/shift-assignments', { params });
        return response.data;
    }

    async createShiftAssignment(data: any) {
        const response = await this.client.post('/api/v1/shift-assignments', data);
        return response.data;
    }

    async approveShiftAssignment(id: string) {
        const response = await this.client.post(`/api/v1/shift-assignments/${id}/approve`);
        return response.data;
    }

    async rejectShiftAssignment(id: string, reason: string) {
        const response = await this.client.post(`/api/v1/shift-assignments/${id}/reject`, { reason });
        return response.data;
    }

    async removeShiftAssignment(id: string) {
        const response = await this.client.delete(`/api/v1/shift-assignments/${id}`);
        return response.data;
    }
}

const apiClient = new ApiClient();
export default apiClient;
