<template>
  <AdminLayout>
    <div v-if="isLoading" class="p-6 flex justify-center py-20">
      <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="error" class="p-6">
      <Alert variant="error" title="Gagal Memuat Profil" :message="error" />
      <button @click="$router.push('/hr/employees')" class="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Kembali</button>
    </div>
    
    <div v-else class="p-6">
      <!-- Header Profil -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold uppercase shadow-sm">
            {{ employee.name ? employee.name.substring(0,2) : 'EM' }}
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ employee.name }}</h2>
            <div class="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span class="inline-flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {{ employee.job_position?.name || 'Belum ada jabatan' }}
              </span>
              <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              <span class="inline-flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                {{ employee.department?.name || 'Tanpa Departemen' }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="$router.push('/hr/employees')" class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            Kembali
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="-mb-px flex space-x-8 overflow-x-auto custom-scrollbar">
          <button 
            @click="activeTab = 'info'" 
            :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors', activeTab === 'info' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300']"
          >
            Informasi Dasar
          </button>
          <button 
            @click="activeTab = 'skills'" 
            :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors', activeTab === 'skills' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300']"
          >
            Resume & Keterampilan
          </button>
          <button 
            @click="activeTab = 'contracts'" 
            :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors', activeTab === 'contracts' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300']"
          >
            Riwayat Kontrak
          </button>
        </nav>
      </div>

      <!-- Tab 1: Informasi Dasar -->
      <div v-if="activeTab === 'info'" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 max-w-4xl">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Detail Pribadi & Organisasi</h3>
        <form @submit.prevent="saveEmployee" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Lengkap</label>
              <input v-model="employee.name" type="text" required class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status Akun</label>
              <select v-model="employee.is_active" class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                <option :value="true">Aktif Bekerja</option>
                <option :value="false">Tidak Aktif (Resign)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Kerja</label>
              <input v-model="employee.work_email" type="email" class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">No. Telepon Kerja</label>
              <input v-model="employee.work_phone" type="text" class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>
            <div class="md:col-span-2"><hr class="border-gray-200 dark:border-gray-700 my-2"></div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Departemen</label>
              <select v-model="employee.department_id" class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                <option :value="undefined">Pilih Departemen...</option>
                <option v-for="dept in departmentsList" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Posisi / Jabatan</label>
              <select v-model="employee.job_position_id" class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                <option :value="undefined">Pilih Posisi...</option>
                <option v-for="job in jobPositionsList" :key="job.id" :value="job.id">{{ job.name }}</option>
              </select>
            </div>
            <div class="md:col-span-2"><hr class="border-gray-200 dark:border-gray-700 my-2"></div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Kontak Darurat</label>
              <input v-model="employee.emergency_contact" type="text" class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Telepon Kontak Darurat</label>
              <input v-model="employee.emergency_phone" type="text" class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>
          </div>
          <div class="pt-4 flex justify-end">
            <button type="submit" :disabled="isSaving" class="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-colors font-medium">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Tab 2: Skills & Resume -->
      <div v-if="activeTab === 'skills'" class="space-y-6">
        
        <!-- Skills Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Keterampilan (Skills)</h3>
            <button @click="openAddSkillModal" class="px-3 py-1.5 text-sm bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors shadow-sm">
              + Tambah Skill
            </button>
          </div>
          <div class="p-5">
            <div v-if="!employee.employee_skills || employee.employee_skills.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
              Belum ada skill yang ditambahkan untuk karyawan ini.
            </div>
            <div v-else class="flex flex-wrap gap-3">
              <div v-for="es in employee.employee_skills" :key="es.id" class="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-300">
                <span class="font-medium text-sm">{{ es.skill?.name || 'Unknown' }}</span>
                <span class="text-xs bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded">{{ es.skill_level?.name || 'Level' }}</span>
                <button @click="deleteSkill(es.id)" class="text-blue-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full p-0.5 ml-1 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Tab 3: Riwayat Kontrak -->
      <div v-if="activeTab === 'contracts'" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">Riwayat Kontrak Kerja</h3>
        </div>
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-4 font-semibold">Gaji Pokok (Wage)</th>
                <th class="px-6 py-4 font-semibold">Tanggal Mulai</th>
                <th class="px-6 py-4 font-semibold">Tanggal Selesai</th>
                <th class="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="!employee.contracts || employee.contracts.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Karyawan ini belum memiliki riwayat kontrak.</td>
              </tr>
              <tr v-for="c in employee.contracts" :key="c.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-semibold">{{ formatCurrency(c.wage || 0) }}</td>
                <td class="px-6 py-4">{{ formatDate(c.start_date) }}</td>
                <td class="px-6 py-4">{{ formatDate(c.end_date) || 'Tanpa Batas' }}</td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {{ c.state?.toUpperCase() || 'DRAFT' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Add Skill Modal -->
  <Teleport to="body">
    <div v-if="isSkillModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div class="w-full max-w-sm rounded-xl bg-white shadow-2xl dark:bg-gray-800 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 class="font-bold text-gray-900 dark:text-white">Tambahkan Skill</h3>
          <button @click="isSkillModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form @submit.prevent="saveEmployeeSkill" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Pilih Skill</label>
            <select v-model="newSkill.skill_id" required class="w-full rounded-md border border-gray-300 p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
              <option :value="undefined">-- Pilih Master Skill --</option>
              <option v-for="s in masterSkills" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Level Kemahiran</label>
            <select v-model="newSkill.skill_level_id" required class="w-full rounded-md border border-gray-300 p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
              <option :value="undefined">-- Pilih Level --</option>
              <option v-for="l in masterSkillLevels" :key="l.id" :value="l.id">{{ l.name }}</option>
            </select>
          </div>
          <div class="pt-2">
            <button type="submit" :disabled="isSavingSkill" class="w-full py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 font-medium disabled:opacity-50">
              {{ isSavingSkill ? 'Menyimpan...' : 'Tambahkan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Alert from '@/components/ui/Alert.vue'
import { http } from '@/services/http'
import { departmentsService } from '@/services/hr/departments.service'

const route = useRoute()
const employeeId = route.params.id

const activeTab = ref('info')
const employee = ref<any>({})
const isLoading = ref(true)
const error = ref<string | null>(null)
const isSaving = ref(false)

const departmentsList = ref<any[]>([])
const jobPositionsList = ref<any[]>([])

// Skills Modal
const isSkillModalOpen = ref(false)
const isSavingSkill = ref(false)
const masterSkills = ref<any[]>([])
const masterSkillLevels = ref<any[]>([])
const newSkill = ref({ skill_id: undefined, skill_level_id: undefined })

const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

const fetchData = async () => {
  isLoading.value = true
  try {
    const [empRes, deptData, jobRes, skillRes, levelRes] = await Promise.all([
      http.get(`/hr/employees/${employeeId}`),
      departmentsService.getAll(),
      http.get('/hr/employees/jobposition'),
      http.get('/hr/employees/skill'),
      http.get('/hr/employees/skilllevel').catch(() => ({ data: { data: [] } }))
    ])
    employee.value = empRes.data?.data || empRes.data
    departmentsList.value = deptData
    jobPositionsList.value = jobRes.data?.data || jobRes.data || []
    masterSkills.value = skillRes.data?.data || skillRes.data || []
    masterSkillLevels.value = levelRes.data?.data || levelRes.data || []
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat profil'
  } finally {
    isLoading.value = false
  }
}

const saveEmployee = async () => {
  isSaving.value = true
  try {
    await http.put(`/hr/employees/${employeeId}`, employee.value)
    alert('Profil berhasil diperbarui!')
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const openAddSkillModal = () => {
  newSkill.value = { skill_id: undefined, skill_level_id: undefined }
  isSkillModalOpen.value = true
}

const saveEmployeeSkill = async () => {
  isSavingSkill.value = true
  try {
    await http.post('/hr/employees/employeeskill', {
      employee_id: Number(employeeId),
      skill_id: newSkill.value.skill_id,
      skill_level_id: newSkill.value.skill_level_id
    })
    isSkillModalOpen.value = false
    fetchData() // refresh the employee object to get new skills
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSavingSkill.value = false
  }
}

const deleteSkill = async (id: number) => {
  if (!confirm('Hapus skill ini?')) return
  try {
    await http.delete(`/hr/employees/employeeskill/${id}`)
    fetchData()
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(() => {
  if (employeeId) fetchData()
})
</script>
