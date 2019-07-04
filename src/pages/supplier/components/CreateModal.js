import React from 'react';
import { Modal, Button, Form, Input, Icon, Select } from 'antd';
import PropTypes from 'prop-types'
const FormItem = Form.Item;
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 5},
  wrapperCol: { span: 16 },
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
    supplier,
    name,
    supplierName
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
            <FormItem label={'供应商名称'} {...formItemLayout}>
              {
                getFieldDecorator('supplierName', {
                  rules: [{
                    required: true,
                    message: '请输入供应商名称',
                  }],
                  initialValue: supplierName || '',
                })( < Input placeholder = "请输入供应商名称" / > )
              }
            </FormItem>
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