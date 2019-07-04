import React from 'react';
import { Modal,  Form, Input,  Select, Row, Upload, message, Icon } from 'antd';
import { multipleImageUploadFan, openFileUpload } from 'utils/ossUploadUtils'
import PropTypes from 'prop-types'
import { deepCopy } from 'utils/copy'
const FormItem = Form.Item;
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 5},
  wrapperCol: { span: 16 },
};

const CreateModal = ({
    form: {
      getFieldDecorator,
      validateFieldsAndScroll,
      resetFields,
    },
    visible,
    handleOk,
    handleCancel,
    banner,
    name,
    bucket,
    dispatch,
    saveMultipleImgs,
    listImg,
    storageList,
    linkType
  }) => {
    const imgsList = []
    const { typeLists,  projectList,previewShow,previewSrc,bannerType } = banner
    
    const onSelect = (v) => {
         dispatch({
           type: 'banner/saveBannerType',
           payload: v
         })
    } 
  return(
    <div>
      < Modal title = {name}
          visible={visible}
          onOk={() =>handleOk(validateFieldsAndScroll,resetFields)} 
          onCancel={() => handleCancel(resetFields)}
          okText = "确认"
          cancelText = "取消"
          maskClosable = {
            false
          }
          >
        <Form>
          <Row>
            <FormItem label={'身份类型'} {...formItemLayout}>
              {
                getFieldDecorator('userType', {
                rules: [{
                  required: true,
                  message: '请输入身份类型',
                }],
                initialValue: storageList.userType || '',
              })(
                <Select placeholder="请选择">
                  {
                     typeLists.map((v, i) => (
                      <Option value={v.id} key={v.id}>
                        {v.name}
                      </Option>
                     ))
                  }
                </Select>
              )}
            </FormItem>
          </Row>
         
           <Row>
            <FormItem label={'banner图片'} {...formItemLayout} >
              <div onClick={(e) => { openFileUpload(e,dispatch,'banner') }}>
              {
                getFieldDecorator('picUrl', {
                rules: [{
                  required: true,
                  message: '请上传banner图片',
                }],
                initialValue: storageList.picUrl || ''
              })(
                 <Upload
                  accept="image/*"
                  fileList = { deepCopy(listImg) }
                  // action={bucket.host}
                  listType="picture-card"
                  // data={bucket.bucketData}
                  onPreview={
                    (file) => {

                      dispatch({
                        type: 'banner/openPreview',
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
                          type: 'banner/saveMediaImages',
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
              )}
              </div>
            </FormItem>
          </Row>  
          <Row>
            <FormItem label={'类型'} {...formItemLayout}>
              {
                getFieldDecorator('linkType', {
                initialValue: storageList.linkType || '',
              })(
                <Select placeholder="请选择" onSelect = { onSelect }>
                  {
                     linkType.map((v, i) => (
                      <Option value={v.id} key={v.id}>
                        {v.name}
                      </Option>
                     ))
                  }
                </Select>
              )}
            </FormItem>
          </Row>  
          {
              bannerType === '2' ?
              <Row>
                <FormItem label={'页面'} {...formItemLayout}>
                  {
                    getFieldDecorator('linkUrl', {
                    initialValue: storageList.linkUrl || '',
                  })(
                  < Input placeholder = "请输入页面"  />
                  )}
                </FormItem>
              </Row>  :  
              <Row>
                {
                  bannerType == 3 || bannerType === '0' ?
                    <FormItem label={'页面'} {...formItemLayout}>
                      < Input value={bannerType == 3 ? '手拉手页面' : ''} disabled = {true} />
                    </FormItem>
                  : <FormItem label={'页面'} {...formItemLayout}>
                    {
                      getFieldDecorator('linkUrl', {
                      initialValue: storageList.linkUrl || '',
                    })(
                      <Select placeholder="请选择" >
                        {
                          projectList.map((v, i) => (
                            <Option value={v.projectId} key={v.projectId}>
                              {v.projectName}
                            </Option>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                }
                
              </Row>  
            }
        </Form> 
        <Modal visible={previewShow} footer={null} onCancel={
           () => {
             dispatch({
               type: 'banner/openPreview',
               payload: {
                 previewSrc: '',
                 previewShow: false,
               }
             })
           }
        }
        maskClosable = {false}
        >
            <img alt="example" style={{ width: '100%' }} src={previewSrc} />
        </Modal>
      </Modal>
    </div>
  )
}

const Create = Form.create()(CreateModal);
// Create.propTypes = {
//   visible : PropTypes.bool,
//   handleOk : PropTypes.func,
//   handleCancel: PropTypes.func, 
// }
export default Create