import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('../views/home/Home') 
const Category = () => import('../views/category/Category') 
const ShopCart = () => import('../views/cart/ShopCart') 
const Porfile = () => import('../views/porfile/Porfile') 
Vue.use(VueRouter)

const routes = [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/category',
      component: Category
    },
    {
      path: '/shopcart',
      component: ShopCart
    },
    {
      path: '/profile',
      component: Porfile
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
