<template>
  <div id="app">
      <div class="app-container">
        <!-- keep-alive组件缓存主页状态，确保由详情页切换回商品列表时无需重新加载-->
        <keep-alive>
          <router-view @add-to-cart="addToCart" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view @add-to-cart="addToCart" v-if="!$route.meta.keepAlive"></router-view>
        <!-- 控制购物车显示用vuex中商品数组的长度，注意直接使用空数组判断会出错 -->
        <shop-cart class="shop-cart" v-show="getCartItem.length" ref="cart"></shop-cart>
      </div>
  </div>
</template>

<script>
import shopCart from '@/components/ShopCart'
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: mapState({
    getCartItem: state=> state.items
  }),
  components: { shopCart },
  methods: {
    addToCart(target) {
      this.$refs.cart.drop(target)
    }
  },
  mounted() {
    console.log('欢迎你，点餐请去真正的kfc宅急送网站哦')
  }
}
</script>

<style>
html, body, #app{
  height: 100%;
}
.shop-cart {
  position: fixed;
  bottom: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 3rem;
  background-color: #2965ba;
  color: #ffffff;
}
.popup-bg {
  top: -3rem;
}
.van-popup--bottom {
  bottom: 3rem;
}
.van-popup {
  transition: none;
}
</style>
