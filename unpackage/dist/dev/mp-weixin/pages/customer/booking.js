"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockService = require("../../utils/mockService.js");
if (!Array) {
  const _component_u_datetime_picker = common_vendor.resolveComponent("u-datetime-picker");
  const _component_u_input = common_vendor.resolveComponent("u-input");
  const _component_u_button = common_vendor.resolveComponent("u-button");
  (_component_u_datetime_picker + _component_u_input + _component_u_button)();
}
const _sfc_main = {
  __name: "booking",
  setup(__props) {
    const service = common_vendor.ref({
      id: "",
      name: "",
      price: 0,
      duration: 0,
      merchant: {
        id: "",
        name: ""
      }
    });
    const loading = common_vendor.ref(false);
    const submitLoading = common_vendor.ref(false);
    const dateTime = common_vendor.ref("");
    const selectedDate = common_vendor.ref("");
    const selectedSlot = common_vendor.ref("");
    const remark = common_vendor.ref("");
    const contactName = common_vendor.ref("");
    const contactPhone = common_vendor.ref("");
    const availableSlots = common_vendor.ref([]);
    const minDate = common_vendor.ref(/* @__PURE__ */ new Date());
    const maxDate = common_vendor.ref(() => {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() + 30);
      return date;
    })();
    const fetchServiceDetail = async (serviceId) => {
      if (loading.value)
        return;
      loading.value = true;
      try {
        const res = await utils_mockService.serviceService.getServiceDetail(serviceId);
        if (res.success) {
          service.value = res.data;
        } else {
          common_vendor.index.showToast({ title: "获取服务详情失败", icon: "none" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/customer/booking.vue:157", "获取服务详情失败", error);
        common_vendor.index.showToast({ title: "获取服务详情失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const submitBooking = async () => {
      if (submitLoading.value)
        return;
      if (!selectedDate.value) {
        common_vendor.index.showToast({ title: "请选择预约日期", icon: "none" });
        return;
      }
      if (!selectedSlot.value) {
        common_vendor.index.showToast({ title: "请选择预约时间段", icon: "none" });
        return;
      }
      if (!contactName.value.trim()) {
        common_vendor.index.showToast({ title: "请输入联系人姓名", icon: "none" });
        return;
      }
      if (!contactPhone.value || contactPhone.value.length !== 11) {
        common_vendor.index.showToast({ title: "请输入正确的联系电话", icon: "none" });
        return;
      }
      submitLoading.value = true;
      try {
        const app = getApp();
        if (!app.globalData.isLogin) {
          common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/auth/login" });
          }, 1e3);
          return;
        }
        const bookingData = {
          serviceId: service.value.id,
          bookingTime: dateTime.value,
          contactName: contactName.value,
          contactPhone: contactPhone.value,
          remark: remark.value
        };
        const res = await utils_mockService.orderService.createBooking(bookingData);
        if (res.success) {
          common_vendor.index.showToast({ title: "预约成功", icon: "success" });
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: "/pages/customer/orders"
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: res.message || "预约失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/customer/booking.vue:241", "预约失败", error);
        common_vendor.index.showToast({ title: "预约失败", icon: "none" });
      } finally {
        submitLoading.value = false;
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
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(service.value.name),
        b: common_vendor.t(service.value.merchant.name),
        c: common_vendor.t(service.value.price),
        d: common_vendor.o(_ctx.handleDateConfirm),
        e: common_vendor.o(($event) => dateTime.value = $event),
        f: common_vendor.p({
          mode: "date",
          ["min-date"]: minDate.value,
          ["max-date"]: common_vendor.unref(maxDate),
          placeholder: "请选择预约日期",
          modelValue: dateTime.value
        }),
        g: availableSlots.value.length > 0
      }, availableSlots.value.length > 0 ? {
        h: common_vendor.f(availableSlots.value, (slot, k0, i0) => {
          return {
            a: common_vendor.t(slot.time),
            b: slot.time,
            c: selectedSlot.value === slot.time ? 1 : "",
            d: common_vendor.o(($event) => _ctx.selectTimeSlot(slot.time), slot.time)
          };
        })
      } : {}, {
        i: common_vendor.o(($event) => remark.value = $event),
        j: common_vendor.p({
          type: "textarea",
          placeholder: "请输入备注信息（选填）",
          maxlength: "200",
          ["show-word-limit"]: true,
          modelValue: remark.value
        }),
        k: common_vendor.o(($event) => contactName.value = $event),
        l: common_vendor.p({
          placeholder: "请输入联系人姓名",
          maxlength: "20",
          modelValue: contactName.value
        }),
        m: common_vendor.o(($event) => contactPhone.value = $event),
        n: common_vendor.p({
          type: "number",
          placeholder: "请输入联系电话",
          maxlength: "11",
          modelValue: contactPhone.value
        }),
        o: common_vendor.o(submitBooking),
        p: common_vendor.p({
          loading: submitLoading.value,
          type: "primary"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-33263869"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/customer/booking.js.map
