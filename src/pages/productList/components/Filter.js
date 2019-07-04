import React from 'react';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import PropTypes from 'prop-types'
const Option = Select.Option
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const styles = {
  btnStyle: {
    marginLeft: '20px',
  },
};
const FilterForm = ({
  form: { getFieldDecorator, validateFieldsAndScroll, resetFields },
  handleSubmit,
  resetValue,
  filter
}) => {
  return (

    <div>
      <Form>
        <Row gutter={24}>
          <Col span={6} id="cityName">
            <FormItem label={'城市'} {...formItemLayout}>
              {
                getFieldDecorator('cityName', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('cityName')}>
                  <Option value={''} >全部</Option>
                  {
                    filter.cityList.map((v,i) => (
                    <Option title={v.cityName} value={v.cityName} key={i}>
                      {v.cityName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} id="showName">
            <FormItem label={'商品展示名称'} {...formItemLayout}>
              {
                getFieldDecorator('showName', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('showName')}>
                  <Option  value={''} >全部</Option>
                  {
                    filter.showProductList.map(v => (
                    <Option title={v.bfProjectName} key={v.bfProjectId} value={v.bfProjectId}>
                      {v.bfProjectName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} id="status">
            <FormItem label={'商品状态'} {...formItemLayout}>
              {
                getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('status')}>
                  <Option  value={''} >全部</Option>
                  {
                    filter.status.map(v => (
                    <Option title={v.name} key={v.id} value={v.id}>
                      {v.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            
          </Col>
          <Col span={6}>
            <FormItem label={'蓝光在线楼盘ID'} {...formItemLayout}>
              {
                getFieldDecorator('lgProjectId', {})( < Input placeholder = "请输入楼盘ID" / > )
              }
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label={'蓝光在线楼盘名称'} {...formItemLayout}>
              {
                getFieldDecorator('lgProjectName', {})( < Input placeholder = "请输入楼盘名称" / > )
              }
            </FormItem>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'flex-start' }} span={12}>
            <Button
              style={styles.btnStyle}
              type="primary"
              onClick={() => {
                handleSubmit(validateFieldsAndScroll);
              }}
            >
              搜索
            </Button>
            <Button
              style={styles.btnStyle}
              onClick={() => {
                resetValue(resetFields);
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
const Filter = Form.create()(FilterForm);
Filter.propTypes = {
  resetValue: PropTypes.func,
  handleSubmit: PropTypes.func,
  filter: PropTypes.object,
}
export default Filter;
