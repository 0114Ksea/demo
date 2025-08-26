"use strict";
const common_vendor = require("../common/vendor.js");
const mock_data = require("../mock/data.js");
const utils = {
  // 生成随机ID
  generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },
  // 获取当前时间格式化
  getCurrentTime() {
    const now = /* @__PURE__ */ new Date();
    return now.toISOString().slice(0, 19).replace("T", " ");
  },
  // 延迟函数
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  // 保存数据到本地存储
  saveData(key, data) {
    try {
      common_vendor.index.setStorageSync(key, JSON.stringify(data));
      return true;
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/mockService.js:27", "保存数据失败", e);
      return false;
    }
  },
  // 从本地存储获取数据
  getData(key) {
    try {
      const data = common_vendor.index.getStorageSync(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/mockService.js:38", "获取数据失败", e);
      return null;
    }
  },
  // 初始化模拟数据
  initMockData() {
    const users = this.getData("users");
    const services = this.getData("services");
    const orders = this.getData("orders");
    if (!users) {
      this.saveData("users", mock_data.mockData.users);
    }
    if (!services) {
      this.saveData("services", mock_data.mockData.services);
    }
    if (!orders) {
      this.saveData("orders", mock_data.mockData.orders);
    }
  }
};
const authService = {
  // 发送验证码（模拟）
  async sendCode(phone) {
    await utils.delay(500);
    return {
      success: true,
      message: "验证码发送成功"
    };
  },
  // 登录
  async login(phone, code) {
    await utils.delay(800);
    const users = utils.getData("users") || mock_data.mockData.users;
    const user = users.find((u) => u.phone === phone);
    if (user) {
      const token = utils.generateId();
      const loginInfo = {
        token,
        userInfo: user
      };
      utils.saveData("loginInfo", loginInfo);
      return {
        success: true,
        data: loginInfo
      };
    } else {
      return {
        success: false,
        message: "用户不存在，请先注册"
      };
    }
  },
  // 注册
  async register(phone, code, role = "customer") {
    await utils.delay(800);
    const users = utils.getData("users") || [...mock_data.mockData.users];
    const existingUser = users.find((u) => u.phone === phone);
    if (existingUser) {
      return {
        success: false,
        message: "手机号已被注册"
      };
    }
    const newUser = {
      id: utils.generateId(),
      phone,
      password: "123456",
      // 默认密码
      nickname: role === "customer" ? "顾客" + phone.slice(-4) : "商家" + phone.slice(-4),
      avatar: "/static/logo.png",
      role,
      favorites: []
    };
    users.push(newUser);
    utils.saveData("users", users);
    const token = utils.generateId();
    const loginInfo = {
      token,
      userInfo: newUser
    };
    utils.saveData("loginInfo", loginInfo);
    return {
      success: true,
      data: loginInfo
    };
  },
  // 获取当前登录用户信息
  getCurrentUser() {
    const loginInfo = utils.getData("loginInfo");
    return loginInfo ? loginInfo.userInfo : null;
  },
  // 退出登录
  logout() {
    utils.saveData("loginInfo", null);
  }
};
const serviceService = {
  // 获取服务列表
  async getServiceList(page = 1, pageSize = 10, status = "online") {
    await utils.delay(300);
    const services = utils.getData("services") || mock_data.mockData.services;
    let filteredServices = services;
    if (status) {
      filteredServices = services.filter((s) => s.status === status);
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedServices = filteredServices.slice(start, end);
    return {
      success: true,
      data: {
        list: paginatedServices,
        total: filteredServices.length,
        page,
        pageSize
      }
    };
  },
  // 获取服务详情
  async getServiceDetail(id) {
    await utils.delay(300);
    const services = utils.getData("services") || mock_data.mockData.services;
    const service = services.find((s) => s.id === id);
    if (service) {
      return {
        success: true,
        data: service
      };
    } else {
      return {
        success: false,
        message: "服务不存在"
      };
    }
  },
  // 发布服务（商家）
  async publishService(serviceData) {
    await utils.delay(500);
    const services = utils.getData("services") || [...mock_data.mockData.services];
    const user = authService.getCurrentUser();
    if (!user || user.role !== "merchant") {
      return {
        success: false,
        message: "只有商家才能发布服务"
      };
    }
    const newService = {
      id: utils.generateId(),
      ...serviceData,
      merchant: {
        id: user.id,
        name: user.nickname,
        rating: 5
      },
      sales: 0,
      createTime: utils.getCurrentTime(),
      status: "online"
    };
    services.push(newService);
    utils.saveData("services", services);
    return {
      success: true,
      data: newService
    };
  },
  // 更新服务（商家）
  async updateService(id, serviceData) {
    await utils.delay(500);
    const services = utils.getData("services") || [...mock_data.mockData.services];
    const user = authService.getCurrentUser();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) {
      return {
        success: false,
        message: "服务不存在"
      };
    }
    if (!user || user.role !== "merchant" || services[index].merchant.id !== user.id) {
      return {
        success: false,
        message: "您无权修改此服务"
      };
    }
    services[index] = {
      ...services[index],
      ...serviceData,
      updateTime: utils.getCurrentTime()
    };
    utils.saveData("services", services);
    return {
      success: true,
      data: services[index]
    };
  },
  // 上下架服务（商家）
  async changeServiceStatus(id, status) {
    await utils.delay(300);
    const services = utils.getData("services") || [...mock_data.mockData.services];
    const user = authService.getCurrentUser();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) {
      return {
        success: false,
        message: "服务不存在"
      };
    }
    if (!user || user.role !== "merchant" || services[index].merchant.id !== user.id) {
      return {
        success: false,
        message: "您无权操作此服务"
      };
    }
    services[index].status = status;
    services[index].updateTime = utils.getCurrentTime();
    utils.saveData("services", services);
    return {
      success: true,
      data: services[index]
    };
  }
};
const orderService = {
  // 创建预约
  async createBooking(bookingData) {
    await utils.delay(500);
    const orders = utils.getData("orders") || [...mock_data.mockData.orders];
    const user = authService.getCurrentUser();
    const services = utils.getData("services") || mock_data.mockData.services;
    if (!user) {
      return {
        success: false,
        message: "请先登录"
      };
    }
    const service = services.find((s) => s.id === bookingData.serviceId);
    if (!service) {
      return {
        success: false,
        message: "服务不存在"
      };
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
      status: "pending"
    };
    orders.push(newOrder);
    utils.saveData("orders", orders);
    return {
      success: true,
      data: newOrder
    };
  },
  // 获取我的订单
  async getMyOrders(status = "", page = 1, pageSize = 10) {
    await utils.delay(300);
    const orders = utils.getData("orders") || mock_data.mockData.orders;
    const user = authService.getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "请先登录"
      };
    }
    let userOrders = [];
    if (user.role === "customer") {
      userOrders = orders.filter((o) => o.userId === user.id);
    } else if (user.role === "merchant") {
      userOrders = orders.filter((o) => o.merchantId === user.id);
    }
    if (status) {
      userOrders = userOrders.filter((o) => o.status === status);
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedOrders = userOrders.slice(start, end);
    return {
      success: true,
      data: {
        list: paginatedOrders,
        total: userOrders.length,
        page,
        pageSize
      }
    };
  },
  // 取消预约
  async cancelBooking(id) {
    await utils.delay(300);
    const orders = utils.getData("orders") || [...mock_data.mockData.orders];
    const user = authService.getCurrentUser();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return {
        success: false,
        message: "订单不存在"
      };
    }
    if (!user || user.role === "customer" && orders[index].userId !== user.id) {
      return {
        success: false,
        message: "您无权操作此订单"
      };
    }
    if (orders[index].status !== "pending") {
      return {
        success: false,
        message: "订单状态不允许取消"
      };
    }
    orders[index].status = "canceled";
    orders[index].updateTime = utils.getCurrentTime();
    utils.saveData("orders", orders);
    return {
      success: true,
      data: orders[index]
    };
  },
  // 确认预约（商家）
  async confirmBooking(id) {
    await utils.delay(300);
    const orders = utils.getData("orders") || [...mock_data.mockData.orders];
    const user = authService.getCurrentUser();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return {
        success: false,
        message: "订单不存在"
      };
    }
    if (!user || user.role !== "merchant" || orders[index].merchantId !== user.id) {
      return {
        success: false,
        message: "您无权操作此订单"
      };
    }
    if (orders[index].status !== "pending") {
      return {
        success: false,
        message: "订单状态不允许确认"
      };
    }
    orders[index].status = "confirmed";
    orders[index].updateTime = utils.getCurrentTime();
    utils.saveData("orders", orders);
    return {
      success: true,
      data: orders[index]
    };
  },
  // 完成预约（商家）
  async completeBooking(id) {
    await utils.delay(300);
    const orders = utils.getData("orders") || [...mock_data.mockData.orders];
    const user = authService.getCurrentUser();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return {
        success: false,
        message: "订单不存在"
      };
    }
    if (!user || user.role !== "merchant" || orders[index].merchantId !== user.id) {
      return {
        success: false,
        message: "您无权操作此订单"
      };
    }
    if (orders[index].status !== "confirmed") {
      return {
        success: false,
        message: "订单状态不允许完成"
      };
    }
    orders[index].status = "completed";
    orders[index].updateTime = utils.getCurrentTime();
    utils.saveData("orders", orders);
    return {
      success: true,
      data: orders[index]
    };
  }
};
const favoriteService = {
  // 收藏服务
  async addFavorite(serviceId) {
    await utils.delay(300);
    const users = utils.getData("users") || [...mock_data.mockData.users];
    const user = authService.getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "请先登录"
      };
    }
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex === -1) {
      return {
        success: false,
        message: "用户不存在"
      };
    }
    if (users[userIndex].favorites.includes(serviceId)) {
      return {
        success: false,
        message: "已收藏"
      };
    }
    users[userIndex].favorites.push(serviceId);
    utils.saveData("users", users);
    const loginInfo = utils.getData("loginInfo");
    if (loginInfo) {
      loginInfo.userInfo.favorites = users[userIndex].favorites;
      utils.saveData("loginInfo", loginInfo);
    }
    return {
      success: true,
      message: "收藏成功"
    };
  },
  // 取消收藏
  async removeFavorite(serviceId) {
    await utils.delay(300);
    const users = utils.getData("users") || [...mock_data.mockData.users];
    const user = authService.getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "请先登录"
      };
    }
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex === -1) {
      return {
        success: false,
        message: "用户不存在"
      };
    }
    const favoriteIndex = users[userIndex].favorites.indexOf(serviceId);
    if (favoriteIndex === -1) {
      return {
        success: false,
        message: "未收藏此服务"
      };
    }
    users[userIndex].favorites.splice(favoriteIndex, 1);
    utils.saveData("users", users);
    const loginInfo = utils.getData("loginInfo");
    if (loginInfo) {
      loginInfo.userInfo.favorites = users[userIndex].favorites;
      utils.saveData("loginInfo", loginInfo);
    }
    return {
      success: true,
      message: "已取消收藏"
    };
  },
  // 获取收藏列表
  async getFavorites(page = 1, pageSize = 10) {
    await utils.delay(300);
    const user = authService.getCurrentUser();
    const services = utils.getData("services") || mock_data.mockData.services;
    if (!user) {
      return {
        success: false,
        message: "请先登录"
      };
    }
    const favoriteServices = services.filter((s) => user.favorites.includes(s.id));
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedServices = favoriteServices.slice(start, end);
    return {
      success: true,
      data: {
        list: paginatedServices,
        total: favoriteServices.length,
        page,
        pageSize
      }
    };
  },
  // 检查服务是否已收藏
  isServiceFavorite(serviceId) {
    const user = authService.getCurrentUser();
    return user && user.favorites && user.favorites.includes(serviceId);
  }
};
utils.initMockData();
exports.authService = authService;
exports.favoriteService = favoriteService;
exports.orderService = orderService;
exports.serviceService = serviceService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/mockService.js.map
