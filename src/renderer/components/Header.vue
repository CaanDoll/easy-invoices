<style lang="less">
    @import "../assets/less/global.less";

    header {
        font-family: '微软雅黑';
        font-size: 14px;
        overflow: hidden;
        background-color: @header-color;
        -webkit-app-region: drag;
        box-shadow: 0 0 1px #000;
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
import { ipcRenderer } from 'electron';

export default {
  methods: {
    minWindows() {
      ipcRenderer.send('min-windows');
    },
    maxWindows() {
      ipcRenderer.send('maxWindows');
    },
    closeWindows() {
      ipcRenderer.send('closeWindows');
    },
  },
};
</script>
