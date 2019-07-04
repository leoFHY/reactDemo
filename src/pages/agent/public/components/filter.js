import { Form, Select, Button, Input, DatePicker, Col, Row, LocaleProvider } from 'antd'
import React, { Component } from 'react'
import { connect } from 'dva'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'

const { RangePicker } = DatePicker

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
        
        if (values.createTime.length) {
          values.createTimeBegin = `${values.createTime[0].format('YYYY-MM-DD')} 00:00:00` || ''
          values.createTimeEnd = `${values.createTime[1].format('YYYY-MM-DD')} 23:59:59` || ''
        }
        values.createTime = null
        if (values.loginTime.length) {
          values.loginTimeBegin = `${values.loginTime[0].format('YYYY-MM-DD')} 00:00:00` || ''
          values.loginTimeEnd = `${values.loginTime[1].format('YYYY-MM-DD')} 23:59:59` || ''
        }
        values.loginTime = null
        // console.log(values);
        // return
        this.props.dispatch({
          type: 'publicModel/getPageList',
          payload: {
            data: values,
            type: 'search',
          },
        });
      }
    })
  }
 
  resertAll() {
    this.props.form.resetFields()
    this.props.dispatch({
      type: 'publicModel/getPageList',
      payload: {
        data: {
          pageNum: 1,
          pageSize: 10
        },
        type: 'reset',
      },
    });
  }

  exportDoc () {
    this.props.dispatch({
      type: 'publicModel/getPageList',
      payload: {},
      isDownload: true,
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} autoComplete="off">
        <Row>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'客户姓名'}>
              {
                getFieldDecorator('userName', {
                initialValue: '',
              })(
                <Input placeholder="请输入客户姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'手机号码'}>
              {
                getFieldDecorator('phone', {
                initialValue: '',
              })(
                <Input placeholder="请输入手机号码" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'身份证号'}>
              {
                getFieldDecorator('idCard', {
                initialValue: '',
              })(
                <Input placeholder="请输入身份证号" />
              )}
            </FormItem>
          </Col>
          <Col span={6} id="f4">
            <FormItem {...formItemLayout} label={'是否绑定银行卡'}>
              {
                getFieldDecorator('hasBankNo', {
                initialValue: '',
              })(
                <Select  getPopupContainer={() => document.getElementById('f4')}>
                  <Option value={''} >全部</Option>
                  {
                    this.props.publicModel.isBindingList.map((item) => {
                    return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6} id="inviteCount">
            <FormItem {...formItemLayout} label={'推介次数'}>
              {
                getFieldDecorator('inviteCount', {
                  initialValue: null,
                })( <
                  Input placeholder = "请输入推介次数" / >
                )
              }
            </FormItem>
          </Col>
          <Col span={12} >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={'注册时间'} id="abc">
             <LocaleProvider locale={zh_CN}> 
                {
                  getFieldDecorator('createTime', {
                  initialValue: [],
                })(
                  <RangePicker   format="YYYY-MM-DD" getPopupContainer={() => document.getElementById('abc')}/>
                )}
              </LocaleProvider>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'银行卡号'}>
              {
                getFieldDecorator('bankNo', {
                initialValue: '',
              })(
                <Input placeholder="请填写银行卡号" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={'最近登录'} id = "loginTime">
              <LocaleProvider locale={zh_CN}>
                {
                  getFieldDecorator('loginTime', {
                  initialValue: [],
                })(
                  <RangePicker   format="YYYY-MM-DD"  getPopupContainer={() => document.getElementById('loginTime')}/>
                )}
              </LocaleProvider>  
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 14 }}
              wrapperCol={{ span: 10 }}
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
export default connect(({ publicModel }) => ({
  publicModel
}))(FilterForm)
