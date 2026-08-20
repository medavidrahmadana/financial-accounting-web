// API Composable with Production Railway Fallback
export const useApi = () => {
  const config = useRuntimeConfig()
  
  // Default to Railway Production API URL if runtime config is not provided
  const baseURL = config.public.apiBase || 'https://financial-accounting-api-production.up.railway.app/api'

  const fetchApi = async (endpoint: string, options: any = {}) => {
    return await $fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  }

  return {
    fetchApi,
    baseURL
  }
}
