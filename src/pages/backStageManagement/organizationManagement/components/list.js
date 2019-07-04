import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import indexStyles from '../../menuManagement/index.less'
import { getName } from 'utils/transformData'

const confirm = Modal.confirm

class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  updateData (officeId) {
    this.props.dispatch(routerRedux.push({
      pathname: '/backStageManagement/organizationManagement/add',
      query: {
        officeId,
        item: 'update',
      },
    }))
  }
  addNewData (parentId) {
    this.props.dispatch(routerRedux.push({
      pathname: '/backStageManagement/organizationManagement/add',
      query: {
        parentId,
        item: 'listAdd',
      },
    }))
  }
  deleteData (officeId) {
    confirm({
      title: '删除确认',
      content: '确定删除该机构吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'organizationManagement/deletes',
          payload: {
            officeId,
          },
        })
      },
      onCancel () {
      },
    })
  }
  render () {
    const model = this.props.organizationManagement
    const columns = [{
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    }, 
    // {
    //   title: '归属区域',
    //   dataIndex: 'areaName',
    //   key: 'areaName',
    //   width: '15%',
    // }, {
    //   title: '机构编码',
    //   dataIndex: 'code',
    //   key: 'code',
    //   width: '15%',
    // }, {
    //   title: '机构类型',
    //   // dataIndex: 'type',
    //   key: 'type',
    //   width: '10%',
    //   render: text => (
    //     <span>{getName(text.type, model.typeList)}</span>
    //   ),
    // }, 
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '20%',
    }, {
      title: '操作',
      // dataIndex: 'action',
      key: 'action',
      render: text => (
        <div>
          <a tabIndex={-90} onClick={this.updateData.bind(this, text.id)}>修改</a><span className="ant-divider" />
          <a tabIndex={-80} onClick={this.deleteData.bind(this, text.id)}>删除</a><span className="ant-divider" />
          <a tabIndex={-70} onClick={this.addNewData.bind(this, text.id)}>添加下级机构</a>
        </div>
      ),
    }]
    return (
      <div>
        {model.pageList && model.pageList.length ?
          <Table bordered rowKey="id" style={{ background: '#fff', border: '1px solid #ebebeb' }} defaultExpandAllRows
            className={indexStyles.table} columns={columns} dataSource={model.pageList} pagination={false}
          />
          : ''}
      </div>
    )
  }
}

export default connect(({ organizationManagement, loading }) => ({ organizationManagement, loading: loading.models.organizationManagement }))(List)
