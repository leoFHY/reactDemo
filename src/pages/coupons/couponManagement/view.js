import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table } from 'antd'
import { hashHistory } from 'dva/router'
import Styles from './index.css'

class Detail extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount () {
    this.props.dispatch({
      type: 'couponManagement/couponDetail',
      payload: {
        id: this.props.location.query.id,
      },
    })
    // console.log('=======view===========')
    // console.log(this.props)
  }
  render () {
    const item = this.props.couponManagement.detail
    let orderColumns = [{
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    }, {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    }, {
      title: '使用券额',
      dataIndex: 'prefAmount',
      key: 'prefAmount',
    }, {
      title: '实际支付金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
    }, {
      title: '支付渠道',
      dataIndex: 'payName',
      key: 'payName',
    }, {
      title: '支付时间',
      dataIndex: 'payTime',
      key: 'payTime',
    }]
    return (
      <div>
        <div className={Styles.couponDetailTable}>
          <table>
            <thead>
              <tr>
                <th colSpan="6">查看优惠券</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">券号：{ item.couponNo }</td>
                <td width="30%">优惠券模板: { item.couponDefName }</td>
                <td width="40%">状态： { item.bindState === '1' ? '已绑定' : item.bindState === '0' ? '未绑定' : '' }</td>
              </tr>
              <tr>
                <td>面值（元）： { item.amount }</td>
                <td>消费门槛（元）： { item.quota }</td>
                <td>有效期: { item.beginDate } 至 { item.endDate }</td>
              </tr>
              <tr>
                <td>绑定会员： { item.memberId }</td>
                <td>绑定时间： { item.bindTime }</td>
                <td>制券批次： { item.batchName }</td>
              </tr>
              <tr>
                <td>购买渠道： { item.supplyName }</td>
                <td>购买时间： { item.updateTime }</td>
                <td>优惠券类型： { item.useType === 'M' ? '代金' : item.useType === 'T' ? '兑换' : item.useType === 'D' ? '折扣' : '' } </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Table
          style={{ background: '#fff', border: '1px solid #ebebeb', marginTop: 20 }}
          rowKey={(text, index) => `couponMView${index}`}
          columns={orderColumns}
          dataSource={item.orderList}
          pagination={false}
        />
        <Button style={{ marginTop: 10, float: 'right' }} type="primary" onClick={() =>
          this.props.history.push({
            pathname: '/coupons/couponManagement',
          })
        }
        >返回</Button>
      </div>
    )
  }
}

export default connect(({ couponManagement }) => ({ couponManagement }))(Detail)
