<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    // 初始化登录状态
    this.initLoginStatus()
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  methods: {
    initLoginStatus() {
      // 从本地存储获取用户信息和登录状态
      const userInfo = uni.getStorageSync('userInfo')
      const token = uni.getStorageSync('token')
      if (token && userInfo) {
        // 设置全局登录状态
        this.$globalData.isLogin = true
        this.$globalData.userInfo = userInfo
      }
    }
  },
  globalData: {
    isLogin: false,
    userInfo: null,
    role: 'customer' // 默认顾客角色，可切换为'merchant'
  }
}
</script>

<style>
/*每个页面公共css */
page {
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

/* 基本样式重置 - 将通配符改为具体元素 */
page, view, text, button, image, scroll-view, input, form, picker {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 按钮基础样式 */
button {
  border: none;
  outline: none;
  cursor: pointer;
}

/* 输入框基础样式 */
input {
  border: 1px solid #e4e7ed;
  border-radius: 8rpx;
  padding: 24rpx;
  font-size: 28rpx;
}

/* 常用颜色变量 */
:root {
  --primary-color: #1989fa;
  --border-color: #e4e7ed;
  --background-color: #f5f5f5;
  --text-color: #333;
}
</style>
