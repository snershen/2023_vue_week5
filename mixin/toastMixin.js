export default {
  methods: {
    showToast(options) {
      return Swal.mixin({
        toast: true,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
        ...options,
      }).fire();
    },
  },
};
