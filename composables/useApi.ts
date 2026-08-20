export const useApi = () => {
  const fetchApi = async (endpoint, options = {}) => {
    // Standard Laravel Artisan Serve IP / localhost fallback
    const baseUrl = 'http://127.0.0.1:8000/api'
    
    return await $fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    })
  }

  return { fetchApi }
}
