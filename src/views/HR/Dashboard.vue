
<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      
      <!-- HEADER -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard HR Overview</h2>
        <div class="flex gap-2">
          <button @click="fetchAllData" class="inline-flex items-center justify-center rounded-lg border border-gray-300 py-2.5 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Refresh Data
          </button>
        </div>
      </div>

      <!-- KPI CARDS -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] p-5 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Karyawan</p>
          <h4 class="text-2xl font-bold text-brand-500">{{ counts.employees }}</h4>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] p-5 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Kandidat Rekrutmen</p>
          <h4 class="text-2xl font-bold text-blue-500">{{ counts.recruitment }}</h4>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] p-5 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cuti / Time Off</p>
          <h4 class="text-2xl font-bold text-orange-500">{{ counts.timeoff }}</h4>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] p-5 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Armada</p>
          <h4 class="text-2xl font-bold text-green-500">{{ counts.fleet }}</h4>
        </div>
      </div>

      <!-- CHARTS AREA -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <!-- MAIN BAR CHART -->
        <div class="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-800 shadow-sm p-5">
          <h3 class="font-bold text-gray-800 dark:text-white mb-4">Aktivitas Modul HR</h3>
          <div v-if="isLoading" class="h-[300px] flex items-center justify-center text-gray-500">Memuat grafik...</div>
          <apexchart v-else type="bar" height="300" :options="barOptions" :series="barSeries"></apexchart>
        </div>

        <!-- DONUT CHART (FLEET) -->
        <div class="col-span-1 rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-800 shadow-sm p-5">
          <h3 class="font-bold text-gray-800 dark:text-white mb-4">Status Kendaraan</h3>
          <div v-if="isLoading" class="h-[300px] flex items-center justify-center text-gray-500">Memuat grafik...</div>
          <apexchart v-else type="donut" height="300" :options="fleetOptions" :series="fleetSeries"></apexchart>
        </div>

        <!-- DONUT CHART (PAYROLL) -->
        <div class="col-span-1 rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-800 shadow-sm p-5">
          <h3 class="font-bold text-gray-800 dark:text-white mb-4">Status Payslip</h3>
          <div v-if="isLoading" class="h-[300px] flex items-center justify-center text-gray-500">Memuat grafik...</div>
          <apexchart v-else type="donut" height="300" :options="payrollOptions" :series="payrollSeries"></apexchart>
        </div>

        <!-- RADAR CHART (OVERALL SPREAD) -->
        <div class="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-800 shadow-sm p-5">
          <h3 class="font-bold text-gray-800 dark:text-white mb-4">Distribusi Data HR</h3>
          <div v-if="isLoading" class="h-[300px] flex items-center justify-center text-gray-500">Memuat grafik...</div>
          <apexchart v-else type="radar" height="300" :options="radarOptions" :series="radarSeries"></apexchart>
        </div>

      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import VueApexCharts from 'vue3-apexcharts'

// Services
import { employeesService } from '@/services/hr/employees.service'
import { recruitmentService } from '@/services/hr/recruitment.service'
import { timeOffService } from '@/services/hr/time-off.service'
import { appraisalsService } from '@/services/hr/appraisals.service'
import { referralsService } from '@/services/hr/referrals.service'
import { payrollService } from '@/services/hr/payroll.service'
import { lunchService } from '@/services/hr/lunch.service'
import { fleetService } from '@/services/hr/fleet.service'
import { attendancesService } from '@/services/hr/attendances.service'

const apexchart = VueApexCharts
const isLoading = ref(false)

// State holding counts
const counts = ref({
  employees: 0,
  recruitment: 0,
  timeoff: 0,
  appraisals: 0,
  referrals: 0,
  payroll: 0,
  lunch: 0,
  fleet: 0,
  attendances: 0
})

const fleetData = ref<any[]>([])
const payrollData = ref<any[]>([])

// Check if dark mode is active
const isDark = ref(document.documentElement.classList.contains('dark'))

// Observer for dark mode changes
onMounted(() => {
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  fetchAllData()
})

const fetchAllData = async () => {
  isLoading.value = true
  try {
    const [emp, rec, time, app, ref, pay, lun, flt, att] = await Promise.all([
      employeesService.getAll().catch(()=>[]),
      recruitmentService.getAll().catch(()=>[]),
      timeOffService.getAll().catch(()=>[]),
      appraisalsService.getAll().catch(()=>[]),
      referralsService.getAll().catch(()=>[]),
      payrollService.getAll().catch(()=>[]),
      lunchService.getAll().catch(()=>[]),
      fleetService.getAll().catch(()=>[]),
      attendancesService.getAll().catch(()=>[])
    ])

    counts.value = {
      employees: emp.length,
      recruitment: rec.length,
      timeoff: time.length,
      appraisals: app.length,
      referrals: ref.length,
      payroll: pay.length,
      lunch: lun.length,
      fleet: flt.length,
      attendances: att.length
    }
    
    fleetData.value = flt
    payrollData.value = pay

  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// ---------------- CHARTS CONFIGURATION ----------------

// 1. BAR CHART
const barSeries = computed(() => [{
  name: 'Jumlah Dokumen/Data',
  data: [
    counts.value.employees, counts.value.recruitment, counts.value.timeoff, 
    counts.value.appraisals, counts.value.referrals, counts.value.payroll, 
    counts.value.lunch, counts.value.fleet, counts.value.attendances
  ]
}])

const barOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
  dataLabels: { enabled: false },
  colors: ['#3b82f6'],
  xaxis: {
    categories: ['Karyawan', 'Rekrutmen', 'Time Off', 'Penilaian', 'Referensi', 'Penggajian', 'Makan', 'Kendaraan', 'Kehadiran'],
    labels: { style: { colors: isDark.value ? '#9ca3af' : '#4b5563' } }
  },
  yaxis: { labels: { style: { colors: isDark.value ? '#9ca3af' : '#4b5563' } } },
  grid: { borderColor: isDark.value ? '#374151' : '#e5e7eb' },
  tooltip: { theme: isDark.value ? 'dark' : 'light' }
}))

// 2. DONUT CHART (FLEET)
const fleetSeries = computed(() => {
  const active = fleetData.value.filter(f => f.state === 'Active' || f.state === 'Registered').length
  const maintenance = fleetData.value.filter(f => f.state === 'Maintenance').length
  const sold = fleetData.value.filter(f => f.state === 'Sold').length
  return [active, maintenance, sold]
})

const fleetOptions = computed(() => ({
  chart: { type: 'donut', background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  labels: ['Aktif/Terdaftar', 'Perawatan', 'Terjual'],
  colors: ['#10b981', '#f59e0b', '#6b7280'],
  legend: { position: 'bottom', labels: { colors: isDark.value ? '#d1d5db' : '#374151' } },
  stroke: { show: false }
}))

// 3. DONUT CHART (PAYROLL)
const payrollSeries = computed(() => {
  const done = payrollData.value.filter(p => p.state === 'Done').length
  const draft = payrollData.value.filter(p => p.state === 'Draft').length
  const cancelled = payrollData.value.filter(p => p.state === 'Cancelled').length
  return [done, draft, cancelled]
})

const payrollOptions = computed(() => ({
  chart: { type: 'donut', background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  labels: ['Selesai', 'Draft', 'Batal'],
  colors: ['#10b981', '#3b82f6', '#ef4444'],
  legend: { position: 'bottom', labels: { colors: isDark.value ? '#d1d5db' : '#374151' } },
  stroke: { show: false }
}))

// 4. RADAR CHART
const radarSeries = computed(() => [{
  name: 'Distribusi',
  data: [
    counts.value.recruitment, counts.value.timeoff, counts.value.appraisals, 
    counts.value.payroll, counts.value.attendances
  ]
}])

const radarOptions = computed(() => ({
  chart: { type: 'radar', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  labels: ['Rekrutmen', 'Time Off', 'Penilaian', 'Payroll', 'Kehadiran'],
  colors: ['#8b5cf6'],
  stroke: { width: 2 },
  fill: { opacity: 0.2 },
  markers: { size: 4 },
  yaxis: { show: false },
  xaxis: { labels: { style: { colors: isDark.value ? '#9ca3af' : '#4b5563' } } }
}))
</script>
