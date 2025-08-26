<template>
  <view class="orders-page">
    <!-- 订单状态筛选 -->
    <view class="status-filter">
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === '' }" 
        @click="selectStatus('')"
      >
        全部
      </view>
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === 'pending' }" 
        @click="selectStatus('pending')"
      >
        待确认
      </view>
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === 'confirmed' }" 
        @click="selectStatus('confirmed')"
      >
        已确认
      </view>
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === 'completed' }" 
        @click="selectStatus('completed')"
      >
        已完成
      </view>
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === 'canceled' }" 
        @click="selectStatus('canceled')"
      >
        已取消
      </view>
    </view>
    
    <!-- 订单列表 -->
    <view class="order-list">
      <block v-if="orderList.length > 0">
        <view class="order-item" v-for="order in orderList" :key="order.id">
          <!-- 商家信息 -->
          <view class="merchant-info">
            <view class="merchant-name">{{ order.merchantName }}</view>
            <view class="order-status" :class="order.status">
              {{ getStatusText(order.status) }}
            </view>
          </view>
          
          <!-- 服务信息 -->
          <view class="service-info">
            <view class="service-name">{{ order.serviceName }}</view>
            <view class="service-price">¥{{ order.price }}</view>
          </view>
          
          <!-- 预约信息 -->
          <view class="booking-info">
            <view class="booking-date">预约日期：{{ formatDate(order.date) }}</view>
            <view class="booking-time">预约时间：{{ order.time }}</view>
            <view class="contact-info">联系人：{{ order.contactName }}（{{ order.contactPhone }}）</view>
          </view>
          
          <!-- 订单操作 -->
          <view class="order-actions" v-if="order.status === 'pending'">
            <u-button @click="cancelOrder(order.id)" type="text" class="cancel-btn">取消预约</u-button>
          </view>
          
          <view class="order-actions" v-else-if="order.status === 'confirmed'">
            <u-button @click="contactMerchant(order)" type="text" class="contact-btn">联系商家</u-button>
          </view>
          
          <view class="order-actions" v-else-if="order.status === 'completed'">
            <u-button @click="viewService(order.serviceId)" type="text" class="view-btn">查看服务</u-button>
          </view>
        </view>
      </block>
      <view v-else class="empty-tip">
        <text>暂无订单</text>
      </view>
    </view>
    
    <!-- 加载中 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { orderService } from '../../utils/mockService.js'

const orderList = ref([])
const loading = ref(false)
const selectedStatus = ref('')
const currentUser = ref(null)

// 格式化日期显示
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    canceled: '已取消'
  }
  return statusMap[status] || status
}

// 获取订单列表
const fetchOrderList = async (status = '') => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const res = await orderService.getMyOrders(status)
    
    if (res.success) {
      orderList.value = res.data.list || res.data
    } else {
      orderList.value = []
      uni.showToast({ title: '获取订单列表失败', icon: 'none' })
    }
  } catch (error) {
    console.error('获取订单列表失败', error)
    uni.showToast({ title: '获取订单列表失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 选择状态
const selectStatus = (status) => {
  selectedStatus.value = status
  fetchOrderList(status)
}

// 取消订单
const cancelOrder = async (orderId) => {
  uni.showModal({
    title: '取消预约',
    content: '确定要取消此预约吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await orderService.updateOrderStatus(orderId, 'canceled')
          if (result.success) {
            uni.showToast({ title: '取消成功', icon: 'success' })
            // 刷新订单列表
            fetchOrderList(selectedStatus.value)
          } else {
            uni.showToast({ title: result.message || '取消失败', icon: 'none' })
          }
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' })
        }
      }
    }
  })
}

// 联系商家
const contactMerchant = (merchantId) => {
  uni.makePhoneCall({
    phoneNumber: '400-123-4567', // 模拟商家电话
    success: () => {
      console.log('拨打电话成功')
    },
    fail: () => {
      console.log('拨打电话失败')
    }
  })
}

// 查看服务详情
const viewService = (serviceId) => {
  uni.navigateTo({
    url: `/pages/customer/service-detail?id=${serviceId}`
  })
}

// 使用watchEffect替代onLoad，在组件初始化时执行
watchEffect(() => {
  fetchOrderList()
})

// 直接定义onShow函数，不需要从vue导入
onShow(() => {
  fetchOrderList(selectedStatus.value)
})
</script>

<style scoped>
.orders-page {
  padding-bottom: 20rpx;
}

.status-filter {
  display: flex;
  background-color: #fff;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
  overflow-x: auto;
}

.filter-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666;
  min-width: 140rpx;
}

.filter-item.active {
  color: #1989fa;
  font-weight: bold;
  border-bottom: 4rpx solid #1989fa;
}

.order-list {
  padding: 20rpx;
}

.order-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.merchant-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.merchant-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.order-status {
  font-size: 26rpx;
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
}

.order-status.pending {
  background-color: #fff0e6;
  color: #ff6b3b;
}

.order-status.confirmed {
  background-color: #e6f7ff;
  color: #1890ff;
}

.order-status.completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.order-status.canceled {
  background-color: #f5f5f5;
  color: #999;
}

.service-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 20rpx;
}

.service-name {
  font-size: 28rpx;
  color: #333;
}

.service-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #E64340;
}

.booking-info {
  margin-bottom: 20rpx;
}

.booking-date,
.booking-time,
.contact-info {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.cancel-btn {
  color: #999;
  border: 1rpx solid #ddd;
}

.contact-btn {
  color: #1989fa;
  border: 1rpx solid #1989fa;
}

.view-btn {
  color: #1989fa;
}

.empty-tip {
  padding: 100rpx 0;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}

.loading {
  padding: 20rpx 0;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}
</style>