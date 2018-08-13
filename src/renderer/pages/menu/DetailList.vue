<template>
    <div>
        <Form :label-width="90" inline @keydown.native.enter.prevent="getDataList('search')">
            <FormItem label="品名">
                <Select v-model="search.goods_id" style="width:200px;" placeholder="输入关键字进行快捷选择" clearable
                        filterable>
                    <Option v-for="(item,index) in goodsList" :value="item.id" :key="index">{{item.name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="备注">
                <Input v-model="search.remark" style="width: 200px" clearable></Input>
            </FormItem>
            <FormItem label="创建时间">
                <DatePicker :options="datePickerOption" type="daterange"
                            style="width: 200px" v-model="search.createDateRange" split-panels
                            :editable="false"></DatePicker>
            </FormItem>
            <FormItem label="修改时间">
                <DatePicker :options="datePickerOption" type="daterange"
                            style="width: 200px" v-model="search.updateDateRange" split-panels
                            :editable="false"></DatePicker>
            </FormItem>
            <FormItem label="排序">
                <Select v-model="search.sort" style="width:200px;">
                    <Option v-for="(item,index) in sortList" :value="item.value" :key="index">{{item.label}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem :label-width="10">
                <Button type="primary" icon="ios-search" @click="getDataList('search')" title="搜索"></Button>
                <Button style="margin-left:5px;" type="primary" icon="plus-round" @click="add" title="创建"></Button>
                <Button style="margin-left:5px;" type="primary" icon="ios-upload-outline" @click="downloadExcel"
                        title="导出" :loading="downloadExcelLoading"></Button>
            </FormItem>
        </Form>
        <Table border stripe :columns="dataList_table_column" :data="dataList" :loading="tableLoading"></Table>
        <Page :total="dataListTotalCount" :current="searchParams.pageIndex"
              :page-size="searchParams.pageSize" @on-change="getDataList" @on-page-size-change="getDataListOnPageChange"
              :page-size-opts="[10,20,30,40,50]" show-total
              show-sizer show-elevator transfer></Page>
        <Modal v-model="modalShow" :mask-closable="false" :title="modalTitle" @on-cancel="modalShow = false">
            <div>
                <Form ref="formVali" :model="modalParams" :rules="ruleValidate" label-position="right"
                      :label-width="130" @keydown.native.enter.prevent="enterConfirm(modalParams.id)">
                    <template v-if="!modalParams.id">
                        <FormItem label="品名" prop="goods_id">
                            <Select v-model="modalParams.goods_id" style="width:250px;" placeholder="必选，输入关键字进行快捷选择"
                                    ref="modalGoodsIdSelect"
                                    filterable clearable @on-change="modalSelectGoods">
                                <Option v-for="(item) in goodsList" :value="item.id" :key="item.id">{{item.name}}
                                </Option>
                            </Select>
                        </FormItem>
                        <template v-if="modalParams.goods_id">
                            <FormItem label="操作" prop="type" inline>
                                <Select v-model="modalParams.type" style="width:50px;" placeholder="">
                                    <Option value="+">+</Option>
                                    <Option value="-" v-if="modalParams.total_count">-</Option>
                                </Select>
                                <InputNumber v-model="modalParams.count" :min="0.001" :precision="3"
                                             :max="modalParams.type === '-' ? modalParams.total_count : Infinity"></InputNumber>
                            </FormItem>
                            <FormItem label="实际进价" prop="actual_buy_unit_price" v-show="modalParams.type === '+'">
                                <Input v-model.number="modalParams.actual_buy_unit_price" placeholder="非必填，小数位不超过2位的正整数"
                                       style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="实际售价" prop="actual_sell_unit_price" v-show="modalParams.type === '-'">
                                <Input v-model.number="modalParams.actual_sell_unit_price"
                                       placeholder="非必填，小数位不超过2位的正整数"
                                       style="width: 250px"></Input>
                            </FormItem>
                        </template>
                    </template>
                    <FormItem label="备注" prop="remark">
                        <Input v-model="modalParams.remark" type="textarea" :rows="4" placeholder="非必填，长度 200 以内"
                               style="width: 250px"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="modalShow = false">
                    取消
                </Button>
                <Button type="primary" v-if="!modalParams.id" @click="addConfirm" :loading="modalBtnLoading">确认
                </Button>
                <Button type="primary" v-if="modalParams.id" @click="editConfirm" :loading="modalBtnLoading">确认
                </Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import util from '../../utils/util';
import download from '../../utils/download';

export default {
  data() {
    return {
      // loading
      downloadExcelLoading: false,
      modalBtnLoading: false,
      tableLoading: false,
      // 日期控件配置
      datePickerOption: util.getDatePickerOpt(),
      // ----选值
      sortList: [
        {
          label: '按创建倒序',
          value: 'DESC',
        },
        {
          label: '按创建顺序',
          value: 'ASC',
        },
      ],
      goodsList: [],
      // ----常用
      search: {
        goods_id: '',
        remark: '',
        createDateRange: [ null, null ],
        updateDateRange: [ null, null ],
        sort: 'DESC',
        pageIndex: 1,
        pageSize: 10,
      },
      searchParams: {},
      dataList: [],
      dataListTotalCount: 0,
      dataList_table_column: [
        {
          title: '品名',
          key: 'name',
          align: 'center',
          minWidth: 200,
        },
        {
          title: '计数',
          key: 'count',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.count > 0 ? '+' + params.row.count : params.row.count);
          },
        },
        {
          title: '实际进价',
          key: 'actual_buy_unit_price',
          align: 'center',
          minWidth: 150,
        },
        {
          title: '实际售价',
          key: 'actual_sell_unit_price',
          align: 'center',
          minWidth: 150,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.amount > 0 ? '+' + params.row.amount : params.row.amount);
          },
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center',
          minWidth: 300,
          render: (h, params) => {
            const remark = params.row.remark;
            if (remark) {
              return h('Tooltip', {
                class: {
                  'table-tooltip': true,
                },
                props: {
                  delay: 800,
                },
              }, [
                h('div', remark),
                h('div', {
                  style: {
                    'white-space': 'normal',
                  },
                  slot: 'content',
                }, remark),
              ]);
            }

          },
        },
        {
          title: '创建时间',
          key: 'create_time',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('span', util.dateFilter(params.row.create_time));
          },
        },
        {
          title: '修改时间',
          key: 'update_time',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('span', util.dateFilter(params.row.update_time));
          },
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            const row = params.row;
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'edit',
                },
                attrs: {
                  title: '修改',
                },
                style: {
                  'margin-left': '5px',
                },
                on: {
                  click: () => {
                    this.edit(params.row);
                  },
                },
              }),
              h(row.latest ? 'Poptip' : '', {
                props: {
                  type: 'error',
                  confirm: true,
                  title: '若删除，该操作将回滚',
                  placement: 'top-end',
                  transfer: true,
                  'ok-text': '删除',
                },
                on: {
                  'on-ok': () => {
                    this.del(row);
                  },
                },
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'trash-b',
                  },
                  attrs: {
                    title: '删除',
                  },
                  style: {
                    'margin-left': '5px',
                  },
                }),
              ]),
            ]);
          },
        },
      ],
      modalShow: false,
      modalParams: {
        goods_id: '',
        name: '',
        count: 1.000,
        actual_buy_unit_price: 0,
        actual_sell_unit_price: 0,
        remark: '',
        // 限制用
        type: '+',
        total_amount: 0,
        total_count: 0,
        standard_buy_unit_price: 0,
        standard_sell_unit_price: 0,
      },
      ruleValidate: {
        goods_id: [
          { required: true, message: '请选择 品名' },
        ],
        remark: [
          { max: 200, message: '备注 长度 200 以内' },
        ],
        actual_buy_unit_price: [
          { pattern: util.getRegexp('money'), message: '实际进价 只能为 小数位不超过2位的正整数' },
        ],
        actual_sell_unit_price: [
          { pattern: util.getRegexp('money'), message: '实际售价 只能为 小数位不超过2位的正整数' },
        ],
      },
      downloadExcelSQL: '',
    };
  },
  computed: {
    modalTitle() {
      return this.modalParams.id ? '修改' : '创建';
    },
  },
  methods: {
    // 初始化物品
    initGoodsDataList() {
      const rowSQL = 'SELECT * from GOODS ORDER BY name ASC';
      this.$logger(rowSQL);
      this.$db.all(rowSQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          this.goodsList = res;
        }
      });
    },
    // 搜索
    getDataList(method) {
      this.tableLoading = true;
      if (method === 'search') {
        this.searchParams = JSON.parse(JSON.stringify(this.search));
      }
      if (typeof method === 'number') {
        this.searchParams.pageIndex = method;
      }
      const searchParams = this.searchParams;
      let whereSQL = `WHERE GOODS_DETAIL_LIST.remark LIKE '%${searchParams.remark}%' `;
      searchParams.goods_id ? whereSQL += `AND goods_id = '${searchParams.goods_id}' ` : null;
      searchParams.createDateRange[ 0 ] ? whereSQL += `AND GOODS_DETAIL_LIST.create_time >= ${new Date(searchParams.createDateRange[ 0 ]).getTime()} ` : null;
      searchParams.createDateRange[ 1 ] ? whereSQL += `AND GOODS_DETAIL_LIST.create_time <= ${new Date(searchParams.createDateRange[ 1 ]).getTime() + 24 * 60 * 60 * 1000 - 1} ` : null;
      searchParams.updateDateRange[ 0 ] ? whereSQL += `AND GOODS_DETAIL_LIST.update_time >= ${new Date(searchParams.updateDateRange[ 0 ]).getTime()} ` : null;
      searchParams.updateDateRange[ 1 ] ? whereSQL += `AND GOODS_DETAIL_LIST.update_time <= ${new Date(searchParams.updateDateRange[ 1 ]).getTime() + 24 * 60 * 60 * 1000 - 1} ` : null;
      const pageSQL = `LIMIT ${searchParams.pageSize} OFFSET ${(searchParams.pageIndex - 1) * searchParams.pageSize} `;
      const orderSQL = `ORDER BY GOODS_DETAIL_LIST.id ${searchParams.sort} `;
      // 导出sql
      this.downloadExcelSQL = `SELECT
      GOODS_DETAIL_LIST.id,
      GOODS_DETAIL_LIST.goods_id,
      GOODS_DETAIL_LIST.count,
      GOODS_DETAIL_LIST.latest,
      GOODS_DETAIL_LIST.actual_buy_unit_price,
      GOODS_DETAIL_LIST.actual_sell_unit_price,
      GOODS_DETAIL_LIST.amount,
      GOODS_DETAIL_LIST.create_time,
      GOODS_DETAIL_LIST.update_time,
      GOODS_DETAIL_LIST.remark,
      GOODS.name,
      GOODS.total_count,
      GOODS.total_amount
      from GOODS_DETAIL_LIST LEFT OUTER JOIN GOODS ON GOODS_DETAIL_LIST.goods_id = GOODS.id ` + whereSQL + orderSQL;
      const rowSQL = this.downloadExcelSQL + pageSQL;
      const countSQL = 'SELECT COUNT(id) AS totalCount from GOODS_DETAIL_LIST ' + whereSQL;
      this.$logger(rowSQL);
      this.$db.all(rowSQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          if (!res.length && searchParams.pageIndex !== 1) {
            this.getDataList(searchParams.pageIndex - 1);
          } else {
            this.dataList = res;
          }
        }
        this.tableLoading = false;
      });
      this.$logger(countSQL);
      this.$db.get(countSQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          this.dataListTotalCount = res.totalCount;
        }
      });
    },
    // pageSize改变
    getDataListOnPageChange(pageSize) {
      this.search.pageSize = pageSize;
      this.getDataList('search');
    },
    // 新增
    add() {
      this.$refs.formVali.resetFields();
      this.modalParams = this.$options.data().modalParams;
      this.$refs.modalGoodsIdSelect.clearSingleSelect();
      this.modalShow = true;
    },
    // 选择物品回调
    modalSelectGoods(val) {
      if (val) {
        const SQL = `SELECT total_count,standard_buy_unit_price,standard_sell_unit_price,total_amount from GOODS WHERE id = '${val}'`;
        this.$logger(SQL);
        this.$db.get(SQL, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
            this.modalParams.type = '+';
            this.modalParams.count = 1.000;
            this.modalParams.total_count = res.total_count;
            this.modalParams.total_amount = res.total_amount;
            this.modalParams.actual_buy_unit_price = res.standard_buy_unit_price;
            this.modalParams.actual_sell_unit_price = res.standard_sell_unit_price;
          }
        });
      }
    },
    // 新增确认
    addConfirm() {
      this.$refs.formVali.validate(valid => {
        if (valid) {
          this.modalBtnLoading = true;
          const modalParams = this.modalParams;
          this.$db.serialize(() => {
            const actual_buy_unit_price = modalParams.type === '+' ? modalParams.actual_buy_unit_price : '';
            const actual_sell_unit_price = modalParams.type === '-' ? modalParams.actual_sell_unit_price : '';
            const count = Number(modalParams.type + modalParams.count);
            const amount = -((actual_buy_unit_price || actual_sell_unit_price || 0) * count).toFixed(2);
            this.$db.run('BEGIN');
            // 往物品total_count和total_amount中做运算
            const computeSQL = `UPDATE GOODS SET
            total_count = ${(modalParams.total_count + count).toFixed(3)}
            ,total_amount = ${(modalParams.total_amount + amount).toFixed(2)}
            WHERE id = '${modalParams.goods_id}'`;
            this.$logger(computeSQL);
            this.$db.run(computeSQL, err => {
              if (err) {
                this.$logger(err);
                this.$Notice.error({
                  title: '新增失败',
                  desc: err,
                });
                this.$db.run('ROLLBACK');
              }
            });
            // 将最新记录标为不最新
            const cancelLatestSQL = `UPDATE GOODS_DETAIL_LIST SET latest = 0 WHERE create_time = (select max(create_time) from GOODS_DETAIL_LIST WHERE goods_id = '${modalParams.goods_id}')`;
            this.$logger(cancelLatestSQL);
            this.$db.run(cancelLatestSQL, err => {
              if (err) {
                this.$logger(err);
                this.$Notice.error({
                  title: '新增失败',
                  desc: err,
                });
                this.$db.run('ROLLBACK');
              }
            });
            // 往明细记录中增加记录
            const insertSQL = `INSERT INTO GOODS_DETAIL_LIST (goods_id,count,remark,actual_buy_unit_price,actual_sell_unit_price,amount,latest,create_time,update_time)
          VALUES ('${modalParams.goods_id}','${count}','${modalParams.remark}','${actual_buy_unit_price}','${actual_sell_unit_price}','${amount}','1','${Date.now()}','')`;
            this.$logger(insertSQL);
            this.$db.run(insertSQL, err => {
              if (err) {
                this.$logger(err);
                this.$Notice.error({
                  title: '新增失败',
                  desc: err,
                });
                this.$db.run('ROLLBACK');
              }
            });
            this.$db.run('COMMIT');
            this.modalShow = false;
            this.$Message.success({
              content: '新增成功',
            });
            this.getDataList(1);
            this.modalBtnLoading = false;
          });
        }
      });
    },
    // 编辑
    edit(row) {
      this.$refs.formVali.resetFields();
      this.modalParams = {
        id: row.id,
        remark: row.remark,
      };
      this.modalShow = true;
    },
    // 编辑确认
    editConfirm() {
      this.$refs.formVali.validate(valid => {
        if (valid) {
          this.modalBtnLoading = true;
          const modalParams = this.modalParams;
          const SQL = `UPDATE GOODS_DETAIL_LIST SET
          remark='${modalParams.remark}'
          ,update_time='${Date.now()}'
          WHERE id = ${modalParams.id}`;
          this.$logger(SQL);
          this.$db.run(SQL, err => {
            if (err) {
              this.$logger(err);
              this.$Notice.error({
                title: '编辑失败',
                desc: err,
              });
            } else {
              this.modalShow = false;
              this.$Message.success({
                content: '编辑成功',
              });
              this.getDataList();
            }
            this.modalBtnLoading = false;
          });
        }
      });
    },
    enterConfirm(id) {
      if (id) {
        this.editConfirm();
      } else {
        this.addConfirm();
      }
    },
    //  删除
    del(row) {
      this.$db.serialize(() => {
        this.$db.run('BEGIN');
        // 回滚运算
        const computeSQL = `UPDATE GOODS SET
        total_count = ${(row.total_count - row.count).toFixed(3)}
        ,total_amount = ${(row.total_amount - row.amount).toFixed(2)}
        WHERE id = '${row.goods_id}'`;
        this.$logger(computeSQL);
        this.$db.run(computeSQL, err => {
          if (err) {
            this.$logger(err);
            this.$db.run('ROLLBACK');
            this.$Notice.error({
              title: '删除失败',
              desc: err,
            });
          }
        });
        // 删除行
        const deleteSQL = `DELETE FROM GOODS_DETAIL_LIST WHERE id = ${row.id}`;
        this.$logger(deleteSQL);
        this.$db.run(deleteSQL, err => {
          if (err) {
            this.$logger(err);
            this.$db.run('ROLLBACK');
            this.$Notice.error({
              title: '删除失败',
              desc: err,
            });
          }
        });
        // 将现在最新行标为最新
        const latestSQL = `UPDATE GOODS_DETAIL_LIST SET latest = 1 WHERE create_time = (select max(create_time) from GOODS_DETAIL_LIST WHERE goods_id = '${row.goods_id}')`;
        this.$logger(latestSQL);
        this.$db.run(latestSQL, err => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '新增失败',
              desc: err,
            });
            this.$db.run('ROLLBACK');
          }
        });
        this.$db.run('COMMIT');
        this.$Message.success({
          content: '删除成功',
        });
        this.getDataList();
      });
    },
    // 导出表格
    downloadExcel() {
      this.downloadExcelLoading = true;
      this.$db.all(this.downloadExcelSQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          const data = [
            [ '品名', '计数', '实际进价', '实际售价', '金额', '备注', '创建时间', '修改时间' ],
          ];
          for (const item of res) {
            data.push([
              item.name,
              item.count,
              item.actual_buy_unit_price,
              item.actual_sell_unit_price,
              item.amount,
              item.remark,
              util.dateFilter(item.create_time),
              util.dateFilter(item.update_time),
            ]);
          }
          const name = '进出明细';
          download.excel(name, [
            {
              name,
              data,
            },
          ]).then(arg => {
            this.downloadExcelLoading = false;
            if (arg === 'completed') {
              this.$Message.success({
                content: '导出成功',
              });
            } else {
              this.$Message.warning({
                content: '导出取消',
              });
            }
          }).catch(err => {
            this.downloadExcelLoading = false;
            this.$Notice.error({
              title: '导出失败',
              desc: err,
            });
          });
        }
      });
    },
  },
  created() {
    const goods_id = this.$route.query.goods_id;
    if (goods_id) {
      this.search.goods_id = goods_id;
    }
    this.initGoodsDataList();
    this.getDataList('search');
  },
};

</script>
<style lang="less">
</style>
