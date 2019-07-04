import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Button, Upload, Icon, Modal, message, InputNumber } from 'antd'
import { hashHistory } from 'dva/router'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')
const { TextArea } = Input
const FormItem = Form.Item

class FormModel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmDirty: false,
    }
  }
  componentDidMount () {
    // const query = this.props.location.query
    // if (query.type === 'edit' || query.type === 'view') {
    //   this.props.dispatch({
    //     type: 'brandManagement/brandEdit',
    //     payload: {
    //       id: query.id,
    //     },
    //   })
    // } else {
    //   this.props.dispatch({
    //     type: 'brandManagement/clearAll',
    //   })
    // }
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('firstPwd')) {
      callback('两次密码不一样,请重新输入')
    } else {
      callback()
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['secondPwd'], { force: true })
    }
    callback()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const param = {
          loginName: this.props.app.user.username,
          oldPwd: values.oldPwd,
          firstPwd: values.firstPwd,
          secondPwd: values.secondPwd,
        }
        this.props.dispatch({
          type: 'personageMsg/modifyPassword',
          payload: param,
        })
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const model = this.props.personageMsg
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
        <FormItem
          {...formItemLayout}
          label="旧密码"
          hasFeedback
          key="oldPwd"
        >
          {getFieldDecorator('oldPwd', {
            initialValue: model.oldPwd,
            rules: [{
              required: true, message: '请输入旧密码,密码不能为空',
            }],
          })(
            <Input type="password" style={{ width: '40%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="新密码"
          hasFeedback
          key="firstPwd"
        >
          {getFieldDecorator('firstPwd', {
            initialValue: model.firstPwd,
            rules: [{
              required: true, message: '请输入新密码,新密码不能为空',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" style={{ width: '40%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认新密码"
          hasFeedback
          key="secondPwd"
        >
          {getFieldDecorator('secondPwd', {
            initialValue: model.secondPwd,
            rules: [{
              required: true, message: '请重复输入新密码,新密码不能为空',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" style={{ width: '40%' }} onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
          key="new"
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </FormItem>
      </Form>
    )
  }
}


const ChangePswd = Form.create()(FormModel)
export default connect(({ personageMsg, app }) => ({ personageMsg, app }))(ChangePswd)
