<template>
    <div class="home-background theme-color1">
        <Header class="header"></Header>
        <Aside class="aside"></Aside>
        <div class="container">
            <router-view class="clearfix"></router-view>
        </div>
    </div>
</template>
<script>
import Aside from '../components/Aside.vue';
import Header from '../components/Header.vue';

export default {
  data() {
    return {};
  },
  components: {
    Aside,
    Header,
  },
};
</script>
<style lang="less">
    @import "../assets/less/global.less";

    .home-background {
        position: relative;
        background-color: @bg-color;
        .header {
            position: absolute;
            top: 0;
            left: @view-left;
            right: 0;
            height: @view-top;
            line-height: @view-top;
        }
        .aside {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: @view-left;
        }
        .container {
            position: absolute;
            top: @view-top;
            right: 0;
            left: @view-left;
            bottom: 0;
            overflow: auto;
            padding: @view-padding;
        }
    }
</style>
