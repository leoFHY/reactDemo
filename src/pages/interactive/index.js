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
import { Modal,Button, Table } from 'antd'
const confirm = Modal.confirm


@connect(({ interactive, loading, app }) => ({ interactive, loading, app }))
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
    const { dispatch, interactive, app } = this.props
    const { dataSource, listDat } = interactive
    const { visible,visibleEdit,id } = this.state
    const { user } = app
    const { loginName } = user
    // console.log(dataSource)
    // 搜索   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          dispatch({
            type: 'interactive/getPageList',
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
        type: 'interactive/getPageList',
        payload: {
          data: {},
          type: 'reset',
        },
      });
    };
    //导出
    const exportExcel = () => {
      dispatch({
        type: 'interactive/export'
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
             type: 'interactive/editRecommend',
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
      interactive,
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
            type: 'interactive/editRecommend',
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
       interactive,
       name: '编辑',
       listDat,
     }
    const onEdit = (record) => {     
      dispatch({
        type: 'interactive/saveList',
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
            type: 'interactive/del',
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
            fixed: 'left',
            width: 80,
            render: text => text || '--',
          },
          {
            title: '项目名称',
            dataIndex: 'bfProjectName',
            key: 'bfProjectName',
            fixed: 'left',
            width: 80,
            render: text => text || '--',
          },
          {
            title: '项目所属区域',
            dataIndex: 'word',
            key: 'word',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '详情页访问PV',
            dataIndex: 'bfProjectId',
            key: 'bfProjectId',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '详情页访问UV',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '关注量',
            dataIndex: 'id',
            key: 'operate0',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '意向登记量',
            dataIndex: 'id',
            key: 'operate',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '预约量',
            dataIndex: 'operate1',
            key: 'operate1`',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '到访人数',
            dataIndex: 'operate2',
            key: 'operate2',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '认筹人数',
            dataIndex: 'operate3',
            key: 'operate3',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '总加入购物车房源数',
            dataIndex: 'operate4',
            key: 'operate4',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '总认购房源数',
            dataIndex: 'operate5',
            key: 'operate5',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '总认购金额',
            dataIndex: 'operate6',
            key: 'operate6',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '总签约房源数',
            dataIndex: 'operate7',
            key: 'operate7',
            width: 150,
            render: text => text || '--',
          },
          {
            title: '总签约金额',
            dataIndex: 'operate8',
            key: 'operate8',
            fixed: 'right',
            width: 80,
            render: text => text || '--',
          },
        ]
    return (
      <Page className={styles.bg}>
          <Filter handleSubmit={handleSubmit} resetValue={handleReset} interactive={interactive} />
          <Button type="primary"  onClick={ exportExcel } style = {{marginBottom:'20px'}}>导出报表</Button>
          {/* <List columns={columns} dataSource={dataSource} /> */}
          <Table columns={columns} dataSource={dataSource} scroll={{ x: 1900 }} />
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
