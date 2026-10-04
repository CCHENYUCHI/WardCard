export const getToken = () => localStorage.getItem('palabracard_token');
export const setToken = (token) => localStorage.setItem('palabracard_token', token);
export const removeToken = () => localStorage.removeItem('palabracard_token');

export async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is JSON and no Content-Type is set, set it
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  if (res.status === 401 || res.status === 403) {
    removeToken();
    window.dispatchEvent(new Event('auth-expired'));
    throw new Error('請重新登入');
  }

  return res;
}
