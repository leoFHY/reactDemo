import React, { Component } from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import RoleList from './components/list'
import RoleDistribution from './components/roleDistribution'
import AddRole from './components/addRole'

const TabPane = Tabs.TabPane

const RoleManagement = ({
  dispatch, roleManagement,
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
      type: 'roleManagement/setTabKeys',
      payload: {
        key,
        text: '新增',
      },
    })
  }
  return (
    <div>
      <Tabs type="card"
        onChange={handleChangeTab}
        activeKey={roleManagement.tabKeys}
      >
        <TabPane tab="角色列表" key="1">
          <RoleList />
        </TabPane>
        <TabPane tab={`角色${roleManagement.tabText}`} key="2">
          {
            roleManagement.tabText === '分配' ?
              <RoleDistribution /> : <AddRole argums={{ getHandleReset }} />
          }
        </TabPane>
      </Tabs>
    </div>
  )
}


export default connect(({ roleManagement }) => ({ roleManagement }))(RoleManagement)
