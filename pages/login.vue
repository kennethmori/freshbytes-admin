<template>
  <div class="h-screen flex items-center bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
    
    <!-- Background Image Overlay -->
    <img src="@/assets/images/fruits1.png" alt="Fruits"
      class="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />

    <!-- Form Section (shifted slightly right) -->
    <div class="relative z-30 w-full max-w-xl ml-60 space-y-6">
      <!-- Centered Logo + Heading -->
      <div class="flex flex-col items-center space-y-2">
        <img src="@/assets/images/logos-12-12.png" alt="FreshBytes Logo" class="w-16 h-16" />
        <h1 class="font-extrabold text-4xl text-gray-800 text-center mb-6">FreshBytes Admin</h1>
      </div>

      <!-- Error -->
      <div v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-lg text-center">
        {{ error }}
      </div>

      <!-- Auth Form -->
      <div class="bg-white/90 backdrop-blur-md p-20 rounded-2xl shadow-2xl w-full space-y-8">
        <h2 class="text-4xl font-semibold mb-20 text-center">Welcome Back</h2>
        <FormAuth @child-action="handleLogin" @password-reset="handlePasswordReset" :form="form" :isLoading="isLoading" />
      </div>
    </div>

    <!-- Fruit Image (no gap on the right) -->
    <div class="relative z-0 hidden lg:flex items-end justify-end h-full flex-grow">
      <img src="@/assets/images/fruits.png" alt="Fruits"
        class="h-full w-full object-cover pointer-events-none" />
    </div>
  </div>
</template>



<script setup>
definePageMeta({
    middleware: 'guest'
})

const { login, resetPassword, isLoading } = useAuth()

const form = reactive({
    email: '',
    password: ''
})

const error = ref('')

const handleLogin = async () => {
    error.value = ''
    console.log("try");

    try {
        await login(form)
        await navigateTo('/home') // or wherever you want to redirect
    } catch (err) {
        error.value = err.message
    }
}

const handlePasswordReset = async () => {
    if (!form.email) {
        error.value = 'Please enter your email first'
        return
    }

    try {
        await resetPassword(form.email)
        error.value = ''
        alert('Password reset instructions sent to your email!')
    } catch (err) {
        error.value = err.message
    }
}

// // Auto-fill demo credentials (remove in production)
// onMounted(() => {
//     form.email = 'admin@example.com'
//     form.password = 'admin123'
// })
</script>