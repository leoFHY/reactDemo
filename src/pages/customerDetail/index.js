import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
import List from './components/List'
import { Button } from 'antd'
// import { toThousands } from 'utils/copy'


@connect(({ customerDetail, loading }) => ({ customerDetail, loading }))
class Index extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    const { dispatch, customerDetail } = this.props
    const { dataSource,pagination } = customerDetail
    const exportExcel = () => {
        dispatch({
          type: 'customerDetail/export'
        })
    }
    const onChange = page => {
        dispatch({
          type: 'customerDetail/getPageList',
          payload: {
            pageNum: page,
            pageSize: 10,
          }
        })
      }    
    const columns = [
          {
            title: '姓名',
            dataIndex: 'customerName',
            key: 'customerName',
            render: text => (
              <span style = {{color:'#108ee9'}}>{text || '--'}</span>
            ),
          },
          {
            title: '手机号',
            dataIndex: 'mobileTelephone',
            key: 'mobileTelephone',
            render: text => text || '--',
          },
          {
            title: '认证时间',
            dataIndex: 'attestationTime',
            key: 'attestationTime',
            render: text => text || '--',
          },
          {
            title: '会员身份',
            dataIndex: 'identity',
            key: 'identity',
            render: text => text || '--',
          },
          {
            title: '认购项目',
            dataIndex: 'buildingName',
            key: 'buildingName',
            render: text => text || '--',
          },
          {
            title: '认购项目所属区域',
            dataIndex: 'areaName',
            key: 'areaName',
            render: text => text || '--',
          },
          {
            title: '房号',
            dataIndex: 'roomName',
            key: 'roomName',
            render: text => text || '--',
          },
          {
            title: '认购时间',
            dataIndex: 'contractDate',
            key: 'contractDate',
            render: text => text || '--',
          },
          {
            title: '标准总价(元)',
            dataIndex: 'standardAmount',
            key: 'standardAmount',
            render: text => text || '--',
          },
          {
            title: '签约时间',
            dataIndex: 'signDate',
            key: 'signDate',
            render: text => text || '--',
          },
          {
            title: '成交总价(元)',
            dataIndex: 'roomTotalAmount',
            key: 'roomTotalAmount',
            render: text => text || '--',
          },
        ]
    return (
      <Page className = {styles.bg} >
          <Button type="primary"  onClick={ exportExcel } style = {{marginBottom:'20px'}}>导出报表</Button>
          <List columns={columns} dataSource={dataSource} pagination={{...pagination,onChange}}/>
          
      </Page>
    )
  }
}

Index.propTypes = {
  customerDetail: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Index
