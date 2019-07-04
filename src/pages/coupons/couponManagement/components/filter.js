import { Form, Select, Button, Input, DatePicker, Col, Row } from 'antd'
import React, { Component } from 'react'
// import { hashHistory } from 'dva/router'
import { connect } from 'dva'
import moment from 'moment'
import 'moment/locale/zh-cn'
// import Styles from './index.css'

moment.locale('zh-cn')

const styles = {
  formItemLayout: {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
    style: {
      marginBottom: 18,
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
      updateTimeFrom: null,
      updateTimeTo: null,
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        const { updateTimeFrom, updateTimeTo } = this.state
        const { dateFormat, pageSize } = this.props.couponManagement
        const param = {
          batchName: values.batchName,
          couponNo: values.couponNo,
          bindState: values.bindState,
          couponDefName: values.couponDefName,
          orderNo: values.orderNo,
          supplyName: values.supplyName,
          // updateTimeFrom: values.updateTimeFrom && values.updateTimeFrom.format(dateFormat),
          // updateTimeTo: values.updateTimeTo && values.updateTimeTo.format(dateFormat),
          updateTimeFrom: updateTimeFrom ? updateTimeFrom.format(dateFormat) : null,
          updateTimeTo: updateTimeTo ? updateTimeTo.format(dateFormat) : null,
          pageNum: 1,
          pageSize,
          type: 'search',
        }
        console.log(param)
        this.props.dispatch({
          type: 'couponManagement/couponPageList',
          payload: param,
        })
      }
    })
  }

  resertAll () {
    this.setState({
      updateTimeFrom: null,
      updateTimeTo: null,
    })
    this.props.form.resetFields()
    this.props.dispatch({
      type: 'couponManagement/couponPageList',
      payload: {
        type: 'search',
        pageNum: 1,
        pageSize: this.props.couponManagement.pageSize,
      },
    })
  }

  exportDoc () {
    let item = this.props.couponManagement
    this.props.dispatch({
      type: 'couponManagement/exportDoc',
      payload: {
        batchName: item.batchName,
        couponNo: item.couponNo,
        bindState: item.bindState,
        couponDefName: item.couponDefName,
        orderNo: item.orderNo,
        supplyName: item.supplyName,
        updateTimeFrom: item.updateTimeFrom,
        updateTimeTo: item.updateTimeTo,
        pageNum: 1,
        pageSize: item.pageSize,
      },
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} autoComplete="off">
        <Row>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'制券批次'}>
              {getFieldDecorator('batchName', {
                initialValue: '',
              })(
                <Input placeholder="编号、名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'优惠券号'}>
              {getFieldDecorator('couponNo', {
                initialValue: '',
              })(
                <Input placeholder="优惠券号" />
              )}
            </FormItem>
          </Col>
          <Col span={6} id="status">
            <FormItem style={{ width: '100%' }} {...formItemLayout} label={'状态'}>
              {getFieldDecorator('bindState', {
                initialValue: '',
              })(
                <Select size="large" getPopupContainer={() => document.getElementById('status')}>
                  {this.props.couponManagement.stateList.map((item) => {
                    return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'优惠券模板'}>
              {getFieldDecorator('couponDefName', {
                initialValue: '',
              })(
                <Input placeholder="编号、名称" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'渠道订单编号'}>
              {getFieldDecorator('orderNo', {
                initialValue: '',
              })(
                <Input placeholder="渠道订单编号" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'渠道名称'}>
              {getFieldDecorator('supplyName', {
                initialValue: '',
              })(
                <Input placeholder="渠道名称" />
              )}
            </FormItem>
          </Col>
          <Col span={12} id="startdate">
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={'更新日期'}>
              {getFieldDecorator('date', {
                initialValue: null,
              })(
                <div >
                  <DatePicker size="large" showTime format="YYYY-MM-DD HH:mm:ss" value={this.state.updateTimeFrom} placeholder="开始时间"
                    getPopupContainer={() => document.getElementById('startdate')}
                    onChange={(value) => {
                      this.setState({
                        updateTimeFrom: value,
                      })
                    }}
                  />
                  <span style={{ margin: '0 10px' }}>至</span>
                  <DatePicker size="large" showTime format="YYYY-MM-DD HH:mm:ss" value={this.state.updateTimeTo} placeholder="结束时间"
                    getPopupContainer={() => document.getElementById('startdate')}
                    onChange={(value) => {
                      this.setState({
                        updateTimeTo: value,
                      })
                    }}
                  />
                </div>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem
              labelCol={{ span: 1 }}
              wrapperCol={{ span: 18 }}
              label={' '}
              colon={false}
            >
              <Button type="primary" style={{ marginRight: 10 }} size="large" htmlType="submit">搜索</Button>
              <Button size="large" style={{ marginRight: 10 }} onClick={this.resertAll.bind(this)}>重置</Button>
              <Button size="large" onClick={this.exportDoc.bind(this)}>导出</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

const FilterForm = Form.create()(Filter)
export default connect(({ couponManagement }) => ({ couponManagement }))(FilterForm)
