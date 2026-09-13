<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header & Cashier Session Bar -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              🛒
            </span>
            Terminal Kasir Ritel (Point of Sale)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo POS Enterprise: Katalog produk visual, scanner barcode, keranjang instan, kalkulator kembalian, dan cetak struk kasir thermal.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Session Status Badge -->
          <div class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800 text-xs font-semibold">
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-gray-700 dark:text-gray-300">Sesi Aktif: Kasir Utama (Terminal #01)</span>
          </div>

          <!-- Tutup Shift Button (Z-Report) -->
          <button
            @click="openCloseShiftModal"
            class="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 dark:border-rose-800 dark:bg-rose-950/40 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition shadow-xs"
            title="Tutup Sesi Kasir & Rekonsiliasi Laci Kas Z-Report"
          >
            🔒 Tutup Shift (Z-Report)
          </button>

          <!-- Switch View Toggle -->
          <div class="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800 text-xs font-semibold">
            <button
              @click="activeTab = 'cashier'"
              :class="activeTab === 'cashier' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
              class="rounded-md px-3 py-1.5 transition flex items-center gap-1"
            >
              🖥️ Kasir Touchscreen
            </button>
            <button
              @click="activeTab = 'history'; fetchHistory()"
              :class="activeTab === 'history' ? 'bg-white text-emerald-600 shadow-sm dark:bg-gray-700 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
              class="rounded-md px-3 py-1.5 transition flex items-center gap-1"
            >
              🧾 Riwayat Struk
            </button>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 1: TOUCHSCREEN CASHIER WORKSPACE (SPLIT SCREEN)                       -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'cashier'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- SISI KIRI (CART & PAYMENT SUMMARY) - 5 COLS -->
        <div class="lg:col-span-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-900 dark:text-white text-base">Keranjang Belanja</span>
              <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {{ cartTotalItems }} Item
              </span>
            </div>
            <button
              v-if="cart.length > 0"
              @click="clearCart"
              class="text-xs text-rose-500 hover:text-rose-700 font-semibold transition"
            >
              Kosongkan Keranjang
            </button>
          </div>

          <!-- Cart Items Scrollable List -->
          <div class="max-h-[360px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            <div
              v-if="cart.length === 0"
              class="py-12 text-center text-gray-400 space-y-2"
            >
              <div class="text-4xl">🛍️</div>
              <p class="text-xs">Keranjang masih kosong.<br>Klik produk di sebelah kanan untuk menambahkan.</p>
            </div>

            <div
              v-for="(item, idx) in cart"
              :key="item.id"
              class="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/60 dark:hover:bg-gray-800 transition"
            >
              <div class="flex-1 min-w-0 pr-2">
                <h4 class="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {{ item.name }}
                </h4>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <span>Rp {{ formatCurrency(item.price) }}</span>
                  <span v-if="item.discount > 0" class="text-rose-500 font-semibold">(-{{ item.discount }}%)</span>
                </div>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-1.5">
                <button
                  @click="decreaseQty(idx)"
                  class="h-6 w-6 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-200 hover:bg-gray-100"
                >
                  -
                </button>
                <span class="w-7 text-center font-mono text-xs font-bold text-gray-900 dark:text-white">
                  {{ item.qty }}
                </span>
                <button
                  @click="increaseQty(idx)"
                  class="h-6 w-6 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-200 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <!-- Item Subtotal -->
              <div class="w-24 text-right">
                <span class="text-xs font-bold font-mono text-gray-900 dark:text-white">
                  Rp {{ formatCurrency(calcItemSubtotal(item)) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Total Calculation Breakdown -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5 text-xs">
            <div class="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Subtotal (DPP)</span>
              <span class="font-mono">Rp {{ formatCurrency(subtotalAmount) }}</span>
            </div>
            <div class="flex justify-between text-gray-500 dark:text-gray-400">
              <span>PPN 11% (Pajak Ritel)</span>
              <span class="font-mono">Rp {{ formatCurrency(taxAmount) }}</span>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-base font-black text-gray-900 dark:text-white">
              <span>Total Belanja</span>
              <span class="font-mono text-emerald-600 dark:text-emerald-400">
                Rp {{ formatCurrency(grandTotal) }}
              </span>
            </div>
          </div>

          <!-- Checkout Action Button -->
          <button
            @click="openPaymentModal"
            :disabled="cart.length === 0"
            class="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <span>💳 Bayar Sekarang (Checkout)</span>
            <span v-if="cart.length > 0" class="font-mono font-normal">
              • Rp {{ formatCurrency(grandTotal) }}
            </span>
          </button>
        </div>

        <!-- SISI KANAN (PRODUCT CATALOG & CATEGORY FILTER) - 7 COLS -->
        <div class="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
          <!-- Search & Category Bar -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="relative w-full sm:w-64">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
              <input
                v-model="searchProduct"
                type="text"
                placeholder="Cari produk / barcode..."
                class="w-full rounded-xl border border-gray-300 bg-gray-50/50 pl-9 pr-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Category Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
              <button
                v-for="cat in categories"
                :key="cat"
                @click="selectedCategory = cat"
                :class="selectedCategory === cat ? 'bg-emerald-500 text-white font-bold' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'"
                class="rounded-lg px-3 py-1 text-xs transition whitespace-nowrap"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Product Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
            <div
              v-for="prod in filteredProducts"
              :key="prod.id"
              @click="addToCart(prod)"
              class="cursor-pointer rounded-xl border border-gray-200 p-3 bg-white hover:border-emerald-500 hover:shadow-md transition dark:border-gray-800 dark:bg-gray-800/50 flex flex-col justify-between group"
            >
              <div>
                <div class="h-16 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center text-3xl group-hover:scale-110 transition duration-300">
                  {{ prod.icon || '📦' }}
                </div>
                <h4 class="mt-2 text-xs font-bold text-gray-900 dark:text-white line-clamp-2">
                  {{ prod.name }}
                </h4>
                <p class="text-[10px] text-gray-400">{{ prod.category }} • SKU: {{ prod.sku }}</p>
              </div>

              <div class="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-2">
                <span class="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                  Rp {{ formatCurrency(prod.price) }}
                </span>
                <span class="text-[10px] px-1.5 py-0.5 rounded font-semibold" :class="prod.stock > 5 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'">
                  {{ prod.stock }} sisa
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- TAB 2: RIWAYAT STRUK & TRANSAKSI KASIR                                    -->
      <!-- ========================================================================= -->
      <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
          <h3 class="font-bold text-gray-900 dark:text-white text-sm">Riwayat Transaksi & Struk Kasir</h3>
          <span class="text-xs text-gray-500">Terintegrasi otomatis ke Finance & Pengurangan Stok Gudang</span>
        </div>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-xs">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <th class="px-5 py-3 text-left font-semibold text-gray-500 uppercase">No. Struk</th>
                <th class="px-5 py-3 text-left font-semibold text-gray-500 uppercase">Waktu Transaksi</th>
                <th class="px-5 py-3 text-left font-semibold text-gray-500 uppercase">Status & Kasir</th>
                <th class="px-5 py-3 text-right font-semibold text-gray-500 uppercase">Total Belanja</th>
                <th class="px-5 py-3 text-center font-semibold text-gray-500 uppercase">Aksi Struk</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isHistoryLoading">
                <td colspan="5" class="px-5 py-8 text-center text-gray-500">Memuat riwayat transaksi...</td>
              </tr>
              <tr v-else-if="historyOrders.length === 0">
                <td colspan="5" class="px-5 py-8 text-center text-gray-500">Belum ada struk tercatat hari ini.</td>
              </tr>
              <tr v-for="order in historyOrders" :key="order.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <td class="px-5 py-3.5 font-mono font-bold text-gray-900 dark:text-white">
                  {{ order.name || ('POS-' + order.id) }}
                </td>
                <td class="px-5 py-3.5 text-gray-500">
                  {{ formatDateTime(order.created_at) }}
                </td>
                <td class="px-5 py-3.5">
                  <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    ✓ Lunas (Paid)
                  </span>
                </td>
                <td class="px-5 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Rp {{ formatCurrency(order.total) }}
                </td>
                <td class="px-5 py-3.5 text-center">
                  <button
                    @click="reprintReceipt(order)"
                    class="rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-2.5 py-1 font-semibold text-gray-700 dark:text-gray-200 transition"
                  >
                    🖨️ Cetak Struk
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 1: PEMBAYARAN & NUMPAD KEMBALIAN (CHECKOUT MODAL)                   -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isPaymentModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
        <div class="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>💳</span> Pembayaran Transaksi POS
            </h3>
            <button @click="isPaymentModalOpen = false" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <!-- Total Due Display -->
          <div class="p-6 space-y-5">
            <div class="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-4 text-center border border-emerald-200 dark:border-emerald-800">
              <p class="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Total Yang Harus Dibayar</p>
              <h2 class="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                Rp {{ formatCurrency(grandTotal) }}
              </h2>
            </div>

            <!-- Payment Method Tabs -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Metode Pembayaran</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  @click="paymentMethod = 'Cash'"
                  :class="paymentMethod === 'Cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'"
                  class="rounded-xl border p-3 text-xs flex flex-col items-center gap-1 transition"
                >
                  <span class="text-lg">💵</span>
                  Tunai (Cash)
                </button>
                <button
                  type="button"
                  @click="paymentMethod = 'QRIS'"
                  :class="paymentMethod === 'QRIS' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'"
                  class="rounded-xl border p-3 text-xs flex flex-col items-center gap-1 transition"
                >
                  <span class="text-lg">📱</span>
                  QRIS Instant
                </button>
                <button
                  type="button"
                  @click="paymentMethod = 'Card'"
                  :class="paymentMethod === 'Card' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'"
                  class="rounded-xl border p-3 text-xs flex flex-col items-center gap-1 transition"
                >
                  <span class="text-lg">💳</span>
                  Debit / EDC
                </button>
              </div>
            </div>

            <!-- Cash Tendered & Quick Money Buttons -->
            <div v-if="paymentMethod === 'Cash'" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Uang Diterima (Rp)</label>
                <input
                  v-model.number="cashTendered"
                  type="number"
                  placeholder="0"
                  class="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-lg font-bold font-mono focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <!-- Quick Cash Buttons -->
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="cashTendered = grandTotal"
                  class="flex-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Uang Pas
                </button>
                <button
                  type="button"
                  @click="cashTendered = Math.ceil(grandTotal / 50000) * 50000"
                  class="flex-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Rp {{ formatCurrency(Math.ceil(grandTotal / 50000) * 50000) }}
                </button>
                <button
                  type="button"
                  @click="cashTendered = Math.ceil(grandTotal / 100000) * 100000"
                  class="flex-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Rp {{ formatCurrency(Math.ceil(grandTotal / 100000) * 100000) }}
                </button>
              </div>

              <!-- Change Amount Display -->
              <div class="rounded-xl bg-gray-50 dark:bg-gray-700/30 p-3 flex justify-between items-center border border-gray-100 dark:border-gray-700">
                <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">Kembalian:</span>
                <span
                  class="text-lg font-black font-mono"
                  :class="cashChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
                >
                  Rp {{ formatCurrency(Math.max(0, cashChange)) }}
                </span>
              </div>
            </div>

            <!-- QRIS Dynamic Simulator -->
            <div v-else-if="paymentMethod === 'QRIS'" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center space-y-2">
              <div class="h-36 w-36 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center font-mono text-3xl font-black text-gray-400">
                [QRIS]
              </div>
              <p class="text-xs text-gray-500">Pindai kode QRIS di atas dengan aplikasi BCA / Mandiri / GoPay / OVO</p>
            </div>

            <!-- EDC Simulator -->
            <div v-else class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center space-y-2">
              <div class="text-3xl">💳</div>
              <p class="text-xs font-bold text-gray-800 dark:text-white">Gesek atau Masukkan Kartu Debit / Kredit pada Mesin EDC</p>
              <p class="text-[11px] text-gray-400">BCA, Mandiri, BNI, Visa & Mastercard didukung</p>
            </div>

            <!-- Complete Payment Action -->
            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="isPaymentModalOpen = false"
                class="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Batal
              </button>
              <button
                type="button"
                @click="executeCheckout"
                :disabled="isProcessingCheckout || (paymentMethod === 'Cash' && cashChange < 0)"
                class="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
              >
                {{ isProcessingCheckout ? 'Memproses Transaksi...' : '✓ Selesaikan Pembayaran & Cetak Struk' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- MODAL 2: PRATINJAU STRUK KASIR THERMAL (58MM / 80MM RECEIPT)              -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isReceiptModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
        <div class="w-full max-w-xs rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          <!-- Actions Header -->
          <div class="flex items-center justify-between border-b border-gray-200 px-4 py-2.5 bg-gray-50 print:hidden">
            <span class="font-bold text-xs text-gray-700">🧾 Struk Belanja Kasir</span>
            <div class="flex items-center gap-1.5">
              <button
                @click="triggerPrint"
                class="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition"
              >
                🖨️ Cetak
              </button>
              <button @click="isReceiptModalOpen = false" class="text-gray-400 hover:text-gray-600 p-1">✕</button>
            </div>
          </div>

          <!-- Thermal Receipt Body -->
          <div id="pos-thermal-receipt" class="p-4 bg-white text-black font-mono text-[11px] space-y-3 leading-tight">
            <!-- Header Toko -->
            <div class="text-center space-y-0.5">
              <h3 class="font-black text-sm uppercase">ENTERPRISE MART</h3>
              <p class="text-[9px]">Gedung Sentra Niaga Kav. 18, Jakarta</p>
              <p class="text-[9px]">Tel: (021) 788-9900</p>
            </div>

            <div class="border-t border-dashed border-gray-400 my-2"></div>

            <!-- Receipt Meta -->
            <div class="space-y-0.5 text-[10px]">
              <div class="flex justify-between">
                <span>No: {{ lastReceiptData?.name || lastReceiptData?.receipt_number }}</span>
                <span>Kasir: Admin #01</span>
              </div>
              <div class="flex justify-between">
                <span>Tgl: {{ formatDateTime(lastReceiptData?.created_at || new Date().toISOString()) }}</span>
                <span>Metode: {{ lastReceiptData?.payment_method || paymentMethod }}</span>
              </div>
            </div>

            <div class="border-t border-dashed border-gray-400 my-2"></div>

            <!-- Item Lines -->
            <div class="space-y-1.5">
              <div v-for="item in (lastReceiptData?.items || cart)" :key="item.id || item.name">
                <div class="font-bold">{{ item.name || item.description }}</div>
                <div class="flex justify-between text-[10px]">
                  <span>{{ item.qty }} x Rp {{ formatCurrency(item.price || item.unit_price) }}</span>
                  <span>Rp {{ formatCurrency((item.qty) * (item.price || item.unit_price)) }}</span>
                </div>
              </div>
            </div>

            <div class="border-t border-dashed border-gray-400 my-2"></div>

            <!-- Summary Totals -->
            <div class="space-y-0.5 text-[10px]">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>Rp {{ formatCurrency(lastReceiptData?.subtotal || subtotalAmount) }}</span>
              </div>
              <div class="flex justify-between">
                <span>PPN 11%:</span>
                <span>Rp {{ formatCurrency(lastReceiptData?.tax || taxAmount) }}</span>
              </div>
              <div class="flex justify-between font-black text-xs pt-1 border-t border-gray-300">
                <span>TOTAL:</span>
                <span>Rp {{ formatCurrency(lastReceiptData?.total || grandTotal) }}</span>
              </div>
              <div class="flex justify-between pt-0.5">
                <span>Bayar ({{ paymentMethod }}):</span>
                <span>Rp {{ formatCurrency(cashTendered || lastReceiptData?.total || grandTotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Kembali:</span>
                <span>Rp {{ formatCurrency(Math.max(0, cashChange)) }}</span>
              </div>
            </div>

            <div class="border-t border-dashed border-gray-400 my-2"></div>

            <!-- Footer Notes -->
            <div class="text-center text-[9px] space-y-0.5 text-gray-600">
              <p>Terima Kasih Atas Kunjungan Anda</p>
              <p>Barang yang sudah dibeli tidak dapat ditukar</p>
              <p class="font-mono mt-1">*** LAYANAN KONSUMEN: 0812-9900-8800 ***</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- MODAL REKONSILIASI TUTUP SHIFT KASIR (Z-REPORT)                           -->
      <!-- ========================================================================= -->
      <div
        v-if="isCloseShiftModalOpen"
        class="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      >
        <div class="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-100 dark:border-gray-800">
          <!-- Header Modal -->
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-lg">
                🔒
              </span>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">
                  Tutup Shift Kasir & Rekonsiliasi Laci Kas (Z-Report)
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Standar Odoo POS: Hitung fisik uang tunai di laci untuk mendeteksi selisih omset sebelum tutup kasir.
                </p>
              </div>
            </div>
            <button
              @click="isCloseShiftModalOpen = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg p-1 rounded-lg"
            >
              ✕
            </button>
          </div>

          <!-- Session Metadata Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl text-xs">
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Terminal ID</span>
              <span class="font-bold text-gray-800 dark:text-gray-200 font-mono">{{ shiftData.terminalId }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Nama Kasir</span>
              <span class="font-bold text-gray-800 dark:text-gray-200">{{ shiftData.cashierName }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Buka Shift</span>
              <span class="font-bold text-gray-800 dark:text-gray-200">{{ shiftData.openTime }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Tutup Shift</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ shiftData.closeTime }}</span>
            </div>
          </div>

          <!-- Summary Matrix (Sistem vs Ekspektasi) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
              <span class="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Modal Awal Kasir</span>
              <div class="text-base font-black font-mono text-gray-900 dark:text-white mt-1">
                Rp {{ formatCurrency(shiftData.openingCash) }}
              </div>
              <span class="text-[10px] text-gray-400">Float tunai pagi</span>
            </div>

            <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
              <span class="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Total Omset Sistem</span>
              <div class="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                Rp {{ formatCurrency(totalSystemOmset) }}
              </div>
              <span class="text-[10px] text-gray-400">Tunai + QRIS + Debit</span>
            </div>

            <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
              <span class="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Target Tunai di Laci</span>
              <div class="text-base font-black font-mono text-brand-600 dark:text-brand-400 mt-1">
                Rp {{ formatCurrency(expectedCashInDrawer) }}
              </div>
              <span class="text-[10px] text-gray-400">Modal Awal + Penjualan Tunai</span>
            </div>
          </div>

          <!-- Breakdown Metode Pembayaran Sistem -->
          <div class="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-xs space-y-1.5">
            <div class="font-bold text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
              <span>Rincian Pembayaran Masuk Sistem:</span>
              <span>{{ shiftData.totalTransactions }} Transaksi</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>💵 Pembayaran Tunai (Cash):</span>
              <span class="font-mono font-semibold">Rp {{ formatCurrency(shiftData.cashSales) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>📱 QRIS Dinamis (GoPay/OVO/ShopeePay):</span>
              <span class="font-mono font-semibold">Rp {{ formatCurrency(shiftData.qrisSales) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>💳 Kartu Debit / EDC Mandiri & BCA:</span>
              <span class="font-mono font-semibold">Rp {{ formatCurrency(shiftData.debitSales) }}</span>
            </div>
          </div>

          <!-- Kalkulator Uang Fisik Laci (Cash Denominations) -->
          <div class="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-white dark:bg-gray-800/60 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>🧮</span>
                <span>Penghitungan Uang Fisik di Laci Kasir (Cash Count):</span>
              </span>
              <span class="text-xs font-mono font-black text-brand-600 dark:text-brand-400">
                Fisik: Rp {{ formatCurrency(totalActualCash) }}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400">Rp 100.000 (Lembar)</label>
                <input v-model.number="denominations.c100k" type="number" min="0" class="w-full mt-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 font-mono font-bold dark:border-gray-600 dark:text-white" />
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400">Rp 50.000 (Lembar)</label>
                <input v-model.number="denominations.c50k" type="number" min="0" class="w-full mt-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 font-mono font-bold dark:border-gray-600 dark:text-white" />
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400">Rp 20.000 (Lembar)</label>
                <input v-model.number="denominations.c20k" type="number" min="0" class="w-full mt-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 font-mono font-bold dark:border-gray-600 dark:text-white" />
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400">Rp 10.000 (Lembar)</label>
                <input v-model.number="denominations.c10k" type="number" min="0" class="w-full mt-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 font-mono font-bold dark:border-gray-600 dark:text-white" />
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400">Rp 5.000 (Lembar)</label>
                <input v-model.number="denominations.c5k" type="number" min="0" class="w-full mt-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 font-mono font-bold dark:border-gray-600 dark:text-white" />
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400">Rp 2.000 (Lembar)</label>
                <input v-model.number="denominations.c2k" type="number" min="0" class="w-full mt-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 font-mono font-bold dark:border-gray-600 dark:text-white" />
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400">Rp 1.000 (Lembar)</label>
                <input v-model.number="denominations.c1k" type="number" min="0" class="w-full mt-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 font-mono font-bold dark:border-gray-600 dark:text-white" />
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400">Uang Koin / Logam (Rp)</label>
                <input v-model.number="denominations.coins" type="number" min="0" step="500" class="w-full mt-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 font-mono font-bold dark:border-gray-600 dark:text-white" />
              </div>
            </div>
          </div>

          <!-- Hasil Rekonsiliasi & Variance Banner -->
          <div
            class="p-4 rounded-xl border transition-all"
            :class="cashVariance === 0 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' : cashVariance > 0 ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 text-amber-800 dark:text-amber-200' : 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800 text-rose-800 dark:text-rose-200'"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold block">
                  {{ cashVariance === 0 ? '✓ Kas Seimbang Sempurna (Balance)' : cashVariance > 0 ? '⚠️ Kas Surplus (Lebih)' : '⚠️ Kas Defisit (Selisih Kurang)' }}
                </span>
                <p class="text-[11px] mt-0.5 opacity-80">
                  {{ cashVariance === 0 ? 'Total fisik uang di laci kasir cocok 100% dengan pencatatan sistem penjualan.' : 'Terdapat perbedaan antara uang fisik di laci dengan omset tunai sistem.' }}
                </p>
              </div>
              <div class="text-right">
                <span class="text-[10px] uppercase font-bold block opacity-70">Selisih Kas (Variance)</span>
                <span class="text-lg font-black font-mono">
                  {{ cashVariance >= 0 ? '+' : '' }}Rp {{ formatCurrency(cashVariance) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Catatan / Serah Terima Shift -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Catatan Kasir / Serah Terima Kas
            </label>
            <textarea
              v-model="shiftData.notes"
              rows="2"
              placeholder="Contoh: Seluruh transaksi shift pagi telah selesai. Kas diserahterimakan ke Supervisor Toko."
              class="w-full rounded-xl border border-gray-300 bg-white p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-brand-500"
            ></textarea>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              @click="isCloseShiftModalOpen = false"
              class="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Kembali ke Kasir
            </button>
            <button
              @click="finalizeCloseShift"
              class="rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5"
            >
              🔒 Konfirmasi Tutup Shift & Cetak Z-Report
            </button>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- MODAL CETAK THERMAL Z-REPORT RESMI                                        -->
      <!-- ========================================================================= -->
      <div
        v-if="isZReportModalOpen"
        class="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      >
        <div class="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-5 space-y-4 my-8 border border-gray-100 dark:border-gray-800">
          <div class="flex items-center justify-between border-b pb-2 dark:border-gray-800">
            <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>🧾</span>
              <span>Laporan Z-Report Kasir</span>
            </h3>
            <button @click="isZReportModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <!-- Struk Thermal Container -->
          <div id="pos-thermal-zreport" class="bg-white p-4 font-mono text-black text-xs space-y-2 border border-dashed border-gray-300 rounded-lg shadow-inner">
            <div class="text-center space-y-0.5">
              <h4 class="font-black text-sm uppercase">PT. NUSANTARA PRIMA SOLUSINDO</h4>
              <p class="text-[10px]">LAPORAN PENUTUPAN KASIR (Z-REPORT)</p>
              <p class="text-[9px] text-gray-500">Terminal: {{ shiftData.terminalId }} | Kasir: {{ shiftData.cashierName }}</p>
              <p class="text-[9px] text-gray-500">Buka: {{ shiftData.openTime }} | Tutup: {{ shiftData.closeTime }}</p>
            </div>

            <div class="border-t border-dashed border-gray-400 my-1"></div>

            <div class="space-y-1 text-[11px]">
              <div class="flex justify-between">
                <span>Modal Awal Kas:</span>
                <span>Rp {{ formatCurrency(shiftData.openingCash) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Penjualan Tunai:</span>
                <span>Rp {{ formatCurrency(shiftData.cashSales) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Penjualan QRIS:</span>
                <span>Rp {{ formatCurrency(shiftData.qrisSales) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Penjualan EDC:</span>
                <span>Rp {{ formatCurrency(shiftData.debitSales) }}</span>
              </div>
              <div class="flex justify-between font-bold border-t border-gray-300 pt-1">
                <span>TOTAL OMSET SHIFT:</span>
                <span>Rp {{ formatCurrency(totalSystemOmset) }}</span>
              </div>
            </div>

            <div class="border-t border-dashed border-gray-400 my-1"></div>

            <div class="space-y-1 text-[11px]">
              <div class="flex justify-between">
                <span>Target Uang Fisik:</span>
                <span>Rp {{ formatCurrency(expectedCashInDrawer) }}</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Fisik Laci Terhitung:</span>
                <span>Rp {{ formatCurrency(totalActualCash) }}</span>
              </div>
              <div class="flex justify-between font-black pt-1 border-t border-gray-300" :class="cashVariance >= 0 ? 'text-emerald-700' : 'text-rose-700'">
                <span>SELISIH KAS:</span>
                <span>{{ cashVariance >= 0 ? '+' : '' }}Rp {{ formatCurrency(cashVariance) }}</span>
              </div>
            </div>

            <div class="border-t border-dashed border-gray-400 my-2"></div>

            <div class="grid grid-cols-2 text-center text-[9px] pt-2 pb-1 gap-2">
              <div>
                <p>Kasir Bertugas,</p>
                <div class="h-10"></div>
                <p class="font-bold">({{ shiftData.cashierName.split(' ')[0] }})</p>
              </div>
              <div>
                <p>Supervisor Toko,</p>
                <div class="h-10"></div>
                <p class="font-bold">(Store Lead)</p>
              </div>
            </div>
            <p class="text-center text-[8px] text-gray-500 pt-1">*** END OF Z-REPORT TRANSMISSION ***</p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-2 pt-2">
            <button
              @click="triggerZReportPrint"
              class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              🖨️ Cetak Struk Z-Report
            </button>
            <button
              @click="isZReportModalOpen = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Selesai
            </button>
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

interface CartItem {
  id: number
  name: string
  price: number
  discount: number
  qty: number
}

const activeTab = ref<'cashier' | 'history'>('cashier')
const searchProduct = ref('')
const selectedCategory = ref('Semua')
const categories = ['Semua', 'Elektronik & Aksesoris', 'Makanan & Snack', 'Minuman Segar', 'ATK & Kantor']

// Mock & Live Product Catalog
const products = ref([
  { id: 1, name: 'Mouse Wireless Silent Click', price: 125000, category: 'Elektronik & Aksesoris', sku: 'MOU-001', stock: 24, icon: '🖱️' },
  { id: 2, name: 'Keyboard Mekanikal RGB', price: 450000, category: 'Elektronik & Aksesoris', sku: 'KEY-002', stock: 12, icon: '⌨️' },
  { id: 3, name: 'USB Flashdrive 64GB 3.0', price: 85000, category: 'Elektronik & Aksesoris', sku: 'USB-003', stock: 40, icon: '💾' },
  { id: 4, name: 'Kopi Espresso Premium Beans 250g', price: 65000, category: 'Minuman Segar', sku: 'BEV-001', stock: 18, icon: '☕' },
  { id: 5, name: 'Air Mineral Botol 600ml', price: 5000, category: 'Minuman Segar', sku: 'BEV-002', stock: 95, icon: '💧' },
  { id: 6, name: 'Teh Hijau Botol Less Sugar', price: 8000, category: 'Minuman Segar', sku: 'BEV-003', stock: 50, icon: '🍵' },
  { id: 7, name: 'Snack Keripik Kentang Truffle', price: 22000, category: 'Makanan & Snack', sku: 'SNK-001', stock: 30, icon: '🥔' },
  { id: 8, name: 'Biskuit Cokelat Sandwich 120g', price: 14000, category: 'Makanan & Snack', sku: 'SNK-002', stock: 42, icon: '🍪' },
  { id: 9, name: 'Kertas HVS A4 80gsm 1 Rim', price: 55000, category: 'ATK & Kantor', sku: 'ATK-001', stock: 15, icon: '📄' },
  { id: 10, name: 'Pulpen Gel Gel 0.5 Hitam (Pack)', price: 32000, category: 'ATK & Kantor', sku: 'ATK-002', stock: 60, icon: '🖊️' },
])

// Cart State
const cart = ref<CartItem[]>([
  { id: 1, name: 'Mouse Wireless Silent Click', price: 125000, discount: 0, qty: 1 },
  { id: 4, name: 'Kopi Espresso Premium Beans 250g', price: 65000, discount: 0, qty: 2 },
])

// Payment state
const isPaymentModalOpen = ref(false)
const paymentMethod = ref<'Cash' | 'QRIS' | 'Card'>('Cash')
const cashTendered = ref<number>(300000)
const isProcessingCheckout = ref(false)

// Receipt print state
const isReceiptModalOpen = ref(false)
const lastReceiptData = ref<any>(null)

// History state
const historyOrders = ref<any[]>([])
const isHistoryLoading = ref(false)

// Filtered products
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCat = selectedCategory.value === 'Semua' || p.category === selectedCategory.value
    const matchQuery = !searchProduct.value ||
      p.name.toLowerCase().includes(searchProduct.value.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchProduct.value.toLowerCase())
    return matchCat && matchQuery
  })
})

// Cart Computations
const cartTotalItems = computed(() => cart.value.reduce((acc, it) => acc + it.qty, 0))

const calcItemSubtotal = (it: CartItem) => {
  return it.qty * it.price * (1 - (it.discount / 100))
}

const subtotalAmount = computed(() => {
  return cart.value.reduce((acc, it) => acc + calcItemSubtotal(it), 0)
})

const taxAmount = computed(() => {
  return subtotalAmount.value * 0.11 // PPN 11%
})

const grandTotal = computed(() => {
  return subtotalAmount.value + taxAmount.value
})

const cashChange = computed(() => {
  return (cashTendered.value || 0) - grandTotal.value
})

// Cart Actions
const addToCart = (prod: any) => {
  const existing = cart.value.find(c => c.id === prod.id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      discount: 0,
      qty: 1
    })
  }
}

const increaseQty = (idx: number) => {
  cart.value[idx].qty++
}

const decreaseQty = (idx: number) => {
  if (cart.value[idx].qty > 1) {
    cart.value[idx].qty--
  } else {
    cart.value.splice(idx, 1)
  }
}

const clearCart = () => {
  cart.value = []
}

const openPaymentModal = () => {
  cashTendered.value = Math.ceil(grandTotal.value / 50000) * 50000
  isPaymentModalOpen.value = true
}

// Checkout and Save to Backend
const executeCheckout = async () => {
  isProcessingCheckout.value = true
  try {
    const token = localStorage.getItem('token')
    const receiptNum = `POS/${new Date().toISOString().slice(0,10).replace(/-/g,'')}/${Math.floor(10000 + Math.random() * 90000)}`

    const payload = {
      receipt_number: receiptNum,
      payment_method: paymentMethod.value,
      cash_tendered: cashTendered.value,
      change_amount: Math.max(0, cashChange.value),
      total_amount: grandTotal.value,
      items: cart.value.map(c => ({
        product_id: c.id,
        qty: c.qty,
        price_unit: c.price,
        sub_total: calcItemSubtotal(c)
      }))
    }

    const res = await fetch(`${API_BASE_URL}/sales/pos/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('Gagal memproses transaksi kasir')

    // Struk data
    lastReceiptData.value = {
      ...payload,
      subtotal: subtotalAmount.value,
      tax: taxAmount.value,
      total: grandTotal.value,
      items: JSON.parse(JSON.stringify(cart.value)),
      created_at: new Date().toISOString()
    }

    isPaymentModalOpen.value = false
    isReceiptModalOpen.value = true
    clearCart()
  } catch (err: any) {
    alert(err.message)
  } finally {
    isProcessingCheckout.value = false
  }
}

// Fetch transaction history
const fetchHistory = async () => {
  isHistoryLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/pos/posorder`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    historyOrders.value = Array.isArray(data) ? data : (data.data || [])
  } catch (err: any) {
    console.error('Failed to fetch history:', err)
  } finally {
    isHistoryLoading.value = false
  }
}

const reprintReceipt = (order: any) => {
  lastReceiptData.value = {
    name: order.name,
    created_at: order.created_at,
    total: order.total,
    payment_method: 'Tunai/QRIS',
    items: [
      { name: 'Transaksi POS Kasir Resmi', qty: 1, price: order.total }
    ]
  }
  isReceiptModalOpen.value = true
}

const triggerPrint = () => {
  window.print()
}

const formatCurrency = (val: number | string | undefined) => {
  const num = Number(val) || 0
  return num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const formatDateTime = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

// =========================================================================
// FITUR ENTERPRISE: TUTUP SHIFT KASIR & REKONSILIASI LACI KAS (Z-REPORT)
// =========================================================================
const isCloseShiftModalOpen = ref(false)
const isZReportModalOpen = ref(false)

const shiftData = ref({
  terminalId: 'POS-TERM-01',
  cashierName: 'Ahmad Fauzi (Kasir Utama)',
  openTime: '08:00 WIB',
  closeTime: '21:00 WIB',
  openingCash: 500000,
  cashSales: 3450000,
  qrisSales: 2100000,
  debitSales: 1850000,
  totalTransactions: 28,
  notes: ''
})

// Denominasi pecahan fisik uang tunai laci kas
const denominations = ref({
  c100k: 25, // 25 x 100.000 = 2.500.000
  c50k: 20,  // 20 x 50.000 = 1.000.000
  c20k: 15,  // 15 x 20.000 = 300.000
  c10k: 10,  // 10 x 10.000 = 100.000
  c5k: 6,    // 6 x 5.000 = 30.000
  c2k: 7,    // 7 x 2.000 = 14.000
  c1k: 6,    // 6 x 1.000 = 6.000
  coins: 0   // Koin
})

const totalActualCash = computed(() => {
  const d = denominations.value
  return (
    (Number(d.c100k) || 0) * 100000 +
    (Number(d.c50k) || 0) * 50000 +
    (Number(d.c20k) || 0) * 20000 +
    (Number(d.c10k) || 0) * 10000 +
    (Number(d.c5k) || 0) * 5000 +
    (Number(d.c2k) || 0) * 2000 +
    (Number(d.c1k) || 0) * 1000 +
    (Number(d.coins) || 0)
  )
})

const totalSystemOmset = computed(() => {
  return shiftData.value.cashSales + shiftData.value.qrisSales + shiftData.value.debitSales
})

const expectedCashInDrawer = computed(() => {
  return shiftData.value.openingCash + shiftData.value.cashSales
})

const cashVariance = computed(() => {
  return totalActualCash.value - expectedCashInDrawer.value
})

const openCloseShiftModal = () => {
  shiftData.value.closeTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
  isCloseShiftModalOpen.value = true
}

const finalizeCloseShift = () => {
  isCloseShiftModalOpen.value = false
  isZReportModalOpen.value = true
}

const triggerZReportPrint = () => {
  window.print()
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #pos-thermal-receipt, #pos-thermal-receipt *,
  #pos-thermal-zreport, #pos-thermal-zreport * {
    visibility: visible;
  }
  #pos-thermal-receipt, #pos-thermal-zreport {
    position: absolute;
    left: 0;
    top: 0;
    width: 80mm;
    margin: 0;
    padding: 10px;
    border: none;
    box-shadow: none;
  }
}
</style>
