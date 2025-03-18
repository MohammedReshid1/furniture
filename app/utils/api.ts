/**
 * API utility functions for interacting with the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Fetch error handler
 */
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    // If it's JSON, parse it
    const data = await response.json();
    
    if (!response.ok) {
      // If the response status is not ok, throw the error message
      const error = (data && data.detail) || response.statusText;
      return Promise.reject(error);
    }
    
    return data;
  } else {
    // For non-JSON responses like file downloads
    if (!response.ok) {
      const error = response.statusText;
      return Promise.reject(error);
    }
    
    return response;
  }
};

/**
 * Get auth token from localStorage
 */
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Base request function with auth header
 */
const request = async (
  endpoint: string,
  method: string = 'GET',
  body: any = null,
  customHeaders: Record<string, string> = {}
): Promise<any> => {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Authentication API calls
 */
export const authAPI = {
  login: (email: string, password: string) => {
    // Convert to form data for OAuth2 compatibility
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include',
    }).then(handleResponse);
  },
  
  register: (userData: { email: string; full_name: string; password: string }) => {
    return request('/register', 'POST', userData);
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  
  getCurrentUser: () => {
    return request('/users/me');
  },
};

/**
 * Products API calls
 */
export const productsAPI = {
  getProducts: (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    sort_order?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return request(`/products${queryString}`);
  },
  
  getProduct: (id: number) => {
    return request(`/products/${id}`);
  },
  
  getProductBySlug: (slug: string) => {
    return request(`/products/slug/${slug}`);
  },
  
  getCategories: () => {
    return request('/products/categories/all');
  },
  
  getProductReviews: (productId: number) => {
    return request(`/products/${productId}/reviews`);
  },
  
  addReview: (productId: number, review: { rating: number; comment: string }) => {
    return request(`/products/${productId}/reviews`, 'POST', review);
  },
};

/**
 * Cart API calls
 */
export const cartAPI = {
  getCart: () => {
    return request('/cart');
  },
  
  addToCart: (productId: number, quantity: number = 1) => {
    return request('/cart', 'POST', { product_id: productId, quantity });
  },
  
  updateCartItem: (itemId: number, quantity: number) => {
    return request(`/cart/${itemId}`, 'PUT', { quantity });
  },
  
  removeFromCart: (itemId: number) => {
    return request(`/cart/${itemId}`, 'DELETE');
  },
  
  clearCart: () => {
    return request('/cart', 'DELETE');
  },
};

/**
 * Orders API calls
 */
export const ordersAPI = {
  createOrder: (orderData: { address_id: number; items: { product_id: number; quantity: number }[] }) => {
    return request('/orders', 'POST', orderData);
  },
  
  getUserOrders: (skip: number = 0, limit: number = 10) => {
    return request(`/orders?skip=${skip}&limit=${limit}`);
  },
  
  getOrder: (orderId: number) => {
    return request(`/orders/${orderId}`);
  },
  
  cancelOrder: (orderId: number) => {
    return request(`/orders/${orderId}/cancel`, 'PUT');
  },
};

/**
 * User API calls
 */
export const userAPI = {
  updateProfile: (userData: { full_name?: string; email?: string; password?: string }) => {
    return request('/users/me', 'PUT', userData);
  },
  
  getAddresses: () => {
    return request('/users/me/addresses');
  },
  
  createAddress: (addressData: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default?: boolean;
  }) => {
    return request('/users/me/addresses', 'POST', addressData);
  },
  
  updateAddress: (addressId: number, addressData: any) => {
    return request(`/users/me/addresses/${addressId}`, 'PUT', addressData);
  },
  
  deleteAddress: (addressId: number) => {
    return request(`/users/me/addresses/${addressId}`, 'DELETE');
  },
};

/**
 * Admin API calls - only available to admin users
 */
export const adminAPI = {
  createProduct: (productData: any) => {
    return request('/products', 'POST', productData);
  },
  
  updateProduct: (productId: number, productData: any) => {
    return request(`/products/${productId}`, 'PUT', productData);
  },
  
  deleteProduct: (productId: number) => {
    return request(`/products/${productId}`, 'DELETE');
  },
  
  getAllOrders: (params?: { skip?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return request(`/orders/admin/all${queryString}`);
  },
  
  updateOrderStatus: (orderId: number, status: string) => {
    return request(`/orders/${orderId}/status?status=${status}`, 'PUT');
  },
}; 