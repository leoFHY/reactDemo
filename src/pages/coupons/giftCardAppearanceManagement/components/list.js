import React, { Component } from 'react'
import { connect } from 'dva'
import { Input, DatePicker, Button, Icon, Table, Modal } from 'antd'
import { router } from 'utils'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { deepCopy } from 'utils/copy'

moment.locale('zh-cn')
const confirm = Modal.confirm
class GiftCardAppearanceList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [{
        title: '名称',
        dataIndex: 'name',
        key: 'id',
        width: '15%',
      }, {
        title: '类型',
        dataIndex: 'bizTypes',
        key: 'bizTypes',
        width: '15%',
      }, {
        title: '描述',
        dataIndex: 'describe',
        key: 'describe',
        width: '40%',
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '15%',
      },
      {
        title: '操作',
        key: 'action',
        width: '15%',
        render: (text, record) => (
          <span>
            <a
              onClick={this.onEdit.bind(this, text)}
            >编辑</a>
            <span className="ant-divider" />
            <a onClick={this.onDelete.bind(this, text)} type="dashed">
              删除
            </a>
          </span>
        ),
      }],

    }
  }
  onEdit (text) {
    router.push({
      pathname: '/coupons/giftCardAppearanceManagement/addForm',
      query: {
        type: 'edit',
        id: text.id,
      },
    })
  }
  onDelete (text) {
    confirm({
      title: '确定要删除这条数据吗?',
      content: '',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        this.props.dispatch({
          type: 'manageGiftCardList/deleteCardFace',
          payload: {
            id: text.id,
          },
        })
      },
      onCancel () {
        console.log('Cancel')
      },
    })
  }
  getTypeName = (id) => {
    switch (id) {
      case '1':
        return '礼品卡'
      case '2':
        return '优惠券'
      case '3':
        return '权益卡'
      default:
        return ''
    }
  }
  pageChange (page) {
    this.props.dispatch({
      type: 'manageGiftCardList/getCardFaceList',
      payload: {
        pageNum: page,
        pageSize: 10,
      },
    })
  }

  render () {
    let list = deepCopy(this.props.listData)
    list.map((v) => {
      v.bizTypes = this.getTypeName(v.bizType)
      return v
    })
    console.log(list)
    return (
      <div style={{ marginTop: 30 }}>
        <Table
          bordered
          style={{ background: '#fff', border: '1px solid #ebebeb' }}
          columns={this.state.columns}
          dataSource={list}
          loading={this.props.loading}
          rowKey="id"
          pagination={{
            current: this.props.manageGiftCardList.pageNum,
            total: this.props.manageGiftCardList.total,
            onChange: this.pageChange.bind(this),
          }}
        />
      </div>
    )
  }
}

export default connect(({ manageGiftCardList, loading }) => (
  {
    manageGiftCardList,
    loading: loading.models.manageGiftCardList,
  })
)(GiftCardAppearanceList)
