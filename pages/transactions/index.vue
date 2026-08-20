<script setup>
const { fetchApi } = useApi()
const { currency, formatAmount, getCurrencySymbol, isDark } = useAppSettings()

const transactions = ref([])
const coas = ref([])
const loading = ref(true)

// Filter states
const searchQuery = ref('')
const selectedCoaFilter = ref('')
const startDateFilter = ref('')
const endDateFilter = ref('')

// Pagination states
const currentPage = ref(1)
const itemsPerPage = ref(10)

const showModal = ref(false)
const showDeleteModal = ref(false)

const form = ref({
  id: null,
  date: new Date().toISOString().split('T')[0],
  coa_id: '',
  description: '',
  type: 'credit',
  amount: 0
})

const itemToDelete = ref(null)

const loadData = async () => {
  loading.value = true
  try {
    const [resTransactions, resCoas] = await Promise.all([
      fetchApi('/transactions'),
      fetchApi('/coas')
    ])
    transactions.value = resTransactions.data
    coas.value = resCoas.data
  } catch (err) {
    console.error('Failed to load transaction data', err)
  } finally {
    loading.value = false
  }
}

const coaFilterOptions = computed(() => {
  const opts = [{ value: '', label: 'All Accounts' }]
  coas.value.forEach(c => {
    opts.push({
      value: c.id,
      label: `${c.code} - ${c.name}`
    })
  })
  return opts
})

const coaFormOptions = computed(() => {
  return coas.value.map(c => ({
    value: c.id,
    label: `${c.code} - ${c.name} (${c.category?.name || ''})`
  }))
})

const typeFormOptions = [
  { value: 'credit', label: 'Credit (Income)' },
  { value: 'debit', label: 'Debit (Expense)' }
]

const filteredTransactions = computed(() => {
  return transactions.value.filter(item => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = item.description.toLowerCase().includes(q) || 
                          (item.coa?.name && item.coa.name.toLowerCase().includes(q))
    const matchesCoa = selectedCoaFilter.value === '' || String(item.coa_id) === String(selectedCoaFilter.value)
    
    // Strict Date Range Filter logic
    let matchesDate = true
    if (startDateFilter.value && endDateFilter.value) {
      matchesDate = (item.date >= startDateFilter.value) && (item.date <= endDateFilter.value)
    } else if (startDateFilter.value) {
      matchesDate = (item.date === startDateFilter.value)
    } else if (endDateFilter.value) {
      matchesDate = (item.date <= endDateFilter.value)
    }

    return matchesSearch && matchesCoa && matchesDate
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage.value) || 1
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})

watch([searchQuery, selectedCoaFilter, startDateFilter, endDateFilter, itemsPerPage], () => {
  currentPage.value = 1
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCoaFilter.value = ''
  startDateFilter.value = ''
  endDateFilter.value = ''
  currentPage.value = 1
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const openModal = (item = null) => {
  if (item) {
    const isDebit = item.debit > 0
    form.value = {
      id: item.id,
      date: item.date,
      coa_id: item.coa_id,
      description: item.description,
      type: isDebit ? 'debit' : 'credit',
      amount: isDebit ? item.debit : item.credit
    }
  } else {
    form.value = {
      id: null,
      date: new Date().toISOString().split('T')[0],
      coa_id: coas.value.length > 0 ? coas.value[0].id : '',
      description: '',
      type: 'credit',
      amount: 0
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const saveTransaction = async () => {
  if (!form.value.date || !form.value.coa_id || !form.value.description || !form.value.amount) {
    alert('Please fill in all required fields')
    return
  }

  const payload = {
    date: form.value.date,
    coa_id: form.value.coa_id,
    description: form.value.description,
    debit: form.value.type === 'debit' ? form.value.amount : 0,
    credit: form.value.type === 'credit' ? form.value.amount : 0
  }

  try {
    if (form.value.id) {
      await fetchApi(`/transactions/${form.value.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await fetchApi('/transactions', {
        method: 'POST',
        body: payload
      })
    }
    closeModal()
    loadData()
  } catch (err) {
    alert('Failed to save transaction')
  }
}

const deleteTransaction = async () => {
  if (!itemToDelete.value) return
  try {
    await fetchApi(`/transactions/${itemToDelete.value.id}`, { method: 'DELETE' })
    closeDeleteModal()
    loadData()
  } catch (err) {
    alert('Failed to delete transaction')
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">Financial Transactions</h1>
        <p class="text-sm mt-1 transition-colors" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Record and manage debit & credit journal entries (Active Currency: {{ currency }})</p>
      </div>
      <button 
        @click="openModal()" 
        class="bg-emerald-500 hover:bg-emerald-600 font-bold px-5 py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        :class="isDark ? 'text-white' : 'text-slate-950'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>New Transaction</span>
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="border rounded-2xl p-4 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-lg transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
      <!-- Left side: Search & Custom Built DatePicker Range -->
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
        <!-- Search Input -->
        <div class="relative w-full sm:w-56">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search description..." 
            class="w-full border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            :class="isDark ? 'bg-slate-900 border-slate-700/80 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        <!-- Custom Built DatePicker Range -->
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <div class="w-44">
            <CustomDatePicker v-model="startDateFilter" placeholder="From Date" />
          </div>
          <span class="text-xs" :class="isDark ? 'text-slate-500' : 'text-slate-400'">-</span>
          <div class="w-44">
            <CustomDatePicker v-model="endDateFilter" placeholder="To Date" />
          </div>
        </div>
      </div>

      <!-- Right side: Filter COA Dropdown -->
      <div class="flex items-center space-x-3 w-full xl:w-auto justify-end">
        <label class="text-xs font-semibold uppercase tracking-wider whitespace-nowrap" :class="isDark ? 'text-slate-400' : 'text-slate-500'">COA:</label>
        <div class="w-full sm:w-52">
          <CustomSelect v-model="selectedCoaFilter" :options="coaFilterOptions" placeholder="All Accounts" />
        </div>

        <button 
          v-if="startDateFilter || endDateFilter || searchQuery || selectedCoaFilter"
          @click="clearFilters()" 
          class="text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1 underline whitespace-nowrap"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Responsive Data Table Container -->
    <div class="border rounded-2xl overflow-hidden shadow-xl transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
      <div v-if="loading" class="p-8 text-center" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Loading transaction history...</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm min-w-[750px]" :class="isDark ? 'text-slate-300' : 'text-slate-700'">
          <thead class="uppercase text-xs border-b font-bold tracking-wider transition-colors" :class="isDark ? 'bg-slate-900/60 text-slate-400 border-slate-700/80' : 'bg-slate-100/80 text-slate-600 border-slate-200'">
            <tr>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4">COA Code</th>
              <th class="px-6 py-4">COA Name</th>
              <th class="px-6 py-4">Description</th>
              <th class="px-6 py-4 text-right">Debit ({{ getCurrencySymbol() }})</th>
              <th class="px-6 py-4 text-right">Credit ({{ getCurrencySymbol() }})</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y transition-colors" :class="isDark ? 'divide-slate-700/50' : 'divide-slate-200'">
            <tr v-for="item in paginatedTransactions" :key="item.id" class="transition-colors" :class="isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'">
              <td class="px-6 py-4 whitespace-nowrap font-mono text-xs" :class="isDark ? 'text-slate-400' : 'text-slate-500'">{{ formatDate(item.date) }}</td>
              <td class="px-6 py-4 font-mono font-bold text-emerald-500">{{ item.coa?.code || '-' }}</td>
              <td class="px-6 py-4 font-semibold" :class="isDark ? 'text-white' : 'text-slate-900'">
                <div>{{ item.coa?.name || '-' }}</div>
                <div class="text-xs font-normal" :class="isDark ? 'text-slate-400' : 'text-slate-500'">{{ item.coa?.category?.name }}</div>
              </td>
              <td class="px-6 py-4 max-w-xs truncate" :class="isDark ? 'text-slate-300' : 'text-slate-600'">{{ item.description }}</td>
              <td class="px-6 py-4 text-right font-mono font-medium" :class="item.debit > 0 ? (isDark ? 'text-amber-400' : 'text-amber-600') : (isDark ? 'text-slate-600' : 'text-slate-300')">
                {{ item.debit > 0 ? `${getCurrencySymbol()} ${formatAmount(item.debit)}` : '-' }}
              </td>
              <td class="px-6 py-4 text-right font-mono font-medium" :class="item.credit > 0 ? 'text-emerald-500' : (isDark ? 'text-slate-600' : 'text-slate-300')">
                {{ item.credit > 0 ? `${getCurrencySymbol()} ${formatAmount(item.credit)}` : '-' }}
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    @click="openModal(item)" 
                    title="Edit Transaction"
                    class="p-2.5 rounded-xl border transition-colors"
                    :class="isDark ? 'bg-slate-700/50 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 border-slate-600/50' : 'bg-slate-100 text-slate-600 hover:text-emerald-600 hover:bg-slate-200 border-slate-300'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(item)" 
                    title="Delete Transaction"
                    class="p-2.5 rounded-xl border transition-colors"
                    :class="isDark ? 'bg-slate-700/50 text-slate-300 hover:text-rose-400 hover:bg-slate-700 border-slate-600/50' : 'bg-slate-100 text-slate-600 hover:text-rose-600 hover:bg-slate-200 border-slate-300'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="7" class="px-6 py-8 text-center" :class="isDark ? 'text-slate-500' : 'text-slate-400'">No transactions matching your filter.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Custom Pagination Bar with Dynamic Items Per Page -->
      <CustomPagination 
        v-model:currentPage="currentPage"
        v-model:itemsPerPage="itemsPerPage"
        :totalPages="totalPages"
        :totalItems="filteredTransactions.length"
      />
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="border rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-slate-300'">
        <div class="flex items-center justify-between border-b pb-4" :class="isDark ? 'border-slate-700/60' : 'border-slate-200'">
          <h3 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">{{ form.id ? 'Edit Transaction' : 'Record Transaction' }}</h3>
          <button @click="closeModal()" :class="isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" :class="isDark ? 'text-slate-300' : 'text-slate-700'">Date</label>
            <CustomDatePicker v-model="form.date" placeholder="Select Transaction Date" />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" :class="isDark ? 'text-slate-300' : 'text-slate-700'">Chart of Account (COA)</label>
            <CustomSelect v-model="form.coa_id" :options="coaFormOptions" placeholder="Select Account" />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" :class="isDark ? 'text-slate-300' : 'text-slate-700'">Description</label>
            <input 
              v-model="form.description" 
              type="text" 
              placeholder="e.g. Gaji Di Perusahaan A, Bensin Anak" 
              class="w-full border rounded-xl px-4 py-3 text-sm shadow-inner transition-colors focus:outline-none focus:border-emerald-500"
              :class="isDark ? 'bg-slate-900 border-slate-700/80 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider mb-2" :class="isDark ? 'text-slate-300' : 'text-slate-700'">Entry Type</label>
              <CustomSelect v-model="form.type" :options="typeFormOptions" placeholder="Select Type" />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider mb-2" :class="isDark ? 'text-slate-300' : 'text-slate-700'">Amount (Rp IDR)</label>
              <input 
                v-model="form.amount" 
                type="number" 
                placeholder="0" 
                class="w-full border rounded-xl px-4 py-3 text-sm font-mono shadow-inner transition-colors focus:outline-none focus:border-emerald-500"
                :class="isDark ? 'bg-slate-900 border-slate-700/80 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t" :class="isDark ? 'border-slate-700/60' : 'border-slate-200'">
          <button @click="closeModal()" class="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors" :class="isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'">Cancel</button>
          <button @click="saveTransaction()" class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all">Save Entry</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="border rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-slate-300'">
        <div class="w-14 h-14 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30 shadow-lg shadow-rose-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">Delete Transaction Record?</h3>
          <p class="text-sm max-w-md mx-auto" :class="isDark ? 'text-slate-400' : 'text-slate-600'">
            Are you sure you want to delete <strong :class="isDark ? 'text-white' : 'text-slate-900'">{{ itemToDelete?.description }}</strong>? This action will remove the journal record permanently.
          </p>
        </div>

        <div class="flex items-center justify-center space-x-3 sm:space-x-4 pt-2">
          <button @click="closeDeleteModal()" class="w-full py-3 rounded-xl text-sm font-semibold transition-colors" :class="isDark ? 'text-slate-300 bg-slate-700 hover:bg-slate-600' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'">
            Cancel
          </button>
          <button @click="deleteTransaction()" class="w-full py-3 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
