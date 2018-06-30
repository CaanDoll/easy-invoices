<template>
    <div>
        <Form :label-width="90" inline>
            <FormItem label="品名">
                <Input v-model="search.name" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="进价">
                <InputNumber v-model="search.buyPriceMin" :min="0"></InputNumber>
                -
                <InputNumber v-model="search.buyPriceMax"></InputNumber>
            </FormItem>
            <FormItem label="售价">
                <InputNumber v-model="search.sellPriceMin" :min="0"></InputNumber>
                -
                <InputNumber v-model="search.sellPriceMax"></InputNumber>
            </FormItem>
            <Button type="primary" icon="ios-search" @click="getDataList('search')"></Button>
            <Button type="primary" icon="plus-round" @click="add"></Button>
        </Form>
        <Table border :columns="dataList_table_column" :data="dataList"></Table>
        <Page :total="dataListTotalCount" :current="search.pageIndex"
              :page-size="search.pageSize" @on-change="getDataList" show-total show-elevator></Page>
        <Modal v-model="modalShow" :mask-closable="false" :title="modalTitle" @on-cancel="modalShow = false">
            <div>
                <Form ref="formVali" :model="modalParams" :rules="ruleValidate" label-position="right"
                      :label-width="120">
                    <FormItem label="品名" prop="name">
                        <Input v-model="modalParams.name" placeholder="必填，长度 100 以内"
                               style="width: 250px"></Input>
                    </FormItem>
                    <FormItem label="进价" prop="buyPrice">
                        <Input v-model="modalParams.buyPrice" placeholder="非必填，大小 0.01 - 100000000.00"
                               style="width: 250px"></Input>
                    </FormItem>
                    <FormItem label="售价" prop="sellPrice">
                        <Input v-model.number="modalParams.sellPrice" placeholder="非必填，大小 0.01 - 100000000.00"
                               style="width: 250px"></Input>
                    </FormItem>
                    <FormItem label="备注" prop="remark">
                        <Input v-model="modalParams.remark" placeholder="非必填，长度 200 以内"
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
import filter from '../../utils/filter';

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
          width: 130,
          align: 'center',
          render: (h, params) => {
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
              h('Poptip', {
                props: {
                  type: 'error',
                  confirm: true,
                  title: '确认删除该物品？',
                  placement: 'top-end',
                  transfer: true,
                },
                on: {
                  'on-ok': () => {
                    this.del(params.row);
                  },
                },
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: {
                    'margin-left': '5px',
                  },
                }, '删除'),
              ]),
            ]);
          },
        },
      ],
      modalShow: false,
      isModalAdd: true,
      modal$loki: null,
      modalParams: {
        name: '',
        buyPrice: '',
        sellPrice: '',
        total: 0,
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
        this.searchParams.sellPrice = { $gt: this.search.sellPriceMin, $lt: this.search.sellPriceMax };
        this.searchParams.buyPrice = { $gt: this.search.buyPriceMin, $lt: this.search.buyPriceMax };
        this.searchParams.name = { $regex: filter.patternCleanSpecial(this.search.name), $options: 'ims' };
      }
      if (typeof method === 'number') {
        this.searchParams.pageIndex = method;
      }
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
      this.$refs.formVali.validate(valid => {
        if (valid) {
          // const modalParams = JSON.parse(JSON.stringify(this.modalParams));
          this.modalShow = false;
          this.$Notice.success({
            title: '新增成功',
          });
          this.getDataList();
        }
      });
    },
    // 编辑
    edit(row) {
      this.isModalAdd = false;
      this.$refs.formVali.resetFields();
      this.modal$loki = row.$loki;
      this.modalParams = {
        name: row.name,
        buyPrice: row.buyPrice,
        sellPrice: row.sellPrice,
        total: row.total,
        remark: row.remark,
      };
      this.modalShow = true;
    },
    // 编辑确认
    editConfirm() {
      this.$refs.formVali.validate(valid => {
        if (valid) {
          // const modalParams = JSON.parse(JSON.stringify(this.modalParams));
          this.modalShow = false;
          this.$Notice.success({
            title: '编辑成功',
          });
          this.getDataList();
        }
      });
    },
    //  删除
    del() {
      this.$Notice.success({
        title: '删除成功',
      });
      this.getDataList();
    },
  },
  created() {
    this.getDataList('search');
  },
};

</script>
<style lang="less">
</style>
