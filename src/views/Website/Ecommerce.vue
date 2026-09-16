<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Toko Online & E-Commerce Korporat" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Katalog Produk B2B/B2C, Pemesanan Online, dan Terintegrasi Inventaris & Invoicing (Standar Odoo eCommerce)
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="isCartOpen = true"
            class="relative inline-flex items-center gap-2 rounded-xl bg-brand-500 py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Keranjang Belanja
            <span
              v-if="cartItemsCount > 0"
              class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow"
            >
              {{ cartItemsCount }}
            </span>
          </button>

          <button
            @click="openAddProductModal"
            class="inline-flex items-center gap-2 rounded-xl border border-gray-300 py-2.5 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            + Tambah Produk
          </button>
        </div>
      </div>

      <!-- Overview KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500">Total Katalog Produk</span>
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold dark:bg-blue-900/20 dark:text-blue-400">
              📦
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ products.length }}</span>
            <span class="text-xs text-emerald-600 font-semibold">Aktif Dijual</span>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">Tersinkronisasi Modul Inventaris</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500">Nilai Transaksi Hari Ini</span>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold dark:bg-emerald-900/20 dark:text-emerald-400">
              💳
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-gray-900 dark:text-white">Rp 28.5 Jt</span>
            <span class="text-xs text-emerald-600 font-semibold">+18.2%</span>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">14 Pesanan Terkonfirmasi</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500">Pesanan Dalam Proses</span>
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold dark:bg-amber-900/20 dark:text-amber-400">
              🚚
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-gray-900 dark:text-white">6</span>
            <span class="text-xs text-amber-600 font-semibold">Siap Dikirim</span>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">Integrasi Supply Chain & Fleet</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500">Stok Menipis</span>
            <div class="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold dark:bg-red-900/20 dark:text-red-400">
              ⚠️
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-gray-900 dark:text-white">2</span>
            <span class="text-xs text-red-600 font-semibold">Perlu Reorder</span>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">Auto-PR ke Modul Pembelian</p>
        </div>
      </div>

      <!-- Main 2-Column eCommerce Layout (Odoo Style) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- LEFT SIDEBAR: Kategori Produk & Filter (3 cols) -->
        <div class="lg:col-span-3 space-y-5">
          <!-- Kategori Tree -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>📁 Kategori Produk</span>
              </h4>
              <button @click="showAddCatModal = true" class="text-[11px] font-bold text-brand-600 hover:underline">
                + Tambah
              </button>
            </div>

            <div class="mt-3 space-y-1">
              <button
                v-for="cat in categoriesWithCount"
                :key="cat.name"
                @click="selectedCategory = cat.name"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left',
                  selectedCategory === cat.name
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                ]"
              >
                <div class="flex items-center gap-2 truncate">
                  <span>{{ cat.icon }}</span>
                  <span class="truncate">{{ cat.name }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-[10px] font-bold',
                      selectedCategory === cat.name
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                    ]"
                  >
                    {{ cat.count }}
                  </span>
                  <button
                    v-if="customCategories.includes(cat.name)"
                    @click.stop="removeCategory(cat.name)"
                    title="Hapus Kategori"
                    class="rounded-full w-4 h-4 flex items-center justify-center text-[11px] font-bold text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                  >
                    ×
                  </button>
                </div>
              </button>
            </div>
          </div>

          <!-- Filter Rentang Harga -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800 space-y-3">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">💰 Rentang Harga (IDR)</h4>
            <div class="space-y-2">
              <div>
                <label class="text-[10px] text-gray-400 block mb-0.5">Maksimal Harga</label>
                <input
                  v-model.number="maxPriceFilter"
                  type="range"
                  min="500000"
                  max="50000000"
                  step="500000"
                  class="w-full accent-brand-500 cursor-pointer"
                />
                <span class="text-xs font-bold text-brand-600 dark:text-brand-400">
                  Hingga {{ formatRupiah(maxPriceFilter) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Filter Stok Ready -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
              <input v-model="onlyInStock" type="checkbox" class="rounded text-brand-600 focus:ring-brand-500 w-4 h-4" />
              <span>Hanya Tampilkan Stok Tersedia</span>
            </label>
          </div>
        </div>

        <!-- RIGHT AREA: Search, Sort & Product Catalog Grid (9 cols) -->
        <div class="lg:col-span-9 space-y-5">
          <!-- Search & Sort Top Bar -->
          <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari produk, SKU, kategori..."
                class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 pl-9 pr-3 text-xs focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <svg class="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-400 whitespace-nowrap">Urutkan:</span>
              <select
                v-model="sortBy"
                class="rounded-xl border border-gray-300 bg-gray-50/50 py-1.5 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="recommended">Rekomendasi</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="name_asc">Nama A-Z</option>
              </select>
            </div>
          </div>

          <!-- Product Catalog Grid -->
          <div v-if="filteredProducts.length === 0" class="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="text-4xl mb-2">📦</div>
            <h4 class="text-sm font-bold text-gray-800 dark:text-white">Tidak ada produk ditemukan</h4>
            <p class="text-xs text-gray-500 mt-1">Coba sesuaikan filter kategori atau rentang harga Anda.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="prod in filteredProducts"
              :key="prod.id"
              class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800 flex flex-col justify-between"
            >
              <div>
                <!-- Product Header -->
                <div class="flex items-center justify-between">
                  <span class="rounded-lg bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-mono text-gray-600 dark:text-gray-300">
                    {{ prod.sku }}
                  </span>
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      prod.stock > 10
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                    ]"
                  >
                    Stok: {{ prod.stock }} unit
                  </span>
                </div>

                <!-- Product Icon / Thumbnail placeholder -->
                <div class="my-4 h-36 rounded-xl bg-gradient-to-tr from-gray-50 to-indigo-50/40 dark:from-gray-700/50 dark:to-gray-800 flex items-center justify-center text-4xl border border-gray-100 dark:border-gray-700">
                  {{ prod.icon }}
                </div>

                <span class="text-[11px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  {{ prod.category }}
                </span>
                <h4 class="mt-1 text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                  {{ prod.name }}
                </h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ prod.description }}
                </p>
              </div>

              <div class="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-gray-400 block">Harga Satuan</span>
                  <span class="text-sm font-extrabold text-gray-900 dark:text-white">
                    {{ formatRupiah(prod.price) }}
                  </span>
                </div>

                <button
                  @click="addToCart(prod)"
                  class="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all active:scale-95"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Beli
                </button>
              </div>
            </div>
          </div>
          <PaginationBar :pagination="pagination" @change="onPaginationChange" />
        </div>
      </div>

      <!-- Shopping Cart Drawer / Modal -->
      <div
        v-if="isCartOpen"
        class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      >
        <div class="relative w-full max-w-md h-full bg-white p-6 shadow-2xl dark:bg-gray-800 flex flex-col justify-between overflow-y-auto">
          <div>
            <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Keranjang Belanja</h3>
                <span class="rounded-full bg-brand-100 text-brand-700 px-2 py-0.5 text-xs font-bold dark:bg-brand-900/40 dark:text-brand-300">
                  {{ cartItemsCount }} item
                </span>
              </div>
              <button @click="isCartOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Cart Items List -->
            <div v-if="cart.length === 0" class="py-16 text-center text-gray-400">
              <div class="text-4xl mb-2">🛒</div>
              <p class="text-sm">Keranjang masih kosong.</p>
              <p class="text-xs text-gray-500 mt-1">Pilih produk dari katalog untuk memesan.</p>
            </div>

            <div v-else class="divide-y divide-gray-100 dark:divide-gray-700 my-4 space-y-3">
              <div
                v-for="item in cart"
                :key="item.product.id"
                class="pt-3 flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                    {{ item.product.icon }}
                  </div>
                  <div>
                    <h5 class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{{ item.product.name }}</h5>
                    <span class="text-[11px] text-gray-500">{{ formatRupiah(item.product.price) }} x {{ item.qty }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    @click="updateQty(item.product.id, -1)"
                    class="w-6 h-6 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center justify-center font-bold hover:bg-gray-200 text-xs"
                  >
                    -
                  </button>
                  <span class="text-xs font-bold text-gray-900 dark:text-white w-4 text-center">{{ item.qty }}</span>
                  <button
                    @click="updateQty(item.product.id, 1)"
                    class="w-6 h-6 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center justify-center font-bold hover:bg-gray-200 text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Checkout Summary -->
          <div v-if="cart.length > 0" class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <!-- Input Kupon Diskon B2B (Fase 7) -->
            <div>
              <label class="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Kupon / Voucher Diskon B2B</label>
              <div class="flex gap-2">
                <input
                  v-model="voucherCode"
                  type="text"
                  placeholder="Ketik B2BMITRA10 atau DISKON500K"
                  class="flex-1 rounded-xl border border-gray-300 bg-gray-50/50 py-1.5 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white uppercase font-mono"
                />
                <button
                  @click="applyVoucher"
                  type="button"
                  class="rounded-xl bg-gray-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all"
                >
                  Terapkan
                </button>
              </div>
              <p v-if="appliedVoucherMsg" class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {{ appliedVoucherMsg }}
              </p>
            </div>

            <!-- Tiered Wholesale Warning/Badge (Fase 7) -->
            <div v-if="cartItemsCount >= 10" class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
              <span>🎉</span>
              <span>Harga Grosir B2B Aktif: Diskon volume 15% (≥10 unit)</span>
            </div>

            <div class="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Subtotal Barang</span>
                <span>{{ formatRupiah(cartTotal) }}</span>
              </div>
              <div v-if="wholesaleDiscountAmount > 0" class="flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Diskon Grosir Volume (15%)</span>
                <span>- {{ formatRupiah(wholesaleDiscountAmount) }}</span>
              </div>
              <div v-if="voucherDiscountAmount > 0" class="flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Potongan Kupon B2B</span>
                <span>- {{ formatRupiah(voucherDiscountAmount) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>PPN 11% (e-Faktur)</span>
                <span>{{ formatRupiah(ppnAmount) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm font-extrabold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700">
                <span>Total Tagihan Akhir</span>
                <span class="text-brand-600 dark:text-brand-400">{{ formatRupiah(finalTotalAmount) }}</span>
              </div>
            </div>

            <button
              @click="processCheckout"
              class="w-full rounded-xl bg-brand-500 py-3 text-xs font-bold text-white shadow hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
            >
              <span>Bayar dengan Midtrans Gateway (QRIS / VA)</span>
              &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Midtrans Snap Payment -->
      <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showPaymentModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <!-- Midtrans Header -->
          <div class="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              M
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Midtrans Snap Payment</h3>
              <p class="text-[11px] text-gray-400">Order ID: {{ activeSnapData?.order_id }}</p>
            </div>
          </div>

          <div class="my-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span class="text-xs text-gray-500">Total Pembayaran</span>
            <span class="text-lg font-extrabold text-brand-600 dark:text-brand-400">{{ formatRupiah(cartTotal * 1.11) }}</span>
          </div>

          <!-- Payment Methods Selection -->
          <div class="space-y-3">
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300">Pilih Metode Pembayaran:</label>

            <div
              @click="selectedPaymentMethod = 'qris'"
              :class="[
                'p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between',
                selectedPaymentMethod === 'qris'
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center gap-3">
                <span class="text-xl">📱</span>
                <div>
                  <h5 class="text-xs font-bold text-gray-900 dark:text-white">QRIS Nasional</h5>
                  <p class="text-[10px] text-gray-400">GoPay, OVO, DANA, ShopeePay, LinkAja, BCA Mobile</p>
                </div>
              </div>
              <input type="radio" :checked="selectedPaymentMethod === 'qris'" class="text-brand-600" />
            </div>

            <div
              @click="selectedPaymentMethod = 'va'"
              :class="[
                'p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between',
                selectedPaymentMethod === 'va'
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center gap-3">
                <span class="text-xl">🏦</span>
                <div>
                  <h5 class="text-xs font-bold text-gray-900 dark:text-white">Virtual Account Bank</h5>
                  <p class="text-[10px] text-gray-400">BCA, Mandiri, BRI, BNI, Permata Bank</p>
                </div>
              </div>
              <input type="radio" :checked="selectedPaymentMethod === 'va'" class="text-brand-600" />
            </div>

            <div
              @click="selectedPaymentMethod = 'cc'"
              :class="[
                'p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between',
                selectedPaymentMethod === 'cc'
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center gap-3">
                <span class="text-xl">💳</span>
                <div>
                  <h5 class="text-xs font-bold text-gray-900 dark:text-white">Kartu Kredit / Debit</h5>
                  <p class="text-[10px] text-gray-400">Visa, Mastercard, JCB (3D Secure Enkripsi)</p>
                </div>
              </div>
              <input type="radio" :checked="selectedPaymentMethod === 'cc'" class="text-brand-600" />
            </div>
          </div>

          <div class="mt-6 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
            <button
              @click="showPaymentModal = false"
              class="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Batal
            </button>
            <button
              @click="confirmPayment"
              :disabled="isPaying"
              class="flex-1 rounded-xl bg-brand-500 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
            >
              <span v-if="isPaying" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isPaying ? 'Memproses Transaksi...' : 'Konfirmasi & Bayar Sekarang' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Tambah Produk Baru -->
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showAddModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Tambah Produk E-Commerce</h3>

          <form @submit.prevent="createProduct" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Produk *</label>
              <input v-model="newProd.name" required type="text" placeholder="Contoh: Laptop Enterprise ThinkPad Core i7" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori *</label>
                <select v-model="newProd.category" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option v-for="cat in allCategoriesList" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Harga (IDR) *</label>
                <input v-model.number="newProd.price" required type="number" placeholder="15000000" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Stok Awal *</label>
                <input v-model.number="newProd.stock" required type="number" placeholder="25" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Icon Emoji</label>
                <input v-model="newProd.icon" type="text" placeholder="💻" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat</label>
              <textarea v-model="newProd.description" rows="2" placeholder="Spesifikasi atau informasi produk..." class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"></textarea>
            </div>

            <div class="pt-3 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="showAddModal = false" class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600">Simpan ke Katalog</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Tambah Kategori Baru -->
      <div v-if="showAddCatModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showAddCatModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>📁</span> Tambah Kategori Baru
          </h3>
          <p class="text-xs text-gray-500 mb-4">Tambahkan segmen kategori baru untuk mengelompokkan katalog produk eCommerce Anda.</p>

          <form @submit.prevent="addCategory" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Kategori *</label>
              <input
                v-model="newCategoryName"
                required
                type="text"
                placeholder="Contoh: Aksesoris Gadget, Alat Tulis Kantor"
                class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="showAddCatModal = false" class="rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">Simpan Kategori</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { IPaginationMeta } from '@/types'
import { ecommerceService } from '@/services/website/ecommerce.service'

interface Product {
  id: number
  sku: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  icon: string
}

interface CartItem {
  product: Product
  qty: number
}

const pagination = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const onPaginationChange = (payload: { page: number; limit: number }) => {
  pagination.value.current_page = payload.page
  pagination.value.per_page = payload.limit
  fetchData()
}

const isCartOpen = ref(false)
const showAddModal = ref(false)
const showAddCatModal = ref(false)
const newCategoryName = ref('')
const selectedCategory = ref('Semua')
const searchQuery = ref('')
const maxPriceFilter = ref(50000000)
const onlyInStock = ref(false)
const sortBy = ref<'recommended' | 'price_asc' | 'price_desc' | 'name_asc'>('recommended')

const baseCategories = [
  'Hardware IT',
  'Perlengkapan Kantor',
  'Software License',
  'Merchandise',
]
const customCategories = ref<string[]>([])

const categoryIcons: Record<string, string> = {
  Semua: '🌐',
  'Hardware IT': '💻',
  'Perlengkapan Kantor': '🪑',
  'Software License': '⚡',
  Merchandise: '👕',
}

const allCategoriesList = computed(() => {
  return [...baseCategories, ...customCategories.value]
})

const categoriesWithCount = computed(() => {
  const list = [
    {
      name: 'Semua',
      icon: categoryIcons['Semua'] || '🌐',
      count: products.value.length,
    },
  ]

  allCategoriesList.value.forEach((cat) => {
    const count = products.value.filter((p) => p.category === cat).length
    list.push({
      name: cat,
      icon: categoryIcons[cat] || '📁',
      count,
    })
  })

  return list
})

function addCategory() {
  const trimmed = newCategoryName.value.trim()
  if (trimmed && !allCategoriesList.value.includes(trimmed)) {
    customCategories.value.push(trimmed)
    selectedCategory.value = trimmed
    newCategoryName.value = ''
    showAddCatModal.value = false
  }
}

function removeCategory(name: string) {
  customCategories.value = customCategories.value.filter((c) => c !== name)
  if (selectedCategory.value === name) {
    selectedCategory.value = 'Semua'
  }
}

const products = ref<Product[]>([
  {
    id: 1,
    sku: 'PRD-IT-001',
    name: 'Laptop Enterprise ThinkPad T14 Gen 4',
    category: 'Hardware IT',
    price: 18500000,
    stock: 24,
    description: 'Intel Core i7-1365U, 32GB RAM DDR5, 1TB NVMe, Layar 14" IPS Anti-Glare, Garansi Resmi 3 Tahun.',
    icon: '💻',
  },
  {
    id: 2,
    sku: 'PRD-IT-002',
    name: 'Monitor UltraSharp 27" 4K USB-C Hub',
    category: 'Hardware IT',
    price: 8750000,
    stock: 15,
    description: 'Resolusi 3840x2160, 99% sRGB, RJ45 Ethernet, 90W Power Delivery untuk efisiensi workstation.',
    icon: '🖥️',
  },
  {
    id: 3,
    sku: 'PRD-OF-001',
    name: 'Ergonomic Mesh Executive Chair',
    category: 'Perlengkapan Kantor',
    price: 3450000,
    stock: 8,
    description: 'Desain ergonomis lumbar support dinamis, breathable mesh, armrest 4D, standar sertifikasi BIFMA.',
    icon: '🪑',
  },
  {
    id: 4,
    sku: 'PRD-SW-001',
    name: 'Lisensi ERP Enterprise Annual 100 User',
    category: 'Software License',
    price: 45000000,
    stock: 50,
    description: 'Paket langganan modul lengkap: HR, Keuangan, Sales, CRM, Supply Chain dengan SLA 99.9%.',
    icon: '⚡',
  },
  {
    id: 5,
    sku: 'PRD-IT-003',
    name: 'Wireless Keyboard & Mouse Multi-Device',
    category: 'Hardware IT',
    price: 1250000,
    stock: 35,
    description: 'Koneksi Bluetooth Low Energy + Logi Bolt, baterai tahan 36 bulan, silent click.',
    icon: '⌨️',
  },
  {
    id: 6,
    sku: 'PRD-MC-001',
    name: 'Corporate Executive Polo Shirt',
    category: 'Merchandise',
    price: 275000,
    stock: 120,
    description: 'Bahan Lacoste CVC Premium, bordir logo perusahaan rapi, nyaman dipakai harian.',
    icon: '👕',
  },
])

const cart = ref<CartItem[]>([])

const newProd = ref({
  name: '',
  category: 'Hardware IT',
  price: 0,
  stock: 10,
  icon: '📦',
  description: '',
})

const filteredProducts = computed(() => {
  let list = products.value.filter((p) => {
    const matchesCategory = selectedCategory.value === 'Semua' || p.category === selectedCategory.value
    const matchesSearch =
      !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesPrice = p.price <= maxPriceFilter.value
    const matchesStock = !onlyInStock.value || p.stock > 0

    return matchesCategory && matchesSearch && matchesPrice && matchesStock
  })

  // Sorting
  if (sortBy.value === 'price_asc') {
    list = [...list].sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price_desc') {
    list = [...list].sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'name_asc') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  }

  return list
})

const cartItemsCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.qty, 0)
})

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + item.product.price * item.qty, 0)
})

const voucherCode = ref('')
const voucherDiscountPercent = ref(0)
const voucherFlatDiscount = ref(0)
const appliedVoucherMsg = ref('')

function applyVoucher() {
  const code = voucherCode.value.trim().toUpperCase()
  if (code === 'B2BMITRA10') {
    voucherDiscountPercent.value = 10
    voucherFlatDiscount.value = 0
    appliedVoucherMsg.value = '✓ Kupon Mitra B2B aktif: Diskon 10% diterapkan!'
  } else if (code === 'DISKON500K' || code === 'ENTERPRISE500K') {
    voucherDiscountPercent.value = 0
    voucherFlatDiscount.value = 500000
    appliedVoucherMsg.value = '✓ Kupon Korporat aktif: Potongan Rp 500.000 diterapkan!'
  } else {
    voucherDiscountPercent.value = 0
    voucherFlatDiscount.value = 0
    appliedVoucherMsg.value = '❌ Kode voucher tidak ditemukan.'
  }
}

const wholesaleDiscountAmount = computed(() => {
  return cartItemsCount.value >= 10 ? cartTotal.value * 0.15 : 0
})

const voucherDiscountAmount = computed(() => {
  const base = cartTotal.value - wholesaleDiscountAmount.value
  if (voucherDiscountPercent.value > 0) {
    return base * (voucherDiscountPercent.value / 100)
  }
  return Math.min(base, voucherFlatDiscount.value)
})

const discountedSubtotal = computed(() => {
  return Math.max(0, cartTotal.value - wholesaleDiscountAmount.value - voucherDiscountAmount.value)
})

const ppnAmount = computed(() => {
  return discountedSubtotal.value * 0.11
})

const finalTotalAmount = computed(() => {
  return discountedSubtotal.value + ppnAmount.value
})

function formatRupiah(val: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

function addToCart(prod: Product) {
  const existing = cart.value.find((c) => c.product.id === prod.id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({ product: prod, qty: 1 })
  }
}

function updateQty(id: number, delta: number) {
  const idx = cart.value.findIndex((c) => c.product.id === id)
  if (idx !== -1) {
    cart.value[idx].qty += delta
    if (cart.value[idx].qty <= 0) {
      cart.value.splice(idx, 1)
    }
  }
}

function openAddProductModal() {
  newProd.value = {
    name: '',
    category: 'Hardware IT',
    price: 0,
    stock: 10,
    icon: '📦',
    description: '',
  }
  showAddModal.value = true
}

function createProduct() {
  products.value.unshift({
    id: Date.now(),
    sku: `PRD-${Date.now().toString().slice(-4)}`,
    ...newProd.value,
  })
  showAddModal.value = false
}

const showPaymentModal = ref(false)
const selectedPaymentMethod = ref<'qris' | 'va' | 'cc'>('qris')
const isPaying = ref(false)
const activeSnapData = ref<any>(null)

async function processCheckout() {
  const orderId = `SO-${Date.now().toString().slice(-6)}`
  const totalAmount = finalTotalAmount.value

  try {
    const res = await fetch('http://localhost:7070/api/website/ecommerce/snap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderId,
        gross_amount: totalAmount,
        customer_name: 'PT. Mitra Niaga Mandiri',
      }),
    })
    const json = await res.json()
    activeSnapData.value = json.data || { order_id: orderId, snap_token: 'dummy-snap-token' }
  } catch {
    activeSnapData.value = { order_id: orderId, snap_token: 'dummy-snap-token' }
  }

  isCartOpen.value = false
  showPaymentModal.value = true
}

function confirmPayment() {
  isPaying.value = true
  setTimeout(() => {
    isPaying.value = false
    showPaymentModal.value = false
    alert(
      `🎉 PEMBAYARAN MIDTRANS BERHASIL!\n\nOrder ID: ${activeSnapData.value?.order_id}\nMetode: ${selectedPaymentMethod.value.toUpperCase()}\nStatus Transaksi: Lunas (Settlement/Paid)\n\nFaktur Sale Order otomatis terbit dan stok barang berkurang di modul Inventaris.`
    )
    cart.value = []
  }, 1200)
}

async function fetchData() {
  try {
    const res = await ecommerceService.getAll({
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    })
    let items: any[] = []
    if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
      items = (res as any).data
      if ((res as any).pagination) pagination.value = (res as any).pagination
    } else if (Array.isArray(res)) {
      items = res
    }
    if (items.length > 0) {
      products.value = items.map((p: any) => ({
        id: p.id,
        sku: p.sku || `PRD-${p.id}`,
        name: p.name || 'Produk eCommerce',
        category: p.category || 'Hardware IT',
        price: Number(p.price) || 1000000,
        stock: Number(p.stock) || 10,
        description: p.description || '',
        icon: p.icon || '📦'
      }))
    }
  } catch (err) {
    console.error('Error fetching ecommerce products:', err)
  }
}

onMounted(() => {
  fetchData()
})
</script>
