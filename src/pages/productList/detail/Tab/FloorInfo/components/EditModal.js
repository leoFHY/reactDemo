import React from 'react';
import { Modal, Button, Form, Input, Icon, Select } from 'antd';
import PropTypes from 'prop-types'
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

const EditModal = ({
    form: {
      getFieldDecorator,
      validateFieldsAndScroll,
      resetFields
    },
    visible,
    handleOk,
    handleCancel,
    showName
  }) => {
  return(
    <div>
      < Modal title = "编辑楼栋信息"
          visible={visible}
          onOk={() =>handleOk(validateFieldsAndScroll,resetFields)} 
          onCancel={() => handleCancel(resetFields)}
          okText = "确认"
          cancelText = "取消"
          maskClosable = {false}
      >
        <Form>
            <FormItem label={'楼栋展示名称'} {...formItemLayout}>
              {
                getFieldDecorator('showName', {
                  initialValue: showName || '',
                })( < Input placeholder = "请输入楼栋展示名称" / > )
              }
            </FormItem>
            
            
        </Form> 
      </Modal>
    </div>
  )
}

const Edit = Form.create()(EditModal);
Edit.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
}
export default Edit