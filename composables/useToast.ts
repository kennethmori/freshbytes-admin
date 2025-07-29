export const useToast = () => {
  const toasts = ref<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  }>>([])

  const addToast = (toast: {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  }) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = {
      id,
      duration: 5000,
      ...toast
    }
    
    toasts.value.push(newToast)

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, message?: string, duration?: number) => 
    addToast({ type: 'success', title, message, duration })

  const error = (title: string, message?: string, duration?: number) => 
    addToast({ type: 'error', title, message, duration })

  const warning = (title: string, message?: string, duration?: number) => 
    addToast({ type: 'warning', title, message, duration })

  const info = (title: string, message?: string, duration?: number) => 
    addToast({ type: 'info', title, message, duration })

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}