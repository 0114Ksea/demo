"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockService = require("../../utils/mockService.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const phone = common_vendor.ref("");
    const code = common_vendor.ref("");
    const countDown = common_vendor.ref(0);
    const role = common_vendor.ref("customer");
    const sendCode = async () => {
      if (!phone.value || phone.value.length !== 11) {
        common_vendor.index.showToast({ title: "请输入正确的手机号码", icon: "none" });
        return;
      }
      try {
        const res = await utils_mockService.authService.sendCode(phone.value);
        if (res.success) {
          common_vendor.index.showToast({ title: "验证码发送成功" });
          startCountDown();
        } else {
          common_vendor.index.showToast({ title: res.message || "发送失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/auth/register.vue:56", "发送验证码失败", error);
        common_vendor.index.showToast({ title: "发送失败，请重试", icon: "none" });
      }
    };
    const startCountDown = () => {
      countDown.value = 60;
      const timer = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) {
          clearInterval(timer);
        }
      }, 1e3);
    };
    const register = async () => {
      if (!phone.value || phone.value.length !== 11) {
        common_vendor.index.showToast({ title: "请输入正确的手机号码", icon: "none" });
        return;
      }
      if (!code.value || code.value.length !== 6) {
        common_vendor.index.showToast({ title: "请输入6位验证码", icon: "none" });
        return;
      }
      try {
        const res = await utils_mockService.authService.register(phone.value, code.value, role.value);
        if (res.success) {
          const app = getApp();
          app.globalData.isLogin = true;
          app.globalData.userInfo = res.data.userInfo;
          app.globalData.role = res.data.userInfo.role;
          common_vendor.index.setStorageSync("token", res.data.token);
          common_vendor.index.setStorageSync("userInfo", res.data.userInfo);
          common_vendor.index.showToast({ title: "注册成功" });
          setTimeout(() => {
            common_vendor.index.switchTab({ url: "/pages/customer/services" });
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: res.message || "注册失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/auth/register.vue:109", "注册失败", error);
        common_vendor.index.showToast({ title: "注册失败，请重试", icon: "none" });
      }
    };
    const selectRole = (selectedRole) => {
      role.value = selectedRole;
    };
    return (_ctx, _cache) => {
      return {
        a: phone.value,
        b: common_vendor.o(($event) => phone.value = $event.detail.value),
        c: code.value,
        d: common_vendor.o(($event) => code.value = $event.detail.value),
        e: common_vendor.t(countDown.value > 0 ? `${countDown.value}秒后重发` : "获取验证码"),
        f: countDown.value > 0,
        g: common_vendor.o(sendCode),
        h: common_vendor.o(register),
        i: common_vendor.n(role.value === "customer" ? "active" : ""),
        j: common_vendor.o(($event) => selectRole("customer")),
        k: common_vendor.n(role.value === "merchant" ? "active" : ""),
        l: common_vendor.o(($event) => selectRole("merchant"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4bb68961"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/auth/register.js.map
