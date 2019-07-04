import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, InputNumber, Button } from 'antd'
import { routerRedux } from 'dva/router'

const FormItem = Form.Item
const TextArea = Input.TextArea

class Add extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  backIndex = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/backStageManagement/dictionary',
      query: {
      },
      state: {
        item: 'back',
      },
    }))
  }

  backIndex2 = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/backStageManagement/dictionary',
    }))
  }
  handleSubmit (e) {
    e.preventDefault()
    const id = this.props.dictionary.detailData.id
    const typeItem = this.props.dictionary.detailData.typeItem
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (id && typeItem) {
          this.props.dispatch({
            type: 'dictionary/update',
            payload: { ...values, id },
            backIndex: this.backIndex,
          })
        } else {
          this.props.dispatch({
            type: 'dictionary/add',
            payload: { ...values },
            backIndex: this.backIndex2,
          })
        }
      }
    })
  }
  resertAll () {
    this.props.form.resetFields()
  }
  render () {
    const model = this.props.dictionary
    const isUpdate = this.props.location.query.item === 'update'
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
          <FormItem {...formItemLayout} label="键值" key="value">
            {getFieldDecorator('value', {
              initialValue: model.detailData.value || '',
              rules: [{
                required: true, message: '键值为必填',
              }],
            })(
              <Input placeholder="请填写键值" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="标签" key="label">
            {getFieldDecorator('label', {
              initialValue: model.detailData.label,
              rules: [{
                required: true, message: '标签为必填',
              }],
            })(
              <Input placeholder="请填写标签" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="类型" key="type">
            {getFieldDecorator('type', {
              initialValue: model.detailData.type,
              rules: [{
                required: true, message: '类型为必填',
              }],
            })(
              <Input placeholder="请填写类型" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="描述" key="description">
            {getFieldDecorator('description', {
              initialValue: model.detailData.description,
              rules: [{
                required: true, message: '描述为必填',
              }],
            })(
              <Input placeholder="请填写描述" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="排序" key="sort">
            {getFieldDecorator('sort', {
              initialValue: model.detailData.sort,
              rules: [{
                required: true, message: '排序必填, 只能为数字', type: 'integer',
              }],
            })(
              <InputNumber min={1} precision={0} style={{ width: '100%' }} placeholder="请填写排序" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注" key="remarks">
            {getFieldDecorator('remarks', {
              initialValue: model.detailData.remarks,
              rules: [{
                // required: true, message: '备注为必填',
              }],
            })(
              <TextArea placeholder="请填写备注" />
            )}
          </FormItem>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={this.backIndex}>返回</Button>
            <Button style={{ marginLeft: 30 }} type="primary" htmlType="submit">保存</Button>
            {!isUpdate ?
              <Button onClick={this.resertAll.bind(this)} style={{ marginLeft: 30 }}>重置</Button>
              : ''}
          </div>
        </Form>
      </div>
    )
  }
}

export default connect(({ dictionary }) => ({ dictionary }))(Form.create()(Add))
