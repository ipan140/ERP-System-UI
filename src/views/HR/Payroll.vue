<template>
  <AdminLayout>
    <div class="p-6">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Penggajian (Payroll)</h2>
          <PageBreadcrumb pageTitle="Daftar Slip Gaji" />
        </div>
        <div class="flex gap-3">
          <input type="month" v-model="selectedPeriod" class="rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <a href="http://localhost:8080/api/hr/employees/payroll-espt" target="_blank" class="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mr-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Unduh e-SPT (CSV)
          </a>
          <button @click="generatePayroll" :disabled="isGenerating" class="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            {{ isGenerating ? 'Proses Kalkulasi...' : 'Generate Gaji' }}
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div v-if="isLoading" class="py-10 text-center"><div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div v-else-if="filteredRecords.length === 0" class="py-10 text-center text-gray-500">Belum ada slip gaji untuk periode {{ selectedPeriod }}. Klik "Generate Gaji" untuk memproses.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Pegawai</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Periode</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Gaji Pokok</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Lembur dkk</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Potongan (BPJS/Pajak)</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Total Take Home Pay</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="row in filteredRecords" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ row.employee?.name || 'Unknown' }}
                  <div class="text-xs text-gray-500 font-normal">{{ row.employee?.job_position?.name || 'Staff' }}</div>
                </td>
                <td class="px-6 py-4">{{ row.period }}</td>
                <td class="px-6 py-4">{{ formatCurrency(row.basic_salary) }}</td>
                <td class="px-6 py-4 text-green-600">+ {{ formatCurrency(row.total_earning - row.basic_salary) }}</td>
                <td class="px-6 py-4 text-red-500">- {{ formatCurrency(row.total_deduction) }}</td>
                <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">{{ formatCurrency(row.net_salary) }}</td>
                <td class="px-6 py-4">
                  <span :class="['inline-flex px-2 py-1 text-xs font-medium rounded-full', row.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                    {{ row.status?.toUpperCase() || 'DRAFT' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      @click="openPayslip(row)"
                      title="Lihat Rincian Slip Gaji"
                      class="p-2 text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      v-if="row.status === 'draft'"
                      @click="payPayslip(row.id)"
                      title="Bayar / Lunaskan Gaji"
                      class="p-2 text-gray-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteRecord(row.id)"
                      title="Hapus Slip Gaji"
                      class="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Payslip Viewer Modal with Proper Dark Mode -->
  <Teleport to="body">
    <div v-if="activePayslip" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700">
        <!-- Print Area -->
        <div id="payslip-print-area" class="p-8 bg-white dark:bg-gray-800">
          <div class="flex justify-between items-start border-b-2 border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <div>
              <h1 class="text-3xl font-black text-brand-600 dark:text-brand-400 tracking-tight">SLIP GAJI</h1>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Periode: {{ activePayslip.period }}</p>
            </div>
            <div class="text-right">
              <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ activePayslip.employee?.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ activePayslip.employee?.job_position?.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ activePayslip.employee?.department?.name }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Earnings -->
            <div>
              <h4 class="font-bold text-emerald-600 dark:text-emerald-400 mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">PENDAPATAN</h4>
              <div class="space-y-2">
                <div v-for="line in activePayslip.payslip_lines.filter((l: any) => l.category === 'earning')" :key="line.id" class="flex justify-between text-sm">
                  <span class="text-gray-700 dark:text-gray-300">{{ line.name }}</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(line.amount) }}</span>
                </div>
              </div>
              <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-sm">
                <span class="text-gray-900 dark:text-white">Total Pendapatan</span>
                <span class="text-emerald-600 dark:text-emerald-400">{{ formatCurrency(activePayslip.total_earning) }}</span>
              </div>
            </div>
            
            <!-- Deductions -->
            <div>
              <h4 class="font-bold text-red-500 dark:text-red-400 mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">POTONGAN</h4>
              <div class="space-y-2">
                <div v-for="line in activePayslip.payslip_lines.filter((l: any) => l.category === 'deduction')" :key="line.id" class="flex justify-between text-sm">
                  <span class="text-gray-700 dark:text-gray-300">{{ line.name }}</span>
                  <span class="font-medium text-red-500 dark:text-red-400">{{ formatCurrency(line.amount) }}</span>
                </div>
              </div>
              <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-sm">
                <span class="text-gray-900 dark:text-white">Total Potongan</span>
                <span class="text-red-500 dark:text-red-400">{{ formatCurrency(activePayslip.total_deduction) }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-8 bg-gray-50 dark:bg-gray-700/40 rounded-xl p-5 border border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Dibayarkan (Take Home Pay)</p>
              <h2 class="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">{{ formatCurrency(activePayslip.net_salary) }}</h2>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">Status Pembayaran</p>
              <div :class="['mt-1 inline-flex px-3 py-1 text-sm font-bold rounded-full uppercase tracking-widest', activePayslip.status === 'paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' : 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800']">
                {{ activePayslip.status }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button @click="activePayslip = null" class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Tutup</button>
          <button @click="printPayslip" class="px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors shadow-sm">Print / PDF</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { http } from '@/services/http'

const records = ref<any[]>([])
const isLoading = ref(true)
const isGenerating = ref(false)

const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM
const selectedPeriod = ref(currentMonth)

const activePayslip = ref<any>(null)

const filteredRecords = computed(() => {
  return records.value.filter(r => r.period === selectedPeriod.value)
})

const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await http.get('/hr/employees/payroll')
    records.value = res.data?.data || res.data || []
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const generatePayroll = async () => {
  if (!confirm(`Sistem akan mengkalkulasi Gaji Pokok, Lembur, Potongan Kasbon, PPh 21, dan BPJS untuk seluruh karyawan aktif pada periode ${selectedPeriod.value}.\nLanjutkan?`)) return
  
  isGenerating.value = true
  try {
    await http.post('/hr/employees/payroll/generate', { period: selectedPeriod.value })
    await fetchData()
    alert('Kalkulasi penggajian selesai!')
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isGenerating.value = false
  }
}

const openPayslip = (row: any) => {
  activePayslip.value = row
}

const printPayslip = () => {
  const printContent = document.getElementById('payslip-print-area')
  if (printContent) {
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printContent.innerHTML
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus slip gaji ini?')) return
  try {
    await http.delete(`/hr/employees/payroll/${id}`)
    fetchData()
  } catch (err: any) {
    alert(err.message)
  }
}

const payPayslip = async (id: number) => {
  if (!confirm('Tandai slip gaji ini sebagai LUNAS DIBAYAR?')) return
  try {
    await http.put(`/hr/employees/payroll/${id}/pay`)
    fetchData()
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(() => fetchData())
</script>
