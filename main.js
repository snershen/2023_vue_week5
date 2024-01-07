// import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

import Modal from "./component/modal.js";
import ToastMixin from "./mixin/toastMixin.js";

const apiBaseUrl = "https://ec-course-api.hexschool.io/v2";
const apiPathUrl = "escaperoom";
const apiFullUrl = `${apiBaseUrl}/api/${apiPathUrl}`;

const app = Vue.createApp({
  data() {
    return {
      productList: [],
      tempProduct: {},
      cartList: [],
      isLoading: false,
      btnStatus: { productId: "" },
      userData: {
        data: {
          user: {
            name: "",
            email: "",
            tel: "",
            address: "",
          },
          message: "",
        },
      },
    };
  },
  components: { Modal },
  mixins: [ToastMixin],
  methods: {
    getProduct() {
      const apiUrl = `${apiFullUrl}/products`;
      this.isLoading = true;
      axios
        .get(apiUrl)
        .then((res) => {
          this.productList = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProductDetail(product) {
      this.tempProduct = product;
      const productModal = this.$refs.productModal;
      productModal.showModal();
    },
    getCart() {
      const apiUrl = `${apiFullUrl}/cart`;
      axios
        .get(apiUrl)
        .then((res) => {
          this.cartList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addCart(product, num = 1) {
      const apiUrl = `${apiFullUrl}/cart`;
      const info = {
        data: {
          product_id: product.id,
          qty: num,
        },
      };
      this.btnStatus.productId = product.id;
      axios
        .post(apiUrl, info)
        .then((res) => {
          this.getCart();
          const productModal = this.$refs.productModal;
          this.btnStatus.productId = "";
          productModal.hideModal();
          this.showToast({
            icon: "success",
            title: "已成功加入購物車",
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    delCart(product) {
      const apiUrl = `${apiFullUrl}/cart/${product.id}`;
      this.isLoading = true;
      axios
        .delete(apiUrl)
        .then((res) => {
          this.isLoading = false;
          this.getCart();
          this.showToast({
            icon: "success",
            title: "已移除商品",
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    delAllCart() {
      const apiUrl = `${apiFullUrl}/carts`;

      Swal.fire({
        title: "確定移除所有商品？",
        icon: "info",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "取消",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.isLoading = true;
          axios
            .delete(apiUrl)
            .then((res) => {
              this.isLoading = false;
              Swal.fire("已刪除所有商品", "", "success");
              this.getCart();
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              this.isLoading = false;
            });
        }
      });
    },
    updateCart(product) {
      const apiUrl = `${apiFullUrl}/cart/${product.id}`;
      let cartQty = product.qty;
      const info = {
        data: {
          product_id: product.id,
          qty: cartQty,
        },
      };
      this.isLoading = true;
      axios
        .put(apiUrl, info)
        .then((res) => {
          this.isLoading = false;
          this.getCart();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    submitOrder() {
      const apiUrl = `${apiFullUrl}/order`;
      if (this.cartList.carts) {
        this.showToast({
          icon: "error",
          title: "購物車是空的",
        });
        return;
      }
      axios
        .post(apiUrl, this.userData)
        .then((res) => {
          console.log(res);
          this.showToast({
            icon: "success",
            title: "成功送出訂單",
          });
        })
        .catch((err) => {
          console.log(err);
          this.showToast({
            icon: "error",
            title: "訂單送出失敗",
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.getProduct();
    this.getCart();
  },
});

// 加入全部的規則
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL("https://unpkg.com/@vee-validate/i18n@4.0.2/dist/locale/zh_TW.json");
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true,
});

app.component("loading", VueLoading.Component);

app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

app.mount("#app");
