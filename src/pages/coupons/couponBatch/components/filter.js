import { Form, Select, Button, Input, DatePicker, Col, Row, LocaleProvider } from 'antd'
import React from 'react'
import { router } from 'utils'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment'
import 'moment/locale/zh-cn';

const styles = {
  formItemLayout: {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  },
}

const formItemLayout = styles.formItemLayout
const FormItem = Form.Item
const Option = Select.Option
const Filter = ({
  onSearch,
  handleResetModel,
  setState,
  states,
  pageSize,
  dateFormat,
  stateList,
  form: {
    getFieldDecorator,
    setFieldsValue,
    validateFieldsAndScroll,
  },
}) => {
  console.log(states)
  const handleReset = () => {
    console.log('重置')
    setFieldsValue(
      {
        name: '',
        state: '',
      }
    )
    setState({
      startValue: '',
      endValue: '',
    })
    handleResetModel()
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const params = {
          name: values.name || '',
          state: values.state,
          createTimeStart: states.startValue && states.startValue.format(dateFormat),
          createTimeEnd: states.endValue && states.endValue.format(dateFormat),
          pageNum: '1',
          pageSize,
        }
        onSearch(params)
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit} >
      <Row gutter={5}>
        <Col span={6}>
          <FormItem {...formItemLayout} label={'批次'}>
            {getFieldDecorator('name', {
              initialValue: '',
            })(
              <Input placeholder="请输入批次号或名称" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formItemLayout} label={'状态'}>
            {getFieldDecorator('state', {
              initialValue: '',
            })(
              <Select >
                {stateList.map((v) => {
                  return (<Option key={v.id}>{v.name}</Option>)
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formItemLayout} label={'创建时间'}>
            {getFieldDecorator('createTime', {
              // initialValue: null,
            })(
              <div>
                <Col span={15}>
                  <LocaleProvider locale={zh_CN}> 
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD"
                    value={states.startValue}
                    placeholder="开始时间" // 字段createTimeStart
                    onChange={(value) => {
                      // let  startTime = moment(value).format("YYYY-MM-DD")
                      // return
                      setState({
                        startValue: value,
                        endValue:states.endValue
                      })
                    }}
                    style={{ width: 100 }}
                  />
                  </LocaleProvider> 
                </Col>
                <Col span={9}>
                  <LocaleProvider locale={zh_CN}>
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD"
                    value={states.endValue} // 字段createTimeEnd
                    placeholder="结束时间"
                    onChange={(value) => {
                      setState({
                        startValue:states.startValue,
                        endValue: value,
                      })
                    }}
                    style={{ 
                      // marginLeft: 20, 
                      width: 100 }}
                  />
                  </LocaleProvider>
                </Col>
              </div>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <Button size="large" htmlType="submit" type="primary">搜索</Button>
          <Button onClick={handleReset} size="large" style={{ marginLeft: 20 }}>重置</Button>
          <Button
            style={{ marginLeft: 20 }}
            size="large"
            onClick={() => {
              router.push({
                pathname: '/coupons/couponBatch/Form',
                query: {
                  type: 'add',
                },
              })
            }}
          >
            新增
            </Button>
        </Col>
      </Row>
    </Form>
  )
}
const FilterForm = Form.create()(Filter)

export default FilterForm
