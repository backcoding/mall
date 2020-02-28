import { ADD_COUNTER, ADD_CART } from './mutations-types'
export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // 1.payload新添加的商品,find函数查找，满足条件就把item赋值给oldProduct
      let oldProduct = context.state.cartList.find(item => {
          return item.iid === payload.iid
        })
        // 2.判断oldProduct,不存在就push
      if (!oldProduct) {
        context.commit(ADD_CART, payload)
        resolve('已成功加入购物车')
      } else {
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前的商品数量+1')
      }
    })
  }
}