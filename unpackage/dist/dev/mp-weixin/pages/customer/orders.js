"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockService = require("../../utils/mockService.js");
if (!Array) {
  const _component_u_button = common_vendor.resolveComponent("u-button");
  _component_u_button();
}
const _sfc_main = {
  __name: "orders",
  setup(__props) {
    const orderList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const selectedStatus = common_vendor.ref("");
    common_vendor.ref(null);
    const formatDate = (dateString) => {
      if (!dateString)
        return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const getStatusText = (status) => {
      const statusMap = {
        pending: "待确认",
        confirmed: "已确认",
        completed: "已完成",
        canceled: "已取消"
      };
      return statusMap[status] || status;
    };
    const fetchOrderList = async (status = "") => {
      if (loading.value)
        return;
      loading.value = true;
      try {
        const res = await utils_mockService.orderService.getMyOrders(status);
        if (res.success) {
          orderList.value = res.data.list || res.data;
        } else {
          orderList.value = [];
          common_vendor.index.showToast({ title: "获取订单列表失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/customer/orders.vue:139", "获取订单列表失败", error);
        common_vendor.index.showToast({ title: "获取订单列表失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const selectStatus = (status) => {
      selectedStatus.value = status;
      fetchOrderList(status);
    };
    const cancelOrder = async (orderId) => {
      common_vendor.index.showModal({
        title: "取消预约",
        content: "确定要取消此预约吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_mockService.orderService.updateOrderStatus(orderId, "canceled");
              if (result.success) {
                common_vendor.index.showToast({ title: "取消成功", icon: "success" });
                fetchOrderList(selectedStatus.value);
              } else {
                common_vendor.index.showToast({ title: result.message || "取消失败", icon: "none" });
              }
            } catch (error) {
              common_vendor.index.showToast({ title: "操作失败", icon: "none" });
            }
          }
        }
      });
    };
    const contactMerchant = (merchantId) => {
      common_vendor.index.makePhoneCall({
        phoneNumber: "400-123-4567",
        // 模拟商家电话
        success: () => {
          common_vendor.index.__f__("log", "at pages/customer/orders.vue:181", "拨打电话成功");
        },
        fail: () => {
          common_vendor.index.__f__("log", "at pages/customer/orders.vue:184", "拨打电话失败");
        }
      });
    };
    const viewService = (serviceId) => {
      common_vendor.index.navigateTo({
        url: `/pages/customer/service-detail?id=${serviceId}`
      });
    };
    common_vendor.watchEffect(() => {
      fetchOrderList();
    });
    onShow(() => {
      fetchOrderList(selectedStatus.value);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: selectedStatus.value === "" ? 1 : "",
        b: common_vendor.o(($event) => selectStatus("")),
        c: selectedStatus.value === "pending" ? 1 : "",
        d: common_vendor.o(($event) => selectStatus("pending")),
        e: selectedStatus.value === "confirmed" ? 1 : "",
        f: common_vendor.o(($event) => selectStatus("confirmed")),
        g: selectedStatus.value === "completed" ? 1 : "",
        h: common_vendor.o(($event) => selectStatus("completed")),
        i: selectedStatus.value === "canceled" ? 1 : "",
        j: common_vendor.o(($event) => selectStatus("canceled")),
        k: orderList.value.length > 0
      }, orderList.value.length > 0 ? {
        l: common_vendor.f(orderList.value, (order, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(order.merchantName),
            b: common_vendor.t(getStatusText(order.status)),
            c: common_vendor.n(order.status),
            d: common_vendor.t(order.serviceName),
            e: common_vendor.t(order.price),
            f: common_vendor.t(formatDate(order.date)),
            g: common_vendor.t(order.time),
            h: common_vendor.t(order.contactName),
            i: common_vendor.t(order.contactPhone),
            j: order.status === "pending"
          }, order.status === "pending" ? {
            k: common_vendor.o(($event) => cancelOrder(order.id), order.id),
            l: "27d44dcb-0-" + i0,
            m: common_vendor.p({
              type: "text"
            })
          } : order.status === "confirmed" ? {
            o: common_vendor.o(($event) => contactMerchant(), order.id),
            p: "27d44dcb-1-" + i0,
            q: common_vendor.p({
              type: "text"
            })
          } : order.status === "completed" ? {
            s: common_vendor.o(($event) => viewService(order.serviceId), order.id),
            t: "27d44dcb-2-" + i0,
            v: common_vendor.p({
              type: "text"
            })
          } : {}, {
            n: order.status === "confirmed",
            r: order.status === "completed",
            w: order.id
          });
        })
      } : {}, {
        m: loading.value
      }, loading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-27d44dcb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/customer/orders.js.map
