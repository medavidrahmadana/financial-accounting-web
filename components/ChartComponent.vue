<script setup>
import { Bar } from 'vue-chartjs'

const props = defineProps({
  reportData: {
    type: Object,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
})

const chartData = computed(() => {
  if (!props.reportData?.total_income || !props.reportData?.total_expense) {
    return { labels: [], datasets: [] }
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0')
    return `${props.year}-${m}`
  })

  const incomeValues = months.map(m => props.reportData.total_income[m] || 0)
  const expenseValues = months.map(m => props.reportData.total_expense[m] || 0)

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income / Revenue (Rp)',
        backgroundColor: '#10B981',
        borderRadius: 8,
        data: incomeValues
      },
      {
        label: 'Expense (Rp)',
        backgroundColor: '#F59E0B',
        borderRadius: 8,
        data: expenseValues
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94A3B8',
        font: {
          family: 'sans-serif',
          weight: '600'
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.parsed.y)
          }
          return label
        }
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#94A3B8' },
      grid: { color: 'rgba(51, 65, 85, 0.4)' }
    },
    y: {
      beginAtZero: true,
      suggestedMin: 0,
      suggestedMax: 1000000,
      ticks: { 
        color: '#94A3B8',
        callback: function(value) {
          if (value === 0) return 'Rp 0'
          if (Math.abs(value) >= 1000000) {
            return 'Rp ' + (value / 1000000).toLocaleString('id-ID') + 'M'
          }
          if (Math.abs(value) >= 1000) {
            return 'Rp ' + (value / 1000).toLocaleString('id-ID') + 'k'
          }
          return 'Rp ' + value
        }
      },
      grid: { color: 'rgba(51, 65, 85, 0.4)' }
    }
  }
}
</script>

<template>
  <div class="h-80 w-full">
    <ClientOnly>
      <Bar :data="chartData" :options="chartOptions" />
    </ClientOnly>
  </div>
</template>
