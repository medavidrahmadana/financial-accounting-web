<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => [] // Array of { value, label }
  },
  placeholder: {
    type: String,
    default: 'Select Option'
  },
  placement: {
    type: String,
    default: 'bottom' // 'bottom' or 'top'
  }
})

const emit = defineEmits(['update:modelValue'])
const { isDark } = useAppSettings()

const isOpen = ref(false)
const containerRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (opt) => {
  emit('update:modelValue', opt.value)
  isOpen.value = false
}

const selectedLabel = computed(() => {
  const found = props.options.find(o => String(o.value) === String(props.modelValue))
  return found ? found.label : props.placeholder
})

const isSelected = (val) => {
  return String(props.modelValue) === String(val)
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
    <!-- Trigger Button -->
    <div 
      @click="toggleDropdown" 
      class="w-full border rounded-xl px-3.5 py-2 text-sm flex items-center justify-between cursor-pointer select-none transition-all shadow-inner"
      :class="[
        isDark ? 'bg-slate-900 border-slate-700/80 hover:border-emerald-500/80 text-white' : 'bg-white border-slate-300 hover:border-emerald-500 text-slate-900',
        isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''
      ]"
    >
      <span class="truncate pr-2 font-medium" :class="modelValue !== '' ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-400' : 'text-slate-400')">
        {{ selectedLabel }}
      </span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="w-4 h-4 shrink-0 transition-transform duration-200" 
        :class="[
          isOpen ? 'rotate-180 text-emerald-500' : (isDark ? 'text-slate-400' : 'text-slate-500')
        ]"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>

    <!-- Custom Popover Menu Options -->
    <div 
      v-if="isOpen" 
      class="absolute z-50 right-0 w-full min-w-[160px] border rounded-2xl p-1.5 shadow-2xl space-y-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 scrollbar-thin"
      :class="[
        isDark ? 'bg-slate-900/95 backdrop-blur-md border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200',
        placement === 'top' ? 'bottom-full mb-2' : 'mt-2 left-0 sm:left-auto'
      ]"
    >
      <div 
        v-for="opt in options" 
        :key="opt.value"
        @click.stop="selectOption(opt)"
        class="px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center justify-between"
        :class="[
          isSelected(opt.value) ? 'bg-emerald-500/20 text-emerald-500 font-bold border border-emerald-500/30' : (isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')
        ]"
      >
        <span class="truncate">{{ opt.label }}</span>
        <svg v-if="isSelected(opt.value)" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
    </div>
  </div>
</template>
