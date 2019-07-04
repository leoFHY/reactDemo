import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Card, Select } from 'antd'
import { hashHistory } from 'dva/router'
import GiftCardAppearanceFilter from './components/filter'
import GiftCardAppearanceList from './components/list'

class GiftCardAppearance extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount () {
    this.props.dispatch({
      type: 'manageGiftCardList/getCardFaceList',
      payload: {
        type: 'search',
        data: {
          pageNum: 1,
          pageSize: this.props.manageGiftCardList.pageSize,
        },
      },
    })
  }
  render () {
    return (
      <div>
        <GiftCardAppearanceFilter />
        <GiftCardAppearanceList
          listData={this.props.manageGiftCardList.cardFaceList}
        />
      </div>
    )
  }
}


export default connect(({ manageGiftCardList }) => ({ manageGiftCardList }))(GiftCardAppearance)
