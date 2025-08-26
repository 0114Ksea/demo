// 模拟API接口
const BASE_URL = 'https://api.example.com'

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
  }
}

// 认证相关API
export const authAPI = {
  // 发送验证码
  async sendCode(phone) {
    await utils.delay(500) // 模拟网络延迟
    return {
      success: true,
      message: '验证码发送成功'
    }
  },
  // 登录
  async login(phone, code, role = 'customer') {
    await utils.delay(800)
    // 模拟登录成功
    return {
      success: true,
      token: utils.generateId(),
      userInfo: {
        id: utils.generateId(),
        phone,
        nickname: role === 'customer' ? '顾客' + phone.slice(-4) : '商家' + phone.slice(-4),
        avatar: '/static/logo.png',
        role
      }
    }
  },
  // 注册
  async register(phone, code, role = 'customer') {
    await utils.delay(800)
    // 模拟注册成功
    return {
      success: true,
      token: utils.generateId(),
      userInfo: {
        id: utils.generateId(),
        phone,
        nickname: role === 'customer' ? '顾客' + phone.slice(-4) : '商家' + phone.slice(-4),
        avatar: '/static/logo.png',
        role
      }
    }
  }
}

// 服务相关API
export const serviceAPI = {
  // 获取服务列表
  async getServiceList(page = 1, pageSize = 10) {
    await utils.delay(300)
    // 模拟服务数据
    const services = []
    for (let i = 0; i < 10; i++) {
      const id = page * 100 + i
      services.push({
        id: id.toString(),
        name: `服务${id}`,
        price: Math.floor(Math.random() * 500) + 100,
        duration: Math.floor(Math.random() * 120) + 30,
        image: '/static/logo.png',
        description: `这是服务${id}的详细描述，包含服务内容、流程等信息。`,
        merchant: {
          id: Math.floor(Math.random() * 1000).toString(),
          name: `商家${Math.floor(Math.random() * 100)}`,
          rating: 4 + Math.random()
        },
        sales: Math.floor(Math.random() * 1000)
      })
    }
    return {
      success: true,
      data: services,
      total: 100,
      page,
      pageSize
    }
  },
  // 获取服务详情
  async getServiceDetail(id) {
    await utils.delay(300)
    return {
      success: true,
      data: {
        id,
        name: `服务${id}`,
        price: Math.floor(Math.random() * 500) + 100,
        duration: Math.floor(Math.random() * 120) + 30,
        image: '/static/logo.png',
        description: `这是服务${id}的详细描述，包含服务内容、流程等信息。`,
        merchant: {
          id: Math.floor(Math.random() * 1000).toString(),
          name: `商家${Math.floor(Math.random() * 100)}`,
          rating: 4 + Math.random()
        },
        sales: Math.floor(Math.random() * 1000)
      }
    }
  },
  // 发布服务（商家）
  async publishService(serviceData) {
    await utils.delay(500)
    return {
      success: true,
      data: {
        id: utils.generateId(),
        ...serviceData,
        createTime: utils.getCurrentTime(),
        status: 'online'
      }
    }
  },
  // 更新服务（商家）
  async updateService(id, serviceData) {
    await utils.delay(500)
    return {
      success: true,
      data: {
        id,
        ...serviceData,
        updateTime: utils.getCurrentTime()
      }
    }
  },
  // 上下架服务（商家）
  async changeServiceStatus(id, status) {
    await utils.delay(300)
    return {
      success: true,
      data: {
        id,
        status,
        updateTime: utils.getCurrentTime()
      }
    }
  }
}

// 预约相关API
export const bookingAPI = {
  // 创建预约
  async createBooking(bookingData) {
    await utils.delay(500)
    return {
      success: true,
      data: {
        id: utils.generateId(),
        ...bookingData,
        createTime: utils.getCurrentTime(),
        status: 'pending'
      }
    }
  },
  // 获取我的订单
  async getMyOrders(status = '', page = 1, pageSize = 10) {
    await utils.delay(300)
    // 模拟订单数据
    const orders = []
    const statuses = ['pending', 'confirmed', 'completed', 'canceled']
    for (let i = 0; i < 10; i++) {
      const orderId = page * 100 + i
      const serviceId = Math.floor(Math.random() * 1000)
      orders.push({
        id: orderId.toString(),
        serviceId: serviceId.toString(),
        serviceName: `服务${serviceId}`,
        price: Math.floor(Math.random() * 500) + 100,
        bookingTime: '2024-0' + (Math.floor(Math.random() * 3) + 1) + '-' + (Math.floor(Math.random() * 28) + 1) + ' ' + (Math.floor(Math.random() * 12) + 9) + ':00:00',
        createTime: '2024-0' + (Math.floor(Math.random() * 3) + 1) + '-' + (Math.floor(Math.random() * 28) + 1) + ' ' + (Math.floor(Math.random() * 24)) + ':' + (Math.floor(Math.random() * 60)) + ':00',
        status: status || statuses[Math.floor(Math.random() * statuses.length)]
      })
    }
    return {
      success: true,
      data: orders,
      total: 50,
      page,
      pageSize
    }
  },
  // 取消预约
  async cancelBooking(id) {
    await utils.delay(300)
    return {
      success: true,
      data: {
        id,
        status: 'canceled',
        updateTime: utils.getCurrentTime()
      }
    }
  },
  // 确认预约（商家）
  async confirmBooking(id) {
    await utils.delay(300)
    return {
      success: true,
      data: {
        id,
        status: 'confirmed',
        updateTime: utils.getCurrentTime()
      }
    }
  },
  // 完成预约（商家）
  async completeBooking(id) {
    await utils.delay(300)
    return {
      success: true,
      data: {
        id,
        status: 'completed',
        updateTime: utils.getCurrentTime()
      }
    }
  }
}

// 收藏相关API
export const favoriteAPI = {
  // 收藏服务
  async addFavorite(serviceId) {
    await utils.delay(300)
    return {
      success: true,
      message: '收藏成功'
    }
  },
  // 取消收藏
  async removeFavorite(serviceId) {
    await utils.delay(300)
    return {
      success: true,
      message: '已取消收藏'
    }
  },
  // 获取收藏列表
  async getFavorites(page = 1, pageSize = 10) {
    await utils.delay(300)
    // 模拟收藏数据
    const favorites = []
    for (let i = 0; i < 10; i++) {
      const id = page * 100 + i
      favorites.push({
        id: id.toString(),
        serviceId: id.toString(),
        serviceName: `服务${id}`,
        price: Math.floor(Math.random() * 500) + 100,
        image: '/static/logo.png',
        merchantName: `商家${Math.floor(Math.random() * 100)}`,
        createTime: '2024-0' + (Math.floor(Math.random() * 3) + 1) + '-' + (Math.floor(Math.random() * 28) + 1)
      })
    }
    return {
      success: true,
      data: favorites,
      total: 30,
      page,
      pageSize
    }
  }
}