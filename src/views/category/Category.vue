<template>
  <div class="wrapper" ref="abc">
    <ul class="content">
      <li v-for="item in 100" :key="item">分类列表{{item}}</li>
    </ul>
  </div>
</template>

<script>
import Bscroll from "better-scroll";

export default {
  name: "Category",
  data() {
    return {
      scroll: null
    }
  },

  mounted(){
    this.scroll = new Bscroll(this.$refs.abc, {
      probeType: 2,
      pullUpLoad: true
    });
    
    this.scroll.on('scroll',(position) => {
      //console.log(position);
    })
    this.scroll.on('pullingUp', () => {
      console.log('加载更多上拉');
      
    })
  }



};
</script>

<style scoped>
.wrapper {
  height: 150px;
  background-color: rgb(219, 250, 215);
   overflow: hidden; 
  /* overflow-y: scroll; */
}
</style>