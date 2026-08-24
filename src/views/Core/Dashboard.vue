
<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <module-metrics />
        <monthly-target />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-sale />
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <customer-demographic />
      </div>

      <div class="col-span-12 xl:col-span-7">
        <recent-orders />
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ModuleMetrics from '@/components/core/CoreMetrics.vue'
import MonthlyTarget from '@/components/core/MonthlySale.vue'
import MonthlySale from '@/components/core/MonthlyTarget.vue'
import CustomerDemographic from '@/components/core/CustomerDemographic.vue'
import StatisticsChart from '@/components/core/StatisticsChart.vue'
import RecentOrders from '@/components/core/RecentOrders.vue'

export default {
  components: {
    AdminLayout,
    'module-metrics': ModuleMetrics,
    MonthlyTarget,
    MonthlySale,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
  },
  name: 'Dashboard Pengaturan',
}
</script>
