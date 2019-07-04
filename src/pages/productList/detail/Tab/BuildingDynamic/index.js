import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
import { message,  Button, Upload, Modal } from 'antd';
import { deepCopy } from 'utils/copy'
import List from './components/List';
import Create from './components/CreateModal';
import Edit from './components/CreateModal';

const confirm = Modal.confirm

@connect(({ dynamic, loading, bucket, app ,filterDetail }) => ({ dynamic, loading, bucket, app ,filterDetail}))
class BuildingDynamic extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
        visible: false,
        visibleEdit: false,
        bfProjectActionId: '',
    }
  }

  render() {
    const { dispatch, dynamic, filterDetail, bucket } = this.props
    const { visible,visibleEdit,bfProjectActionId } = this.state
    const { dataSource, listImg, dynamicInfo, titleData, previewSrc, previewShow, pagination  } = dynamic
    const { bfProjectId } = filterDetail
    
    if (dataSource) {
       dataSource.forEach((v, i) => {
         v.fileList = []
         v.fileList[0] = {}
         v.fileList[0]["uid"] = i
         // v.fileList[0]["status"] = 'done'
         v.fileList[0] = Object.assign({
           'status': 'done'
         }, v.fileList[0])
         v.fileList[0]["url"] = v.actionPic
       })
    }
    // 分页
    const onChange = page => {
      this.props.dispatch({
        type: 'dynamic/getPageList',
        payload: {
          type: "page",
          data: {
            pageNum: page,
            pageSize: 10,
          }
        },
      })
    }
    const previewCancel = () => {
          dispatch({
            type: 'dynamic/openPreview',
            payload: {
              previewShow: false,
              previewSrc: ''
            }
          })
    }
    const reset = () => {
        dispatch({
          type: 'dynamic/saveInfo',
          payload: {
            data: {
              dynamicInfo: '',
            }
          }
        })
        dispatch({
          type: 'dynamic/saveTitle',
          payload: {
            data: {
              titleData: '',
            }
          }
        })
        dispatch({
          type: 'dynamic/removeImg',
        })
    }
    const onEdit = (data) => {
       this.setState({
         visibleEdit : true,
         bfProjectActionId: data.bfProjectActionId
       })
       dispatch({
         type: 'dynamic/saveInfo',
         payload: {
           data: {
             dynamicInfo: data.actionInfo,
           }
         }
       })
       dispatch({
         type: 'dynamic/saveTitle',
         payload: {
           data: {
             titleData: data.actionTitle,
           }
         }
       })
       dispatch({
         type: 'dynamic/saveMediaImages',
         payload: {
           data: data.fileList,
         },
       })
    }
    const onDel = (bfProjectActionId) => {
      confirm({
        title: '删除确认',
        content: '确定删除该列表吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'dynamic/getDel',
            payload: {
              bfProjectActionId,
            },
            success: () => {
              dispatch({
                type: 'dynamic/getPageList',
                payload: {
                  bfProjectId
                },
              })
            }
          })
        },
        onCancel() {},
      })
      
    }
    const handleCancel = () => {
       reset()
       this.setState({
         visible: false,
       });
     }
     // 弹出框确定
     const handleOk = () => {
         dispatch({
           type: 'dynamic/addList',
           payload: {
             actionInfo: dynamicInfo,
             actionPic: listImg[0].url,
             actionTitle: titleData,
             bfProjectId,
           },
           success: () => {
              dispatch({
                type: 'dynamic/getPageList',
                payload: {
                  bfProjectId,
                  pageNum: 1,
                  pageSize: 10,
                },
              })
              this.setState({
                visible : false
              })
              reset()

           }
         })
     }
     const onCancel = () => {
       this.setState({
         visibleEdit: false,
       })
       reset()
     }
     // 弹出框确定
     const onOk = () => {
       dispatch({
         type: 'dynamic/addList',
         payload: {
           actionInfo: dynamicInfo,
           actionPic: listImg[0].url,
           actionTitle: titleData,
           bfProjectId,
           bfProjectActionId
         },
         success: () => {
           dispatch({
             type: 'dynamic/getPageList',
             payload: {
               bfProjectId
             },
           })
           this.setState({
             visibleEdit: false
           })
           reset()
         }
       })
     }
    const saveMultipleImgs = (url) => {
      message.destroy()
      message.info('上传图片成功')
      let listImg = []
      listImg[0] = {}
      listImg[0].uid = 1
      //  listImg[0].status = 'done'
      //  listImg[0] = Object.assign({'status':'done'}, listImg[0])
      listImg[0].url = url[0]

      dispatch({
        type: 'dynamic/saveMediaImages',
        payload: {
          data: deepCopy(listImg),
        },
      })
    }
    const createDynamic = () => {
      this.setState({
        visible: true
      })
    }
    const modalProps = {
      visible,
      handleOk,
      handleCancel,
      name: '新增动态',
      bucket,
      dispatch,
      saveMultipleImgs,
      listImg,
      storageList: {},
      filterDetail,
      dynamic
    }
    const editProps = {
      visible : visibleEdit,
      handleOk : onOk,
      handleCancel: onCancel,
      name: '编辑动态',
      bucket,
      dispatch,
      saveMultipleImgs,
      listImg,
      filterDetail,
      dynamic
    }
    const columns = [
          {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            render: (text, record, index) => index+1,
          },
          {
            title: '标题',
            dataIndex: 'actionTitle',
            key: 'actionTitle',
            render: text => text || '--',
          },
          {
            title: '动态内容',
            dataIndex: 'actionInfo',
            key: 'actionInfo',
            render: text => text || '--',
          },
          {
            title: '图片',
            dataIndex: 'fileList',
            key: 'fileList',
            render: (text,record) => (
              // console.log(text)
               <Upload
                  listType="picture-card"
                  fileList={deepCopy(text)}
                  onPreview = {
                    (file) => {
                      dispatch({
                        type: 'dynamic/openPreview',
                        payload: {
                          previewSrc: file.url || file.thumbUrl,
                          previewShow: true,
                        }
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
            title: '发布时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: text => text || '--',
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
                  <a onClick={ () => onDel(record.bfProjectActionId)  }>删除</a>
                </span>
              )
            }
          },
        ]
    return (
      <Page>
         <Button type="primary" onClick = {createDynamic}>新增动态</Button>
         <br/>
         <br/>
         <List columns={columns} pagination={{...pagination,onChange}} dataSource={dataSource} />
         <Create {...modalProps} />
         <Edit  {...editProps}/>
          <Modal visible={previewShow} footer={null} onCancel={previewCancel} maskClosable = {false} style = {{zIndex:1000}}>
            <img alt="example" style={{ width: '100%' }} src={previewSrc} />
          </Modal>
      </Page>
    )
  }
}

BuildingDynamic.propTypes = {
  dynamic: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default BuildingDynamic
