import React from 'react';
import { Modal,  Form, Input,  Select, Row, Radio } from 'antd';
import PropTypes from 'prop-types'
const FormItem = Form.Item;
const Option = Select.Option
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 5},
  wrapperCol: { span: 14 },
};

const CreateModal = ({
    form: {
      getFieldDecorator,
      validateFieldsAndScroll,
      resetFields
    },
    visible,
    handleOk,
    handleCancel,
    name,
    radioChange,
    radioValue,
    inputChange,
    inputValue,
    payType,
    record,
  }) => {
    
  return(
    <div>
      < Modal title = {name}
          visible={visible}
          onOk={() =>handleOk(validateFieldsAndScroll,resetFields)} 
          onCancel={() => handleCancel(resetFields)}
          okText = "确认"
          cancelText = "取消"
          maskClosable = {false}
      >
          
        <Form>
          <Row>
            <FormItem label={'优惠名称'} {...formItemLayout}>
              {
                getFieldDecorator('discountName', {
                  rules: [{
                    required: true,
                    message: '请输入优惠名称',
                  }],
                  initialValue:  record.discountName || '',
                })( < Input placeholder = "请输入"  / > )
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem label={'支付方式'} {...formItemLayout}>
              {
                getFieldDecorator('payType', {
                rules: [{
                  required: true,
                  message: '请输入支付方式',
                }],
                initialValue: record.payType || '',
              })(
                <Select showSearch optionFilterProp="title" placeholder = "请选择"> 
                 
                  {
                     payType.map((v, i) => (
                      <Option value={v.id} key={v.id}>
                        {v.name}
                      </Option>
                     ))
                  }
                </Select>
              )}
            </FormItem>
          </Row>
          <Row>
            <FormItem label={'优惠方式'} {...formItemLayout}>
              {
                getFieldDecorator('discountType', {
                rules: [{
                  required: true,
                  message: '请输入优惠方式',
                }],
                initialValue: record.discountType || '',
              })(
                   <RadioGroup onChange={radioChange} >
                    <Radio  value={'1'}>减免<Input style={{ width: 200, marginLeft: 24 }} value= {radioValue === '1' ? inputValue : ''} onChange= {inputChange} disabled = { radioValue === '1' ? false : true }/> 元 </Radio>
                    <Radio  value={'2'}>折扣<Input style={{ width: 200, marginLeft: 24 }} value= {radioValue === '2' ? inputValue : ''} onChange= {inputChange} disabled = { radioValue === '2' ? false : true } /> % </Radio>
                    
                  </RadioGroup>
              )}
            </FormItem>
          </Row>
        </Form> 
      </Modal>
    </div>
  )
}

const Create = Form.create()(CreateModal);
Create.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
  filter: PropTypes.object,
}
export default Create