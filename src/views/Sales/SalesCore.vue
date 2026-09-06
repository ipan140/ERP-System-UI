<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              💼
            </span>
            Sales Orders, Komisi & KPI Leaderboard
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo Enterprise & Mekari: Multi-tier pricing, proteksi batas diskon (>15%), pelacakan komisi sales, dan papan peringkat KPI tim penjualan.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Toggle Leaderboard / Orders view -->
          <div class="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800 text-xs font-semibold">
            <button
              @click="activeView = 'orders'"
              :class="activeView === 'orders' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
              class="rounded-md px-3 py-1.5 transition"
            >
              📋 Daftar Pesanan
            </button>
            <button
              @click="activeView = 'leaderboard'; fetchLeaderboard()"
              :class="activeView === 'leaderboard' ? 'bg-white text-emerald-600 shadow-sm dark:bg-gray-700 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
              class="rounded-md px-3 py-1.5 transition flex items-center gap-1.5"
            >
              🏆 KPI Leaderboard
              <span class="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">New</span>
            </button>
          </div>

          <button @click="refreshAll" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            + Buat Penawaran Baru
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Penawaran / SO</p>
          <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ records.length }} Pesanan</h3>
          <p class="mt-1 text-xs text-blue-600 font-medium">Dalam siklus penjualan aktif</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Menunggu Approval Diskon</p>
          <h3 class="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">{{ pendingApprovalCount }} Pesanan</h3>
          <p class="mt-1 text-xs text-rose-600 font-medium">Diskon &gt; 15% butuh izin</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Komisi Terakumulasi</p>
          <h3 class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">Rp {{ formatCurrency(totalAccruedCommission) }}</h3>
          <p class="mt-1 text-xs text-amber-600 font-medium">Hak bonus salesperson</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Nilai Order (Gross)</p>
          <h3 class="mt-2 text-2xl font-bold text-brand-500">Rp {{ formatCurrency(totalGrossAmount) }}</h3>
          <p class="mt-1 text-xs text-brand-500 font-medium">Termasuk PPN 11%</p>
        </div>
      </div>

      <!-- VIEW 1: SALES ORDERS TABLE -->
      <div v-if="activeView === 'orders'" class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Surat Penawaran & Pesanan Penjualan</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Multi-Tier Pricing, Pengawasan Diskon Tim Sales, dan Alur Kerja Eksekutif</p>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari no. SO, pelanggan, sales, tier..."
              class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nomor & Salesperson</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pelanggan & Tier Harga</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status Siklus</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Komisi Sales (3%)</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">DPP (Untaxed)</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total + PPN</th>
                <th class="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi & Integrasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading"><td colspan="7" class="px-5 py-8 text-center text-gray-500">Memuat data pesanan penjualan...</td></tr>
              <tr v-else-if="error"><td colspan="7" class="px-5 py-8 text-center text-red-500">{{ error }}</td></tr>
              <tr v-else-if="filteredRecords.length === 0"><td colspan="7" class="px-5 py-8 text-center text-gray-500">Belum ada data penawaran. Klik "+ Buat Penawaran Baru" di atas.</td></tr>
              <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                <td class="px-5 py-4">
                  <div class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                    <span>📄</span>
                    {{ record.name || ('SO-' + record.id) }}
                  </div>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-300">
                      👤 {{ record.salesperson_name || 'Sales Team' }}
                    </span>
                    <span v-if="record.is_payment_link_sent" class="inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[10px] font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                      💳 Link Aktif
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ record.customer_name || 'Pelanggan Umum' }}
                  </div>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      🏷️ {{ record.pricelist_name || 'Standard Retail' }}
                    </span>
                    <span v-if="record.max_discount > 0" class="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      Disc: {{ record.max_discount }}%
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <div class="flex flex-col gap-1 items-start">
                    <span :class="getStatusBadgeClass(record.state)" class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      <span :class="getStatusDotClass(record.state)" class="h-1.5 w-1.5 rounded-full"></span>
                      {{ getStatusLabel(record.state) }}
                    </span>
                    <!-- Approval Pill -->
                    <span
                      v-if="record.needs_approval && record.approval_status !== 'Approved'"
                      class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 animate-pulse"
                    >
                      ⚠️ Butuh Approval (>15%)
                    </span>
                    <span
                      v-else-if="record.approval_status === 'Approved'"
                      class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                    >
                      ✓ Approved Manager
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <div class="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                    Rp {{ formatCurrency(record.commission_amount || (record.amount_untaxed * 0.03)) }}
                  </div>
                  <div class="text-[10px] text-gray-400">
                    Tarif: {{ record.commission_rate || 3 }}% • {{ record.commission_status || 'Accrued' }}
                  </div>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="text-xs font-mono text-gray-600 dark:text-gray-300">
                    Rp {{ formatCurrency(record.amount_untaxed || record.total_amount || 0) }}
                  </div>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="text-sm font-bold font-mono text-gray-900 dark:text-white">
                    Rp {{ formatCurrency(record.amount_total || ((record.amount_untaxed || 0) * 1.11)) }}
                  </div>
                  <div class="text-[10px] text-gray-400">Inc. 11% PPN</div>
                </td>
                <td class="px-5 py-4 text-center">
                  <div class="flex items-center justify-center gap-1.5 flex-wrap">
                    <!-- Cetak SPH PDF -->
                    <button
                      @click="printQuotation(record)"
                      title="Cetak Surat Penawaran Resmi (PDF Generator)"
                      class="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition"
                    >
                      🖨️ SPH
                    </button>

                    <!-- Tanda Tangan Digital (E-Signature) -->
                    <button
                      @click="openSignModal(record)"
                      title="Buka Lembar Tanda Tangan Digital Pelanggan"
                      :class="record.is_signed ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200' : 'bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300'"
                      class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition"
                    >
                      {{ record.is_signed ? '✍️ Tertanda' : '✍️ TTD' }}
                    </button>

                    <!-- Approve Diskon Manajer -->
                    <button
                      v-if="record.needs_approval && record.approval_status !== 'Approved'"
                      @click="approveDiscount(record, 'Approved')"
                      title="Setujui diskon khusus manajer"
                      class="inline-flex items-center gap-1 rounded-md bg-amber-500 hover:bg-amber-600 px-2 py-1 text-xs font-bold text-white transition shadow-sm"
                    >
                      🛡️ Setujui Diskon
                    </button>

                    <!-- Odoo Cycle: Confirm SO -->
                    <button
                      v-if="record.state === 'draft' || record.state === 'sent'"
                      @click="confirmOrder(record)"
                      title="Konfirmasi Menjadi Sales Order (Reservasi Stok Otomatis)"
                      class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition"
                    >
                      ✓ Konfirmasi SO
                    </button>

                    <!-- One-Click Invoicing -->
                    <button
                      v-if="record.state === 'sale'"
                      @click="createInvoice(record)"
                      title="Buat Faktur Otomatis di Modul Finance (Invoicing)"
                      class="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 transition"
                    >
                      💰 Tagihan
                    </button>

                    <!-- Direct Payment Link -->
                    <button
                      @click="generatePaymentLink(record)"
                      title="Kirim Direct Payment Link (Midtrans / QRIS / VA)"
                      class="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition"
                    >
                      💳 PayLink
                    </button>

                    <!-- Edit Button -->
                    <button
                      @click="openModal('edit', record)"
                      class="p-1 rounded text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Ubah Penawaran"
                    >
                      ✏️
                    </button>

                    <!-- Delete Button -->
                    <button
                      @click="deleteRecord(record.id)"
                      class="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Hapus Penawaran"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- VIEW 2: SALES KPI LEADERBOARD & COMMISSIONS -->
      <div v-else class="space-y-6">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-transparent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                🏆 Papan Peringkat Kinerja Tim Sales (KPI & Target Rp 100 Juta)
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Pemantauan real-time deal terkonfirmasi, kuota penjualan, dan estimasi bonus komisi salesperson.
              </p>
            </div>
            <div class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 rounded-lg">
              🎯 Kuota Bulanan Standar: Rp 100.000.000
            </div>
          </div>

          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Peringkat & Salesperson</th>
                  <th class="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Deals / Confirmed</th>
                  <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Nilai Penjualan</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 min-w-[200px]">Pencapaian Target (% Kuota)</th>
                  <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Komisi Diperoleh</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="isLeaderboardLoading">
                  <td colspan="5" class="px-5 py-8 text-center text-gray-500">Memuat kalkulasi papan peringkat sales...</td>
                </tr>
                <tr v-else-if="leaderboardData.length === 0">
                  <td colspan="5" class="px-5 py-8 text-center text-gray-500">Belum ada data transaksi sales.</td>
                </tr>
                <tr v-for="(sales, idx) in leaderboardData" :key="sales.salesperson_name" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <span
                        :class="{
                          'bg-amber-100 text-amber-700 border-amber-300 font-black': idx === 0,
                          'bg-slate-200 text-slate-700 border-slate-300 font-bold': idx === 1,
                          'bg-amber-700/20 text-amber-800 border-amber-700/30 font-bold': idx === 2,
                          'bg-gray-100 text-gray-600 border-gray-200 font-medium': idx > 2
                        }"
                        class="flex h-7 w-7 items-center justify-center rounded-full border text-xs"
                      >
                        {{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1) }}
                      </span>
                      <div>
                        <div class="text-sm font-bold text-gray-900 dark:text-white">
                          {{ sales.salesperson_name }}
                        </div>
                        <div class="text-[11px] text-gray-400">
                          {{ sales.total_orders }} Transaksi Diajukan
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-center">
                    <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {{ sales.confirmed_deals }} Deals Terkonfirmasi
                    </span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <div class="text-sm font-bold font-mono text-gray-900 dark:text-white">
                      Rp {{ formatCurrency(sales.total_revenue) }}
                    </div>
                  </td>
                  <td class="px-5 py-4">
                    <div class="space-y-1">
                      <div class="flex justify-between text-xs font-semibold">
                        <span :class="sales.achievement_pct >= 100 ? 'text-emerald-600' : 'text-gray-700 dark:text-gray-300'">
                          {{ sales.achievement_pct.toFixed(1) }}%
                        </span>
                        <span class="text-[10px] text-gray-400">
                          Target Rp 100 Jt
                        </span>
                      </div>
                      <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="sales.achievement_pct >= 100 ? 'bg-emerald-500' : sales.achievement_pct >= 60 ? 'bg-brand-500' : 'bg-amber-500'"
                          :style="{ width: Math.min(sales.achievement_pct, 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <div class="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      Rp {{ formatCurrency(sales.total_commission) }}
                    </div>
                    <div class="text-[10px] text-gray-400">Komisi Akumulasi</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 1: FORM PENAWARAN (ENTERPRISE QUOTATION BUILDER & MULTI-TIER)       -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-4xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{{ modalMode === 'create' ? '📝 Buat Surat Penawaran (Quotation)' : '✏️ Perbarui Penawaran' }}</span>
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Pilih tingkatan harga (Tier), tentukan salesperson pemegang komisi, dan input baris barang penawaran.
              </p>
            </div>
            <button @click="closeModal" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700">
              ✕
            </button>
          </div>

          <!-- Modal Body Scrollable -->
          <div class="p-6 overflow-y-auto space-y-6">
            <!-- Informasi Pokok Penawaran -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Nama / PT Pelanggan *</label>
                <input
                  v-model="formData.customer_name"
                  type="text"
                  placeholder="PT Maju Bersama Sejahtera"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Email Pelanggan</label>
                <input
                  v-model="formData.customer_email"
                  type="email"
                  placeholder="procurement@majubersama.com"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Tier Daftar Harga (Pricelist)</label>
                <select
                  v-model="formData.pricelist_name"
                  @change="applyPricelistAdjustment"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Standard Retail">Standard Retail (0% Disc)</option>
                  <option value="Grosir B2B">Grosir B2B (Auto Disc 10%)</option>
                  <option value="VIP Distributor">VIP Distributor (Auto Disc 20%)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Salesperson Pemegang Deal</label>
                <select
                  v-model="formData.salesperson_name"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Ahmad Dahlan">Ahmad Dahlan (Senior Sales)</option>
                  <option value="Budi Pratama">Budi Pratama (Account Exec)</option>
                  <option value="Citra Lestari">Citra Lestari (B2B Specialist)</option>
                  <option value="Dewi Sartika">Dewi Sartika (Enterprise Lead)</option>
                  <option value="Sales Team">Tim Sales Umum</option>
                </select>
              </div>
            </div>

            <!-- Warning Banner jika Diskon Melebihi Batas 15% -->
            <div
              v-if="computedMaxDiscount > 15"
              class="rounded-xl border border-amber-300 bg-amber-50 p-3.5 dark:border-amber-900/50 dark:bg-amber-900/20 flex items-start gap-3"
            >
              <span class="text-xl">⚠️</span>
              <div>
                <h4 class="text-xs font-bold text-amber-800 dark:text-amber-300">
                  Perhatian: Diskon Khusus Terdeteksi (Maksimal: {{ computedMaxDiscount }}%)
                </h4>
                <p class="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                  Sesuai kebijakan ERP Enterprise, diskon di atas 15% akan otomatis berstatus <strong>Pending Approval</strong> dan membutuhkan otorisasi Sales Manager sebelum pesanan dapat dikonfirmasi menjadi Sales Order resmi.
                </p>
              </div>
            </div>

            <!-- Tabel Baris Produk (Multi-Item Order Lines) -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Rincian Item & Produk Penawaran
                </label>
                <button
                  type="button"
                  @click="addLine"
                  class="inline-flex items-center gap-1 rounded-md bg-brand-50 hover:bg-brand-100 text-brand-600 px-2.5 py-1 text-xs font-semibold dark:bg-brand-900/30 dark:text-brand-300 transition"
                >
                  + Tambah Baris Produk
                </button>
              </div>

              <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table class="min-w-full text-xs">
                  <thead class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-600 dark:text-gray-300">
                    <tr>
                      <th class="px-3 py-2 text-left">Deskripsi Produk / Layanan</th>
                      <th class="px-3 py-2 text-center w-20">Kuantiti</th>
                      <th class="px-3 py-2 text-right w-36">Harga Satuan (Rp)</th>
                      <th class="px-3 py-2 text-center w-24">Diskon (%)</th>
                      <th class="px-3 py-2 text-right w-36">Subtotal (Rp)</th>
                      <th class="px-2 py-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(line, idx) in formData.order_lines" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                      <td class="p-2">
                        <input
                          v-model="line.description"
                          type="text"
                          placeholder="e.g. Server Dell PowerEdge R750 / Jasa Konsultasi ERP"
                          class="w-full rounded border border-gray-300 px-2 py-1 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </td>
                      <td class="p-2">
                        <input
                          v-model.number="line.quantity"
                          type="number"
                          min="1"
                          class="w-full rounded border border-gray-300 px-2 py-1 text-center focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </td>
                      <td class="p-2">
                        <input
                          v-model.number="line.unit_price"
                          type="number"
                          min="0"
                          class="w-full rounded border border-gray-300 px-2 py-1 text-right focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </td>
                      <td class="p-2">
                        <input
                          v-model.number="line.discount"
                          type="number"
                          min="0"
                          max="100"
                          class="w-full rounded border border-gray-300 px-2 py-1 text-center font-bold focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          :class="line.discount > 15 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'"
                        />
                      </td>
                      <td class="p-2 text-right font-mono font-semibold text-gray-900 dark:text-white">
                        Rp {{ formatCurrency(calcLineSubtotal(line)) }}
                      </td>
                      <td class="p-2 text-center">
                        <button
                          type="button"
                          @click="removeLine(idx)"
                          class="text-gray-400 hover:text-rose-500 transition p-1"
                          title="Hapus baris"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Kalkulasi Subtotal, PPN, dan Estimasi Komisi -->
            <div class="flex flex-col sm:flex-row justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div class="sm:max-w-xs w-full space-y-2">
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Catatan / Syarat & Ketentuan</label>
                <textarea
                  v-model="formData.notes"
                  rows="3"
                  placeholder="Harga sudah termasuk pengiriman Jabodetabek. Pembayaran 30 hari (Net 30)."
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>

              <div class="sm:max-w-xs w-full rounded-xl bg-gray-50 dark:bg-gray-700/30 p-4 space-y-2 border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                  <span>DPP (Untaxed):</span>
                  <span class="font-mono font-medium">Rp {{ formatCurrency(computedUntaxed) }}</span>
                </div>
                <div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                  <span>PPN (Pajak 11%):</span>
                  <span class="font-mono font-medium">Rp {{ formatCurrency(computedTax) }}</span>
                </div>
                <div class="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                  <span>Total Tagihan:</span>
                  <span class="font-mono text-brand-600 dark:text-brand-400">Rp {{ formatCurrency(computedTotal) }}</span>
                </div>
                <div class="border-t border-dashed border-amber-200 dark:border-amber-800/50 pt-2 flex justify-between text-xs text-amber-700 dark:text-amber-400 font-semibold">
                  <span>Estimasi Komisi (3%):</span>
                  <span class="font-mono">Rp {{ formatCurrency(computedUntaxed * 0.03) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Batal
            </button>
            <button
              type="button"
              @click="saveRecord"
              :disabled="isSaving"
              class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition"
            >
              {{ isSaving ? 'Menyimpan...' : 'Simpan Surat Penawaran' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- MODAL 2: CETAK SURAT PENAWARAN HARGA (SPH) RESMI PDF PREVIEW             -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isPreviewOpen" class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
        <div class="w-full max-w-4xl rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          <!-- Actions Header -->
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-gray-50 print:hidden">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-gray-800">📄 Pratinjau Dokumen Resmi Penawaran Harga (SPH)</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="triggerBrowserPrint"
                class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition"
              >
                🖨️ Cetak / Simpan PDF
              </button>
              <button @click="isPreviewOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                ✕
              </button>
            </div>
          </div>

          <!-- Printable Area -->
          <div id="quotation-print-area" class="p-8 overflow-y-auto bg-white text-gray-900 font-sans space-y-6">
            <!-- Kop Surat Perusahaan -->
            <div class="flex items-center justify-between border-b-2 border-gray-800 pb-4">
              <div class="flex items-center gap-3">
                <div class="h-12 w-12 rounded-xl bg-brand-500 flex items-center justify-center text-white text-xl font-black">
                  ERP
                </div>
                <div>
                  <h1 class="text-xl font-black tracking-tight text-gray-900 uppercase">PT SISTEM SOLUSI ENTERPRISE TBK</h1>
                  <p class="text-xs text-gray-500">Kawasan Industri Cyber, Gedung Menara Utama Lt. 12, Jakarta 12950</p>
                  <p class="text-xs text-gray-500">Tel: (021) 555-8899 | Email: sales@enterprise-erp.co.id</p>
                </div>
              </div>
              <div class="text-right">
                <h2 class="text-lg font-bold text-gray-800 uppercase tracking-wider">Surat Penawaran Harga</h2>
                <p class="text-xs font-mono font-semibold text-gray-600">{{ selectedOrder?.name || ('SO/' + selectedOrder?.id) }}</p>
                <p class="text-xs text-gray-500 mt-1">Tanggal: {{ formatDate(selectedOrder?.date_order || selectedOrder?.created_at) }}</p>
              </div>
            </div>

            <!-- Info Pelanggan -->
            <div class="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs">
              <div>
                <p class="font-bold text-gray-600 uppercase">Kepada Yth:</p>
                <h3 class="text-sm font-black text-gray-900 mt-1">{{ selectedOrder?.customer_name || 'Pelanggan Umum' }}</h3>
                <p class="text-gray-600 mt-0.5">{{ selectedOrder?.customer_email || 'Email belum ditentukan' }}</p>
                <p class="text-gray-600">Up: Bagian Pengadaan / Procurement</p>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between">
                  <span class="text-gray-500">Tier Harga:</span>
                  <span class="font-bold">{{ selectedOrder?.pricelist_name || 'Standard Retail' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Status Dokumen:</span>
                  <span class="font-bold text-brand-600 uppercase">{{ selectedOrder?.state || 'DRAFT' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Salesperson:</span>
                  <span class="font-bold">{{ selectedOrder?.salesperson_name || 'Sales Team' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Masa Berlaku:</span>
                  <span>14 Hari Sejak Diterbitkan</span>
                </div>
              </div>
            </div>

            <!-- Tabel Produk Dokumen -->
            <table class="min-w-full text-xs border border-gray-300">
              <thead class="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold uppercase">
                <tr>
                  <th class="p-2.5 text-center w-10 border-r border-gray-300">No</th>
                  <th class="p-2.5 text-left border-r border-gray-300">Deskripsi Barang / Layanan</th>
                  <th class="p-2.5 text-center w-16 border-r border-gray-300">Qty</th>
                  <th class="p-2.5 text-right w-32 border-r border-gray-300">Harga Satuan</th>
                  <th class="p-2.5 text-center w-20 border-r border-gray-300">Diskon</th>
                  <th class="p-2.5 text-right w-36">Jumlah (IDR)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-300">
                <tr v-for="(line, i) in (selectedOrder?.order_lines || [])" :key="i">
                  <td class="p-2 text-center border-r border-gray-300">{{ i + 1 }}</td>
                  <td class="p-2 border-r border-gray-300 font-medium">{{ line.description }}</td>
                  <td class="p-2 text-center border-r border-gray-300">{{ line.quantity }}</td>
                  <td class="p-2 text-right border-r border-gray-300 font-mono">Rp {{ formatCurrency(line.unit_price) }}</td>
                  <td class="p-2 text-center border-r border-gray-300 font-semibold">{{ line.discount }}%</td>
                  <td class="p-2 text-right font-mono font-bold">Rp {{ formatCurrency(calcLineSubtotal(line)) }}</td>
                </tr>
                <tr v-if="!selectedOrder?.order_lines || selectedOrder.order_lines.length === 0">
                  <td class="p-2 text-center border-r border-gray-300">1</td>
                  <td class="p-2 border-r border-gray-300 font-medium">Paket Pengadaan & Solusi Terpadu</td>
                  <td class="p-2 text-center border-r border-gray-300">1</td>
                  <td class="p-2 text-right border-r border-gray-300 font-mono">Rp {{ formatCurrency(selectedOrder?.amount_untaxed || selectedOrder?.total_amount) }}</td>
                  <td class="p-2 text-center border-r border-gray-300">0%</td>
                  <td class="p-2 text-right font-mono font-bold">Rp {{ formatCurrency(selectedOrder?.amount_untaxed || selectedOrder?.total_amount) }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Ringkasan Total Penawaran -->
            <div class="flex justify-end">
              <div class="w-72 space-y-1.5 text-xs border border-gray-300 p-3 rounded bg-gray-50">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal (DPP):</span>
                  <span class="font-mono font-semibold">Rp {{ formatCurrency(selectedOrder?.amount_untaxed || selectedOrder?.total_amount || 0) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>PPN 11%:</span>
                  <span class="font-mono font-semibold">Rp {{ formatCurrency(selectedOrder?.amount_tax || ((selectedOrder?.amount_untaxed || 0) * 0.11)) }}</span>
                </div>
                <div class="border-t border-gray-300 pt-1 flex justify-between font-bold text-sm text-gray-900">
                  <span>Total Nilai:</span>
                  <span class="font-mono text-brand-600">Rp {{ formatCurrency(selectedOrder?.amount_total || ((selectedOrder?.amount_untaxed || 0) * 1.11)) }}</span>
                </div>
              </div>
            </div>

            <!-- Tanda Tangan & Otorisasi -->
            <div class="grid grid-cols-2 gap-12 pt-8 text-center text-xs">
              <div>
                <p class="font-semibold text-gray-600">Disetujui Oleh Pelanggan,</p>
                <div class="h-20 flex items-center justify-center">
                  <img
                    v-if="signaturesMap[selectedOrder?.id]"
                    :src="signaturesMap[selectedOrder?.id]"
                    alt="Customer E-Signature"
                    class="max-h-16 max-w-[160px] object-contain border-b border-gray-300"
                  />
                  <div v-else-if="selectedOrder?.is_signed" class="text-center">
                    <span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded">
                      ✓ Terverifikasi Digital E-Signature
                    </span>
                  </div>
                  <span v-else class="text-[10px] text-gray-400 italic">( Tanda Tangan & Stempel Perusahaan )</span>
                </div>
                <p class="border-t border-gray-400 pt-1 font-bold">{{ selectedOrder?.customer_name || 'Pelanggan' }}</p>
                <p v-if="selectedOrder?.is_signed" class="text-[9px] text-emerald-600 font-mono">Secured & Signed</p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Hormat Kami, PT Sistem Solusi Enterprise</p>
                <div class="h-16 flex items-end justify-center">
                  <span class="text-xs text-brand-600 font-serif italic">Materai & Authorized Signature</span>
                </div>
                <p class="border-t border-gray-400 pt-1 font-bold">{{ selectedOrder?.salesperson_name || 'Sales Department Manager' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- MODAL 3: DIRECT PAYMENT LINK (MIDTRANS / QRIS GATEWAY)                    -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isPaymentModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>💳</span> Link Pembayaran Instant
            </h3>
            <button @click="isPaymentModalOpen = false" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div class="mt-4 space-y-4">
            <div class="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-4 border border-emerald-200 dark:border-emerald-800 text-center">
              <p class="text-xs text-emerald-800 dark:text-emerald-300 font-semibold uppercase tracking-wider">Total Tagihan Pesanan</p>
              <h2 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                Rp {{ formatCurrency(paymentData?.gross_amount) }}
              </h2>
              <p class="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-1">
                Order: {{ paymentData?.order_name }} • Provider: {{ paymentData?.provider }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Link Pembayaran (Midtrans Snap URL)</label>
              <div class="flex gap-2">
                <input
                  :value="paymentData?.payment_url"
                  readonly
                  class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-mono"
                />
                <button
                  @click="copyPaymentLink"
                  class="rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 transition"
                >
                  {{ isCopied ? 'Tersalin!' : 'Salin' }}
                </button>
              </div>
              <p class="text-[11px] text-gray-400 mt-1">Berlaku sampai: {{ paymentData?.expired_at }}</p>
            </div>

            <div class="pt-2 flex justify-between gap-3">
              <button
                @click="isPaymentModalOpen = false"
                class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Tutup
              </button>
              <a
                :href="paymentData?.payment_url"
                target="_blank"
                class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition shadow-sm text-center"
              >
                Buka Gateway ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- MODAL 4: DIGITAL E-SIGNATURE PAD CANVAS                                   -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isSignModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-700">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>✍️</span> Lembar Tanda Tangan Digital (E-Signature)
            </h3>
            <button @click="isSignModalOpen = false" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div class="mt-4 space-y-4">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Tanda tangani penawaran <b>{{ signingOrder?.name }}</b> secara digital. Tanda tangan akan dicantumkan secara legal pada berkas SPH resmi.
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Nama Penanda Tangan / Otorisator</label>
              <input
                v-model="signerName"
                type="text"
                placeholder="Nama Lengkap Penanda Tangan"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Goreskan Tanda Tangan di Kanvas</label>
                <button
                  type="button"
                  @click="clearCanvas"
                  class="text-xs text-rose-500 hover:text-rose-600 font-semibold"
                >
                  Bersihkan Kanvas ✕
                </button>
              </div>

              <!-- Canvas Pad -->
              <div class="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-1">
                <canvas
                  ref="signatureCanvas"
                  width="450"
                  height="180"
                  class="w-full h-44 cursor-crosshair rounded-lg bg-white touch-none"
                  @mousedown="startDrawing"
                  @mousemove="draw"
                  @mouseup="stopDrawing"
                  @mouseleave="stopDrawing"
                  @touchstart.prevent="startTouchDrawing"
                  @touchmove.prevent="touchDraw"
                  @touchend.prevent="stopDrawing"
                ></canvas>
              </div>
              <p class="text-[11px] text-gray-400 mt-1">Gunakan mouse, stylus, atau sentuhan jari Anda pada kanvas di atas.</p>
            </div>

            <div class="pt-2 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isSignModalOpen = false"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="button"
                @click="saveSignature"
                :disabled="isSigningSubmitting"
                class="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-50 transition"
              >
                {{ isSigningSubmitting ? 'Memproses...' : 'Otorisasi & Simpan Tanda Tangan' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { API_BASE_URL } from '@/config/api'

interface OrderLine {
  id?: number
  description: string
  quantity: number
  unit_price: number
  discount: number
  sub_total?: number
}

const activeView = ref<'orders' | 'leaderboard'>('orders')

const records = ref<any[]>([])
const leaderboardData = ref<any[]>([])
const isLoading = ref(false)
const isLeaderboardLoading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)

const isPreviewOpen = ref(false)
const selectedOrder = ref<any>(null)

// Payment modal state
const isPaymentModalOpen = ref(false)
const paymentData = ref<any>(null)
const isCopied = ref(false)

// Digital E-Signature state
const isSignModalOpen = ref(false)
const signingOrder = ref<any>(null)
const signerName = ref('')
const isSigningSubmitting = ref(false)
const signatureCanvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const signaturesMap = ref<Record<number, string>>({})

const formData = ref({
  id: null as number | null,
  name: '',
  customer_name: '',
  customer_email: '',
  pricelist_name: 'Standard Retail',
  salesperson_name: 'Ahmad Dahlan',
  state: 'draft',
  notes: '',
  order_lines: [] as OrderLine[]
})

// Metrics KPI
const confirmedCount = computed(() =>
  records.value.filter(r => ['sale', 'done', 'Accepted'].includes(r.state || r.status)).length
)

const pendingApprovalCount = computed(() =>
  records.value.filter(r => (r.needs_approval || (r.max_discount > 15)) && r.approval_status !== 'Approved').length
)

const totalGrossAmount = computed(() =>
  records.value.reduce((acc, curr) => acc + (Number(curr.amount_total) || Number(curr.total_amount) || 0), 0)
)

const totalAccruedCommission = computed(() =>
  records.value.reduce((acc, curr) => {
    const untaxed = Number(curr.amount_untaxed) || Number(curr.total_amount) || 0
    return acc + (Number(curr.commission_amount) || (untaxed * 0.03))
  }, 0)
)

const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value
  const q = searchQuery.value.toLowerCase()
  return records.value.filter(r =>
    (r.name && r.name.toLowerCase().includes(q)) ||
    (r.customer_name && r.customer_name.toLowerCase().includes(q)) ||
    (r.customer_email && r.customer_email.toLowerCase().includes(q)) ||
    (r.pricelist_name && r.pricelist_name.toLowerCase().includes(q)) ||
    (r.salesperson_name && r.salesperson_name.toLowerCase().includes(q))
  )
})

// Order lines subtotal calculations
const calcLineSubtotal = (line: OrderLine) => {
  const qty = Number(line.quantity) || 0
  const price = Number(line.unit_price) || 0
  const disc = Number(line.discount) || 0
  return qty * price * (1 - (disc / 100))
}

const computedUntaxed = computed(() => {
  return formData.value.order_lines.reduce((acc, line) => acc + calcLineSubtotal(line), 0)
})

const computedTax = computed(() => {
  return computedUntaxed.value * 0.11 // PPN 11%
})

const computedTotal = computed(() => {
  return computedUntaxed.value + computedTax.value
})

const computedMaxDiscount = computed(() => {
  return formData.value.order_lines.reduce((max, line) => Math.max(max, Number(line.discount) || 0), 0)
})

const addLine = () => {
  let defaultDisc = 0
  if (formData.value.pricelist_name === 'Grosir B2B') defaultDisc = 10
  if (formData.value.pricelist_name === 'VIP Distributor') defaultDisc = 20

  formData.value.order_lines.push({
    description: '',
    quantity: 1,
    unit_price: 0,
    discount: defaultDisc
  })
}

const removeLine = (idx: number) => {
  if (formData.value.order_lines.length > 1) {
    formData.value.order_lines.splice(idx, 1)
  }
}

// FASE 3: Otomatisasi diskon dasar saat mengganti Tier Pricelist
const applyPricelistAdjustment = () => {
  const tier = formData.value.pricelist_name
  formData.value.order_lines.forEach(line => {
    if (tier === 'Grosir B2B') {
      line.discount = 10
    } else if (tier === 'VIP Distributor') {
      line.discount = 20
    } else {
      line.discount = 0
    }
  })
}

const formatCurrency = (val: number | string | undefined) => {
  const num = Number(val) || 0
  return num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const getStatusBadgeClass = (state: string | undefined) => {
  switch (state) {
    case 'sale':
    case 'Accepted':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    case 'sent':
    case 'Sent':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    case 'done':
      return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    case 'cancel':
    case 'Rejected':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getStatusDotClass = (state: string | undefined) => {
  switch (state) {
    case 'sale':
    case 'Accepted':
      return 'bg-emerald-500'
    case 'sent':
    case 'Sent':
      return 'bg-blue-500'
    case 'done':
      return 'bg-purple-500'
    case 'cancel':
    case 'Rejected':
      return 'bg-rose-500'
    default:
      return 'bg-gray-400'
  }
}

const getStatusLabel = (state: string | undefined) => {
  switch (state) {
    case 'draft': return 'Draft Quotation'
    case 'sent': return 'Quotation Sent'
    case 'sale': return 'Sales Order (Confirmed)'
    case 'done': return 'Locked / Selesai'
    case 'cancel': return 'Dibatalkan'
    default: return state || 'Draft'
  }
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/core`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    records.value = Array.isArray(data) ? data : (data.data || [])
  } catch (err: any) {
    error.value = 'Gagal memuat pesanan: ' + err.message
  } finally {
    isLoading.value = false
  }
}

const fetchLeaderboard = async () => {
  isLeaderboardLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/core/leaderboard`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    leaderboardData.value = Array.isArray(data) ? data : (data.data || [])
  } catch (err: any) {
    console.error('Failed to fetch leaderboard:', err)
  } finally {
    isLeaderboardLoading.value = false
  }
}

const refreshAll = () => {
  fetchData()
  if (activeView.value === 'leaderboard') {
    fetchLeaderboard()
  }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id,
      name: data.name || '',
      customer_name: data.customer_name || '',
      customer_email: data.customer_email || '',
      pricelist_name: data.pricelist_name || 'Standard Retail',
      salesperson_name: data.salesperson_name || 'Ahmad Dahlan',
      state: data.state || (data.status === 'Accepted' ? 'sale' : data.status?.toLowerCase()) || 'draft',
      notes: data.notes || '',
      order_lines: Array.isArray(data.order_lines) && data.order_lines.length > 0
        ? JSON.parse(JSON.stringify(data.order_lines))
        : [
            {
              description: 'Item Penawaran Pokok',
              quantity: 1,
              unit_price: data.amount_untaxed || data.total_amount || 0,
              discount: data.max_discount || 0
            }
          ]
    }
  } else {
    formData.value = {
      id: null,
      name: '',
      customer_name: '',
      customer_email: '',
      pricelist_name: 'Standard Retail',
      salesperson_name: 'Ahmad Dahlan',
      state: 'draft',
      notes: '',
      order_lines: [
        {
          description: '',
          quantity: 1,
          unit_price: 0,
          discount: 0
        }
      ]
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    const token = localStorage.getItem('token')
    const isEdit = modalMode.value === 'edit'
    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit
      ? `${API_BASE_URL}/sales/core/${formData.value.id}`
      : `${API_BASE_URL}/sales/core`

    const payload: any = {
      name: formData.value.name,
      customer_name: formData.value.customer_name,
      customer_email: formData.value.customer_email,
      pricelist_name: formData.value.pricelist_name,
      salesperson_name: formData.value.salesperson_name,
      state: formData.value.state,
      notes: formData.value.notes,
      order_lines: formData.value.order_lines.map(l => ({
        description: l.description,
        quantity: Number(l.quantity),
        unit_price: Number(l.unit_price),
        discount: Number(l.discount),
        sub_total: calcLineSubtotal(l)
      })),
      amount_untaxed: computedUntaxed.value,
      amount_tax: computedTax.value,
      amount_total: computedTotal.value,
      total_amount: computedTotal.value
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('Gagal menyimpan penawaran')
    closeModal()
    refreshAll()
  } catch (err: any) {
    alert(err.message)
  } finally {
    isSaving.value = false
  }
}

// [FASE 3]: Approve Diskon Khusus
const approveDiscount = async (record: any, status: 'Approved' | 'Rejected') => {
  const approver = prompt('Masukkan nama Sales Manager penyetuju:', 'Budi Santoso (Head of Sales)')
  if (!approver) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/core/${record.id}/approve-discount`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, approver })
    })
    if (!res.ok) throw new Error('Gagal memproses approval diskon')
    alert(`Diskon sebesar ${record.max_discount}% untuk pesanan ${record.name} telah berhasil DISETUJUI oleh ${approver}.`)
    refreshAll()
  } catch (err: any) {
    alert(err.message)
  }
}

const confirmOrder = async (record: any) => {
  if ((record.needs_approval || (record.max_discount > 15)) && record.approval_status !== 'Approved') {
    alert(`Perhatian: Pesanan ini memiliki diskon sebesar ${record.max_discount}%, melebihi batas kebijakan 15%. Harap minta persetujuan Sales Manager (Klik tombol "Setujui Diskon") terlebih dahulu sebelum konfirmasi SO.`)
    return
  }

  if (!confirm('Konfirmasi penawaran ini menjadi Sales Order resmi (Odoo Confirmed SO)? Sistem akan otomatis memeriksa stok gudang & membuat dokumen Surat Jalan Pengeluaran Barang (Stock Picking Out).')) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/core/${record.id}/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) {
      const errRes = await res.json()
      throw new Error(errRes.message || 'Gagal mengonfirmasi pesanan')
    }
    refreshAll()
  } catch (err: any) {
    alert(err.message)
  }
}

// [FASE 2]: One-Click Invoicing
const createInvoice = async (record: any) => {
  if (!confirm(`Buat faktur (Invoice) otomatis di Modul Finance untuk pesanan ${record.name || ('SO-' + record.id)}?`)) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/core/${record.id}/create-invoice`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error('Gagal membuat faktur penjualan')
    const resData = await res.json()
    const invoiceNum = resData.data?.name || 'Faktur Baru'
    alert(`Berhasil! Faktur ${invoiceNum} telah otomatis diterbitkan di Modul Finance Invoicing tanpa input ulang.`)
    refreshAll()
  } catch (err: any) {
    alert('Gagal: ' + err.message)
  }
}

// [FASE 2]: Generate Payment Link
const generatePaymentLink = async (record: any) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/core/${record.id}/payment-link`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error('Gagal membuat link pembayaran')
    const resData = await res.json()
    paymentData.value = resData.data
    isCopied.value = false
    isPaymentModalOpen.value = true
    refreshAll()
  } catch (err: any) {
    alert('Gagal: ' + err.message)
  }
}

const copyPaymentLink = async () => {
  if (paymentData.value?.payment_url) {
    try {
      await navigator.clipboard.writeText(paymentData.value.payment_url)
      isCopied.value = true
      setTimeout(() => { isCopied.value = false }, 3000)
    } catch {
      // fallback
    }
  }
}

const printQuotation = async (record: any) => {
  selectedOrder.value = record
  isPreviewOpen.value = true
  try {
    const token = localStorage.getItem('token')
    await fetch(`${API_BASE_URL}/sales/core/${record.id}/print`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
  } catch {
    // optional preview trigger
  }
}

const triggerBrowserPrint = () => {
  window.print()
}

// =========================================================================
// E-SIGNATURE CANVAS LOGIC
// =========================================================================
const openSignModal = (record: any) => {
  signingOrder.value = record
  signerName.value = record.customer_name || ''
  isSignModalOpen.value = true
  setTimeout(() => {
    clearCanvas()
  }, 100)
}

const clearCanvas = () => {
  if (!signatureCanvas.value) return
  const ctx = signatureCanvas.value.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
  }
}

const getCanvasPos = (e: MouseEvent) => {
  if (!signatureCanvas.value) return { x: 0, y: 0 }
  const rect = signatureCanvas.value.getBoundingClientRect()
  const scaleX = signatureCanvas.value.width / rect.width
  const scaleY = signatureCanvas.value.height / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}

const startDrawing = (e: MouseEvent) => {
  if (!signatureCanvas.value) return
  isDrawing.value = true
  const ctx = signatureCanvas.value.getContext('2d')
  if (!ctx) return
  const pos = getCanvasPos(e)
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = '#1e293b'
}

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !signatureCanvas.value) return
  const ctx = signatureCanvas.value.getContext('2d')
  if (!ctx) return
  const pos = getCanvasPos(e)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

const stopDrawing = () => {
  isDrawing.value = false
}

const startTouchDrawing = (e: TouchEvent) => {
  if (!signatureCanvas.value || e.touches.length === 0) return
  isDrawing.value = true
  const touch = e.touches[0]
  const rect = signatureCanvas.value.getBoundingClientRect()
  const scaleX = signatureCanvas.value.width / rect.width
  const scaleY = signatureCanvas.value.height / rect.height
  const ctx = signatureCanvas.value.getContext('2d')
  if (!ctx) return
  ctx.beginPath()
  ctx.moveTo((touch.clientX - rect.left) * scaleX, (touch.clientY - rect.top) * scaleY)
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = '#1e293b'
}

const touchDraw = (e: TouchEvent) => {
  if (!isDrawing.value || !signatureCanvas.value || e.touches.length === 0) return
  const touch = e.touches[0]
  const rect = signatureCanvas.value.getBoundingClientRect()
  const scaleX = signatureCanvas.value.width / rect.width
  const scaleY = signatureCanvas.value.height / rect.height
  const ctx = signatureCanvas.value.getContext('2d')
  if (!ctx) return
  ctx.lineTo((touch.clientX - rect.left) * scaleX, (touch.clientY - rect.top) * scaleY)
  ctx.stroke()
}

const saveSignature = async () => {
  if (!signingOrder.value) return
  if (!signerName.value.trim()) {
    alert('Harap isi nama penanda tangan.')
    return
  }

  isSigningSubmitting.value = true
  try {
    const dataUrl = signatureCanvas.value ? signatureCanvas.value.toDataURL('image/png') : ''
    const orderId = signingOrder.value.id
    if (dataUrl) {
      signaturesMap.value[orderId] = dataUrl
      // Simpan di local cache
      try {
        localStorage.setItem(`signature_so_${orderId}`, dataUrl)
      } catch {}
    }

    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/core/${orderId}/sign`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ signer_name: signerName.value })
    })

    if (!res.ok) {
      const errJson = await res.json()
      throw new Error(errJson.message || 'Gagal menyimpan tanda tangan')
    }

    signingOrder.value.is_signed = true
    signingOrder.value.customer_name = signerName.value
    isSignModalOpen.value = false
    alert(`Berhasil! Penawaran ${signingOrder.value.name} telah ditandatangani secara sah oleh ${signerName.value}.`)
    refreshAll()
  } catch (err: any) {
    alert('Gagal tanda tangan: ' + err.message)
  } finally {
    isSigningSubmitting.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus pesanan penawaran ini?')) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/core/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    if (!res.ok) throw new Error('Gagal menghapus data')
    refreshAll()
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(() => {
  fetchData()
  fetchLeaderboard()
})
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #quotation-print-area, #quotation-print-area * {
    visibility: visible;
  }
  #quotation-print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px;
    border: none;
    box-shadow: none;
  }
}
</style>
