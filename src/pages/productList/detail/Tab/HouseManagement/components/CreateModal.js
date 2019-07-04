import React from 'react'
// import ReactDOM from 'react-dom'
import { Modal, Form, Input, Select, Radio,Upload ,message,Icon,Row,Col,Checkbox } from 'antd'
import { multipleImageUploadFan, openFileUpload } from 'utils/ossUploadUtils'
import PropTypes from 'prop-types'
import { deepCopy } from 'utils/copy'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group


const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20 },
}


function handleChange(value) {

}
// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
const CreateModal = ({
    form: {
      getFieldDecorator,
      validateFieldsAndScroll,
      resetFields,
      // getFieldsError,
      // isFieldTouched,
      // getFieldError
    },
    visible,
    name,
    dispatch,
    handleOk,
    handleCancel,
    HouseManagement,
    listImg ,
    saveMultipleImgs,
    previewShow,
    previewSrc,
    bucket,
    houseTypeChange,
    disabledLock,
    checkChange,
    typeValue,
    editList,
    
  }) => {
   
    const { modelHouseTypeList,  mainForce,propertyTypeList } = HouseManagement
    const imgsList = []
    // console.log(editList.houseTypePic)
   
  return(
    <div>
      < Modal title={name}
          visible={visible}
          onOk={() =>handleOk(validateFieldsAndScroll,resetFields)} 
          onCancel={() => handleCancel(resetFields)}
          okText = "确认"
          cancelText = "取消"
          maskClosable = {false}
          destroyOnClose
      >
        <Form>
           <FormItem label={'户型图'} {...formItemLayout} >
            <div onClick={(e) => { openFileUpload(e,dispatch,'HouseManagement') }}>
            {
              getFieldDecorator('houseTypePic', {
              rules: [{
                required: true,
                message: '请上传图片',
              }],
              initialValue: editList.houseTypePic || ''
            })(
              <Upload
                accept="image/*"
                fileList = { deepCopy(listImg) }
                // action={bucket.host}
                listType="picture-card"
                // data={bucket.bucketData}
                onPreview={
                  (file) => {
                    console.log(file)
                    dispatch({
                      type: 'HouseManagement/openPreview',
                      payload: {
                        previewSrc:  file.url || file.thumbUrl ,
                        previewShow: true,
                      }
                    })
                  }
                }
                beforeUpload={(e) => {
                  let reg = new RegExp(/^image\/jpeg|gif|jpg|png$/, 'i')
                  if (!reg.test(e.type)) {
                    message.warn('图片格式不正确,请重新上传!')
                  
                    return false
                  }
                  imgsList.push(multipleImageUploadFan(e, bucket))
                  return false
                }}
                onChange = {
                  (e) => {
                    message.destroy()
                    if (e.file.status == "removed"){
                      dispatch({
                        type: 'HouseManagement/saveMediaImages',
                        payload: {
                          data: []
                        }
                      })
                      return
                    }
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
          <Row gutter={24}>
            <Col span={12} id="houseTypeidid" >
              <FormItem label={'户型名称'} 
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16}}
                
                // validateStatus={houseNameError ? 'error' : ''}
              >
                {
                  getFieldDecorator('name1', {
                  initialValue: editList.name1 || '',
                  rules: [{
                    required: true,
                    message: '请选择户型',
                  }],
                })(
                  <Select showSearch optionFilterProp="title" 
                    getPopupContainer={() => document.getElementById('houseTypeidid')}
                    onChange={houseTypeChange}
                  >
                  <Option value={''} >全部</Option>
                    {
                    modelHouseTypeList.map((v,i) => (
                    <Option title={v} key={i} value={v}>
                      {v}
                    </Option>
                  ))}
                </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem 
                label={''} 
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                {
                  getFieldDecorator('name2', {
                    rules: [{
                      // required: true,
                      message: '请输入户型名称',
                    }],
                    initialValue:  editList.name2 || "",
                  })( 
                  < Input placeholder = "请输入户型名称" 
                      // value = {
                      // if(disabledLock=== true){
                      //   return null
                      // }}
                    // value = {null}
                    // defaultValue = {typeValue}
                    disabled={disabledLock}
                  /> 
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label={'户型结构'} 
                labelCol={{ span: 13}}
                wrapperCol={{ span: 11}}
              >
                {
                  getFieldDecorator('shi', {
                  initialValue: name === "编辑户型"?editList.shi + '':''  || "",
                  rules: [{
                    required: true,
                    message: '请填写户型结构',
                  }],
                })(
                  < Input placeholder = "" / > 
                )}
              </FormItem>
            </Col>
            <Col span={1} style={{textAlign:'center',lineHeight:'40px',paddingLeft:'0px'}}>室 </Col>
            <Col span={4}>
              <FormItem label={''} 
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                {
                  getFieldDecorator('ting', {
                    rules: [{
                      // required: true,
                      // message: '',
                      // type: "bumber"
                    }],
                    initialValue: name === "编辑户型"?editList.ting + '':'' || '',
                  })( < Input placeholder = "" />)
                }
              </FormItem>
            </Col>
            <Col span={1} style={{textAlign:'center',lineHeight:'40px',paddingLeft:'0px'}}>厅</Col>
            <Col span={4}>
              <FormItem label={''} 
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                {
                  getFieldDecorator('wei', {
                    rules: [{
                      // required: true,
                      // message: '请填写姓名',
                      // type: "bumber"
                    }],
                    initialValue: name === "编辑户型"?editList.wei + '':'' || '',
                  })( 
                  < Input placeholder = "" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={1} style={{textAlign:'center',lineHeight:'40px',paddingLeft:'0px'}}>卫</Col>
          </Row>
          <Row gutter={24}>
            <Col span={18}>
              <FormItem label={'建筑面积'} 
                labelCol={{ span: 5}}
                wrapperCol={{ span: 19}}
              >
                {
                  getFieldDecorator('area', {
                  initialValue: editList.area || '',
                  rules: [{
                    required: true,
                    message: '请输入数字',
                    
                  }],
                })(
                  <Input placeholder = "请输入建筑面积"
                    type='number'
                  /> 
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{textAlign:'center',lineHeight:'40px',paddingLeft:'0px'}}>平方米</Col>
          </Row>
          <Row gutter={24}>
            <Col span={18} id="wuyeType">
              <FormItem label={'物业类型'} 
                labelCol={{ span: 5}}
                wrapperCol={{ span: 19}}
              >
                {
                  getFieldDecorator('propertyType', {
                  initialValue: editList.propertyType || '',
                  rules: [{
                    required: true,
                    message: '请填写户型结构',
                  }],
                })(
                  <Select placeholder="请填写户型结构" 
                    // onSelect = { onSelect }
                    getPopupContainer={() => document.getElementById('wuyeType')}
                  >
                    {
                        propertyTypeList?propertyTypeList.map((v) => (
                        <Option value={v.status} key={v.status}>
                          {v.type}
                        </Option>
                        )):null
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            
          </Row>
          <Row gutter={24}>
            <Col span={18}>
              <FormItem label={'预计售价'} 
                labelCol={{ span: 5}}
                wrapperCol={{ span: 19}}
              >
                {
                  getFieldDecorator('prePrice', {
                  initialValue: editList.prePrice || '',
                  rules: [{
                    required: true,
                    message: '请输入价格',
                  }],
                })(
                  < Input placeholder = "请输入价格" / > 
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{textAlign:'center',lineHeight:'40px',paddingLeft:'0px'}}>万元</Col>
          </Row>
          <Row gutter={24} style={{position:'relative'}}>
            <Col span={1} style={{position:'absolute',left:'-15px',top:'10px'}}>
              <Checkbox onChange={checkChange} ></Checkbox>
            </Col>
            <Col span={18} id="mainHouseType">
                  
              
              <FormItem label={'主力户型'} 
                labelCol={{ span: 5}}
                wrapperCol={{ span: 19}}
              >
                {
                  getFieldDecorator('mainHouseType', {
                  initialValue: editList.mainHouseType || '',
                  rules: [{
                    // required: true,
                    // message: '请输入价格',
                  }],
                })(
                  <Select placeholder="请选择户型" 
                    // onSelect = { onSelect }
                    getPopupContainer={() => document.getElementById('mainHouseType')}
                  >
                    {
                        mainForce?mainForce.map((v, i) => (
                        <Option value={v.houseType} key={v.i + 1000}>
                          {v.houseType}
                        </Option>
                        )):null
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            {/* <Col span={3} style={{textAlign:'center',lineHeight:'40px',paddingLeft:'0px'}}>平方米</Col> */}
          </Row>
        </Form>
        <Modal visible={previewShow} footer={null} onCancel={
          () => {
            dispatch({
              type: 'HouseManagement/openPreview',
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

const Create = Form.create()(CreateModal)
Create.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
  filter: PropTypes.object,
}
export default Create