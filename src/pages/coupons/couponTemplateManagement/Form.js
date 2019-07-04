import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Button, Select, Table, Modal, message } from 'antd'
import { router } from 'utils'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
class FormModel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      searchVal: null,
      selectedRows: null,
      disabled: true,
      selectedRowKeys: [],
      showRealValue: false,
    }
  }
  componentWillMount () {
    const selectedGoodsList = this.props.couponTemplate.selectedGoods
    if (selectedGoodsList.length > 0) {
      this.setState({
        selectedRows: selectedGoodsList,
      })
    }
    // 获取单个商品数据
    const query = this.props.location.query
    if (query.type !== 'add') {
      this.props.dispatch({
        type: 'couponTemplate/detail',
        payload: {
          id: query.id,
        },
      })
      // 获取已经添加的商品
      // this.props.dispatch({
      //   type: 'couponTemplate/getHaveAddGoods',
      //   payload: {
      //     id: query.id,
      //   },
      // })
    } else {
      // 清空数据
      this.props.dispatch({
        type: 'couponTemplate/clearData',
      })
      this.props.dispatch({
        type: 'couponTemplate/clearSelectedGoods',
      })
    }
  }
  handleOk () {
    this.setState({
      visible: false,
    })
  }
  handleCancel () {
    this.props.dispatch({
      type: 'couponTemplate/saveSelectedGoods',
      payload: '',
    })
    this.setState({
      visible: false,
    })
  }
  getId = (name, list) => {
    let id
    list.forEach((v) => {
      if (v.name === name) {
        id = v.id
      }
    })
    return id
  }
  getName = (id, list) => {
    let name
    list.forEach((v) => {
      if (v.id === id) {
        name = v.name
      }
    })
    return name
  }
  showModal = () => {
    this.setState({
      visible: true,
    })
    this.props.dispatch({
      type: 'couponTemplate/getListForAddGood',
      payload: {
        pageNum: '1',
        pageSize: this.props.couponTemplate.addGoodPageSize,
      },
    })
  }
  handleReset = () => {
    console.log('重置')
    this.props.form.setFieldsValue(
      {
        name: '',
        useType: '',
        state: '',
        day: '',
        fee: '',
        descipthon: '',
        showValue: '',
        quota: '',
        range: '',
      }
    )
    this.props.dispatch({
      type: 'couponTemplate/clearSelectedGoods',
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const model = this.props.couponTemplate
        const query = this.props.location.query
        const params = {
          name: values.name || '',
          day: values.day || '',
          useType: values.useType && this.getId(values.useType, model.useType),
          fee: values.fee,
          descipthon: values.descipthon,
          showValue: values.showValue,
          realValue: values.realValue,
          quota: values.quota,
          range: values.range,
          pageNum: '1',
          pageSize: model.pageSize,
          prodSkuIds: this.props.couponTemplate.selectedRowKeys,
        }
        if (query.type === 'add') {
          this.props.dispatch({
            type: 'couponTemplate/add',
            payload: params,
          })
        } else {
          params.id = query.id
          this.props.dispatch({
            type: 'couponTemplate/update',
            payload: params,
          })
        }
      }
    })
  }
  pageChange = (page) => {
    this.props.dispatch({
      type: 'couponTemplate/getListForAddGood',
      payload: {
        pageNum: page,
        pageSize: this.props.couponTemplate.addGoodPageSize,
      },
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const modle = this.props.couponTemplate
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
    let disabled
    if (this.props.location.query.type === 'look') {
      disabled = true
    } else {
      disabled = false
    }

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
        this.setState({ selectedRowKeys, selectedRows })
      },
      selectedRowKeys: this.state.selectedRowKeys,
      onSelect: (record, selected, selectedRows) => {
        console.log('选择的数据', record, selected, selectedRows)
        this.props.dispatch({
          type: 'couponTemplate/getSelectedGoods',
          payload: {
            selectRow: record,
            selectedRowKey: record.id,
            selected,
          },
        })
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log('全选', selected, selectedRows, changeRows)
        const selectedRowKeys = []
        changeRows.forEach((v) => {
          selectedRowKeys.push(v.id)
        })
        this.props.dispatch({
          type: 'couponTemplate/getSelectedGoods',
          payload: {
            selectRows: changeRows,
            selectedRowKeys,
            selected,
          },
        })
      },
    }
    const columns = [{
      title: 'SKU',
      dataIndex: 'skuCode',
      key: 'skuCode',
    }, {
      title: '商品名称',
      dataIndex: 'skuMeom',
      key: 'skuMeom',
    }, {
      title: '市场价（元）',
      dataIndex: 'marketPrice',
      key: 'marketPrice',
    }, {
      title: '销售价（元）',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
    }, {
      title: '规格',
      dataIndex: 'skuName',
      key: 'skuName',
    }]

    const realValue = (<FormItem
      {...formItemLayout}
      label="实际价值（元）"
      hasFeedback={!disabled}
      key="realValue"
    >
      {getFieldDecorator('realValue', {
        initialValue: modle.detailData && modle.detailData.realValue,
        rules: [{
          required: this.state.showRealValue,
          pattern: /^[0-9]+$/,
          message: '该值不能为空，且为数字',
        }],
      })(
        <Input disabled={disabled} />
        )}
    </FormItem>)
    const New = [
      <FormItem key="New">
        <Button style={this.props.location.query.type === 'look' ?
          { marginLeft: '45%' } : { marginLeft: '45%' }}
          onClick={() => {
            router.push({
              pathname: '/coupons/couponTemplateManagement',
            })
          }}
        >
          返回
        </Button>
        {this.props.location.query.type === 'add' ? <Button onClick={this.handleReset} style={{ marginLeft: '30px' }}>
          重置
        </Button> : '' }

        {this.props.location.query.type !== 'look' ? <Button type="primary" style={{ marginLeft: '30px' }} htmlType="submit">
        提交
      </Button> : ''}
      </FormItem>,
    ]
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.props.location.query.type !== 'add' ?
          <div>
            <FormItem
              {...formItemLayout}
              label="编号"
              key="id"
            >
              {getFieldDecorator('id', {
                initialValue: modle.detailData && modle.detailData.id,
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="状态"
              key="state"
            >
              {getFieldDecorator('state', {
                initialValue: modle.detailData && this.getName(modle.detailData.state, modle.stateList),
              })(
                <Input disabled />
              )}
            </FormItem>
          </div>
         : ''}
        <FormItem
          {...formItemLayout}
          label="名称"
          hasFeedback={!disabled}
          key="name"
        >
          {getFieldDecorator('name', {
            initialValue: modle.detailData && modle.detailData.name,
            rules: [{
              required: !disabled, message: '名称不能为空',
            }],
          })(
            <Input disabled={disabled} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="线上发有效期（天）"
          hasFeedback={!disabled}
          key="day"
        >
          {getFieldDecorator('day', {
            initialValue: modle.detailData && modle.detailData.day,
            rules: [{
              required: !disabled,
              pattern: /^[0-9]+$/,
              message: '该值不能为空，且为数字',
            }],
          })(
            <Input disabled={disabled} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="券的类型"
          key="useType"
        >
          {getFieldDecorator('useType', {
            initialValue: modle.detailData && this.getName(modle.detailData.useType, modle.useType),
            rules: [{
              required: !disabled, message: '券类型为必须',
            }],
          })(
            <Select
              onChange={(e) => {
                if (e !== '折扣') {
                  this.setState({
                    showRealValue: true,
                  })
                } else {
                  this.setState({
                    showRealValue: false,
                  })
                }
              }}
              disabled={disabled}
              style={{ width: 150 }}
            >
              {this.props.couponTemplate && this.props.couponTemplate.useType.map((v) => {
                return <Option key={v.id} value={v.name}>{v.name}</Option>
              })}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="工本费"
          hasFeedback={!disabled}
          key="fee"
        >
          {getFieldDecorator('fee', {
            initialValue: modle.detailData && modle.detailData.fee,
            rules: [{
              required: !disabled,
              pattern: /^[0-9]+$/,
              message: '该值不能为空，且为数字',
            }],
          })(
            <Input disabled={disabled} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="内部参考"
          hasFeedback={!disabled}
          key="descipthon"
        >
          {getFieldDecorator('descipthon', {
            initialValue: modle.detailData && modle.detailData.descipthon,
          })(
            <TextArea disabled={disabled} />
          )}
        </FormItem>
        <div key="preferential" style={{ marginLeft: '15%', fontSize: '14px', marginBottom: 10 }}>优惠规格：</div>
        <FormItem
          {...formItemLayout}
          label="面值（元）"
          hasFeedback={!disabled}
          key="showValue"
        >
          {getFieldDecorator('showValue', {
            initialValue: modle.detailData && modle.detailData.showValue,
            rules: [{
              required: !disabled,
              pattern: /^[0-9]+$/,
              message: '该值不能为空，且为数字',
            }],
          })(
            <Input disabled={disabled} />
          )}
        </FormItem>
        {this.state.showRealValue ||
          (modle.detailData && this.getName(modle.detailData.useType, modle.useType) !== '折扣')
          ? realValue : ''}
        <FormItem
          {...formItemLayout}
          label="消费门槛（元）"
          hasFeedback={!disabled}
          key="quota"
        >
          {getFieldDecorator('quota', {
            initialValue: modle.detailData && modle.detailData.quota,
            rules: [{
              required: !disabled,
              pattern: /^[0-9]+$/,
              message: '该值不能为空，且为数字',
            }],
          })(
            <Input disabled={disabled} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="适用范围"
          hasFeedback={!disabled}
          key="range"
        >
          {getFieldDecorator('range', {
            initialValue: modle.detailData && modle.detailData.range,
            rules: [{
              required: !disabled,
              message: '该值不能为空！',
            },
            {
              max: 50,
              message: '不能超过50个字！',
            },
            ],
          })(
            <Input disabled={disabled} />
          )}
        </FormItem>
        {/* <div key="consume" style={{ marginLeft: '15%', fontSize: '14px', marginBottom: 10 }}>
          消费范围：
          {this.props.location.query.type !== 'look' ?
            <Button style={{ marginLeft: '2%' }}
              onClick={() => {
                this.showModal()
                this.setState({
                  selectedRowKeys: this.props.couponTemplate.selectedRowKeys,
                })
              }}
            >添加商品</Button>
            : ''}
          <Modal
            title="添加优惠券的消费范围"
            visible={this.state.visible}
            onOk={() => {
              if (this.state.selectedRows) {
                this.props.dispatch({
                  type: 'couponTemplate/saveSelectedGoods',
                  payload: 'add',
                })
                this.handleOk()
              } else {
                message.error('你没有选择任何商品！')
              }
            }}
            okText="添加"
            cancelText="关闭"
            width="70%"
            onCancel={() => { this.handleCancel() }}
          >
            <div>
              <span>商品关键字：</span>
              <Input
                placeholder="商品编号、名称、品牌、供应商名称"
                style={{ width: '50%', marginLeft: 10, marginRight: 10, marginBottom: 10 }}
                value={this.state.searchVal}
                onChange={(e) => {
                  this.setState({
                    searchVal: e.target.value,
                  })
                }}
              />
              <Button onClick={() => {
                this.props.dispatch({
                  type: 'couponTemplate/getListForAddGood',
                  payload: {
                    type: 'search',
                    data: {
                      skuMeom: this.state.searchVal,
                      pageNum: '1',
                      pageSize: this.props.couponTemplate.addGoodPageSize,
                    },
                  },
                })
              }}
                type="primary"
              >搜索</Button>
            </div>
            <Table
              bordered
              style={{ background: '#fff', border: '1px solid #ebebeb' }}
              rowSelection={rowSelection}
              columns={columns}
              rowKey="id"
              dataSource={modle.addGoodList}
              pagination={{
                current: Math.floor(modle.addGoodPageNum),
                defaultPageSize: Math.floor(modle.addGoodPageSize),
                total: modle.addGoodPageCount,
                onChange: this.pageChange,
              }}
            />
          </Modal>
        </div> */}
        {/* <div key="addGoodsList">
          <Table
            bordered
            style={{ background: '#fff', border: '1px solid #ebebeb', width: '70%', margin: '0 auto', marginBottom: 10 }}
            columns={columns}
            rowKey="id"
            dataSource={modle.selectedGoods}
            pagination={false}
          />
        </div> */}
        {New}
      </Form>
    )
  }
}


const CouponForm = Form.create()(FormModel)
export default connect(({ couponTemplate }) => ({ couponTemplate }))(CouponForm)
