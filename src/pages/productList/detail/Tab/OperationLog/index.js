import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Table, Icon  } from 'antd';
import './index.less'
@connect(({ filterDetail, loading }) => ({ filterDetail, loading }))
class operationLog extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
  componentDidMount() {
    //  const bfProjectId = this.props.location.query.bfProjectId
    //  this.props.dispatch({
    //     type: 'filterDetail/getLoglist',
    //     payload: {
    //       bfProjectId,
    //     },
    //  })
  }
  render() {
    const { dispatch, filterDetail, pagination } = this.props
    const { loglist } = filterDetail
    const style = {
      width: '8px',
      height: '8px',
      borderRadius: '100%',
      backgroundColor: '#999999',
      display: 'inline-block',
      marginRight: '15px'
    }
    const columns = [{
      title: '日期',
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'left',
      render: (text, record) => (
        <span>
           <span style={style}></span>
           {text}
        </span>
      ),
    }, {
      title: '姓名',
      dataIndex: 'createBy',
      key: 'createBy',
    }, {
      title: '操作',
      dataIndex: 'editType',
      key: 'editType',
      
    }];

  
    return (
      <Page>
        <Table columns={columns} dataSource={loglist} showHeader={false} rowKey = {(record,i) => i }/>
      </Page>
    )
  }
}

operationLog.propTypes = {
  filterDetail: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default operationLog
