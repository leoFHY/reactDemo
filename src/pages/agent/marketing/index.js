import React, { Component } from 'react'
import { connect } from 'dva'
// import { Row, Col, Card, Select, Pagination } from 'antd'
import FilterForm from './components/filter'
import List from './components/List'
@connect(({ marketing, loading }) => ({ marketing, loading }))
class Public extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    const { dataSource, pagination } = this.props.marketing
    // 分页
    const onChange = page => {
      this.props.dispatch({
        type: 'marketing/getPageList',
        payload: {
          type: "page",
          data: {
            pageNum: page,
            pageSize: 10,
          }
        },
      })
    }
    const columns = [
          {
            title: 'id',
            dataIndex: 'userInviteId',
            key: 'userInviteId',
            render: text => text
          },
          {
            title: '推介人',
            dataIndex: 'userName',
            key: 'userName',
            render: text => text || '--',
          },
          {
            title: '推介人手机号码',
            dataIndex: 'userPhone',
            key: 'userPhone',
            render: (text) => text || '--',
          }, 
          {
            title: '推介人身份证号',
            dataIndex: 'idCard',
            key: 'idCard',
            render: text => text || '否',
          },
          {
            title: '被推介人',
            dataIndex: 'inviteName',
            key: 'inviteName',
            render: text => text || '--',
          },
          {
            title: '被推介人手机号',
            dataIndex: 'invitePhone',
            key: 'invitePhone',
            render: text => text || '--',
          },
          {
            title: '推介楼盘',
            dataIndex: 'bfProjectName',
            key: 'bfProjectName',
            render: text => text || '--',
          },
          {
            title: '推介状态',
            dataIndex: 'inviteStatus',
            key: 'inviteStatus',
            render: text => text || '--',
          },
          {
            title: '推介时间',
            dataIndex: 'inviteTime',
            key: 'inviteTime',
            render: text => text || '--',
          },
          {
            title: '是否结佣',
            dataIndex: 'hasCommission',
            key: 'hasCommission',
            render: text => text || '--',
          },
          {
            title: '结佣时间',
            dataIndex: 'commissionTime',
            key: 'commissionTime',
            render: text => text || '--',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
              return (
                <span>
                  <a onClick={ () => {} }>详情</a>
                 
                </span>
              )
            }
          },
        ]
    return (
      <div>
        <FilterForm />
        <List columns={columns} dataSource={dataSource} pagination={{...pagination,onChange}}/>
      </div>
    )
  }
}

export default Public
