import React from 'react';
import { Form, Input,  Row, Col, Checkbox, Upload, message, Icon, Modal,LocaleProvider,DatePicker,Select   } from 'antd';
import PropTypes from 'prop-types'
import AddMultipleImage from 'components/Upload/AddMultipleImage.js'
import { multipleImageUploadFan, openFileUpload } from 'utils/ossUploadUtils'
import { deepCopy } from 'utils/copy'
import moment from 'moment'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'

const { RangePicker } = DatePicker
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const dateFormat = "YYYY-MM-DD HH:mm:ss"
const Add = ({
  getFieldValue,
  getFieldDecorator,
  setFieldsValue,
  bucket,
  dispatch,
  saveMultipleImgs,
  saveMultipleImgs1,
  previewImage,
  previewVisible,
  filterDetail,
  saveUploadImgs,
  mediaImages,
  buildPic,
  deliveryItemId,
  buildingInfo,
  provinceChange,
  iconClick,
  checkChange,
  openDateChange,
  city,
  listImg,
  listImg1,
  previewShow,
  previewSrc,
  addressChange
  // picChange,
}) => {
  const fileName = 'buildingInfo/';
  

  // const { projectInformation } = filterDetail
  // const { bfSalesPhone } = projectInformation
  const { cityList,provinceList, ProjectInformationList } = buildingInfo
  console.log('1---------',listImg);
  console.log('2---------', listImg1);
  
  const handleCancel = () => {
    dispatch({
      type: 'filterDetail/onCancel',
      payload: {
        previewVisible: false,
      },
    })
  }
  const imgsList = []
  const imgsList1 = []
  const lgProjectType = ProjectInformationList.lgProjectType?ProjectInformationList.lgProjectType.split(','):[]
  // if(buildingInfo.lgMapAddress){
  //   ProjectInformationList.lgMapAddress = buildingInfo.lgMapAddress
  // }
  const plainOptions = ['住宅','公寓', '车位', '商业地产']
  return (
    <div>
      <Form>
        <Row gutter={24}>
            <Col span={12}>
                <FormItem label={'鸟瞰图'} {...formItemLayout} >
                <div onClick={(e) => {
                  console.log(e)
                   openFileUpload(e,dispatch,'buildingInfo') }}
                >
                {
                  getFieldDecorator('buildPic', {
                  // rules: [{
                  //   required: true,
                  //   message: '请上传图片',
                  // }],
                  initialValue: ProjectInformationList.buildPic || ''
                })(
                  <Upload
                    accept="image/*"
                    fileList = { deepCopy(listImg) }
                    // action={bucket.host}
                    listType="picture-card"
                    // data={bucket.bucketData}
                    onPreview={
                      (file) => {
                        // console.log(file))
                        dispatch({
                          type: 'buildingInfo/openPreview',
                          payload: {
                            previewSrc:  file.url || file.thumbUrl ,
                            previewShow: true,
                          }
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
                      imgsList.push(multipleImageUploadFan(e, bucket))
                      return false
                    }}
                    onChange = {
                      (e) => {
                        // console.log(e)
                        message.destroy()
                        if (e.file.status === "removed"){
                          //  ProjectInformationList.buildPic = null
                          dispatch({
                            type: 'buildingInfo/saveMediaImages',
                            payload: {
                              data: e.fileList
                            }

                          })
                          dispatch({
                            type: 'buildingInfo/saveProjectInformation',
                            payload: {
                              data: ProjectInformationList,
                            }
                          })
                          // dispatch({
                          //   type: 'buildingInfo/saveMediaImages',
                          //   payload: {
                          //     data: []
                          //   }
                          // })
                          return
                        }
                        message.loading('图片正在上传中，请稍后', 10)

                        // return
                        if (imgsList.length === e.fileList.length) {
                          // console.log(imgsList.length ,e.fileList.length)
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
                          <div className="ant-upload-text">上传</div>
                        </div> : null
                    }
                  </Upload>
                )}
                </div>
              </FormItem> 
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={12}>
                <FormItem label={'h5楼盘图'} {...formItemLayout} >
                <div onClick={(e) => {
                   openFileUpload(e,dispatch,'buildingInfo') }}
                >
                {
                  getFieldDecorator('h5Pic', {
                  // rules: [{
                  //   required: true,
                  //   message: '请上传图片',
                  // }],
                  initialValue: ProjectInformationList.h5Pic || ''
                })(
                  <Upload
                    accept="image/*"
                    fileList = { deepCopy(listImg1) }
                    // action={bucket.host}
                    listType="picture-card"
                    // data={bucket.bucketData}
                    onPreview={
                      (file) => {
                        // console.log(file))
                        dispatch({
                          type: 'buildingInfo/openPreview',
                          payload: {
                            previewSrc:  file.url || file.thumbUrl ,
                            previewShow: true,
                          }
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
                      imgsList1.push(multipleImageUploadFan(e, bucket))
                      return false
                    }}
                    onChange = {
                      (e) => {
                        // console.log(e)
                        message.destroy()
                        if (e.file.status === "removed"){
                          //  ProjectInformationList.buildPic = null
                          dispatch({
                            type: 'buildingInfo/saveMediaImages1',
                            payload: {
                              data: e.fileList
                            }

                          })
                          // dispatch({
                          //   type: 'buildingInfo/saveProjectInformation1',
                          //   payload: {
                          //     data: ProjectInformationList,
                          //   }
                          // })
                          // dispatch({
                          //   type: 'buildingInfo/saveMediaImages',
                          //   payload: {
                          //     data: []
                          //   }
                          // })
                          return
                        }
                        message.loading('图片正在上传中，请稍后', 10)

                        // return
                        if (imgsList1.length === e.fileList.length) {
                          // console.log(imgsList.length ,e.fileList.length)
                          Promise.all(imgsList1).then((res) => {
                            message.destroy()
                            saveMultipleImgs1(res)
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
                      !listImg1.length ?
                        <div>
                          <Icon type="plus" />
                          <div className="ant-upload-text">上传</div>
                        </div> : null
                    }
                  </Upload>
                )}
                </div>
              </FormItem> 
            </Col>
        </Row>
        <Modal visible={previewShow} footer={null} onCancel={
            () => {
              dispatch({
                type: 'buildingInfo/openPreview',
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
        <Row gutter={24}>
          <Col span={12} id="abc" >
            <FormItem label={'开盘日期'} 
              labelCol={{ span: 5 }}
              wrapperCol= {{ span: 19 }}
              
            >
            <LocaleProvider locale={zh_CN}  > 
              {
              getFieldDecorator('lgOpenDate', {
                initialValue:moment(ProjectInformationList.lgOpenDate) || "",
                rules: [{
                  required: true,
                  message: '请选择开盘日期',
                }],
              })( 
                // <DatePicker onChange={onChange} />
              <DatePicker  
                  getPopupContainer={() => document.getElementById('abc')}
                  placeholder = "请选择开盘日期"
                  style={{width:'100%'}}
                  format={dateFormat}
                  onChange={openDateChange}
              />) }
            </LocaleProvider>
          </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12} id="abcd">
            <FormItem label={'交房日期'} 
              labelCol={{ span: 5 }}
              wrapperCol= {{ span: 19 }}
            
            >
            <LocaleProvider locale={zh_CN}  > 
              {
              getFieldDecorator('lgGiveDate', {
                initialValue: moment(ProjectInformationList.lgGiveDate) || "",
                // rules: [{
                  // required: true,
                  // message: '请选择开盘日期',
                // }],
              })( 
                // <DatePicker onChange={onChange} />
              <DatePicker  
                  getPopupContainer={() => document.getElementById('abcd')}
                  placeholder = "请选择交房日期"
                  style={{width:'100%'}}
                  format={dateFormat}  
                  // onChange={dateChange}
              />) }
            </LocaleProvider>
          </FormItem>
          </Col>
        </Row>

      <Row gutter={24}>
        <Col span={6} >
          <FormItem label={'所在城市'} 
            labelCol={{ span: 10}}
            wrapperCol={{ span: 14}}
            id="province"
            // validateStatus={houseNameError ? 'error' : ''}
          >
            <div style={{position:"relative"}}>
              <span 
              style={{position:'absolute',border:'1px solid #ccc',height:'32px',width:'45px',top:'3px',left:'6px',textAlign:'center',lineHeight:"32px",borderRadius:'3px 0 0 3px'}}> 
                省份
              </span>
            {
              getFieldDecorator('province', {
              initialValue: ProjectInformationList.lgProvinceName || '',
              rules: [{
                required: true,
                message: '请选择省份',
              }],
            })(
              
              <Select showSearch optionFilterProp="title" 
                getPopupContainer={() => document.getElementById('province')}
                style={{width:'100%',marginLeft:'50px'}}
                onChange={provinceChange}
              >
              <Option value={''} >全部</Option>
                {
                provinceList?provinceList.map((v,i) => (
                <Option title={v.name} key={v.id} value={v.id}>
                  {v.name}
                </Option>
              )):null}
            </Select>
           
            )}
            </div>
          </FormItem>
        </Col>
        <Col span={6} style={{marginLeft:'90px'}} id="city">
          <FormItem 
            label={''} 
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            <div style={{position:"relative"}}>
              <span 
              style={{
                position:'absolute',
                border:'1px solid #ccc',
                height:'32px',width:'45px',
                top:'3px',
                left:'-44px',
                textAlign:'center',
                lineHeight:"32px",
                borderRadius:'3px 0 0 3px'}}> 
                城市
              </span>
            {
              getFieldDecorator('city', {
                rules: [{
                  required: true,
                  message: '请选择城市',
                }],
                initialValue:  ProjectInformationList.lgCityName || "",
              })( 
                
                  <Select showSearch optionFilterProp="title" 
                    getPopupContainer={() => document.getElementById('city')}
                    style={{width:'60%'}}
                    // value={setFieldsValue()}
                    // defaultValue={cityList[0].name}
                    // onChange={houseTypeChange}
                  >
                  <Option value={''} >全部</Option>
                    {
                    cityList?cityList.map((v,i) => (
                    <Option title={v.name} key={v.id} value={v.id}>
                      {v.name}
                    </Option>
                  )):null}
                </Select>
              
                )
              }
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label={'项目类型'} {...formItemLayout}>
              
              {
                getFieldDecorator('lgProjectType', {
                  rules: [{
                    required: true,
                    // max: 4,
                    message: '请选择项目类型',
                  }],
                  initialValue:lgProjectType || '',
                })(
                  // <Col span={24}>
                  <CheckboxGroup
                    options={plainOptions} 
                    // defaultValue={['Apple']} 
                    onChange={checkChange} 
                  />
                  // <Checkbox value="住宅" key="a">住宅</Checkbox>
                  // <Checkbox value="B" key="b">公寓</Checkbox>
                  // <Checkbox value="C" key="c">车位</Checkbox>
                  // <Checkbox value="D" key="d">车位</Checkbox>
                  // </Col>
                )
              }
              
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label={'产权年限'} 
              labelCol={{ span: 5}}
              wrapperCol={{ span: 19}}
            >
              {
                getFieldDecorator('lgPropertyYears', {
                initialValue: ProjectInformationList.lgPropertyYears || '',
                rules: [{
                  required: true,
                  message: '请输入年限',
                  
                }],
              })(
                < Input placeholder = "请输入价格" /> 
              )}
            </FormItem>
          </Col>
          <Col span={2} style={{textAlign:'left',lineHeight:'40px',paddingLeft:'0px'}}>年</Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label={'单价'} 
              labelCol={{ span: 5}}
              wrapperCol={{ span: 19}}
            >
              {
                getFieldDecorator('lgUnitPrice', {
                initialValue: (ProjectInformationList.lgUnitPrice + '') || '',
                rules: [{
                  // required: true,
                  message: '请输入价格',
                }],
              })(
                < Input placeholder = "请输入价格" type='number'/> 
              )}
            </FormItem>
          </Col>
          <Col span={2} style={{textAlign:'left',lineHeight:'40px',paddingLeft:'0px'}}>元/平米</Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label={'楼盘地址'} 
              labelCol={{ span: 5}}
              wrapperCol={{ span: 19}}
            >
              {
                getFieldDecorator('lgProjectAddress', {
                initialValue: ProjectInformationList.lgProjectAddress || '',
                rules: [{
                  required: true,
                  message: '请输入楼盘地址',
                }],
              })(
                < Input placeholder = "请输入楼盘地址" / > 
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label={'售楼处地址'} 
              labelCol={{ span: 5}}
              wrapperCol={{ span: 19}}
            >
              {
                getFieldDecorator('lgSalesAddress', {
                initialValue: ProjectInformationList.lgSalesAddress || '',
                rules: [{
                  required: true,
                  message: '请输入楼盘地址',
                }],
              })(
                < Input placeholder = "请输入楼盘地址" / > 
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label={'高德地图地址'} 
              labelCol={{ span: 5}}
              wrapperCol={{ span: 19}}
            >
              <div style={{position:"relative"}}>
              <span 
              style={{
                position:'absolute',
                border:'1px solid #ccc',height:'32px',
                width:'45px',
                top:'3px',
                paddingTop:'0px',
                right:'1px',
                textAlign:'center',
                lineHeight:"32px",
                borderRadius:'3px 0 0 3px',
                zIndex:222}}
              onClick={iconClick}
              > 
                <img  src={`${require('public/position.png')}`} style={{width:'50%'}}/>
              </span>
              {
                getFieldDecorator('lgMapAddress', {
                initialValue: ProjectInformationList.lgMapAddress || '',
                rules: [{
                  required: true,
                  message: '请输入高德地图地址',
                }],
              })(
                < Input placeholder = "请输入高德地图地址"  onChange={(e) => addressChange(e)}/ > 
              )}
              </div>
            </FormItem>
          </Col>
        </Row>   
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label={'案场电话'} 
              labelCol={{ span: 5}}
              wrapperCol={{ span: 19}}
            >
             <div>
                 <Col span={11}> 
              {
                getFieldDecorator('lgSalesPhone', {
                initialValue: ProjectInformationList.lgSalesPhone || '',
                rules: [{
                  required: true,
                  message: '请输入案场电话',
                }],
              })(
                  < Input placeholder = "400开头电话"/>   
              )}
              </Col>
              <Col span={2} style={{ poaition:'relative'}} >
                <span
                  style={{
                    width:'50px',
                    display:'block',
                    border:'1px solid #ccc',
                    opacity:0.45,
                    padding:0,
                    height:'32px',
                    textIndent:'13px',
                    lineHeight:"32px",
                    position:'absolute',
                    left:'-1px',
                    top:'4px'
                    // borderRadius:'3px 0 0 3px'
                    }}
                >
                  -

                </span>
                </Col>
                <Col span={11}> 
                  < Input placeholder = "400开头电话" defaultValue="400"/> 
                </Col>
              </div>
            </FormItem>
          </Col>
        </Row>          
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label={'分机号'} {...formItemLayout}>
              {
                getFieldDecorator('bfSalesPhone', {
                  rules: [{
                    required: true,
                    // max: 4,
                    message: '输入最多4个字符',
                  }],
                  initialValue: ProjectInformationList.bfSalesPhone || '',
                })( 
                
                < Input placeholder = ""  / > 
                
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
const AddInfo = Form.create()(Add);
AddInfo.propTypes = {
  resetValue: PropTypes.func,
  handleSubmit: PropTypes.func,
  filter: PropTypes.object,
}
export default AddInfo;
