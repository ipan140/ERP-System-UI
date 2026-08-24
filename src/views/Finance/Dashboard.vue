
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
import ModuleMetrics from '@/components/finance/FinanceMetrics.vue'
import MonthlyTarget from '@/components/finance/MonthlySale.vue'
import MonthlySale from '@/components/finance/MonthlyTarget.vue'
import CustomerDemographic from '@/components/finance/CustomerDemographic.vue'
import StatisticsChart from '@/components/finance/StatisticsChart.vue'
import RecentOrders from '@/components/finance/RecentOrders.vue'

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
  name: 'DashboardFinance',
}
</script>
