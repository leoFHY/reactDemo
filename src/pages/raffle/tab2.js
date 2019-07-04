import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
import { Button, Form, message,Upload, Modal, DatePicker, LocaleProvider, Input, Row, Col,  } from 'antd'
import AddMultipleImage from 'components/Upload/AddMultipleImage.js'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { deepCopy } from 'utils/copy'
const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

@connect(({ raffle, loading, bucket }) => ({ raffle, loading, bucket }))
class Tab extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
       previewVisible: false,
       previewImage: ''
    }
  }

  render() {
    const { dispatch, raffle, bucket } = this.props
    const { getFieldDecorator,validateFieldsAndScroll,resetFields } = this.props.form;
    const { listImg3, datailData } = raffle
    const { previewImage, previewVisible } = this.state
    const floatL = {
      float: 'left'
    }
    const ImgPicList = []
    if (listImg3) {
      listImg3.forEach((item, i) => {
        ImgPicList[i] = []
        ImgPicList[i][0] = {}
        ImgPicList[i][0] = Object.assign({uid: i, url: item.picUrl}, item);
      })
    }
        
    const handelSave = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          if (values.time.length) {
            values.startDate = values.time[0].format('YYYY-MM-DD HH:mm:ss') || ''
            values.endDate = values.time[1].format('YYYY-MM-DD HH:mm:ss') || ''
            values.time = null
          }
          values.id = datailData.id
          values.picList = deepCopy(listImg3)
          values.picList.forEach((v, i) => {
            return v.sort = i + 1
          })
          dispatch({
              type: 'raffle/configurationUpdate',
              payload: values,
           })
        }
      });
    }
    const saveMultipleImgs = (url) => {
      // if ((mediaImages.length + url.length) > 8) {
      //   message.warn('图片最多上传8张,请重新上传')
      //   return false
      // } else {
      //   message.destroy()
      //   message.info('上传图片成功，如果无需添加，请点击保存')
      //   this.props.dispatch({
      //     type: 'mediaAnother/saveMediaImages',
      //     payload: {
      //       images: url,
      //     },
      //   })
      // }
      dispatch({
        type: 'raffle/saveRaffleImages',
        payload: {
          data: {
            picUrl: url[0],
          } 
        },
      })
    }
    const uploadList = {
      bucket,
      dispatch,
      saveMultipleImgs,
      multiple: false
    }
    const toLeft = (i) => {
       dispatch({
         type: 'raffle/changePos',
         payload: {
           type: 'l',
           i,
         },
       })
    }
    const toRight = (i) => {
      dispatch({
        type: 'raffle/changePos',
        payload: {
          type: 'r',
          i,
        },
      })
    }
    const onPreview = (url) => {
      this.setState({
        previewVisible: true,
        previewImage: url
      })
    }
    const previewCancel = () => {
      this.setState({
        previewVisible: false
      })
    }
    
    return (
      <Page  style={{background:'#ffffff'}} >
         <Button type="primary" onClick={() => handelSave(validateFieldsAndScroll)} style={{marginBottom: '20px',marginLeft:'70px'}}>保存</Button>
          <Form>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label={'抽奖名称'} {...formItemLayout}>
                  {
                    getFieldDecorator('ruleName', {
                      initialValue: datailData.ruleName || '',
                    })( < Input placeholder = "请填写抽奖名称" maxLength={14} /> )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>  
                <FormItem label={'抽奖时间段'} {...formItemLayout} id="abc">
                  <LocaleProvider locale={zh_CN}>  
                    {
                      getFieldDecorator('time', {
                        initialValue: datailData.time || [],
                      })( 
                        <RangePicker style = {{width:'100%'}}  showTime format="YYYY-MM-DD HH:mm:ss"  getPopupContainer={() => document.getElementById('abc')}/> 
                        )
                    }
                  </LocaleProvider>
                </FormItem>
              </Col>
            </Row>  
            <Row gutter={24}>
              <Col span={24}>  
                <FormItem label={'抽奖规则'} labelCol= {{span: 3}} wrapperCol = {{span: 21}}>
                    {
                      ImgPicList.map((v, i) => {
                        return(
                          <div style = {{...floatL}} key = {i}>
                              <Upload
                                listType="picture-card"
                                fileList = {v}
                                onPreview = {
                                  (file) => {
                                      onPreview(file.url || file.thumbUrl)
                                  }
                                }
                                onRemove={(e) =>{
                                  dispatch({
                                    type: 'raffle/removeImg',
                                    payload:e.uid,
                                  })
                                }}
                              >
                              </Upload>
                              <div >
                                <Button style={{ marginBottom: 10 }} size="small" onClick={() => toLeft(i)}>左移</Button>
                                <Button size="small"
                                  onClick={() => toRight(i)}
                                  style={{ marginLeft: 10, marginBottom: 10 }}
                                >右移</Button>
                              </div>
                          </div>
                        )
                      })
                    }
                    < AddMultipleImage {...uploadList} fileName = {'raffleImages'}/>
                </FormItem>
              </Col>
            </Row>      
          </Form> 
          <Modal visible={previewVisible} footer={null} onCancel={previewCancel} maskClosable = {false}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
      </Page>
    )
  }
}
const Tab2 = Form.create()(Tab);
Tab2.propTypes = {
  filterDetail: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Tab2
