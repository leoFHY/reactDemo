import React, { PureComponent } from 'react'
import styles from '../index.less'
import { Button,  message, Modal, Input, Collapse, Upload, Icon  } from 'antd';
import { multipleImageUploadFan, openFileUpload } from 'utils/ossUploadUtils'
import { deepCopy } from 'utils/copy'

const confirm = Modal.confirm;
const { TextArea } = Input;
const CreateModal = ({
    visible,
    handleOk,
    handleCancel,
    name,
    bucket,
    dispatch,
    saveMultipleImgs,
    listImg,
    filterDetail,
    dynamic,
   
}) => {
    
    const {
      dynamicInfo,
      titleData,
    } = dynamic
    const { status,bfProjectId } = filterDetail
    const imgsList = []
    const handelSave = () => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      if (dynamicInfo == '' || titleData == ''){
        message.warning('请将信息填写全,再保存')
        return
      }
      dispatch({
        type: 'dynamic/pushInfo',
        payload: {
          bfProjectId,
          dynamicInfo,
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
            type: 'dynamic/getDel',
            payload: {
              bfProjectId,
            },
            success:() => {
              dispatch({
                type: 'dynamic/getInfo',
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
        type: 'dynamic/saveInfo',
        payload:{
          data: {
            dynamicInfo:e.target.value
          }
        }
      })
    }
    const changeTitle = (e) => {
      dispatch({
        type: 'dynamic/saveTitle',
        payload: {
          data: {
            titleData: e.target.value
          }
        }
      })
    }
    
    return (
      < Modal title = {name}
          visible={visible}
          onOk={() =>handleOk()} 
          onCancel={() => handleCancel()}
          okText = "确认"
          cancelText = "取消"
          maskClosable = {
            false
          }
          >
         {/* <Button type="primary" onClick={() => handelSave()} style={{marginBottom: '20px'}}>保存</Button>
         &nbsp;&nbsp;
         <Button type="primary" onClick={() => handelDel()} style={{marginBottom: '20px'}}>删除</Button> */}
         {/* <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="动态信息" key="1"> */}
              <div className = {styles.box}>
                <span className = {styles.title}>标题 :</span>
                <Input placeholder="请输入不超过20字的标题" style = {{width:'60%'}} value = {titleData} onChange = {(e) => changeTitle(e) }/>
              </div>
              <div className = {styles.box}>
                <span className = {styles.title}>动态内容 :</span>
                <div style = {{width: '60%'}}>
                  <TextArea placeholder="请输入不超过100字的内容" value = {dynamicInfo} rows={4} onChange = {(e) => changeValue(e) }></TextArea>
                </div>
              </div>
               <div className = {styles.box} onClick={(e) => { openFileUpload(e,dispatch,'dynamic') }}>
                <span className = {styles.upload}></span>
                  <Upload
                      accept="image/*"
                      fileList = { deepCopy(listImg) }
                      // action={bucket.host}
                      listType="picture-card"
                      // data={bucket.bucketData}
                      onPreview={
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
                      beforeUpload={(e) => {
                        // let isLt200k = e.size / 1024 > 200
                        let reg = new RegExp(/^image\/jpeg|gif|jpg|png$/, 'i')
                        if (!reg.test(e.type)) {
                          message.warn('图片格式不正确,请重新上传!')
                          // this.state.imgMaxSize = true
                        
                          return false
                        }
                        // if (isLt200k) {
                        //   message.warn('图片大小不能超过200kb,请重新上传!')
                        //   this.state.imgMaxSize = true
                          
                        //   return !isLt200k
                        // }
                      
                        imgsList.push(multipleImageUploadFan(e, bucket))
                        return false
                      }}
                      onChange = {
                        (e) => {
                          message.destroy()
                          if (e.file.status == "removed"){
                            dispatch({
                              type: 'dynamic/saveMediaImages',
                              payload: {
                                data: []
                              }
                            })
                            return
                          }
                          // if (e.file.status === 'done') {
                          //   message.success(` 图片上传成功`);
                          // } 
                          message.loading('图片正在上传中，请稍后', 10)

                          // return
                          if (imgsList.length === e.fileList.length) {
                            console.log(imgsList.length ,e.fileList.length)
                            Promise.all(imgsList).then((res) => {
                              console.log(res)
                              message.destroy()
                              saveMultipleImgs(res)
                            }, (rej) => {
                              message.warning(rej)
                            }).catch((err) => {
                              // message.warning(err)
                            })
                          }
                        }
                      }
                    
                    >
                      {
                        !listImg.length ?
                          <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">Upload</div>
                          </div> : null
                      }
                    </Upload>
                 </div>    
            {/* </Panel>
          </Collapse> */}
      </Modal>
    )
}



export default CreateModal
