<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">淘宝阁</div>
    </nav-bar>
    <home-swiper :banners="barners" />
    <recommend-view :recommends="recommends"/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";//加载头部bar
import HomeSwiper from "./childComps/HomeSwiper"; //加载轮播图
import RecommendView from "./childComps/RecommendView" //加载推荐
import { getHomeMultidata } from "network/home"; //加载aixo数据请求
export default {
  name: "home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView
  },
  data() {
    return {
      barners: [],
      recommends: []
    };
  },

  created() {
    //1.请求多个数据
    getHomeMultidata()
      .then(res => {
        console.log(res)
        this.barners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
  }
};
</script>

<style>
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
