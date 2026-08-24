
<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
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
import SalesMetrics from '@/components/sales/SalesMetrics.vue'
import MonthlyTarget from '@/components/sales/MonthlySale.vue'
import MonthlySale from '@/components/sales/MonthlyTarget.vue'
import CustomerDemographic from '@/components/sales/CustomerDemographic.vue'
import StatisticsChart from '@/components/sales/StatisticsChart.vue'
import RecentOrders from '@/components/sales/RecentOrders.vue'

export default {
  components: {
    AdminLayout,
    'ecommerce-metrics': SalesMetrics,
    MonthlyTarget,
    MonthlySale,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
  },
  name: 'DashboardSales',
}
</script>
