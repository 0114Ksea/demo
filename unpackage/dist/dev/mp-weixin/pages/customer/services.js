"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockService = require("../../utils/mockService.js");
const _sfc_main = {
  data() {
    return {
      serviceList: [],
      loading: true,
      currentPage: 1,
      hasMore: true,
      pageSize: 10
    };
  },
  onLoad() {
    this.fetchServiceList();
  },
  onPullDownRefresh() {
    this.fetchServiceList(1, true);
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.fetchServiceList(this.currentPage + 1);
    }
  },
  methods: {
    async fetchServiceList(page = 1, isRefresh = false) {
      if (this.loading || !isRefresh && !this.hasMore) {
        return;
      }
      this.loading = true;
      try {
        const res = await utils_mockService.serviceService.getServiceList(page, this.pageSize);
        if (res.success) {
          const data = res.data;
          if (isRefresh) {
            this.serviceList = data.list;
            this.currentPage = 1;
            this.hasMore = data.list.length === this.pageSize;
          } else {
            this.serviceList = [...this.serviceList, ...data.list];
            this.currentPage = page;
            this.hasMore = data.list.length === this.pageSize;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/customer/services.vue:97", "获取服务列表失败", error);
        common_vendor.index.showToast({
          title: "获取服务列表失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
        common_vendor.index.stopPullDownRefresh();
      }
    },
    navigateToDetail(serviceId) {
      common_vendor.index.navigateTo({
        url: `/pages/customer/service-detail?id=${serviceId}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.serviceList.length > 0
  }, $data.serviceList.length > 0 ? {
    b: common_vendor.f($data.serviceList, (service, k0, i0) => {
      return {
        a: service.image,
        b: common_vendor.t(service.name),
        c: common_vendor.t(service.description),
        d: common_vendor.t(service.merchant.name),
        e: common_vendor.t(service.merchant.rating),
        f: common_vendor.t(service.duration),
        g: common_vendor.t(service.sales),
        h: common_vendor.t(service.price),
        i: service.id,
        j: common_vendor.o(($event) => $options.navigateToDetail(service.id), service.id)
      };
    })
  } : {}, {
    c: $data.loading
  }, $data.loading ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-66233b0b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/customer/services.js.map
