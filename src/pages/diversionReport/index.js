import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
import Filter from './components/Filter'
import List from './components/List'
import Create from './components/CreateModal'
import Edit from './components/CreateModal'
import Buttons from 'components/Buttons'
import { Modal,Button } from 'antd'
const confirm = Modal.confirm


@connect(({ diversionReport, loading, app }) => ({ diversionReport, loading, app }))
class Project extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
      id: '',
    }
  }

  render() {
    const { dispatch, diversionReport, app } = this.props
    const { dataSource, listDat } = diversionReport
    const { visible,visibleEdit,id } = this.state
    const { user } = app
    const { loginName } = user
    // 搜索   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          dispatch({
            type: 'diversionReport/getPageList',
            payload: {
              data: values,
              type: 'search',
            },
          });
        }
      });
    };
    // 重置
    const handleReset = cbFn => {
      cbFn && cbFn();
      dispatch({
        type: 'diversionReport/getPageList',
        payload: {
          data: {},
          type: 'reset',
        },
      });
    };
    //导出
    const exportExcel = () => {
      dispatch({
        type: 'diversionReport/export'
      })
  }
    // 创建商品
    const createProject = () => {
        this.setState({
          visible: true
        })
    }
    // 弹出框取消
    const handleCancel = (rtFn) => {
      rtFn && rtFn()
      this.setState({
        visible: false,
      });
    }
    // 弹出框确定
    const handleOk = (cbFn,rtFn) => {
      cbFn((err, values) => {
        if (!err) {
          values.loginName = loginName
           dispatch({
             type: 'diversionReport/editRecommend',
             payload: values,
             success: () => {
               this.setState({
                 visible: false,
               });
             }
           })
        }
      });
      rtFn && rtFn()
    }
   
   
    
    const modalProps = { 
      visible : visible,
      handleOk,
      handleCancel,
      diversionReport,
      name: '新建渠道',
      listDat: {}
    }
    
     
    // 弹出框取消
    const onCancel = (rtFn) => {
      rtFn && rtFn()
      this.setState({
        visibleEdit: false,
      });
    }
    // 弹出框确定
    const onOk = (cbFn, rtFn) => {
      cbFn((err, values) => {
        if (!err) {
          values.id = id
          values.loginName = loginName
          dispatch({
            type: 'diversionReport/editRecommend',
            payload: values,
            success: () => {
              this.setState({
                visibleEdit: false,
              });
            }
          })
        }
      });
      
      rtFn && rtFn()
    } 
    const editProps = {
       visible: visibleEdit,
       handleOk: onOk,
       handleCancel: onCancel,
       diversionReport,
       name: '编辑',
       listDat,
     }
    const onEdit = (record) => {     
      dispatch({
        type: 'diversionReport/saveList',
        payload: record
      })
      this.setState({
        id: record.id,
        visibleEdit: true,
      })
    }
    
   const onDel = (id) => {
      confirm({
        title: '确定要删除该渠道吗？',
        content: '删除后用户将不可见',
        onOk() {
          dispatch({
            type: 'diversionReport/del',
            payload: {
              id
            }
          })
        },
        onCancel() {},
      });
    }
   
    const columns = [
          {
            title: '日期',
            dataIndex: 'rank',
            key: 'rank',
            render: text => text || '--',
          },
          {
            title: '资源位名称',
            dataIndex: 'bfProjectName',
            key: 'bfProjectName',
            render: text => text || '--',
          },
          {
            title: '访问UV',
            dataIndex: 'word',
            key: 'word',
            render: text => text || '--',
          },
          {
            title: '访问PV',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
              return (
                <span>
                  <a onClick={ () => onEdit(record) }>编辑</a>
                   &nbsp;&nbsp;
                  <a onClick={ () => onDel(record.id)  }>删除</a>
                </span>
              )
            }
          },
        ]
    return (
      <Page className={styles.bg}>
          <Filter handleSubmit={handleSubmit} resetValue={handleReset} diversionReport={diversionReport} />
          <Button type="primary"  onClick={ exportExcel } style = {{marginBottom:'20px'}}>导出报表</Button>
          <List columns={columns} dataSource={dataSource} />
          <Create {...modalProps} />
          <Edit  {...editProps}/>
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
