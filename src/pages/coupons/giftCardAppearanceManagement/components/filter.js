import React, { Component } from 'react'
import { connect } from 'dva'
import { Input, Button, Select } from 'antd'
import { router } from 'utils'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { getId } from 'utils/transformData'

moment.locale('zh-cn')
const Option = Select.Option
// const dateFormat = 'YYYY-MM-DD HH:mm:ss'
const style = {
  filterBody: {
    width: '100%',
  },
}
class GiftCardAppearanceFilter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: null,
      selected: null,
    }
  }

  searchData = () => {
    this.props.dispatch({
      type: 'manageGiftCardList/getCardFaceList',
      payload: {
        type: 'search',
        data: {
          pageNum: 1,
          pageSize: 10,
          bizType: getId(this.state.selected, this.props.manageGiftCardList.typeList),
          name: this.state.name,
        },
      },
    })
  }
  render () {
    return (
      <div style={style.filterBody}>
        <span style={{ marginRight: 8 }}>名称 ：
          <Input
            value={this.state.name}
            onChange={(v) => {
              this.setState({
                name: v.target.value,
              })
            }}
            style={{ width: '30%' }}
          />
        </span>
        <span style={{ marginRight: 8 }}>类型 ：
        <Select
          style={{ width: '30%' }}
          value={this.state.selected}
          onChange={(v) => {
            this.setState({
              selected: v,
            })
          }}
        >
          {this.props.manageGiftCardList.typeList.map((v) => {
            return <Option key={v.id} value={v.name}>{v.name}</Option>
          })}
        </Select>
        </span>
        <span>
          <Button
            type="primary"
            size="large"
            style={{ marginRight: '1%', marginLeft: '1%', width: '6%', textAlign: 'center' }}
            onClick={this.searchData}
          >
              搜索
            </Button>
        </span>
        <span>
          <Button
            size="large"
            style={{ marginRight: '1%', width: '6%', textAlign: 'center' }}
            onClick={() => {
              console.log('重置')
              this.setState({
                name: '',
                selected: '',
              })
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
            }}
          >重置</Button>
        </span>
        <span>
          <Button size="large" style={{ marginRight: '1%', width: '6%', textAlign: 'center' }}
            onClick={() => {
              router.push({
                pathname: '/coupons/giftCardAppearanceManagement/addForm',
                query: {
                  type: 'add',
                },
              })
            }}
          >新增</Button>
        </span>
      </div>
    )
  }
}

export default connect(({ manageGiftCardList }) => ({ manageGiftCardList }))(GiftCardAppearanceFilter)
