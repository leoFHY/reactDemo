import React from 'react';
import { Form, Input, Button, Select, Row, Col ,DatePicker,LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import PropTypes from 'prop-types'
const Option = Select.Option
const FormItem = Form.Item;
const { RangePicker } = DatePicker
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
  diversionReport
}) => {
  return (
    <div>
      <Form>
        <Row gutter={24}>
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
