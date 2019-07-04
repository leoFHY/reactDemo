import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Button, Collapse, Form, message, Modal  } from 'antd';
import Preferential from './components/Preferential';
const confirm = Modal.confirm;
const Panel = Collapse.Panel;

@connect(({ filterDetail, loading, bucket, app }) => ({ filterDetail, loading, bucket, app }))
class Building extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    
    }
  }

  render() {
    const { dispatch, filterDetail, app } = this.props
    const { getFieldDecorator,validateFieldsAndScroll,resetFields } = this.props.form;
    const { status,bfProjectId } = filterDetail
    const { user } = app
    const { loginName } = user
    const handelSave = cbFn => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      cbFn((err, values) => {
        if (!err) {
          values.bfProjectId = filterDetail.bfProjectId || ''
          values.discountRemarks = filterDetail.ueditorPreInfo || ''
          if (values.time.length){
            values.startDate = values.time[0].format('YYYY-MM-DD HH:mm:ss') || ''
            values.endDate = values.time[1].format('YYYY-MM-DD HH:mm:ss') || ''
            values.time = null
          }
          values.loginName = loginName || ''
          dispatch({
              type: 'filterDetail/preInfoUpdate',
              payload: values,
           })
        }
      });
    }
    const handelDel = (rtFn) =>{
      confirm({
        title: '确定要删除该优惠政策吗？',
        content: '删除后数据将清空',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          rtFn && rtFn()
          dispatch({
            type: 'filterDetail/preInfoDel',
            payload: {
              bfProjectId,
            },
          })
        },
        onCancel() {},
      });
      
    }
    const contentList = {
      getFieldDecorator,
      bucket: this.props.bucket,
      dispatch: this.props.dispatch,
      filterDetail: filterDetail,
    }
    return (
      <Page>
         <Button type="primary" onClick={() => handelSave(validateFieldsAndScroll)} style={{marginBottom: '20px'}}>保存</Button>
         &nbsp;&nbsp;
         <Button type="primary" onClick={() => handelDel(resetFields)} style={{marginBottom: '20px'}}>删除</Button>
         <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="优惠政策" key="1">
              <Preferential  { ...contentList } />
            </Panel>
             
          </Collapse>
      </Page>
    )
  }
}
const BuildingInfo = Form.create()(Building);
BuildingInfo.propTypes = {
  filterDetail: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default BuildingInfo
