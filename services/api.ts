import axios from 'axios';
import { router } from 'expo-router';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenManager';

const API_BASE_URL = 'http://192.168.1.5:2500';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // Lista de rotas que NÃO precisam de autenticação
    const publicRoutes = ['/auth/login', '/auth/refresh', '/users', '/drivers', '/package-tours', '/tourist-points'];

    // Se a rota não for pública, anexa o token
    if (!publicRoutes.includes(config.url || '')) {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interceptor de Resposta ---
// Este interceptor lida com as respostas (sucesso e erro)
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida, apenas a retorna
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Verifica se o erro é 401 e se não estamos já tentando atualizar o token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já existe uma requisição de refresh em andamento, adiciona a requisição atual na fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          // Se não há refresh token, desloga e redireciona
          await clearTokens();
          router.replace('/(auth)/login');
          return Promise.reject(error);
        }

        // Tenta obter novos tokens
        const refreshResponse = await api.post('/auth/refresh', { refreshToken });
        const { access_token, refresh_token } = refreshResponse.data;

        // Salva os novos tokens
        await saveTokens(access_token, refresh_token);

        // Atualiza o header da requisição original e processa a fila
        api.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
        processQueue(null, access_token);
        
        // Refaz a requisição original
        return api(originalRequest);

      } catch (refreshError) {
        // Se o refresh falhar, desloga o usuário
        processQueue(refreshError, null);
        await clearTokens();
        router.replace('/(auth)/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para qualquer outro erro, apenas o retorna
    return Promise.reject(error);
  }
);

export default api;