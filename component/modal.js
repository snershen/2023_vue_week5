export default {
  data() {
    return {
      modal: {},
      tempProduct: {},
    };
  },
  methods: {
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  props: {
    product: {
      type: Object,
      default: {},
    },
  },
  watch: {
    product() {
      this.tempProduct = { ...this.product, qty: 1 };
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
  template: `<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
 <div class="modal-content border-0">
   <div class="modal-header bg-dark text-white">
     <h5 class="modal-title" id="exampleModalLabel">
       <span>{{ product.title }}</span>
   </h5>
     <button type="button" class="btn-close"
             data-bs-dismiss="modal" aria-label="Close"></button>
   </div>
   <div class="modal-body">
     <div class="row">
       <div class="col-sm-6">
         <img class="img-fluid object-fit-cover w-100 mb-4 mb-lg-0" :src="product.imageUrl" alt="" style="height:300px">
   </div>
       <div class="col-sm-6">
         <h4>{{ product.title }}</h4>  
         <span class="badge bg-primary rounded-pill mb-2">{{ product.category }}</span>
         <p>商品描述：{{ product.description }}</p>
         <p>商品內容：{{ product.content }}</p>
         <del class="h6">原價 {{ product.origin_price }} 元</del>
         <div class="h5">現在只要 {{ product.price }} 元</div>
         <div>
           <div class="input-group">
             <input type="number" class="form-control"
                    min="1" v-model="tempProduct.qty">
             <button type="button" class="btn btn-primary" @click.prevent="$emit('add-product',tempProduct, tempProduct.qty)">加入購物車</button>
   </div>
  `,
};
