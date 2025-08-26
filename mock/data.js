// 模拟数据
const mockData = {
  // 用户数据
  users: [
    {
      id: '1',
      phone: '13800138000',
      password: '123456',
      nickname: '顾客8000',
      avatar: '/static/logo.png',
      role: 'customer',
      favorites: ['1', '3', '5']
    },
    {
      id: '2',
      phone: '13800138001',
      password: '123456',
      nickname: '商家8001',
      avatar: '/static/logo.png',
      role: 'merchant'
    }
  ],
  
  // 服务数据
  services: [
    {
      id: '1',
      name: '美发造型设计',
      price: 288,
      duration: 60,
      image: '/static/logo.png',
      description: '专业造型师为您提供个性化美发设计，包括剪发、烫发、染发等服务。',
      merchant: {
        id: '2',
        name: '时尚美发沙龙',
        rating: 4.8
      },
      sales: 328,
      status: 'online'
    },
    {
      id: '2',
      name: '精油SPA按摩',
      price: 398,
      duration: 90,
      image: '/static/logo.png',
      description: '采用纯天然精油，结合专业按摩手法，缓解疲劳，放松身心。',
      merchant: {
        id: '3',
        name: '舒适SPA会所',
        rating: 4.6
      },
      sales: 156,
      status: 'online'
    },
    {
      id: '3',
      name: '美甲艺术设计',
      price: 168,
      duration: 45,
      image: '/static/logo.png',
      description: '提供多种美甲款式选择，使用高品质甲油胶，持久靓丽。',
      merchant: {
        id: '2',
        name: '时尚美发沙龙',
        rating: 4.8
      },
      sales: 279,
      status: 'online'
    },
    {
      id: '4',
      name: '面部护理套餐',
      price: 298,
      duration: 75,
      image: '/static/logo.png',
      description: '深层清洁、补水保湿、精华导入，让肌肤焕发活力。',
      merchant: {
        id: '3',
        name: '舒适SPA会所',
        rating: 4.6
      },
      sales: 198,
      status: 'online'
    },
    {
      id: '5',
      name: '男士修面服务',
      price: 128,
      duration: 30,
      image: '/static/logo.png',
      description: '传统工艺与现代技术相结合，提供舒适的修面体验。',
      merchant: {
        id: '2',
        name: '时尚美发沙龙',
        rating: 4.8
      },
      sales: 145,
      status: 'online'
    }
  ],
  
  // 订单数据
  orders: [
    {
      id: '1',
      serviceId: '1',
      userId: '1',
      merchantId: '2',
      serviceName: '美发造型设计',
      price: 288,
      bookingTime: '2024-06-15 14:30:00',
      createTime: '2024-06-10 10:20:00',
      status: 'confirmed'
    },
    {
      id: '2',
      serviceId: '3',
      userId: '1',
      merchantId: '2',
      serviceName: '美甲艺术设计',
      price: 168,
      bookingTime: '2024-06-16 10:00:00',
      createTime: '2024-06-12 15:30:00',
      status: 'pending'
    },
    {
      id: '3',
      serviceId: '2',
      userId: '1',
      merchantId: '3',
      serviceName: '精油SPA按摩',
      price: 398,
      bookingTime: '2024-06-10 16:00:00',
      createTime: '2024-06-05 09:15:00',
      status: 'completed'
    }
  ]
}

export default mockData