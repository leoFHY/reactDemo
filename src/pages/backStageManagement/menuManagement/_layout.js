import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'

import List from './components/list'
// import Add from './components/add'

const TabPane = Tabs.TabPane

const Index = ({ dispatch, menuManagement, children, location }) => {
  const isUpdate = location.query.item === 'update'
  const isIndex = location.pathname === '/backStageManagement/menuManagement'
  const onTabClick = (key) => {
    dispatch(routerRedux.push({
      pathname: `/backStageManagement/menuManagement${key === '1' ? '' : '/add'}`,
      query: {
        item: `${key === '1' ? '' : 'tabAdd'}`,
      },
    }))
    if (key === '2') {
      // dispatch({
      //   type: 'menuManagement/detail',
      //   payload: {
      //     key,
      //   },
      //   item: 'listAdd',
      // })
    } else {
      // dispatch({
      //   type: 'menuManagement/backIndex',
      //   payload: {
      //   },
      // })
    }
  }
  return (
    <div>
      <Tabs type="card" activeKey={isIndex ? '1' : '2'} onChange={(key) => { onTabClick(key) }}>
        <TabPane tab="菜单列表" key="1">
          {isIndex ? <List /> : ''}
        </TabPane>
        <TabPane tab={isUpdate ? '菜单修改' : '菜单添加'} key="2">
          {isIndex ? '' : children}
        </TabPane>
      </Tabs>
      { /* <Link to={{ pathname: '/hello', query: { name: 'test' } }}>Hello</Link> */ }
    </div>
  )
}

// Index.propTypes = {
//   menuManagement: PropTypes.object.isRequired,
//   dispatch: PropTypes.func.isRequired,
// }

export default connect(({ menuManagement }) => ({ menuManagement }))(Index)
