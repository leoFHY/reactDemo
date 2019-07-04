import React, { Component } from 'react'
import { connect } from 'dva'
import { Input, DatePicker, Button, Icon, Table, Modal, Pagination } from 'antd'

import { router } from 'utils'

class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  pageChange = (page) => {
    this.props.dispatch({
      type: 'couponTemplate/getTemList',
      payload: {
        pageSize: this.props.couponTemplate.pageSize,
        pageNum: page,
      },
    })
  }
  render () {
    const columns = [{
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '优惠券类型',
      dataIndex: 'useType',
      key: 'useType',
    }, {
      title: '线上发放有效期（天）',
      dataIndex: 'day',
      key: 'day',
    }, {
      title: '面值',
      dataIndex: 'showValue',
      key: 'showValue',
    }, {
      title: '工本费',
      dataIndex: 'fee',
      key: 'fee',
    }, {
      title: '消费门槛',
      dataIndex: 'quota',
      key: 'quota',
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    }, {
      title: '操作',
      key: 'action',
      render: (text) => {
        switch (text.state) {
          case '新建':
            return (<span>
              <a onClick={() => {
                this.props.dispatch({
                  type: 'couponTemplate/deleteTem',
                  payload: {
                    id: text.id,
                  },
                })
              }}
              >删除</a>
              <span className="ant-divider" />
              <a
                onClick={() => {
                  router.push({
                    pathname: '/coupons/couponTemplateManagement/Form',
                    query: {
                      type: 'edit',
                      id: text.id,
                    },
                  })
                }}
              >编辑</a>
              <span className="ant-divider" />
              <a
                onClick={() => {
                  router.push({
                    pathname: '/coupons/couponTemplateManagement/Form',
                    query: {
                      type: 'look',
                      id: text.id,
                    },
                  })
                }}
              >
              查看
            </a>
              <span className="ant-divider" />
              <a
                onClick={() => {
                  this.props.dispatch({
                    type: 'couponTemplate/enable',
                    payload: {
                      id: text.id,
                    },
                  })
                }}
              >启用</a>
            </span>)
          case '启用':
            return (<span>
              <a
                onClick={() => {
                  this.props.dispatch({
                    type: 'couponTemplate/disable',
                    payload: {
                      id: text.id,
                    },
                  })
                }}
              >禁用</a>
              <span className="ant-divider" />
              <a
                onClick={() => {
                  router.push({
                    pathname: '/coupons/couponTemplateManagement/Form',
                    query: {
                      type: 'look',
                      id: text.id,
                    },
                  })
                }}
              >
              查看
            </a>
            </span>)
          case '禁用':
            return (
              <span>
                <a
                  onClick={() => {
                    this.props.dispatch({
                      type: 'couponTemplate/enable',
                      payload: {
                        id: text.id,
                      },
                    })
                  }}
                >启用</a>
                <span className="ant-divider" />
                <a
                  onClick={() => {
                    router.push({
                      pathname: '/coupons/couponTemplateManagement/Form',
                      query: {
                        type: 'look',
                        id: text.id,
                      },
                    })
                  }}
                >
                查看
              </a>
              </span>
            )
          default :
            return (
              <span>
                <a
                  onClick={() => {
                    router.push({
                      pathname: '/coupons/couponTemplateManagement/Form',
                    })
                  }}
                >
                查看
              </a>
              </span>
            )
        }
      },
    }]
    const model = this.props.couponTemplate
    return (
      <Table
        bordered
        style={{ background: '#fff', border: '1px solid #ebebeb' }}
        columns={columns}
        dataSource={model.temList}
        loading={this.props.loading}
        rowKey="id"
        pagination={{
          current: Math.floor(model.pageNum),
          total: model.pageCount,
          onChange: this.pageChange.bind(this),
        }}
      />
    )
  }
}

export default connect(({ couponTemplate, loading }) => ({ couponTemplate, loading: loading.models.couponTemplate }))(List)
