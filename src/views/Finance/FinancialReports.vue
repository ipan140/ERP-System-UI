<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Laporan Keuangan Standar SAK</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Laporan Laba Rugi (P&L), Neraca (Balance Sheet), dan Keseimbangan Arus Finansial Perusahaan
          </p>
        </div>
        
        <div class="flex gap-2">
          <button @click="fetchReports" class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Perbarui Laporan
          </button>
        </div>
      </div>

      <!-- TABS LAPORAN -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button 
            @click="activeTab = 'pl'"
            :class="['whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors', activeTab === 'pl' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400']"
          >
            📊 Laba Rugi (Profit & Loss)
          </button>
          <button 
            @click="activeTab = 'bs'"
            :class="['whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors', activeTab === 'bs' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400']"
          >
            ⚖️ Neraca Keuangan (Balance Sheet)
          </button>
        </nav>
      </div>

      <!-- TAB 1: LABA RUGI (PROFIT & LOSS) -->
      <div v-if="activeTab === 'pl'" class="space-y-6">
        
        <!-- TOP METRICS LABA RUGI -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Pendapatan Usaha</p>
            <h3 class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{{ formatCurrency(plReport.total_income) }}</h3>
            <p class="text-xs text-gray-400 mt-1">Penjualan Produk & Jasa</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Beban & Biaya Operasional</p>
            <h3 class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{{ formatCurrency(plReport.total_hpp + plReport.total_expense) }}</h3>
            <p class="text-xs text-gray-400 mt-1">HPP, Beban Gaji HR & Utilitas</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Laba Bersih (Net Profit)</p>
            <h3 :class="['text-2xl font-black mt-2', plReport.net_profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400']">
              {{ formatCurrency(plReport.net_profit) }}
            </h3>
            <p class="text-xs text-emerald-500 mt-1">Status: {{ plReport.net_profit >= 0 ? 'SURPLUS / UNTUNG' : 'DEFISIT / RUGI' }}</p>
          </div>
        </div>

        <!-- FORMAL SAK INCOME STATEMENT TABLE -->
        <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm overflow-hidden p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">
            Laporan Laba Rugi Komprehensif
          </h3>

          <div class="space-y-6 text-sm">
            
            <!-- 1. Pendapatan Usaha -->
            <div>
              <div class="flex justify-between font-bold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <span>1. PENDAPATAN OPERASIONAL</span>
                <span>{{ formatCurrency(plReport.total_income) }}</span>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-700 px-3 mt-2">
                <div v-for="inc in plReport.income_accounts" :key="inc.id" class="flex justify-between py-2 text-gray-600 dark:text-gray-300">
                  <span>{{ inc.code }} - {{ inc.name }}</span>
                  <span class="font-mono">{{ formatCurrency(inc.balance) }}</span>
                </div>
              </div>
            </div>

            <!-- 2. HPP -->
            <div>
              <div class="flex justify-between font-bold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <span>2. HARGA POKOK PENJUALAN (HPP)</span>
                <span>({{ formatCurrency(plReport.total_hpp) }})</span>
              </div>
            </div>

            <!-- LABA KOTOR -->
            <div class="flex justify-between font-black text-base text-gray-900 dark:text-white border-t-2 border-b-2 border-gray-200 dark:border-gray-600 py-3 px-3">
              <span>LABA KOTOR (GROSS PROFIT)</span>
              <span class="font-mono text-blue-600 dark:text-blue-400">{{ formatCurrency(plReport.gross_profit) }}</span>
            </div>

            <!-- 3. Beban Operasional -->
            <div>
              <div class="flex justify-between font-bold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <span>3. BEBAN OPERASIONAL & PERSONALIA (HR)</span>
                <span>({{ formatCurrency(plReport.total_expense) }})</span>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-700 px-3 mt-2">
                <div v-for="exp in plReport.expense_accounts" :key="exp.id" class="flex justify-between py-2 text-gray-600 dark:text-gray-300">
                  <span>{{ exp.code }} - {{ exp.name }}</span>
                  <span class="font-mono">{{ formatCurrency(exp.balance) }}</span>
                </div>
              </div>
            </div>

            <!-- LABA BERSIH AKHIR -->
            <div class="flex justify-between font-black text-lg text-white bg-brand-600 dark:bg-brand-700 p-4 rounded-xl shadow-sm">
              <span>LABA BERSIH USAHA (NET PROFIT)</span>
              <span class="font-mono">{{ formatCurrency(plReport.net_profit) }}</span>
            </div>

          </div>
        </div>

      </div>

      <!-- TAB 2: NERACA KEUANGAN (BALANCE SHEET) -->
      <div v-if="activeTab === 'bs'" class="space-y-6">
        
        <!-- STATUS BALANCE ALERT -->
        <div :class="['p-4 rounded-xl flex items-center justify-between font-semibold text-sm', bsReport.is_balanced ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800']">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Status Keseimbangan Neraca: {{ bsReport.is_balanced ? 'SEIMBANG (BALANCED: ASET = KEWAJIBAN + EKUITAS)' : 'TIDAK SEIMBANG' }}</span>
          </div>
          <span class="font-mono text-xs">SAK Compliance</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- SISI KIRI: AKTIVA (ASET) -->
          <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm p-6 space-y-4">
            <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 class="font-bold text-gray-900 dark:text-white text-base">AKTIVA (HARTA & ASET)</h3>
              <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(bsReport.total_asset) }}</span>
            </div>
            
            <div class="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              <div v-for="ast in bsReport.asset_accounts" :key="ast.id" class="flex justify-between py-2.5 text-gray-700 dark:text-gray-300">
                <div>
                  <span class="font-mono text-xs text-gray-400 mr-2">{{ ast.code }}</span>
                  <span>{{ ast.name }}</span>
                </div>
                <span class="font-mono font-bold">{{ formatCurrency(ast.balance) }}</span>
              </div>
            </div>

            <div class="flex justify-between font-black text-base text-gray-900 dark:text-white border-t-2 border-gray-200 dark:border-gray-700 pt-3">
              <span>TOTAL ASET</span>
              <span class="font-mono text-emerald-600 dark:text-emerald-400">{{ formatCurrency(bsReport.total_asset) }}</span>
            </div>
          </div>

          <!-- SISI KANAN: PASIVA (KEWAJIBAN & EKUITAS) -->
          <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm p-6 space-y-6">
            
            <!-- KEWAJIBAN -->
            <div>
              <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                <h4 class="font-bold text-gray-900 dark:text-white text-sm">KEWAJIBAN (HUTANG USAHA & PAJAK)</h4>
                <span class="font-mono font-bold text-amber-600 dark:text-amber-400">{{ formatCurrency(bsReport.total_liability) }}</span>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                <div v-for="lia in bsReport.liability_accounts" :key="lia.id" class="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                  <div>
                    <span class="font-mono text-xs text-gray-400 mr-2">{{ lia.code }}</span>
                    <span>{{ lia.name }}</span>
                  </div>
                  <span class="font-mono font-bold">{{ formatCurrency(lia.balance) }}</span>
                </div>
              </div>
            </div>

            <!-- EKUITAS -->
            <div>
              <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                <h4 class="font-bold text-gray-900 dark:text-white text-sm">EKUITAS (MODAL & LABA DITAHAN)</h4>
                <span class="font-mono font-bold text-purple-600 dark:text-purple-400">{{ formatCurrency(bsReport.total_equity) }}</span>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                <div v-for="eq in bsReport.equity_accounts" :key="eq.id" class="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                  <div>
                    <span class="font-mono text-xs text-gray-400 mr-2">{{ eq.code }}</span>
                    <span>{{ eq.name }}</span>
                  </div>
                  <span class="font-mono font-bold">{{ formatCurrency(eq.balance) }}</span>
                </div>
              </div>
            </div>

            <!-- TOTAL PASIVA -->
            <div class="flex justify-between font-black text-base text-gray-900 dark:text-white border-t-2 border-gray-200 dark:border-gray-700 pt-3">
              <span>TOTAL KEWAJIBAN & EKUITAS</span>
              <span class="font-mono text-purple-600 dark:text-purple-400">{{ formatCurrency(bsReport.total_liability + bsReport.total_equity) }}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { http } from '@/services/http'

const activeTab = ref<'pl' | 'bs'>('pl')
const isLoading = ref(false)

const plReport = ref({
  total_income: 0,
  total_hpp: 0,
  gross_profit: 0,
  total_expense: 0,
  net_profit: 0,
  income_accounts: [] as any[],
  expense_accounts: [] as any[]
})

const bsReport = ref({
  total_asset: 0,
  total_liability: 0,
  total_equity: 0,
  asset_accounts: [] as any[],
  liability_accounts: [] as any[],
  equity_accounts: [] as any[],
  is_balanced: true
})

onMounted(() => {
  fetchReports()
})

const fetchReports = async () => {
  isLoading.value = true
  try {
    const [plRes, bsRes] = await Promise.all([
      http.get('/finance/accounting/reports/profit-loss'),
      http.get('/finance/accounting/reports/balance-sheet')
    ])
    plReport.value = plRes.data?.data || plRes.data || {}
    bsReport.value = bsRes.data?.data || bsRes.data || {}
  } catch (err) {
    console.error('Failed to load financial reports', err)
  } finally {
    isLoading.value = false
  }
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}
</script>
