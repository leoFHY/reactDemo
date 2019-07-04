import React from 'react';
import { Modal, Button, Form, Input, Icon, Select,Row } from 'antd';
import PropTypes from 'prop-types'
const FormItem = Form.Item;
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8},
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
    name,
    filter,
    detailList,
  }) => {
    // const handleChange = (values) =>{
    //   console.log(values)
    //   // fn = (value) =>{
    //   //   console.log(value)
    //   // }
    // }
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
          <FormItem label={'商品名称'} {...formItemLayout}>
            {
              getFieldDecorator('name', {
                initialValue: detailList.bfProjectName || '',
                rules: [{
                  required: true,
                  message: '请填写商品名称',
                }],
              })( < Input placeholder = "请输入商品名称" / > )
            }
          </FormItem>
          <FormItem label={'蓝光在线楼盘'} {...formItemLayout}>
            {
              getFieldDecorator('lgProjectId', {
              initialValue:detailList.lgProjectName || '',
              rules: [{
                  required: true,
                  message: '请填写楼盘',
                }],
            })(
              <Select 
                showSearch 
                optionFilterProp="title" 
                disabled={name==="编辑商品"}
                // onChange={projectSearch}
              >
                <Option value={''} >全部</Option>
                {
                  filter.lgBuildingList.map(v => (
                  <Option title={v.lgProjectName} key={v.lgProjectId} value={v.lgProjectId}>
                    {v.lgProjectName}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label={'蓝裔楼盘'} {...formItemLayout}>
          {
            getFieldDecorator('lyProjectId', {
            initialValue: detailList.lyProjectName || '',
            rules: [{
                required: true,
                message: '请填写楼盘',
              }],
          })(
            <Select showSearch optionFilterProp="title" 
            >
              <Option value={''} >全部</Option>
              {
                filter.lyProjectList.map(v => (
                <Option title={v.lyProjectName} key={v.lyProjectId} value={v.lyProjectId}>
                  {v.lyProjectName}
                </Option>
              ))}
            </Select>
            )}
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