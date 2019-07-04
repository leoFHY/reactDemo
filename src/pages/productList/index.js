import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
import { Modal } from 'antd'
import Filter from './components/Filter'
import List from './components/List'
import Create from './components/CreateModal' 
import Edit from './components/CreateModal'
import { Button } from 'antd'
import { deepCopy } from 'utils/copy.js'
import { getValue, bfProject } from 'utils/transformData'
const confirm = Modal.confirm;

@connect(({ filter, loading , app }) => ({ filter, loading , app}))
class Project extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
      id:"",
      page:1,
      detailList:{
        bfProjectId:"",
        bfProjectName:"",
        lyProjectId:"",
        lyProjectName:""
      },
      bfProjectIds:[],
      selectedRowKeys:[],
    }
  }
  componentDidMount() {
   this.props.dispatch({
     type: 'filterDetail/saveQuery',
     payload: {
       bfProjectId: '',
       status: ''
     },
   })
  }
  render() {
    const { dispatch, filter, app } = this.props
    const { dataSource, status, pagination,lyProjectList, showProductList } = filter
    const { user } = app
    const { loginName } = user
    const { bfProjectIds } = this.state
    // 搜索   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          values.showName = bfProject(values.showName, showProductList)
          dispatch({
            type: 'filter/getPageList',
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
        type: 'filter/getPageList',
        payload: {
          data: {
             pageNum: 1,
             pageSize: 10
          },
          type: 'reset',
        },
      });
      dispatch({
        type: 'filter/saveOnchangePage',
        payload: 1
      });
    };
    // 分页
    const onChange = page => {
      // console.log(page)
      // this.setState({
      //   page: page,
      // })
      dispatch({
        type: 'filter/getPageList',
        payload: {
          pageNum: page,
          pageSize: 10,
        },
      })
      dispatch({
        type: 'filter/saveOnchangePage',
        payload: page
      })
    }
    
    // 创建商品
    const createProject = () => {
      this.setState({
        visible: true
      })
    }
    // 批量下架
    const batchDown = () => {
      let that = this
      confirm({
        title: '确定要下架这些商品吗？',
        content: '下架后商品在前端不可见。',
        okText:"确认",
        cancelText:"取消",
        onOk() {
          let list = deepCopy(dataSource)
          // let bfProjectIds = []
          // bfProjectIds = that.state.bfProjectIds

          dispatch({
            type: 'filter/getdownBfProjectBatch',
            payload: {
              bfProjectIds : that.state.bfProjectIds,
            },
            success: () => {
              that.setState({
                bfProjectIds: []
              })
            }
          })
          
        },
        onCancel() {

        },
      });

    }
    // 下载意向明细
    const downloadDetail = () => {
       dispatch({
         type: 'filter/download',
         payload: {}
       })
    }
    // 下载已认证员工明细
    const downloadEmployeesDetail = () => {
      dispatch({
        type: 'filter/downloadEmployeesDetail',
        payload: {}
      })
    }
    
    // 弹出框取消
    const handleCancel = (rtFn) => {
      rtFn && rtFn()
      this.setState({
        visible: false,
      });
    }
    // 创建商品弹出框确定
    const handleOk = (cbFn,rtFn) => {
      cbFn((err, values) => {
        
        if (!err) {
          
          let name = ""
          lyProjectList.map((v) => {
            if(v.lyProjectId === values.lyProjectId){
             name = v.lyProjectName
            }
          })
          values.loginName = loginName
          values.lyProjectName = name
          dispatch({
            type: 'filter/addProduct',
            payload: values,
            success: () => {
              this.setState({
                visible: false,
              })
              rtFn && rtFn()
            }
          })
        }
      });
     
    }
    const handelShow = (id) => {
        confirm({
          title: '确定要展示该房源吗？',
          content: '展示后，前端用户可查看此房源信息。',
          okText:"确认",
          cancelText:"取消",
          onOk() {
            dispatch({
              type: 'filter/showSwitch',
              payload: {
                bfProjectId: id,
                switchStatus: 'ON'
              }
            })
          },
          onCancel() {},
        });
    }
    const handelHidden = (id) => {
        confirm({
          title: '确定要隐藏该房源吗？',
          content: '隐藏后，该商品信息在前端不可见。',
          okText:"确认",
          cancelText:"取消",
          onOk() {
            dispatch({
              type: 'filter/showSwitch',
              payload: {
                bfProjectId:id,
                switchStatus: 'OFF'
              }
            })
          },
          onCancel() {},
        });
    }
    // 发布
    const handelRelease = (id, status) => {
      confirm({
        title: '确定要发布该商品吗？',
        content: '发布后， 前端用户可查看商品信息',
        okText:"确认",
        cancelText:"取消",
        onOk() {
           let list = deepCopy(dataSource)
           list.map((item) => {
             if (item.bfProjectId == id) {
               item.isRelease = false
             }
           })
           dispatch({
             type: 'filter/changeDataSource',
             payload: {
               list,
             }
           })
           dispatch({
             type: 'filter/downUp',
             payload: {
               id,
               status: '1',
               loginName,
             }
           })
        },
        onCancel() {},
      });
    }
    // 下架
    const handelOut = (id, status) => {
      confirm({
        title: '确定要下架该商品吗？',
        content: '下架后，该商品信息在前端不可见。',
        okText:"确认",
        cancelText:"取消",
        onOk() {
          let list = deepCopy(dataSource)
          list.map((item) => {
            if (item.bfProjectId == id) {
              item.isRelease = true
            }
          })
          dispatch({
            type: 'filter/changeDataSource',
            payload: {
              list,
            }
          })
          dispatch({
            type: 'filter/downUp',
            payload: {
              id,
              status: '0',
              loginName,
            }
          })
        },
        onCancel() {},
      });
    }
    // 查看详情页面
    const handelDetail = (bfProjectId,name,status,houseStatus) => {
      router.push({
        pathname: '/productList/detail',
        query: {
          bfProjectId,
          name,
          status,
          switchStatus: houseStatus,
        }
      })
    }
    //同步更新
    const handelUpdate = (bfProjectId) => {
        dispatch({
          type: 'filter/goUpdate',
          payload: {
            bfProjectId
          }
        })
    }

    //点击编辑
    const handelEdit = (record) => {
      this.setState({
        detailList:{
          bfProjectId:record.bfProjectId,
          bfProjectName:record.showName,
          lgProjectName:record.lgProjectName,
          lgProjectId:record.lgProjectId,
          lyProjectId:record.lyProjectId,
          lyProjectName:record.lyProjectName
        },
        visibleEdit: true
      })   
    }
    
    // 编辑弹出框确定
    const onOk = (cbFn, rtFn) => {
      
      cbFn((err, values) => {
        let lyProjectName = ""
        lyProjectList.map((v) => {
          if(v.lyProjectId === values.lyProjectId){
            lyProjectName = v.lyProjectName
          }
        })
        
        values.bfProjectName = values.name
        values.lyProjectName = lyProjectName
        values.bfProjectId = this.state.detailList.bfProjectId
        values.name = null
        values.lgProjectId = null
        if (!err) {  
          dispatch({
            type: 'filter/getupdateBfProject',
            payload:values,
            success: () => {
              console.log(2222)
              this.setState({
                visibleEdit: false,
              })
            }
          })
          
        }
      });
      rtFn && rtFn()
    } 

    // 弹出框取消
    const onCancel = (rtFn) => {
      rtFn && rtFn()
      this.setState({
        visibleEdit: false,
      });
      
    }

    //删除
    const handelDel = (id) => {
      let page = this.state.page
      confirm({
        title: '确定要删除该商品吗？',
        content: '删除后该商品将不可见',
        okText:"确认",
        cancelText:"取消",
        onOk() {
          
          dispatch({
            type: 'filter/getdeleteBfProject',
            payload: {
              bfProjectId:id
            }
          })
        },
        onCancel() {},
      });
    }

    const modalProps = { 
      visible : this.state.visible,
      handleOk,
      handleCancel,
      filter,
      name: '创建商品',
      detailList:{},
    }

    const editProps = {
      visible: this.state.visibleEdit,
      handleOk: onOk,
      handleCancel: onCancel,
      filter,
      name: '编辑商品',
      detailList:this.state.detailList
    }
    
    const rowSelection = {
      selectedRowKeys : bfProjectIds,
      onChange: (selectedRowKeys) => {
        this.setState({ bfProjectIds:selectedRowKeys })
       
      },
     
      
    }
    const columns = [
          {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
            render: text => text || '--',
          },
          {
            title: '商品名称',
            dataIndex: 'showName',
            key: 'showName',
            render: text => text || '--',
          },
          {
            title: '蓝光在线楼盘名称',
            dataIndex: 'lgProjectName',
            key: 'lgProjectName',
            render: text => text || '--',
          },
          {
            title: '蓝光在线楼盘ID',
            dataIndex: 'lgProjectId',
            key: 'lgProjectId',
            render: text => text || '--',
          },
          {
            title: '分机号',
            dataIndex: 'bfSalesPhone',
            key: 'bfSalesPhone',
            render: text => text || '--',
          },
          {
            title: '商品状态',
            dataIndex: 'status',
            key: 'status',
            render: text => getValue(text, status) || '--',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
              return (
                <span style = {{color:'#40a9ff'}}>
                  <a onClick={ () => handelDetail(record.bfProjectId,record.showName,record.status,record.houseShowSwitchStatus) }>商品详情</a>
                  &nbsp;&nbsp;
                  {
                    record.status == 0 ? <a onClick={() => handelRelease(record.bfProjectId,record.status)}>发布</a> :
                    <a onClick={() => handelOut(record.bfProjectId,record.status)}>下架</a>
                  }
                  &nbsp;&nbsp;
                  {/* <a onClick={ () => handelUpdate(record.bfProjectId) }>同步更新</a>
                  &nbsp;&nbsp; */}
                  {
                    record.houseShowSwitchStatus == 'ON' ? <a onClick={() => handelHidden(record.bfProjectId)}>隐藏房源</a> :
                    <a onClick={() => handelShow(record.bfProjectId)}>展示房源</a>
                  }
                   &nbsp;&nbsp;
                  <a onClick={ () => handelEdit(record) }>编辑</a>
                   &nbsp;&nbsp;
                  <a onClick={ () => handelDel(record.bfProjectId) }>删除</a>
                </span>
              )
            }
          },
        ]
    return (
      <Page className={styles.bg}>
          <Filter handleSubmit={handleSubmit} resetValue={handleReset} filter={filter} />
          <div className={styles.dashed}>
            <Button  onClick={ createProject } type="primary">创建商品</Button>
            &nbsp;&nbsp;
            <Button  onClick={ batchDown } type="primary">批量下架</Button>
            &nbsp;&nbsp;
            <Button  onClick={ downloadDetail } >下载意向登记明细</Button>
            &nbsp;&nbsp;
            <Button  onClick={ downloadEmployeesDetail } >下载已认证员工明细</Button>
          </div>
          
          <List columns={columns} dataSource={dataSource} pagination={{...pagination,onChange}} rowSelection={rowSelection}/>
          <Create {...modalProps} />
          <Edit {...editProps} /> 
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
