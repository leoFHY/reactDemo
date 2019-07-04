import React, { Component } from 'react'
import { Tabs } from 'antd'
import { connect } from 'dva'
import UserList from './list'
import UserFilter from './filter'
import AddUser from './addUser'

const TabPane = Tabs.TabPane

const UserContent = ({
  dispatch,
  userManagement,
}) => {
  let handleReset
  const getHandleReset = (fn) => {
    handleReset = fn
  }
  const handleChangeTab = (key) => {
    if (handleReset) {
      handleReset()
    }
    dispatch({
      type: 'userManagement/setTabKeys',
      payload: {
        key,
        text: '新增',
        userID: '',
      },
    })
  }
  return (
    <div>
      <Tabs type="card"
        onChange={handleChangeTab}
        activeKey={userManagement.tabKeys}
      >
        <TabPane tab="用户列表" key="1">
          <UserFilter />
          <UserList />
        </TabPane>
        <TabPane tab={`用户${userManagement.tabText}`} key="2">
          <AddUser argumes={getHandleReset} />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ userManagement }) => ({ userManagement }))(UserContent)
