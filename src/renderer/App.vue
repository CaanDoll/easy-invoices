<template>
    <div id="app">
        <router-view style="height: 100%;"></router-view>
    </div>
</template>

<script>
import sqlite3 from 'sqlite3';
console.log(sqlite3);
export default {};
</script>

<style>
    html, body, #app {
        height: 100%;
    }

    body {
        color: #333;
    }

    .ivu-menu-vertical .ivu-menu-item {
        padding: 14px 16px;
    }

    .ivu-table-border.ivu-table-border th {
        text-align: center;
    }

    .ivu-page {
        margin: 15px 20px 0 0;
        float: right;
    }

</style>
