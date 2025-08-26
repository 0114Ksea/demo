<template>
  <view class="login-container">
    <view class="logo">
      <!-- <image src="/static/logo.png" mode="aspectFit"></image> -->
    </view>
    <view class="form-group">
      <input v-model="phone" type="number" placeholder="请输入手机号" class="input" />
    </view>
    <view class="form-group">
      <input v-model="code" type="number" placeholder="请输入验证码" class="input code-input" />
      <button class="code-btn" @click="sendCode" :disabled="countdown > 0">
        {{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }}
      </button>
    </view>
    <button class="login-btn" @click="login" :disabled="!canLogin">登录</button>
    <view class="link-group">
      <text @click="goToRegister" class="link">注册</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { authService } from '../../utils/mockService.js'

// 页面参数
const phone = ref('')
const code = ref('')
const countdown = ref(0)

// 计算是否可以登录
const canLogin = computed(() => {
  return phone.value.length === 11 && code.value.length > 0
})

// 发送验证码
const sendCode = async () => {
  if (phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  try {
    await authService.sendCode(phone.value)
    uni.showToast({ title: '验证码发送成功', icon: 'success' })
    // 开始倒计时
    startCountdown()
  } catch (error) {
    uni.showToast({ title: error.message || '验证码发送失败', icon: 'none' })
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 登录
const login = async () => {
  if (!canLogin.value) {
    return
  }
  
  try {
    uni.showLoading({ title: '登录中...' })
    const result = await authService.login(phone.value, code.value)
    
    // 保存登录状态
    uni.setStorageSync('token', result.token)
    uni.setStorageSync('userInfo', result.userInfo)
    
    // 更新全局登录状态
    if (result.success) {
  getApp().globalData.isLogin = true
  getApp().globalData.userInfo = result.data.userInfo
  getApp().globalData.role = result.data.userInfo.role
  
  // 保存登录状态到本地存储
  uni.setStorageSync('token', result.data.token)
  uni.setStorageSync('userInfo', result.data.userInfo)
  
  uni.hideLoading()
  uni.showToast({ title: '登录成功', icon: 'success' })
  
  // 统一跳转到服务列表页面
  uni.switchTab({ url: '/pages/customer/services' })
}
    
    uni.hideLoading()
    uni.showToast({ title: '登录成功', icon: 'success' })
    
    // 统一跳转到服务列表页面，因为商家页面不存在
    uni.switchTab({ url: '/pages/customer/services' })
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: error.message || '登录失败', icon: 'none' })
  }
}

// 跳转到注册页面
const goToRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register' })
}
</script>

<style>
.login-container {
  padding: 60rpx 40rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.logo {
  display: flex;
  justify-content: center;
  margin: 40rpx 0;
}

.logo image {
  width: 180rpx;
  height: 180rpx;
}

.form-group {
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
}

.input {
  flex: 1;
  height: 90rpx;
  border: 1px solid #e4e7ed;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.code-input {
  margin-right: 20rpx;
}

.code-btn {
  width: 220rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 26rpx;
  color: #1989fa;
  background-color: transparent;
  border: none;
}

.login-btn {
  height: 96rpx;
  line-height: 96rpx;
  font-size: 32rpx;
  background-color: #1989fa;
  color: #fff;
  border-radius: 48rpx;
  margin-top: 60rpx;
}

.link-group {
  display: flex;
  justify-content: center;
  margin-top: 40rpx;
  font-size: 28rpx;
  color: #666;
}

.link {
  color: #1989fa;
  margin: 0 20rpx;
}

.split {
  color: #e4e7ed;
}
</style>