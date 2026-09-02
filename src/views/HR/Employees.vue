<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Directory Pegawai" />
        
        <div class="flex gap-2">
          <!-- View Toggle -->
          <div class="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mr-2">
            <button 
              @click="viewMode = 'grid'" 
              :class="['px-3 py-2 transition-colors', viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700 text-brand-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']"
              title="Kanban View"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <button 
              @click="viewMode = 'list'" 
              :class="['px-3 py-2 transition-colors', viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-brand-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']"
              title="List View"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>

          <button @click="fetchData" class="inline-flex items-center justify-center rounded-md border border-gray-300 py-2 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center justify-center rounded-md bg-brand-500 py-2 px-6 text-center font-medium text-white hover:bg-brand-600 transition-colors">
            + Tambah Pegawai
          </button>
        </div>
      </div>

      <!-- Filters/Search -->
      <div class="mb-6 flex flex-col sm:flex-row items-start justify-between p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] gap-4">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative w-full sm:w-80">
            <input type="text" placeholder="Cari nama, departemen, atau email..." class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M19.7 18.3l-4.8-4.8c1-1.3 1.6-2.9 1.6-4.7 0-4.3-3.5-7.8-7.8-7.8S1 4.5 1 8.8s3.5 7.8 7.8 7.8c1.8 0 3.4-.6 4.7-1.6l4.8 4.8c.2.2.4.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4zM2.5 8.8c0-3.5 2.8-6.3 6.3-6.3s6.3 2.8 6.3 6.3-2.8 6.3-6.3 6.3-6.3-2.8-6.3-6.3z"/></svg>
            </span>
          </div>
          <button class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filter
          </button>
        </div>
      </div>

      <!-- Loading & Error States -->
      <div v-if="isLoading" class="py-20 text-center">
        <div class="inline-block w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500 font-medium">Memuat data pegawai...</p>
      </div>
      <div v-else-if="error" class="mb-6">
        <Alert variant="error" title="Gagal Memuat Data" :message="error || ''" />
      </div>
      <div v-else-if="records.length === 0" class="py-20 text-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 text-gray-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-1">Belum Ada Pegawai</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Mulai dengan menambahkan data pegawai pertama Anda.</p>
        <button @click="openModal('create')" class="text-brand-500 font-medium hover:underline">+ Tambah Pegawai</button>
      </div>

      <!-- KANBAN / GRID VIEW -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="emp in records" :key="emp.id" class="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
          <!-- Edit button that appears on hover -->
          <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
             <button @click="$router.push('/hr/employees/' + emp.id)" class="p-1.5 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-brand-500 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
             </button>
             <button @click="deleteRecord(emp)" class="p-1.5 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-error-500 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </button>
          </div>

          <div class="p-5 flex flex-col items-center border-b border-gray-100 dark:border-gray-700/50">
            <!-- Avatar -->
            <div class="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-2xl font-bold mb-3 shadow-sm">
              {{ getInitials(emp.name || '') }}
            </div>
            
            <h3 class="font-bold text-gray-900 dark:text-white text-lg text-center leading-tight mb-1">{{ emp.name || 'Unknown' }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">{{ emp.job_position?.name || 'Posisi Belum Diatur' }}</p>
            
            <Badge color="success" class="text-xs">{{ 'Aktif' }}</Badge>
          </div>

          <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50">
            <div class="space-y-2 text-sm">
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                <span class="truncate">{{ emp.department?.name || 'Departemen Belum Diatur' }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span class="truncate">{{ emp.work_email || '-' }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>{{ emp.work_phone || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LIST / TABLE VIEW -->
      <div v-else-if="viewMode === 'list'" class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th class="w-12 px-5 py-3 sm:px-6">
                  <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800" />
                </th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-semibold text-gray-600 text-xs uppercase tracking-wider dark:text-gray-400">Profil Pegawai</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-semibold text-gray-600 text-xs uppercase tracking-wider dark:text-gray-400">Kontak</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-semibold text-gray-600 text-xs uppercase tracking-wider dark:text-gray-400">Departemen</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-semibold text-gray-600 text-xs uppercase tracking-wider dark:text-gray-400">Status</p></th>
                <th class="px-5 py-3 text-right sm:px-6"><p class="font-semibold text-gray-600 text-xs uppercase tracking-wider dark:text-gray-400">Aksi</p></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(emp, index) in records" :key="emp.id || index" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                <td class="px-5 py-4 sm:px-6">
                  <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800" />
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
                      {{ getInitials(emp.name || '') }}
                    </div>
                    <div>
                      <span class="block font-medium text-gray-900 dark:text-white">{{ emp.name || 'Unknown' }}</span>
                      <span class="block text-sm text-gray-500 dark:text-gray-400">{{ emp.job_position?.name || 'Posisi Belum Diatur' }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span class="block text-sm text-gray-800 dark:text-gray-300">{{ emp.work_email || '-' }}</span>
                  <span class="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ emp.work_phone || '-' }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span class="block text-sm text-gray-800 dark:text-gray-300">{{ emp.department?.name || '-' }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <Badge color="success" class="text-xs">{{ 'Aktif' }}</Badge>
                </td>
                <td class="px-5 py-4 sm:px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="$router.push('/hr/employees/' + emp.id)" class="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors" title="Edit">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button @click="deleteRecord(emp)" class="p-1.5 text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors" title="Ubah Status Aktif">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
          <span class="text-sm text-gray-500 dark:text-gray-400">Menampilkan {{ records.length }} data</span>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 bg-transparent">&larr; Prev</button>
            <button class="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 bg-transparent">Next &rarr;</button>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>

  <!-- Modal CRUD -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-800 my-8 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Tambah Data Pegawai' : 'Edit Data Pegawai' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="saveRecord">
          <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            <h4 class="font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2">Informasi Dasar</h4>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
              <input v-model="formData.name" type="text" required placeholder="Mis. Budi Santoso" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Kerja</label>
                <input v-model="formData.work_email" type="email" placeholder="budi@perusahaan.com" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon</label>
                <input v-model="formData.work_phone" type="text" placeholder="0812..." class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              </div>
            </div>

            <h4 class="font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2 pt-4">Posisi & Organisasi</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</label>
                <select v-model.number="formData.department_id" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                  <option :value="undefined">-- Pilih Departemen --</option>
                  <option v-for="d in uniqueDepartments" :key="d.id" :value="d.id">{{ d.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Posisi Pekerjaan</label>
                <select v-model.number="formData.job_position_id" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                  <option :value="undefined">-- Pilih Posisi --</option>
                  <option v-for="j in uniqueJobPositions" :key="j.id" :value="j.id">{{ j.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Manajer (Atasan)</label>
                <select v-model.number="formData.manager_id" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                  <option :value="undefined">-- Pilih Atasan --</option>
                  <option v-for="m in uniqueManagers" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">ID User Terkait (Akun)</label>
                <input v-model.number="formData.user_id" type="number" placeholder="ID Akun ERP" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              </div>
            </div>

            <h4 class="font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2 pt-4">Kontak Darurat</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Kontak Darurat</label>
                <input v-model="formData.emergency_contact" type="text" placeholder="Mis. Istri / Kakak" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Telepon Darurat</label>
                <input v-model="formData.emergency_phone" type="text" placeholder="0812..." class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              </div>
            </div>

          </div>
          
          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-70 transition-colors shadow-sm">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Pegawai' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Alert from '@/components/ui/Alert.vue'
import Badge from '@/components/ui/Badge.vue'
import { employeesService } from '@/services/hr/employees.service'
import { departmentsService } from '@/services/hr/departments.service'
import { http } from '@/services/http'
import type { IEmployeeDto } from '@/types/hr/employees.dto'

const departmentsList = ref<any[]>([])
const jobPositionsList = ref<any[]>([])
const records = ref<IEmployeeDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
  
const viewMode = ref<'grid' | 'list'>('grid')

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)

const formData = ref<Partial<IEmployeeDto>>({ 
  id: undefined, 
  name: '', 
  work_email: '',
  work_phone: '',
  department_id: undefined,
  job_position_id: undefined,
  manager_id: undefined,
  user_id: undefined,
  emergency_contact: '',
  emergency_phone: ''
})

// Extract Unique Lists for Dropdowns
const uniqueDepartments = computed(() => departmentsList.value)
  const uniqueJobPositions = computed(() => jobPositionsList.value)

const uniqueManagers = computed(() => {
  return records.value.map(emp => ({ id: emp.id, name: emp.name }))
})

const getInitials = (name: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const fetchData = async () => {
  isLoading.value = true; error.value = null
  try {
    
    const [data, depts, jobs] = await Promise.all([
      employeesService.getAll(), 
      departmentsService.getAll(),
      http.get('/hr/employees/jobposition').then(res => res.data.data ?? res.data)
    ]);
    departmentsList.value = depts;
    jobPositionsList.value = jobs;
    
    records.value = data
  } catch (err: any) {
    error.value = 'Gagal memuat data: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { 
      id: data.id, 
      name: data.name || '', 
      work_email: data.work_email || '', 
      work_phone: data.work_phone || '',
      department_id: data.department_id,
      job_position_id: data.job_position_id,
      manager_id: data.manager_id,
      user_id: data.user_id,
      emergency_contact: data.emergency_contact || '',
      emergency_phone: data.emergency_phone || ''
    }
  } else {
    formData.value = { 
      id: undefined, 
      name: '', 
      work_email: '', 
      work_phone: '',
      department_id: undefined,
      job_position_id: undefined,
      manager_id: undefined,
      user_id: undefined,
      emergency_contact: '',
      emergency_phone: ''
    }
  }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const saveRecord = async () => {
  isSaving.value = true
  try {
    if (modalMode.value === 'edit' && formData.value.id) {
      await employeesService.update(formData.value.id, formData.value as IEmployeeDto)
    } else {
      await employeesService.create(formData.value as IEmployeeDto)
    }
    closeModal()
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (record: IEmployeeDto) => {
  const newStatus = record.is_active === false ? true : false;
  const actionText = newStatus ? 'mengaktifkan kembali' : 'menonaktifkan';
  if (!confirm(`Apakah Anda yakin ingin ${actionText} pegawai ini?`)) return;
  try {
    await employeesService.update(record.id as number, { ...record, is_active: newStatus });
    fetchData();
  } catch (err: any) {
    alert(err.response?.data?.message || err.message);
  }
}

onMounted(() => fetchData())
</script>
