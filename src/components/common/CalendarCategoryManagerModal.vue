<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100005] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs"
      @click.self="$emit('close')"
    >
      <div class="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-fadeIn">
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-1 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/50 text-sm">⚙️</span>
            <span>Kelola Kategori & Warna Kalender ({{ moduleTitle }})</span>
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Atur label kategori agenda, ikon penanda, serta warna badge untuk modul ini.
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <!-- Main Body: Split List & Form -->
      <div class="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- List of Categories (7 cols) -->
        <div class="md:col-span-7 space-y-3 max-h-[420px] overflow-y-auto pr-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
              Daftar Kategori Saat Ini ({{ categories.length }})
            </span>
            <button
              v-if="editingId"
              @click="resetForm"
              class="text-xs font-semibold text-brand-600 hover:underline"
            >
              + Buat Kategori Baru
            </button>
          </div>

          <div v-if="loading" class="text-center py-8 text-xs text-gray-400">
            Memuat kategori...
          </div>

          <div v-else-if="categories.length === 0" class="text-center py-8 text-xs text-gray-400 border border-dashed rounded-xl">
            Belum ada kategori. Silakan tambahkan melalui formulir di samping.
          </div>

          <div
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center justify-between p-3 rounded-xl border transition group"
            :class="editingId === cat.id ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 ring-2 ring-brand-500/20' : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-gray-300'"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xl shrink-0">{{ cat.icon || '📌' }}</span>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-bold text-gray-800 dark:text-white truncate">
                    {{ cat.name }}
                  </span>
                  <span
                    class="px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 shrink-0"
                    :class="getColorBadgeClass(cat.color)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="getColorDotClass(cat.color)"></span>
                    {{ getColorLabel(cat.color) }}
                  </span>
                </div>
                <p v-if="cat.description" class="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {{ cat.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0 ml-2">
              <button
                @click="startEdit(cat)"
                title="Edit Kategori"
                class="p-1.5 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-gray-700 hover:text-brand-600 transition"
              >
                ✏️
              </button>
              <button
                @click="confirmDelete(cat)"
                title="Hapus Kategori"
                class="p-1.5 rounded-lg text-gray-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 transition"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Form (5 cols) -->
        <div class="md:col-span-5 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {{ editingId ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
            </h4>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Nama Kategori
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Contoh: Cuti Staf / Pajak DJP"
                class="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Ikon / Emoji
              </label>
              <div class="flex flex-wrap gap-1 p-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 max-h-24 overflow-y-auto">
                <button
                  v-for="icon in popularIcons"
                  :key="icon"
                  type="button"
                  @click="formData.icon = icon"
                  class="w-7 h-7 flex items-center justify-center rounded-lg text-sm hover:scale-110 transition"
                  :class="formData.icon === icon ? 'bg-brand-50 border border-brand-300 dark:bg-brand-950/60' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
                >
                  {{ icon }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Warna Indikator Kalender
              </label>
              <div class="grid grid-cols-2 gap-1.5">
                <button
                  v-for="color in availableColors"
                  :key="color.value"
                  type="button"
                  @click="formData.color = color.value"
                  class="flex items-center gap-1.5 p-1.5 rounded-xl border text-xs font-medium transition text-left"
                  :class="formData.color === color.value ? 'border-brand-500 ring-2 ring-brand-500/20 bg-white dark:bg-gray-900' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white/50 dark:bg-gray-900/50'"
                >
                  <span class="w-3 h-3 rounded-full shrink-0" :class="color.bgClass"></span>
                  <span class="truncate text-[10px] text-gray-700 dark:text-gray-300">{{ color.label }}</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Keterangan Singkat
              </label>
              <input
                v-model="formData.description"
                type="text"
                placeholder="Catatan fungsi kategori"
                class="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <button
              v-if="editingId"
              type="button"
              @click="resetForm"
              class="w-1/3 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              Batal
            </button>
            <button
              type="button"
              @click="handleSubmit"
              :disabled="saving || !formData.name.trim()"
              class="flex-1 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 disabled:opacity-50 transition shadow-xs"
            >
              {{ saving ? 'Menyimpan...' : (editingId ? 'Simpan' : '+ Tambah') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <p class="text-[11px] text-gray-400">
          * Perubahan kategori akan langsung tersinkronisasi ke filter & form modal jadwal.
        </p>
        <button
          @click="$emit('close')"
          class="rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type ICalendarCategory
} from '@/services/calendar.service'

const props = defineProps<{
  moduleName: string
  moduleTitle: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'categories-updated', categories: ICalendarCategory[]): void
}>()

const loading = ref(false)
const saving = ref(false)
const categories = ref<ICalendarCategory[]>([])
const editingId = ref<string | number | null>(null)

const formData = reactive({
  name: '',
  icon: '📌',
  color: 'primary',
  description: ''
})

const popularIcons = [
  '🏖️', '💰', '🧾', '📦', '🚚', '🤝', '📞', '✍️', '🎯', '📢',
  '📱', '🎪', '🏷️', '🛠️', '⏳', '🎫', '🌐', '📝', '🎓', '🚀',
  '🎂', '📋', '🔍', '📌'
]

const availableColors = [
  { value: 'primary', label: 'Biru (Primary)', bgClass: 'bg-blue-500' },
  { value: 'success', label: 'Hijau (Success)', bgClass: 'bg-emerald-500' },
  { value: 'warning', label: 'Kuning (Warning)', bgClass: 'bg-amber-500' },
  { value: 'danger', label: 'Merah (Urgent)', bgClass: 'bg-rose-500' },
  { value: 'purple', label: 'Ungu (Purple)', bgClass: 'bg-purple-500' },
  { value: 'cyan', label: 'Cyan (Light Blue)', bgClass: 'bg-cyan-500' },
  { value: 'indigo', label: 'Indigo (Dark Blue)', bgClass: 'bg-indigo-500' },
  { value: 'orange', label: 'Orange (Jingga)', bgClass: 'bg-orange-500' }
]

const getColorBadgeClass = (color: string) => {
  switch (color) {
    case 'danger':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
    case 'warning':
    case 'orange':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
    case 'success':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
    case 'purple':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
    case 'cyan':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800'
    case 'indigo':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
    case 'primary':
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
  }
}

const getColorDotClass = (color: string) => {
  switch (color) {
    case 'danger': return 'bg-rose-500'
    case 'warning':
    case 'orange': return 'bg-amber-500'
    case 'success': return 'bg-emerald-500'
    case 'purple': return 'bg-purple-500'
    case 'cyan': return 'bg-cyan-500'
    case 'indigo': return 'bg-indigo-500'
    case 'primary':
    default: return 'bg-blue-500'
  }
}

const getColorLabel = (color: string) => {
  const c = availableColors.find(x => x.value === color)
  return c ? c.label.split(' ')[0] : 'Normal'
}

const loadData = async () => {
  loading.value = true
  try {
    const list = await fetchCategories(props.moduleName)
    categories.value = list
    emit('categories-updated', list)
  } catch (err) {
    console.error('Failed to load categories', err)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  editingId.value = null
  formData.name = ''
  formData.icon = '📌'
  formData.color = 'primary'
  formData.description = ''
}

const startEdit = (cat: ICalendarCategory) => {
  editingId.value = cat.id
  formData.name = cat.name
  formData.icon = cat.icon || '📌'
  formData.color = cat.color || 'primary'
  formData.description = cat.description || ''
}

const handleSubmit = async () => {
  if (!formData.name.trim()) return
  saving.value = true

  try {
    if (editingId.value) {
      await updateCategory(editingId.value, {
        module: props.moduleName,
        name: formData.name.trim(),
        icon: formData.icon,
        color: formData.color,
        description: formData.description.trim()
      })
    } else {
      await createCategory({
        module: props.moduleName,
        name: formData.name.trim(),
        icon: formData.icon,
        color: formData.color,
        description: formData.description.trim()
      })
    }

    resetForm()
    await loadData()
  } catch (err) {
    console.error('Failed to save category', err)
    alert('Gagal menyimpan kategori')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (cat: ICalendarCategory) => {
  if (confirm(`Hapus kategori "${cat.name}"?`)) {
    try {
      await deleteCategory(cat.id, props.moduleName)
      if (editingId.value === cat.id) {
        resetForm()
      }
      await loadData()
    } catch (err) {
      console.error('Failed to delete category', err)
      alert('Gagal menghapus kategori')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
