import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Table } from 'antd';
import  Edit  from './components/Edit'

@connect(({
  switchOn,
  loading,
}) => ({
  switchOn,
  loading,
}))
class Index extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      id: '',
      status: ''
    }
  }

  render() {
    const { dispatch, switchOn} = this.props
    const { switchList,  } = switchOn
    const { visible, id, status} = this.state
    // 弹出框取消
    const handleCancel = (rtFn) => {
      rtFn && rtFn()
      this.setState({
        visible: false,
      });
    }
    // 弹出框确定
    const handleOk = (cbFn, rtFn) => {
      cbFn((err, values) => {
        if (!err) {
          values.id =id;
          dispatch({
            type: 'switchOn/edit',
            payload: values,
            success: () => {
              this.setState({
                visible: false,
              });
            }
          })
        }
      });
      
      rtFn && rtFn()
    } 
    const editProps = {
       visible,
       handleOk,
       handleCancel,
       name: '编辑开关状态',
       status,
     }
    const onEdit = (record) => {
      this.setState({
        visible: true,
        id: record.id,
        status: record.switchStatus
      })
    }
   
    const columns = [
          {
            title: '排序',
            dataIndex: 'rank',
            key: 'rank',
            render: (text, record, index) => index+1,
          },
          {
            title: '控制名称',
            dataIndex: 'name',
            key: 'name',
            render: text => text || '--',
          },
          {
            title: 'code',
            dataIndex: 'code',
            key: 'code',
            render: text => text || '--',
          },
          {
            title: '状态',
            dataIndex: 'switchStatus',
            key: 'switchStatus',
            render: text => text || '--',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
              return (
                  <a onClick={ () => onEdit(record) }>编辑</a>
              )
            }
          },
        ]
    return (
      <Page>
          <Table 
          bordered
          style={{ background: '#fff', border: '1px solid #ebebeb' }}
          // loading={loading}
          rowKey={record => record.id}
          pagination={false}
          dataSource={switchList}
          columns={columns}
          />
          <Edit  {...editProps}/>
      </Page>
    )
  }
}

Index.propTypes = {
  filter: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Index
