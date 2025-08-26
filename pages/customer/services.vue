<template>
  <view class="service-list">
    <view class="header">
      <view class="title">服务列表</view>
    </view>
    
    <!-- 服务列表 -->
    <view class="service-items">
      <block v-if="serviceList.length > 0">
        <view 
          class="service-item" 
          v-for="service in serviceList" 
          :key="service.id"
          @click="navigateToDetail(service.id)"
        >
          <view class="service-image">
            <image :src="service.image" mode="aspectFill"></image>
          </view>
          <view class="service-info">
            <view class="service-name">{{ service.name }}</view>
            <view class="service-desc">{{ service.description }}</view>
            <view class="service-meta">
              <view class="merchant-info">
                <text class="merchant-name">{{ service.merchant.name }}</text>
                <text class="merchant-rating">★ {{ service.merchant.rating }}</text>
              </view>
              <view class="service-stats">
                <text class="duration">{{ service.duration }}分钟</text>
                <text class="sales">销量{{ service.sales }}</text>
              </view>
            </view>
            <view class="service-price">¥{{ service.price }}</view>
          </view>
        </view>
      </block>
      <view v-else class="empty-tip">
        <text>暂无服务</text>
      </view>
    </view>
    
    <!-- 加载中 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
import { serviceService } from '../../utils/mockService.js'

export default {
  data() {
    return {
      serviceList: [],
      loading: true,
      currentPage: 1,
      hasMore: true,
      pageSize: 10
    }
  },
  onLoad() {
    this.fetchServiceList()
  },
  onPullDownRefresh() {
    this.fetchServiceList(1, true)
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.fetchServiceList(this.currentPage + 1)
    }
  },
  methods: {
    async fetchServiceList(page = 1, isRefresh = false) {
      if (this.loading || (!isRefresh && !this.hasMore)) {
        return
      }
      
      this.loading = true
      
      try {
        const res = await serviceService.getServiceList(page, this.pageSize)
        
        if (res.success) {
          const data = res.data
          
          if (isRefresh) {
            this.serviceList = data.list
            this.currentPage = 1
            this.hasMore = data.list.length === this.pageSize
          } else {
            this.serviceList = [...this.serviceList, ...data.list]
            this.currentPage = page
            this.hasMore = data.list.length === this.pageSize
          }
        }
      } catch (error) {
        console.error('获取服务列表失败', error)
        uni.showToast({
          title: '获取服务列表失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    },
    navigateToDetail(serviceId) {
      uni.navigateTo({
        url: `/pages/customer/service-detail?id=${serviceId}`
      })
    }
  }
}
</script>

<style scoped>
.service-list {
  padding-bottom: 100rpx;
}

.header {
  padding: 30rpx 0;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  color: #333;
}

.service-items {
  padding: 20rpx;
}

.service-item {
  display: flex;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.service-image {
  width: 200rpx;
  height: 200rpx;
  margin-right: 24rpx;
  overflow: hidden;
  border-radius: 12rpx;
}

.service-image image {
  width: 100%;
  height: 100%;
}

.service-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.service-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.service-meta {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.merchant-info {
  margin-bottom: 8rpx;
}

.merchant-name {
  margin-right: 16rpx;
}

.merchant-rating {
  color: #FF9500;
}

.service-stats {
  display: flex;
  justify-content: space-between;
}

.service-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #E64340;
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