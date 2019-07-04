import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
import { Button,  message, Modal, Input, Collapse   } from 'antd';
const confirm = Modal.confirm;
const { TextArea } = Input;
const Panel = Collapse.Panel;
@connect(({ commission, loading, bucket, app ,filterDetail }) => ({ commission, loading, bucket, app ,filterDetail}))
class Commission extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
       
    }
  }

  render() {
    const { dispatch, commission, filterDetail } = this.props
    const { commissionInfo, commissionTitle  } = commission
    const { status,bfProjectId } = filterDetail
    const handelSave = () => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      if (commissionInfo == '' || commissionTitle == ''){
        message.warning('请将信息填写全,再保存')
        return
      }
      dispatch({
        type: 'commission/pushInfo',
        payload: {
          bfProjectId,
          commissionInfo,
          commissionTitle,
        },
      })
    }
    const handelDel = (rtFn) =>{
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      confirm({
        title: '确定要删除该佣金信息吗？',
        content: '删除后数据将清空',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          rtFn && rtFn()
          dispatch({
            type: 'commission/getDel',
            payload: {
              bfProjectId,
            },
            success:() => {
              dispatch({
                type: 'commission/getInfo',
                payload: {
                  bfProjectId
                },
              })
            }
          })
        },
        onCancel() {},
      });
      
    }
    const changeValue = (e) => {
      dispatch({
        type: 'commission/saveInfo',
        payload:{
          data: {
            commissionInfo:e.target.value
          }
        }
      })
    }
    const changeTitle = (e) => {
      dispatch({
        type: 'commission/saveInfo',
        payload: {
          data: {
            commissionTitle: e.target.value
          }
        }
      })
    }
    
    return (
      <Page>
         <Button type="primary" onClick={() => handelSave()} style={{marginBottom: '20px'}}>保存</Button>
         &nbsp;&nbsp;
         <Button type="primary" onClick={() => handelDel()} style={{marginBottom: '20px'}}>删除</Button>
         <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="佣金详情" key="1">
              <div className = {styles.box}>
                <span className = {styles.title}>标题 :</span>
                <Input placeholder="请填写标题" style = {{width:'60%'}} value = {commissionTitle} onChange = {(e) => changeTitle(e) }/>
              </div>
              <div className = {styles.box}>
                <span className = {styles.title}>佣金详情 :</span>
                <div style = {{width: '60%'}}>
                  <TextArea placeholder="请输入佣金详情" value = {commissionInfo} rows={4} onChange = {(e) => changeValue(e) }></TextArea>
                </div>
              </div>
              
            </Panel>
          </Collapse>
      </Page>
    )
  }
}

Commission.propTypes = {
  commission: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Commission
