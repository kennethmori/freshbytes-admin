<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p class="text-gray-600">Manage your account information and security settings</p>
        </div>
      </div>

      <!-- Profile Information -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div class="px-6 py-4">
          <div v-if="user" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <p class="text-gray-900">{{ user.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p class="text-gray-900">{{ user.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <span class="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                {{ user.role }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <p class="text-gray-900">#{{ user.id }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Change Password</h2>
          <p class="text-gray-600">Update your password to keep your account secure</p>
        </div>
        <div class="px-6 py-4">
          <!-- Error Message -->
          <div v-if="changePasswordError" 
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ changePasswordError }}
          </div>

          <!-- Success Message -->
          <div v-if="changePasswordSuccess" 
            class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Password changed successfully!
          </div>

          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div>
              <label for="current-password" class="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                v-model="passwordForm.currentPassword"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label for="new-password" class="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                v-model="passwordForm.newPassword"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                @input="validateNewPassword"
              />
              <!-- Password Strength Indicator -->
              <div v-if="passwordForm.newPassword" class="mt-2">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-700">Strength:</span>
                  <span :class="getPasswordStrengthColor(passwordValidation.strength)" class="text-sm font-medium capitalize">
                    {{ passwordValidation.strength }}
                  </span>
                </div>
                <div v-if="passwordValidation.errors.length > 0" class="mt-2">
                  <ul class="text-sm text-red-600 space-y-1">
                    <li v-for="error in passwordValidation.errors" :key="error" class="flex items-center">
                      <span class="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                v-model="passwordForm.confirmPassword"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" 
                class="mt-2 text-sm text-red-600">
                Passwords do not match
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="!canChangePassword || isLoading"
                class="px-6 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Changing Password...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePasswordValidation } from '~/composables/usePasswordValidation'

definePageMeta({
  middleware: 'auth'
})

const { user, changePassword, isLoading } = useAuth()
const { validatePassword, getPasswordStrengthColor } = usePasswordValidation()

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePasswordError = ref('')
const changePasswordSuccess = ref(false)
const passwordValidation = ref({ isValid: false, errors: [], strength: 'weak' })

const validateNewPassword = () => {
  if (passwordForm.newPassword) {
    passwordValidation.value = validatePassword(passwordForm.newPassword)
  }
}

const canChangePassword = computed(() => {
  return (
    passwordForm.currentPassword &&
    passwordForm.newPassword &&
    passwordForm.confirmPassword &&
    passwordForm.newPassword === passwordForm.confirmPassword &&
    passwordValidation.value.isValid
  )
})

const handleChangePassword = async () => {
  changePasswordError.value = ''
  changePasswordSuccess.value = false

  if (!canChangePassword.value) {
    changePasswordError.value = 'Please fill in all fields correctly'
    return
  }

  try {
    await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    changePasswordSuccess.value = true
    
    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    passwordValidation.value = { isValid: false, errors: [], strength: 'weak' }
  } catch (error) {
    changePasswordError.value = error.message
  }
}
</script>