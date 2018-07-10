<style lang="less">
    @import "../assets/less/global.less";

    header {
        font-family: "Microsoft YaHei";
        font-size: 14px;
        overflow: hidden;
        /*background-color: @header-color;*/
        background: linear-gradient(90deg, @header-color, @bg-color);
        -webkit-app-region: drag;
        .left {
            float: left;
            margin-left: 8px;
        }
        .right {
            float: right;
            a {
                -webkit-app-region: no-drag;
                color: #000;
                margin-right: 10px;
            }
        }
    }
</style>

<template>
    <header>
        <section class="left">
            easy-invoices
        </section>
        <section class="right">
            <a href="javascript:void(0)" @click="minWindows">
                <Icon size="14" type="minus-round"></Icon>
            </a>
            <a href="javascript:void(0)" @click="maxWindows">
                <Icon size="14" type="arrow-resize"></Icon>
            </a>
            <a href="javascript:void(0)" @click="closeWindows">
                <Icon size="14" type="close"></Icon>
            </a>
        </section>
    </header>
</template>
<script>
export default {
  methods: {
    minWindows() {
      this.$electron.ipcRenderer.send('min-window');
    },
    maxWindows() {
      this.$electron.ipcRenderer.send('max-window');
    },
    closeWindows() {
      this.$electron.ipcRenderer.send('close-window');
    },
  },
};
</script>
