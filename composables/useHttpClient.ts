import type { UseFetchOptions } from 'nuxt/app'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiOptions extends UseFetchOptions<any> {
  requiresAuth?: boolean
}

export const useHttpClient = () => {
  const config = useRuntimeConfig()
  const { accessToken, refreshAccessToken, logout } = useAuth()
  
  const baseURL = config.public.API_LINK

  const createRequest = async <T>(
    endpoint: string,
    options: ApiOptions & { method?: HttpMethod } = {}
  ): Promise<T> => {
    const { requiresAuth = true, method = 'GET', ...fetchOptions } = options

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers as Record<string, string>
    }

    // Add auth header if required and token exists
    if (requiresAuth && accessToken.value) {
      headers.Authorization = `Bearer ${accessToken.value}`
    }

    const requestOptions: UseFetchOptions<T> = {
      ...fetchOptions,
      method,
      headers,
      baseURL,
      onResponseError: async ({ response }) => {
        // Handle 401 errors by attempting token refresh
        if (response.status === 401 && requiresAuth) {
          try {
            await refreshAccessToken()
            // Retry the request with new token
            headers.Authorization = `Bearer ${accessToken.value}`
            return $fetch<T>(endpoint, {
              ...requestOptions,
              headers
            })
          } catch (refreshError) {
            // Refresh failed, logout user
            await logout()
            throw refreshError
          }
        }
      }
    }

    return $fetch<T>(endpoint, requestOptions)
  }

  const get = <T>(endpoint: string, options: ApiOptions = {}) => 
    createRequest<T>(endpoint, { ...options, method: 'GET' })

  const post = <T>(endpoint: string, data?: any, options: ApiOptions = {}) => 
    createRequest<T>(endpoint, { ...options, method: 'POST', body: data })

  const put = <T>(endpoint: string, data?: any, options: ApiOptions = {}) => 
    createRequest<T>(endpoint, { ...options, method: 'PUT', body: data })

  const patch = <T>(endpoint: string, data?: any, options: ApiOptions = {}) => 
    createRequest<T>(endpoint, { ...options, method: 'PATCH', body: data })

  const del = <T>(endpoint: string, options: ApiOptions = {}) => 
    createRequest<T>(endpoint, { ...options, method: 'DELETE' })

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    createRequest
  }
}