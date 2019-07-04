import React, { Component } from 'react'
import { connect } from 'dva'
import { Table } from 'antd'
import { router } from 'utils'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

class PageList extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount () {
    this.props.dispatch({
      type: 'couponManagement/couponPageList',
      payload: {
        pageNum: '1',
        pageSize: '10',
      },
    })
    // console.log('======couponManagement...list==========')
    // console.log(this)
  }
  pageChange (page) {
    const coupon = this.props.couponManagement
    // console.log(coupon)
    this.props.dispatch({
      type: 'couponManagement/couponPageList',
      payload: {
        batchName: coupon.batchName || '',
        couponNo: coupon.couponNo || '',
        bindState: coupon.bindState || '',
        couponDefName: coupon.couponDefName || '',
        orderNo: coupon.orderNo || '',
        supplyName: coupon.supplyName || '',
        updateTimeFrom: coupon.updateTimeFrom || '',
        updateTimeTo: coupon.updateTimeTo || '',
        pageNum: page,
        pageSize: coupon.pageSize || 10,
      },
    })
  }
  render () {
    const columns = [{
      title: '券号',
      dataIndex: 'couponNo',
      key: 'couponNo',
    }, {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
    }, {
      title: '优惠券模板',
      dataIndex: 'couponDefName',
      key: 'couponDefName',
    }, {
      title: '状态',
      dataIndex: 'bindState',
      key: 'bindState',
    }, {
      title: '优惠券类型',
      dataIndex: 'useType',
      key: 'useType',
    }, {
      title: '面值（元）',
      dataIndex: 'amount',
      key: 'amount',
    }, {
      title: '消费门槛（元）',
      dataIndex: 'quota',
      key: 'quota',
    }, {
      title: '有效期开始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
    }, {
      title: '有效期结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    }, {
      title: '制券批次',
      dataIndex: 'batchName',
      key: 'batchName',
    }, {
      title: '渠道订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    }, {
      title: '渠道名称',
      dataIndex: 'supplyName',
      key: 'supplyName',
    }, {
      title: '客户姓名',
      dataIndex: 'memberId',
      key: 'memberId',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    }, {
      title: '操作',
      key: 'operator',
      render: (text, record) => {
        // console.log(hashHistory)
        return (
        <span>
          <a
            onClick={() => {
              // console.log(text.id, record)
              router.push({
                pathname: '/coupons/couponManagement/view',
                query: { id: text.id },
              })
            }}
          >
            查看
          </a>

        </span>
      )},
    }]
    // <span className="ant-divider" />
    // <a>启用/禁用</a>
    return (
      <Table
        bordered
        style={{ background: '#fff', border: '1px solid #ebebeb', marginTop: 10 }}
        columns={columns}
        dataSource={this.props.couponManagement.pageList}
        loading={this.props.loading}
        rowKey="id"
        // scroll = {{x:2000}}
        pagination={{
          defaultCurrent: 1,
          current: this.props.couponManagement.pageNum,
          total: this.props.couponManagement.pageCount,
          onChange: this.pageChange.bind(this),
        }}
      />
    )
  }
}

export default connect(({ couponManagement, loading }) => ({ couponManagement, loading: loading.models.couponManagement }))(PageList)
