import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Button, Select, Upload, Icon, Modal, message } from 'antd'
import { hashHistory } from 'dva/router'
import { router } from 'utils'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { onFileSelectChange, beforeUpload, openFileUpload, renewBucketData, imageUpload } from 'utils/ossUploadUtils'

moment.locale('zh-cn')

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

class FormAd extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      previewVisible: false,
      previewImage: '',
    }
  }
  componentWillMount () {
    const query = this.props.location.query
    if (query.type === 'edit') {
      this.props.dispatch({
        type: 'manageGiftCardList/getCardFaceData',
        payload: {
          id: query.id,
        },
      })
    } else {
      // 新增清空数据
      this.props.dispatch({
        type: 'manageGiftCardList/clearCardFaceData',
      })
    }
  }
  getTypeId = (name) => {
    switch (name) {
      case '礼品卡':
        return '1'
      case '优惠券':
        return '2'
      case '权益卡':
        return '3'
      default:
        return ''
    }
  }
  getTypeName = (id) => {
    switch (id) {
      case '1':
        return '礼品卡'
      case '2':
        return '优惠券'
      case '3':
        return '权益卡'
      default:
        return ''
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const query = this.props.location.query
        const param = {
          name: values.cardTypeName && values.cardTypeName,
          otherSide: values.backImg.length > 0 && values.backImg[0].url,
          positive: values.fontImg.length > 0 && values.fontImg[0].url,
          bizType: values.type && this.getTypeId(values.type),
          describe: values.describe && values.describe,
        }
        if (query.type === 'edit') {
          param.id = query.id
          this.props.dispatch({
            type: 'manageGiftCardList/updateCardFace',
            payload: param,
          })
        } else {
          this.props.dispatch({
            type: 'manageGiftCardList/createCardFace',
            payload: param,
          })
        }
      }
    })
  }
  handlePreview = (file) => {
    console.log('图片', file)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
  handleReset = () => {
    console.log('重置')
    this.props.form.setFieldsValue(
      {
        cardTypeName: '',
        fontImg: [],
        backImg: [],
        type: '',
        describe: '',
      }
    )
  }
  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
    const model = this.props.manageGiftCardList
    const FormADd = [
      <FormItem
        {...formItemLayout}
        label="名称："
        key="cardTypeName"
      >
        {getFieldDecorator('cardTypeName', {
          initialValue: model.cardFaceData.name,
          rules: [{ required: true, message: '请输入名称！' }],
        })(
          <Input onChange={
            (e) => {
              this.setState({
                name: e.target.value,
              })
            }
          }
          />
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="正面图片："
        key="fontImg"
      >
        <div className="clearfix" onClick={(e) => { openFileUpload(e, this.props.dispatch) }} >
          {getFieldDecorator('fontImg', {
            rules: [],
            valuePropName: 'fileList',
            initialValue: model.cardFaceData.fontImg,
            getValueFromEvent: (e) => {
              if (this.state.imgMaxSize) {
                return []
              }
              return onFileSelectChange(e, this.props.bucket)
            },
          })(
            <Upload name="file" action={this.props.bucket.host}
              listType="picture-card"
              accept="image/*"
              data={this.props.bucket.bucketData}
              onPreview={this.handlePreview}
              beforeUpload={(e) => {
                let isLt200k = e.size / 1024 > 200
                let reg = new RegExp(/^image\/jpeg|gif|jpg|png$/, 'i')
                if (!reg.test(e.type)) {
                  message.warn('图片格式不正确,请重新上传!')
                  this.state.imgMaxSize = true
                  return false
                }
                if (isLt200k) {
                  message.warn('图片大小不能超过200kb,请重新上传!')
                  this.state.imgMaxSize = true
                  return !isLt200k
                }
                this.state.imgMaxSize = false
                beforeUpload(e, this.props.dispatch)
                return !isLt200k
              }}
            >
              {
                !getFieldValue('fontImg') || !getFieldValue('fontImg').length ?
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                  </div> : null
              }
            </Upload>
          )}
        </div>
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="反面图片："
        key="backImg"
      >
        <div className="clearfix" onClick={(e) => { openFileUpload(e, this.props.dispatch) }} >
          {getFieldDecorator('backImg', {
            rules: [],
            valuePropName: 'fileList',
            initialValue: model.cardFaceData.backImg,
            getValueFromEvent: (e) => {
              if (this.state.imgMaxSize) {
                return []
              }
              return onFileSelectChange(e, this.props.bucket)
            },
          })(
            <Upload name="file" action={this.props.bucket.host}
              listType="picture-card"
              accept="image/*"
              data={this.props.bucket.bucketData}
              onPreview={this.handlePreview}
              beforeUpload={(e) => {
                let isLt200k = e.size / 1024 > 200
                let reg = new RegExp(/^image\/jpeg|gif|jpg|png$/, 'i')
                if (!reg.test(e.type)) {
                  message.warn('图片格式不正确,请重新上传!')
                  this.state.imgMaxSize = true
                  return false
                }
                if (isLt200k) {
                  message.warn('图片大小不能超过200kb,请重新上传!')
                  this.state.imgMaxSize = true
                  return !isLt200k
                }
                this.state.imgMaxSize = false
                beforeUpload(e, this.props.dispatch)
                return !isLt200k
              }}
            >
              {
                !getFieldValue('backImg') || !getFieldValue('backImg').length ?
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                  </div> : null
              }
            </Upload>
          )}
        </div>
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="类型"
        key="type"
      >
        {getFieldDecorator('type', {
          initialValue: this.getTypeName(model.cardFaceData.type),
          rules: [{ required: true, message: '请选择类型！' }],
        })(
          <Select style={{ width: '30%' }}>
            {this.props.manageGiftCardList.typeList.map((v) => {
              return <Option key={v.id} value={v.name}>{v.name}</Option>
            })}
          </Select>
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="描述"
        key="describe"
      >
        {getFieldDecorator('describe', {
          initialValue: model.cardFaceData.desc,
          rules: [],
        })(
          <TextArea />
        )}
      </FormItem>,
    ]
    const New = [
      <FormItem key="New">
        <Button style={{ marginRight: '30px', marginLeft: '40%' }}
          onClick={
            () => {
              router.push({
                pathname: '/coupons/giftCardAppearanceManagement',
              })
            }
          }
        >
        返回
        </Button>
        {this.props.location.query.type === 'add' ? <Button onClick={this.handleReset.bind(this)} >
          重置
        </Button> : ''}
        <Button style={{ marginLeft: '30px' }} type="primary" htmlType="submit">
        提交
        </Button>
      </FormItem>,
    ]

    return (
      <Form onSubmit={this.handleSubmit}>
        {FormADd}
        {New}
        <Modal visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </Form>
    )
  }
}

const GiftCardAppearanceForm = Form.create()(FormAd)
export default connect(({ bucket, manageGiftCardList }) => ({ bucket, manageGiftCardList }))(GiftCardAppearanceForm)
