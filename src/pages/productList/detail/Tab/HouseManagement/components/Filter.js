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
  HouseManagement,
  filterDetail
}) => {
  let StructureArr = []
  const StructureList= HouseManagement.houseTypeStructureList.map(v => {
    StructureArr.push(v.shi + '室'+v.ting+'厅' +v.wei + '卫')
  })
  const houseTypeStructureList = Array.from(new Set(StructureArr))
  
  // console.log(houseTypeStructureList)
  // console.log(HouseManagement.houseTypeNameList)
  return (
    <div>
      <Form>
        <Row gutter={24}>
        <Col span={6} id="houseTypeId">
            <FormItem label={'户型名称'} {...formItemLayout}>
              {
                getFieldDecorator('houseTypeId', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" 
                  getPopupContainer={() => document.getElementById('houseTypeId')}
                >
                  <Option value={''} >全部</Option>
                  {
                    HouseManagement.houseTypeNameList.map((v,i) => (
                    <Option title={v.houseTypeName} key={v.houseTypeId} value={v.houseTypeId}>
                      {v.houseTypeName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} id="houseStructure">
            <FormItem label={'户型结构'} {...formItemLayout}>
              {
                getFieldDecorator('houseStructure', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('houseStructure')}>
                  <Option  value={''} >全部</Option>
                  {
                    houseTypeStructureList.map((v, i) => (
                    <Option title={v} key={i+v} value={v}>
                      {v}
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
