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
  channel
}) => {
  return (
    <div>
      <Form>
        <Row gutter={24}>
          <Col span={6} id="channelId">
            <FormItem label={'渠道名称'} {...formItemLayout}>
              {
                getFieldDecorator('channelId', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('channelId')}>
                  <Option value={''} >全部</Option>
                  {
                    channel.pullList.map((v, i) => (
                      <Option title={v.channelName} value={v.channelId} key={v.channelId}>
                        {v.channelName}
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
const Filter = Form.create()(FilterForm);
Filter.propTypes = {
  resetValue: PropTypes.func,
  handleSubmit: PropTypes.func,
  filter: PropTypes.object,
}
export default Filter;
