<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" ref="param" />
      <detail-comment-info :comment-info="commentInfo" ref="comments" />
      <goods-list :goods="recommends" ref="recommends" />
    </scroll>
      <detail-bottom-bar/>
       <back-top @click.native="backClick" v-show="isBackTopShow" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar"

import Scroll from "components/common/scroll/Scroll"; //Scroll滚动插件
import GoodsList from "components/content/goods/GoodsList";

import { itemListenerMixin, backTopMixin } from "common/mixin";
import { debounce } from "common/utils";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    };
  },
  created() {
    //1.保存传入iid
    this.iid = this.$route.params.iid;

    getDetail(this.iid).then(res => {
      //2.获取滚动图片数据
      //console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      //3.获取商品信息数据
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //4.获取商家数据
      this.shop = new Shop(data.shopInfo);

      //5.商品详情数据
      this.detailInfo = data.detailInfo;

      //6.商品参数数据
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      //7.取出评论数据
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });
    //8.取出推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list;
    });

    // 给getThemeTopY赋值（进行防抖
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comments.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
    }, 300);
  },

  mounted() {
    //console.log('mounted');
  },

  destroyed() {
    //console.log('destroyed走了');
    this.$bus.$off("itemImageLoad", this.itemImageListener);
  },

  methods: {
    imageLoad() {
      this.refresh();
      this.getThemeTopY();
    },

    titleClick(index) {
      //console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300);
    },

    contentScroll(position) {
      // 显示BackTop
      this.isBackTopShow = position.y < -1000;

      // 1.获取y值
      const positionY = -position.y;
      const lastIndex = this.themeTopYs.length - 1;
      // 2.positionY和主题中的数值对比
      for (let i in this.themeTopYs) {
        i = parseInt(i);
        if (
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1] &&
          this.currentIndex !== i
        ) {
          // 防止赋值过于频繁
          this.currentIndex = i;
          this.$refs.nav.currentIndex = i;
        } else if (
          positionY >= this.themeTopYs[lastIndex] &&
          this.currentIndex !== lastIndex
        ) {
          // 防止赋值过于频繁
          this.currentIndex = lastIndex;
          this.$refs.nav.currentIndex = lastIndex;
        }
      }
    }
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  /* position: absolute;
  top: 44px;
  bottom: 49px;
  overflow: hidden; */
  
  height: calc(100% - 44px - 49px)
}
</style>

