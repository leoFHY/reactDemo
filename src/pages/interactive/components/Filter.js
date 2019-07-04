import React from 'react';
import { Form, Input, Button, Select, Row, Col ,DatePicker,LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import PropTypes from 'prop-types'
const Option = Select.Option
const FormItem = Form.Item;
const { RangePicker } = DatePicker
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
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
  interactive
}) => {
  return (
    <div>
      <Form>
        <Row gutter={24}>
        <Col span={6} id="bfProjectId"  style={{ textAlign: 'left' }}>
            <FormItem label={'区域'} 
               labelCol={{ span: 6 }}
               wrapperCol= {{ span: 18 }}
            >
              {
                getFieldDecorator('bfProjectId', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('bfProjectId')}>
                  <Option value={''} >全部</Option>
                  {
                    interactive.goodsList.map((v, i) => (
                      <Option title={v.bfProjectName} value={v.bfProjectId} key={v.bfProjectId}>
                        {v.bfProjectName}
                      </Option>
                     ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} id="bfProjectId">
            <FormItem label={'项目名称'} {...formItemLayout}>
              {
                getFieldDecorator('bfProjectId', {
                initialValue: '',
              })(
                <Select showSearch optionFilterProp="title" getPopupContainer={() => document.getElementById('bfProjectId')}>
                  <Option value={''} >全部</Option>
                  {
                    interactive.goodsList.map((v, i) => (
                      <Option title={v.bfProjectName} value={v.bfProjectId} key={v.bfProjectId}>
                        {v.bfProjectName}
                      </Option>
                     ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        <Col span={7}>

            <FormItem label={'日期'} 
              labelCol={{ span: 6 }}
              wrapperCol= {{ span: 18 }}
              id="abc"
            >
              <LocaleProvider locale={zh_CN}> 
                {
                getFieldDecorator('time', {
                  initialValue: [],
                })(<RangePicker  format="YYYY-MM-DD"  getPopupContainer={() => document.getElementById('abc')}/>  )
                }
              </LocaleProvider>
            </FormItem>
          </Col>
          <Col style={{ marginTop:'5px', textAlign: 'left' }} span={5}>
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
