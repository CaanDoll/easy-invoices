<style lang="less">
    @import "../assets/less/global.less";

    .home-background {
        position: relative;
        background-color: #ddd;
        .aside {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: @view-left;
        }
        .container {
            position: absolute;
            top: 0;
            right: 0;
            left: @view-left;
            bottom: 0;
            overflow: auto;
            padding: @view-padding;
        }
    }
</style>

<template>
    <div class="home-background theme-color1">
        <Aside class="aside"></Aside>
        <div class="container">
            <router-view style="height: 100%;"></router-view>
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
