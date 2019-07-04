import { Form, Select, Button, Input, DatePicker, Col, Row } from 'antd'
import React, { Component } from 'react'

import { router } from 'utils'
import { connect } from 'dva'

const styles = {
  formItemLayout: {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  },
}

const formItemLayout = styles.formItemLayout
const FormItem = Form.Item
const Option = Select.Option

class Filter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      createTimeFrom: null,
      createTimeTo: null,
    }
  }
  handleReset = () => {
    console.log('重置')
    this.props.form.setFieldsValue(
      {
        name: '',
        useType: '',
        state: '',
      }
    )
    this.setState({
      createTimeFrom: '',
      createTimeTo: '',
    })
    this.props.dispatch({
      type: 'couponTemplate/getTemList',
      payload: {
        type: 'search',
        data: {
          pageNum: '1',
          pageSize: this.props.couponTemplate.pageSize,
        },
      },
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const model = this.props.couponTemplate
        const params = {
          name: values.name || '',
          useType: values.useType,
          state: values.state,
          createTimeFrom: this.state.createTimeFrom && this.state.createTimeFrom.format(model.dateFormat),
          createTimeTo: this.state.createTimeTo && this.state.createTimeTo.format(model.dateFormat),
          pageNum: '1',
          pageSize: model.pageSize,
        }
        this.props.dispatch({
          type: 'couponTemplate/getTemList',
          payload: {
            type: 'search',
            data: params,
          },
        })
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={6}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label={'优惠券模版'}
            >
              {getFieldDecorator('name', {
                initialValue: '',
              })(
                <Input placeholder="编号、名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label={'优惠券类型'}
            >
              {getFieldDecorator('useType', {
                initialValue: '',
              })(
                <Select >
                  {this.props.couponTemplate && this.props.couponTemplate.useType.map((v) => {
                    return <Option key={v.id} >{v.name}</Option>
                  })}
                </Select>
            )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'状态'}>
              {getFieldDecorator('state', {
                initialValue: '',
              })(
                <Select>
                  {this.props.couponTemplate && this.props.couponTemplate.stateList.map((v) => {
                    return <Option key={v.id} >{v.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'创建时间'}>
              {getFieldDecorator('createTimeFrom', {
              })(
                <div>
                  <Col span={3}>
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD"
                      value={this.state.createTimeFrom}
                      placeholder="开始时间"
                      onChange={(value) => {
                        this.setState({
                          createTimeFrom: value,
                        })
                      }}
                      style={{ width: 100 }}
                    />
                  </Col>
                  <Col span={3}>
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD"
                      value={this.state.createTimeTo}
                      placeholder="结束时间"
                      onChange={(value) => {
                        this.setState({
                          createTimeTo: value,
                        })
                      }}
                      style={{ marginLeft: 82, width: 100 }}
                    />
                  </Col>
                </div>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem
              labelCol={{ span: 18 }}
              wrapperCol={{ span: 6 }}
              label={' '}
              colon={false}
              style={{ textAlign: 'right' }}
            >
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>查询</Button>
              <Button onClick={this.handleReset}>重置</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => {
                router.push({
                  pathname: '/coupons/couponTemplateManagement/Form',
                  query: {
                    type: 'add',
                  },
                })
              }}
              >
              新增
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const FilterForm = Form.create()(Filter)

export default connect(({ couponTemplate }) => ({ couponTemplate }))(FilterForm)
