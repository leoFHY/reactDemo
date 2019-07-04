import React from 'react';
import { Modal,  Form, Input,  Select, Row } from 'antd';
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
    interactive,
    name,
    listDat
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
            <FormItem label={'排序'} {...formItemLayout}>
              {
                getFieldDecorator('rank', {
                  rules: [{
                    required: true,
                    message: '请输入排序',
                  }],
                  initialValue: listDat.rank || '',
                })( < Input placeholder = "请输入"  / > )
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem label={'商品'} {...formItemLayout}>
              {
                getFieldDecorator('bfProjectId', {
                rules: [{
                  required: true,
                  message: '请输入商品',
                }],
                initialValue: listDat.bfProjectId || '',
              })(
                <Select showSearch optionFilterProp="title">
                  {
                     interactive.updateGoodsList.map((v, i) => (
                      <Option title={v.bfProjectName} value={v.bfProjectId} key={v.bfProjectId}>
                        {v.bfProjectName}
                      </Option>
                     ))
                  }
                </Select>
              )}
            </FormItem>
          </Row>
          <Row>
            <FormItem label={'楼盘推荐语'} {...formItemLayout}>
              {
                getFieldDecorator('word', {
                rules: [{
                  required: true,
                  max: 40,
                  message: '输入最多40个字符，且必填',
                }],
                initialValue: listDat.word || '',
              })(
                <Input.TextArea rows={4}  />
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