import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { router } from 'utils'
import styles from './index.less'
import Buttons from 'components/Buttons'


import { Modal,Button, Table, Upload, Row, Col, Icon,message, Form, Input, LocaleProvider, DatePicker} from 'antd' 
import Tree2 from './components/Tree2'
import List from './components/List'
import { multipleImageUploadFan, openFileUpload } from 'utils/ossUploadUtils'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import './components/index.less'
import moment from 'moment'
import { deepCopy } from 'utils/copy'
import { isArray } from 'util';
import { reject } from 'q';
import { isAbsolute } from 'path';
const confirm = Modal.confirm
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@connect(({ Netherlands, Addhelanpais,loading, app ,bucket}) => ({ Netherlands, Addhelanpais,loading, app ,bucket}))
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
      editData:{},
      status:'done',
      page:1
    }
  }

  render() {
    const { dispatch, Netherlands, Addhelanpais,app,bucket } = this.props
    const { 
      dataSource, pagination,page,houseId,treeShow2,downHelanpaisList,
      listImg,  previewSrc,
      // downHelanpaisList,
      editData} = Addhelanpais
    const { visible,visibleEdit,id ,visiblePage2} = this.state
    const { user } = app
    const { loginName } = user
    // console.log(Addhelanpais.downHelanpaisList)
   
    //导出
    const publishOk = () => {
      // console.log(downHelanpaisList)
      let list = deepCopy(downHelanpaisList)
      let bfHouseDiscountIds = []
      list.map(v => {
        bfHouseDiscountIds.push(v.bfHouseDiscountId)
      })
      // console.log(bfHouseDiscountIds)
      // return
      dispatch({
        type: 'Addhelanpais/getUpDateStatus',
        payload:{
          status:'1',
          bfHouseDiscountIds:bfHouseDiscountIds
        },
        success:() => {
          dispatch({
            type: 'Addhelanpais/getPageList',
            payload: {
                pageNum:1,
                pageSize:10
            },
          })
        }

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
             type: 'Addhelanpais/editRecommend',
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
      Netherlands,
      name: '新建渠道',
      editData: {},
      listImg,
    }
    

     // 分页
     const onChange = (pagination,filters, sorter) => {
      console.log(pagination,filters, sorter)
      let page = pagination.current
      // return
      dispatch({
        type: 'Addhelanpais/saveOnchangePage',
        payload: page
      })
    };
    // console.log(Netherlands.treeShow)
    const openTree = () => {
      
      dispatch({
        type:'Addhelanpais/changeTreeShow',
        payload:true
      })
    }
    //  console.log(Netherlands.offerDetailData)
    
   const onDel = (values) => {
     console.log(values)
      // return
      confirm({
        title: '确定要删除该优惠活动？',
        content: '删除后该活动将永久删除。',
        onOk() {
          
          if(values.bfHouseDiscountId){
            dispatch({
              type: 'Addhelanpais/del',
              payload: {
                id:values.bfHouseDiscountId
              },
              success:() => {
                dispatch({
                  type: 'Addhelanpais/getPageList',
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
          }else{
            let arr = deepCopy(downHelanpaisList)
            // console.log(arr)
            downHelanpaisList.map((v,i) => {
              // console.log(arr)
              if(v === values){
                // console.log(2222)
                arr.splice(i,1)
              }
            })
            // console.log(arr)
            // return
            dispatch({
              type: 'Addhelanpais/savePageList',
              payload: arr
            })
          }
          
        },
        onCancel() {},
      });
    }
    const addOfferHouse = () => {
      console.log(111)
      dispatch({
        type:'Addhelanpais/getHouseList',
        payload:{
          id:'',
          type:'1'
        }
      })
      dispatch({
        type:'Addhelanpais/changeTreeShow2',
        payload:true
      })
    }
    const closePage = () => {
      router.push({
        pathname: '/netherlands',
        query: {
          
        }
      })
    }

    const previewCancel = () => {
      this.setState({
        previewVisible:false
      })
    }
    
   
    // const { time } = downHelanpaisList
    
    const saveMultipleImgs = (url,i,imgs,record) => {
      console.log(i)
      console.log(imgs)
      console.log(url)
      message.destroy()
     
      let listImg = deepCopy(imgs)
      listImg[i] = {}
      listImg[i].uid = i
      listImg[i].status = 'done'
      listImg[i].url = url[0]
      console.log(listImg)
      dispatch({
        type: 'Addhelanpais/saveMediaImages',
        payload: {
          data: listImg,
        },
      })
      let arr = deepCopy(downHelanpaisList)
      arr.map((v,j) => {
        if(v.houseId === record.houseId && i === j){
          v.houseDiscountPic = listImg[i].url
        }
       
      })
      // console.log(arr)
      // console.log(record)
      // return
      dispatch({
        type: 'Addhelanpais/savePageList',
        payload:  arr,
       
      })
    }
    
    const addColumns = [
      {
        title: '图片',
        dataIndex: 'houseDiscountPic',
        key: 'houseDiscountPic',
        // fixed: 'left',
        width: 80,
        render: (text,record,i) => {
                // console.log(text)
                const imgsList = []
                // console.log(listImg)

               
                // let listImg = deepCopy(listImg)
                // console.log(listImg)
                let imglist = deepCopy(listImg)
                let index = i
                console.log(page)
                if(page > 1){
                  index = (page - 1 ) * 10 + i
                }
                // console.log(index)
                return  ( 
          
                <div 
                  onClick={(e) => { 
                    // console.log(e)
                    // return
                    openFileUpload(e,dispatch,'Addhelanpais') 
                  }}
                >
                  {
                      
                  listImg.length ?
                    <Upload
                    accept="image/*"
                    fileList = { 
                      deepCopy( imglist[index].url !== '' ? [imglist[index]] : [] )   
                    }
                    
                    listType="picture-card"
                    
                    onPreview={
                      (file) => {
                        // console.log(listImg)
                        // console.log(file)
                        this.setState({
                          previewImage: file.url || file.thumbUrl,
                          previewVisible: true,
                        })
                      }
                    }
                    beforeUpload = {(e) => {
                      // console.log(e)
                      let reg = new RegExp(/^image\/jpeg|gif|jpg|png$/, 'i')
                      if (!reg.test(e.type)) {
                        message.warn('图片格式不正确,请重新上传!')
                      
                        return false
                      }
                      console.log(multipleImageUploadFan(e, bucket))
                      imgsList.push(multipleImageUploadFan(e, bucket))
                      console.log(imgsList)
                      return false
                    }}
                    
                    onChange = {
                      (e) => {
                        // console.log(e)
                        message.destroy()
                        if (e.file.status === "removed"){
                          // console.log(e.fileList)
                          // console.log(text)
                          let list = deepCopy(listImg)
                          // console.log(list)
                          // console.log(i)
                          list[index] = { uid:index,url:'',status:'done'}
                          // list = e.fileList
                          // console.log(list)
                          // console.log(downHelanpaisList)
                          // return
                          dispatch({
                            type: 'Addhelanpais/saveMediaImages',
                            payload: {
                              data:list
                            }
                          })            
                          return
                        }
                        
                        message.loading('图片正在上传中，请稍后', 10)
                        // console.log(imgsList)
                        console.log(imgsList.length,e.fileList.length)
                        if (imgsList.length === e.fileList.length) {
                          console.log(555555555)
                          Promise.all(imgsList).then((res) => {
                            console.log(res)
                            message.destroy()
                            saveMultipleImgs(res,index,listImg,record)
                          }, (rej) => {
                            message.warning(rej)
                          }).catch((err) => {
                            
                          })
                        }
                      }
                     
                    }
                  
                  >
                    {
                      imglist[index].url === '' ?
                      <div >
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                      </div> 
                      :null
                    }
                  </Upload>
                  :null
                
                  
                  }
                </div>
              
        )}
      },
      {
        title: '项目所属区域',
        dataIndex: 'areaName',
        key: 'bfProjectName',
        width: 150,
        // selectable:true,
        editable:true,
        render: text => text || '--',
      
      },
      {
        title: '项目名称',
        dataIndex: 'bfProjectName',
        key: 'word',
        width: 150,
        editable:true,
        render: text => text || '--',
      },
      {
        title: '优惠房源',
        dataIndex: 'houseName',
        key: 'bfProjectId',
        width: 150,
        editable:true,
        render: text => text || '--',
      },
     
      {
        title: '优惠名称',
        dataIndex: 'discountName',
        key: 'operate1`',
        width: 150,
        editable:true,
        render: text => text || '--',
      },
      {
        title: '活动时间段',
        dataIndex: 'time',
        key: 'operate2',
        width: 150,
        editable:true,
        // render: text => text || '--',
        render: (text,record) => {
          // return (
          //   <div>
          //     <LocaleProvider locale={zh_CN}>
          //       <RangePicker 
          //         showTime={{ format: 'HH:mm:ss' }} 
          //         format="YYYY-MM-DD HH:mm:ss"  
          //         ref={node => (this.input = node)}
          //         onPressEnter={this.save}
          //         onBlur={this.save}
          //       />
          //     </LocaleProvider>
          //   </div>)
          // console.log(record)
          return (record.startDate || '--') + ' 至 ' + (record.endDate || '--')
        }
      },
      {
        title: '身份类型',
        dataIndex: 'identityTypes',
        key: 'operate3',
        width: 150,
        editable:true,
        // selectable:true,
        render: (text,record) => {
          // console.log(record)
          if(record.identityTypes){
            let arr = record.identityTypes.split(',')
            let list = []
            // console.log(Addhelanpais.typeCheck)
            Addhelanpais.typeCheck.map(v => {
              arr.map(j => {
                if(v.value === j)
                list.push(v.label) 
              })
            })
            let string = list.join(',')
            return text = string
          }
          
          // console.log(arr,string)
          return  '--'
          // return  (record.startDate || '--') + ' 至 ' + (record.endDate || '--')
        }


        
      },
      {
        title: '起始价(元)',
        dataIndex: 'startAmount',
        key: 'operate4',
        width: 150,
        editable:true,
        render: text => text || '--',
      },
      {
        title: '时间间隔(s)',
        dataIndex: 'intervalSecond',
        key: 'operate5',
        width: 150,
        editable:true,
        render: text => text || '--',
      },
      {
        title: '降价金额(元)',
        dataIndex: 'intervalDownPrice',
        key: 'operate6',
        width: 150,
        editable:true,
        render: text => text || '--',
      },
      {
        title: '底价(元)',
        dataIndex: 'minAmount',
        key: 'operate7',
        width: 150,
        editable:true,
        render: text => text || '--',
      },
      {
        title: '操作',
        dataIndex: 'operate9',
        key: 'operate13',
        // fixed: 'right',
        width: 80,
        render: (text,record) => {
          return (
            <span>
              <a onClick={ () => onDel(record)  } style={{color:'#1890ff'}}>删除</a>
              
            </span>
          )
        }
      },
    ]


    const onSelectAll = (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, selectedRows)
    }
    const savelist = () => {
      console.log(downHelanpaisList)
      let values = deepCopy(downHelanpaisList) 
      let flag = true
      values.map(v => {
        if(v.houseDiscountPic === null || v.discountName === null || v.startDate === null){
          return flag = false
        }
      })
      if(!flag){
        message.warn('请补全列表信息')
      }
      if(flag){

        dispatch({
          type:'Addhelanpais/getDownHelanpais',
          payload:{ 
            helanpais:downHelanpaisList
          },
          success:() => {
            dispatch({
              type:'Addhelanpais/getPageList',
              payload:{ 
                
              },
            })
          }
        })
      }
      
      console.log(downHelanpaisList)
    }
    
    return (
      <div>
        <div style={{}}>
        <Page className={styles.bg2} >
          <Row gutter={24} style={{backgroundColor:'#fff'}}>
            <Col span={14} style = {{margin:'20px 0px 0px 0px'}}>
              <span>批量添加荷兰拍</span>
            </Col>
            <Col span={10}>
              <Button type="primary"  onClick={ addOfferHouse } style = {{margin:'20px 0px 20px 20px'}}>添加优惠房源</Button>
              <Button type="primary"  onClick={ savelist } style = {{margin:'20px 0px 20px 20px'}}>保存</Button>
              <Button type="primary"  onClick={ publishOk } style = {{margin:'20px 0px 20px 20px'}}>完成发布</Button>
              <Button icon="close" onClick={ closePage } style = {{margin:'20px 0px 20px 20px'}}></Button>
            </Col>
          </Row>
          
          <Tree2 visible = {treeShow2} style={{zIndex: '1001'}} dispatch={dispatch}/>
          <List
            columns={addColumns} 
            dataSource={downHelanpaisList}  
            scroll={{ x: 2400 }} 
            Addhelanpais={Addhelanpais}
            dispatch={dispatch}
            // pagination={{...pagination,onChange}}
            onChange={onChange}
          >
          </List>
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
      </div>
    )
  }
}

Project.propTypes = {
  addhelanpais: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Project
