<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      
      <!-- HEADER -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Executive HR Analytics Dashboard</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Data terintegrasi dari seluruh modul HR: Kepegawaian, Kehadiran, Lembur, Kasbon, Reimbursement, Kontrak, Penggajian & THR.
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="fetchAllData" class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-gray-800">
            <svg :class="['h-4 w-4 text-gray-600 dark:text-gray-300', isLoading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Muat Ulang Data
          </button>
        </div>
      </div>

      <!-- KPI METRIC CARDS (8 UTAMA) -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 mb-6">
        
        <!-- 1. Total Karyawan -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Karyawan</p>
            <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ counts.employees }} <span class="text-xs font-normal text-gray-400">Orang</span></h4>
          <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{{ counts.activeContracts }} Kontrak Aktif</p>
        </div>

        <!-- 2. Absensi & Hadir -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Presensi</p>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ counts.attendances }} <span class="text-xs font-normal text-gray-400">Log</span></h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ counts.timeoff }} Pengajuan Izin/Cuti</p>
        </div>

        <!-- 3. Anggaran Payroll -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Penggajian</p>
            <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{{ counts.payroll }} <span class="text-xs font-normal text-gray-400">Slip</span></h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Total THP: {{ formatCompact(totalNetSalary) }}</p>
        </div>

        <!-- 4. Total Anggaran THR -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Anggaran THR</p>
            <div class="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">{{ formatCompact(totalTHR) }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ counts.thr }} Penerima Terdata</p>
        </div>

        <!-- 5. Lembur (Overtime) -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Jam Lembur Disetujui</p>
            <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{{ counts.overtimeHours }} <span class="text-xs font-normal text-gray-400">Jam</span></h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ counts.overtimeCount }} Pengajuan Lembur</p>
        </div>

        <!-- 6. Kasbon & Pinjaman -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Kasbon Karyawan</p>
            <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-red-600 dark:text-red-400 mt-2">{{ formatCompact(totalLoans) }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ counts.loans }} Debitur Pinjaman</p>
        </div>

        <!-- 7. Reimbursement (Expenses) -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Klaim Biaya (Reimburse)</p>
            <div class="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-teal-600 dark:text-teal-400 mt-2">{{ formatCompact(totalExpenses) }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ counts.expenses }} Klaim Diajukan</p>
        </div>

        <!-- 8. Disiplin & SP -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Surat Peringatan (SP)</p>
            <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{{ counts.warnings }} <span class="text-xs font-normal text-gray-400">Berkas</span></h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ counts.recruitment }} Pelamar Rekrutmen</p>
        </div>

      </div>

      <!-- CHARTS AREA -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <!-- MAIN BAR CHART: DISTRIBUSI SELURUH MODUL -->
        <div class="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm p-5">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-gray-900 dark:text-white">Aktivitas & Beban Kerja Modul HR</h3>
            <span class="text-xs text-gray-400">Real-time DB Sync</span>
          </div>
          <div v-if="isLoading" class="h-[320px] flex items-center justify-center text-gray-500">Memuat data modul...</div>
          <apexchart v-else type="bar" height="320" :options="barOptions" :series="barSeries"></apexchart>
        </div>

        <!-- DONUT CHART (PAYROLL STATUS) -->
        <div class="col-span-1 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm p-5">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">Status Slip Gaji (Payroll)</h3>
          <div v-if="isLoading" class="h-[320px] flex items-center justify-center text-gray-500">Memuat data...</div>
          <apexchart v-else type="donut" height="320" :options="payrollOptions" :series="payrollSeries"></apexchart>
        </div>

        <!-- RADAR CHART (ORGANIZATIONAL BALANCE) -->
        <div class="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm p-5">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">Keseimbangan Indeks Organisasi HR</h3>
          <div v-if="isLoading" class="h-[300px] flex items-center justify-center text-gray-500">Memuat radar...</div>
          <apexchart v-else type="radar" height="300" :options="radarOptions" :series="radarSeries"></apexchart>
        </div>

        <!-- RECENT ACTIVITY LIST / LOG -->
        <div class="col-span-1 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm p-5">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">Ikhtisar Modul HR</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Departemen Terdaftar</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ counts.departments }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Posisi / Jabatan</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ counts.jobs }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Armada Kendaraan Dinas</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ counts.fleet }} Unit</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Voucher Makan Siang</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ counts.lunch }} Pesanan</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600 dark:text-gray-400">Program Referral</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ counts.referrals }} Rekomendasi</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import VueApexCharts from 'vue3-apexcharts'
import { http } from '@/services/http'

// Services
import { employeesService } from '@/services/hr/employees.service'
import { recruitmentService } from '@/services/hr/recruitment.service'
import { timeOffService } from '@/services/hr/time-off.service'
import { appraisalsService } from '@/services/hr/appraisals.service'
import { referralsService } from '@/services/hr/referrals.service'
import { lunchService } from '@/services/hr/lunch.service'
import { fleetService } from '@/services/hr/fleet.service'
import { attendancesService } from '@/services/hr/attendances.service'

const apexchart = VueApexCharts
const isLoading = ref(false)

// State holding counts
const counts = ref({
  employees: 0,
  activeContracts: 0,
  departments: 0,
  jobs: 0,
  recruitment: 0,
  timeoff: 0,
  appraisals: 0,
  referrals: 0,
  payroll: 0,
  thr: 0,
  lunch: 0,
  fleet: 0,
  attendances: 0,
  overtimeCount: 0,
  overtimeHours: 0,
  loans: 0,
  expenses: 0,
  warnings: 0
})

const totalNetSalary = ref(0)
const totalTHR = ref(0)
const totalLoans = ref(0)
const totalExpenses = ref(0)
const payrollData = ref<any[]>([])

// Check if dark mode is active
const isDark = ref(document.documentElement.classList.contains('dark'))

onMounted(() => {
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  fetchAllData()
})

const formatCompact = (val: number) => {
  if (!val || val === 0) return 'Rp 0'
  if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

const fetchAllData = async () => {
  isLoading.value = true
  try {
    const [
      emp, rec, time, app, refList, lun, flt, att,
      deptRes, jobRes, contractRes, otRes, loanRes, expRes, payRes, thrRes, warnRes
    ] = await Promise.all([
      employeesService.getAll().catch(()=>[]),
      recruitmentService.getAll().catch(()=>[]),
      timeOffService.getAll().catch(()=>[]),
      appraisalsService.getAll().catch(()=>[]),
      referralsService.getAll().catch(()=>[]),
      lunchService.getAll().catch(()=>[]),
      fleetService.getAll().catch(()=>[]),
      attendancesService.getAll().catch(()=>[]),
      http.get('/hr/employees/department').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/hr/employees/jobposition').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/hr/employees/contract').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/hr/employees/overtime').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/hr/employees/employeeloan').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/hr/employees/expense').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/hr/employees/payroll').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/hr/employees/thr?year=2026').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/hr/employees/warningletter').then(r => r.data?.data || r.data || []).catch(()=>[])
    ])

    // Hitung total jam lembur
    const totalOtHours = otRes.reduce((acc: number, item: any) => acc + (item.hours || 0), 0)
    
    // Hitung total nominal
    totalNetSalary.value = payRes.reduce((acc: number, item: any) => acc + (item.net_salary || 0), 0)
    totalTHR.value = thrRes.reduce((acc: number, item: any) => acc + (item.thr_amount || 0), 0)
    totalLoans.value = loanRes.reduce((acc: number, item: any) => acc + (item.principal_amount || 0), 0)
    totalExpenses.value = expRes.reduce((acc: number, item: any) => acc + (item.amount || 0), 0)

    counts.value = {
      employees: emp.length,
      activeContracts: contractRes.filter((c: any) => c.state === 'running' || !c.state).length,
      departments: deptRes.length,
      jobs: jobRes.length,
      recruitment: rec.length,
      timeoff: time.length,
      appraisals: app.length,
      referrals: refList.length,
      payroll: payRes.length,
      thr: thrRes.length,
      lunch: lun.length,
      fleet: flt.length,
      attendances: att.length,
      overtimeCount: otRes.length,
      overtimeHours: Math.round(totalOtHours),
      loans: loanRes.length,
      expenses: expRes.length,
      warnings: warnRes.length
    }
    
    payrollData.value = payRes

  } catch (error) {
    console.error('Error loading dashboard data', error)
  } finally {
    isLoading.value = false
  }
}

// ---------------- CHARTS CONFIGURATION ----------------

// 1. BAR CHART: SELURUH FITUR HR
const barSeries = computed(() => [{
  name: 'Jumlah Data Terdaftar',
  data: [
    counts.value.employees, 
    counts.value.attendances, 
    counts.value.overtimeCount,
    counts.value.timeoff, 
    counts.value.payroll,
    counts.value.thr,
    counts.value.loans, 
    counts.value.expenses, 
    counts.value.warnings,
    counts.value.recruitment
  ]
}])

const barOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  plotOptions: { bar: { borderRadius: 6, horizontal: false, columnWidth: '50%' } },
  dataLabels: { enabled: false },
  colors: ['#3b82f6'],
  xaxis: {
    categories: ['Pegawai', 'Kehadiran', 'Lembur', 'Cuti', 'Payroll', 'THR', 'Kasbon', 'Klaim', 'SP', 'Rekrutmen'],
    labels: { style: { colors: isDark.value ? '#9ca3af' : '#4b5563', fontSize: '11px' } }
  },
  yaxis: { labels: { style: { colors: isDark.value ? '#9ca3af' : '#4b5563' } } },
  grid: { borderColor: isDark.value ? '#374151' : '#e5e7eb' },
  tooltip: { theme: isDark.value ? 'dark' : 'light' }
}))

// 2. DONUT CHART (PAYROLL STATUS)
const payrollSeries = computed(() => {
  const paid = payrollData.value.filter(p => p.status === 'paid').length
  const draft = payrollData.value.filter(p => p.status === 'draft' || !p.status).length
  return [paid, draft]
})

const payrollOptions = computed(() => ({
  chart: { type: 'donut', background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  labels: ['Lunas (Paid)', 'Draft / Menunggu'],
  colors: ['#10b981', '#f59e0b'],
  legend: { position: 'bottom', labels: { colors: isDark.value ? '#d1d5db' : '#374151' } },
  stroke: { show: false }
}))

// 3. RADAR CHART
const radarSeries = computed(() => [{
  name: 'Indeks Operasional',
  data: [
    counts.value.employees, 
    counts.value.attendances, 
    counts.value.overtimeCount, 
    counts.value.payroll, 
    counts.value.recruitment
  ]
}])

const radarOptions = computed(() => ({
  chart: { type: 'radar', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  labels: ['Pegawai', 'Kehadiran', 'Lembur', 'Payroll', 'Rekrutmen'],
  colors: ['#8b5cf6'],
  stroke: { width: 2 },
  fill: { opacity: 0.25 },
  markers: { size: 4 },
  yaxis: { show: false },
  xaxis: { labels: { style: { colors: isDark.value ? '#9ca3af' : '#4b5563', fontSize: '12px' } } }
}))
</script>
