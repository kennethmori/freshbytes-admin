export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Create a custom $fetch instance for API calls
  const $apiClient = $fetch.create({
    baseURL: config.public.API_LINK,
    onRequest({ request, options }) {
      const { accessToken } = useAuth()
      if (accessToken.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    },
    async onResponseError({ request, response, options }) {
      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        const { refreshAccessToken, logout } = useAuth()
        
        try {
          // Try to refresh the token
          await refreshAccessToken()
          
          // Retry the original request with new token
          const { accessToken } = useAuth()
          if (accessToken.value) {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${accessToken.value}`
            }
            // Return the retry result
            return $fetch(request, options)
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          console.error('Token refresh failed, logging out user')
          await logout()
        }
      }
    }
  })

  // Make the API client available globally
  return {
    provide: {
      apiClient: $apiClient
    }
  }
})