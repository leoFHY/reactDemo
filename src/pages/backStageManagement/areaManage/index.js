import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import AreaList from './components/list'
import AddForm from './components/form'

const TabPane = Tabs.TabPane

const AreaManage = ({
  areaManage,
  dispatch,
}) => {
  let handleReset
  const getHandleReset = (fn) => {
    handleReset = fn
  }
  const handleChangeTab = (activeKey) => {
    if (handleReset) {
      /* dispatch({
        type: 'areaManage/getParentAreas',
        payload: {
          areaId: '1',
        },
      }) */
      handleReset()
    }
    dispatch({
      type: 'areaManage/setTabKeys',
      payload: {
        tabKeys: activeKey,
        tabText: '新增',
        type: 'add',
      },
    })
  }
  return (
    <Tabs type="card"
      onChange={handleChangeTab}
      activeKey={areaManage.tabKeys}
    >
      <TabPane tab="区域列表" key="1">
        <AreaList />
      </TabPane>
      <TabPane tab={`区域${areaManage.tabText}`} key="2">
        <AddForm argums={{ getHandleReset }} />
      </TabPane>
    </Tabs>
  )
}

export default connect(({ areaManage }) => ({ areaManage }))(AreaManage)
