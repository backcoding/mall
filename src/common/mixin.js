 import { debounce } from './utils'
 import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null,
      refresh: null
    }
  },
  mounted() {
    // 监听图片加载
    this.refresh = debounce(this.$refs.scroll.refresh, 50); // 每隔200ms再去调用refresh,如果上一次还未完成则清除上一次的200，再过200ms执行
    this.itemImageListener = () => {
      this.refresh();
    };
    this.$bus.$on("itemIamgload", this.itemImageListener);
    console.log('mixin混入中的内容');
    
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isBackTopShow: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
      console.log('mixin混入中的内容');
    }
    
  }
  
}