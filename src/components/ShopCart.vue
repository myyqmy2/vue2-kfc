<template>
  <div>
    <div class="cart-container" v-show="getCartItem">
      <div class="cart-left" @click="changeList">
        <shop-cart-balls ref="ball"></shop-cart-balls>
        <img src="../assets/images/car.png" alt="">
        <div class="cart-quenity">{{getTotalQuantity}}</div>
        <div class="cart-text">
          <div>￥<span>{{getTotalPrice | toMoney}}</span></div>
          <div>另需配送费：￥9.0</div>
        </div>
      </div>
      <div class="cart-right">选好了<span> &gt; </span></div>
      <van-popup v-model="show" position="bottom" overlay-class="popup-bg">
          <div class="cart-list">
            <ul>
              <li v-for="(item,index) in getCartItem" :key="index">
                <div class="list-left">
                  <p class="list-name">{{item.goodsName}}</p>
                  <p class="list-price"><span>￥</span>{{item.goodsPrice}}</p>
                </div>
                <div class="list-right">
                  <span class="redu-btn" @click="reduceInCart(item)">-</span>
                  <span class="list-quantity">{{item.quantity}}</span>
                  <span class="ad-btn" @click="addToCart(item)">+</span>
                </div>
              </li>
            </ul>
          </div>
        </van-popup>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import shopCartBalls from './ShopCartBalls'
  export default {
    data() {
      return {
        show: false
      }
    },
    components: { shopCartBalls },
    computed: {
      ...mapState({
        getCartItem: state => state.items
      }),
      ...mapGetters(['getTotalPrice','getTotalQuantity']),
    },
    methods: {
      changeList() {
        this.show = !this.show
      },
      ...mapActions(['addToCart','reduceInCart']),
      drop(target) {
        this.$refs.ball.drop(target)
      }
    },
    filters:{
      toMoney(val=0) {
        return val.toFixed(1)
      }
    },
    watch: {
      getCartItem: function(val) {
        if(val.length===0) {
          this.show=false
        }
      }
    }
  }
</script>

<style>
.cart-container {
  display: flex;
  height: 100%;
  width: 100%;
}
.cart-left {
  position: relative;
  width: 12rem;
  box-sizing: border-box;
  padding-left: .5rem;
}
.cart-left img {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2rem;
  height: 2rem;
  margin: auto 0;
}
.cart-quenity {
  position: absolute;
  top: .25rem;
  left: 2rem;
  font-size: 13px;
  width: .9rem;
  height: .9rem;
  border-radius: 50%;
  background-color: #ffa136;
  text-align: center;
}
.cart-text {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 43px;
  margin: auto 0;
  margin-left: 2.5rem;
  font-size: 12px;
  display: inline-block;
}
.cart-text span {
  font-size: 20px;
}
.cart-text div:last-child {
  color: #bbc9e7;
}
.cart-right {
  font-size: 18px;
  flex:1;
  text-align: center;
  line-height: 3rem;
  border-left: 1px solid #5688cf;
}
.cart-right span {
  color: #bbc9e7;
}
.cart-list ul{
  color: #000;
  padding: 0;
  margin: 0;
}
.cart-list ul li {
  display: flex;
  padding: 0;
  margin: 0;
  height: 3rem;
  padding: 5px;
  border-bottom: 1px solid #e7e3e4;
}
.cart-list ul li p {
  margin: 0;
  height: 1.5rem;
  font-size: 16px;
  line-height: 1.5rem;
}
.list-left {
  width: 12rem;
}
.list-right{
  flex:1;
  text-align: center;
  font-size: 18px;
  line-height: 3rem;
}
.redu-btn {
  display: inline-block;
  margin-right: .3rem;
  width: 1.5rem;
  height: 1.5rem;
  line-height: 1.5rem;
  border: 1px solid #e7e3e4;
  border-radius: 50%;
  color: #e02d3f;
}
.ad-btn {
  display: inline-block;
  margin-left: .3rem;
  width: 1.5rem;
  height: 1.5rem;
  line-height: 1.5rem;
  border: 1px solid #e7e3e4;
  border-radius: 50%;
  color: #e02d3f;
}
.list-name {
  font-weight: 400;
}
.list-price {
  color: #e02d3f;
  font-size: 20px !important;
}
.list-price span {
  font-size: 14px;
}
</style>