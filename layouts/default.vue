<script setup>
const { currency, isDark, toggleTheme } = useAppSettings()

const currencyOptions = [
  { value: 'IDR', label: 'IDR (Rp)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'SGD', label: 'SGD (S$)' }
]
</script>

<template>
  <div class="min-h-screen flex flex-col transition-colors duration-200" :class="isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'">
    <!-- Top Navigation Bar -->
    <header class="border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-200" :class="isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-sm'">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <span class="font-bold text-lg tracking-tight transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">
              Financial <span class="text-emerald-500">App</span>
            </span>
          </NuxtLink>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center space-x-1">
            <NuxtLink 
              to="/" 
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              :class="isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
              exact-active-class="!bg-emerald-500/10 !text-emerald-500 font-bold"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink 
              to="/categories" 
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              :class="isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
              active-class="!bg-emerald-500/10 !text-emerald-500 font-bold"
            >
              Category COA
            </NuxtLink>
            <NuxtLink 
              to="/coas" 
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              :class="isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
              active-class="!bg-emerald-500/10 !text-emerald-500 font-bold"
            >
              Chart of Accounts
            </NuxtLink>
            <NuxtLink 
              to="/transactions" 
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              :class="isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
              active-class="!bg-emerald-500/10 !text-emerald-500 font-bold"
            >
              Transactions
            </NuxtLink>
            <NuxtLink 
              to="/reports" 
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              :class="isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
              active-class="!bg-emerald-500/10 !text-emerald-500 font-bold"
            >
              Profit & Loss Report
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              :class="isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
              active-class="!bg-emerald-500/10 !text-emerald-500 font-bold"
            >
              About
            </NuxtLink>
          </nav>

          <!-- Right Tools: Multi-Currency Selector & Theme Toggle -->
          <div class="flex items-center space-x-3">
            <!-- Currency Switcher -->
            <div class="w-28 sm:w-32">
              <CustomSelect v-model="currency" :options="currencyOptions" placeholder="Currency" />
            </div>

            <!-- Dark / Light Theme Toggle Button -->
            <button 
              @click="toggleTheme" 
              title="Toggle Dark / Light Theme"
              class="p-2 rounded-xl border transition-all"
              :class="isDark ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'"
            >
              <!-- Sun Icon for Light Mode -->
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <!-- Moon Icon for Dark Mode -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area with Flex Grow -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer Sticky Bottom Sticky Flex -->
    <footer class="border-t py-6 text-center text-xs transition-colors duration-200 mt-auto" :class="isDark ? 'border-slate-800/80 text-slate-500 bg-slate-950' : 'border-slate-200 text-slate-400 bg-white'">
      Financial Accounting Webapp © 2026. Designed & Developed by <span class="font-bold" :class="isDark ? 'text-emerald-400' : 'text-emerald-600'">David Gholi Rahmadana</span> (Laravel 11 + Nuxt 3).
    </footer>
  </div>
</template>
