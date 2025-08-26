import mockData from '../mock/data.js'

// 工具函数
export const utils = {
  // 生成随机ID
  generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },
  
  // 获取当前时间格式化
  getCurrentTime() {
    const now = new Date()
    return now.toISOString().slice(0, 19).replace('T', ' ')
  },
  
  // 延迟函数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  
  // 保存数据到本地存储
  saveData(key, data) {
    try {
      uni.setStorageSync(key, JSON.stringify(data))
      return true
    } catch (e) {
      console.error('保存数据失败', e)
      return false
    }
  },
  
  // 从本地存储获取数据
  getData(key) {
    try {
      const data = uni.getStorageSync(key)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('获取数据失败', e)
      return null
    }
  },
  
  // 初始化模拟数据
  initMockData() {
    // 检查是否已有数据
    const users = this.getData('users')
    const services = this.getData('services')
    const orders = this.getData('orders')
    
    // 如果没有数据，初始化
    if (!users) {
      this.saveData('users', mockData.users)
    }
    if (!services) {
      this.saveData('services', mockData.services)
    }
    if (!orders) {
      this.saveData('orders', mockData.orders)
    }
  }
}

// 认证相关服务
export const authService = {
  // 发送验证码（模拟）
  async sendCode(phone) {
    await utils.delay(500)
    return {
      success: true,
      message: '验证码发送成功'
    }
  },
  
  // 登录
  async login(phone, code) {
    await utils.delay(800)
    // 在实际应用中，这里会校验验证码
    
    const users = utils.getData('users') || mockData.users
    const user = users.find(u => u.phone === phone)
    
    if (user) {
      // 生成token（模拟）
      const token = utils.generateId()
      
      // 保存登录状态
      const loginInfo = {
        token,
        userInfo: user
      }
      
      utils.saveData('loginInfo', loginInfo)
      
      return {
        success: true,
        data: loginInfo
      }
    } else {
      return {
        success: false,
        message: '用户不存在，请先注册'
      }
    }
  },
  
  // 注册
  async register(phone, code, role = 'customer') {
    await utils.delay(800)
    
    const users = utils.getData('users') || [...mockData.users]
    const existingUser = users.find(u => u.phone === phone)
    
    if (existingUser) {
      return {
        success: false,
        message: '手机号已被注册'
      }
    }
    
    // 创建新用户
    const newUser = {
      id: utils.generateId(),
      phone,
      password: '123456', // 默认密码
      nickname: role === 'customer' ? '顾客' + phone.slice(-4) : '商家' + phone.slice(-4),
      avatar: '/static/logo.png',
      role,
      favorites: []
    }
    
    users.push(newUser)
    utils.saveData('users', users)
    
    // 生成token（模拟）
    const token = utils.generateId()
    
    // 保存登录状态
    const loginInfo = {
      token,
      userInfo: newUser
    }
    
    utils.saveData('loginInfo', loginInfo)
    
    return {
      success: true,
      data: loginInfo
    }
  },
  
  // 获取当前登录用户信息
  getCurrentUser() {
    const loginInfo = utils.getData('loginInfo')
    return loginInfo ? loginInfo.userInfo : null
  },
  
  // 退出登录
  logout() {
    utils.saveData('loginInfo', null)
  }
}

// 服务相关服务
export const serviceService = {
  // 获取服务列表
  async getServiceList(page = 1, pageSize = 10, status = 'online') {
    await utils.delay(300)
    
    const services = utils.getData('services') || mockData.services
    let filteredServices = services
    
    if (status) {
      filteredServices = services.filter(s => s.status === status)
    }
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedServices = filteredServices.slice(start, end)
    
    return {
      success: true,
      data: {
        list: paginatedServices,
        total: filteredServices.length,
        page,
        pageSize
      }
    }
  },
  
  // 获取服务详情
  async getServiceDetail(id) {
    await utils.delay(300)
    
    const services = utils.getData('services') || mockData.services
    const service = services.find(s => s.id === id)
    
    if (service) {
      return {
        success: true,
        data: service
      }
    } else {
      return {
        success: false,
        message: '服务不存在'
      }
    }
  },
  
  // 发布服务（商家）
  async publishService(serviceData) {
    await utils.delay(500)
    
    const services = utils.getData('services') || [...mockData.services]
    const user = authService.getCurrentUser()
    
    if (!user || user.role !== 'merchant') {
      return {
        success: false,
        message: '只有商家才能发布服务'
      }
    }
    
    const newService = {
      id: utils.generateId(),
      ...serviceData,
      merchant: {
        id: user.id,
        name: user.nickname,
        rating: 5.0
      },
      sales: 0,
      createTime: utils.getCurrentTime(),
      status: 'online'
    }
    
    services.push(newService)
    utils.saveData('services', services)
    
    return {
      success: true,
      data: newService
    }
  },
  
  // 更新服务（商家）
  async updateService(id, serviceData) {
    await utils.delay(500)
    
    const services = utils.getData('services') || [...mockData.services]
    const user = authService.getCurrentUser()
    const index = services.findIndex(s => s.id === id)
    
    if (index === -1) {
      return {
        success: false,
        message: '服务不存在'
      }
    }
    
    if (!user || user.role !== 'merchant' || services[index].merchant.id !== user.id) {
      return {
        success: false,
        message: '您无权修改此服务'
      }
    }
    
    services[index] = {
      ...services[index],
      ...serviceData,
      updateTime: utils.getCurrentTime()
    }
    
    utils.saveData('services', services)
    
    return {
      success: true,
      data: services[index]
    }
  },
  
  // 上下架服务（商家）
  async changeServiceStatus(id, status) {
    await utils.delay(300)
    
    const services = utils.getData('services') || [...mockData.services]
    const user = authService.getCurrentUser()
    const index = services.findIndex(s => s.id === id)
    
    if (index === -1) {
      return {
        success: false,
        message: '服务不存在'
      }
    }
    
    if (!user || user.role !== 'merchant' || services[index].merchant.id !== user.id) {
      return {
        success: false,
        message: '您无权操作此服务'
      }
    }
    
    services[index].status = status
    services[index].updateTime = utils.getCurrentTime()
    
    utils.saveData('services', services)
    
    return {
      success: true,
      data: services[index]
    }
  }
}

// 订单相关服务
export const orderService = {
  // 创建预约
  async createBooking(bookingData) {
    await utils.delay(500)
    
    const orders = utils.getData('orders') || [...mockData.orders]
    const user = authService.getCurrentUser()
    const services = utils.getData('services') || mockData.services
    
    if (!user) {
      return {
        success: false,
        message: '请先登录'
      }
    }
    
    const service = services.find(s => s.id === bookingData.serviceId)
    if (!service) {
      return {
        success: false,
        message: '服务不存在'
      }
    }
    
    const newOrder = {
      id: utils.generateId(),
      userId: user.id,
      serviceId: bookingData.serviceId,
      merchantId: service.merchant.id,
      serviceName: service.name,
      price: service.price,
      bookingTime: bookingData.bookingTime,
      createTime: utils.getCurrentTime(),
      status: 'pending'
    }
    
    orders.push(newOrder)
    utils.saveData('orders', orders)
    
    return {
      success: true,
      data: newOrder
    }
  },
  
  // 获取我的订单
  async getMyOrders(status = '', page = 1, pageSize = 10) {
    await utils.delay(300)
    
    const orders = utils.getData('orders') || mockData.orders
    const user = authService.getCurrentUser()
    
    if (!user) {
      return {
        success: false,
        message: '请先登录'
      }
    }
    
    // 根据用户角色筛选订单
    let userOrders = []
    if (user.role === 'customer') {
      userOrders = orders.filter(o => o.userId === user.id)
    } else if (user.role === 'merchant') {
      userOrders = orders.filter(o => o.merchantId === user.id)
    }
    
    // 根据状态筛选
    if (status) {
      userOrders = userOrders.filter(o => o.status === status)
    }
    
    // 分页
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedOrders = userOrders.slice(start, end)
    
    return {
      success: true,
      data: {
        list: paginatedOrders,
        total: userOrders.length,
        page,
        pageSize
      }
    }
  },
  
  // 取消预约
  async cancelBooking(id) {
    await utils.delay(300)
    
    const orders = utils.getData('orders') || [...mockData.orders]
    const user = authService.getCurrentUser()
    const index = orders.findIndex(o => o.id === id)
    
    if (index === -1) {
      return {
        success: false,
        message: '订单不存在'
      }
    }
    
    if (!user || (user.role === 'customer' && orders[index].userId !== user.id)) {
      return {
        success: false,
        message: '您无权操作此订单'
      }
    }
    
    if (orders[index].status !== 'pending') {
      return {
        success: false,
        message: '订单状态不允许取消'
      }
    }
    
    orders[index].status = 'canceled'
    orders[index].updateTime = utils.getCurrentTime()
    
    utils.saveData('orders', orders)
    
    return {
      success: true,
      data: orders[index]
    }
  },
  
  // 确认预约（商家）
  async confirmBooking(id) {
    await utils.delay(300)
    
    const orders = utils.getData('orders') || [...mockData.orders]
    const user = authService.getCurrentUser()
    const index = orders.findIndex(o => o.id === id)
    
    if (index === -1) {
      return {
        success: false,
        message: '订单不存在'
      }
    }
    
    if (!user || user.role !== 'merchant' || orders[index].merchantId !== user.id) {
      return {
        success: false,
        message: '您无权操作此订单'
      }
    }
    
    if (orders[index].status !== 'pending') {
      return {
        success: false,
        message: '订单状态不允许确认'
      }
    }
    
    orders[index].status = 'confirmed'
    orders[index].updateTime = utils.getCurrentTime()
    
    utils.saveData('orders', orders)
    
    return {
      success: true,
      data: orders[index]
    }
  },
  
  // 完成预约（商家）
  async completeBooking(id) {
    await utils.delay(300)
    
    const orders = utils.getData('orders') || [...mockData.orders]
    const user = authService.getCurrentUser()
    const index = orders.findIndex(o => o.id === id)
    
    if (index === -1) {
      return {
        success: false,
        message: '订单不存在'
      }
    }
    
    if (!user || user.role !== 'merchant' || orders[index].merchantId !== user.id) {
      return {
        success: false,
        message: '您无权操作此订单'
      }
    }
    
    if (orders[index].status !== 'confirmed') {
      return {
        success: false,
        message: '订单状态不允许完成'
      }
    }
    
    orders[index].status = 'completed'
    orders[index].updateTime = utils.getCurrentTime()
    
    utils.saveData('orders', orders)
    
    return {
      success: true,
      data: orders[index]
    }
  }
}

// 收藏相关服务
export const favoriteService = {
  // 收藏服务
  async addFavorite(serviceId) {
    await utils.delay(300)
    
    const users = utils.getData('users') || [...mockData.users]
    const user = authService.getCurrentUser()
    
    if (!user) {
      return {
        success: false,
        message: '请先登录'
      }
    }
    
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex === -1) {
      return {
        success: false,
        message: '用户不存在'
      }
    }
    
    if (users[userIndex].favorites.includes(serviceId)) {
      return {
        success: false,
        message: '已收藏'
      }
    }
    
    users[userIndex].favorites.push(serviceId)
    utils.saveData('users', users)
    
    // 更新当前用户信息
    const loginInfo = utils.getData('loginInfo')
    if (loginInfo) {
      loginInfo.userInfo.favorites = users[userIndex].favorites
      utils.saveData('loginInfo', loginInfo)
    }
    
    return {
      success: true,
      message: '收藏成功'
    }
  },
  
  // 取消收藏
  async removeFavorite(serviceId) {
    await utils.delay(300)
    
    const users = utils.getData('users') || [...mockData.users]
    const user = authService.getCurrentUser()
    
    if (!user) {
      return {
        success: false,
        message: '请先登录'
      }
    }
    
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex === -1) {
      return {
        success: false,
        message: '用户不存在'
      }
    }
    
    const favoriteIndex = users[userIndex].favorites.indexOf(serviceId)
    if (favoriteIndex === -1) {
      return {
        success: false,
        message: '未收藏此服务'
      }
    }
    
    users[userIndex].favorites.splice(favoriteIndex, 1)
    utils.saveData('users', users)
    
    // 更新当前用户信息
    const loginInfo = utils.getData('loginInfo')
    if (loginInfo) {
      loginInfo.userInfo.favorites = users[userIndex].favorites
      utils.saveData('loginInfo', loginInfo)
    }
    
    return {
      success: true,
      message: '已取消收藏'
    }
  },
  
  // 获取收藏列表
  async getFavorites(page = 1, pageSize = 10) {
    await utils.delay(300)
    
    const user = authService.getCurrentUser()
    const services = utils.getData('services') || mockData.services
    
    if (!user) {
      return {
        success: false,
        message: '请先登录'
      }
    }
    
    // 获取收藏的服务
    const favoriteServices = services.filter(s => user.favorites.includes(s.id))
    
    // 分页
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedServices = favoriteServices.slice(start, end)
    
    return {
      success: true,
      data: {
        list: paginatedServices,
        total: favoriteServices.length,
        page,
        pageSize
      }
    }
  },
  
  // 检查服务是否已收藏
  isServiceFavorite(serviceId) {
    const user = authService.getCurrentUser()
    return user && user.favorites && user.favorites.includes(serviceId)
  }
}

// 初始化数据
utils.initMockData()