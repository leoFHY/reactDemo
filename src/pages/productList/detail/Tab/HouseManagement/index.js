import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Modal , Button, Form, Input, LocaleProvider, Upload,message } from 'antd';
import { deepCopy } from 'utils/copy'
import Filter from './components/Filter';
import List from './components/List';
import Edit from './components/CreateModal';
import Buttons from 'components/Buttons'
import Create from './components/CreateModal';
const confirm = Modal.confirm;

@connect(({ HouseManagement, loading, app, filterDetail, bucket }) => ({ HouseManagement, loading, app,filterDetail, bucket}))
class HouseMannagement extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      page:1,
      visible: false,
      visibleEdit: false,
      name:'',
      previewVisible:false,
      previewImage: '',
      disabledLock:true,
      typeValue:'',
      editList:{},
      checkStatus:false,
      houseTypeId:''
      
    }
  }
   componentDidMount() {
   
   }
  render() {
    const { dispatch, filterDetail, app ,HouseManagement,bucket } = this.props
    const { bfProjectId } = filterDetail
    
    // console.log(bfProjectId)
    // console.log( this.props)
    const {
      dataSource,
      // typeList,
      // activityStatus,
      houseTypeNameList,
      pagination,

      // houseId,
      listImg,
      editList,
      previewShow,
      previewSrc
    } = HouseManagement
    
    const { user } = app
    const { loginName } = user
    // 搜索   
   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          let data = {}
          data.bfProjectId = bfProjectId
          data.houseTypeId = values.houseTypeId
          data.shi = values.houseStructure.charAt(0)
          data.ting = values.houseStructure.charAt(2)
          data.wei = values.houseStructure.charAt(4)
          dispatch({
            type: 'HouseManagement/getPageList',
            payload: {
              data:data,
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
        type: 'HouseManagement/getPageList',
        payload: {
          data: {
            bfProjectId
          },
          type: 'reset',
        },
      })
      dispatch({
        type: 'HouseManagement/saveOnchangePage',
        payload: 1
      })
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
        type: 'HouseManagement/saveMediaImages',
        payload: {
          data: deepCopy(listImg),
        },
      })
    }



    // 分页
    const onChange = page => {
      this.setState({
        page: page,
      })
      dispatch({
        type: 'HouseManagement/getPageList',
        payload: {
          type:'page',
          data:{
            pageNum: page,
            pageSize: 10,
            bfProjectId,
          }
        },
      });
      dispatch({
        type: 'HouseManagement/saveOnchangePage',
        payload: page
      })
    };
    const judge = (v) => {
      if(v.name1 === "自定义"){
        
        this.setState({
          disabledLock: false
        })
      }
    }
   
    // 编辑
    const handelEdit = (record) => {
     
      
      let list = deepCopy(record)
  
      //  console.log(list)
      // dispatch({
      //   type: 'HouseManagement/saveEditList',
      //   payload:{
      //     data: list
      //   }
      // })
      this.setState({
        houseTypeId:record.houseTypeId
      })
      this.setState({
      visibleEdit: true,
        editList:record
      })
     
      judge(record)
      saveMultipleImgs([record.houseTypePic])
     
      
      //  dispatch({
      //    type: 'HouseManagement/saveBfBuildingId',
      //    payload: {
      //      bfBuildingId: record.id,
      //    },
      //  });
    }
    // 删除
    const handelDel = (id) => {
      // if (status === '1') {
      //   message.warning('请下架商品后再操作')
      //   return
      // }
      // console.log(id)
      const that = this
      confirm({
        title: '确定要删除该户型吗？',
        content: '删除后用户将看不到该户型。',
        onOk() {
          dispatch({
            type: 'HouseManagement/getdeleteHouseType',
            payload: {
              bfHouseTypeId: id,
            },
            success:() => {
              dispatch({
                type: 'HouseManagement/getPageList',
                payload: {
                  type:'page',
                  data:{
                    pageNum: that.state.page,
                    pageSize: 10,
                    bfProjectId,
                  }
                },
              });
            }
          });
        },
        onCancel() {},
      });
    }
    // 添加弹出框取消
    const handleCancel = rtFn => {
      rtFn && rtFn();
      this.setState({
        visible: false,
      });
    }
    // 编辑弹出框取消
    const onCancel = (rtFn) => {
      rtFn && rtFn()
      this.setState({
        visibleEdit: false,
      });
    }
    // 添加弹出框确定
    const handleOk = (cbFn,rtFn) => {
      cbFn((err, values) => {
        // console.log(values)
        
        if (!err) {
          let that = this
          let data = []
          values.bfProjectId = this.props.filterDetail.bfProjectId
          values.loginName = null
          values.houseTypePic = listImg[0].url || ""
          values.shi = values.shi - 0
          values.ting = values.shi - 0
          values.wei = values.shi - 0
          if(this.state.checkStatus === true){
            values.mainHouseType = values.mainHouseType
          }else{
            values.mainHouseType = null
          }
          // console.log(values)
           dispatch({
              type: 'HouseManagement/getaddHouseType',
              payload:values,
              success: () => {
        
                that.setState({
                  visible: false,
                  visibleEdit:false
                });
                dispatch({
                  type: 'HouseManagement/getPageList',
                  payload: {
                    type:'page',
                    data:{
                      pageNum: that.state.page,
                      pageSize: 10,
                      bfProjectId,
                    }
                  },
                });
                rtFn && rtFn();
             }
           })
        }
      });
      
      
    }
    // 编辑弹出框确定
   
    const onOk = (cbFn,rtFn) => {
      cbFn((err, values) => {
        
        
        if (!err) {
          if(!listImg.length) {
            alert('请传图片')
            return
          }
          let that = this
          
          let data = []
          values.bfProjectId = this.props.filterDetail.bfProjectId
          values.loginName = null
          values.houseTypePic = listImg[0].url 
          values.shi = values.shi - 0
          values.ting = values.ting - 0
          values.wei = values.wei - 0
          values.houseTypeId =that.state.houseTypeId
          if(this.state.checkStatus === true){
            values.mainHouseType = values.mainHouseType
          }else{
            values.mainHouseType = null
          }
            dispatch({
              type: 'HouseManagement/getaddHouseType',
              payload:values,
              success: () => {
                that.setState({
                  visibleEdit:false
                });
                dispatch({
                  type: 'HouseManagement/getPageList',
                  payload: {
                    type:'page',
                    data:{
                      pageNum: that.state.page,
                      pageSize: 10,
                      bfProjectId,
                    }
                  },
                });
                rtFn && rtFn();
              }
            })
        }
      });
      
      
    }
    // 添加
    const createHouse = () => {

        this.setState({
          visible:true,
        })
        let listImg = []
        this.props.dispatch({
          type: 'HouseManagement/saveMediaImages',
          payload: {
            data: deepCopy(listImg),
          },
        })
        // saveMultipleImgs()
    }
    
    const previewCancel = () => {
      this.setState({
        previewVisible:false
      })
    }
    
    const houseTypeChange = (value) => {
      if(value === "自定义"){
        this.setState({
          disabledLock:false
        })
      }else{
        this.setState({
          disabledLock:true,
          typeValue:""
        })
      }
    }
    const checkChange = (e) => {
     
      this.setState({
        checkStatus:e.target.checked
      })
    }
    const columns = [
          {
            title: '户型图',
            dataIndex: 'houseTypePic',
            key: 'houseTypePic',
            render: (text,record) => (
              
              <Upload
                action={text}
                listType="picture-card"
                fileList={
                  [{
                    uid: record.houseTypeId,
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
            title: '户型名称',
            dataIndex: 'name',
            key: 'name',
            render: text => text || '--',
          },
          {
            title: '户型结构',
            dataIndex: 'typeStructure',
            key: 'typeStructure',
            render: (text,record) => {
              
              return text = record.shi + '室' +record.ting +'厅' +record.wei +'卫'
            } ,
          },
          {
            title: '建筑面积(平方米)',
            dataIndex: 'area',
            key: 'area',
            render: text => text || '--',
          },
          {
            title: '物业类型',
            dataIndex: 'propertyType',
            key: 'propertyType',
            render: text => text || '--',
          },
          {
            title: '预计售价（万元）',
            dataIndex: 'prePrice',
            key: 'prePrice',
            render: text => text || '--',
          },
          {
            title: '主力户型',
            dataIndex: 'mainHouseType',
            key: 'mainHouseType',
            render: text => text || '--',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
            
              return (
                <span>
                   <a onClick={() => handelEdit(record)}>编辑</a>
                  &nbsp;&nbsp;
                  <a onClick={() => handelDel(record.houseTypeId)}>删除</a>
                </span>
              )
            }
          },
        ]
    
    
   
    
    const editProps = {
      visible: this.state.visibleEdit,
      handleOk:onOk,
      
      bucket,
      editList:this.state.editList,
      filterDetail,
      saveMultipleImgs,
      name:'编辑户型',
      handleCancel:onCancel,
      HouseManagement,
      previewShow,
      previewSrc,
      dispatch,
      listImg,
      storageList: {},
      houseTypeChange,
      disabledLock:this.state.disabledLock,
      checkChange,
      typeValue:this.state.typeValue,
      
    }
    const createProps = {
      filterDetail,
      saveMultipleImgs,
      name:'添加户型',
      handleCancel:handleCancel,
      visible: this.state.visible,
      HouseManagement,
      handleOk:handleOk,
      bucket,
      previewShow,
      previewSrc,
      dispatch,
      listImg,
      editList:{},
      storageList: {},
      houseTypeChange,
      disabledLock:this.state.disabledLock,
      checkChange,
      typeValue:this.state.typeValue,
      // linkType: linkType1
    }
    return (
      <Page>
          <Filter handleSubmit={handleSubmit} resetValue={handleReset} filterDetail={filterDetail} HouseManagement={HouseManagement} />
          <Buttons name='添加户型' onClick={ createHouse } />
          <List columns={columns}
           dataSource={dataSource} 
           pagination={{...pagination,onChange}} 
           />
          <Edit {...editProps} />
          <Create {...createProps} />
          {/* <SearchTree me={this.props}  list={treeList} searchKeysList={[]} /> */}
          <Modal 
            visible={this.state.previewVisible} 
            footer={null} onCancel={previewCancel}
            // style={{ width: '900px',height:'900px' }}
            // maskClosable = {false}
          >
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
      </Page>
    )
  }
}

HouseMannagement.propTypes = {
  HouseMannagement: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default HouseMannagement
