<script setup>
const toasts = ref([])
const mobileMenuOpen = ref(false)

const addToast = (message, type = 'success') => {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    removeToast(id)
  }, 4000)
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

provide('toast', { addToast })
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative">
    <!-- Top Navbar -->
    <header class="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            F
          </div>
          <span class="font-bold text-lg tracking-tight text-white">Financial App</span>
        </div>
        
        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center space-x-2">
          <NuxtLink to="/categories" class="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors" :class="$route.path === '/categories' ? 'bg-slate-700 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'">
            Category COA
          </NuxtLink>
          <NuxtLink to="/coas" class="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors" :class="$route.path === '/coas' ? 'bg-slate-700 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'">
            Chart of Accounts
          </NuxtLink>
          <NuxtLink to="/transactions" class="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors" :class="$route.path === '/transactions' ? 'bg-slate-700 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'">
            Transactions
          </NuxtLink>
          <NuxtLink to="/reports" class="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors" :class="$route.path === '/reports' ? 'bg-slate-700 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'">
            Profit & Loss Report
          </NuxtLink>
        </nav>

        <!-- Mobile Hamburger Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-slate-800/95 border-b border-slate-700 px-4 pt-2 pb-4 space-y-1">
        <NuxtLink @click="mobileMenuOpen = false" to="/categories" class="block px-3 py-2 rounded-lg text-base font-medium" :class="$route.path === '/categories' ? 'bg-slate-700 text-emerald-400' : 'text-slate-300'">
          Category COA
        </NuxtLink>
        <NuxtLink @click="mobileMenuOpen = false" to="/coas" class="block px-3 py-2 rounded-lg text-base font-medium" :class="$route.path === '/coas' ? 'bg-slate-700 text-emerald-400' : 'text-slate-300'">
          Chart of Accounts
        </NuxtLink>
        <NuxtLink @click="mobileMenuOpen = false" to="/transactions" class="block px-3 py-2 rounded-lg text-base font-medium" :class="$route.path === '/transactions' ? 'bg-slate-700 text-emerald-400' : 'text-slate-300'">
          Transactions
        </NuxtLink>
        <NuxtLink @click="mobileMenuOpen = false" to="/reports" class="block px-3 py-2 rounded-lg text-base font-medium" :class="$route.path === '/reports' ? 'bg-slate-700 text-emerald-400' : 'text-slate-300'">
          Profit & Loss Report
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <slot />
    </main>

    <!-- Sleek Custom Toast Notifications Container - Positioned TOP RIGHT -->
    <div class="fixed top-20 right-4 sm:right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id" 
          class="pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-center justify-between space-x-3 transform transition-all duration-300 bg-slate-800/95 backdrop-blur-md"
          :class="toast.type === 'success' ? 'border-emerald-500/50 text-emerald-400 shadow-emerald-950/20' : 'border-rose-500/50 text-rose-400 shadow-rose-950/20'"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              :class="toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'"
            >
              <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <span class="text-sm font-medium text-slate-200">{{ toast.message }}</span>
          </div>
          <button @click="removeToast(toast.id)" class="text-slate-500 hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>

    <!-- Footer -->
    <footer class="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
      Financial Accounting Webapp &copy; 2026. Decoupled Architecture (Laravel 11 + Nuxt 3).
    </footer>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
