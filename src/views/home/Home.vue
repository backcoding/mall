<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">淘宝阁</div>
    </nav-bar>
    <home-swiper :banners="barners" />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import HomeSwiper from "./childComps/HomeSwiper";
import { getHomeMultidata } from "network/home";
export default {
  name: "home",
  components: {
    NavBar,
    HomeSwiper
  },
  data() {
    return {
      barners: [],
      recommends: []
    };
  }

  // created() {
  //   //1.请求多个数据
  //   getHomeMultidata()
  //     .then(res => {
  //       //console.log(res)
  //       this.barners = res.data.banner.list;
  //       this.recommends = res.data.recommends.list;
  //     })
  // }
};
</script>

<style>
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
