import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items:[]
  },
  getters: {
    getTotalPrice(state) {
      return state.items.map((item)=>item.quantity*item.goodsPrice).reduce((x,y)=>x+y,0)
    },
    getTotalQuantity(state) {
      return state.items.map((item)=>item.quantity).reduce((x,y)=>x+y,0)
    },
  },
  mutations: {
    pushToCart(state,{goodsName,goodsPrice,id}) {
      state.items.push({goodsName,goodsPrice,id,quantity:1})
    },
    incrementQuantity(state,{id}) {
      const cartItem = state.items.find(item=>item.id===id)
      cartItem.quantity++
    },
    decrementQuantity(state,{id}) {
      const cartItem = state.items.find(item=>item.id===id)
      const itemIndex= state.items.findIndex(item => item.id === id)
      if(cartItem.quantity>1) {
        cartItem.quantity --
      }else {
        state.items.splice(itemIndex,1)
      }
    }
  },
  actions: {
    addToCart({state,commit},product) {
      const cartItem=state.items.find(item=>item.id===product.id)
      if(!cartItem) {
        commit('pushToCart',product)
      }else {
        commit('incrementQuantity',cartItem)
      }
    },
    reduceInCart({state,commit},product){
      commit('decrementQuantity',product)
    }
  }
})
