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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh');
        const { data } = await axios.post('/accounts/token/refresh/', { refresh });
        if (!data.access) {
          throw new Error('No access token returned');
        }
        localStorage.setItem('access', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login'; // or '/', match your app's route
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;