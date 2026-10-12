const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('api_token');
  
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  
    const response = await fetch(url, options);
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.json();
  };
  
  export default fetchWithAuth;
  