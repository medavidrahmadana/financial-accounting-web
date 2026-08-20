<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    default: 0
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:currentPage', 'update:itemsPerPage'])
const { isDark } = useAppSettings()

const perPageOptions = [
  { value: 5, label: '5 / page' },
  { value: 10, label: '10 / page' },
  { value: 25, label: '25 / page' },
  { value: 50, label: '50 / page' },
  { value: 100, label: '100 / page' }
]

const selectedPerPage = computed({
  get: () => props.itemsPerPage,
  set: (val) => emit('update:itemsPerPage', val)
})

const changePage = (p) => {
  if (p >= 1 && p <= props.totalPages) {
    emit('update:currentPage', p)
  }
}

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})
</script>

<template>
  <div 
    class="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-200"
    :class="isDark ? 'bg-slate-900/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'"
  >
    <!-- Left Side: Pagination Prev/Next Controls + Show Entries Info -->
    <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
      <!-- Prev / Page Numbers / Next Buttons -->
      <div class="flex items-center space-x-2">
        <!-- Prev Button -->
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1"
          :class="currentPage <= 1 ? (isDark ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40' : 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-100') : (isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'border-slate-300 text-slate-700 hover:bg-white hover:text-slate-900 shadow-sm')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span>Prev</span>
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center space-x-1">
          <button 
            v-for="p in (totalPages || 1)" 
            :key="p"
            @click="changePage(p)"
            class="w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center"
            :class="currentPage === p ? (isDark ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20') : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900')"
          >
            {{ p }}
          </button>
        </div>

        <!-- Next Button -->
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage >= totalPages"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1"
          :class="currentPage >= totalPages ? (isDark ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40' : 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-100') : (isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'border-slate-300 text-slate-700 hover:bg-white hover:text-slate-900 shadow-sm')"
        >
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <!-- Items Info -->
      <div class="text-xs" :class="isDark ? 'text-slate-400' : 'text-slate-600'">
        Showing <span class="font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">{{ startItem }}</span> to <span class="font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">{{ endItem }}</span> of <span class="font-bold" :class="isDark ? 'text-white' : 'text-slate-900'">{{ totalItems }}</span> entries
      </div>
    </div>

    <!-- Right Side: Custom Popover Dropdown Per Page -->
    <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
      <label class="text-xs font-semibold uppercase tracking-wider whitespace-nowrap" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Show:</label>
      <div class="w-32">
        <CustomSelect v-model="selectedPerPage" :options="perPageOptions" placeholder="Select limit" placement="top" />
      </div>
    </div>
  </div>
</template>
