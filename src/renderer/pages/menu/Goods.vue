<style lang="less">
    .class-management {
        position: relative;
        .page {
            position: absolute;
            right: 20px;
            margin: 20px 0;
        }
    }
</style>
<template>
    <div class="class-management">

        <Form :label-width="100" inline class="z-search-form">
            <FormItem label="名称">
                <Input v-model="searchFormData.name" style="width:180px"></Input>
            </FormItem>
            <FormItem label="父级分类">
                <Select v-model="searchFormData.parent" placeholder="全部" style="width:180px">
                    <Option value="">全部</Option>
                    <Option v-for="(item, index) in parentLevel" :value="item._id" :key="index">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="是否置于首页顶部" :label-width="120">
                <Select v-model="searchFormData.isIndexTop" placeholder="全部" style="width:180px">
                    <Option value="">全部</Option>
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" icon="ios-search" @click="listData('search')">搜索</Button>
                <Button type="primary" @click="showAddModal" style="margin-left:5px">添加分类</Button>
            </FormItem>
        </Form>


        <Table :loading="tableLoading" :columns="columns" border :data="tableData"></Table>

        <Page class="page"
              :total="totalCount"
              show-total
              :page-size="searchParams.pageSize"
              :current="searchParams.pageIndex"
              @on-change="listData"
        ></Page>

        <Modal
                v-model="addModalShow"
                title="添加分类"
                @on-ok="addClass"
                @on-cancel="closeAddModal">
            <Form ref="addFormValidate" :model="addData" :rules="ruleValidate" :label-width="120">
                <FormItem label="名称" prop="name">
                    <Input v-model="addData.name" placeholder="请输入名称"></Input>
                </FormItem>
                <FormItem label="父级分类">
                    <Select v-model="addData.parent" style="width:180px">
                        <Option value="">无</Option>
                        <Option v-for="(item, index) in parentLevel" :value="item._id" :key="index">{{item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="排序">
                    <InputNumber :max="100" :min="1" v-model="addData.sort"></InputNumber>
                </FormItem>
                <FormItem label="是否置于首页顶部" v-show="!addData.parent">
                    <Switch v-model="addData.isIndexTop" size="large">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </Switch>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="buttonLoading" @click="addClass">提交</Button>
                <Button type="ghost" style="margin-left: 8px" @click="closeAddModal">取消</Button>
            </div>
        </Modal>

        <Modal
                v-model="editModalShow"
                title="编辑分类"
                @on-ok="editClass"
                @on-cancel="closeEditModal">
            <Form ref="editFormValidate" :model="editData" :rules="ruleValidate" :label-width="120">
                <FormItem label="名称" prop="name">
                    <Input v-model="editData.name" placeholder="请输入名称"></Input>
                </FormItem>
                <FormItem label="父级分类">
                    <Select v-model="editData.parent" style="width:180px">
                        <Option value="">无</Option>
                        <Option v-for="(item, index) in parentLevel" :value="item._id" :key="index"
                                v-if="item._id !== editData._id">{{item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="排序">
                    <InputNumber :max="100" :min="1" v-model="editData.sort"></InputNumber>
                </FormItem>
                <FormItem label="是否置于首页顶部" v-show="!editData.parent">
                    <Switch v-model="editData.isIndexTop" size="large">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </Switch>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="buttonLoading" @click="editClass">提交</Button>
                <Button type="ghost" style="margin-left: 8px" @click="closeEditModal">取消</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import { _back_api } from '../../utils/axios';

export default {
  components: {},
  data() {
    return {
      parentLevel: [],
      buttonLoading: false,
      tableLoading: false,
      // 查找条件
      searchFormData: {
        name: '',
        parent: '',
        isIndexTop: null,
        pageIndex: 1,
        pageSize: 10,
      },
      searchParams: {},
      totalCount: 0,
      columns: [
        { title: '名称', key: 'name', align: 'center' },
        {
          title: '父级分类', key: 'parent', align: 'center',
          render: (h, param) => {
            if (param.row.parent) {
              return param.row.parent.name;
            }
            return '';
          },
        },
        { title: '排序', key: 'sort', align: 'center' },
        {
          title: '是否置于首页顶部', key: 'isIndexTop', align: 'center',
          render: (h, param) => {
            if (param.row.isIndexTop === true) {
              return h('Icon', {
                props: {
                  type: 'checkmark-round',
                  color: '#19be6b',
                },
              });
            }
            return h('Icon', {
              props: {
                type: 'close-round',
                color: '#ed3f14',
              },
            });
          },
        },
        {
          title: '操作', key: 'action', align: 'center',
          render: (h, param) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                style: {
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.editData.name = param.row.name;
                    if (param.row.parent) {
                      this.editData.parent = param.row.parent._id;
                    } else {
                      this.editData.parent = '';
                    }
                    this.editData.sort = param.row.sort;
                    this.editData._id = param.row._id;
                    this.editData.isIndexTop = param.row.isIndexTop;
                    this.editModalShow = true;
                  },
                },
              }, '查看'),
              h('Poptip', {
                props: {
                  type: 'error',
                  confirm: true,
                  title: '确认删除该分类？',
                  style: { left: '91%' },
                  placement: 'top-end',
                  transfer: true,
                },
                on: {
                  'on-ok': () => {
                    _back_api.delete('/categories', { params: { _id: param.row._id } })
                      .then(data => {
                        if (data.data.status === 'SUCCEED') {
                          this.listData('search');
                          this.searchParent();
                          this.$Message.success({
                            content: '操作成功',
                          });
                        } else {
                          this.$Message.error({
                            content: data.data.errorMessage,
                          });
                        }
                      })
                      .catch(() => {
                        this.tableLoading = false;
                      });
                  },
                },
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                }, '删除'),
              ]),
            ]);
          },
        },
      ],
      tableData: [],
      addModalShow: false,
      addData: {
        name: '',
        parent: '',
        sort: 1,
        isIndexTop: false,
      },
      editModalShow: false,
      editData: {
        parent: '',
      },
      // 验证查看表单
      ruleValidate: {
        name: [
          { required: true, message: '名称 不能为空' },
          { max: 12, min: 2, message: '名称 长度为 2-12' },
        ],
      },
    };
  },
  computed: {},
  methods: {
    // 获取信息
    listData(page) {
      this.tableLoading = true;
      if (typeof page === 'number') {
        this.searchParams.pageIndex = page;
      } else if (page === 'search') {
        this.searchParams = JSON.parse(JSON.stringify(this.searchFormData));
      }

      _back_api.get('/categories', { params: this.searchParams })
        .then(data => {
          this.tableLoading = false;
          if (data.data.status === 'SUCCEED') {
            this.tableData = data.data.datas;
            this.totalCount = data.data.totalCount;
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    searchParent() {
      _back_api.get('/categories', { params: { pageAll: true } })
        .then(data => {
          const Data = data.data.datas;
          const arr = [];
          Data.forEach(item => {
            if (!item.parent) {
              arr.push(item);
            }
          });
          this.parentLevel = arr;
        });
    },
    showAddModal() {
      this.$refs.addFormValidate.resetFields();
      this.addModalShow = true;
    },
    closeAddModal() {
      this.$refs.editFormValidate.resetFields();
      this.addData = {
        name: '',
        parent: '',
        sort: 1,
        isIndexTop: false,
      };
      this.addModalShow = false;
    },
    addClass() {
      this.$refs.addFormValidate.validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          _back_api.post('/categories', this.addData)
            .then(data => {
              this.buttonLoading = false;
              if (data.data.status === 'SUCCEED') {
                this.searchParent();
                this.listData('search');
                this.$Message.success({
                  content: '操作成功',
                });
                this.addModalShow = false;
              } else {
                this.$Message.error({
                  content: data.data.errorMessage,
                });
              }
            })
            .catch(() => {
              this.buttonLoading = false;
            });
        }
      });
    },
    closeEditModal() {
      this.editModalShow = false;
    },
    editClass() {
      this.$refs.editFormValidate.validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          _back_api.put('/categories', this.editData)
            .then(data => {
              this.buttonLoading = false;
              if (data.data.status === 'SUCCEED') {
                this.searchParent();
                this.listData('search');
                this.$Message.success({
                  content: '操作成功',
                });
                this.editModalShow = false;
              } else {
                this.$Message.error({
                  content: data.data.errorMessage,
                });
              }
            })
            .catch(() => {
              this.buttonLoading = false;
            });
        }
      });
    },
  },
  async created() {
    this.searchParent();
    this.listData('search');
  },
};
</script>
