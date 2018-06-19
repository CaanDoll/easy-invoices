<template>
    <div>
        <Form :label-width="90" inline>
            <FormItem label="品名">
                <Input v-model="search.name" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="进价">
                <InputNumber v-model="search.bidMin" :min="0"></InputNumber>
                -
                <InputNumber v-model="search.bidMax"></InputNumber>
            </FormItem>
            <FormItem label="售价">
                <InputNumber v-model="search.priceMin" :min="0"></InputNumber>
                -
                <InputNumber v-model="search.priceMax"></InputNumber>
            </FormItem>
            <Button type="primary" icon="ios-search" @click="getDataList('search')"></Button>
            <Button type="primary" icon="plus-round" @click="add"></Button>
        </Form>
        <Table border :columns="dataList_table_column" :data="dataList"></Table>
        <Page :total="dataListTotalCount" :current="searchParams.pageIndex"
              :page-size="searchParams.pageSize" @on-change="getDataList" show-total></Page>
        <Modal v-model="modalShow" :mask-closable="false" :title="modalTitle" @on-cancel="modalShow = false">
            <div>
                <Form ref="formVali" :model="modalParams" :rules="ruleValidate" label-position="right"
                      :label-width="120">
                    <FormItem label="品名" prop="name">
                        <Input v-model="modalParams.name" placeholder="必填，长度 100 以内"
                               style="width: 250px"></Input>
                    </FormItem>
                    <FormItem label="进价" prop="buyPrice">
                        <Input v-model="modalParams.desc" placeholder="非必填，大小 0.01 - 100000000.00"
                               style="width: 250px"></Input>
                    </FormItem>
                    <FormItem label="售价" prop="sellPrice">
                        <Input v-model.num="modalParams.desc" placeholder="非必填，大小 0.01 - 100000000.00"
                               style="width: 250px"></Input>
                    </FormItem>
                    <FormItem label="备注" prop="remark">
                        <Input v-model="modalParams.desc" placeholder="非必填，长度 200 以内"
                               style="width: 250px"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="modalShow = false">
                    取消
                </Button>
                <Button type="primary" v-if="isModalAdd" @click="addConfirm">确认
                </Button>
                <Button type="primary" v-if="!isModalAdd" @click="editConfirm">确认
                </Button>
            </div>
        </Modal>
    </div>
</template>
<script>

export default {
  data() {
    return {
      // ----选值
      // ----常用
      search: {
        name: '',
        buyPriceMax: null,
        buyPriceMin: null,
        sellPriceMax: null,
        sellPriceMin: null,
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
        },
        {
          title: '进价',
          key: 'buyPrice',
        },
        {
          title: '售价',
          key: 'sellPrice',
        },
        {
          title: '数量',
          key: 'total',
        },
        {
          title: '备注',
          key: 'remark',
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            if (!params.row.default) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    },
                  },
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: {
                    marginLeft: '5px',
                  },
                  on: {
                    click: () => {
                      this.del(params.row);
                    },
                  },
                }, '删除'),
              ]);
            }
          },
        },
      ],
      modalShow: false,
      isModalAdd: true,
      modalParams: {
        name: '',
        buyPrice: '',
        sellPrice: '',
        total: '',
        remark: '',
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入 品名' },
          { max: 100, message: '品名 长度 100 以内' },
        ],
        buyPrice: [
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '进价 只能为 小数位不超过2位的正整数' },
        ],
        sellPrice: [
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '进价 只能为 小数位不超过2位的正整数' },
        ],
        remark: [
          { max: 200, message: '备注 长度 200 以内' },
        ],
      },
    };
  },
  computed: {
    modalTitle() {
      return this.isModalAdd ? '新增' : '编辑';
    },
  },
  methods: {
    // 搜索
    getDataList(method) {
      if (method === 'search') {
        this.searchParams = JSON.parse(JSON.stringify(this.search));
      }
      if (typeof method === 'number') {
        this.searchParams.pageIndex = method;
      }
      const a = this.$db.goods.find();
      console.log(a);
      /* _api_dashboard_service.get('/roles', { params: this.searchParams }).then(res => {
        const data = res.data;
        if (data.status === 'SUCCEED') {
          this.dataList = data.datas;
          this.searchParams.pageIndex = data.pageIndex;
          this.dataListTotalCount = data.totalCount;
        }
      }); */
    },
    // 新增
    add() {
      this.isModalAdd = true;
      this.$refs.formVali.resetFields();
      this.modalParams = this.$options.data().modalParams;
      this.modalShow = true;
    },
    // 新增确认
    addConfirm() {
      this.$db.goods.insert({ test: 1 });
      /*
      this.$refs.formVali.validate(valid => {
        if (valid) {
        }
      }); */
    },
    // 编辑
    edit(row) {
      this.isModalAdd = false;
      this.$refs.formVali.resetFields();
      this.modalParams = {
        _id: row._id,
        name: row.name,
        desc: row.desc,
      };
      this.modalShow = true;
    },
    // 编辑确认
    editConfirm() {
      this.selectTreeNode();
      this.$refs.formVali.validate(valid => {
        if (valid) {
          /* _api_dashboard_service.put('/roles', this.modalParams).then(res => {
            const data = res.data;
            if (data.status === 'SUCCEED') {
              this.modalShow = false;
              this.getDataList('search');
              this.$Notice.success({
                title: '编辑成功',
              });
            } else {
              this.$Notice.warning({
                title: '编辑失败，' + data.errorMessage,
              });
            }
          }); */
        }
      });
    },
    //  删除
    del(row) {
      const _id = row._id;
      console.log(_id);
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除吗?',
        onOk: () => {
          /* _api_dashboard_service.delete('/roles', { params: { _id } }).then(res => {
            const data = res.data;
            if (data.status === 'SUCCEED') {
              this.getDataList('search');
              this.$Notice.success({
                title: '删除成功',
              });
            } else {
              this.$Notice.warning({
                title: '删除失败，' + data.errorMessage,
              });
            }
          }); */
        },
      });
    },
  },
  created() {
    this.getDataList('search');
  },
};

</script>
<style lang="less">
</style>
