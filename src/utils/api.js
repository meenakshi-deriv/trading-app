import axios from 'axios';

// Initial bearer token for user registration
const INITIAL_BEARER_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMDAsImFwcF9pZCI6MTAwMCwiYWNjb3VudF9pZCI6MTMsImlhdCI6MTczMzM3NjgzMSwiZXhwIjoxNzY0OTEyODIyfQ.hmc1aUT_R75K1iyemngogSxVmRp2RIDxpYRLbdmw2aDuPN0o7V5dJ7lG_P38UJ0QStwyrVHs7H_S9m7XemKemBNGofL8mvMCaIOCjloWRURMdQae3VV5cBo5k3eBJdlgTBAMJjFwigHaf016iAEUF2NRJdvEqODTFyymlgxkhvvviIL8So5PN1LxWij9moaiuTj2ssK2od35U4UaVVaezZ7JNGEg83WquKlw7zzg2LYjbPhDuqiUVaAn5n4S68oS_0xgbA1JRdhZwwu6S84klcXm2HiyFBxRJ0zAcS178tUodbX8Teinx6BtAq4ld8S2IP69_ll5u24A0P-Lf859SQ';

// Token storage key
const TOKEN_KEY = 'jwt_token';

// Create axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to dynamically add authorization header
api.interceptors.request.use((config) => {
  // For registration endpoint, use the initial bearer token
  if (config.url.endsWith('/user')) {
    config.headers.Authorization = `Bearer ${INITIAL_BEARER_TOKEN}`;
  } else {
    // For other endpoints (deposit, withdraw), use the stored JWT token
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Function to store JWT token
export const setAuthToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

// Function to get stored JWT token
export const getAuthToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

// Function to clear token (for logout)
export const clearAuthToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

export default api;
