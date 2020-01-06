<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">淘宝阁</div>
    </nav-bar>
    <home-swiper :banners="barners" />
    <recommend-view :recommends="recommends" />
    <feature-view />
    <tab-control class="tab-control" :titles="['流行', '新款','精选']" />

    <li v-for="item in 100" :key="item">{{item}}</li>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper"; //加载轮播图
import RecommendView from "./childComps/RecommendView"; //加载推荐
import FeatureView from "./childComps/FeatureView"; //加载Feat

import NavBar from "components/common/navbar/NavBar"; //加载头部bar
import TabControl from "components/content/tabControl/TabControl"; //加载control

import { getHomeMultidata, getHomeGoods } from "network/home"; //加载aixo数据请求

export default {
  name: "home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl
  },
  data() {
    return {
      barners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        news: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      }
    };
  },

  created() {
    //1.请求多个数据
    this.getHomeMultidata();
    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  methods: {
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        //console.log(res);
        this.barners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      getHomeGoods(type).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style>
#home {
  padding-top: 44px;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}
.tab-control {
  position: sticky;
  top: 44px;
}
</style>
