<template>
    <div id="app">
        <router-view style="height: 100%;"></router-view>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less">
    html, body, #app {
        height: 100%;
    }

    body {
        color: #333;
    }

    /*------------------左侧菜单---------------------------------*/
    .ivu-menu-vertical .ivu-menu-item {
        padding: 14px 16px;
    }

    .ivu-icon-clipboard {
        margin-left: 2px;
    }

    /*------------------页码---------------------------------*/
    .ivu-page {
        margin: 15px 20px 0 0;
        float: right;
    }


    /*------------------滚动条---------------------------------*/
    ::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        background: transparent;
        border-radius: 4px
    }

    ::-webkit-scrollbar-button {
        display: none
    }

    ::-webkit-scrollbar-track {
        background-color: transparent
    }

    ::-webkit-scrollbar-track-piece {
        background: transparent
    }

    ::-webkit-scrollbar-thumb {
        width: 8px;
        min-height: 15px;
        background: #c1c1c1;
        border-radius: 4px
    }

    ::-webkit-scrollbar-thumb:active, ::-webkit-scrollbar-thumb:hover {
        background: #7d7d7d
    }

    /*------------------表格中气泡---------------------------------*/

    .table-tooltip {
        width: 100%;
        .ivu-tooltip-rel {
            width: 100%;
            div {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
</style>
