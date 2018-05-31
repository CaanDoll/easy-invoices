<style lang="less">
    @import "../assets/less/global.less";

    header {
        position: relative;
        z-index: 10;
        border-bottom: solid 1px #ccc;
        .header-right {
            position: absolute;
            top: 0;
            z-index: 901;
            right: @view-padding;
            text-align: center;
            line-height: 60px;
            //右边选项
            .header-help-btn, .header-exit-btn {
                width: 60px;
                height: 60px;
                color: #fff;
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
</style>
<template>
    <header class="theme-color2">
        <Menu ref="menu" :active-name="activeMenuName" @on-select="selectMenu"
              theme="primary" accordion mode="horizontal">
            <Menu-item v-for="(menu, index) in MENU" :name="menu.name" :key="index">
                <Icon :type="menu.icon" :size="14"></Icon>
                <span class="layout-text">{{menu.title}}</span>
            </Menu-item>
        </Menu>
        <div class="header-right">
            <div class="header-exit-btn" @click="logout">
                <Icon type="power" size="26"></Icon>
            </div>
        </div>
    </header>
</template>
<script>
import MENU from '../utils/menu';

export default {
  computed: {
    toggle() {
      return this.$store.state.menu.menuSwitch;
    },
  },
  data() {
    return {
      MENU,
      activeMenuName: '',
    };
  },
  watch: {
    $route() {
      this.activeMenuName = this.$route.name;
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName();
        this.$refs.menu.updateOpened();
      });
    },
  },
  created() {
    this.activeMenuName = this.$route.name;
  },
  methods: {
    logout() {
      this.$router.push('/login');
      localStorage.removeItem('token');
    },
    selectMenu(name) {
      this.$router.push({ name });
    },
  },
};
</script>
