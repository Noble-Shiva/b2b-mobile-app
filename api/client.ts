// API client configuration for making HTTP requests
import { API_CONFIG } from './config';

// Use centralized config
const apiConfig = API_CONFIG;

// Generic fetch function with error handling
export const fetchApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const url = `${apiConfig.baseUrl}${endpoint}`;
    console.log(`🌐 Fetching: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...apiConfig.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API response received');
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Generic GET request function
export const get = <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
  // Automatically append client_id to all GET requests as a query parameter
  const allParams = {
    ...params,
    client_id: apiConfig.clientId,
  };
  
  const url = `${endpoint}?${new URLSearchParams(allParams)}`;
  
  return fetchApi<T>(url, { method: 'GET' });
};

// Generic POST request function
export const post = <T>(endpoint: string, body: any): Promise<T> => {
  // Automatically append client_id to all POST requests
  const requestBody = {
    ...body,
    client_id: apiConfig.clientId,
  };
  
  return fetchApi<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Generic PUT request function
export const put = <T>(endpoint: string, body: any): Promise<T> => {
  return fetchApi<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Generic DELETE request function
export const del = <T>(endpoint: string): Promise<T> => {
  return fetchApi<T>(endpoint, { method: 'DELETE' });
};

// Re-export for easier imports
export default {
  get,
  post,
  put,
  del,
};
