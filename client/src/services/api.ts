import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthAttempt = error.config?.url?.includes('/auth/')
    // A 401 on a normal request means the session expired — send the user
    // to login. A 401 on login/register itself just means wrong credentials.
    if (error.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Products API
export const productsAPI = {
  getAll: (filters?: any) => api.get('/products', { params: filters }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  search: (q: string) => api.get('/products/search', { params: { q } }),
}

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
}

// Users API
export const usersAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
}

// Reviews API
export const reviewsAPI = {
  getByProduct: (productId: string) => api.get(`/reviews/product/${productId}`),
  create: (data: any) => api.post('/reviews', data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
}

export default api
