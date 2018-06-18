<style lang="less">
    @import "../assets/less/global.less";

    aside {
        position: relative;
        .layout-menu-left {
            height: 100%;
            box-shadow: 0 0 7px #000;
        }
    }

</style>

<template>
    <aside>
        <Menu ref="menu" @on-select="selectMenu"
              theme="dark" width="100%" :active-name="activeMenuName" accordion class="layout-menu-left">
            <Menu-item v-for="(menu, index) in MENU" :name="menu.path" :key="index">
                <Tooltip :content="menu.title" placement="right">
                    <Icon :type="menu.icon" :size="20"></Icon>
                </Tooltip>
            </Menu-item>
        </Menu>
    </aside>
</template>

<script>
import MENU from '../menu';

export default {
  data() {
    return {
      MENU,
      activeMenuName: '',
    };
  },
  methods: {
    selectMenu(path) {
      this.$router.push({ path });
    },
  },
  created() {
    this.activeMenuName = this.$route.path;
    this.$nextTick(() => {
      this.$refs.menu.updateActiveName();
    });
  },
};
</script>
