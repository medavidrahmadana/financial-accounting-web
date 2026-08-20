<script setup>
const { fetchApi } = useApi()

const coas = ref([])
const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')

const showModal = ref(false)
const showDeleteModal = ref(false)

const form = ref({
  id: null,
  code: '',
  name: '',
  category_id: ''
})

const itemToDelete = ref(null)

const loadData = async () => {
  loading.value = true
  try {
    const [resCoas, resCategories] = await Promise.all([
      fetchApi('/coas'),
      fetchApi('/categories')
    ])
    coas.value = resCoas.data
    categories.value = resCategories.data
  } catch (err) {
    console.error('Failed to load COA data', err)
  } finally {
    loading.value = false
  }
}

const filteredCoas = computed(() => {
  return coas.value.filter(item => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = item.name.toLowerCase().includes(q) || String(item.code).includes(q)
    const matchesCategory = selectedCategory.value === '' || String(item.category_id) === String(selectedCategory.value)
    return matchesSearch && matchesCategory
  })
})

const openModal = (item = null) => {
  if (item) {
    form.value = {
      id: item.id,
      code: item.code,
      name: item.name,
      category_id: item.category_id
    }
  } else {
    form.value = {
      id: null,
      code: '',
      name: '',
      category_id: categories.value.length > 0 ? categories.value[0].id : ''
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

const saveCoa = async () => {
  if (!form.value.code || !form.value.name || !form.value.category_id) return
  try {
    if (form.value.id) {
      await fetchApi(`/coas/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await fetchApi('/coas', {
        method: 'POST',
        body: form.value
      })
    }
    closeModal()
    loadData()
  } catch (err) {
    alert('Failed to save Chart of Account')
  }
}

const deleteCoa = async () => {
  if (!itemToDelete.value) return
  try {
    await fetchApi(`/coas/${itemToDelete.value.id}`, { method: 'DELETE' })
    closeDeleteModal()
    loadData()
  } catch (err) {
    alert('Failed to delete Chart of Account')
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
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Master Chart of Accounts (COA)</h1>
        <p class="text-slate-400 text-sm mt-1">Manage financial account codes and descriptions</p>
      </div>
      <button 
        @click="openModal()" 
        class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10 transition-all self-start sm:self-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add COA</span>
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      <div class="relative w-full sm:max-w-md">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search by code or account name..." 
          class="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>

      <div class="flex items-center space-x-3 w-full sm:w-auto">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Category:</label>
        <div class="relative w-full sm:w-48">
          <select 
            v-model="selectedCategory" 
            class="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl pl-4 pr-10 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Responsive Data Table Container -->
    <div class="bg-slate-800 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
      <div v-if="loading" class="p-8 text-center text-slate-400">Loading Chart of Accounts...</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300 min-w-[600px]">
          <thead class="bg-slate-900/60 text-slate-400 uppercase text-xs border-b border-slate-700/80">
            <tr>
              <th class="px-6 py-4">Code</th>
              <th class="px-6 py-4">Account Name</th>
              <th class="px-6 py-4">Category</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-for="item in filteredCoas" :key="item.id" class="hover:bg-slate-700/30 transition-colors">
              <td class="px-6 py-4 font-mono font-bold text-emerald-400">{{ item.code }}</td>
              <td class="px-6 py-4 font-semibold text-white">{{ item.name }}</td>
              <td class="px-6 py-4">
                <span class="bg-slate-700/80 text-slate-200 px-3 py-1 rounded-full text-xs font-semibold border border-slate-600/50">
                  {{ item.category?.name || 'Uncategorized' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    @click="openModal(item)" 
                    title="Edit COA"
                    class="p-2.5 rounded-xl bg-slate-700/50 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 border border-slate-600/50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(item)" 
                    title="Delete COA"
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
            <tr v-if="filteredCoas.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-slate-500">No Chart of Accounts matching your filter.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <h3 class="text-xl font-bold text-white">{{ form.id ? 'Edit COA' : 'Add COA' }}</h3>
          <button @click="closeModal()" class="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Account Code</label>
            <input 
              v-model="form.code" 
              type="number" 
              placeholder="e.g. 401, 602" 
              class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm font-mono shadow-inner transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Account Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g. Gaji Karyawan, Bensin" 
              class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm shadow-inner transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Category</label>
            <div class="relative">
              <select 
                v-model="form.category_id" 
                class="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm shadow-inner transition-colors cursor-pointer"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-slate-800 text-slate-100 py-2">
                  {{ cat.name }} ({{ cat.type }})
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700/60">
          <button @click="closeModal()" class="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">Cancel</button>
          <button @click="saveCoa()" class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all">Save COA</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        <div class="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30 shadow-lg shadow-rose-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-bold text-white">Delete Account Code?</h3>
          <p class="text-sm text-slate-400 max-w-md mx-auto">
            Are you sure you want to delete <strong class="text-white">'{{ itemToDelete?.code }} - {{ itemToDelete?.name }}'</strong>? This action will remove the account permanently.
          </p>
        </div>

        <div class="flex items-center justify-center space-x-3 sm:space-x-4 pt-2">
          <button @click="closeDeleteModal()" class="w-full py-3 rounded-xl text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">
            Cancel
          </button>
          <button @click="deleteCoa()" class="w-full py-3 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
