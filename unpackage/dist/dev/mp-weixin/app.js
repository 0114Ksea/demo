"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/auth/login.js";
  "./pages/auth/register.js";
  "./pages/customer/services.js";
  "./pages/customer/service-detail.js";
  "./pages/customer/booking.js";
  "./pages/customer/orders.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    this.initLoginStatus();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:9", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Hide");
  },
  methods: {
    initLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const token = common_vendor.index.getStorageSync("token");
      if (token && userInfo) {
        this.$globalData.isLogin = true;
        this.$globalData.userInfo = userInfo;
      }
    }
  },
  globalData: {
    isLogin: false,
    userInfo: null,
    role: "customer"
    // 默认顾客角色，可切换为'merchant'
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(common_vendor.uView);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
