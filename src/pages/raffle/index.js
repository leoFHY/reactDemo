import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less';
import Tab1 from './tab1'
import Tab2 from './tab2'
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
@connect(({ raffle, loading }) => ({ raffle, loading }))
class Project extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
 
  render() {
    const { dispatch, raffle } = this.props
    // const { dataSource,pagination } = supplier
    // const { visible } = this.state
    const tabChange = (key) => {

    }
    return (
      <Page >
        <Tabs defaultActiveKey="1" onChange={tabChange} className={styles.bg}>
          <TabPane tab="奖品配置" key="1">
              <Tab1 />
          </TabPane>
          <TabPane tab="抽奖配置" key="2">
              <Tab2 />
          </TabPane>
        </Tabs>
      </Page>
    )
  }
}

Project.propTypes = {
  filter: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Project
