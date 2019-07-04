import React from 'react';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import PropTypes from 'prop-types'

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const Option = Select.Option;
const styles = {
  btnStyle: {
    marginLeft: '20px',
  },
};
const FilterForm = ({
  form: { getFieldDecorator, validateFieldsAndScroll, resetFields },
  handleSubmit,
  resetValue,
  detailActivity
}) => {
  return (
    <div>
      <Form>
        <Row gutter={24}>
          <Col span={6} id="offerStatus">
            <FormItem label={'活动状态'} {...formItemLayout}>
              {
                getFieldDecorator('offerStatus', {
                initialValue: '',
              })(
                <Select   getPopupContainer={() => document.getElementById('offerStatus')}>
                  <Option  value={''} >全部</Option>
                  {
                    detailActivity.activityStatus.map((v, i) => (
                    <Option  key={v.id} value={v.id}>
                      {v.name}
                   </Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} id="identity">
            <FormItem label={'身份类型'} {...formItemLayout}>
              {
                getFieldDecorator('identity', {
                initialValue: '',
              })(
                <Select  getPopupContainer={() => document.getElementById('identity')}>
                  <Option value={''} >全部</Option>
                  {
                    detailActivity.typeList.map((v, i) => (
                      <Option  key={v.id} value={v.id}>
                          {v.name}
                      </Option>
                    ))
                  }
                </Select>
              )}
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
const filterDetail = Form.create()(FilterForm);
filterDetail.propTypes = {
  resetValue: PropTypes.func,
  handleSubmit: PropTypes.func,
  filterDetail: PropTypes.object,
}
export default filterDetail;
