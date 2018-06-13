<template>
  <div class="container">
    <!-- 导航栏滚动列表 -->
    <div class="nav"  ref="nav" :style="{'height': navHeight +'px' }" >
      <ul class="nav-content" id="nav" ref="navList">
        <li v-for="(item,index) in goodsNav" :key="index" @click="selectNav(index,$event)" :class="{'active':currentIndex === index}"><img :src="item.imageUrl" ><span>{{item.navName}}</span></li>
      </ul>
    </div>
    <!-- 商品栏滚动列表 -->
    <div class="group-list" ref="groups" :style="{'height': navHeight +'px' }" >
      <ul class="group-content" ref="listGroup">
        <li v-for="(floor,index) in goodsList" :key="index" >
          <h2 class="floor-title" >{{floor.name}}</h2>
          <ul class="floor-item">
            <li v-for="(item,index) in floor.items" :key="index" class="goods-item">
              <img v-lazy="item.imageUrl" alt="" class="goods-img" @click="turnToDetail(item)">
              <div class="goods-box" >
                <p>{{item.goodsName}}</p>
                <p>￥<span>{{item.goodsPrice}}</span></p>
              </div>
              <div v-show="currentQuantity(item)">
                <div class="reduce-btn" @click="reduceInCart(item)">-</div>
                <div class="cur-qua">{{currentQuantity(item)}}</div>
              </div>
              <div class="add-btn" @click="addCart(item,$event)" >+</div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="fix-title" ref="fixed" v-show="fixedTitle">
      {{fixedTitle}}
    </div>
  </div>
</template>

<script>
 import Bscroll from 'better-scroll'
 import { mapState, mapActions, mapGetters } from 'vuex'
  export default {
    data() {
      return {
        navHeight: 0,
        scrollY: 0,
        listHeight:[],
        savePosition: 0
      }
    },
    props: [ 'goodsNav', 'floorHeight', 'goodsList' ],
    computed:{
      currentIndex() {
        for(let i=0;i< this.listHeight.length;i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i+1];
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
            return i;
          }
        }
        return 0;
      },
      fixedTitle() {
        return this.goodsList[this.currentIndex] ? this.goodsList[this.currentIndex].name : ''
      },
      ...mapState({
        getCartItem: state => state.items
      }),
      ...mapGetters(['getTotalPrice','getTotalQuantity'])
    },
    methods: {
      _calculateHeight() {
        let list = this.$refs.listGroup.children  
        let height = 0
        this.listHeight.push(height)
        for(let i=0;i<list.length;i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      currentQuantity({id}) {
        const item=this.getCartItem.find(item=>item.id === id)
        return item ? item.quantity : 0
      },
      selectNav(index,event) {
        if(!event._constructed) {
          return ;
        }
        let list = this.$refs.listGroup.children
        let el = list[index];
        this.goodsScroll.scrollToElement(el,100);
      },
      addCart(item,event) {
        this.addToCart(item)
        this.$emit('add-to-cart',event.target)
      },
      ...mapActions(['addToCart','reduceInCart']),
      turnToDetail(item) {
        this.$emit('turn-to-detail',item)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.navScroll = new Bscroll(this.$refs.nav, {
          bounceTime: 500,
          swipeTime: 500,
          swipeBounceTime: 300
        }) 
        this.goodsScroll = new Bscroll(this.$refs.groups, {
          probeType : 3
        }) 
        this.goodsScroll.on('scroll',(pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      })
    },
    // keep-alive缓存组件进入钩子
    // 防止更改dom后滚动错误，refresh刷新滚动实例，并滚动到上次组件离开时位置
    activated() {
      this.$nextTick(()=>{
        this.goodsScroll.refresh()
        this.goodsScroll.scrollTo(0,this.savePosition)
      })
    },
    // keep-alive缓存组件离开钩子
    // 离开时保存当前滚动位置
    deactivated() {
      this.savePosition = this.goodsScroll.y
    },
    watch: {
      floorHeight: function(val, oldVal) {
        this.navHeight = val
      },
      goodsList: function() { 
        this.$nextTick(()=>{
          this._calculateHeight()
        })
      },
      currentIndex: function(val) {
        let list=this.$refs.navList.children
        this.navScroll.scrollToElement(list[val])
      },
    }
  }
</script>

<style scoped>
.container {
  position: relative;
  display: flex;
}
.nav {
  position: relative;
  overflow: hidden;
  width: 3rem;
  margin: 0;
}
.nav ul {
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  font-size: 10px;
}
.nav li {
  position: relative;
  height: 4rem;
}
.nav li.active {
  background: #fff;
}
.nav li.active::before {
  content: '';
  display: block;
  height: .25rem;
  width: 100%;
  border-radius: 0 0 .25rem 0/0 0 .25rem 0;
  background: #f2f2f2;
}
.nav li.active::after {
  position: absolute;
  bottom: 0;
  content: '';
  display: block;
  height: .25rem;
  width: 100%;
  border-radius: 0 .25rem 0 0/0 .25rem 0 0;
  background: #f2f2f2;
}
.nav li img {
  position: absolute;
  top: .6rem;
  left: .5rem;
  width: 2rem;
  height: 2rem;
}
.nav li span {
  position: absolute;
  top: 2.65rem;
  display: block;
  width: 100%;
  height: 12px;
  line-height: 12px;
  text-align: center;
  color: gray;
}
.group-list {
  margin:0 10px;
  position: relative;
  overflow: hidden;
  flex: 1;
}
.floor-title {
  height: 1.25rem;
  font-size: 12px;
  border-bottom: 1px solid #e8e7e7;
  margin: 0;
  line-height: 1.25rem;
  font-weight: normal;
  color: grey;
  text-align: center;
}
.floor-item {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.floor-item li {
  position: relative;
  padding:0 10px;
  height: 8rem;
  border-bottom: 1px solid #e8e7e7;
  box-sizing: border-box;
}
.floor-item li img{
  width: 7rem;
  height: 7rem;
  margin: .5rem 0;
}
.floor-item li {
  display: flex;
  font-size: 14px;
  font-weight: 700;
}
.goods-box {
  flex: 1;
  margin-top: .9rem;
}
.goods-box p {
  position: relative;
  margin: 0;
  text-align: right;
}
.goods-box p:last-child {
  color: #e02d3f;
  vertical-align: text-top;
  font-size: 12px;
}
.goods-box p span {
  position: relative;
  top: 6px;
  font-size: 25px;
  font-weight: 500;
}
.add-btn {
  position: absolute;
  right: .5rem;
  bottom: 1rem;
  width: 1.75rem;
  height: 1.75rem;
  line-height: 1.75rem;
  font-size: 22px;
  font-weight: 500;
  color: #e02d3f;
  border: 1px solid #d6d3d3;
  border-radius: 50%;
  text-align: center;
  background-color: #ffffff;
}
.reduce-btn {
  position: absolute;
  right: 3.5rem;
  bottom: 1rem;
  width: 1.75rem;
  height: 1.75rem;
  line-height: 1.75rem;
  font-size: 25px;
  font-weight: 500;
  color: #e02d3f;
  border: 1px solid #d6d3d3;
  border-radius: 50%;
  text-align: center;
  background-color: #ffffff;
}
.cur-qua {
  position: absolute;
  right: 2.3rem;
  bottom: 1rem;
  height: 35px;
  line-height: 35px;
  font-size: 18px;
  font-weight: normal;
  text-align: center;
  width: 1rem;
}
.fix-title {
  position: absolute;
  right: .25rem;
  height: 1.25rem;
  width: 14.7rem;
  font-size: 12px;
  border-bottom: 1px solid #e8e7e7;
  border-top: 1px solid #e8e7e7;
  margin: 0;
  line-height: 1.25rem;
  font-weight: normal;
  color: #e02d3f;
  text-align: center;
  background-color: #fff;
  z-index: 5;
}
</style>