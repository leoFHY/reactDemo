import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Modal } from 'antd'
import { hashHistory } from 'dva/router'

const confirm = Modal.confirm
const RoleList = ({
  dispatch,
  roleManagement,
}) => {
  const handleModify = (id) => {
    dispatch({
      type: 'roleManagement/getRoleDetail',
      payload: {
        id,
      },
    })
  }
  // 获取分配数据
  const handleDistribution = (text) => {
    dispatch({
      type: 'roleManagement/setSelectRole',
      payload: {
        text,
      },
    })
    dispatch({
      type: 'roleManagement/getUserByRole',
      payload: {
        roleId: text.id,
      },
    })
  }
  const handleChangeCurrent = (num) => {
    dispatch({
      type: 'roleManagement/getRoleList',
      payload: {
        pageNum: num,
      },
    })
  }
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '英文名称',
      dataIndex: 'enname',
      key: 'enname',
    },
    // {
    //   title: '归属机构',
    //   dataIndex: 'officeName',
    //   key: 'officeName',
    // },
    {
      title: '操作',
      key: 'action',
      render: text => (
        <span>
          {/* <a onClick={handleDistribution.bind(null, text)} >分配</a> */}
          {/* <span className="ant-divider" /> */}
          <a onClick={handleModify.bind(null, text.id)} >修改</a>
          <span className="ant-divider" />
          <a
            onClick={() => {
              confirm({
                title: '删除确认',
                content: '确定删除该角色吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                  dispatch({
                    type: 'roleManagement/delRol',
                    payload: {
                      roleId: text.id,
                    },
                  })
                },
                onCancel () {
                },
              })
            }}
          >删除</a>
        </span>
      ),
    },
  ]

  return (
    <Table
      bordered
      style={{ background: '#fff' }}
      dataSource={roleManagement.roleList.list}
      columns={columns}
      rowKey={record => record.id}
      loading={roleManagement.loading}
      pagination={{
        defaultCurrent: 1,
        total: roleManagement.roleList.total,
        pageSize: roleManagement.roleList.pageSize,
        current: roleManagement.roleList.pageNum,
        onChange: handleChangeCurrent.bind(this),
      }}
    />
  )
}


export default connect(({ roleManagement }) => ({ roleManagement }))(RoleList)
