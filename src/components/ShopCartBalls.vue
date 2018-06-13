<template>
  <div>
    <!-- 博客有购物车小球动画的具体实现原理 -->
    <div class="balls-container">
      <transition-group tag="div" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div class="ball" v-for="(item,index) in balls" :key="index" v-show="item.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        balls: [
          {show:false},
          {show:false},
          {show:false}
        ],
        dropBalls: []
      }
    },
    methods: {
      drop(target) {
        for(let i=0;i<this.balls.length;i++) {
          var ball=this.balls[i]
          if(!ball.show) {
            ball.show=true
            ball.el=target
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length
        while(count--) {
          let ball = this.balls[count]
          if(ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 55
            let y = -(window.innerHeight-rect.top-45)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
            el.style.transform = `translate3d(0, ${y}px, 0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            inner.style.transform = `translate3d(${x}px, 0, 0)`
          }
        }
      },
      enter(el,done) {
        let rf = el.offsetHeight
        this.$nextTick(()=>{
          el.style.webkitTransform = 'translate3d(0, 0, 0)'
          el.style.transform = 'translate3d(0, 0, 0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0, 0, 0)'
          inner.style.transform = 'translate3d(0, 0, 0)'
          el.addEventListener('transitionend', done)
        })
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift()
        if(ball) {
          ball.show = false
          el.style.display = 'none' 
        }
      }
    }
  }
</script>

<style scoped>
.ball {
  position: absolute;
  top: 10px;
  left: 45px;
}
.v-enter-active {
  transition: all .4s cubic-bezier(0.27,-0.25,0.83,0.24);
}
.inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e02d3f;
  transition:all .4s linear;
}
</style>