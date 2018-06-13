<template>
  <div>
    <header><button @click="goBack" >X</button><h1>{{$route.params.goodsName}}</h1></header>
    <div class="detail-container">
      <img :src="$route.params.imageUrl" alt="" >
      <p>{{ $route.params.goodsName }}</p>
      <div class="btn-bar">
        <div class="bar-left">
          <p class="price"><span>￥</span><span>{{ $route.params.goodsPrice }}</span></p>
        </div>
        <div class="bar-right">
          <div v-show="currentQuantity($route.params)" class="redu-bar">
            <div class="reduce-btn" @click="reduceInCart($route.params)">-</div>
            <div class="cur-qua">{{currentQuantity($route.params)}}</div>
          </div>
          <span class="ad-btn" @click="addCart($route.params,$event)">+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
  export default {
    data() {
      return {
      }
    },
    computed: mapState({
        getCartItem: state => state.items
      }),
    methods: {
      addCart(item,event) {
        this.addToCart(item)
        this.$emit('add-to-cart',event.target)
      },
      currentQuantity({id}) {
        const item=this.getCartItem.find(item=>item.id === id)
        return item ? item.quantity : 0
      },
      ...mapActions(['addToCart','reduceInCart']),
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  header {
    position: relative;
    width: 100%;
    height: 2.25rem;
    color: #e32d39;
    font-size: 17px;
    font-weight: 700;
    line-height: 2.25rem;
    text-align: center;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: border-box;
    background-color: #fff;
    z-index: 99;  
  }
  header button {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    line-height: 100%;
    width: 35px;
    background-color: transparent;
    border: 0;
    font-size: 18px;
    font-weight: normal;
    color: #e32d39;
  }
  header h1 {
    margin: 0;
    padding: 0;
    font-size: 17px;
    font-weight: 700;
  }
  .detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .detail-container img {
    width: 10rem;
    height: 10rem;
    margin-top: 2.25rem;
  }
  .detail-container p {
    height: 1.5rem;
    line-height: 1.5rem;
    padding: .5rem 1rem;
    font-size: 12px;
    color: #948c8c;
    margin: 0;
  }
  .btn-bar {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    display: flex;
    color: #e32d39;
    border: 1px solid #d6d3d3;
    box-sizing: border-box;
    box-shadow: 0 0 .4rem rgba(64,64,64,.16)!important;
  }
  .bar-left {
    width: 50%;
  }
  .bar-left p {
    padding: 0 20px;;
    height: 100%;
    line-height: 3rem;
    font-size: 35px;
    color: #e32d39;
  }
  .bar-left span:first-child {
    font-size: 16px;
    vertical-align: middle;
  }
  .bar-right {
    padding: 0 20px;
    width: 50%;
    display: flex;
    justify-content: flex-end;
  }
  .redu-bar {
    width: 3.9rem;
  }
  .cur-qua{
    display: inline-block;
    text-align: center;
    width: 1.75rem;
    height: 1.75rem;
    line-height: 1.75rem;
    margin-top: .5rem;
    padding: 0;
    color: #000;
  }
  .reduce-btn {
    text-align: center;
    font-weight: 700;
    margin-top: .5rem;
    line-height: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
    display: inline-block;
    border: 1px solid #d6d3d3;
    border-radius: 50%;
  }
  .ad-btn {
    text-align: center;
    font-weight: 700;
    margin-top: .5rem;
    line-height: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
    display: inline-block;
    border: 1px solid #d6d3d3;
    border-radius: 50%;
  }
</style>