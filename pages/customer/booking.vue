<template>
  <view class="booking-page">
    <!-- 服务信息 -->
    <view class="service-info">
      <view class="service-name">{{ service.name }}</view>
      <view class="service-meta">
        <text class="merchant-name">{{ service.merchant.name }}</text>
        <text class="service-price">¥{{ service.price }}</text>
      </view>
    </view>
    
    <!-- 预约信息表单 -->
    <view class="booking-form">
      <!-- 选择日期 -->
      <view class="form-item">
        <view class="label">预约日期</view>
        <u-datetime-picker 
          v-model="dateTime" 
          mode="date" 
          :min-date="minDate" 
          :max-date="maxDate" 
          @confirm="handleDateConfirm"
          placeholder="请选择预约日期"
        ></u-datetime-picker>
      </view>
      
      <!-- 选择时间段 -->
      <view class="form-item">
        <view class="label">预约时间</view>
        <view class="time-slots" v-if="availableSlots.length > 0">
          <view 
            class="time-slot" 
            v-for="slot in availableSlots" 
            :key="slot.time"
            :class="{ 'selected': selectedSlot === slot.time }"
            @click="selectTimeSlot(slot.time)"
          >
            {{ slot.time }}
          </view>
        </view>
        <view v-else class="no-slots">
          <text>暂无可用时间段</text>
        </view>
      </view>
      
      <!-- 预约备注 -->
      <view class="form-item">
        <view class="label">备注信息</view>
        <u-input 
          v-model="remark" 
          type="textarea" 
          placeholder="请输入备注信息（选填）" 
          maxlength="200"
          show-word-limit
        ></u-input>
      </view>
      
      <!-- 预约人信息 -->
      <view class="form-item">
        <view class="label">联系人</view>
        <u-input 
          v-model="contactName" 
          placeholder="请输入联系人姓名"
          maxlength="20"
        ></u-input>
      </view>
      
      <view class="form-item">
        <view class="label">联系电话</view>
        <u-input 
          v-model="contactPhone" 
          type="number" 
          placeholder="请输入联系电话"
          maxlength="11"
        ></u-input>
      </view>
    </view>
    
    <!-- 底部提交按钮 -->
    <view class="bottom-bar">
      <u-button :loading="submitLoading" @click="submitBooking" type="primary" class="submit-btn">确认预约</u-button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { serviceService, orderService } from '../../utils/mockService.js'

const service = ref({
  id: '',
  name: '',
  price: 0,
  duration: 0,
  merchant: {
    id: '',
    name: ''
  }
})

const loading = ref(false)
const submitLoading = ref(false)
const dateTime = ref('')
const selectedDate = ref('')
const selectedSlot = ref('')
const remark = ref('')
const contactName = ref('')
const contactPhone = ref('')
const availableSlots = ref([])

// 计算最小和最大可预约日期
const minDate = ref(new Date())
const maxDate = ref(() => {
  const date = new Date()
  date.setDate(date.getDate() + 30) // 最多可预约30天内
  return date
})()

// 生成可用时间段（模拟数据）
const generateTimeSlots = (date) => {
  // 模拟数据：上午10点到下午8点，每30分钟一个时间段
  const slots = []
  const startHour = 10
  const endHour = 20
  const intervalMinutes = 30
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += intervalMinutes) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      slots.push({
        time: timeStr,
        available: true // 模拟所有时间段都可用
      })
    }
  }
  
  return slots
}

// 获取服务详情
const fetchServiceDetail = async (serviceId) => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const res = await serviceService.getServiceDetail(serviceId)
    if (res.success) {
      service.value = res.data
    } else {
      uni.showToast({ title: '获取服务详情失败', icon: 'none' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } catch (error) {
    console.error('获取服务详情失败', error)
    uni.showToast({ title: '获取服务详情失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 选择日期
const selectDate = (date) => {
  selectedDate.value = date
  // 生成对应日期的可用时间段
  availableSlots.value = generateTimeSlots(date)
  // 重置选中的时间段
  selectedSlot.value = ''
}

// 选择时间段
const selectSlot = (slot) => {
  if (!slot.available) return
  selectedSlot.value = slot.time
  // 设置完整的预约时间
  dateTime.value = `${selectedDate.value} ${selectedSlot.value}`
}

// 提交预约
const submitBooking = async () => {
  if (submitLoading.value) return
  
  // 表单验证
  if (!selectedDate.value) {
    uni.showToast({ title: '请选择预约日期', icon: 'none' })
    return
  }
  
  if (!selectedSlot.value) {
    uni.showToast({ title: '请选择预约时间段', icon: 'none' })
    return
  }
  
  if (!contactName.value.trim()) {
    uni.showToast({ title: '请输入联系人姓名', icon: 'none' })
    return
  }
  
  if (!contactPhone.value || contactPhone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的联系电话', icon: 'none' })
    return
  }
  
  submitLoading.value = true
  
  try {
    // 检查登录状态
    const app = getApp()
    if (!app.globalData.isLogin) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/auth/login' })
      }, 1000)
      return
    }
    
    // 提交预约信息
    const bookingData = {
      serviceId: service.value.id,
      bookingTime: dateTime.value,
      contactName: contactName.value,
      contactPhone: contactPhone.value,
      remark: remark.value
    }
    
    const res = await orderService.createBooking(bookingData)
    if (res.success) {
      uni.showToast({ title: '预约成功', icon: 'success' })
      // 预约成功后跳转到订单列表
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/customer/orders'
        })
      }, 1500)
    } else {
      uni.showToast({ title: res.message || '预约失败', icon: 'none' })
    }
  } catch (error) {
    console.error('预约失败', error)
    uni.showToast({ title: '预约失败', icon: 'none' })
  } finally {
    submitLoading.value = false
  }
}

// 页面加载时获取服务详情
onLoad((options) => {
  if (options && options.id) {
    fetchServiceDetail(options.id)
  } else {
    uni.showToast({ title: '参数错误', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>

<style scoped>
.booking-page {
  padding-bottom: 120rpx;
}

.service-info {
  padding: 30rpx 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.service-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
}

.merchant-name {
  color: #666;
}

.service-price {
  color: #E64340;
  font-weight: bold;
}

.booking-form {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #fff;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.time-slot {
  padding: 16rpx 28rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.time-slot.selected {
  background-color: #1989fa;
  color: #fff;
}

.no-slots {
  padding: 40rpx 0;
  text-align: center;
  color: #999;
  font-size: 26rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.submit-btn {
  width: 100%;
}
</style>```