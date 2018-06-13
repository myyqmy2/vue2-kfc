<template>
  <div>
    <!-- 动态绑定header透明度 -->
    <header class="header-title" :style="{'opacity': setOpacity}"><span class="title-text">菜单</span></header>
    <!-- app-wrapper元素作为主页滚动的Bscroll容器 -->
    <div class="app-wrapper" ref="appWrapper" >
      <div ref="app">
        <!-- 轮播采用vue-awesome-swiper插件 -->
        <swiper :options="swiperOption" class="swiper-box">
          <swiper-slide v-for="(item,index) in swipePics" :key="index">
            <div class="swiper-zoom-container"><img :src="item.imageUrl" /></div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <!-- banner栏粘性定位实现，核心是滚动到相应位置增加固定定位样式-->
        <div class="banner" :class="{'fix': isFix}">
          <ul>
            <li v-for="(item,index) in banner" :key="index"><img :src="item.imageUrl" alt=""><span>{{item.itemName}}</span></li>
          </ul>
        </div>
        <div class="floor-container" :style="{'marginTop': contentMarginTop + 'px'}">
            <goods-container :goodsNav="goodsNav" :floorHeight="floorHeight" :goodsList="goodsList" @add-to-cart="addToCart"    @turn-to-detail="turnToDetail"></goods-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import 'swiper/dist/css/swiper.css'
import goodsContainer from './GoodsContainer'
import Bscroll from 'better-scroll'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
let throttle = require('lodash/throttle')

  export default {
    data() {
      return {
        swipePics: [],
        banner: [],
        goodsNav: [],
        goodsList: [],
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          zoom: true,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false
          }
        },
        isFix: false,
        setOpacity: 0,
        scrollTop: 0,
        headerHeight: 0,
        bannerHeight: 0,
        throttleScroll: null,
        floorHeight: 0
      }
    },
    components: { swiper, swiperSlide, goodsContainer },
    computed: {
      contentMarginTop() {
        return this.isFix ? this.bannerHeight: 0
      }
    },
    methods: {
      handleScroll() {
        this.setData()
        if(this.scrollTop >= this.headerHeight) {
          this.isFix = true
        }else {
          this.isFix = false 
        }
      },
      setData() {
        this.headerHeight = this.$el.querySelector('.swiper-box').offsetHeight - this.$el.querySelector('.header-title').offsetHeight
        this.bannerHeight = this.$el.querySelector('.banner').offsetHeight
        this.setOpacity = this.scrollTop / this.headerHeight
      },
      addToCart(target) {
        this.$emit('add-to-cart',target)
      },
      turnToDetail(item) {
        this.$router.push({name:'detailPage',params: item})
      }
    },
    // created钩子函数中获取数据
    created() {
      axios({
        url: 'https://www.easy-mock.com/mock/5b0c276fd0e51c310ce24a94/example_copy/',
        method: 'get'
      }).then(res => {
        if(res.status === 200) {
          this.swipePics = res.data.data.swipePictures;
          this.banner = res.data.data.banner;
          this.goodsNav = res.data.data.goodsNav;
          this.goodsList = res.data.data.goodsList;
        }
      }).catch(error => console.log(error))
    },
    // nextTick内容于DOM加载完毕后执行
    mounted() {
      this.$nextTick(() => {
        this.floorHeight = document.documentElement.clientHeight - this.$el.querySelector('.header-title').offsetHeight -this.$el.querySelector('.banner').offsetHeight
        this.appWrapper = new Bscroll(this.$refs.appWrapper,{
          click: true,
          probeType: 3,
          bounce: false
        })
        let htmlHeight = document.documentElement.clientHeight
        // 滚动容器高度等于设备高度
        this.$refs.appWrapper.style.height = htmlHeight + 'px'
        // 监听滚动事件，并用节流函数执行相关计算，防止抖动
        this.appWrapper.on('scroll', (pos) => {
          this.scrollTop = -pos.y
          this.throttleScroll()
        })
      })
      this.throttleScroll = throttle(this.handleScroll, 100)
    }
  }
</script>

<style>
.swiper-box {
  width: 100%;
  height: 7.9rem;
}
.swipe-box img {
  width: 100%;
  height: 100%;
}
.swiper-pagination-bullets {
  margin: 0px 3px;
  bottom: 6px!important;
}
.swiper-pagination-bullet {
  margin: 0px 3px!important;
  width: 6px;
  height: 6px;
}
.swiper-pagination-bullet-active {
    opacity: 1;
    background: #d62f35;
}
.header-title {
  position: fixed;
  top: 0;
  left: 0;
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
.title-text {
  position: relative;
  display: block;
  height: 2.25rem;
  width: 40px;
  margin: 0 auto;
  box-sizing: border-box;
  border-bottom: 8px solid #d90305;
}
.title-text::after {
  position: absolute;
  bottom: -8px;
  left: 8px;
  content: "";
  background-color: #fff;
  display: block;
  width: 8px;
  height: 9px;
}
.title-text::before {
  position: absolute;
  bottom: -8px;
  right: 8px;
  content: "";
  background-color: #fff;
  display: block;
  width: 8px;
  height: 9px;
}
.banner {
  position: relative;
  width: 100%;
  background-color: #fff;
  height: 4rem;
}
.fix {
  position: fixed;
  top: 7.9rem;
  z-index: 5;
}
.banner ul{
  height: 4rem;
  display: flex;
  font-size: 12px;
  border-bottom: 1px solid #e8e7e7;
}
.banner li {
  position: relative;
  flex: 1;
}
.banner img {
  position: absolute;
  top: 0.5rem;
  left: 2.1rem;
  width: 2rem;
  height: 2rem;
}
.banner span {
  position: absolute;
  top: 2.6rem;
  display: block;
  width: 100%;
  height: 16px;
  line-height: 16px;
  text-align: center;
}
.banner::before {
  position: absolute;
  top: -0.4rem;
  content: '';
  display: block;
  height: .5rem;
  width: 100%;
  border-radius: 10rem 10rem 0 0/.5rem .5rem 0 0;
  background: #fff;
  z-index: 3;
}
</style>