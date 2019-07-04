import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Button, Select, DatePicker, InputNumber, LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { router } from 'utils'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { getId, getName } from 'utils/transformData'

moment.locale('zh-cn')

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

class FormModel extends Component {
  handleReset = () => {
    console.log('重置')
    this.props.form.setFieldsValue(
      {
        name: '',
        dispayId: '',
        couponTypeDefId: '',
        time: '',
        applicant: '',
        applyDate: '',
        batchCount: '',
        excludeNums: '',
        describe: '',
      }
    )
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const model = this.props.couponBatch
        const query = this.props.location.query
        const time = values.time.map((v) => {
          return v.format(model.dateFormat)
        })
        const params = {
          name: values.name || '',
          dispayId: model.cardFaceList && (getId(values.dispayId, model.cardFaceList) || values.dispayId),
          couponTypeDefId: model.couponTemList && (getId(values.couponTypeDefId, model.couponTemList) || values.couponTypeDefId),
          beginDate: time[0] && time[0],
          endDate: time[1] && time[1],
          applicant: values.applicant,
          applyDate: values.applyDate.format(model.dateFormat),
          batchCount: values.batchCount,
          excludeNums: values.excludeNums && values.excludeNums.replace(/\s+/g, ''),
          describe: values.describe,
          pageNum: '1',
          pageSize: model.pageSize,
        }
        if (query.type === 'edit') {
          params.id = query.id
        }
        this.props.dispatch({
          type: 'couponBatch/save',
          payload: params,
        })
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const model = this.props.couponBatch
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
    const detailBatch = model.detailBatch
    const editorForm = [
      <FormItem
        {...formItemLayout}
        label="批次号"
        hasFeedback
        key="id"
      >
        {getFieldDecorator('id', {
          initialValue: '',
        })(
          <span> {detailBatch.id}</span>
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="状态"
        hasFeedback
        key="state"
      >
        {getFieldDecorator('state', {
          initialValue: '',
        })(
          <span>{detailBatch.state && getName(detailBatch.state, model.stateList)}</span>
        )}
      </FormItem>,
    ]
    const FormADd = [
      <FormItem
        {...formItemLayout}
        label="批次名称"
        hasFeedback
        key="name"
      >
        {getFieldDecorator('name', {
          initialValue: detailBatch.name,
          rules: [{
            required: true, message: '批次名称不能为空',
          }],
        })(
          <Input />
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="卡券外观"
        key="dispayId"
      >
        {getFieldDecorator('dispayId', {
          initialValue: detailBatch.dispayName,
          rules: [{
            required: true, message: '卡券外观为必须',
          }],
        })(
          <Select style={{ width: '150px' }}>
            {this.props.couponBatch.cardFaceList.map((v) => {
              return <Option key={v.id} >{v.name}</Option>
            })}
          </Select>
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="优惠券模版"
        key="couponTypeDefId"
      >
        {getFieldDecorator('couponTypeDefId', {
          // 显示初始值，如果不手动选择，提交的时候取到的name而非id
          initialValue: detailBatch.defName,
          rules: [{
            required: true, message: '优惠券模版为必选项',
          }],
        })(
          <Select style={{ width: '150px' }}>
            {this.props.couponBatch.couponTemList.map((v) => {
              return <Option key={v.id} >{v.name}</Option>
            })}
          </Select>
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="有效期"
        key="time"
      >
        <LocaleProvider locale={zh_CN}> 

        {getFieldDecorator('time', {
          initialValue: detailBatch.expiryDate,
          rules: [{
            required: true, message: '有效期为必选',
          }],
        })(
          <RangePicker showTime format={model.dateFormat} />
        )}
        </LocaleProvider> 
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="申请人"
        hasFeedback
        key="applicant"
      >
        {getFieldDecorator('applicant', {
          initialValue: detailBatch.applicant,
          rules: [{
            required: true, message: '申请人姓名不能为空',
          }],
        })(
          <Input />
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="申请时间"
        key="applyDate"
      >
        <LocaleProvider locale={zh_CN}> 
        {getFieldDecorator('applyDate', {
          initialValue: detailBatch.applyDate,
          rules: [{
            required: true, message: '申请时间为必选',
          }],
        })(
          <DatePicker showTime format={model.dateFormat} />
        )}
        </LocaleProvider> 
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="制作数量（张）"
        hasFeedback
        key="batchCount"
      >
        {getFieldDecorator('batchCount', {
          initialValue: detailBatch.batchCount,
          rules: [
            {
              required: true,
              message: '该值不能为空!',
            },
          ],
        })(
          <InputNumber min={1} />
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="开始券号"
        hasFeedback
        key="couponType"
      >
        {getFieldDecorator('couponType', {
          initialValue: '',
        })(
          <span>{this.props.couponBatch.initialNum}</span>
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="号段内排除号码"
        hasFeedback
        key="excludeNums"
      >
        {getFieldDecorator('excludeNums', {
          initialValue: detailBatch.excludeNums,
        })(
          <TextArea placeholder="多个之间以英文逗号相隔" />
        )}
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="制卡说明"
        hasFeedback
        key="describe"
      >
        {getFieldDecorator('describe', {
          initialValue: detailBatch.describe,
        })(
          <TextArea />
        )}
      </FormItem>,
    ]
    if (this.props.location.query.type === 'edit') {
      FormADd.unshift(editorForm)
    }
    const New = [
      <FormItem key="New">
        <Button style={{ marginLeft: '40%' }}
          onClick={() => {
            router.push({
              pathname: '/coupons/couponBatch',
            })
          }}
        >
          返回
        </Button>
        {this.props.location.query.type === 'add' ? <Button onClick={this.handleReset} style={{ marginLeft: '30px' }}>
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
      </Form>
    )
  }
}


const CouponBatchForm = Form.create()(FormModel)
export default connect(({ couponBatch }) => ({ couponBatch }))(CouponBatchForm)
