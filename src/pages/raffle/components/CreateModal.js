import React from 'react'
import { Modal, Form, Input, Icon,  Upload, message, Select, Button } from 'antd'
import AddMultipleImage from 'components/Upload/AddMultipleImage.js'
import PropTypes from 'prop-types'
import styles from './index.less'
const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 5},
  wrapperCol: { span: 19 },
}

const CreateModal = ({
    form: {
      getFieldDecorator,
      validateFieldsAndScroll,
      resetFields
    },
    visible,
    handleOk,
    handleCancel,
    raffle,
    name,
    bucket,
    dispatch,
  }) => {
    const { editList,listImg1,listImg2,previewSrc,previewShow } = raffle
    // const imgsList1 = [],imgsList2 = [];
    const floatL = {
      float: 'left'
    }
    const ImgPicList1 = [],ImgPicList2 = []
    if (listImg1) {
      listImg1.forEach((item, i) => {
        ImgPicList1[i] = []
        ImgPicList1[i][0] = {}
        ImgPicList1[i][0] = Object.assign({
          uid: i,
          url: item.prizePic
        }, item);
      })
    }
    if (listImg2) {
      listImg2.forEach((item, i) => {
        ImgPicList2[i] = []
        ImgPicList2[i][0] = {}
        ImgPicList2[i][0] = Object.assign({
          uid: i,
          url: item.prizePic
        }, item);
      })
    }
    const toLeft1 = (i) => {
      dispatch({
        type: 'raffle/changeSort1',
        payload: {
          type: 'l',
          i,
        },
      })
    }
    const toRight1 = (i) => {
      dispatch({
        type: 'raffle/changeSort1',
        payload: {
          type: 'r',
          i,
        },
      })
    }
    const toLeft2 = (i) => {
      dispatch({
        type: 'raffle/changeSort2',
        payload: {
          type: 'l',
          i,
        },
      })
    }
    const toRight2 = (i) => {
      dispatch({
        type: 'raffle/changeSort2',
        payload: {
          type: 'r',
          i,
        },
      })
    }
     const saveMultipleImgs1 = (url) => {
        message.destroy()
        message.info('上传图片成功')
       let list = []
        if (url.length) {
          url.map((v,i)=>{
            list[i] = {}
            list[i].prizePic = v
          })
        }
      dispatch({
         type: 'raffle/saveMediaImages1',
         payload: {
           data: list,
         },
       })
     }
     const saveMultipleImgs2 = (url) => {
       message.destroy()
       message.info('上传图片成功')
        let list = []
        if (url.length) {
          url.map((v, i) => {
            list[i] = {}
            list[i].prizePic = v
          })
        }
       dispatch({
         type: 'raffle/saveMediaImages2',
         payload: {
            data: list
         },
       })
     }
     const imgList1 = {
       bucket,
       dispatch,
       saveMultipleImgs: saveMultipleImgs1,
       multiple: true
     }
     const imgList2 = {
       bucket,
       dispatch,
       saveMultipleImgs: saveMultipleImgs2,
       multiple: true
     }
  return(
    <div>
      <Modal title = {name}
          visible={visible}
          onOk={() =>handleOk(validateFieldsAndScroll,resetFields)} 
          onCancel={() => handleCancel(resetFields)}
          okText = "确认"
          cancelText = "取消"
          width = {800}
          style={{top:40}}
          maskClosable = {false}
      >
        <Form className = {styles.modal}>
            <FormItem label={'奖品名称'} {...formItemLayout}>
              {
                getFieldDecorator('prizeName', {
                  rules: [{
                    required: true,
                    message: '请填写奖品名称',
                  }],
                  initialValue: editList.prizeName || '',
                })( < Input placeholder = "请输入奖品名称" / > )
              }
            </FormItem>
            <FormItem label={'数量'} {...formItemLayout}>
              {
                getFieldDecorator('prizeCount', {
                  rules: [{
                    required: true,
                    message: '请填写数量',
                  }],
                  initialValue: editList.prizeCount || 0,
                })( < Input placeholder = "请输入数量" /> )
              }
            </FormItem>
             <FormItem label={'类型'} {...formItemLayout} >
              {
                getFieldDecorator('prizeType', {
                  rules: [{
                    required: true,
                    message: '请填写类型',
                  }],
                  initialValue: editList.prizeType || '',
                })( 
                  <Select>
                    {
                      raffle.prizeTypeList.map((v, i) => (
                        <Option  value={v.id} key={v.id}>
                          {v.name}
                        </Option>
                      ))
                    }
                  </Select>
                 )
              }
            </FormItem>
            <FormItem label={'图片1'} {...formItemLayout} >
                 {
                   getFieldDecorator('pic1', {
                       rules: [{
                         required: true,
                         message: '请填写类型',
                       }],
                       initialValue: '1',
                     })(
                      <Input type="hidden"/> 
                    )
                  }
                   {
                        ImgPicList1.map((v, i) => {
                          console.log(v)
                        return(
                          <div style = {{...floatL}} key = {i}>
                              <Upload
                                listType="picture-card"
                                fileList = {v}
                                onPreview = {
                                  (file) => {
                                    dispatch({
                                      type: 'raffle/openPreview',
                                      payload: {
                                        previewSrc: file.url || file.thumbUrl,
                                        previewShow: true,
                                      }
                                    })
                                  }
                                }
                                onRemove={(e) =>{
                                  dispatch({
                                    type: 'raffle/removeImg1',
                                    payload:e.uid,
                                  })
                                }}
                              >
                              </Upload>
                              <div>
                                <Button style={{ marginBottom: 10 }} size="small" onClick={() => toLeft1(i)}>左移</Button>
                                <Button size="small"
                                  onClick={() => toRight1(i)}
                                  style={{ marginLeft: 10, marginBottom: 10 }}
                                >右移</Button>
                              </div>
                          </div>
                        )
                      })
                      }
                      <AddMultipleImage {...imgList1} fileName = {'raffle1'}/>
                   
            </FormItem>
             <FormItem label={'图片2'} {...formItemLayout} >
               {
                 getFieldDecorator('pic2', {
                     rules: [{
                       required: true,
                       message: '请填写类型',
                     }],
                     initialValue: '2',
                   })(
                     <div>
                       {
                         ImgPicList2.map((v, i) => {
                            return(
                              <div style = {{...floatL}} key = {i}>
                                  <Upload
                                    listType="picture-card"
                                    fileList = {v}
                                    onPreview = {
                                      (file) => {
                                        dispatch({
                                          type: 'raffle/openPreview',
                                          payload: {
                                            previewSrc: file.url || file.thumbUrl,
                                            previewShow: true,
                                          }
                                        })
                                      }
                                    }
                                    onRemove={(e) =>{
                                      dispatch({
                                        type: 'raffle/removeImg2',
                                        payload:e.uid,
                                      })
                                    }}
                                  >
                                  </Upload>
                                  <div>
                                    <Button style={{ marginBottom: 10 }} size="small" onClick={() => toLeft2(i)}>左移</Button>
                                    <Button size="small"
                                      onClick={() => toRight2(i)}
                                      style={{ marginLeft: 10, marginBottom: 10 }}
                                    >右移</Button>
                                  </div>
                              </div>
                            )
                          })   
                       }
                         <AddMultipleImage {...imgList2} fileName = {'raffle2'}/>
                     </div>
               )
              }
            </FormItem>
            <Modal visible={previewShow} footer={null} onCancel={
              () => {
                dispatch({
                  type: 'raffle/openPreview',
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
        </Form> 
      </Modal>
    </div>
  )
}

const Create = Form.create()(CreateModal);
Create.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
  filter: PropTypes.object,
}
export default Create