// Native zero-dependency API Client for Adyapan Nexus Gateway

const RAW_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000';
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data: T; error?: string }> {
  const token = localStorage.getItem('adyapan_access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token refresh on 401 if refresh token is available (except during login/refresh)
    if (response.status === 401 && endpoint !== '/api/auth/login' && endpoint !== '/api/auth/refresh') {
      const refreshToken = localStorage.getItem('adyapan_refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          const refreshData = await refreshRes.json();
          const newAccessToken = refreshData.data?.accessToken || refreshData.accessToken;
          if (newAccessToken) {
            localStorage.setItem('adyapan_access_token', newAccessToken);
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
            if (retryRes.ok) {
              const resData = await retryRes.json();
              return { success: true, data: resData.data ?? resData };
            }
          }
        } catch {
          localStorage.removeItem('adyapan_access_token');
          localStorage.removeItem('adyapan_refresh_token');
        }
      }
    }

    const resJson = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        resJson?.message ||
        resJson?.error ||
        (response.status === 401 ? 'Invalid credentials. Access Denied.' : `Request failed with status ${response.status}`);
      return {
        success: false,
        data: null as any,
        error: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
      };
    }

    return {
      success: true,
      data: (resJson?.data ?? resJson) as T,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      error: 'Backend Gateway is offline. Please start backend on http://localhost:5000.',
    };
  }
}

// =========================================================================
// API SERVICES
// =========================================================================

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    request<{ accessToken: string; refreshToken?: string; user?: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () =>
    request('/api/auth/logout', { method: 'POST' }),
  refreshToken: (refreshToken: string) =>
    request('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const dashboardApi = {
  getOverview: () => request('/api/dashboard/overview'),
};

export const crmApi = {
  getOverview: () => request('/api/crm/overview'),
  getLeads: () => request('/api/crm/leads'),
  createLead: (lead: any) =>
    request('/api/crm/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    }),
};

export const lmsApi = {
  getOverview: () => request('/api/lms/overview'),
  getCourses: () => request('/api/lms/courses'),
  getStudents: () => request('/api/lms/students'),
};

export const hrmsApi = {
  getOverview: () => request('/api/hrms/overview'),
  getEmployees: () => request('/api/hrms/employees'),
  getLeaveRequests: () => request('/api/hrms/leaves'),
};

export const careersApi = {
  getOverview: () => request('/api/careers/overview'),
  getJobs: () => request('/api/careers/jobs'),
  getCandidates: () => request('/api/careers/candidates'),
};

export const notificationsApi = {
  getAll: () => request('/api/notifications'),
  markAsRead: (id: string) =>
    request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () =>
    request('/api/notifications/read-all', { method: 'PATCH' }),
};

export const auditApi = {
  getLogs: () => request('/api/audit-logs'),
};

export const settingsApi = {
  getSettings: () => request('/api/settings'),
  updateSetting: (key: string, value: any) =>
    request(`/api/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),
};
