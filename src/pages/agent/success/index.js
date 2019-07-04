import React, { Component } from 'react'
import { connect } from 'dva'
// import { Row, Col, Card, Select, Pagination } from 'antd'
import FilterForm from './components/filter'
import List from './components/List'
@connect(({ success, loading }) => ({ success, loading }))
class Public extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    const { dataSource, pagination } = this.props.success
    // 分页
    const onChange = page => {
      this.props.dispatch({
        type: 'success/getPageList',
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
            dataIndex: 'id',
            key: 'id',
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
            title: '成交房号',
            dataIndex: 'houseName',
            key: 'houseName',
            render: text => text || '--',
          },
          {
            title: '认购时间',
            dataIndex: 'buyTime',
            key: 'buyTime',
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
            dataIndex: 'commissionDate',
            key: 'commissionDate',
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
