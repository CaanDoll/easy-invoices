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
        .version {
            font-size: 12px;
            float: left;
            margin-left: 20px;
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
        <section class="version">
            {{updateText}}
            <Progress :percent="downloadProgress" status="active"
                      style="width: 120px;position: relative;top: -2px;"></Progress>
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
        <Modal
                v-model="updateModalShow"
                title="版本升级">
            <div class="aboutText">
                <h2>{{updateData.releaseName}}</h2>
                <p>{{updateData.releaseNotes}}</p>
                <p>更新时间：{{updateData.releaseDate | dateFilter}}</p>
            </div>
            <div slot="footer">
                <Button @click="updateModalShow = false">
                    取消
                </Button>
                <Button type="primary" @click="updateConfirm">确认升级
                </Button>
            </div>
        </Modal>
    </header>
</template>
<script>

export default {
  data() {
    return {
      updateText: '',
      downloadProgress: null,
      updateModalShow: false,
      updateData: {},
    };
  },
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
    showUpdateModal(data) {
      this.updateData = data;
      this.updateModalShow = true;
    },
    updateConfirm() {
      this.updateModalShow = false;
      this.$electron.ipcRenderer.send('update-now');
    },
    update() {
      this.$electron.ipcRenderer.on('update-message', (event, msg) => {
        console.log(msg.message);
        console.log(msg.data);
        switch (msg.message) {
          case 'error':
            this.updateText = '更新失败';
            setTimeout(() => {
              this.updateText = '';
            }, 3000);
            this.downloadProgress = null;
            break;
          case 'checking-for-update':
            this.updateText = '检查更新中';
            break;
          case 'update-available':
            this.updateText = '有可用更新，即将下载';
            break;
          case 'update-not-available':
            this.updateText = '已经是最新版';
            break;
          case 'download-progress':
            this.updateText = '';
            this.downloadProgress = msg.data.percent.toFixed(2);
            break;
          case 'update-downloaded':
            this.updateText = '';
            this.downloadProgress = null;
            this.showUpdateModal(msg.data);
            break;
          default:
            this.updateText = '';
            this.downloadProgress = null;
        }
      });
    },
  },
  created() {
    this.update();
  },
};
</script>
