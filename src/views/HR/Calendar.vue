<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Module Header Banner & Category Legend -->
    <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
      <div>
        <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="p-1.5 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 text-sm">📅</span>
          Kalender HRD & Jadwal Kepegawaian (HRIS Calendar)
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Pemantauan jadwal cuti tahunan, hari ulang tahun staf, agenda wawancara pelamar, dan siklus penggajian payroll TER.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          @click="activeCategoryFilter = 'ALL'"
          class="px-2.5 py-1 rounded-lg font-bold border transition flex items-center gap-1 cursor-pointer"
          :class="activeCategoryFilter === 'ALL' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent shadow-xs' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'"
        >
          Semua ({{ events.length }})
        </button>
        <button
          v-for="cat in moduleCategories"
          :key="cat.id"
          @click="activeCategoryFilter = cat.name"
          class="px-2.5 py-1 rounded-lg font-bold border transition flex items-center gap-1 cursor-pointer"
          :class="[
            activeCategoryFilter === cat.name ? 'ring-2 ring-brand-500 shadow-xs' : 'opacity-85 hover:opacity-100',
            getCategoryBadgeClass(cat.color)
          ]"
        >
          <span>{{ cat.icon || '📌' }}</span>
          <span>{{ cat.name }}</span>
        </button>
        <button
          @click="isCategoryModalOpen = true"
          class="px-3 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800 transition flex items-center gap-1 ml-1 cursor-pointer shadow-2xs"
          title="Tambah / Edit Kategori & Warna"
        >
          <span>⚙️</span>
          <span>Kelola Kategori</span>
        </button>
      </div>
    </div>

    <div
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="custom-calendar">
        <FullCalendar ref="calendarRef" class="min-h-screen" :options="calendarOptions" />
      </div>

      <!-- Category Management Modal -->
      <CalendarCategoryManagerModal
        v-if="isCategoryModalOpen"
        :moduleName="resModel"
        :moduleTitle="currentPageTitle"
        @close="isCategoryModalOpen = false"
        @categories-updated="onCategoriesUpdated"
      />

      <!-- Modal -->
      <Modal v-if="isOpen" @close="closeModal">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
          >
            <h5
              class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl"
            >
              {{ selectedEvent ? 'Edit Jadwal HRD' : 'Tambah Jadwal HRD' }}
            </h5>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Jadwalkan agenda kepegawaian, pengajuan cuti, jadwal wawancara, atau agenda penggajian bulanan.
            </p>

            <div class="mt-8">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Judul Acara / Agenda
                </label>
                <input
                  v-model="eventTitle"
                  type="text"
                  placeholder="Contoh: Interview User Senior Go Developer"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

                <div class="mt-4">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Keterangan / Catatan Agenda</label>
                  <textarea v-model="eventDescription" placeholder="Catatan detail mengenai jadwal agenda..." class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" rows="3"></textarea>
                </div>
                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Lokasi / Ruangan</label>
                    <input v-model="eventLocation" type="text" placeholder="Contoh: Ruang Meeting HR Lt. 2" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Tautan Rapat Online (Google Meet/Zoom)</label>
                    <input v-model="eventMeetingUrl" type="url" placeholder="https://meet.google.com/..." class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" />
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Kategori Jadwal HRD</label>
                      <button
                        type="button"
                        @click="isCategoryModalOpen = true"
                        class="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        + Kelola
                      </button>
                    </div>
                    <select
                      v-model="eventType"
                      @change="onCategoryChange"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                    >
                      <option value="">Pilih Kategori</option>
                      <option v-for="cat in moduleCategories" :key="cat.id" :value="cat.name">
                        {{ cat.icon || '📌' }} {{ cat.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Visibilitas</label>
                    <select v-model="eventVisibility" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
                      <option value="private">Privat (Khusus Tim HR)</option>
                      <option value="public">Publik (Seluruh Karyawan)</option>
                    </select>
                  </div>
                </div>

                <div class="mt-6">
                  <label class="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Event Color
                </label>
                <div class="flex flex-wrap items-center gap-4 sm:gap-5">
                  
                    <div v-for="evt in calendarsEvents" :key="evt.value" class="n-chk">
                      <div :class="`form-check form-check-${evt.value} form-check-inline`">
                        <label
                          class="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                          :for="`modal${evt.value}`"
                        >
                          <span class="relative">
                            <input
                              type="radio"
                              :name="'event-level'"
                              :value="evt.value"
                              :id="`modal${evt.value}`"
                              v-model="eventLevel"
                              class="sr-only form-check-input"
                            />
                            <span
                              class="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700"
                            >
                              <span class="w-2 h-2 bg-white rounded-full dark:bg-transparent"></span>
                            </span>
                          </span>
                          {{ evt.label }}
                        </label>
                      </div>
                    </div>
                </div>
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date
                </label>
                <input
                  v-model="eventStartDate"
                  type="datetime-local"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date
                </label>
                <input
                  v-model="eventEndDate"
                  type="datetime-local"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div class="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                @click="closeModal"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>

              <button
                @click="handleAddOrUpdateEvent"
                class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {{ selectedEvent ? 'Update Changes' : 'Add Event' }}
              </button>
              <button
                v-if="selectedEvent"
                @click="handleDeleteEvent"
                class="flex w-full justify-center rounded-lg border border-error-500 bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto"
              >
                Delete Event
              </button>
            </div>
          </div>
        </template>
      </Modal>
      <!-- <Teleport to="body">
        <div v-if="isOpen" class="modal-backdrop" @click="closeModal"></div>
        <div v-if="isOpen" class="modal">
          <div >
            <h5
              class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl"
            >
              {{ selectedEvent ? 'Edit Event' : 'Add Event' }}
            </h5>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on track
            </p>

            <div class="mt-8">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Title
                </label>
                <input
                  v-model="eventTitle"
                  type="text"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div class="flex flex-wrap items-center gap-4 sm:gap-5">
                  <div v-for="(value, key) in calendarsEvents" :key="key" class="n-chk">
                    <div :class="`form-check form-check-${value} form-check-inline`">
                      <label
                        class="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        :for="`modal${key}`"
                      >
                        <span class="relative">
                          <input
                            type="radio"
                            :name="'event-level'"
                            :value="key"
                            :id="`modal${key}`"
                            v-model="eventLevel"
                            class="sr-only form-check-input"
                          />
                          <span
                            class="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700"
                          >
                            <span class="w-2 h-2 bg-white rounded-full dark:bg-transparent"></span>
                          </span>
                        </span>
                        {{ key }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date
                </label>
                <input
                  v-model="eventStartDate"
                  type="datetime-local"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date
                </label>
                <input
                  v-model="eventEndDate"
                  type="datetime-local"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div class="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                @click="closeModal"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                @click="handleAddOrUpdateEvent"
                class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {{ selectedEvent ? 'Update Changes' : 'Add Event' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport> -->
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import CalendarCategoryManagerModal from '@/components/common/CalendarCategoryManagerModal.vue'

import { ref, reactive, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from '@/components/ui/Modal.vue'
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchCategories
} from '@/services/calendar.service'

const currentPageTitle = ref('Kalender HRD')
const calendarRef = ref(null)
const isOpen = ref(false)
const isCategoryModalOpen = ref(false)
const moduleCategories = ref([])
const activeCategoryFilter = ref('ALL')

const selectedEvent = ref(null)
const eventTitle = ref('')
const eventAllDay = ref(false)
const eventDescription = ref('')
const eventLocation = ref('')
const eventMeetingUrl = ref('')
const eventType = ref('')
const eventVisibility = ref('private')
const eventStartDate = ref('')
const eventEndDate = ref('')
const eventLevel = ref('primary')
const events = ref([])

const calendarsEvents = [
  { value: 'primary', label: 'Biru (Primary)' },
  { value: 'success', label: 'Hijau (Success)' },
  { value: 'warning', label: 'Kuning (Warning)' },
  { value: 'danger', label: 'Merah (Urgent)' },
  { value: 'purple', label: 'Ungu (Purple)' },
  { value: 'cyan', label: 'Cyan (Light Blue)' },
  { value: 'indigo', label: 'Indigo (Dark Blue)' },
  { value: 'orange', label: 'Oranye (Orange)' }
]

const getCategoryBadgeClass = (color) => {
  switch (color) {
    case 'danger': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
    case 'warning':
    case 'orange': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
    case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
    case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
    case 'cyan': return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800'
    case 'indigo': return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
    case 'primary':
    default: return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
  }
}

const resModel = 'HR'

const loadCategories = async () => {
  try {
    moduleCategories.value = await fetchCategories(resModel)
  } catch (err) {
    console.error('Failed to load categories', err)
  }
}

const onCategoriesUpdated = (newCats) => {
  moduleCategories.value = newCats
}

const onCategoryChange = () => {
  const selected = moduleCategories.value.find(c => c.name === eventType.value)
  if (selected && selected.color) {
    eventLevel.value = selected.color
  }
}

const displayedEvents = computed(() => {
  if (activeCategoryFilter.value === 'ALL') {
    return events.value
  }
  return events.value.filter(e => e.extendedProps?.event_type === activeCategoryFilter.value)
})

const loadEvents = async () => {
  try {
    const data = await fetchEvents(resModel)
    if (data && data.length > 0) {
      events.value = data.map(e => ({
        id: e.id.toString(),
        title: e.title,
        start: e.start,
        end: e.end ? e.end : '',
        allDay: e.allDay,
        extendedProps: { 
          calendar: e.color || 'primary',
          description: e.description,
          location: e.location,
          meeting_url: e.meeting_url,
          event_type: e.event_type,
          visibility: e.visibility
        }
      }))
    } else {
      const now = new Date()
      const y = now.getFullYear()
      const m = String(now.getMonth() + 1).padStart(2, '0')
      events.value = [
        {
          id: 'hr-1',
          title: '🏖️ Cuti Tahunan: Budi Santoso (3 Hari)',
          start: `${y}-${m}-10`,
          end: `${y}-${m}-13`,
          allDay: true,
          extendedProps: {
            calendar: 'primary',
            event_type: 'Cuti Staf',
            description: 'Pengajuan cuti tahunan disetujui HRD',
            location: 'Jakarta',
            visibility: 'public'
          }
        },
        {
          id: 'hr-2',
          title: '💰 Cut-off Payroll & Absensi Karyawan',
          start: `${y}-${m}-20T17:00:00`,
          allDay: false,
          extendedProps: {
            calendar: 'danger',
            event_type: 'Cut-off Payroll',
            description: 'Batas akhir verifikasi rekapitulasi lembur dan absensi bulanan',
            location: 'Ruang HRD / Finance',
            visibility: 'private'
          }
        },
        {
          id: 'hr-3',
          title: '📋 Wawancara Final: Sr. Go Engineer',
          start: `${y}-${m}-16T14:00:00`,
          end: `${y}-${m}-16T15:30:00`,
          allDay: false,
          extendedProps: {
            calendar: 'warning',
            event_type: 'Wawancara',
            description: 'Wawancara teknis & user dengan Head of Tech',
            location: 'Google Meet',
            meeting_url: 'https://meet.google.com/hr-interview',
            visibility: 'private'
          }
        },
        {
          id: 'hr-4',
          title: '🎂 Ulang Tahun: Siti Nurhaliza (Finance)',
          start: `${y}-${m}-22`,
          allDay: true,
          extendedProps: {
            calendar: 'success',
            event_type: 'Ulang Tahun',
            description: 'Pemberian apresiasi voucher ulang tahun karyawan',
            location: 'Pantry Lt. 2',
            visibility: 'public'
          }
        }
      ]
    }
  } catch (err) {
    console.error('Failed to load events', err)
  }
}

onMounted(() => {
  loadEvents()
  loadCategories()
})

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  resetModalFields()
}

const resetModalFields = () => {
  eventTitle.value = ''
  eventAllDay.value = false
  eventDescription.value = ''
  eventLocation.value = ''
  eventMeetingUrl.value = ''
  eventType.value = ''
  eventVisibility.value = 'private'
  eventStartDate.value = ''
  eventEndDate.value = ''
  eventLevel.value = 'primary'
  selectedEvent.value = null
}

const formatDateTimeLocal = (str) => {
  if (!str) return ''
  if (str.length === 10) return str + 'T00:00'
  return str.substring(0, 16)
}

const handleDateSelect = (selectInfo) => {
  resetModalFields()
  eventStartDate.value = formatDateTimeLocal(selectInfo.startStr)
  eventEndDate.value = selectInfo.endStr ? formatDateTimeLocal(selectInfo.endStr) : formatDateTimeLocal(selectInfo.startStr)
  openModal()
}

const handleEventClick = (clickInfo) => {
  const event = clickInfo.event
  selectedEvent.value = event
  eventTitle.value = event.title
  eventDescription.value = event.extendedProps.description || ''
  eventLocation.value = event.extendedProps.location || ''
  eventMeetingUrl.value = event.extendedProps.meeting_url || ''
  eventType.value = event.extendedProps.event_type || ''
  eventVisibility.value = event.extendedProps.visibility || 'private'
  eventStartDate.value = event.startStr ? formatDateTimeLocal(event.startStr) : ''
  eventEndDate.value = event.endStr ? formatDateTimeLocal(event.endStr) : ''
  eventAllDay.value = event.allDay
  eventLevel.value = event.extendedProps.calendar
  openModal()
}

const handleAddOrUpdateEvent = async () => {
  try {
    const payload = {
      title: eventTitle.value,
      description: eventDescription.value,
      location: eventLocation.value,
      meeting_url: eventMeetingUrl.value,
      event_type: eventType.value,
      visibility: eventVisibility.value,
      start: eventStartDate.value + ':00Z',
      end: eventEndDate.value ? eventEndDate.value + ':00Z' : null,
      color: eventLevel.value,
      res_model: resModel,
      allDay: eventAllDay.value
    }
    
    if (selectedEvent.value) {
      await updateEvent(selectedEvent.value.id, payload)
    } else {
      await createEvent(payload)
    }
    await loadEvents()
    closeModal()
  } catch (err) {
    console.error('Failed to save event', err)
    alert('Gagal menyimpan event')
  }
}

const handleDeleteEvent = async () => {
  if (selectedEvent.value) {
    try {
      await deleteEvent(selectedEvent.value.id)
      await loadEvents()
      closeModal()
    } catch (err) {
      console.error('Failed to delete event', err)
      alert('Gagal menghapus event')
    }
  }
}

const renderEventContent = (eventInfo) => {
  const colorMap = {
    danger: 'bg-rose-500 text-white border border-rose-600',
    warning: 'bg-amber-500 text-white border border-amber-600',
    orange: 'bg-orange-500 text-white border border-orange-600',
    primary: 'bg-brand-500 text-white border border-brand-600',
    success: 'bg-emerald-500 text-white border border-emerald-600',
    purple: 'bg-purple-600 text-white border border-purple-700',
    cyan: 'bg-cyan-600 text-white border border-cyan-700',
    indigo: 'bg-indigo-600 text-white border border-indigo-700'
  }
  const evtColor = eventInfo.event.extendedProps.calendar ? eventInfo.event.extendedProps.calendar.toLowerCase() : 'primary'
  const colorClass = colorMap[evtColor] || colorMap.primary
  
  return {
    html: `
      <div class="flex items-center w-full px-1.5 py-0.5 overflow-hidden rounded-md text-xs font-semibold shadow-sm ${colorClass}">
        ${eventInfo.timeText ? `<span class="mr-1.5 opacity-90 whitespace-nowrap">${eventInfo.timeText}</span>` : ''}
        <span class="truncate whitespace-nowrap">${eventInfo.event.title}</span>
      </div>
    `
  }
}

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next addEventButton',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  events: displayedEvents,
  selectable: true,
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventContent: renderEventContent,
  customButtons: {
    addEventButton: {
      text: 'Add Event +',
      click: openModal
    }
  }
})
</script>
