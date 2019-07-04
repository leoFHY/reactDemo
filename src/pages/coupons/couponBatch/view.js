import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Button } from 'antd'

import { router } from 'utils'


const styles = {
  childLeftStyle: {
    border: '1px solid #ccc',
    borderBottom: 'none',
    borderLeft: 'none',
    height: '40px',
    textAlign: 'right',
    background: '#fff',
    lineHeight: '40px',
    paddingRight: '10px',
  },
  warpStyle: {
    border: '1px solid #ccc',
    borderTop: 'none',
    borderRight: 'none',
  },
  childRightStyle: {
    border: '1px solid #ccc',
    borderBottom: 'none',
    borderLeft: 'none',
    height: '40px',
    textAlign: 'left',
    background: '#fff',
    lineHeight: '40px',
    paddingLeft: '10px',
  },
}

class CouponBtachView extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount () {
    const query = this.props.location.query
    if (query.id) {
      this.props.dispatch({
        type: 'couponBatch/getDetailBatch',
        payload: {
          id: query.id,
        },
      })
    }
  }
  render () {
    const detailBatch = this.props.couponBatch.detailBatch
    console.log('detailBatch', detailBatch)
    const listData = [
      {
        title: '批次号：',
        content: detailBatch.id,
        span: '4',
        spaner: '8',
      },
      {
        title: '状态：',
        content: detailBatch.state,
        span: '4',
        spaner: '8',
      },
      {
        title: '批次名称：',
        content: detailBatch.name,
        span: '4',
        spaner: '20',
      },
      {
        title: '卡券外观：',
        content: detailBatch.dispayName,
        span: '4',
        spaner: '8',
      },
      {
        title: '优惠券模版：',
        content: detailBatch.defName,
        span: '4',
        spaner: '8',
      },
      {
        title: '有效期',
        content: `${detailBatch.beginDate}至${detailBatch.endDate}`,
        span: '4',
        spaner: '8',
      },
      {
        title: '冻结数量：',
        content: detailBatch.frozenCount,
        span: '4',
        spaner: '8',
      },
      {
        title: '制作数量：',
        content: detailBatch.batchCount,
        span: '4',
        spaner: '8',
      },
      {
        title: '制券号段：',
        content: detailBatch.couponStart && `${detailBatch.couponStart} 至 ${detailBatch.couponTo}`,
        span: '4',
        spaner: '8',
      },
      {
        title: '号段内排除号码：',
        content: detailBatch.excludeNums,
        span: '4',
        spaner: '20',
      },
      {
        title: '入库数量：',
        content: detailBatch.entryCount,
        span: '4',
        spaner: '8',
      },
      { // 先留着，以后有用
        title: '已删数量：',
        content: '',
        span: '4',
        spaner: '8',
      },
      {
        title: '已售数量：',
        content: '',
        span: '4',
        spaner: '8',
      },
      {
        title: '可售数量：',
        content: detailBatch.saleCount,
        span: '4',
        spaner: '8',
      },
      {
        title: '申请人：',
        content: detailBatch.applicant,
        span: '4',
        spaner: '8',
      },
      {
        title: '申请时间',
        content: detailBatch.applyDateSource,
        span: '4',
        spaner: '8',
      },
      {
        title: '创建人：',
        content: '',
        span: '4',
        spaner: '8',
      },
      {
        title: '创建时间：',
        content: detailBatch.createTime,
        span: '4',
        spaner: '8',
      },
      {
        title: '制卡说明：',
        content: detailBatch.describe,
        span: '4',
        spaner: '20',
      },
    ]
    return (
      <div>
        <Row style={styles.warpStyle}>
          {listData.map((item) => {
            return (
              <span>
                <Col span={item.span} style={styles.childLeftStyle}>{item.title}</Col>
                <Col span={item.spaner} style={styles.childRightStyle}>{item.content}</Col>
              </span>
            )
          })}
        </Row>
        <Button type="primary"
          style={{ marginTop: '20px', float: 'right', marginRight: '20px' }}
          onClick={() => {
            router.push({
              pathname: '/coupons/couponBatch',
            })
          }}
        >返回</Button>
      </div>
    )
  }
}

export default connect(({ couponBatch }) => ({ couponBatch }))(CouponBtachView)
