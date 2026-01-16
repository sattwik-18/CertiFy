/**
 * API Client for Certify Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async signup(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organizationName: string;
    organizationEmail: string;
    organizationDomain?: string;
  }) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.data?.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async requestPasswordReset(email: string) {
    return this.request('/auth/password/reset-request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Certificates
  async issueCertificate(data: {
    recipientName: string;
    recipientEmail: string;
    courseTitle: string;
    courseDescription?: string;
    issueDate?: string;
    expiryDate?: string;
    templateId?: string;
    metadata?: Record<string, any>;
  }) {
    return this.request('/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCertificates(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    recipientEmail?: string;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    return this.request(`/certificates${queryString ? `?${queryString}` : ''}`);
  }

  async getCertificate(id: string) {
    return this.request(`/certificates/${id}`);
  }

  async revokeCertificate(id: string, reason?: string) {
    return this.request(`/certificates/${id}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Verification (public)
  async verifyCertificate(id: string) {
    return this.request(`/verify/${id}`);
  }

  // Organization
  async getOrganization() {
    return this.request('/organization');
  }

  async updateOrganization(data: {
    name?: string;
    domain?: string;
    description?: string;
    branding?: any;
    settings?: any;
  }) {
    return this.request('/organization', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getOrganizationStatistics() {
    return this.request('/organization/statistics');
  }
}

export const api = new ApiClient(API_BASE_URL);

