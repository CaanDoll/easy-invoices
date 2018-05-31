<style lang="less">
    @import "../assets/less/global.less";

    aside {
        position: relative;
        .layout-menu-left {
            height: 100%;
            box-shadow: 0 0 7px #000;
            overflow-y: auto;
        }
    }

</style>

<template>
    <aside>
        <Menu ref="menu" :active-name="activeMenuName" @on-select="selectMenu"
              theme="dark" width="240px" accordion class="layout-menu-left"
              :class="{'menuToRight':toggle === false,'menuToLeft':toggle}">
            <Menu-item v-for="(menu, index) in MENU" :name="menu.path" :key="index" :title="menu.name">
                <Icon type="monitor" :size="14"></Icon>
            </Menu-item>
        </Menu>
    </aside>
</template>

<script>
import MENU from '../utils/menu';

export default {
  data() {
    return {
      MENU,
    };
  },
  methods: {
    selectMenu(path) {
      this.$router.push({ path });
    },
  },
};
</script>
