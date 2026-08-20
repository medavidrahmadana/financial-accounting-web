<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select Date'
  }
})

const emit = defineEmits(['update:modelValue'])
const { isDark } = useAppSettings()

const isOpen = ref(false)
const containerRef = ref(null)

const today = new Date()
const currentYear = ref(props.modelValue ? new Date(props.modelValue).getFullYear() : today.getFullYear())
const currentMonth = ref(props.modelValue ? new Date(props.modelValue).getMonth() : today.getMonth())

const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOffset = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const daysGrid = computed(() => {
  const grid = []
  for (let i = 0; i < firstDayOffset.value; i++) {
    grid.push(null)
  }
  for (let d = 1; d <= daysInMonth.value; d++) {
    grid.push(d)
  }
  return grid
})

const togglePicker = () => {
  isOpen.value = !isOpen.value
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDay = (day) => {
  if (!day) return
  const m = String(currentMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  const formatted = `${currentYear.value}-${m}-${d}`
  emit('update:modelValue', formatted)
  isOpen.value = false
}

const clearDate = () => {
  emit('update:modelValue', '')
  isOpen.value = false
}

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const parts = props.modelValue.split('-')
  if (parts.length !== 3) return props.modelValue
  
  const y = parts[0]
  const mIdx = parseInt(parts[1], 10) - 1
  const d = parts[2]
  
  const fullMonth = monthNamesEn[mIdx] || ''
  return `${d} ${fullMonth} ${y}`
})

const isSelected = (day) => {
  if (!day || !props.modelValue) return false
  const m = String(currentMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  const formatted = `${currentYear.value}-${m}-${d}`
  return props.modelValue === formatted
}

const isToday = (day) => {
  if (!day) return false
  return today.getFullYear() === currentYear.value && 
         today.getMonth() === currentMonth.value && 
         today.getDate() === day
}

const handleClickOutside = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="containerRef" class="relative inline-block w-full">
    <!-- Custom Trigger Input Box -->
    <div 
      @click="togglePicker" 
      class="w-full border rounded-xl px-3.5 py-2 text-sm flex items-center justify-between cursor-pointer select-none transition-all shadow-inner"
      :class="[
        isDark ? 'bg-slate-900 border-slate-700/80 hover:border-emerald-500/80 text-white' : 'bg-white border-slate-300 hover:border-emerald-500 text-slate-900',
        isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''
      ]"
    >
      <span :class="displayValue ? (isDark ? 'text-white font-medium' : 'text-slate-900 font-medium') : (isDark ? 'text-slate-500' : 'text-slate-400')">
        {{ displayValue || placeholder }}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :class="isDark ? 'text-slate-400' : 'text-slate-500'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    </div>

    <!-- Custom Popover Calendar -->
    <div 
      v-if="isOpen" 
      class="absolute z-50 mt-2 left-0 w-72 border rounded-2xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
      :class="isDark ? 'bg-slate-900/95 backdrop-blur-md border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200'"
    >
      <!-- Header Nav -->
      <div class="flex items-center justify-between pb-2 border-b" :class="isDark ? 'border-slate-800' : 'border-slate-100'">
        <button @click.stop="prevMonth" type="button" class="p-1.5 rounded-lg transition-colors" :class="isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <span class="text-sm font-bold tracking-wide" :class="isDark ? 'text-white' : 'text-slate-900'">
          {{ monthNamesEn[currentMonth] }} {{ currentYear }}
        </span>

        <button @click.stop="nextMonth" type="button" class="p-1.5 rounded-lg transition-colors" :class="isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <!-- Days Grid Header -->
      <div class="grid grid-cols-7 text-center text-xs font-semibold" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
        <span v-for="d in dayNames" :key="d">{{ d }}</span>
      </div>

      <!-- Days Grid Body -->
      <div class="grid grid-cols-7 gap-1 text-center text-xs">
        <div v-for="(day, idx) in daysGrid" :key="idx">
          <button 
            v-if="day"
            @click.stop="selectDay(day)"
            type="button"
            class="w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-all"
            :class="[
              isSelected(day) ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30' :
              isToday(day) ? (isDark ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-emerald-50 text-emerald-600 border border-emerald-300 font-bold') :
              (isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')
            ]"
          >
            {{ day }}
          </button>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-between pt-2 border-t text-xs" :class="isDark ? 'border-slate-800' : 'border-slate-100'">
        <button @click.stop="clearDate" type="button" class="font-medium" :class="isDark ? 'text-slate-500 hover:text-rose-400' : 'text-slate-400 hover:text-rose-600'">Clear</button>
        <button @click.stop="selectDay(today.getDate())" type="button" class="text-emerald-500 font-bold hover:underline">Today</button>
      </div>
    </div>
  </div>
</template>
