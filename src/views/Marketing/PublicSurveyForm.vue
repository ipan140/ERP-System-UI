<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 font-sans">
    <!-- Main Card Container -->
    <div class="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
      
      <!-- Top Brand Header Banner -->
      <div class="bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 p-6 sm:p-8 text-white relative">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <span>✨</span> Kuesioner Kepuasan Layanan
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">{{ survey?.title || 'Survei Kepuasan Pelanggan' }}</h1>
        <p class="mt-2 text-sm sm:text-base text-teal-50 leading-relaxed max-w-md">
          {{ survey?.description || 'Terima kasih atas kepercayaan Anda. Pendapat Anda sangat berharga untuk peningkatan kualitas layanan kami ke depan.' }}
        </p>
      </div>

      <!-- State Loading / Error -->
      <div v-if="isLoading" class="p-10 text-center space-y-3">
        <div class="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-sm text-slate-400">Memuat form survei...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center space-y-4">
        <div class="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-rose-500/20">
          ⚠️
        </div>
        <h3 class="text-lg font-bold text-white">Survei Tidak Tersedia</h3>
        <p class="text-sm text-slate-400 max-w-md mx-auto">{{ error }}</p>
      </div>

      <div v-else-if="submitted" class="p-8 sm:p-12 text-center space-y-5 animate-in fade-in zoom-in duration-300">
        <div class="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl border border-emerald-500/20 shadow-lg shadow-emerald-950">
          ✓
        </div>
        <h2 class="text-2xl font-extrabold text-white">Terima Kasih Banyak!</h2>
        <p class="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Suara Anda telah berhasil terekam secara real-time ke dalam sistem ERP kami. Respon Anda sangat berarti bagi komitmen kami untuk terus berkembang.
        </p>
        <div class="pt-4">
          <button
            @click="resetForm"
            class="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            Kirim Respon Lain
          </button>
        </div>
      </div>

      <!-- Survey Active Form -->
      <div v-else class="p-6 sm:p-8 space-y-6">
        <!-- Opsi Buka Google Form Langsung jika ditautkan -->
        <div v-if="survey?.gform_url" class="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl shrink-0">
              📋
            </div>
            <div>
              <h4 class="text-sm font-bold text-amber-300">Tersedia di Google Forms</h4>
              <p class="text-xs text-amber-200/80">Anda juga dapat mengisi kuesioner lengkap di Google Forms.</p>
            </div>
          </div>
          <a
            :href="survey.gform_url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl whitespace-nowrap transition shadow"
          >
            Buka G-Form ↗
          </a>
        </div>

        <form @submit.prevent="submitResponse" class="space-y-6">
          <!-- Pertanyaan Net Promoter Score (NPS 0-10) -->
          <div class="space-y-3">
            <div class="flex justify-between items-baseline">
              <label class="text-sm sm:text-base font-bold text-white block">
                Seberapa besar kemungkinan Anda merekomendasikan kami kepada rekan atau mitra bisnis Anda?
              </label>
            </div>
            <p class="text-xs text-slate-400">Skala 0 (Sangat Tidak Mungkin) sampai 10 (Sangat Merekomendasikan)</p>

            <!-- Skor 0 s.d 10 Selector Pills -->
            <div class="grid grid-cols-11 gap-1 sm:gap-1.5 pt-2">
              <button
                v-for="score in 11"
                :key="score - 1"
                type="button"
                @click="selectedRating = score - 1"
                :class="[
                  selectedRating === score - 1
                    ? (score - 1 >= 9 ? 'bg-emerald-500 text-white ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30' : score - 1 >= 7 ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 shadow-lg shadow-amber-500/30' : 'bg-rose-500 text-white ring-2 ring-rose-400 shadow-lg shadow-rose-500/30')
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80',
                  'py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-extrabold transition-all text-center flex items-center justify-center cursor-pointer'
                ]"
              >
                {{ score - 1 }}
              </button>
            </div>

            <!-- Keterangan Skala NPS -->
            <div class="flex justify-between text-[11px] font-semibold text-slate-500 pt-1 px-1">
              <span class="text-rose-400/90">0: Sangat Kurang</span>
              <span class="text-amber-400/90">7-8: Cukup Netral</span>
              <span class="text-emerald-400/90">9-10: Sangat Puas</span>
            </div>
          </div>

          <!-- Feedback Tambahan / Kotak Saran -->
          <div class="space-y-2 pt-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Catatan atau Masukan untuk Layanan Kami (Opsional)
            </label>
            <textarea
              v-model="feedbackText"
              rows="3"
              placeholder="Ceritakan pengalaman Anda bersama kami..."
              class="w-full rounded-2xl border border-slate-700/80 bg-slate-950/60 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="selectedRating === null || isSubmitting"
              class="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 py-3.5 px-5 text-sm font-bold text-white shadow-xl shadow-teal-500/20 hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <span v-if="!isSubmitting">Kirim Jawaban Survei 🚀</span>
              <span v-else class="flex items-center gap-2">
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Mengirim Respon...
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- Footer Branding -->
      <div class="bg-slate-950/70 p-4 text-center border-t border-slate-800 text-xs text-slate-500">
        Enterprise Feedback Management System &bull; Powered by ERP System
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { surveysService } from '@/services/marketing/surveys.service'

const route = useRoute()
const surveyId = ref<string>((route.params.id as string) || '1')

const survey = ref<any>(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const submitted = ref(false)

const selectedRating = ref<number | null>(null)
const feedbackText = ref('')

const fetchPublicSurvey = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await surveysService.getPublicSurvey(surveyId.value)
    survey.value = data
    if (data.state === 'closed') {
      error.value = 'Mohon maaf, kuesioner survei ini telah ditutup oleh administrator.'
    }
  } catch (err: any) {
    error.value = 'Survei tidak ditemukan atau link sudah tidak berlaku.'
  } finally {
    isLoading.value = false
  }
}

const submitResponse = async () => {
  if (selectedRating.value === null) {
    alert('Silakan pilih salah satu nilai kepuasan (0 s.d. 10).')
    return
  }

  isSubmitting.value = true
  try {
    await surveysService.submitPublicResponse(surveyId.value, selectedRating.value, feedbackText.value)
    submitted.value = true
  } catch (err: any) {
    alert('Gagal mengirim respon: ' + (err.response?.data?.message || err.message))
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  selectedRating.value = null
  feedbackText.value = ''
  submitted.value = false
}

onMounted(() => {
  fetchPublicSurvey()
})
</script>