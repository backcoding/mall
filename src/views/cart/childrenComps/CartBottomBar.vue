<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :is-checked="isSelectAll" @click.native="checkClick" />
      <span>全选</span>
      <span class="price">合计:¥{{ totalPrice }}</span>
    </div>

    <div class="calculate" @click="calcClick">去结算({{ checkLength }})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import { mapGetters } from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return this.cartList
        .filter(item => {
          return item.checked;
        })
        .reduce((perValue, item) => {
          return perValue + item.price * item.count;
        }, 0)
        .toFixed(2);
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      return(
        // this.cartList.filter(item => !item.checked).length === 0 &&
        // find方法性能更高
        !this.cartList.find(item => !item.checked) && this.cartList.length !== 0
      ) 
    }
  },
  methods:{
    calcClick() {
      let cartLength = this.cartList.filter(item => item.checked === true).length
      if(!cartLength) {
        this.$toast.show("请选择要购买的商品", 2000)
      }else{
        this.$toast.show("非常抱歉~暂不支持购买")
      }
      
    },
    checkClick(){
       const select = this.isSelectAll;
       this.$store.state.cartList.map(item => (item.checked = !select));
    }
  }
};
</script>

<style scoped>
.bottom-bar {
  height: 40px;
  background-color: #eee;
  line-height: 40px;
  position: fixed;
  bottom: 49px;
  left: 0;
  right: 0;
  font-size: 14px;
}

.check-content {
  display: flex;
  align-items: center;
}

.check-button {
  margin-left: 5px;
  margin-right: 5px;
  display: flex;
  justify-content: center;
}

.price {
  margin-left: 30px;
}

.calculate {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  background-color: orangered;
  color: white;
  text-align: center;
}
</style>
