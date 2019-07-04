import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Modal } from 'antd'
import { hashHistory } from 'dva/router'

const confirm = Modal.confirm
const RoleMemberList = ({
  dispatch,
  roleManagement,
}) => {
  const columns = [
    {
      title: '归属公司',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '归属部门',
      dataIndex: 'office',
      key: 'office',
    },
    {
      title: '登陆名',
      dataIndex: 'loginName',
      key: 'loginName',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '手机',
      dataIndex: 'Mobile',
      key: 'Mobile',
    },
    {
      title: '操作',
      key: 'action',
      render: text => (
        <a onClick={() => {
          confirm({
            title: '删除确认',
            content: '确定删除该用户吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk () {
              let userIds = []
              roleManagement.selectUserByRoleList.forEach((e) => {
                if (e.id !== text.id) {
                  userIds = [...userIds, e.id]
                }
              })
              dispatch({
                type: 'roleManagement/addRoleUser',
                payload: {
                  userIds,
                  roleId: roleManagement.selectRole.id,
                  type: 'delete',
                },
              })
            },
            onCancel () {
            },
          })
        }}
        >移除</a>
      ),
    },
  ]
  return (
    <div>
      <Table
        bordered
        style={{ background: '#fff' }}
        dataSource={roleManagement.userByRoleList}
        columns={columns}
        rowKey={record => record.id}
      />
    </div>
  )
}


export default connect(({ roleManagement }) => ({ roleManagement }))(RoleMemberList)
