/**
 * API Service Layer
 * Centralized service for all backend API calls
 * Handles authentication, error handling, and request/response formatting
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface ApiError {
  status: number;
  message: string;
  details?: any;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.token = token;
    try {
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    if (this.token) return this.token;
    try {
      this.token = localStorage.getItem('auth_token');
      return this.token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
    try {
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: error.detail || error.message || 'API Error',
          details: error,
        } as ApiError;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // ============ AUTH ENDPOINTS ============

  async register(email: string, password: string, fullName: string) {
    return this.post('/auth/register', {
      email,
      password,
      full_name: fullName,
    });
  }

  async login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  }

  // ============ DASHBOARD ENDPOINTS ============

  async getDashboardSummary() {
    return this.get('/dashboard/summary');
  }

  // ============ TRANSACTION ENDPOINTS ============

  async getTransactions(skip: number = 0, limit: number = 50) {
    return this.get(`/transactions?skip=${skip}&limit=${limit}`);
  }

  async createTransaction(data: any) {
    return this.post('/transactions', data);
  }

  async getTransaction(id: string) {
    return this.get(`/transactions/${id}`);
  }

  async updateTransaction(id: string, data: any) {
    return this.put(`/transactions/${id}`, data);
  }

  async deleteTransaction(id: string) {
    return this.delete(`/transactions/${id}`);
  }

  // ============ JAR ENDPOINTS ============

  async getJars() {
    return this.get('/jars');
  }

  async createJar(data: any) {
    return this.post('/jars', data);
  }

  async getJar(id: string) {
    return this.get(`/jars/${id}`);
  }

  async updateJar(id: string, data: any) {
    return this.put(`/jars/${id}`, data);
  }

  async deleteJar(id: string) {
    return this.delete(`/jars/${id}`);
  }

  async allocateJar(id: string, data: any) {
    return this.post(`/jars/${id}/allocate`, data);
  }

  async getJarRecommendations() {
    return this.get('/jars/recommendations');
  }

  // ============ GOAL ENDPOINTS ============

  async getGoals() {
    return this.get('/goals');
  }

  async createGoal(data: any) {
    return this.post('/goals', data);
  }

  async getGoal(id: string) {
    return this.get(`/goals/${id}`);
  }

  async updateGoal(id: string, data: any) {
    return this.put(`/goals/${id}`, data);
  }

  async deleteGoal(id: string) {
    return this.delete(`/goals/${id}`);
  }

  async getGoalPlan(id: string) {
    return this.get(`/goals/${id}/plan`);
  }

  // ============ INSIGHTS ENDPOINTS ============

  async getPredictions() {
    return this.get('/insights/predictions');
  }

  async getPatterns() {
    return this.get('/insights/patterns');
  }

  async getOptimizations() {
    return this.get('/insights/optimizations');
  }

  async getCategories() {
    return this.get('/insights/categories');
  }

  async predictCashflow(data: any) {
    return this.post('/insights/predict/cashflow', data);
  }

  // ============ AI COACH ENDPOINTS ============

  async queryAgent(message: string) {
    return this.post('/agent/query', { message });
  }

  async getAgentHistory() {
    return this.get('/agent/history');
  }

  // ============ SMS ENDPOINTS ============

  async parseSms(smsText: string) {
    return this.post('/sms/parse', { sms_text: smsText });
  }

  // ============ PORTFOLIO ENDPOINTS ============

  async getAssets() {
    return this.get('/assets');
  }

  async createAsset(data: any) {
    return this.post('/assets', data);
  }

  async addHolding(data: any) {
    return this.post('/assets/holdings', data);
  }

  async getPortfolio() {
    return this.get('/assets/portfolio');
  }

  async getForecast() {
    return this.get('/assets/forecast');
  }

  // ============ ALERT ENDPOINTS ============

  async getAlerts() {
    return this.get('/alerts');
  }

  async getAlert(id: string) {
    return this.get(`/alerts/${id}`);
  }

  async updateAlert(id: string, data: any) {
    return this.put(`/alerts/${id}`, data);
  }

  async dismissAlert(id: string) {
    return this.post(`/alerts/${id}/dismiss`, {});
  }

  // ============ SETTINGS ENDPOINTS ============

  async getProfile() {
    return this.get('/profile');
  }

  async updateProfile(data: any) {
    return this.put('/profile', data);
  }

  async updatePreferences(data: any) {
    return this.put('/profile/preferences', data);
  }

  async logout() {
    await this.clearToken();
    return this.post('/auth/logout', {});
  }

  // ============ HEALTH CHECK ============

  async healthCheck() {
    return this.get('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
