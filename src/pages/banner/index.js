import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { message, Upload, Modal  } from 'antd'
import styles from './index.less';
import List from './components/List';
import Create from './components/CreateModal';
import Edit from './components/CreateModal';
import Tab from './components/Tab';
import Buttons from 'components/Buttons';
import { getValue, bfProjectList } from 'utils/transformData'
import { deepCopy } from 'utils/copy'
const confirm = Modal.confirm;

@connect(({ banner, loading, bucket }) => ({ banner, loading, bucket }))
class Project extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
      id: '',
      previewImage: '',
      previewVisible: false,
    }
  }

  render() {
    const { dispatch, banner, bucket } = this.props
    const { dataSource, listImg, typeList, linkType1, linkType2,storageList, projectList } = banner
    const { visible,visibleEdit,id } = this.state
    
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
          if (values.linkType && values.linkType === '3') {
            if (values.userType === '1' || values.userType === '2'){
               values.linkUrl = null
            } else {
              message.warning('选择邀请好友类型，身份类型必须是员工或业主')
              return
            }
          }
          // if (values.linkType &&  && (values.userType === '1' || values.userType === '2')) {

          // } else {
          //   // message.warning('选择邀请好友类型，身份类型必须是员工或业主')
          //    alert('选择邀请好友类型，身份类型必须是员工或业主')
          //   return
          // }
          values.picUrl = listImg[0].url
           dispatch({
             type: 'banner/updateBanner',
             payload: values,
             success: () => {
               this.setState({
                 visible: false,
               });
             }
           })
           rtFn && rtFn()
        }
      });
      
    }
   const saveMultipleImgs = (url) => {
     console.log(url)
     message.destroy()
     message.info('上传图片成功')
     let listImg = []
     listImg[0] = {}
     listImg[0].uid = 1
    //  listImg[0].status = 'done'
    //  listImg[0] = Object.assign({'status':'done'}, listImg[0])
     listImg[0].url = url[0]
     
     this.props.dispatch({
       type: 'banner/saveMediaImages',
       payload: {
         data: deepCopy(listImg),
       },
     })
   }
    const modalProps = { 
      visible : visible,
      handleOk,
      handleCancel,
      banner,
      name: '添加banner',
      bucket,
      dispatch,
      saveMultipleImgs,
      listImg,
      storageList: {},
      linkType: linkType1
    }
    
    // 创建商品
    const createProject = () => {
      this.setState({
        visible: true
      })
      dispatch({
        type: 'banner/saveMediaImages',
        payload:{
          data:[]
        }
      })
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
          if (values.linkType && values.linkType === '3') {
            if (values.userType === '1' || values.userType === '2') {
               values.linkUrl = ''
            } else {
              message.warning('选择邀请好友类型，身份类型必须是员工或业主')
              return
            }
          }
          if (values.linkType === '0'){
            values.linkType = ''
            values.linkUrl = ''
          }
          values.id = id
          values.picUrl = listImg[0].url
          dispatch({
            type: 'banner/updateBanner',
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
       banner,
       name: '编辑banner ',
       bucket,
       dispatch,
       saveMultipleImgs,
       listImg,
       storageList,
       linkType: linkType2
     }
    const onEdit = (record) => {
      console.log(record)
      let list = deepCopy(record)
      if (!list.linkType) {
        list.linkType = '0'
      }
      dispatch({
        type: 'banner/saveBannerType',
        payload: list.linkType
      })
      this.setState({
        id: record.id,
        visibleEdit: true,
      })
      
      dispatch({
        type: 'banner/storageDate',
        payload:{
          data: list
        }
      })
    }
    const onDel = (id) => {
      confirm({
        title: '确定要删除该banner吗？',
        content: '删除后用户将不可见',
        onOk() {
           dispatch({
             type: 'banner/del',
             payload: {
                id
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
            title: 'banner图',
            dataIndex: 'fileList',
            key: 'fileList',
            render: (text,record) => (
              // console.log(text)
               <Upload
                    listType="picture-card"
                    fileList={deepCopy(text)}
                    onPreview = {
                      (file) => {
                        console.log(file)
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
            title: '类型',
            dataIndex: 'linkType',
            key: 'linkType',
            render: text => getValue(text, linkType1) || '--',
          },
          {
            title: '页面',
            dataIndex: 'linkUrl',
            key: 'linkUrl',
            render: (text,record) =>{
              switch (record.linkType){
                case '1' :
                   return bfProjectList(text, projectList) || '--'
                   break;
                case '2':
                   return text || '--'
                   break;
                case '3':
                    return '手拉手页面'
                    break;
                default:
                  return '--'
              }
            } 
          }, {
            title: '身份类型',
            dataIndex: 'userType',
            key: 'userType',
            render: text => getValue(text, typeList) || '--',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
              return (
                <span>
                  <a onClick={ () => onEdit(record)  }>编辑</a>
                  &nbsp;&nbsp;
                  <a onClick={ () => onDel(record.id)  }>删除</a>
                </span>
              )
            }
          },
        ]
    return (
      <Page className={styles.bg}>
          <Buttons name='添加banner' onClick={ createProject } lineShow = {true} />
          <div style={{margin: '40px 0 20px'}}>
             <Tab />
          </div>
          <List columns={columns} dataSource={dataSource} />
          <Create {...modalProps} />
          <Edit  {...editProps}/>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={previewCancel} maskClosable = {false}>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
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
