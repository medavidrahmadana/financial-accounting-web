<script setup>
const { fetchApi } = useApi()

const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedType = ref('')

const showModal = ref(false)
const showDeleteModal = ref(false)

const form = ref({
  id: null,
  name: '',
  type: 'expense'
})

const itemToDelete = ref(null)

const loadCategories = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Failed to load categories', err)
  } finally {
    loading.value = false
  }
}

const filteredCategories = computed(() => {
  return categories.value.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = selectedType.value === '' || cat.type === selectedType.value
    return matchesSearch && matchesType
  })
})

const openModal = (category = null) => {
  if (category) {
    form.value = { ...category }
  } else {
    form.value = { id: null, name: '', type: 'expense' }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const confirmDelete = (category) => {
  itemToDelete.value = category
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const saveCategory = async () => {
  if (!form.value.name) return
  try {
    if (form.value.id) {
      await fetchApi(`/categories/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await fetchApi('/categories', {
        method: 'POST',
        body: form.value
      })
    }
    closeModal()
    loadCategories()
  } catch (err) {
    alert('Failed to save category')
  }
}

const deleteCategory = async () => {
  if (!itemToDelete.value) return
  try {
    await fetchApi(`/categories/${itemToDelete.value.id}`, { method: 'DELETE' })
    closeDeleteModal()
    loadCategories()
  } catch (err) {
    alert('Failed to delete category')
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Master Category COA</h1>
        <p class="text-slate-400 text-sm mt-1">Manage financial category classifications for Chart of Accounts</p>
      </div>
      <button 
        @click="openModal()" 
        class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10 transition-all self-start sm:self-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add Category</span>
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      <div class="relative w-full sm:max-w-md">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search category name..." 
          class="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>

      <div class="flex items-center space-x-3 w-full sm:w-auto">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Type:</label>
        <div class="relative w-full sm:w-44">
          <select 
            v-model="selectedType" 
            class="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl pl-4 pr-10 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Responsive Data Table Container -->
    <div class="bg-slate-800 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
      <div v-if="loading" class="p-8 text-center text-slate-400">Loading categories...</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300 min-w-[600px]">
          <thead class="bg-slate-900/60 text-slate-400 uppercase text-xs border-b border-slate-700/80">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Category Name</th>
              <th class="px-6 py-4">Type</th>
              <th class="px-6 py-4">Total Accounts</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-for="item in filteredCategories" :key="item.id" class="hover:bg-slate-700/30 transition-colors">
              <td class="px-6 py-4 font-mono text-slate-400">#{{ item.id }}</td>
              <td class="px-6 py-4 font-semibold text-white">{{ item.name }}</td>
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  :class="item.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'"
                >
                  {{ item.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-400">{{ item.coas_count || 0 }} accounts</td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    @click="openModal(item)" 
                    title="Edit Category"
                    class="p-2.5 rounded-xl bg-slate-700/50 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 border border-slate-600/50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(item)" 
                    title="Delete Category"
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
            <tr v-if="filteredCategories.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">No categories matching your filter.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <h3 class="text-xl font-bold text-white">{{ form.id ? 'Edit Category' : 'Add Category' }}</h3>
          <button @click="closeModal()" class="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Category Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g. Salary, Meal Expense" 
              class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm shadow-inner transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Type</label>
            <div class="relative">
              <select 
                v-model="form.type" 
                class="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm shadow-inner transition-colors cursor-pointer"
              >
                <option value="income" class="bg-slate-800 text-slate-100 py-2">Income</option>
                <option value="expense" class="bg-slate-800 text-slate-100 py-2">Expense</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700/60">
          <button @click="closeModal()" class="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">Cancel</button>
          <button @click="saveCategory()" class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all">Save Category</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        <div class="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30 shadow-lg shadow-rose-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-bold text-white">Delete Category?</h3>
          <p class="text-sm text-slate-400 max-w-md mx-auto">
            Are you sure you want to delete <strong class="text-white">'{{ itemToDelete?.name }}'</strong>? This action will remove the category permanently.
          </p>
        </div>

        <div class="flex items-center justify-center space-x-3 sm:space-x-4 pt-2">
          <button @click="closeDeleteModal()" class="w-full py-3 rounded-xl text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">
            Cancel
          </button>
          <button @click="deleteCategory()" class="w-full py-3 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
