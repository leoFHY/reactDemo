import React from 'react';
import { Modal, Button, Form, Input, message, Icon, Select, Checkbox, DatePicker, LocaleProvider, Upload   } from 'antd';
import PropTypes from 'prop-types'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { multipleImageUploadFan, openFileUpload } from 'utils/ossUploadUtils'
import { deepCopy } from 'utils/copy'
import Tree from './Tree';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

const CreateModal = ({
    form: {
      getFieldDecorator,
      validateFieldsAndScroll,
      resetFields
    },
    visible,
    handleOk,
    handleCancel,
    detailActivity,
    onChange,
    openTree,
    name,
    dispatch,
    saveMultipleImgs,
    listImg,
    bucket
  }) => {
    
  const { editData, houseId, treeShow, houseName, previewShow, previewSrc  } = detailActivity
  const imgsList = []
  return(
    <div>
      < Modal title = {name}
          visible={visible}
          onOk={() =>handleOk(validateFieldsAndScroll,resetFields)} 
          onCancel={() => handleCancel(resetFields)}
          okText = "确认"
          cancelText = "取消"
          width = '600px'
          style = {{top:'20px',zIndex: '900'}}
          maskClosable = {false}
          destroyOnClose
      >
        <Form>
            <FormItem label={'优惠名称'} {...formItemLayout}>
              {
                getFieldDecorator('discountName', {
                  rules: [{
                    required: true,
                    message: '请输入优惠名称',
                  }],
                  initialValue: editData.discountName || '',
                })( < Input placeholder = "请输入优惠名称" /> )
              }
            </FormItem>
             <FormItem label={'活动时间段'} {...formItemLayout} id="abc">
                <LocaleProvider locale={zh_CN}> 
                 {
                  getFieldDecorator('time', {
                    rules: [{
                      required: true,
                      message: '请输入活动时间段',
                    }],
                    initialValue: editData.time || [],
                  })(<RangePicker showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss"  getPopupContainer={() => document.getElementById('abc')}/>  )
                  }
                </LocaleProvider>
            </FormItem>
            <FormItem label={'身份类型'} {...formItemLayout}>
              {
                getFieldDecorator('types', {
                  rules: [{
                    required: true,
                    message: '请输入身份类型',
                  }],
                  initialValue: editData.types ||  ['1', '2', '3', '6'],
                })( 
                   <CheckboxGroup options={detailActivity.typeCheck}  onChange={onChange} />
                )
              }
            </FormItem>
            <FormItem label={'优惠类型'} {...formItemLayout} >
              {
                getFieldDecorator('discountType', {
                rules: [{
                  required: true,
                  message: '请输入优惠类型',
                }],
                initialValue: editData.discountType || '',
              })(
                <Select placeholder = "请选择">
                  <Option  value={'1'} key={1}>荷兰拍</Option>
                </Select>
              )}
            </FormItem>
            <div style={{borderTop:'2px dashed #ccc',marginBottom: '20px'}}></div>
            <div style = {{ fontSize: '15px',lineHeight: '22px', fontWeight: '500',color: 'rgba(0, 0, 0, 0.85)'}}>荷兰拍</div>
            <FormItem label={'优惠房源'} {...formItemLayout}>
            {
                getFieldDecorator('houseName', {
                  rules: [{
                    required: true,
                    message: '请输入优惠房源',
                  }],
                  initialValue:  '111',
                })( < Input type="hidden" />  )
            }
            {
              houseName ?  <span>{houseName}</span>  : null
            } 
            &nbsp;
            {
              houseName ?  <Button icon="retweet" onClick={ openTree }>切换房源</Button>  : <Button icon="plus" onClick={ openTree }>选择房源</Button>
            }
            </FormItem>
            <FormItem label={'图片'} {...formItemLayout} >
              <div onClick={(e) => { openFileUpload(e,dispatch,'banner') }}>
              {
                getFieldDecorator('houseDiscountPic', {
                rules: [{
                  required: true,
                  message: '请上传图片',
                }],
                initialValue: editData.houseDiscountPic || ''
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
                        type: 'detailActivity/openPreview',
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
                          type: 'detailActivity/saveMediaImages',
                          payload: {
                            data: []
                          }
                        })
                        return
                      }
                      message.loading('图片正在上传中，请稍后', 10)

                      // return
                      if (imgsList.length === e.fileList.length) {
                        Promise.all(imgsList).then((res) => {
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
            <FormItem label={'起始价'} {...formItemLayout}>
              {
                getFieldDecorator('startAmount', {
                  rules: [{
                    required: true,
                    message: '请输入起始价',
                  }],
                  initialValue: editData.startAmount || '',
                })( < Input placeholder = "请输入" style={{width:'95%'}} /> )
              }
              &nbsp;元
            </FormItem>
             <FormItem label={'时间间隔'} {...formItemLayout}>
              {
                getFieldDecorator('intervalSecond', {
                  rules: [{
                    required: true,
                    message: '请输入时间间隔',
                  }],
                  initialValue: editData.intervalSecond || '',
                })( < Input placeholder = "请输入" style={{width:'95%'}} /> )
              }
              &nbsp;秒
            </FormItem>
            <FormItem label={'降价金额'} {...formItemLayout}>
              {
                getFieldDecorator('intervalDownPrice', {
                  rules: [{
                    required: true,
                    message: '请输入降价金额',
                  }],
                  initialValue: editData.intervalDownPrice || '',
                })( < Input placeholder = "请输入" style={{width:'95%'}}/> )
              }
              &nbsp;元
            </FormItem>
            <FormItem label={'底价'} {...formItemLayout}>
              {
                getFieldDecorator('minAmount', {
                  rules: [{
                    required: true,
                    message: '请输入底价',
                  }],
                  initialValue: editData.minAmount || '',
                })( < Input placeholder = "请输入" style={{width:'95%'}}/> )
              }
              &nbsp;元
            </FormItem>
        </Form> 
        <Tree visible = {treeShow} style={{zIndex: '1001'}} />
        <Modal visible={previewShow} footer={null} onCancel={
           () => {
             dispatch({
               type: 'detailActivity/openPreview',
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
Create.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
}
export default Create