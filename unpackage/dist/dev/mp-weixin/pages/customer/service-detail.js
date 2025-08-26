"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockService = require("../../utils/mockService.js");
if (!Array) {
  const _component_u_button = common_vendor.resolveComponent("u-button");
  _component_u_button();
}
const _sfc_main = {
  __name: "service-detail",
  setup(__props) {
    const service = common_vendor.ref({
      id: "",
      name: "",
      price: 0,
      duration: 0,
      image: "",
      description: "",
      merchant: {
        id: "",
        name: "",
        rating: 0
      },
      sales: 0
    });
    const loading = common_vendor.ref(false);
    const bookingLoading = common_vendor.ref(false);
    const isFavorite = common_vendor.ref(false);
    const isFavoriteLoading = common_vendor.ref(false);
    common_vendor.ref(null);
    const fetchServiceDetail = async (serviceId) => {
      if (loading.value)
        return;
      loading.value = true;
      try {
        const res = await utils_mockService.serviceService.getServiceDetail(serviceId);
        if (res.success) {
          service.value = res.data;
          await checkFavoriteStatus(serviceId);
        } else {
          common_vendor.index.showToast({ title: "获取服务详情失败", icon: "none" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/customer/service-detail.vue:95", "获取服务详情失败", error);
        common_vendor.index.showToast({ title: "获取服务详情失败", icon: "none" });
        loading.value = false;
      } finally {
        loading.value = false;
      }
    };
    const checkFavoriteStatus = async (serviceId) => {
      try {
        const app = getApp();
        if (app.globalData.isLogin && app.globalData.userInfo) {
          const res = await utils_mockService.favoriteService.checkFavorite(serviceId);
          isFavorite.value = res.success && res.data;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/customer/service-detail.vue:112", "检查收藏状态失败", error);
      }
    };
    const toggleFavorite = async () => {
      if (isFavoriteLoading.value)
        return;
      const app = getApp();
      if (!app.globalData.isLogin) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/auth/login" });
        }, 1e3);
        return;
      }
      isFavoriteLoading.value = true;
      try {
        const res = await utils_mockService.favoriteService.toggleFavorite(service.value.id);
        if (res.success) {
          isFavorite.value = res.data;
          common_vendor.index.showToast({
            title: isFavorite.value ? "收藏成功" : "取消收藏",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({ title: res.message || "操作失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/customer/service-detail.vue:143", "操作失败", error);
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      } finally {
        isFavoriteLoading.value = false;
      }
    };
    const goToBooking = async () => {
      if (bookingLoading.value)
        return;
      bookingLoading.value = true;
      try {
        const app = getApp();
        if (!app.globalData.isLogin) {
          common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/auth/login" });
          }, 1e3);
          return;
        }
        common_vendor.index.navigateTo({
          url: `/pages/customer/booking?id=${service.value.id}`
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/customer/service-detail.vue:172", "跳转失败", error);
      } finally {
        bookingLoading.value = false;
      }
    };
    onLoad((options) => {
      if (options && options.id) {
        fetchServiceDetail(options.id);
      } else {
        common_vendor.index.showToast({ title: "参数错误", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    });
    onShow(() => {
      if (service.value.id) {
        checkFavoriteStatus(service.value.id);
      }
    });
    return (_ctx, _cache) => {
      return {
        a: service.value.image,
        b: common_vendor.t(service.value.name),
        c: common_vendor.t(service.value.price),
        d: common_vendor.t(service.value.sales),
        e: common_vendor.t(service.value.merchant.rating),
        f: common_vendor.t(service.value.duration),
        g: common_vendor.t(service.value.merchant.name),
        h: common_vendor.t(service.value.merchant.rating),
        i: common_vendor.t(service.value.description),
        j: common_vendor.t(service.value.price),
        k: common_vendor.n(isFavorite.value ? "active" : ""),
        l: common_vendor.t(isFavorite.value ? "已收藏" : "收藏"),
        m: common_vendor.o(toggleFavorite),
        n: common_vendor.p({
          loading: isFavoriteLoading.value,
          type: "text"
        }),
        o: common_vendor.o(goToBooking),
        p: common_vendor.p({
          loading: bookingLoading.value,
          type: "primary"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b31c5926"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/customer/service-detail.js.map
