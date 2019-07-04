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
  filterDetail
}) => {
  
  return (
    <div>
      <Form>
        <Row gutter={24}>
          <Col span={6} id="saleName">
            <FormItem label={'楼栋展示名称'} {...formItemLayout}>
              {
                getFieldDecorator('saleName', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('saleName')}>
                  <Option  value={''} >全部</Option>
                  {
                    filterDetail.showNameList.map((v, i) => (
                    <Option title={v.saleName} key={i} value={v.saleName}>
                      {v.saleName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} id="oaBuildingName">
            <FormItem label={'OA楼栋名称'} {...formItemLayout}>
              {
                getFieldDecorator('oaBuildingName', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('oaBuildingName')}>
                  <Option value={''} >全部</Option>
                  {
                    filterDetail.oaBuildingNameList.map((v,i) => (
                    <Option title={v.name} key={i} value={v.name}>
                      {v.name}
                    </Option>
                  ))}
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
