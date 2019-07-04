import React, { Component } from 'react'
import { connect } from 'dva'
// import { Row, Col, Card, Select, Pagination } from 'antd'
import FilterForm from './components/filter'
import List from './components/List'
@connect(({ publicModel, loading }) => ({ publicModel, loading }))
class Public extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    const { dataSource, pagination } = this.props.publicModel
    // 分页
    const onChange = page => {
        this.props.dispatch({
          type: 'publicModel/getPageList',
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
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            render: (text,record,index) => index+1
          },
          {
            title: '客户姓名',
            dataIndex: 'userName',
            key: 'userName',
            render: text => text || '--',
          },
          {
            title: '手机号码',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => text || '--',
          }, 
          {
            title: '身份证号',
            dataIndex: 'idCard',
            key: 'idCard',
            render: text => text || '--',
          },
          {
            title: '是否绑定银行卡',
            dataIndex: 'bankNo',
            key: 'bankNo',
            render: text => text || '--',
          },
          {
            title: '推介佣金(元)',
            dataIndex: 'totalCommissionMoney',
            key: 'totalCommissionMoney',
            render: text => parseInt(text) || '0',
          },
          {
            title: '已结佣金(元)',
            dataIndex: 'closeCommissionMoney',
            key: 'closeCommissionMoney',
            render: (text) => parseInt(text) || '0',
          },
          {
            title: '未结佣金(元)',
            dataIndex: 'unCloseCommissionMoney',
            key: 'unCloseCommissionMoney',
            render: text => parseInt(text) || '0',
          },
          {
            title: '推介次数',
            dataIndex: 'inviteCount',
            key: 'inviteCount',
            render: text => text || '--',
          },
          {
            title: '注册时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: text => text || '--',
          },
          {
            title: '最近登录时间',
            dataIndex: 'loginTime',
            key: 'loginTime',
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
