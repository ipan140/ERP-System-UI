<template>
  <AdminLayout>
    <div class="p-6 space-y-6">
      <!-- HEADER -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>💼</span> Penggajian & Payroll Enterprise
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Standar Mekari Talenta: Kalkulasi PPh 21 TER 2024, BPJS, Rekonsiliasi Otomatis, dan Ekspor Transfer Bank Massal.
          </p>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <input 
            type="month" 
            v-model="selectedPeriod" 
            class="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" 
          />

          <!-- Ekspor Transfer Bank Dropdown -->
          <div class="relative inline-block text-left">
            <button 
              @click="showBankDropdown = !showBankDropdown"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              title="Ekspor File Transfer Payroll Bank"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              <span>Transfer Bank</span>
              <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div 
              v-if="showBankDropdown" 
              class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700"
            >
              <div class="p-1">
                <button 
                  @click="downloadBankTransfer('bca')" 
                  :disabled="isExportingBank"
                  class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
                >
                  <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                  Format BCA (KlikBCA Bisnis CSV)
                </button>
                <button 
                  @click="downloadBankTransfer('mandiri')" 
                  :disabled="isExportingBank"
                  class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
                >
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                  Format Mandiri MCM (Corporate CSV)
                </button>
              </div>
            </div>
          </div>

          <!-- Unduh e-SPT -->
          <button 
            @click="downloadESPT" 
            class="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>e-SPT (1721-A1)</span>
          </button>

          <!-- Cetak Rekapitulasi Gaji -->
          <button 
            @click="openSummarySheetModal" 
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            <span>Rekap Gaji (PDF)</span>
          </button>

          <!-- Bayar Semua (Bulk Pay) -->
          <button 
            v-if="draftCount > 0"
            @click="bulkPayAll" 
            :disabled="isBulkPaying"
            class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
            title="Lunaskan seluruh slip gaji draft periode ini & auto-post ke jurnal kas/bank"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ isBulkPaying ? 'Memproses...' : `Bayar Semua (${draftCount})` }}</span>
          </button>

          <!-- Generate Gaji -->
          <button 
            @click="generatePayroll" 
            :disabled="isGenerating" 
            class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition disabled:opacity-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span>{{ isGenerating ? 'Mengkalkulasi...' : 'Generate Gaji' }}</span>
          </button>
        </div>
      </div>

      <!-- KPI METRIC CARDS (Enterprise Scale 100-1000 Employees) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Karyawan Diproses</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-1.5">
            {{ filteredByPeriod.length }} <span class="text-sm font-normal text-gray-500">Orang</span>
          </h3>
          <p class="text-xs text-brand-600 dark:text-brand-400 mt-1">Periode: {{ selectedPeriod }}</p>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Gaji Terbayar (Paid)</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">
            {{ formatCurrency(totalPaidAmount) }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ paidCount }} dari {{ filteredByPeriod.length }} slip telah lunas</p>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Menunggu Pembayaran</p>
          <h3 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1.5">
            {{ formatCurrency(totalDraftAmount) }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ draftCount }} slip menunggu approval/bayar</p>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Potongan Pajak & BPJS</p>
          <h3 class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1.5">
            {{ formatCurrency(totalDeductions) }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">PPh 21 TER + BPJS Kes & Naker</p>
        </div>
      </div>

      <!-- FILTER & SEARCH BAR -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cari Karyawan / Posisi</label>
            <div class="relative">
              <input 
                type="text" 
                v-model="searchKeyword" 
                placeholder="Ketik nama atau jabatan..." 
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white pl-9"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Filter Departemen</label>
            <select 
              v-model="selectedDepartment" 
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Semua Departemen</option>
              <option v-for="dept in departmentsList" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Filter Status Pembayaran</label>
            <select 
              v-model="selectedStatus" 
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Semua Status</option>
              <option value="draft">DRAFT (Menunggu)</option>
              <option value="paid">PAID (Lunas)</option>
            </select>
          </div>
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
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Departemen</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Gaji Pokok</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Lembur dkk</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Potongan (Pajak/BPJS)</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Take Home Pay</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-center">Status</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="row in filteredRecords" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ row.employee?.name || 'Unknown' }}
                  <div class="text-xs text-gray-500 font-normal">{{ row.employee?.job_position?.name || 'Staff' }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                    {{ row.employee?.department?.name || '-' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-medium text-gray-800 dark:text-gray-200">{{ formatCurrency(row.basic_salary) }}</td>
                <td class="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">+ {{ formatCurrency(row.total_earning - row.basic_salary) }}</td>
                <td class="px-6 py-4 text-right text-rose-500 font-medium">- {{ formatCurrency(row.total_deduction) }}</td>
                <td class="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">{{ formatCurrency(row.net_salary) }}</td>
                <td class="px-6 py-4 text-center">
                  <span :class="['inline-flex px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider', row.status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300']">
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

  <!-- MODAL 2: REKAPITULASI PENGGAJIAN BULANAN RESMI (BULK SHEET) -->
  <Teleport to="body">
    <div v-if="showSummarySheet" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/40">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Lembar Rekapitulasi Penggajian Massal</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Periode: {{ selectedPeriod }} | PT. Nusantara Prima Solusindo</p>
          </div>
          <button @click="showSummarySheet = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Printable Area -->
        <div id="payroll-summary-print" class="p-6 overflow-y-auto flex-1 text-xs text-gray-800 dark:text-gray-200">
          <div class="text-center border-b-2 border-gray-800 pb-4 mb-4">
            <h2 class="text-xl font-black uppercase tracking-wider">PT. NUSANTARA PRIMA SOLUSINDO</h2>
            <p class="text-xs">Gedung Bursa Efek Indonesia, Tower 2 Lt. 17, Sudirman CBD, Jakarta</p>
            <h3 class="text-sm font-bold mt-2 uppercase tracking-wide">REKAPITULASI PENGGAJIAN KARYAWAN - PERIODE {{ selectedPeriod }}</h3>
          </div>

          <table class="w-full border-collapse border border-gray-300 text-left text-xs mb-6">
            <thead>
              <tr class="bg-gray-100 text-gray-800 font-bold border-b border-gray-300">
                <th class="border border-gray-300 p-2">No</th>
                <th class="border border-gray-300 p-2">Nama Karyawan</th>
                <th class="border border-gray-300 p-2">Departemen</th>
                <th class="border border-gray-300 p-2 text-right">Gaji Pokok</th>
                <th class="border border-gray-300 p-2 text-right">Tunjangan/Lembur</th>
                <th class="border border-gray-300 p-2 text-right">Potongan (Pajak/BPJS)</th>
                <th class="border border-gray-300 p-2 text-right">Net THP</th>
                <th class="border border-gray-300 p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in filteredRecords" :key="row.id" class="border-b border-gray-200">
                <td class="border border-gray-300 p-2 text-center">{{ idx + 1 }}</td>
                <td class="border border-gray-300 p-2 font-medium">{{ row.employee?.name }}</td>
                <td class="border border-gray-300 p-2">{{ row.employee?.department?.name || '-' }}</td>
                <td class="border border-gray-300 p-2 text-right">{{ formatCurrency(row.basic_salary) }}</td>
                <td class="border border-gray-300 p-2 text-right">{{ formatCurrency(row.total_earning - row.basic_salary) }}</td>
                <td class="border border-gray-300 p-2 text-right">{{ formatCurrency(row.total_deduction) }}</td>
                <td class="border border-gray-300 p-2 text-right font-bold">{{ formatCurrency(row.net_salary) }}</td>
                <td class="border border-gray-300 p-2 text-center font-bold uppercase">{{ row.status }}</td>
              </tr>
              <tr class="bg-gray-100 font-bold">
                <td colspan="3" class="border border-gray-300 p-2 text-center">TOTAL KESELURUHAN ({{ filteredRecords.length }} KARYAWAN)</td>
                <td class="border border-gray-300 p-2 text-right">{{ formatCurrency(totalBasicSalary) }}</td>
                <td class="border border-gray-300 p-2 text-right">{{ formatCurrency(totalAdditions) }}</td>
                <td class="border border-gray-300 p-2 text-right">{{ formatCurrency(totalDeductions) }}</td>
                <td class="border border-gray-300 p-2 text-right text-brand-600">{{ formatCurrency(totalTHP) }}</td>
                <td class="border border-gray-300 p-2"></td>
              </tr>
            </tbody>
          </table>

          <!-- Signatures -->
          <div class="grid grid-cols-3 gap-6 text-center mt-8 pt-4">
            <div>
              <p class="text-xs text-gray-500">Dipersiapkan Oleh,</p>
              <div class="h-16"></div>
              <p class="font-bold underline">Payroll Specialist</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Diperiksa Oleh,</p>
              <div class="h-16"></div>
              <p class="font-bold underline">HR & GA Manager</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Disetujui Oleh,</p>
              <div class="h-16"></div>
              <p class="font-bold underline">Finance Director</p>
            </div>
          </div>
        </div>

        <!-- Footer Modal -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button @click="showSummarySheet = false" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Tutup</button>
          <button @click="printSummarySheet" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { http } from '@/services/http'

const records = ref<any[]>([])
const isLoading = ref(true)
const isGenerating = ref(false)
const isBulkPaying = ref(false)
const showBankDropdown = ref(false)
const showSummarySheet = ref(false)

const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM
const selectedPeriod = ref(currentMonth)
const searchKeyword = ref('')
const selectedDepartment = ref('')
const selectedStatus = ref('')

const activePayslip = ref<any>(null)
const apiBaseUrl = 'http://localhost:7070'

// Formatters
const formatCurrency = (val: number) => {
  if (!val) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const isExportingBank = ref(false)

const downloadBankTransfer = async (bank: string) => {
  isExportingBank.value = true
  try {
    const res = await http.get(`/hr/employees/payroll/bank-transfer-export?period=${selectedPeriod.value}&bank=${bank}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `payroll_transfer_${bank}_${selectedPeriod.value}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    showBankDropdown.value = false
  } catch (err: any) {
    alert('Gagal mengunduh file transfer bank: ' + (err.response?.data?.message || err.message))
  } finally {
    isExportingBank.value = false
  }
}

const downloadESPT = async () => {
  try {
    const res = await http.get('/hr/employees/payroll-espt', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `eSPT_1721_A1_${selectedPeriod.value}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err: any) {
    alert('Gagal mengunduh e-SPT: ' + (err.response?.data?.message || err.message))
  }
}

// Filtering
const filteredByPeriod = computed(() => {
  return records.value.filter(r => r.period === selectedPeriod.value)
})

const departmentsList = computed(() => {
  const depts = new Set<string>()
  filteredByPeriod.value.forEach(r => {
    if (r.employee?.department?.name) {
      depts.add(r.employee.department.name)
    }
  })
  return Array.from(depts)
})

const filteredRecords = computed(() => {
  return filteredByPeriod.value.filter(r => {
    // Search keyword
    if (searchKeyword.value) {
      const q = searchKeyword.value.toLowerCase()
      const empName = (r.employee?.name || '').toLowerCase()
      const jobName = (r.employee?.job_position?.name || '').toLowerCase()
      if (!empName.includes(q) && !jobName.includes(q)) return false
    }
    // Department filter
    if (selectedDepartment.value && r.employee?.department?.name !== selectedDepartment.value) {
      return false
    }
    // Status filter
    if (selectedStatus.value && r.status !== selectedStatus.value) {
      return false
    }
    return true
  })
})

// KPI Metrics
const paidCount = computed(() => filteredByPeriod.value.filter(r => r.status === 'paid').length)
const draftCount = computed(() => filteredByPeriod.value.filter(r => r.status === 'draft').length)

const totalPaidAmount = computed(() => {
  return filteredByPeriod.value
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + (r.net_salary || 0), 0)
})

const totalDraftAmount = computed(() => {
  return filteredByPeriod.value
    .filter(r => r.status === 'draft')
    .reduce((sum, r) => sum + (r.net_salary || 0), 0)
})

const totalDeductions = computed(() => {
  return filteredRecords.value.reduce((sum, r) => sum + (r.total_deduction || 0), 0)
})

const totalBasicSalary = computed(() => {
  return filteredRecords.value.reduce((sum, r) => sum + (r.basic_salary || 0), 0)
})

const totalAdditions = computed(() => {
  return filteredRecords.value.reduce((sum, r) => sum + ((r.total_earning || 0) - (r.basic_salary || 0)), 0)
})

const totalTHP = computed(() => {
  return filteredRecords.value.reduce((sum, r) => sum + (r.net_salary || 0), 0)
})

// API Operations
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
  if (!confirm(`Sistem akan mengkalkulasi Gaji Pokok, Lembur, Potongan Kasbon, PPh 21 TER, dan BPJS untuk seluruh karyawan aktif pada periode ${selectedPeriod.value}.\nLanjutkan?`)) return
  
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

const bulkPayAll = async () => {
  if (!confirm(`Konfirmasi Bayar Massal:\nApakah Anda yakin ingin menandai seluruh ${draftCount.value} slip gaji draft pada periode ${selectedPeriod.value} sebagai LUNAS DIBAYAR?\n\nSistem akan otomatis membukukan ke Jurnal Finance (Beban Gaji vs Kas Bank).`)) return

  isBulkPaying.value = true
  try {
    const res = await http.put('/hr/employees/payroll/bulk-pay', { period: selectedPeriod.value })
    await fetchData()
    const paid = res.data?.data?.paid_count || draftCount.value
    alert(`Sukses! ${paid} slip gaji berhasil dilunaskan dan dibukukan ke modul Finance.`)
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isBulkPaying.value = false
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

const openSummarySheetModal = () => {
  showSummarySheet.value = true
}

const printSummarySheet = () => {
  const printContent = document.getElementById('payroll-summary-print')
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
