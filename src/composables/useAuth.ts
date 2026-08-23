import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { API_BASE_URL } from '@/config/api';

export function useAuth() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Login failed, please check your credentials.');
      }

      const data = await response.json();
      
      // Store token (assuming the backend returns { token: '...' } or similar)
      const token = data.token || data.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        console.warn('Login successful but no token found in response:', data);
      }

      return true;
    } catch (err: any) {
      error.value = err.message || 'An unexpected error occurred.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (payload: Record<string, any>): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Registration failed, please try again.');
      }

      // If backend auto-logins after register, it might return a token
      const data = await response.json();
      const token = data.token || data.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }

      return true;
    } catch (err: any) {
      error.value = err.message || 'An unexpected error occurred.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
    error,
  };
}
