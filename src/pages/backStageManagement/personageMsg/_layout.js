import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'

import PersonageMsg from './components/personageMsg'

const TabPane = Tabs.TabPane

const Index = ({ children, location, dispatch }) => {
  const isIndex = location.pathname === '/backStageManagement/personageMsg'
  const onTabClick = (key) => {
    dispatch(routerRedux.push({
      pathname: `/backStageManagement/${key === '1' ? 'personageMsg' : 'personageMsg/changePswd'}`,
    }))
  }
  return (
    <div>
      <Tabs type="card" activeKey={isIndex ? '1' : '2'} onChange={(key) => { onTabClick(key) }}>
        <TabPane tab="个人信息" key="1">
          {isIndex ? <PersonageMsg /> : ''}
        </TabPane>
        <TabPane tab="修改密码" key="2">
      {isIndex ? '' : children}
       </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ personageMsg }) => ({ personageMsg }))(Index)
