<script setup>
const { fetchApi } = useApi()
const { currency, formatAmount, getCurrencySymbol, isDark } = useAppSettings()

const selectedYear = ref(2022)
const availableYearsOptions = [
  { value: 2020, label: 'Fiscal Year 2020' },
  { value: 2021, label: 'Fiscal Year 2021' },
  { value: 2022, label: 'Fiscal Year 2022' },
  { value: 2023, label: 'Fiscal Year 2023' },
  { value: 2024, label: 'Fiscal Year 2024' },
  { value: 2025, label: 'Fiscal Year 2025' },
  { value: 2026, label: 'Fiscal Year 2026' }
]
const reportData = ref(null)
const loading = ref(true)

const loadDashboardData = async () => {
  loading.value = true
  try {
    const res = await fetchApi(`/reports/profit-loss?year=${selectedYear.value}`)
    reportData.value = res.data
  } catch (err) {
    console.error('Failed to load dashboard metrics:', err)
  } finally {
    loading.value = false
  }
}

const totalAnnualIncome = computed(() => {
  if (!reportData.value?.total_income) return 0
  return Object.values(reportData.value.total_income).reduce((a, b) => Number(a) + Number(b), 0)
})

const totalAnnualExpense = computed(() => {
  if (!reportData.value?.total_expense) return 0
  return Object.values(reportData.value.total_expense).reduce((a, b) => Number(a) + Number(b), 0)
})

const totalAnnualNetIncome = computed(() => {
  return totalAnnualIncome.value - totalAnnualExpense.value
})

watch(selectedYear, () => {
  loadDashboardData()
})

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">Executive Dashboard</h1>
        <p class="text-sm mt-1 transition-colors" :class="isDark ? 'text-slate-400' : 'text-slate-500'">High-level financial performance summary & visual analytics</p>
      </div>

      <!-- Custom Year Selector -->
      <div class="w-48 self-start sm:self-auto">
        <CustomSelect v-model="selectedYear" :options="availableYearsOptions" placeholder="Select Year" />
      </div>
    </div>

    <!-- Summary KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1: Total Revenue / Income -->
      <div class="border rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
        <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Total Revenue (Income)</span>
          <div class="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">
            {{ getCurrencySymbol() }} {{ formatAmount(totalAnnualIncome) }}
          </div>
          <p class="text-xs mt-1" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Total revenue in {{ selectedYear }} ({{ currency }})</p>
        </div>
      </div>

      <!-- Card 2: Total Expenses -->
      <div class="border rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
        <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Total Expenses</span>
          <div class="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center border border-amber-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">
            {{ getCurrencySymbol() }} {{ formatAmount(totalAnnualExpense) }}
          </div>
          <p class="text-xs mt-1" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Total operational cost in {{ selectedYear }} ({{ currency }})</p>
        </div>
      </div>

      <!-- Card 3: Net Profit / Income -->
      <div class="border rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
        <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Net Profit</span>
          <div class="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-extrabold font-mono" :class="totalAnnualNetIncome >= 0 ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-rose-400' : 'text-rose-600')">
            {{ getCurrencySymbol() }} {{ formatAmount(totalAnnualNetIncome) }}
          </div>
          <p class="text-xs mt-1" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Net profit after expenses ({{ currency }})</p>
        </div>
      </div>
    </div>

    <!-- Chart Analytics Section -->
    <div class="border rounded-2xl p-6 shadow-xl space-y-4 transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
      <div class="flex items-center justify-between border-b pb-4" :class="isDark ? 'border-slate-700/60' : 'border-slate-200'">
        <div>
          <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">Monthly Financial Performance Chart</h3>
          <p class="text-xs" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Visual comparison of monthly Income vs Expense in {{ selectedYear }} (Values in {{ currency }})</p>
        </div>
      </div>

      <div v-if="loading" class="h-80 flex items-center justify-center" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Loading chart analytics...</div>
      <div v-else-if="reportData" class="pt-2">
        <ClientOnly>
          <ChartComponent :reportData="reportData" :year="selectedYear" />
        </ClientOnly>
      </div>
    </div>

    <!-- Quick Navigation Banner -->
    <div class="border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors" :class="isDark ? 'bg-gradient-to-r from-emerald-950/40 via-slate-800 to-slate-800 border-emerald-500/30' : 'bg-emerald-50/60 border-emerald-200 shadow-sm'">
      <div class="space-y-1">
        <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">Full Profit & Loss Financial Matrix</h3>
        <p class="text-sm" :class="isDark ? 'text-slate-400' : 'text-slate-600'">View detailed monthly breakdown by categories or export directly to Microsoft Excel spreadsheet.</p>
      </div>
      <div class="flex items-center space-x-3 shrink-0">
        <NuxtLink to="/reports" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2">
          <span>View Matrix Report</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
