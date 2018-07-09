<style lang="less">
    @import "../assets/less/global.less";

    aside {
        position: relative;
        background-color: @aside-color;
        box-shadow: 0 0 7px #000;
        .layout-menu-left {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 30px;
        }
        .aside-drop-menu {
            position: absolute;
            height: 30px;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            .ivu-dropdown {
                .ivu-dropdown-rel {
                    cursor: pointer;
                }
            }
        }
    }

</style>

<template>
    <aside>
        <Menu ref="menu" @on-select="selectMenu"
              theme="dark" width="100%" :active-name="activeMenuName" accordion class="layout-menu-left">
            <Menu-item v-for="(menu, index) in MENU" :name="menu.path" :key="index">
                <Tooltip :content="menu.title" placement="right" :delay="800">
                    <Icon :type="menu.icon" :size="20"></Icon>
                </Tooltip>
            </Menu-item>
        </Menu>
        <div class="aside-drop-menu">
            <Dropdown trigger="click" placement="top-start" @on-click="dropMenuClick">
                <Icon type="navicon-round" :size="26" color="white"></Icon>
                <DropdownMenu slot="list">
                    <DropdownItem name="upgrade">
                        <Icon type="ios-cloud-download-outline" :size="14"></Icon>
                        检查更新
                    </DropdownItem>
                    <DropdownItem name="about">
                        <Icon type="ios-information" :size="14"></Icon>
                        关于
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <Modal
                v-model="modalShow"
                title="关于">
            <p><strong>easy-invoices</strong>专注于桌面端单机版简易进销存业务，初心是帮助我父母提高工作效率。</p>
            <p>该软件免费使用，并开源于<a href="javascript:void(0)" @click="openUrl('https://github.com/CaanDoll/easy-invoices')">github</a>，如果你有更好的意见或建议，请联系我。
            </p>
            <p>我的邮箱：caandoll@aliyun.com</p>
            <div slot="footer">
                <Button @click="modalShow = false">
                    关闭
                </Button>
            </div>
        </Modal>

    </aside>
</template>

<script>
import MENU from '../menu';
import electron from 'electron';

export default {
  data() {
    return {
      MENU,
      activeMenuName: '',
      modalShow: false,
    };
  },
  methods: {
    selectMenu(path) {
      this.$router.push({ path });
    },
    dropMenuClick(name) {
      switch (name) {
        case 'upgrade':
          console.log('check upgrade');
          break;
        case 'about':
          this.modalShow = true;
          break;
        default:
          null;
      }
    },
    openUrl(url) {
      electron.shell.openExternal(url);
    },
  },
  watch: {
    $route() {
      this.activeMenuName = this.$route.path;
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName();
      });
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
