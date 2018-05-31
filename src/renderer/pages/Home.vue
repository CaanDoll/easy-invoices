<style lang="less">
    @import "../assets/less/global.less";

    .home-background {
        height: 100%;
        position: relative;
        .aside {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: @view-left;
        }
        .container {
            position: absolute;
            top: 0;
            right: 0;
            left: @view-left;
            bottom: 0;
            overflow: auto;
        }
    }
</style>

<template>
    <div class="home-background theme-color1">
        <Aside class="aside"></Aside>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import Aside from '../components/Aside.vue';

export default {
  data() {
    return {};
  },
  components: {
    Aside,
  },
};
</script>
