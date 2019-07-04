import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Button, Upload, Icon, Modal, message, InputNumber, Select } from 'antd'
// import { hashHistory } from 'dva/router'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { onFileSelectChange, beforeUpload, openFileUpload } from 'utils/ossUploadUtils'
// import { initNestDataSource, addNewNestRow, delOneNestRow, moveTableValues } from '../../../utils/common'
// import 'styles/common/common.less'
import { getName, getValue } from '../../../../utils/transformData'


moment.locale('zh-cn')
const { TextArea } = Input
const FormItem = Form.Item

class FormModel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
    }
  }
  UNSAFE_componentWillMount () {
    const name = this.props.app.user.username
    if (name) {
      this.props.dispatch({
        type: 'personageMsg/getUserMsg',
        payload: {
          loginName: name,
        },
      })
      // this.props.dispatch({
      //   type: 'personageMsg/getMediaList',
      //   payload: {},
      // })
      // this.props.dispatch({
      //   type: 'personageMsg/getDictList',
      //   payload: {},
      // })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const param = {
          id: this.props.app.user.id,
          photo: values.photo.length ? values.photo[0].url : '',
          name: values.name,
          email: values.email,
          phone: values.phone,
          mobile: values.mobile,
          remarks: values.remarks,
          mediaId: values.mediaId,
          userType: values.userType,
        }
        this.props.dispatch({
          type: 'personageMsg/updateMem',
          payload: param,
        })
      }
    })
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const model = this.props.personageMsg
    const detail = model.detail
    // const name = this.props.app.user.username
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
    return (
      <Form onSubmit={this.handleSubmit} autoComplete="off">
        {/* <FormItem
          {...formItemLayout}
          label="头像"
        >
          <div
            className="clearfix"
            onClick={(e) => { openFileUpload(e, this.props.dispatch) }}
          >
            {getFieldDecorator('photo', {
              rules: [],
              valuePropName: 'fileList',
              initialValue: detail.photo[0].url ? detail.photo : [],
              getValueFromEvent: (e) => {
                if (this.state.imgMaxSize) {
                  return []
                }
                return onFileSelectChange(e, this.props.bucket)
              },
            })(
              <Upload
                name="file"
                accept="image/*"
                action={this.props.bucket.host}
                listType="picture-card"
                data={this.props.bucket.bucketData}
                onPreview={this.handlePreview}
                beforeUpload={(e) => {
                  let isLt200k = e.size / 1024 > 200
                  let reg = new RegExp(/^image\/jpeg|gif|jpg|png$/, 'i')
                  if (!reg.test(e.type)) {
                    message.warn('图片格式不正确,请重新上传!')
                    // this.state.imgMaxSize = true
                    this.setState({
                      imgMaxSize: true,
                    })
                    return false
                  }
                  if (isLt200k) {
                    message.warn('图片大小不能超过200kb,请重新上传!')
                    // this.state.imgMaxSize = true
                    this.setState({
                      imgMaxSize: true,
                    })
                    return !isLt200k
                  }
                  // this.state.imgMaxSize = false
                  this.setState({
                    imgMaxSize: false,
                  })
                  beforeUpload(e, this.props.dispatch)
                  return !isLt200k
                }}
              >
                {
                  !getFieldValue('photo') || !getFieldValue('photo').length ?
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">Upload</div>
                    </div> : null
                }
              </Upload>
            )}
          </div>
        </FormItem> */}
        {/* <FormItem
          {...formItemLayout}
          label="归属公司"
          hasFeedback
        >
          {getFieldDecorator('companyName', {
          })(
            <span>{ detail.companyName }</span>
          )}
        </FormItem> */}
        <FormItem
          {...formItemLayout}
          label="归属部门"
          hasFeedback
        >
          {getFieldDecorator('officeName', {
          })(
            <span>{ detail.officeName }</span>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="姓名"
          hasFeedback
        >
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{
              required: true, message: '姓名不能为空',
            }],
          })(
            <Input style={{ width: '40%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="邮箱"
          hasFeedback
        >
          {getFieldDecorator('email', {
            initialValue: detail.email,
            rules: [{
              type: 'email', message: '请输入正确的邮箱地址!',
            }],
          })(
            <Input style={{ width: '40%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="电话"
          hasFeedback
        >
          {getFieldDecorator('phone', {
            initialValue: detail.phone,
          })(
            <InputNumber style={{ width: '40%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机"
          hasFeedback
        >
          {getFieldDecorator('mobile', {
            initialValue: detail.mobile,
          })(
            <InputNumber style={{ width: '40%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注"
          hasFeedback
        >
          {getFieldDecorator('remarks', {
            initialValue: detail.remarks,
          })(
            <TextArea style={{ width: '50%' }} />
          )}
        </FormItem>
        {/* <FormItem
          {...formItemLayout}
          label="所属媒体"
          hasFeedback
        >
          {getFieldDecorator('mediaId', {
            initialValue: getValue(detail.mediaId, model.mediaList) ? detail.mediaId : '',
          })(
            <Select style={{ width: '40%' }}>
              <Select.Option value={''} key={''}>暂不设置</Select.Option>
              {
                model.mediaList.map(v => (
                  <Select.Option value={v.id} key={v.id}>{v.value}</Select.Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="用户类型"
          hasFeedback
        >
          {getFieldDecorator('userType', {
            initialValue: getName(detail.userType, model.dictList, 'id', 'label') ? detail.userType : '',
            rules: [{
              required: true, message: '用户类型不能为空',
            }],
          })(
            <Select style={{ width: '40%' }}>
              {
                model.dictList.map(v => (
                  <Select.Option title={v.label} value={v.id} key={v.id}>{v.label}</Select.Option>
                ))
              }
            </Select>
          )}
        </FormItem> */}
        <FormItem
          {...formItemLayout}
          label="用户角色"
          hasFeedback
        >
          {getFieldDecorator('role', {
          })(
            <span>{ detail.role }</span>
          )}
        </FormItem>
        {/* <FormItem
          {...formItemLayout}
          label="上次登陆"
          hasFeedback
        >
          {getFieldDecorator('loginIp', {
          })(
            <div>
              <span>{ detail.loginIp }</span>
              <span style={{ paddingLeft: 20 }}>时间:</span>
              <span>{ detail.loginDate }</span>
            </div>
          )}
        </FormItem> */}
        <FormItem
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </FormItem>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </Form>
    )
  }
}

const PersonageMsg = Form.create()(FormModel)
export default connect(({ personageMsg, app, bucket }) => ({ personageMsg, app, bucket }))(PersonageMsg)
