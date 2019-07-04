import React, { Component } from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import List from './list'

const TabPane = Tabs.TabPane

class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  onTabClick (key) {
    const officeId = this.props.organizationManagement.saveOfficeId || ''
    this.props.dispatch(routerRedux.push({
      pathname: `/backStageManagement/organizationManagement${key === '1' ? '' : '/add'}`,
      query: {
        item: `${key === '1' ? '' : 'tabAdd'}`,
      },
      state: {
        officeId: `${key === '1' ? officeId : ''}`,
      },
    }))
  }

  render () {
    const location = this.props.location
    const isIndex = location.pathname === '/backStageManagement/organizationManagement'
    const isAdd = location.pathname === '/backStageManagement/organizationManagement/add'
    const isUpdate = location.query.item === 'update'
    return (
      <div>
        <Tabs type="card" activeKey={isAdd ? '2' : '1'} onChange={(key) => { this.onTabClick(key) }}>
          <TabPane tab="机构列表" key="1">
            {isIndex ? <List /> : ''}
          </TabPane>
          <TabPane tab={isUpdate ? '机构修改' : '机构添加'} key="2">
            {isIndex ? '' : this.props.add}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

// export default connect(({ organizationManagement }) => ({ organizationManagement }))(Main)
export default connect(({ organizationManagement, loading }) => (
  {
    organizationManagement,
    loading: loading.models.organizationManagement,
  })
)(Main)
