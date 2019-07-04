import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Card, Select, Pagination } from 'antd'
import FilterForm from './components/filter'
import List from './components/list'

class couponTemplateManagement extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount () {
    // 获取列表
    this.props.dispatch({
      type: 'couponTemplate/getTemList',
      payload: {
        type: 'search',
        data: {
          pageNum: '1',
          pageSize: this.props.couponTemplate.pageSize,
        },
      },
    })
    // 获取优惠券类型

    // 获取状态
  }
  render () {
    return (
      <div>
        <FilterForm />
        <List />
      </div>
    )
  }
}


export default connect(({ couponTemplate }) => ({ couponTemplate }))(couponTemplateManagement)
