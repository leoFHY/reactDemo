import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { router } from 'utils'
import styles from './index.less'
import Filter from './components/Filter'

import Create from './components/CreateModal'
import Edit from './components/CreateModal'
import Buttons from 'components/Buttons'


import { Modal,Button, Table, Upload, Row, Col, Icon,message } from 'antd' 

import moment from 'moment'
import { deepCopy } from 'utils/copy'
const confirm = Modal.confirm


@connect(({ Netherlands, loading, app ,bucket}) => ({ Netherlands, loading: loading.models.Netherlands, app ,bucket}))
class Project extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
      id: '',
      previewVisible:false,
      previewImage: '',
      visiblePage:'block',
      visiblePage2:'none',
      editData:{}
    }
  }

  render() {
    const { dispatch, Netherlands, app,bucket } = this.props
    const { 
      dataSource, pagination,page,houseId,treeShow2,downHelanpaisList,typeCheck,
      editData,listImg } = Netherlands
    const { visible,visibleEdit,id ,visiblePage2} = this.state
    const { user } = app
    const { loginName } = user
    // console.log(dataSource)
   
    // 搜索   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        // moment().format('YYYY-MM-DD HH:mm:ss')
        if(values.time.length > 0){
          values.startDate = values.time[0].format('YYYY-MM-DD HH:mm:ss') || ''
          values.endDate = values.time[1].format('YYYY-MM-DD HH:mm:ss') || ''
        } else {
          values.startDate = ''
          values.endDate = ''
        }
        values.time = null
        if (!err) {
          dispatch({
            type: 'Netherlands/getPageList',
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
        type: 'Netherlands/getPageList',
        payload: {
          data: {},
          type: 'reset',
        },
      });
    };
    //导出
    const exportExcel = () => {
      dispatch({
        type: 'Netherlands/getPageList',
        payload:{},
        isDownload: true,
      })
    }
    const batchAdd = () => {
      console.log(222)
      // dispatch({
      //   type:'Netherlands/getDownHelanpais',
      //   payload:{
      //   }
      // })
      router.push({
        pathname: '/netherlands/addhelanpais',
        query: {
          
        }
      })
      //页面切换
      // this.setState({
      //   visiblePage:'none',
      //   visiblePage2:'block'
      // })
    } 
    const closePage = () => {
      this.setState({
        visiblePage:'block',
        visiblePage2:'none'
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
             type: 'Netherlands/editRecommend',
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
   
    const saveMultipleImgs = (url) => {
      
      message.destroy()
      // message.info('上传图片成功')
      let listImg = []
      listImg[0] = {}
      listImg[0].uid = 1
     //  listImg[0].status = 'done'
     //  listImg[0] = Object.assign({'status':'done'}, listImg[0])
      listImg[0].url = url[0]
      
      this.props.dispatch({
        type: 'Netherlands/saveMediaImages',
        payload: {
          data: deepCopy(listImg),
        },
      })
    }
    
    const modalProps = { 
      visible : visible,
      handleOk,
      handleCancel,
      Netherlands,
      name: '新建渠道',
      editData: {},
      listImg,
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
          values.bfProjectId = editData.bfProjectId
          values.id = editData.bfHouseDiscountId
          values.startDate = editData.startDate
          values.endDate = editData.endDate
          values.houseId = houseId
          values.identityTypes = values.identityTypes.join(',')
          values.houseName = null
          values.time = null
          console.log(editData)
          console.log(values)
          // return
          dispatch({
            type: 'Netherlands/getAddOrUpdate',
            payload: values,
            success: () => {
              this.setState({
                visibleEdit: false,
              })
              rtFn && rtFn()
              dispatch({
                type: 'Netherlands/getPageList',
                payload: {
                  type:'page',
                  data:{
                    pageNum: page,
                    pageSize: 10,
                  }
                },
                
              });
            }
          })
        }
      });
      
      
    } 

     // 分页
     const onChange = page => {
      console.log(page)
      dispatch({
        type: 'Netherlands/getPageList',
        payload: {
          type:'page',
          data:{
            pageNum: page,
            pageSize: 10,
          }
        },
        
      });
      dispatch({
        type: 'Netherlands/saveOnchangePage',
        payload: page
      })
    };
    // console.log(Netherlands.treeShow)
    const openTree = () => {
      
      dispatch({
        type:'Netherlands/changeTreeShow',
        payload:true
      })
    }
    const editProps = {
       visible: visibleEdit,
       handleOk: onOk,
       handleCancel: onCancel,
       Netherlands,
       name: '编辑优惠活动',
       dispatch,
       editData,
       saveMultipleImgs,
       listImg,
       bucket,
       openTree,
      //  editData:this.state.editData
       
     }
    //  console.log(Netherlands.offerDetailData)
    const onEdit = (record) => {  
      console.log(record)
      // dispatch({
      //   type: 'Netherlands/getOfferDetail',
      //   payload:{id:record.bfHouseDiscountId} 
      // })
      console.log(Netherlands.treeList)
      dispatch({
        type: 'Netherlands/getHouseList',
        payload:{bfProjectId:record.bfProjectId}
      })
      dispatch({
        type: 'Netherlands/saveList',
        payload: record
      })
      saveMultipleImgs([record.houseDiscountPic])
      this.setState({
        id: record.id,
        visibleEdit: true,
      })
      
    }
    
   const onDel = (values) => {
    //  console.log(values,page)

      confirm({
        title: '确定要删除该优惠活动？',
        content: '删除后该活动将永久删除。',
        onOk() {
          // return
          dispatch({
            type: 'Netherlands/del',
            payload: {
              id:values.bfHouseDiscountId
            },
            success:() => {
              dispatch({
                type: 'Netherlands/getPageList',
                payload: {
                  type:'page',
                  data:{
                    pageNum: page,
                    pageSize: 10,
                  }
                }
              })
            }
          })
        },
        onCancel() {},
      });
    }
    const onChangeStatus = (values) => {
      // console.log(values)
      let status = (values.status==='0'?'1':'0')
      let bfHouseDiscountIds = [values.bfHouseDiscountId]
      console.log(bfHouseDiscountIds,status)
      confirm({
        title: status==='0'?'确定要下架该优惠活动？':'确定要发布该优惠活动？',
        content: status==='0'?'下架后该活动将前端不可见。':'发布后该活动前端可见',
        onOk() {
          // return
          dispatch({
            type: 'Netherlands/getUpDateStatus',
            payload:{
              bfHouseDiscountIds,
              status
            },
            success:() => {
              dispatch({
                type: 'Netherlands/getPageList',
                payload: {
                  type:'page',
                  data:{
                    pageNum: page,
                    pageSize: 10,
                  }
                }
              })
            }
          })
        },
        onCancel() {},
      });
    }
    
    const previewCancel = () => {
      this.setState({
        previewVisible:false
      })
    }
    const columns = [
      {
        title: '图片',
        dataIndex: 'houseDiscountPic',
        key: 'houseDiscountPic',
        // fixed: 'left',
        width: 80,
        render: (text,record,i) => (
          // console.log(i)    
          <Upload
            action={text}
            listType="picture-card"
            fileList={
              [{
                uid: i,
                status:'done',
                url: text,
              }]
            }
            onPreview = {
              (file) => {
             
                this.setState({
                  previewImage: file.url || file.thumbUrl,
                  previewVisible: true,
                })
              }
            }
            showUploadList = {
            {showRemoveIcon: false}
            }
          >
          </Upload>
        )
      },
      {
        title: '项目所属区域',
        dataIndex: 'areaName',
        key: 'areaName',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '项目名称',
        dataIndex: 'bfProjectName',
        key: 'word',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '优惠房源',
        dataIndex: 'houseName',
        key: 'bfProjectId',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '楼盘状态',
        dataIndex: 'bfProjectStatus',
        key: 'status',
        width: 150,
        render: text => text==='0'?'下架':'上架' || '--',
      },
      {
        title: '活动状态',
        dataIndex: 'activityStatus',
        key: 'operate0',
        width: 150,
        render: text => {
          if(text==='0') return '未开始'
          else if(text==='1') return '进行中'
          else if(text==='2') return '已结束'
          else return '--'
        }
      },
      {
        title: '荷兰拍状态',
        dataIndex: 'status',
        key: 'operate',
        width: 150,
        render: text => text==='0'?'下架':'上架' || '--',
      },
      {
        title: '优惠名称',
        dataIndex: 'discountName',
        key: 'operate1`',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '活动时间段',
        dataIndex: 'discountName',
        key: 'operate2',
        width: 150,
        // render: text => text || '--',
        render: (text,record) => {
          return record.startDate + ' 至 ' + record.endDate
        }
      },
      {
        title: '身份类型',
        dataIndex: 'identityTypes',
        key: 'operate3',
        width: 150,
        render: text =>  {
          // console.log(text)
          let list = []
          let arr = ''
          if(text){
            arr = text.split(',')
            typeCheck.map(v => {
              // console.log(text,arr)
              arr.map(j => {
                if( v.value === j){
                  list.push(v.label)
                  return text = list.join(',')
                  // return text = list.push(v.label).join(',')
                } 
              })
            })
          }
          
          return text || '--'
          // console.log(text)
         
        },
      },
      {
        title: '起始价(元)',
        dataIndex: 'startAmount',
        key: 'operate4',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '时间间隔(s)',
        dataIndex: 'intervalSecond',
        key: 'operate5',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '降价金额(元)',
        dataIndex: 'intervalDownPrice',
        key: 'operate6',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '底价(元)',
        dataIndex: 'minAmount',
        key: 'operate7',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '拍卖结果',
        dataIndex: 'saleStatus',
        key: 'operate8',
        width: 150,
        render: text => text==='0'?'未拍卖':'已拍卖'|| '--',
      },
      {
        title: '购房人',
        dataIndex: 'customerName',
        key: 'operate9',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'operate10',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '购房人身份',
        dataIndex: 'identity',
        key: 'operate11',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '购得金额(元)',
        dataIndex: 'money',
        width: 150,
        key: 'operate12',
        render: text => text || '--',
      },
      {
        title: '操作',
        dataIndex: 'operate9',
        key: 'operate13',
        // fixed: 'right',
        width: 100,
        render: (text,record) => {
          return (
            <span style={{color:'#1890ff'}}>
              <a onClick={ () => onEdit(record) }>编辑</a>
               &nbsp;&nbsp;
              <a onClick={ () => onDel(record)  }>删除</a>
              &nbsp;&nbsp;
              <a onClick={ () => onChangeStatus(record)  }>{record.status==='1'?'下架':'发布'}</a>
              
            </span>
          )
        }
      },
    ]

  
    return (
      <div>
        <div style={{display:this.state.visiblePage}}>
        <Page className={styles.bg} >
          <Filter handleSubmit={handleSubmit} resetValue={handleReset} Netherlands={Netherlands} />
          <Button type="primary"  onClick={ exportExcel } style = {{marginBottom:'20px'}}>导出报表</Button>
          <Button onClick={ batchAdd } style = {{margin:'20px'}}>批量添加荷兰拍</Button>
          <Table 
            columns={columns} 
            dataSource={dataSource} 
            scroll={{ x: 2400 }}  
            rowKey={(record,i) => i} 
            pagination={{...pagination,onChange}}
            loading={this.props.loading}
          />
          <Create {...modalProps} />
          <Edit  {...editProps}/>
          <Modal 
            visible={this.state.previewVisible} 
            footer={null} onCancel={previewCancel}
            // style={{ width: '900px',height:'900px' }}
            // maskClosable = {false}
          >
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </Page>
        </div>
        {/* <div>
          <Create3></Create3>
        </div> */}
      </div>
    )
  }
}

Project.propTypes = {
  Netherlands: PropTypes.object,
  dispatch: PropTypes.func,
  // loading:propTypes.models,
}

export default Project
