<script setup>
const { isDark } = useAppSettings()

const techStack = [
  {
    category: 'Backend Architecture',
    name: 'Laravel 11 (PHP 8.2+)',
    icon: '⚡',
    rationale: 'Dipercaya untuk menangani RESTful API yang robust, transaksi database aman, ORM Eloquent efisien, serta pengolahan Excel Export bawaan server.'
  },
  {
    category: 'Frontend Framework',
    name: 'Nuxt 3 (Vue 3 + TypeScript)',
    icon: '🚀',
    rationale: 'Memberikan Server-Side Rendering (SSR) super cepat, struktur kode modular berbasis composable, dan performa UI yang sangat reaktif.'
  },
  {
    category: 'Database Management',
    name: 'MySQL Database',
    icon: '🗄️',
    rationale: 'Menjamin relational data integrity yang ketat antara entitas Transaksi, Chart of Accounts (COA), dan Master Kategori Keuangan.'
  },
  {
    category: 'Styling & UI Philosophy',
    name: 'TailwindCSS + Pure Custom UI',
    icon: '🎨',
    rationale: 'Menghindari crash Vite/SSR akibat library eksternal. Komponen DatePicker, Select, dan Pagination dibuat murni menggunakan Vue 3 demi stabilitas 100% dan estetika sekelas SaaS modern.'
  }
]

const deploymentStack = [
  {
    category: 'Frontend Deployment',
    name: 'Vercel Cloud Platform',
    icon: '🌐',
    rationale: 'Dipilih karena proses konfigurasi yang sangat mudah dan cepat, mendukung CI/CD otomatis (auto-deploy setiap kali ada Git Push), performa Edge Network global, serta layanan hosting gratis yang andal.'
  },
  {
    category: 'Backend & DB Deployment',
    name: 'Railway.app Cloud Service',
    icon: '☁️',
    rationale: 'Dipilih karena setup server Docker & MySQL yang fleksibel, mendukung runtime 24/7 nonstop secara gratis, serta kemudahan integrasi lingkungan produksi (Environment Variables & Networking).'
  }
]

const libraries = [
  { name: 'Chart.js & Vue-ChartJS', purpose: 'Visualisasi grafik batang interaktif komparasi Income vs Expense bulanan.' },
  { name: 'Maatwebsite/Laravel-Excel (v3.1)', purpose: 'Engine generator ekspor laporan matriks Laba/Rugi format .xlsx.' },
  { name: 'TailwindCSS & Lucide Icons', purpose: 'Styling utility-first dan ikonografi vektor modern beresolusi tinggi.' }
]
</script>

<template>
  <div class="space-y-10 max-w-5xl mx-auto">
    <!-- Hero Header -->
    <div class="border rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden transition-colors" :class="isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200/60'">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 space-y-4">
        <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <span>Technical Assessment Project</span>
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">
          About Financial Accounting System
        </h1>

        <p class="text-base sm:text-lg leading-relaxed max-w-3xl transition-colors" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
          Aplikasi Sistem Akuntansi Keuangan ini dikembangkan dan ditujukan secara khusus sebagai hasil pengerjaan <strong class="text-emerald-500">Technical Test PT. TRANS BERJAYA KHATULISTIWA</strong>.
        </p>

        <div class="pt-2 border-t" :class="isDark ? 'border-slate-800' : 'border-slate-100'">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            <div>Developed & Designed by: <strong :class="isDark ? 'text-white' : 'text-slate-900'">David Gholi Rahmadana</strong></div>
            <div>Target Entity: <strong class="text-emerald-500">PT. TRANS BERJAYA KHATULISTIWA</strong></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Future Roadmap & Public Expansion Purpose -->
    <div class="border rounded-3xl p-8 shadow-xl transition-colors" :class="isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-800' : 'bg-gradient-to-br from-emerald-50/50 to-white border-slate-200 shadow-slate-200/50'">
      <div class="flex items-start space-x-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30 text-xl">
          🌟
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">Future Roadmap & Vision</h2>
          <p class="text-sm leading-relaxed transition-colors" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
            Kedepannya (jika sedang ada waktu luang), sistem ini direncanakan untuk dikembangkan lebih lanjut menjadi platform <strong class="font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">Public Financial SaaS</strong> multi-user. Pengguna umum nantinya dapat mendaftar akun personal/bisnis untuk mencatat transaksi harian, mengelola arus kas (cashflow), dan melihat laporan laba rugi pribadi secara mandiri.
          </p>
        </div>
      </div>
    </div>

    <!-- Tech Stack Rationale Grid -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">Technology Stack & Rationale</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="item in techStack" 
          :key="item.name"
          class="border rounded-2xl p-6 shadow-lg transition-all"
          :class="isDark ? 'bg-slate-800 border-slate-700/80 hover:border-slate-600' : 'bg-white border-slate-200 shadow-slate-200/50 hover:border-slate-300'"
        >
          <div class="flex items-center space-x-3 mb-3">
            <span class="text-2xl">{{ item.icon }}</span>
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-emerald-500">{{ item.category }}</span>
              <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">{{ item.name }}</h3>
            </div>
          </div>
          <p class="text-xs leading-relaxed" :class="isDark ? 'text-slate-400' : 'text-slate-600'">
            {{ item.rationale }}
          </p>
        </div>
      </div>
    </div>

    <!-- Cloud Infrastructure & Deployment Section -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">Cloud Infrastructure & Deployment</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="item in deploymentStack" 
          :key="item.name"
          class="border rounded-2xl p-6 shadow-lg transition-all"
          :class="isDark ? 'bg-slate-800 border-slate-700/80 hover:border-slate-600' : 'bg-white border-slate-200 shadow-slate-200/50 hover:border-slate-300'"
        >
          <div class="flex items-center space-x-3 mb-3">
            <span class="text-2xl">{{ item.icon }}</span>
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-emerald-500">{{ item.category }}</span>
              <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">{{ item.name }}</h3>
            </div>
          </div>
          <p class="text-xs leading-relaxed" :class="isDark ? 'text-slate-400' : 'text-slate-600'">
            {{ item.rationale }}
          </p>
        </div>
      </div>
    </div>

    <!-- Key Libraries & Package Breakdown -->
    <div class="border rounded-3xl p-8 shadow-xl space-y-4 transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
      <h2 class="text-xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">Libraries & Package Breakdown</h2>
      
      <div class="divide-y" :class="isDark ? 'divide-slate-700/60' : 'divide-slate-200'">
        <div v-for="lib in libraries" :key="lib.name" class="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span class="font-bold text-sm text-emerald-500 font-mono">{{ lib.name }}</span>
          <span class="text-xs max-w-md text-right sm:text-right text-left" :class="isDark ? 'text-slate-400' : 'text-slate-600'">{{ lib.purpose }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
