"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockService = require("../../utils/mockService.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const phone = common_vendor.ref("");
    const code = common_vendor.ref("");
    const countdown = common_vendor.ref(0);
    const canLogin = common_vendor.computed(() => {
      return phone.value.length === 11 && code.value.length > 0;
    });
    const sendCode = async () => {
      if (phone.value.length !== 11) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      try {
        await utils_mockService.authService.sendCode(phone.value);
        common_vendor.index.showToast({ title: "验证码发送成功", icon: "success" });
        startCountdown();
      } catch (error) {
        common_vendor.index.showToast({ title: error.message || "验证码发送失败", icon: "none" });
      }
    };
    const startCountdown = () => {
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1e3);
    };
    const login = async () => {
      if (!canLogin.value) {
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "登录中..." });
        const result = await utils_mockService.authService.login(phone.value, code.value);
        common_vendor.index.setStorageSync("token", result.token);
        common_vendor.index.setStorageSync("userInfo", result.userInfo);
        if (result.success) {
          getApp().globalData.isLogin = true;
          getApp().globalData.userInfo = result.data.userInfo;
          getApp().globalData.role = result.data.userInfo.role;
          common_vendor.index.setStorageSync("token", result.data.token);
          common_vendor.index.setStorageSync("userInfo", result.data.userInfo);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "登录成功", icon: "success" });
          common_vendor.index.switchTab({ url: "/pages/customer/services" });
        }
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        common_vendor.index.switchTab({ url: "/pages/customer/services" });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: error.message || "登录失败", icon: "none" });
      }
    };
    const goToRegister = () => {
      common_vendor.index.navigateTo({ url: "/pages/auth/register" });
    };
    return (_ctx, _cache) => {
      return {
        a: phone.value,
        b: common_vendor.o(($event) => phone.value = $event.detail.value),
        c: code.value,
        d: common_vendor.o(($event) => code.value = $event.detail.value),
        e: common_vendor.t(countdown.value > 0 ? `${countdown.value}秒后重新获取` : "获取验证码"),
        f: common_vendor.o(sendCode),
        g: countdown.value > 0,
        h: common_vendor.o(login),
        i: !canLogin.value,
        j: common_vendor.o(goToRegister)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/auth/login.js.map
