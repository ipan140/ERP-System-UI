<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Module Header Banner & Category Legend -->
    <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
      <div>
        <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="p-1.5 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 text-sm">🌐</span>
          Kalender Portal Web, Konten & Reservasi Mandiri (Appointments & CMS)
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Jadwal publikasi artikel blog, sesi mentoring live LMS, reservasi demo konsultasi B2B, dan jadwal rilis fitur web.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="openAppointmentModal('interview')"
          class="rounded-xl bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all flex items-center gap-1"
        >
          <span>💼</span> + Slot Wawancara
        </button>
        <button
          @click="openAppointmentModal('meeting')"
          class="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 flex items-center gap-1"
        >
          <span>🤝</span> + Reservasi B2B
        </button>
      </div>
    </div>

    <!-- Interactive Category Filter Chips & Legend -->
    <div class="mb-4 flex flex-wrap items-center gap-1.5 text-xs">
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
              {{ selectedEvent ? 'Edit Agenda Portal Web' : 'Tambah Agenda Portal Web' }}
            </h5>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Jadwalkan jadwal publikasi konten, webinar LMS, jadwal appointment klien, atau pemeliharaan portal web.
            </p>

            <div class="mt-8">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Judul Acara / Agenda Portal
                </label>
                <input
                  v-model="eventTitle"
                  type="text"
                  placeholder="Contoh: Publikasi Blog ERP / Sesi Live LMS / Demo Konsultasi B2B"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

                <div class="mt-4">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Deskripsi / Detail Sesi</label>
                  <textarea v-model="eventDescription" placeholder="Catatan materi, nama pemateri / kandidat / prospek, atau catatan rilis fitur" class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" rows="3"></textarea>
                </div>
                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Lokasi / Kanal</label>
                    <input v-model="eventLocation" placeholder="Portal Web / Zoom / Google Meet" type="text" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Tautan Web / Rapat</label>
                    <input v-model="eventMeetingUrl" placeholder="https://meet.google.com/sesi-web" type="url" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" />
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Kategori Portal Web</label>
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
                      <option value="private">Privat (Internal Admin)</option>
                      <option value="public">Publik (Tampil di Jadwal Tim)</option>
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

const currentPageTitle = ref('Kalender Website')
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

const resModel = 'Website'

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
      const data = await fetchEvents(resModel);
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
        }));
      } else {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        events.value = [
          {
            id: 'web-1',
            title: '📝 Publikasi Blog: Panduan Implementasi ERP Terintegrasi 2026',
            start: `${y}-${m}-08T10:00:00`,
            allDay: false,
            extendedProps: {
              calendar: 'primary',
              event_type: 'Artikel Blog',
              description: 'Artikel teknis SEO 2.500 kata untuk meningkatkan ranking pencarian organik',
              location: 'CMS Portal Blog',
              meeting_url: 'https://perusahaan.com/blog/panduan-erp-2026',
              visibility: 'public'
            }
          },
          {
            id: 'web-2',
            title: '🎓 Live Mentoring LMS: Bedah Sistem Akuntansi & Pajak Bisnis',
            start: `${y}-${m}-16T19:00:00`,
            end: `${y}-${m}-16T21:00:00`,
            allDay: false,
            extendedProps: {
              calendar: 'purple',
              event_type: 'Mentoring Live LMS',
              description: 'Kelas live interaktif via Zoom untuk peserta kursus sertifikasi akuntansi',
              location: 'Zoom LMS Classroom',
              meeting_url: 'https://zoom.us/j/lms-live-classroom',
              visibility: 'public'
            }
          },
          {
            id: 'web-3',
            title: '🤝 Reservasi Mandiri B2B: Konsultasi Fitur dengan PT Tri Mandiri',
            start: `${y}-${m}-18T14:00:00`,
            end: `${y}-${m}-18T15:30:00`,
            allDay: false,
            extendedProps: {
              calendar: 'success',
              event_type: 'Demo Konsultasi B2B',
              description: 'Booking appointment via portal website oleh prospek enterprise',
              location: 'Google Meet',
              meeting_url: 'https://meet.google.com/b2b-demo-online',
              visibility: 'public'
            }
          },
          {
            id: 'web-4',
            title: '🚀 Rilis & Update Portal Web: Fitur Self-Service Customer',
            start: `${y}-${m}-29T22:00:00`,
            allDay: false,
            extendedProps: {
              calendar: 'danger',
              event_type: 'Rilis Fitur Web',
              description: 'Deployment pembaruan portal pelanggan untuk tracking pesanan & unduh e-faktur',
              location: 'Production Server CI/CD',
              visibility: 'private'
            }
          }
        ];
      }
    } catch (err) {
      console.error('Failed to load events', err);
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

const openAppointmentModal = (type) => {
  resetModalFields()
  const now = new Date()
  const pad = (n) => n.toString().padStart(2, '0')
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours() + 1)}:00`
  const endStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours() + 2)}:00`

  if (type === 'interview') {
    eventTitle.value = 'Wawancara HR: Kandidat Rekrutmen'
    eventDescription.value = 'Sesi interview tahap 2 dengan Tim HRD & Lead Divisi via Google Meet.'
    eventLocation.value = 'Online / Ruang Meeting HR Lantai 2'
    eventMeetingUrl.value = 'https://meet.google.com/erp-interview-hrd'
    eventType.value = 'Interview'
    eventLevel.value = 'primary'
  } else {
    eventTitle.value = 'Demo ERP & Konsultasi B2B Klien'
    eventDescription.value = 'Presentasi alur sistem ERP Odoo & Mekari untuk klien enterprise 100+ karyawan.'
    eventLocation.value = 'Zoom Enterprise / Boardroom'
    eventMeetingUrl.value = 'https://zoom.us/j/981293819'
    eventType.value = 'Client Meeting'
    eventLevel.value = 'success'
  }
  eventStartDate.value = dateStr
  eventEndDate.value = endStr
  openModal()
}


  const formatDateTimeLocal = (str) => {
    if (!str) return '';
    if (str.length === 10) return str + 'T00:00';
    return str.substring(0, 16);
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
      };
      
      if (selectedEvent.value) {
        await updateEvent(selectedEvent.value.id, payload);
      } else {
        await createEvent(payload);
      }
      await loadEvents();
      closeModal();
    } catch (err) {
      console.error('Failed to save event', err);
      alert('Gagal menyimpan event');
    }
  }
const handleDeleteEvent = async () => {
    if (selectedEvent.value) {
      try {
        await deleteEvent(selectedEvent.value.id);
        await loadEvents();
        closeModal();
      } catch (err) {
        console.error('Failed to delete event', err);
        alert('Gagal menghapus event');
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
