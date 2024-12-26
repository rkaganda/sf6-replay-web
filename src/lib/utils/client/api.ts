export const apiRequest = async (url: string, method: string, body?: object) => {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'API request failed');
    }
  
    return res.json();
  };
  