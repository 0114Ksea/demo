<template>
  <view class="container">
    <view class="logo-container">
      <!-- <image class="logo" src="/static/logo.png"></image> -->
      <view class="title">账号注册</view>
    </view>
    
    <view class="form-container">
      <!-- 使用普通的input组件代替u-input，确保兼容性 -->
      <input v-model="phone" placeholder="请输入手机号码" type="number" maxlength="11" class="custom-input" />
      
      <view class="code-input-container">
        <input v-model="code" placeholder="请输入验证码" type="number" maxlength="6" class="custom-input code-input" />
        <button :disabled="countDown > 0" @click="sendCode" class="code-btn">{{ countDown > 0 ? `${countDown}秒后重发` : '获取验证码' }}</button>
      </view>
      
      <button @click="register" class="register-btn">注册并登录</button>
      
      <view class="role-selector">
        <text :class="[role === 'customer' ? 'active' : '']" @click="selectRole('customer')">顾客</text>
        <text class="divider">|</text>
        <text :class="[role === 'merchant' ? 'active' : '']" @click="selectRole('merchant')">商家</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '../../utils/mockService.js'

const phone = ref('')
const code = ref('')
const countDown = ref(0)
const role = ref('customer') // 默认顾客注册

// 发送验证码
const sendCode = async () => {
  // 验证手机号
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return
  }
  
  try {
    // 调用发送验证码服务
    const res = await authService.sendCode(phone.value)
    if (res.success) {
      uni.showToast({ title: '验证码发送成功' })
      // 开始倒计时
      startCountDown()
    } else {
      uni.showToast({ title: res.message || '发送失败', icon: 'none' })
    }
  } catch (error) {
    console.error('发送验证码失败', error)
    uni.showToast({ title: '发送失败，请重试', icon: 'none' })
  }
}

// 倒计时函数
const startCountDown = () => {
  countDown.value = 60
  const timer = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 注册函数
const register = async () => {
  // 验证表单
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return
  }
  
  if (!code.value || code.value.length !== 6) {
    uni.showToast({ title: '请输入6位验证码', icon: 'none' })
    return
  }
  
  try {
    // 调用注册服务
    const res = await authService.register(phone.value, code.value, role.value)
    if (res.success) {
      // 设置全局登录状态
      const app = getApp()
      app.globalData.isLogin = true
      app.globalData.userInfo = res.data.userInfo
      app.globalData.role = res.data.userInfo.role
      
      // 保存登录状态到本地存储
      uni.setStorageSync('token', res.data.token)
      uni.setStorageSync('userInfo', res.data.userInfo)
      
      uni.showToast({ title: '注册成功' })
      
      // 统一跳转到服务列表页面，因为商家页面不存在
      setTimeout(() => {
        uni.switchTab({ url: '/pages/customer/services' })
      }, 1500)
    } else {
      uni.showToast({ title: res.message || '注册失败', icon: 'none' })
    }
  } catch (error) {
    console.error('注册失败', error)
    uni.showToast({ title: '注册失败，请重试', icon: 'none' })
  }
}

// 选择角色
const selectRole = (selectedRole) => {
  role.value = selectedRole
}
</script>

<style scoped>
.container {
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
}

.form-container {
  width: 100%;
  width: 100%;
}

/* 为自定义输入框添加样式 */
.custom-input {
  width: 100%;
  height: 90rpx;
  border: 1px solid #e4e7ed;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  margin-bottom: 30rpx;
  box-sizing: border-box;
}

.code-input-container {
  display: flex;
  align-items: center;
  margin-bottom: 50rpx;
}

.code-input {
  flex: 1;
  margin-right: 20rpx;
  margin-bottom: 0;
}

.code-btn {
  flex: 0 0 auto;
  color: #1989fa;
  padding: 0 20rpx;
  background: none;
  border: none;
  font-size: 26rpx;
  height: 90rpx;
  line-height: 90rpx;
}

.register-btn {
  margin-bottom: 40rpx;
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background-color: #1989fa;
  color: white;
  border-radius: 48rpx;
  border: none;
  font-size: 32rpx;
}

.role-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
}

.role-selector text {
  color: #666;
  padding: 0 30rpx;
}

.role-selector .divider {
  color: #ddd;
}

.role-selector .active {
  color: #1989fa;
  font-weight: bold;
}
</style>