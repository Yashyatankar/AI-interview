import axios from 'axios';

const api = axios.create({ baseURL: '/' });

// Attach access token to every request
api.interceptors.request.use((config) => {
  
  const token = localStorage.getItem('access');

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
      
// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Check for 401 and prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        
        // 2. Call refresh endpoint
        const { data } = await axios.post('http://127.0.0.1:8000/accounts/token/refresh/', { 
          refresh: refreshToken 
        });
        
        // 3. Update tokens
        localStorage.setItem('access', data.access);
        // Only update refresh if the server actually sent a new one
        if (data.refresh) {
          localStorage.setItem('refresh', data.refresh);
        }
        
        // 4. Update headers
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;

        // 5. Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear everything and go to login
        localStorage.clear();
        window.location.href = '/'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;