<template>
  <view class="service-detail">
    <!-- 服务图片轮播 -->
    <view class="service-images">
      <image :src="service.image" mode="aspectFill"></image>
    </view>
    
    <!-- 服务基本信息 -->
    <view class="service-basic-info">
      <view class="service-name">{{ service.name }}</view>
      <view class="service-price">¥{{ service.price }}</view>
      <view class="service-stats">
        <text class="sales">销量 {{ service.sales }}</text>
        <text class="rating">评分 {{ service.merchant.rating }}</text>
        <text class="duration">{{ service.duration }}分钟</text>
      </view>
    </view>
    
    <!-- 商家信息 -->
    <view class="merchant-info">
      <view class="merchant-header">
        <text class="merchant-name">{{ service.merchant.name }}</text>
        <text class="merchant-rating">★ {{ service.merchant.rating }}</text>
      </view>
    </view>
    
    <!-- 服务详情 -->
    <view class="service-description">
      <view class="section-title">服务详情</view>
      <view class="description-content">{{ service.description }}</view>
    </view>
    
    <!-- 底部预约栏 -->
    <view class="bottom-bar">
      <view class="bottom-left">
        <view class="price">¥{{ service.price }}</view>
        <text class="unit">/次</text>
      </view>
      <view class="bottom-right">
        <u-button :loading="isFavoriteLoading" @click="toggleFavorite" type="text" class="favorite-btn">
          <text :class="isFavorite ? 'active' : ''">★</text>
          <text>{{ isFavorite ? '已收藏' : '收藏' }}</text>
        </u-button>
        <u-button :loading="bookingLoading" @click="goToBooking" type="primary" class="booking-btn">立即预约</u-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { serviceService, favoriteService } from '../../utils/mockService.js'

const service = ref({
  id: '',
  name: '',
  price: 0,
  duration: 0,
  image: '',
  description: '',
  merchant: {
    id: '',
    name: '',
    rating: 0
  },
  sales: 0
})

const loading = ref(false)
const bookingLoading = ref(false)
const isFavorite = ref(false)
const isFavoriteLoading = ref(false)
const currentUser = ref(null)

// 获取服务详情
const fetchServiceDetail = async (serviceId) => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const res = await serviceService.getServiceDetail(serviceId)
    if (res.success) {
      service.value = res.data
      
      // 检查是否已收藏
      await checkFavoriteStatus(serviceId)
    } else {
      uni.showToast({ title: '获取服务详情失败', icon: 'none' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } catch (error) {
    console.error('获取服务详情失败', error)
    uni.showToast({ title: '获取服务详情失败', icon: 'none' })
    loading.value = false
  } finally {
    loading.value = false
  }
}

// 检查收藏状态
const checkFavoriteStatus = async (serviceId) => {
  try {
    const app = getApp()
    if (app.globalData.isLogin && app.globalData.userInfo) {
      const res = await favoriteService.checkFavorite(serviceId)
      isFavorite.value = res.success && res.data
    }
  } catch (error) {
    console.error('检查收藏状态失败', error)
  }
}

// 切换收藏状态
const toggleFavorite = async () => {
  if (isFavoriteLoading.value) return
  
  const app = getApp()
  if (!app.globalData.isLogin) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/auth/login' })
    }, 1000)
    return
  }
  
  isFavoriteLoading.value = true
  
  try {
    const res = await favoriteService.toggleFavorite(service.value.id)
    if (res.success) {
      isFavorite.value = res.data
      uni.showToast({
        title: isFavorite.value ? '收藏成功' : '取消收藏',
        icon: 'success'
      })
    } else {
      uni.showToast({ title: res.message || '操作失败', icon: 'none' })
    }
  } catch (error) {
    console.error('操作失败', error)
    uni.showToast({ title: '操作失败', icon: 'none' })
  } finally {
    isFavoriteLoading.value = false
  }
}

// 跳转到预约页面
const goToBooking = async () => {
  if (bookingLoading.value) return
  
  bookingLoading.value = true
  
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
    
    // 跳转到预约页面
    uni.navigateTo({
      url: `/pages/customer/booking?id=${service.value.id}`
    })
  } catch (error) {
    console.error('跳转失败', error)
  } finally {
    bookingLoading.value = false
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

// 页面显示时刷新收藏状态
onShow(() => {
  if (service.value.id) {
    checkFavoriteStatus(service.value.id)
  }
})
</script>

<style scoped>
.service-detail {
  padding-bottom: 120rpx;
}

.service-images {
  width: 100%;
  height: 400rpx;
  background-color: #f5f5f5;
  overflow: hidden;
}

.service-images image {
  width: 100%;
  height: 100%;
}

.service-basic-info {
  padding: 30rpx 20rpx;
  background-color: #fff;
}

.service-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.service-price {
  font-size: 42rpx;
  font-weight: bold;
  color: #E64340;
  margin-bottom: 16rpx;
}

.service-stats {
  display: flex;
  font-size: 26rpx;
  color: #999;
}

.service-stats text {
  margin-right: 30rpx;
}

.merchant-info {
  padding: 20rpx;
  margin-top: 20rpx;
  background-color: #fff;
}

.merchant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.merchant-name {
  font-size: 30rpx;
  color: #333;
}

.merchant-rating {
  font-size: 26rpx;
  color: #FF9500;
}

.service-description {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #fff;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.description-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}

.bottom-left {
  flex: 1;
  display: flex;
  align-items: baseline;
}

.price {
  font-size: 42rpx;
  font-weight: bold;
  color: #E64340;
}

.unit {
  font-size: 26rpx;
  color: #999;
  margin-left: 8rpx;
}

.bottom-right {
  display: flex;
  align-items: center;
}

.favorite-btn {
  color: #999;
  margin-right: 20rpx;
}

.favorite-btn .active {
  color: #FF9500;
}

.booking-btn {
  width: 280rpx;
}
</style>```