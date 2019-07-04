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
    channel,
    name,
    channelName
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
            <FormItem label={'渠道名称'} {...formItemLayout}>
              {
                getFieldDecorator('channelName', {
                  rules: [{
                    required: true,
                    message: '请输入渠道名称',
                  }],
                  initialValue: channelName || '',
                })( < Input placeholder = "请输入渠道名称" / > )
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