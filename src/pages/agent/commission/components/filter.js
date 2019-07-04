import { Form, Select, Button, Input, DatePicker,message, Col, Row, LocaleProvider, Upload, Icon } from 'antd'
import React, { Component } from 'react'
import { connect } from 'dva'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import '../index.less'

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
      
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {

        if (values.commissionTime.length) {
          values.commissionTimeBegin = `${values.commissionTime[0].format('YYYY-MM-DD')} 00:00:00` || ''
          values.commissionTimeEnd = `${values.commissionTime[1].format('YYYY-MM-DD')} 23:59:59` || ''
        }
        values.commissionTime = null
        if (values.inviteTime.length) {
          values.inviteTimeBegin = `${values.inviteTime[0].format('YYYY-MM-DD')} 00:00:00` || ''
          values.inviteTimeEnd = `${values.inviteTime[1].format('YYYY-MM-DD')} 23:59:59` || ''
        }
        values.inviteTime = null
        // console.log(values);
        // return
        this.props.dispatch({
          type: 'commission/getPageList',
          payload: {
            data: values,
            type: 'search',
          },
        });
      }
    })
  }

  resertAll () {
    this.props.form.resetFields()
    this.props.dispatch({
      type: 'commission/getPageList',
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
      type: 'commission/getPageList',
      payload: {},
      isDownload: true,
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { statusList, projectList } = this.props.commission
   
    const fileClose = (info) => {
      let formData = new FormData()
      formData.append('file', info.file)
      this.props.dispatch({
        type: 'commission/uploadClose',
        payload: formData
      })
    }
    const fileUnClose = (info) => {
      let formData = new FormData()
      formData.append('file', info.file)
      this.props.dispatch({
        type: 'commission/uploadUnClose',
        payload: formData
      })
    }
    return (
      <Form onSubmit={this.handleSubmit} autoComplete="off" >
        <Row>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'推介人'}>
              {
                getFieldDecorator('userName', {
                initialValue: '',
              })(
                <Input placeholder="请输入推介人姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'推介人手机号'}>
              {
                getFieldDecorator('userPhone', {
                initialValue: '',
              })(
                <Input placeholder="请输入推介人手机号码" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'推介人身份证号'}>
              {
                getFieldDecorator('idCard', {
                initialValue: '',
              })(
                < Input placeholder = "请输入推介人身份证号" / >
              )}
            </FormItem>
          </Col>
          <Col span={6} id="status">
            <FormItem {...formItemLayout} label={'结佣状态'}>
              {
                getFieldDecorator('commissionStatus', {
                initialValue: '',
              })(
                <Select  getPopupContainer={() => document.getElementById('status')}>
                  <Option value={''} >全部</Option>
                  {
                    statusList.map((item) => {
                      return (
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                        )
                      })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'被推介人'}>
              {
                getFieldDecorator('inviteName', {
                initialValue: '',
              })(
                < Input placeholder = "请输入被推介人姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'被推介手机号'}>
              {
                getFieldDecorator('invitePhone', {
                initialValue: '',
              })(
                < Input placeholder = "请输入被推介手机号" / >
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'推介楼盘'}>
              {
                getFieldDecorator('bfProjectId', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('status')}>
                  <Option value={''} >全部</Option>
                  {
                    projectList.length 
                    ?
                    projectList.map((item) => {
                    return (
                      <Option title={item.bfProjectName} value={item.bfProjectId} key={item.bfProjectId}>{item.bfProjectName}</Option>
                      )
                    })
                    : null
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label={'绑定银行卡'}>
              {
                getFieldDecorator('bankNo', {
                initialValue: '',
              })(
                < Input placeholder = "请输入绑定银行卡" / >
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={'推介时间'} id="abc">
              <LocaleProvider locale={zh_CN}> 
                {
                  getFieldDecorator('inviteTime', {
                  initialValue: [],
                })(
                  <RangePicker   format="YYYY-MM-DD"  getPopupContainer={() => document.getElementById('abc')}/>
                )}
              </LocaleProvider>
            </FormItem>
          </Col>
          <Col span={12} >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={'结佣时间'}>
              <LocaleProvider locale={zh_CN}> 
                {
                  getFieldDecorator('commissionTime', {
                  initialValue: [],
                })(
                  <RangePicker   format="YYYY-MM-DD"  getPopupContainer={() => document.getElementById('abc')}/>
                )}
              </LocaleProvider>
            </FormItem>
          </Col>
        </Row>
        <Row className = "uploadF">
          <Col span={8}></Col>
          <Col span={16} style = {{textAlign: 'right',marginBottom:'30px'}}>
              <Button type="primary" style={{ marginRight: 10 }}  htmlType="submit">搜索</Button>
              <Button  style={{ marginRight: 10 }} onClick={this.resertAll.bind(this)}>重置</Button>
              <Upload
                name="file"
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                // fileList={fileList}
                onChange={fileUnClose}
                // action = 'http://gifttest.lybrc.com.cn:8989/goufang_main/a/park/importParkLengthAndWidth'
                // multiple
                beforeUpload={(file) => {
                  let name = file.name.slice(file.name.lastIndexOf('.'))
                  if (name !== '.xlsx' && name !== '.xls') {
                    message.warn(`${file.name}格式错误`)
                    this.state.isOk = false
                    return false
                  }
                  this.state.isOk = true
                  return false
                }}
                // onRemove={this.fileRemove}
              >
                <Button type="primary" style={{ marginRight: 10 }}  >导入未结列表</Button>
              </Upload>
              <Upload
                name="file"
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                // fileList={fileList}
                onChange={fileClose}
                // action = 'http://gifttest.lybrc.com.cn:8989/goufang_main/a/park/importParkLengthAndWidth'
                // multiple
                beforeUpload={(file) => {
                  let name = file.name.slice(file.name.lastIndexOf('.'))
                  if (name !== '.xlsx' && name !== '.xls') {
                    message.warn(`${file.name}格式错误`)
                    this.state.isOk = false
                    return false
                  }
                  this.state.isOk = true
                  return false
                }}
                // showUploadList = {false}
                // onRemove={true}
              >
                <Button type="primary" style={{ marginRight: 10 }}  >导入已结列表</Button>
              </Upload>
              
              <Button  onClick={this.exportDoc.bind(this)}>导出</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const FilterForm = Form.create()(Filter)
export default connect(({ commission }) => ({ commission }))(FilterForm)
