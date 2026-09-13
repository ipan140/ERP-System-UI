<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb & Switcher -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Portal Layanan Mandiri Rekanan Bisnis" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Customer & Vendor B2B Self-Service Portal (Standar Odoo Partner Portal)
          </p>
        </div>

        <!-- Role Portal Switcher -->
        <div class="flex items-center rounded-2xl bg-gray-100 p-1 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <button
            @click="portalRole = 'customer'"
            :class="[
              'rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5',
              portalRole === 'customer'
                ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
            ]"
          >
            🏢 Portal Pelanggan (Customer)
          </button>
          <button
            @click="portalRole = 'vendor'"
            :class="[
              'rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5',
              portalRole === 'vendor'
                ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
            ]"
          >
            🏭 Portal Pemasok (Vendor)
          </button>
        </div>
      </div>

      <!-- Hero Summary Banner -->
      <div
        :class="[
          'rounded-3xl p-6 text-white shadow-xl transition-all',
          portalRole === 'customer'
            ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900'
            : 'bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900'
        ]"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {{ portalRole === 'customer' ? 'Area Pelanggan B2B' : 'Area Pemasok / Vendor' }}
            </span>
            <h2 class="mt-2 text-2xl font-extrabold sm:text-3xl">
              {{ portalRole === 'customer' ? 'Pantau Pesanan, Faktur & Logistik' : 'Manajemen Purchase Order & Tagihan Vendor' }}
            </h2>
            <p class="mt-1 text-xs sm:text-sm text-blue-100 dark:text-teal-100 max-w-2xl">
              {{ portalRole === 'customer'
                ? 'Akses mandiri untuk memeriksa status pesanan barang, mengunduh faktur resmi (e-Invoice), dan memantau status pengiriman logistik secara real-time.'
                : 'Akses resmi bagi rekanan vendor untuk meninjau Purchase Order (PO), status penerimaan barang di gudang, serta mengunggah faktur penagihan.'
              }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              v-if="portalRole === 'vendor'"
              @click="showUploadInvoiceModal = true"
              class="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-teal-800 shadow hover:bg-gray-100 transition-all flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Upload Faktur Penagihan
            </button>
          </div>
        </div>
      </div>

      <!-- CUSTOMER PORTAL VIEW -->
      <div v-if="portalRole === 'customer'" class="space-y-6">
        <!-- Customer KPI -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <span class="text-xs font-semibold text-gray-500">Total Transaksi Selesai</span>
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">Rp 63.050.000</h3>
            <span class="text-[11px] text-emerald-600 font-semibold">3 Pesanan Terkonfirmasi</span>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <span class="text-xs font-semibold text-gray-500">Dalam Pengiriman</span>
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">1 Pengiriman</h3>
            <span class="text-[11px] text-blue-600 font-semibold">Resi: JNE-TRK-98127391</span>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <span class="text-xs font-semibold text-gray-500">Tagihan Belum Lunas</span>
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">Rp 0</h3>
            <span class="text-[11px] text-emerald-600 font-semibold">Semua Faktur Lunas</span>
          </div>
        </div>

        <!-- Customer Orders Table -->
        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800 overflow-hidden">
          <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-base text-gray-900 dark:text-white">Riwayat Sale Order & Faktur Pelanggan</h3>
              <p class="text-xs text-gray-500">Daftar pesanan barang dan lisensi software atas nama akun Anda</p>
            </div>
            <button @click="fetchPortalData" class="text-xs font-semibold text-brand-600 hover:underline">
              Segarkan Data
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-900/40 text-left text-xs font-semibold text-gray-500 uppercase">
                  <th class="py-3 px-4">No. Order</th>
                  <th class="py-3 px-4">Tanggal</th>
                  <th class="py-3 px-4">Rincian Barang</th>
                  <th class="py-3 px-4">Nilai Pesanan</th>
                  <th class="py-3 px-4">Status Pengiriman</th>
                  <th class="py-3 px-4">Status Faktur</th>
                  <th class="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="order in customerOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td class="py-3.5 px-4 font-bold text-gray-900 dark:text-white">{{ order.order_number }}</td>
                  <td class="py-3.5 px-4 text-xs text-gray-500">{{ order.date }}</td>
                  <td class="py-3.5 px-4 text-xs text-gray-600 dark:text-gray-300">{{ order.items }}</td>
                  <td class="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">{{ formatRupiah(order.total) }}</td>
                  <td class="py-3.5 px-4">
                    <span class="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {{ order.invoice_stat }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="downloadInvoice(order)" class="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
                        Unduh Faktur
                      </button>
                      <button @click="trackShipping(order)" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                        Lacak Resi
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- VENDOR PORTAL VIEW -->
      <div v-else class="space-y-6">
        <!-- Vendor KPI -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <span class="text-xs font-semibold text-gray-500">Total Purchase Order Aktif</span>
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">2 Kontrak PO</h3>
            <span class="text-[11px] text-teal-600 font-semibold">Tersinkronisasi Gudang</span>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <span class="text-xs font-semibold text-gray-500">Nilai Kontrak Berjalan</span>
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">Rp 50.500.000</h3>
            <span class="text-[11px] text-emerald-600 font-semibold">Jadwal Pembayaran Lancar</span>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <span class="text-xs font-semibold text-gray-500">Status Faktur Pajak</span>
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">100% Valid</h3>
            <span class="text-[11px] text-teal-600 font-semibold">Kepatuhan Pajak DJP</span>
          </div>
        </div>

        <!-- Vendor Orders Table -->
        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800 overflow-hidden">
          <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-base text-gray-900 dark:text-white">Daftar Purchase Order (PO) Masuk</h3>
              <p class="text-xs text-gray-500">PO resmi yang diterbitkan oleh Divisi Procurement PT. Nusantara Prima Solusindo</p>
            </div>
            <button @click="showUploadInvoiceModal = true" class="rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700">
              + Unggah Tagihan
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-900/40 text-left text-xs font-semibold text-gray-500 uppercase">
                  <th class="py-3 px-4">No. PO</th>
                  <th class="py-3 px-4">Nama Vendor</th>
                  <th class="py-3 px-4">Tanggal Rilis</th>
                  <th class="py-3 px-4">Nilai PO</th>
                  <th class="py-3 px-4">Status Pengiriman Barang</th>
                  <th class="py-3 px-4">Penerimaan di Gudang</th>
                  <th class="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="po in vendorOrders" :key="po.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td class="py-3.5 px-4 font-bold text-gray-900 dark:text-white">{{ po.po_number }}</td>
                  <td class="py-3.5 px-4 text-xs font-medium text-gray-700 dark:text-gray-300">{{ po.vendor_name }}</td>
                  <td class="py-3.5 px-4 text-xs text-gray-500">{{ po.date }}</td>
                  <td class="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">{{ formatRupiah(po.total) }}</td>
                  <td class="py-3.5 px-4">
                    <span class="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      {{ po.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300">{{ po.receipt_stat }}</td>
                  <td class="py-3.5 px-4 text-right">
                    <button @click="viewPODetail(po)" class="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400">
                      Lihat Rincian PO &rarr;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Upload Faktur Vendor -->
      <div v-if="showUploadInvoiceModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showUploadInvoiceModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Unggah Faktur Tagihan Vendor</h3>
          <p class="text-xs text-gray-500 mb-4">Berkas akan langsung diteruskan ke Tim Account Payable (Finance) untuk verifikasi pembayaran.</p>

          <form @submit.prevent="submitVendorInvoice" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nomor PO Terkait *</label>
              <select v-model="uploadInvoiceForm.po_number" required class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <option value="PO/2026/0412">PO/2026/0412 - PT. Distribusi Logistik Utama (Rp 42.000.000)</option>
                <option value="PO/2026/0398">PO/2026/0398 - PT. Kertas Nusantara Jaya (Rp 8.500.000)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nomor Faktur Pajak / Invoice Vendor *</label>
              <input v-model="uploadInvoiceForm.invoice_no" required type="text" placeholder="Contoh: INV-DLU-2026-081" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Lampiran Berkas Faktur (PDF / Scan Kuitansi) *</label>
              <input type="file" accept=".pdf,.png,.jpg" required class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div class="pt-3 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="showUploadInvoiceModal = false" class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700">Kirimkan Tagihan</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Dokumen Faktur Penjualan Resmi PDF (Fase 6) -->
      <div v-if="showInvoiceDocModal && selectedInvoiceOrder" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900 my-6">
          <button @click="showInvoiceDocModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <!-- Printable Document Paper -->
          <div class="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs">
            <!-- Kop Perusahaan -->
            <div class="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
                  N
                </div>
                <div>
                  <h3 class="font-extrabold text-sm uppercase">PT. Nusantara Prima Solusindo</h3>
                  <p class="text-[10px] text-gray-500">NPWP: 01.892.456.2-014.000 &bull; Jakarta Selatan</p>
                </div>
              </div>
              <div class="text-right">
                <span class="font-bold text-base text-brand-600 dark:text-brand-400 block">FAKTUR PENJUALAN</span>
                <span class="font-mono font-bold text-gray-700 dark:text-gray-300">{{ selectedInvoiceOrder.invoice_no }}</span>
              </div>
            </div>

            <!-- Meta Bill To -->
            <div class="grid grid-cols-2 gap-4 my-4 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <span class="text-[10px] text-gray-400 block uppercase font-bold">Tagihan Kepada (Bill To):</span>
                <p class="font-bold mt-1">PT. Mitra Niaga Mandiri</p>
                <p class="text-[11px] text-gray-500">Jl. Jend. Sudirman Kav. 52-53, Jakarta Pusat</p>
                <p class="text-[11px] text-gray-500">NPWP: 02.415.892.1-012.000</p>
              </div>
              <div class="text-right space-y-1">
                <div><span class="text-gray-400">Tanggal Faktur:</span> <span class="font-bold">{{ selectedInvoiceOrder.date }}</span></div>
                <div><span class="text-gray-400">Nomor Sale Order:</span> <span class="font-bold font-mono">{{ selectedInvoiceOrder.order_number }}</span></div>
                <div><span class="text-gray-400">Resi Pengiriman:</span> <span class="font-bold font-mono text-indigo-600">{{ selectedInvoiceOrder.shipping_no }}</span></div>
                <div>
                  <span class="text-gray-400">Status Pembayaran:</span>
                  <span class="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 ml-1">
                    {{ selectedInvoiceOrder.invoice_stat }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Items Table -->
            <table class="w-full text-left my-4 divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr class="text-[11px] text-gray-400 uppercase">
                  <th class="py-2">Deskripsi Barang & Layanan</th>
                  <th class="py-2 text-right">Harga Satuan</th>
                  <th class="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <tr>
                  <td class="py-3 font-semibold">{{ selectedInvoiceOrder.items }}</td>
                  <td class="py-3 text-right font-mono">{{ formatRupiah(selectedInvoiceOrder.total / 1.11) }}</td>
                  <td class="py-3 text-right font-mono">{{ formatRupiah(selectedInvoiceOrder.total / 1.11) }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Calculation -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1 text-right">
              <div class="flex justify-between"><span class="text-gray-400">Dasar Pengenaan Pajak (DPP):</span> <span class="font-mono">{{ formatRupiah(selectedInvoiceOrder.total / 1.11) }}</span></div>
              <div class="flex justify-between"><span class="text-gray-400">PPN 11% (e-Faktur Terverifikasi):</span> <span class="font-mono">{{ formatRupiah((selectedInvoiceOrder.total / 1.11) * 0.11) }}</span></div>
              <div class="flex justify-between text-sm font-extrabold text-brand-600 dark:text-brand-400 pt-2 border-t border-gray-100">
                <span>Total Tagihan:</span>
                <span>{{ formatRupiah(selectedInvoiceOrder.total) }}</span>
              </div>
            </div>

            <!-- Verification stamp -->
            <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[10px] text-gray-400">
              <span>Dokumen ini sah dan diterbitkan secara elektronik oleh Sistem ERP Nusantara.</span>
              <span class="font-mono font-bold text-emerald-600 uppercase border border-emerald-300 rounded px-2 py-0.5">
                ✓ LUNAS / SETTLEMENT
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="showInvoiceDocModal = false"
              class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Tutup
            </button>
            <button
              @click="printDocument"
              class="rounded-xl bg-brand-500 px-5 py-2 text-xs font-bold text-white shadow hover:bg-brand-600 flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              <span>Cetak / Unduh PDF</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Dokumen Purchase Order Resmi PDF (Vendor) -->
      <div v-if="showPODocModal && selectedPODoc" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900 my-6">
          <button @click="showPODocModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <!-- Printable Document Paper -->
          <div class="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs">
            <div class="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                  PO
                </div>
                <div>
                  <h3 class="font-extrabold text-sm uppercase">PT. Nusantara Prima Solusindo</h3>
                  <p class="text-[10px] text-gray-500">Divisi Pengadaan & Supply Chain Management</p>
                </div>
              </div>
              <div class="text-right">
                <span class="font-bold text-base text-teal-600 block">PURCHASE ORDER</span>
                <span class="font-mono font-bold text-gray-700 dark:text-gray-300">{{ selectedPODoc.po_number }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 my-4 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <span class="text-[10px] text-gray-400 block uppercase font-bold">Pemasok Resmi (Vendor):</span>
                <p class="font-bold mt-1 text-sm text-teal-700 dark:text-teal-400">{{ selectedPODoc.vendor_name }}</p>
                <p class="text-[11px] text-gray-500">Status Penerimaan Gudang: <strong>{{ selectedPODoc.receipt_stat }}</strong></p>
              </div>
              <div class="text-right space-y-1">
                <div><span class="text-gray-400">Tanggal PO:</span> <span class="font-bold">{{ selectedPODoc.date }}</span></div>
                <div><span class="text-gray-400">Total Kontrak:</span> <span class="font-bold text-sm text-teal-600">{{ formatRupiah(selectedPODoc.total) }}</span></div>
                <div><span class="text-gray-400">Kepatuhan Pajak:</span> <span class="font-bold text-emerald-600">{{ selectedPODoc.invoice_stat }}</span></div>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-xs text-teal-900 dark:text-teal-300 mb-4">
              📌 <strong>Instruksi Pengiriman Vendor:</strong> Harap menyertakan salinan Purchase Order ini bersama Surat Jalan dan Faktur Pajak saat armada logistik tiba di Gudang Utama.
            </div>

            <div class="flex justify-between items-center text-[10px] text-gray-400 pt-3 border-t border-gray-100">
              <span>Disetujui oleh Kepala Pengadaan & Keuangan Korporat.</span>
              <span class="font-mono font-bold text-teal-600 uppercase border border-teal-300 rounded px-2 py-0.5">
                ✓ APPROVED PO
              </span>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="showPODocModal = false"
              class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Tutup
            </button>
            <button
              @click="printDocument"
              class="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              <span>Cetak / Unduh Dokumen PO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const portalRole = ref<'customer' | 'vendor'>('customer')
const showUploadInvoiceModal = ref(false)

const customerOrders = ref([
  {
    id: 101,
    order_number: 'SO/2026/0891',
    date: '12 Sep 2026',
    total: 35800000,
    status: 'Diproses Gudang',
    invoice_no: 'INV/2026/0891',
    invoice_stat: 'Lunas (Paid)',
    shipping_no: 'JNE-TRK-98127391',
    items: '10x Ergonomic Mesh Chair, 2x Laptop ThinkPad T14',
  },
  {
    id: 102,
    order_number: 'SO/2026/0845',
    date: '05 Sep 2026',
    total: 18500000,
    status: 'Terkirim & Diterima',
    invoice_no: 'INV/2026/0845',
    invoice_stat: 'Lunas (Paid)',
    shipping_no: 'SICEPAT-8819201',
    items: '1x Lisensi ERP Annual 100 User',
  },
  {
    id: 103,
    order_number: 'SO/2026/0812',
    date: '25 Agu 2026',
    total: 8750000,
    status: 'Selesai',
    invoice_no: 'INV/2026/0812',
    invoice_stat: 'Lunas (Paid)',
    shipping_no: 'ANTERAJA-5519283',
    items: '1x Monitor UltraSharp 27 Inch 4K',
  },
])

const vendorOrders = ref([
  {
    id: 201,
    po_number: 'PO/2026/0412',
    vendor_name: 'PT. Distribusi Logistik Utama',
    date: '10 Sep 2026',
    total: 42000000,
    status: 'Menunggu Pengiriman',
    receipt_stat: 'Parsial (50%)',
    invoice_stat: 'Faktur Pajak Terverifikasi',
  },
  {
    id: 202,
    po_number: 'PO/2026/0398',
    vendor_name: 'PT. Kertas Nusantara Jaya',
    date: '28 Agu 2026',
    total: 8500000,
    status: 'Selesai (Received)',
    receipt_stat: 'Lengkap (100%)',
    invoice_stat: 'Lunas (Paid)',
  },
])

const uploadInvoiceForm = ref({
  po_number: 'PO/2026/0412',
  invoice_no: '',
})

function formatRupiah(val: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

const showInvoiceDocModal = ref(false)
const selectedInvoiceOrder = ref<any>(null)
const showPODocModal = ref(false)
const selectedPODoc = ref<any>(null)

function downloadInvoice(order: any) {
  selectedInvoiceOrder.value = order
  showInvoiceDocModal.value = true
}

function trackShipping(order: any) {
  alert(`🚚 Pelacakan Logistik Terpadu:\nNomor Resi: ${order.shipping_no}\nStatus: ${order.status}\nKurir Ekspedisi: JNE Cargo Enterprise (Armada Korporat)\nEstimasi Tiba: Hari ini, Pukul 16:30 WIB`)
}

function viewPODetail(po: any) {
  selectedPODoc.value = po
  showPODocModal.value = true
}

function printDocument() {
  window.print()
}

async function fetchPortalData() {
  try {
    const res = await fetch('http://localhost:7070/api/website/partner-portal')
    if (res.ok) {
      const json = await res.json()
      if (json.data?.customer_orders) customerOrders.value = json.data.customer_orders
      if (json.data?.vendor_orders) vendorOrders.value = json.data.vendor_orders
    }
  } catch (err) {
    console.error('Failed to fetch partner portal data:', err)
  }
}

function submitVendorInvoice() {
  alert(`✅ Faktur Tagihan "${uploadInvoiceForm.value.invoice_no}" untuk PO "${uploadInvoiceForm.value.po_number}" berhasil diunggah!\nTim Finance akan memverifikasi dalam 1x24 jam.`)
  showUploadInvoiceModal.value = false
  uploadInvoiceForm.value.invoice_no = ''
}

onMounted(() => {
  fetchPortalData()
})
</script>
