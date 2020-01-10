import {request} from "./request";

// 获取轮播图和推荐数据
export function getHomeMultidata(){
  return request({
    url:'/home/multidata'
  })
}

// 数据商品列表请求
export function getHomeGoods(type,page){
  return request({
    url:'/home/data',   
    params:{
      type,
      page
    }
  })
}
