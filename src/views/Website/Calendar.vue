<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <!-- Quick Appointment & Interview Booking Bar -->
    <div class="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h4 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📅 Penjadwalan Wawancara & Reservasi Mandiri (Odoo Appointments)</span>
          <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Tersinkronisasi HRD</span>
        </h4>
        <p class="text-xs text-gray-500 mt-0.5">
          Atur slot interview pelamar rekrutmen atau reservasi sesi konsultasi demo ERP B2B secara terpusat.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="openAppointmentModal('interview')"
          class="rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all"
        >
          + Slot Wawancara Pelamar
        </button>
        <button
          @click="openAppointmentModal('meeting')"
          class="rounded-xl border border-gray-300 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
        >
          + Reservasi Konsultasi B2B
        </button>
      </div>
    </div>

    <div
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="custom-calendar">
        <FullCalendar ref="calendarRef" class="min-h-screen" :options="calendarOptions" />
      </div>

      <!-- Modal -->
      <Modal v-if="isOpen" @close="closeModal">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
          >
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

                <div class="mt-4">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
                  <textarea v-model="eventDescription" class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" rows="3"></textarea>
                </div>
                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Location</label>
                    <input v-model="eventLocation" type="text" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Meeting URL</label>
                    <input v-model="eventMeetingUrl" type="url" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" />
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Event Type</label>
                    <input v-model="eventType" type="text" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Visibility</label>
                    <select v-model="eventVisibility" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
                      <option value="private">Private</option>
                      <option value="public">Public</option>
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

const currentPageTitle = ref('Kalender Website')
import { ref, reactive, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
  import listPlugin from '@fullcalendar/list'
import Modal from '@/components/ui/Modal.vue'
  import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/services/calendar.service'

const calendarRef = ref(null)
const isOpen = ref(false)
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
    { value: 'danger', label: 'Urgent' },
    { value: 'warning', label: 'Penting' },
    { value: 'primary', label: 'Normal' },
    { value: 'success', label: 'Info' }
  ]

const resModel = 'Website';
  const loadEvents = async () => {
    try {
      const data = await fetchEvents(resModel);
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
    } catch (err) {
      console.error('Failed to load events', err);
    }
  }

  onMounted(() => {
    loadEvents();
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
      danger: 'bg-error-500 text-white border border-error-600',
      warning: 'bg-orange-500 text-white border border-orange-600',
      primary: 'bg-brand-500 text-white border border-brand-600',
      success: 'bg-success-500 text-white border border-success-600'
    };
    const evtColor = eventInfo.event.extendedProps.calendar ? eventInfo.event.extendedProps.calendar.toLowerCase() : 'primary';
    const colorClass = colorMap[evtColor] || colorMap.primary;
    
    return {
      html: `
        <div class="flex items-center w-full px-1.5 py-0.5 overflow-hidden rounded-md text-xs font-semibold shadow-sm ${colorClass}">
          ${eventInfo.timeText ? `<span class="mr-1.5 opacity-90 whitespace-nowrap">${eventInfo.timeText}</span>` : ''}
          <span class="truncate whitespace-nowrap">${eventInfo.event.title}</span>
        </div>
      `,
    }
  }

  const calendarOptions = reactive({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next addEventButton',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    events: events,
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
        click: openModal,
      },
    },
  })
</script>
