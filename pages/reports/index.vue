<script setup>
const { fetchApi } = useApi()

const selectedYear = ref(2022)
const availableYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
const reportData = ref(null)
const loading = ref(true)

const loadReport = async () => {
  loading.value = true
  try {
    const res = await fetchApi(`/reports/profit-loss?year=${selectedYear.value}`)
    reportData.value = res.data
  } catch (err) {
    console.error('Failed to load profit loss report:', err)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (val) => {
  if (!val || val === 0) return '0'
  return new Intl.NumberFormat('id-ID').format(val)
}

const downloadExcel = () => {
  window.open(`http://127.0.0.1:8000/api/reports/profit-loss/export?year=${selectedYear.value}`, '_blank')
}

watch(selectedYear, () => {
  loadReport()
})

onMounted(() => {
  loadReport()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Profit & Loss Report</h1>
        <p class="text-slate-400 text-sm mt-1">Monthly breakdown of income, expense, and net income performance</p>
      </div>

      <div class="flex items-center space-x-3 self-start sm:self-auto">
        <!-- Year Selector -->
        <div class="relative">
          <select 
            v-model="selectedYear" 
            class="appearance-none bg-slate-800 border border-slate-700/80 rounded-xl pl-4 pr-10 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500 cursor-pointer shadow-lg"
          >
            <option v-for="y in availableYears" :key="y" :value="y">Year {{ y }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <!-- Export Excel Button -->
        <button 
          @click="downloadExcel()" 
          class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Export Excel</span>
        </button>
      </div>
    </div>

    <!-- Profit & Loss Matrix Table -->
    <div class="bg-slate-800 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">
      <div v-if="loading" class="p-12 text-center text-slate-400">Calculating Profit & Loss report data...</div>
      <div v-else-if="reportData" class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-200 min-w-[900px]">
          <thead class="bg-slate-900 text-amber-400 font-bold uppercase text-xs border-b border-slate-700">
            <tr>
              <th class="px-6 py-4 min-w-[200px] text-amber-400">Category</th>
              <th v-for="m in 12" :key="m" class="px-4 py-4 text-right text-amber-400">
                {{ selectedYear }}-{{ String(m).padStart(2, '0') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/40">
            <!-- Income Rows -->
            <tr v-for="inc in reportData.income" :key="inc.category_id" class="hover:bg-slate-700/20 transition-colors">
              <td class="px-6 py-3.5 font-semibold text-slate-200">{{ inc.category_name }}</td>
              <td v-for="(amount, key) in inc.amounts" :key="key" class="px-4 py-3.5 text-right font-mono text-slate-300">
                {{ formatCurrency(amount) }}
              </td>
            </tr>

            <!-- Total Income Row (Highlight Green) -->
            <tr class="bg-emerald-500/20 font-bold text-emerald-400 border-y-2 border-emerald-500/40">
              <td class="px-6 py-4 uppercase tracking-wider text-emerald-300">Total Income</td>
              <td v-for="(amount, key) in reportData.total_income" :key="key" class="px-4 py-4 text-right font-mono text-emerald-300">
                {{ formatCurrency(amount) }}
              </td>
            </tr>

            <!-- Expense Rows -->
            <tr v-for="exp in reportData.expense" :key="exp.category_id" class="hover:bg-slate-700/20 transition-colors">
              <td class="px-6 py-3.5 font-semibold text-slate-200">{{ exp.category_name }}</td>
              <td v-for="(amount, key) in exp.amounts" :key="key" class="px-4 py-3.5 text-right font-mono text-slate-300">
                {{ formatCurrency(amount) }}
              </td>
            </tr>

            <!-- Total Expense Row (Highlight Orange/Amber) -->
            <tr class="bg-amber-500/20 font-bold text-amber-400 border-y-2 border-amber-500/40">
              <td class="px-6 py-4 uppercase tracking-wider text-amber-300">Total Expense</td>
              <td v-for="(amount, key) in reportData.total_expense" :key="key" class="px-4 py-4 text-right font-mono text-amber-300">
                {{ formatCurrency(amount) }}
              </td>
            </tr>

            <!-- Net Income Row (Highlight Bold White) -->
            <tr class="bg-slate-900/90 font-extrabold text-white text-base border-t-2 border-slate-600">
              <td class="px-6 py-4 uppercase tracking-wider text-white">Net Income</td>
              <td v-for="(amount, key) in reportData.net_income" :key="key" class="px-4 py-4 text-right font-mono" :class="amount < 0 ? 'text-rose-400' : 'text-emerald-400'">
                {{ formatCurrency(amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
