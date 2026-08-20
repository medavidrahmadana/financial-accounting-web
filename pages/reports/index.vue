<script setup>
const { fetchApi } = useApi()
const { currency, formatAmount, getCurrencySymbol, isDark } = useAppSettings()

const selectedYear = ref(2022)
const availableYearsOptions = [
  { value: 2020, label: 'Year 2020' },
  { value: 2021, label: 'Year 2021' },
  { value: 2022, label: 'Year 2022' },
  { value: 2023, label: 'Year 2023' },
  { value: 2024, label: 'Year 2024' },
  { value: 2025, label: 'Year 2025' },
  { value: 2026, label: 'Year 2026' }
]
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
        <h1 class="text-2xl sm:text-3xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">Profit & Loss Report</h1>
        <p class="text-sm mt-1 transition-colors" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Monthly breakdown of income, expense, and net income (Currency: {{ currency }})</p>
      </div>

      <div class="flex items-center space-x-3 self-start sm:self-auto">
        <!-- Custom Year Selector -->
        <div class="w-40">
          <CustomSelect v-model="selectedYear" :options="availableYearsOptions" placeholder="Select Year" />
        </div>

        <!-- Export Excel Button -->
        <button 
          @click="downloadExcel()" 
          class="bg-emerald-500 hover:bg-emerald-600 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          :class="isDark ? 'text-white' : 'text-slate-950'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Export Excel</span>
        </button>
      </div>
    </div>

    <!-- Profit & Loss Matrix Table -->
    <div class="border rounded-2xl overflow-hidden shadow-2xl transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
      <div v-if="loading" class="p-12 text-center" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Calculating Profit & Loss report data...</div>
      <div v-else-if="reportData" class="overflow-x-auto">
        <table class="w-full text-left text-sm min-w-[900px]" :class="isDark ? 'text-slate-200' : 'text-slate-800'">
          <thead class="font-bold uppercase text-xs border-b transition-colors" :class="isDark ? 'bg-slate-900 text-amber-400 border-slate-700' : 'bg-slate-100 text-amber-600 border-slate-200'">
            <tr>
              <th class="px-6 py-4 min-w-[200px]" :class="isDark ? 'text-amber-400' : 'text-amber-600'">Category ({{ getCurrencySymbol() }})</th>
              <th v-for="m in 12" :key="m" class="px-4 py-4 text-right" :class="isDark ? 'text-amber-400' : 'text-amber-600'">
                {{ selectedYear }}-{{ String(m).padStart(2, '0') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y transition-colors" :class="isDark ? 'divide-slate-700/40' : 'divide-slate-200'">
            <!-- Income Rows -->
            <tr v-for="inc in reportData.income" :key="inc.category_id" class="transition-colors" :class="isDark ? 'hover:bg-slate-700/20' : 'hover:bg-slate-50'">
              <td class="px-6 py-3.5 font-semibold" :class="isDark ? 'text-slate-200' : 'text-slate-800'">{{ inc.category_name }}</td>
              <td v-for="(amount, key) in inc.amounts" :key="key" class="px-4 py-3.5 text-right font-mono" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
                {{ formatAmount(amount) }}
              </td>
            </tr>

            <!-- Total Income Row (Highlight Green) -->
            <tr class="font-bold border-y-2 transition-colors" :class="isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-emerald-50 text-emerald-700 border-emerald-300'">
              <td class="px-6 py-4 uppercase tracking-wider">Total Income</td>
              <td v-for="(amount, key) in reportData.total_income" :key="key" class="px-4 py-4 text-right font-mono">
                {{ formatAmount(amount) }}
              </td>
            </tr>

            <!-- Expense Rows -->
            <tr v-for="exp in reportData.expense" :key="exp.category_id" class="transition-colors" :class="isDark ? 'hover:bg-slate-700/20' : 'hover:bg-slate-50'">
              <td class="px-6 py-3.5 font-semibold" :class="isDark ? 'text-slate-200' : 'text-slate-800'">{{ exp.category_name }}</td>
              <td v-for="(amount, key) in exp.amounts" :key="key" class="px-4 py-3.5 text-right font-mono" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
                {{ formatAmount(amount) }}
              </td>
            </tr>

            <!-- Total Expense Row (Highlight Orange/Amber) -->
            <tr class="font-bold border-y-2 transition-colors" :class="isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-amber-50 text-amber-700 border-amber-300'">
              <td class="px-6 py-4 uppercase tracking-wider">Total Expense</td>
              <td v-for="(amount, key) in reportData.total_expense" :key="key" class="px-4 py-4 text-right font-mono">
                {{ formatAmount(amount) }}
              </td>
            </tr>

            <!-- Net Income Row (Highlight Bold White) -->
            <tr class="font-extrabold text-base border-t-2 transition-colors" :class="isDark ? 'bg-slate-900/90 text-white border-slate-600' : 'bg-slate-100 text-slate-900 border-slate-300'">
              <td class="px-6 py-4 uppercase tracking-wider">Net Income</td>
              <td v-for="(amount, key) in reportData.net_income" :key="key" class="px-4 py-4 text-right font-mono" :class="amount < 0 ? (isDark ? 'text-rose-400' : 'text-rose-600') : (isDark ? 'text-emerald-400' : 'text-emerald-600')">
                {{ formatAmount(amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
