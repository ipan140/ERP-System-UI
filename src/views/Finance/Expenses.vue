<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Klaim Pengeluaran & Reimbursement (Expenses)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Verifikasi Klaim Biaya Operasional, Perjalanan Dinas & Persetujuan Reimbursement Karyawan
          </p>
        </div>
        
        <div class="flex gap-2">
          <button @click="openModal('create')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Ajukan Klaim Baru
          </button>
        </div>
      </div>

      <!-- TABS MODUL PENGELUARAN -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button 
            @click="activeTab = 'expenses'"
            :class="['whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors', activeTab === 'expenses' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400']"
          >
            🧾 Klaim Biaya & Reimbursement (Staff)
          </button>
          <button 
            @click="activeTab = 'petty_cash'"
            :class="['whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors', activeTab === 'petty_cash' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400']"
          >
            💳 Kas Kecil / Petty Cash (Sistem Imprest)
          </button>
        </nav>
      </div>

      <!-- TAB 1: KLAIM REIMBURSEMENT -->
      <div v-if="activeTab === 'expenses'" class="space-y-6">
        <!-- KPI METRICS REIMBURSEMENT -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Klaim Diajukan</p>
            <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ formatCurrency(totalClaimAmount) }}</h3>
            <p class="text-xs text-gray-400 mt-1">{{ records.length }} Pengajuan Masuk</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Menunggu Approval Finance</p>
            <h3 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{{ pendingCount }} <span class="text-sm font-normal text-gray-400">Klaim</span></h3>
            <p class="text-xs text-amber-500 mt-1">Perlu Verifikasi Bukti Nota</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Disetujui / Terbayar</p>
            <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ approvedCount }} <span class="text-sm font-normal text-gray-400">Klaim</span></h3>
            <p class="text-xs text-emerald-500 mt-1">Telah Ditransfer ke Karyawan</p>
          </div>
        </div>

        <!-- FILTER & TABEL -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Deskripsi Klaim</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Karyawan Pemohon</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Tanggal Pengajuan</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Nominal Klaim</th>
                <th class="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="6" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat klaim pengeluaran...</p>
                </td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="6" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Belum ada klaim pengeluaran yang diajukan.
                </td>
              </tr>
              <tr v-for="rec in records" :key="rec.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-gray-900 dark:text-white text-sm">{{ rec.name }}</div>
                  <span class="text-xs text-gray-400">ID: #EXP-{{ rec.id }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-800 dark:text-white text-sm">{{ rec.employee?.name || `Pegawai #${rec.employee_id}` }}</div>
                  <span class="text-xs text-gray-400">{{ rec.employee?.email || 'Karyawan Internal' }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                  {{ formatDate(rec.created_at) }}
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap font-mono font-bold text-sm text-gray-900 dark:text-white">
                  {{ formatCurrency(rec.total_amount) }}
                </td>
                <td class="px-6 py-4 text-center whitespace-nowrap">
                  <span :class="getStatusBadge(rec.state)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {{ rec.state || 'DRAFT' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Tombol Edit -->
                    <button 
                      @click="openModal('edit', rec)" 
                      class="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" 
                      title="Edit Klaim"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <!-- Tombol Approve -->
                    <button 
                      v-if="rec.state !== 'approved' && rec.state !== 'paid'" 
                      @click="approveClaim(rec)" 
                      class="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors" 
                      title="Setujui Klaim"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <!-- Tombol Hapus -->
                    <button 
                      @click="deleteClaim(rec.id)" 
                      class="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" 
                      title="Hapus"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>

      <!-- TAB 2: KAS KECIL (PETTY CASH - SISTEM IMPREST) -->
      <div v-if="activeTab === 'petty_cash'" class="space-y-6">
        <!-- KPI METRICS PETTY CASH -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Plafon Kas Kecil (Imprest Limit)</p>
            <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ formatCurrency(pettyFund.plafond_limit) }}</h3>
            <p class="text-xs text-gray-400 mt-1">Pemegang: {{ pettyFund.custodian || 'Kasir Operasional' }}</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sisa Fisik Brankas Kasir</p>
            <h3 :class="pettyFund.current_balance < 1000000 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'" class="text-2xl font-black mt-2">
              {{ formatCurrency(pettyFund.current_balance) }}
            </h3>
            <p class="text-xs mt-1" :class="pettyFund.current_balance < 1000000 ? 'text-rose-500 font-bold' : 'text-emerald-500'">
              {{ pettyFund.current_balance < 1000000 ? '⚠️ Saldo Menipis! Segera Replenish' : 'Tersedia untuk Pengeluaran Kecil' }}
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Klaim Penggantian (Replenish)</p>
              <h3 class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{{ formatCurrency(pettyFund.plafond_limit - pettyFund.current_balance) }}</h3>
            </div>
            <button 
              @click="replenishPettyCash" 
              :disabled="pettyFund.current_balance >= pettyFund.plafond_limit || isReplenishing"
              class="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span>{{ isReplenishing ? 'Memproses...' : 'Lakukan Penggantian (Replenish)' }}</span>
            </button>
          </div>
        </div>

        <!-- ACTION BAR & TABEL BUKTI PENGELUARAN KAS KECIL -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-sm">Buku Mutasi Kas Kecil (Petty Cash Vouchers)</h3>
              <p class="text-xs text-gray-400">Riwayat pengeluaran kasbon kecil kantor, konsumsi meeting, dan pengisian kembali</p>
            </div>
            <button 
              @click="isPettyModalOpen = true" 
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-600 shadow-sm transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              <span>+ Catat Nota Kas Kecil</span>
            </button>
          </div>

          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  <th class="px-5 py-3.5">Tanggal</th>
                  <th class="px-5 py-3.5">Jenis Transaksi</th>
                  <th class="px-5 py-3.5">Keperluan & Keterangan</th>
                  <th class="px-5 py-3.5">No. Nota / Bukti</th>
                  <th class="px-5 py-3.5">Dicatat Oleh</th>
                  <th class="px-5 py-3.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700 font-mono">
                <tr v-if="pettyTxs.length === 0">
                  <td colspan="6" class="px-5 py-8 text-center text-gray-400 font-sans">
                    Belum ada riwayat transaksi kas kecil.
                  </td>
                </tr>
                <tr v-for="t in pettyTxs" :key="t.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30">
                  <td class="px-5 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {{ formatDate(t.created_at || '') }}
                  </td>
                  <td class="px-5 py-3 font-sans">
                    <span 
                      :class="t.tx_type === 'replenish' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'"
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    >
                      {{ t.tx_type === 'replenish' ? 'Penggantian (Masuk)' : 'Pengeluaran (Keluar)' }}
                    </span>
                  </td>
                  <td class="px-5 py-3 font-sans text-gray-900 dark:text-white max-w-xs truncate">
                    {{ t.description }}
                  </td>
                  <td class="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {{ t.receipt_ref || '-' }}
                  </td>
                  <td class="px-5 py-3 font-sans text-gray-600 dark:text-gray-400">
                    {{ t.recorded_by }}
                  </td>
                  <td 
                    :class="t.tx_type === 'replenish' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
                    class="px-5 py-3 text-right font-bold"
                  >
                    {{ t.tx_type === 'replenish' ? '+' : '-' }}{{ formatCurrency(t.amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- MODAL PENGAJUAN / EDIT KLAIM -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ isEditing ? 'Edit Klaim Pengeluaran' : 'Pengajuan Klaim Biaya Operasional' }}
            </h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="saveClaim" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama / Keperluan Klaim</label>
              <input v-model="formData.name" type="text" placeholder="Tiket Kereta & Hotel Dinas Surabaya" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Pilih Karyawan Pemohon</label>
                <select v-model.number="formData.employee_id" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
                  <option disabled value="0">-- Pilih Karyawan --</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.name }} ({{ emp.department?.name || 'Staff' }})
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nominal Biaya (Rp)</label>
                <input v-model.number="formData.total_amount" type="number" min="1000" step="any" required placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono font-bold" />
              </div>
            </div>

            <!-- KONTROL ANGGARAN & OVERBUDGET WARNING (Integrasi Budgeting) -->
            <div v-if="selectedDepartmentBudget" class="p-3.5 rounded-xl border transition-all text-xs" :class="isOverbudget ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800 text-rose-700 dark:text-rose-300' : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 text-blue-700 dark:text-blue-300'">
              <div class="flex items-center justify-between font-bold mb-1">
                <span class="flex items-center gap-1.5">
                  <svg v-if="isOverbudget" class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <svg v-else class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Pagu Anggaran Divisi: {{ selectedDepartmentBudget.department_name }}</span>
                </span>
                <span class="font-mono font-black">Sisa: {{ formatCurrency(selectedDepartmentBudget.allocated_limit - selectedDepartmentBudget.realized_spent) }}</span>
              </div>
              <p v-if="isOverbudget" class="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
                ⚠️ Peringatan: Nominal klaim ({{ formatCurrency(formData.total_amount) }}) melebihi sisa pagu anggaran divisi ini. Backend akan menolak pengajuan atau menandainya sebagai overbudget!
              </p>
              <p v-else class="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
                ✓ Anggaran mencukupi. Setelah disetujui, realisasi belanja divisi akan otomatis tercatat di modul Kontrol Anggaran (Budgeting).
              </p>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : 'Ajukan Klaim' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL CATAT NOTA KAS KECIL -->
    <Teleport to="body">
      <div v-if="isPettyModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Catat Pengeluaran Kas Kecil
            </h3>
            <button @click="isPettyModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="savePettyExpense" class="space-y-4 mt-4 text-xs">
            <div>
              <label class="block font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Keperluan / Keterangan Pembelian</label>
              <input v-model="pettyForm.description" type="text" placeholder="Beli galon air mineral & kopi meeting" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nominal Tunai (Rp)</label>
              <input v-model.number="pettyForm.amount" type="number" min="500" max="5000000" step="any" required placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono font-bold" />
              <p class="text-[11px] text-gray-400 mt-1">Sisa saldo fisik kasir: {{ formatCurrency(pettyFund.current_balance) }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">No. Kuitansi / Bon</label>
                <input v-model="pettyForm.receipt_ref" type="text" placeholder="BON-8812" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
              </div>
              <div>
                <label class="block font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama Petugas / Kasir</label>
                <input v-model="pettyForm.recorded_by" type="text" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isPettyModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSavingPetty" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSavingPetty ? 'Menyimpan...' : 'Simpan Transaksi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { http } from '@/services/http'
import type { IExpenseDto as IExpense, IPettyCashFundDto, IPettyCashTransactionDto } from '@/types/finance'

const activeTab = ref<'expenses' | 'petty_cash'>('expenses')

const records = ref<IExpense[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = ref({
  name: '',
  employee_id: 1,
  total_amount: 0,
  state: 'draft'
})

const employees = ref<any[]>([])
const budgets = ref<any[]>([])

onMounted(() => {
  fetchExpenses()
  fetchEmployees()
  fetchBudgets()
})

const fetchBudgets = async () => {
  try {
    const res = await http.get('/finance/budget')
    budgets.value = res.data?.data?.items || []
  } catch (err) {
    console.error('Failed to load budgets', err)
  }
}

const selectedEmployee = computed(() => {
  return employees.value.find(e => e.id === formData.value.employee_id)
})

const selectedDepartmentBudget = computed(() => {
  if (!selectedEmployee.value) return null
  const deptName = (selectedEmployee.value.department?.name || '').toLowerCase()
  if (!deptName) return null

  return budgets.value.find(b => {
    const bName = (b.department_name || '').toLowerCase()
    return bName.includes(deptName) || deptName.includes(bName)
  }) || null
})

const isOverbudget = computed(() => {
  if (!selectedDepartmentBudget.value) return false
  const remaining = selectedDepartmentBudget.value.allocated_limit - selectedDepartmentBudget.value.realized_spent
  return formData.value.total_amount > remaining
})

const fetchEmployees = async () => {
  try {
    const res = await http.get('/hr/employees')
    employees.value = res.data?.data || res.data || []
    if (employees.value.length > 0 && !formData.value.employee_id) {
      formData.value.employee_id = employees.value[0].id
    }
  } catch (err) {
    console.error('Failed to load employees', err)
  }
}

const fetchExpenses = async () => {
  isLoading.value = true
  try {
    const res = await http.get('/finance/expenses')
    records.value = res.data?.data || res.data || []
  } catch (err) {
    console.error('Failed to load expenses', err)
  } finally {
    isLoading.value = false
  }
}

const totalClaimAmount = computed(() => records.value.reduce((acc, c) => acc + (c.total_amount || 0), 0))
const pendingCount = computed(() => records.value.filter(r => r.state === 'draft' || r.state === 'submit' || !r.state).length)
const approvedCount = computed(() => records.value.filter(r => r.state === 'approved' || r.state === 'paid').length)

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

const formatDate = (d: string) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getStatusBadge = (state: string) => {
  const s = (state || 'draft').toLowerCase()
  if (s === 'approved' || s === 'paid') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
}

const openModal = (mode: 'create' | 'edit', rec?: IExpense) => {
  isEditing.value = mode === 'edit'
  if (mode === 'edit' && rec) {
    editingId.value = rec.id
    formData.value = {
      name: rec.name,
      employee_id: rec.employee_id,
      total_amount: rec.total_amount,
      state: rec.state || 'draft'
    }
  } else {
    editingId.value = null
    formData.value = {
      name: '',
      employee_id: employees.value.length > 0 ? employees.value[0].id : 1,
      total_amount: 0,
      state: 'draft'
    }
  }
  isModalOpen.value = true
}

const saveClaim = async () => {
  isSaving.value = true
  try {
    if (isEditing.value && editingId.value) {
      await http.put(`/finance/expenses/${editingId.value}`, formData.value)
      alert('Klaim berhasil diperbarui!')
    } else {
      await http.post('/finance/expenses', formData.value)
      alert('Klaim berhasil diajukan!')
    }
    isModalOpen.value = false
    await fetchExpenses()
  } catch (err: any) {
    alert('Gagal menyimpan klaim: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const approveClaim = async (claim: IExpense) => {
  if (!confirm(`Setujui reimbursement untuk "${claim.name}" sebesar ${formatCurrency(claim.total_amount)}?`)) return
  try {
    claim.state = 'approved'
    await http.put(`/finance/expenses/${claim.id}`, claim)
    await fetchExpenses()
    alert('Klaim disetujui untuk dicairkan!')
  } catch (err: any) {
    alert('Gagal menyetujui klaim: ' + (err.response?.data?.message || err.message))
  }
}

const deleteClaim = async (id: number) => {
  if (!confirm('Hapus klaim ini?')) return
  try {
    await http.delete(`/finance/expenses/${id}`)
    await fetchExpenses()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}

// --- LOGIKA KAS KECIL (PETTY CASH) ---
const pettyFund = ref<IPettyCashFundDto>({
  id: 1,
  name: 'Kas Kecil Operasional Kantor',
  custodian: 'Staff Keuangan & Kasir',
  plafond_limit: 5000000,
  current_balance: 5000000
})
const pettyTxs = ref<IPettyCashTransactionDto[]>([])
const isPettyModalOpen = ref(false)
const isSavingPetty = ref(false)
const isReplenishing = ref(false)

const pettyForm = ref({
  amount: 50000,
  description: '',
  receipt_ref: '',
  recorded_by: 'Staff Operasional'
})

const fetchPettyCash = async () => {
  try {
    const res = await http.get('/finance/expenses/petty-cash')
    if (res.data?.data) {
      if (res.data.data.fund) pettyFund.value = res.data.data.fund
      if (res.data.data.transactions) pettyTxs.value = res.data.data.transactions
    }
  } catch (err) {
    console.error('Failed to load petty cash data', err)
  }
}

const savePettyExpense = async () => {
  isSavingPetty.value = true
  try {
    await http.post('/finance/expenses/petty-cash/expense', {
      fund_id: pettyFund.value.id || 1,
      amount: pettyForm.value.amount,
      description: pettyForm.value.description,
      receipt_ref: pettyForm.value.receipt_ref,
      recorded_by: pettyForm.value.recorded_by
    })
    alert('Nota pengeluaran kas kecil berhasil dibukukan!')
    isPettyModalOpen.value = false
    pettyForm.value.description = ''
    pettyForm.value.amount = 50000
    pettyForm.value.receipt_ref = ''
    await fetchPettyCash()
  } catch (err: any) {
    alert('Gagal mencatat kas kecil: ' + (err.response?.data?.message || err.message))
  } finally {
    isSavingPetty.value = false
  }
}

const replenishPettyCash = async () => {
  const needed = pettyFund.value.plafond_limit - pettyFund.value.current_balance
  if (!confirm(`Tarik kas dari bank/kas utama sebesar ${formatCurrency(needed)} untuk mengisi kembali saldo kas kecil ke plafon ${formatCurrency(pettyFund.value.plafond_limit)}?`)) return

  isReplenishing.value = true
  try {
    const res = await http.post('/finance/expenses/petty-cash/replenish', {
      fund_id: pettyFund.value.id || 1,
      recorded_by: 'Staff Keuangan'
    })
    alert(res.data?.message || 'Penggantian kas kecil berhasil!')
    await fetchPettyCash()
  } catch (err: any) {
    alert('Gagal melakukan replenishment: ' + (err.response?.data?.message || err.message))
  } finally {
    isReplenishing.value = false
  }
}

onMounted(() => {
  fetchPettyCash()
})
</script>
