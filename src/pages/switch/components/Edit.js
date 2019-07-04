import React from 'react';
import { Modal, Form, Input, } from 'antd';
import PropTypes from 'prop-types'
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 5},
  wrapperCol: { span: 16 },
};

const EditA = ({
    form: {
      getFieldDecorator,
      validateFieldsAndScroll,
      resetFields
    },
    visible,
    handleOk,
    handleCancel,
    status,
    name,
  }) => {
  return(
    <div>
      < Modal title = {name}
          visible={visible}
          onOk={() =>handleOk(validateFieldsAndScroll,resetFields)} 
          onCancel={() => handleCancel(resetFields)}
          okText = "确认"
          cancelText = "取消"
          maskClosable = {
            false
          }
      >
        <Form>
            <FormItem label={'编辑开关状态'} {...formItemLayout}>
              {
                getFieldDecorator('switchStatus', {
                  initialValue: status || '',
                })( < Input placeholder = "请输入状态" / > )
              }
            </FormItem>
        </Form> 
      </Modal>
    </div>
  )
}

const Edit = Form.create()(EditA);
Edit.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
  filter: PropTypes.object,
}
export default Edit