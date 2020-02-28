<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav">
      <div slot="center">淘宝阁</div>
    </nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="barners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl2" />
      <goods-list :goods="showGoods" />
    </scroll>
    <!-- .native修饰符可以监听组件的原生事件，组件原本无法监听 -->
    <back-top @click.native="backClick" v-show="isBackTopShow" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper"; //加载轮播图
import RecommendView from "./childComps/RecommendView"; //加载推荐
import FeatureView from "./childComps/FeatureView"; //加载Feat

import NavBar from "components/common/navbar/NavBar"; //头部bar
import TabControl from "components/content/tabControl/TabControl"; //control
import GoodsList from "components/content/goods/GoodsList"; //商品列表GoodsList
import Scroll from "components/common/scroll/Scroll"; //Scroll滚动插件
import BackTop from "components/content/backTop/BackTop"; //BackTop 回滚Top

import { backTopMixin } from "common/mixin";
import { debounce } from "common/utils";

import { getHomeMultidata, getHomeGoods } from "network/home"; //加载aixo数据请求

export default {
  name: "home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    Scroll,
    TabControl,
    GoodsList,
    BackTop
  },

  data() {
    return {
      barners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    };
  },
  mixins: [backTopMixin],
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  activated() {
    // 监听图片加载
    const refresh = debounce(this.$refs.scroll.refresh, 50); // 每隔50ms再去调用refresh,如果上一次还未完成则清除上一次的50，再过50ms执行
    this.itemImageListener = () => {
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImageListener);

    this.$refs.scroll.scrollTo(0, this.saveY);
    this.$refs.scroll.refresh();
  },

  //记录离开时的的状态和位置
  deactivated() {
    //保存 Y值。
    this.saveY = this.$refs.scroll.getScrollY();
    // 2.取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.itemImageListener);
  },

  created() {
    //1.请求banner数据
    this.getHomeMultidata();

    //2.请求商品数据 *动态获取
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },

  mounted() {
    
  },

  methods: {
    /**
     * 事件监听相关方法-----方便管理
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    contentScroll(position) {
      //Back是否显示
      this.isBackTopShow = position.y < -1000;

      // 决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },

    loadMore() {
      // console.log("加载更多上拉");
      this.getHomeGoods(this.currentType);
    },

    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    /**
     * 网络亲求相关方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        //console.log(res);
        this.barners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        //console.log(res);
        //请求到数据并且把数据塞入list push(...) 写法
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
#home {
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  z-index: 9;
}
</style>
