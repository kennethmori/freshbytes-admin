<template>
    <form class="max-w-sm min-w-sm mx-auto" @submit.prevent="triggerAction">
        <div class="mb-6">
            <label for="email" class="block mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Your email
            </label>
            <input type="email" id="email" v-model="form.email" required placeholder="name@flowbite.com"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500" />
        </div>
        <div class="mb-6">
            <label for="password" class="block mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Your password
            </label>
            <input type="password" id="password" v-model="form.password" required
                class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500" />
        </div>

        <!-- Remember Me -->
        <div class="flex items-center mb-6">
            <input id="remember" type="checkbox"
                class="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
            <label for="remember" class="ml-3 text-base font-medium text-gray-700 dark:text-gray-300">
                Remember me
            </label>
        </div>

        <!-- Submit Button -->
        <div class="mb-6">
            <button type="submit"
                class="w-full text-lg px-6 py-3 text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-semibold rounded-lg dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">
                {{ isLoading ? 'Logging in...' : 'Submit' }}
            </button>
        </div>
    </form>

    <!-- Register Link -->
    <div class="mt-6 text-base text-center text-gray-700 dark:text-gray-300">
        <span>Don't have an account?</span>
        <NuxtLink to="/register" class="ml-1 text-emerald-700 font-semibold hover:underline">
            Sign up
        </NuxtLink>

    </div>
    <div class="text-center justify-between text-sm">
        <button @click="handlePasswordReset" class="text-emerald-700 hover:underline" :disabled="isLoading">
            Forgot Password?
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    form: {
        type: Object,
        required: true,
        default: () => ({ email: '', password: '' })
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['child-action', 'password-reset'])

const triggerAction = () => {
    emit('child-action');
}

const handlePasswordReset = () => {
    emit('password-reset');
}
</script>