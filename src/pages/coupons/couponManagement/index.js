import React, { Component } from 'react'
// import { connect } from 'dva'
// import { Row, Col, Card, Select, Pagination } from 'antd'
import FilterForm from './components/filter'
import List from './components/list'

class CouponManagement extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
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

export default CouponManagement
