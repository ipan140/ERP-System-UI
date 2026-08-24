
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
import ModuleMetrics from '@/components/website/WebsiteMetrics.vue'
import MonthlyTarget from '@/components/website/MonthlySale.vue'
import MonthlySale from '@/components/website/MonthlyTarget.vue'
import CustomerDemographic from '@/components/website/CustomerDemographic.vue'
import StatisticsChart from '@/components/website/StatisticsChart.vue'
import RecentOrders from '@/components/website/RecentOrders.vue'

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
  name: 'DashboardWebsite',
}
</script>
