<template>
  <view class="container">
    <view class="logo-container">
      <!-- <image class="logo" src="/static/logo.png"></image> -->
      <view class="title">账号注册</view>
    </view>
    
    <view class="form-container">
      <!-- 将u-input改为普通input组件 -->
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

// ... 现有代码保持不变 ...
</script>

<style scoped>
.container {
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
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
}

/* 添加自定义输入框样式 */
.custom-input {
  margin-bottom: 30rpx;
  border: 1px solid #e4e7ed;
  border-radius: 8rpx;
  padding: 24rpx;
  font-size: 28rpx;
  width: 100%;
}

.code-input {
  margin-bottom: 0;
  flex: 1;
  margin-right: 20rpx;
}

.code-input-container {
  display: flex;
  align-items: center;
  margin-bottom: 50rpx;
}

.code-btn {
  flex: 0 0 auto;
  color: #1989fa;
  padding: 0 20rpx;
  background: none;
  border: none;
}

.register-btn {
  margin-bottom: 40rpx;
  background-color: #1989fa;
  color: white;
  width: 100%;
  padding: 24rpx;
  border-radius: 8rpx;
  border: none;
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