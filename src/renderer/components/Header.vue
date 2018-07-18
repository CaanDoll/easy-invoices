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
            .ivu-tooltip {
                -webkit-app-region: no-drag;
            }
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
            <Tooltip transfer v-if="downloadInfo.percent !== null">
                <Progress :percent="downloadInfo.percent" status="active"
                          style="width: 150px;position: relative;top: -2px;" hide-info></Progress>
                <div slot="content">
                    <p>{{updateInfo.releaseName}}</p>
                    <p>大小：{{downloadInfo.totalMB}}MB</p>
                    <p>速度：{{downloadInfo.KBPerSecond}}KB/s</p>
                </div>
            </Tooltip>

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
                :mask-closable="false"
                :closable="false"
                title="版本升级">
            <div class="aboutText">
                <Card>
                    <h2 slot="title">{{updateInfo.releaseName}}</h2>
                    <p slot="extra">{{currentVersion}} → {{updateInfo.version}}</p>
                    <div v-html="updateInfo.releaseNotes"></div>
                    <p>更新时间：{{updateInfo.releaseDate | dateFilter}}</p>
                </Card>
            </div>
            <div slot="footer">
                <Button @click="closeUpdateModal">
                    取消升级，下次启动时再询问
                </Button>
                <Button type="primary" @click="updateConfirm">确认升级，将重启应用
                </Button>
            </div>
        </Modal>
    </header>
</template>
<script>
import packageJson from '../../../package.json';

export default {
  data() {
    return {
      currentVersion: packageJson.version,
      updateText: '',
      downloadProgress: null,
      downloadInfo: {
        percent: null,
        totalMB: 0,
        KBPerSecond: 0,
      },
      updateModalShow: false,
      updateInfo: {
        releaseName: '',
        releaseNotes: '',
        releaseDate: '',
        version: '',
      },
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
    showUpdateModal() {
      this.updateModalShow = true;
    },
    updateConfirm() {
      this.updateModalShow = false;
      this.$electron.ipcRenderer.send('update-now');
    },
    closeUpdateModal() {
      this.updateModalShow = false;
      this.updateText = '更新已取消';
    },
    update() {
      this.$electron.ipcRenderer.on('update-message', (event, msg) => {
        const message = msg.message;
        const data = msg.data;
        switch (message) {
          case 'error':
            this.updateText = '检查更新失败';
            this.downloadInfo = this.$options.data().downloadInfo;
            break;
          /* case 'checking-for-update':
            this.updateText = '检查更新中';
            break;*/
          case 'update-available':
            this.updateText = '有可用更新';
            this.updateInfo = {
              releaseDate: new Date(data.releaseDate).getTime() - new Date().getTimezoneOffset() * 60 * 1000,
              releaseName: data.releaseName,
              releaseNotes: data.releaseNotes,
              version: data.version,
            };
            break;
          case 'update-not-available':
            this.updateText = '已经是最新版';
            break;
          case 'download-progress':
            this.updateText = '';
            this.downloadInfo = {
              percent: data.percent.toFixed(2),
              totalMB: (data.total / 1024 / 1024).toFixed(3),
              KBPerSecond: (data.bytesPerSecond / 1024).toFixed(3),
            };
            break;
          case 'update-downloaded':
            this.updateText = '';
            this.downloadInfo = this.$options.data().downloadInfo;
            this.showUpdateModal();
            break;
          default:
            this.updateText = '';
            this.downloadInfo = this.$options.data().downloadInfo;
        }
      });
    },
  },
  created() {
    this.update();
  },
};
</script>
