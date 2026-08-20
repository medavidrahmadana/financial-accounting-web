<script setup>
const { fetchApi } = useApi()
const { isDark } = useAppSettings()

const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedType = ref('')

// Pagination states
const currentPage = ref(1)
const itemsPerPage = ref(10)

const showModal = ref(false)
const showDeleteModal = ref(false)

const form = ref({
  id: null,
  name: '',
  type: 'expense'
})

const itemToDelete = ref(null)

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' }
]

const formTypeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' }
]

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

const totalPages = computed(() => {
  return Math.ceil(filteredCategories.value.length / itemsPerPage.value) || 1
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCategories.value.slice(start, end)
})

watch([searchQuery, selectedType, itemsPerPage], () => {
  currentPage.value = 1
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
        <h1 class="text-2xl sm:text-3xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-slate-900'">Master Category COA</h1>
        <p class="text-sm mt-1 transition-colors" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Manage financial category classifications for Chart of Accounts</p>
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
        <span>Add Category</span>
      </button>
    </div>

    <!-- Search & Custom Select Filter Controls -->
    <div class="border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
      <div class="relative w-full sm:max-w-md">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search category name..." 
          class="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          :class="isDark ? 'bg-slate-900 border-slate-700/80 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>

      <div class="flex items-center space-x-3 w-full sm:w-auto">
        <label class="text-xs font-semibold uppercase tracking-wider whitespace-nowrap" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Filter Type:</label>
        <div class="w-full sm:w-48">
          <CustomSelect v-model="selectedType" :options="typeOptions" placeholder="All Types" />
        </div>
      </div>
    </div>

    <!-- Responsive Data Table Container -->
    <div class="border rounded-2xl overflow-hidden shadow-xl transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/50'">
      <div v-if="loading" class="p-8 text-center" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Loading categories...</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm min-w-[600px]" :class="isDark ? 'text-slate-300' : 'text-slate-700'">
          <thead class="uppercase text-xs border-b font-bold tracking-wider transition-colors" :class="isDark ? 'bg-slate-900/60 text-slate-400 border-slate-700/80' : 'bg-slate-100/80 text-slate-600 border-slate-200'">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Category Name</th>
              <th class="px-6 py-4">Type</th>
              <th class="px-6 py-4">Total Accounts</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y transition-colors" :class="isDark ? 'divide-slate-700/50' : 'divide-slate-200'">
            <tr v-for="item in paginatedCategories" :key="item.id" class="transition-colors" :class="isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'">
              <td class="px-6 py-4 font-mono" :class="isDark ? 'text-slate-400' : 'text-slate-500'">#{{ item.id }}</td>
              <td class="px-6 py-4 font-semibold" :class="isDark ? 'text-white' : 'text-slate-900'">{{ item.name }}</td>
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  :class="item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'"
                >
                  {{ item.type }}
                </span>
              </td>
              <td class="px-6 py-4" :class="isDark ? 'text-slate-400' : 'text-slate-500'">{{ item.coas_count || 0 }} accounts</td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    @click="openModal(item)" 
                    title="Edit Category"
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
                    title="Delete Category"
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
            <tr v-if="filteredCategories.length === 0">
              <td colspan="5" class="px-6 py-8 text-center" :class="isDark ? 'text-slate-500' : 'text-slate-400'">No categories matching your filter.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Custom Pagination Bar -->
      <CustomPagination 
        v-model:currentPage="currentPage"
        v-model:itemsPerPage="itemsPerPage"
        :totalPages="totalPages"
        :totalItems="filteredCategories.length"
      />
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="border rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-slate-300'">
        <div class="flex items-center justify-between border-b pb-4" :class="isDark ? 'border-slate-700/60' : 'border-slate-200'">
          <h3 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">{{ form.id ? 'Edit Category' : 'Add Category' }}</h3>
          <button @click="closeModal()" :class="isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div class="space-y-5">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" :class="isDark ? 'text-slate-300' : 'text-slate-700'">Category Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g. Salary, Meal Expense" 
              class="w-full border rounded-xl px-4 py-3 text-sm shadow-inner transition-colors focus:outline-none focus:border-emerald-500"
              :class="isDark ? 'bg-slate-900 border-slate-700/80 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" :class="isDark ? 'text-slate-300' : 'text-slate-700'">Type</label>
            <CustomSelect v-model="form.type" :options="formTypeOptions" placeholder="Select Type" />
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t" :class="isDark ? 'border-slate-700/60' : 'border-slate-200'">
          <button @click="closeModal()" class="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors" :class="isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'">Cancel</button>
          <button @click="saveCategory()" class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all">Save Category</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="border rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center transition-colors" :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-slate-300'">
        <div class="w-14 h-14 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30 shadow-lg shadow-rose-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">Delete Category?</h3>
          <p class="text-sm max-w-md mx-auto" :class="isDark ? 'text-slate-400' : 'text-slate-600'">
            Are you sure you want to delete <strong :class="isDark ? 'text-white' : 'text-slate-900'">{{ itemToDelete?.name }}</strong>? This action will remove the category permanently.
          </p>
        </div>

        <div class="flex items-center justify-center space-x-3 sm:space-x-4 pt-2">
          <button @click="closeDeleteModal()" class="w-full py-3 rounded-xl text-sm font-semibold transition-colors" :class="isDark ? 'text-slate-300 bg-slate-700 hover:bg-slate-600' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'">
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
