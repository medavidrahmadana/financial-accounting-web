<script setup>
const { fetchApi } = useApi()
const toast = inject('toast')

const transactions = ref([])
const coas = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDeleteModal = ref(false)

const form = ref({
  id: null,
  date: new Date().toISOString().split('T')[0],
  coa_id: '',
  description: '',
  type: 'credit', // 'debit' or 'credit'
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
    toast?.addToast('Failed to load transaction data', 'error')
  } finally {
    loading.value = false
  }
}

const formatCurrency = (val) => {
  if (!val || val === 0) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
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
    toast?.addToast('Please fill in all required fields', 'error')
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
      toast?.addToast('Transaction updated successfully!', 'success')
    } else {
      await fetchApi('/transactions', {
        method: 'POST',
        body: payload
      })
      toast?.addToast('Transaction recorded successfully!', 'success')
    }
    closeModal()
    loadData()
  } catch (err) {
    toast?.addToast('Failed to save transaction', 'error')
  }
}

const deleteTransaction = async () => {
  if (!itemToDelete.value) return
  try {
    await fetchApi(`/transactions/${itemToDelete.value.id}`, { method: 'DELETE' })
    toast?.addToast('Transaction deleted successfully!', 'success')
    closeDeleteModal()
    loadData()
  } catch (err) {
    toast?.addToast('Failed to delete transaction', 'error')
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
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Financial Transactions</h1>
        <p class="text-slate-400 text-sm mt-1">Record and manage debit & credit journal entries</p>
      </div>
      <button 
        @click="openModal()" 
        class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10 transition-all self-start sm:self-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>New Transaction</span>
      </button>
    </div>

    <!-- Responsive Data Table Container -->
    <div class="bg-slate-800 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
      <div v-if="loading" class="p-8 text-center text-slate-400">Loading transaction history...</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300 min-w-[750px]">
          <thead class="bg-slate-900/60 text-slate-400 uppercase text-xs border-b border-slate-700/80">
            <tr>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4">COA Code</th>
              <th class="px-6 py-4">COA Name</th>
              <th class="px-6 py-4">Description</th>
              <th class="px-6 py-4 text-right">Debit</th>
              <th class="px-6 py-4 text-right">Credit</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-for="item in transactions" :key="item.id" class="hover:bg-slate-700/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400">{{ formatDate(item.date) }}</td>
              <td class="px-6 py-4 font-mono font-bold text-emerald-400">{{ item.coa?.code || '-' }}</td>
              <td class="px-6 py-4 font-semibold text-white">
                <div>{{ item.coa?.name || '-' }}</div>
                <div class="text-xs text-slate-400 font-normal">{{ item.coa?.category?.name }}</div>
              </td>
              <td class="px-6 py-4 text-slate-300 max-w-xs truncate">{{ item.description }}</td>
              <td class="px-6 py-4 text-right font-mono font-medium" :class="item.debit > 0 ? 'text-amber-400' : 'text-slate-600'">
                {{ formatCurrency(item.debit) }}
              </td>
              <td class="px-6 py-4 text-right font-mono font-medium" :class="item.credit > 0 ? 'text-emerald-400' : 'text-slate-600'">
                {{ formatCurrency(item.credit) }}
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    @click="openModal(item)" 
                    title="Edit Transaction"
                    class="p-2.5 rounded-xl bg-slate-700/50 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 border border-slate-600/50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(item)" 
                    title="Delete Transaction"
                    class="p-2.5 rounded-xl bg-slate-700/50 text-slate-300 hover:text-rose-400 hover:bg-slate-700 border border-slate-600/50 transition-colors"
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
            <tr v-if="transactions.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-slate-500">No transactions recorded yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Responsive Form Add/Edit Transaction Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <h3 class="text-xl font-bold text-white">{{ form.id ? 'Edit Transaction' : 'Record Transaction' }}</h3>
          <button @click="closeModal()" class="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Date</label>
            <input 
              v-model="form.date" 
              type="date" 
              class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm shadow-inner transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Chart of Account (COA)</label>
            <div class="relative">
              <select 
                v-model="form.coa_id" 
                class="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm shadow-inner transition-colors cursor-pointer"
              >
                <option v-for="coa in coas" :key="coa.id" :value="coa.id" class="bg-slate-800 text-slate-100 py-2">
                  {{ coa.code }} - {{ coa.name }} ({{ coa.category?.name }})
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Description</label>
            <input 
              v-model="form.description" 
              type="text" 
              placeholder="e.g. Gaji Di Perusahaan A, Bensin Anak" 
              class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm shadow-inner transition-colors"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Entry Type</label>
              <div class="relative">
                <select 
                  v-model="form.type" 
                  class="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm shadow-inner transition-colors cursor-pointer"
                >
                  <option value="credit" class="bg-slate-800 text-slate-100 py-2">Credit (Income)</option>
                  <option value="debit" class="bg-slate-800 text-slate-100 py-2">Debit (Expense)</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Amount (Rp)</label>
              <input 
                v-model="form.amount" 
                type="number" 
                placeholder="0" 
                class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm font-mono shadow-inner transition-colors"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700/60">
          <button @click="closeModal()" class="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">Cancel</button>
          <button @click="saveTransaction()" class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all">Save Entry</button>
        </div>
      </div>
    </div>

    <!-- Custom Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        <div class="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30 shadow-lg shadow-rose-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-bold text-white">Delete Transaction Record?</h3>
          <p class="text-sm text-slate-400 max-w-md mx-auto">
            Are you sure you want to delete <strong class="text-white">'{{ itemToDelete?.description }}'</strong>? This action will remove the journal record permanently.
          </p>
        </div>

        <div class="flex items-center justify-center space-x-3 sm:space-x-4 pt-2">
          <button @click="closeDeleteModal()" class="w-full py-3 rounded-xl text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">
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
