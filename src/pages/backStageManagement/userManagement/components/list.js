import React from 'react'
import { connect } from 'dva'
import { Table, Modal } from 'antd'
// import PropTypes from 'prop-types'
// import { hashHistory } from 'dva/router'
import { getName } from 'utils/transformData'

const confirm = Modal.confirm
const UserList = ({
  dispatch,
  userManagement,
}) => {
  const handleClick = (text) => {
    dispatch({
      type: 'userManagement/getUserDetail',
      payload: {
        userId: text.id,
      },
    })
  }
  const handleChangeCurrent = (num) => {
    dispatch({
      type: 'userManagement/getUserList',
      payload: {
        pageNum: num,
      },
    })
  }
  const columns = [
    // {
    //   title: '归属公司',
    //   dataIndex: 'company',
    //   key: 'company',
    // },
    {
      title: '归属部门',
      dataIndex: 'office',
      key: 'office',
    },
    {
      title: '登录名',
      dataIndex: 'loginName',
      key: 'loginName',
    },
    // {
    //   title: '所属媒体',
    //   dataIndex: 'mediaId',
    //   key: 'mediaId',
    //   render: text => getName(text, userManagement.mediaList, 'id', 'value'),
    // },
    // {
    //   title: '用户类型',
    //   dataIndex: 'userType',
    //   key: 'userType',
    //   render: text => getName(text, userManagement.dictList, 'id', 'label'),
    // },
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
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '操作',
      key: 'action',
      render: text => (
        <span>
          <a
            onClick={handleClick.bind(null, text)}
          >修改</a>
          <span className="ant-divider" />
          <a
            onClick={() => {
              confirm({
                title: '删除确认',
                content: '确定删除该用户吗？',
                onText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                  dispatch({
                    type: 'userManagement/getDelUser',
                    payload: {
                      id: text.id,
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
      dataSource={userManagement.userList.list}
      columns={columns}
      rowKey={(record, index) => index}
      loading={userManagement.loading}
      pagination={{
        defaultCurrent: 1,
        total: userManagement.userList.total,
        pageSize: userManagement.userList.pageSize,
        current: userManagement.userList.pageNum,
        onChange: handleChangeCurrent,
      }}
    />
  )
}

export default connect(({ userManagement }) => ({ userManagement }))(UserList)
