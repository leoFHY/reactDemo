import React from 'react';
import { Form, Input, Button, Select, Row, Col ,DatePicker,LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment'
import 'moment/locale/zh-cn';
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
  Netherlands,
}) => {
  const arr = ['1','2','3']
  const { areaList, productShowcaseList, bfProjectStatus, activityStatus } = Netherlands
  // console.log(areaList)
  return (
    <div>
      <Form>
        <Row gutter={24}>
          <Col span={6} id="area">
            <FormItem label={'区域'} 
            labelCol={{ span: 8 }}
            wrapperCol= {{ span: 16 }}
              
              // validateStatus={houseNameError ? 'error' : ''}
            >
              {
                getFieldDecorator('areaId', {
                // initialValue: ProjectInformationList.lgProvinceName || '',
                rules: [{
                  
                  message: '请选择区域',
                }],
              })(
                
                <Select showSearch optionFilterProp="title" 
                  getPopupContainer={() => document.getElementById('area')}
                  // style={{width:'100%',marginLeft:'50px'}}
                  // onChange={provinceChange}
                >
                <Option value={''} >全部</Option>
                  {
                  areaList.map((v,i) => (
                  <Option title={v.areaName} key={v.areaId} value={v.areaId}>
                    {v.areaName}
                  </Option>
                ))}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} id="bfProject">
            <FormItem label={'项目名称'} 
            labelCol={{ span: 7 }}
            wrapperCol= {{ span: 15}}
              
              // validateStatus={houseNameError ? 'error' : ''}
            >
              {
                getFieldDecorator('bfProjectId', {
                // initialValue: ProjectInformationList.lgProvinceName || '',
                rules: [{
              
                  message: '请选择省份',
                }],
              })(
                
                <Select showSearch optionFilterProp="title" 
                  getPopupContainer={() => document.getElementById('bfProject')}
                  // style={{width:'100%',marginLeft:'50px'}}
                  // onChange={provinceChange}
                >
                <Option value={''} >全部</Option>
                  {
                  productShowcaseList.map((v,i) => (
                  <Option title={v.bfProjectName} key={v.bfProjectId} value={v.bfProjectId}>
                    {v.bfProjectName}
                  </Option>
                ))}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7}  id="abc">
            {/* <FormItem label={'活动时间段'} 
              labelCol={{ span: 7 }}
              wrapperCol= {{ span: 17}}
             
            >
              <LocaleProvider locale={zh_CN}> 
                {
                getFieldDecorator('time', {
                  initialValue: [],
                })(<RangePicker  format="YYYY-MM-DD"  getPopupContainer={() => document.getElementById('abc')}/>  )
                }
              </LocaleProvider>
            </FormItem> */}
            <FormItem 
              label={'活动时间段'}  
              labelCol={{ span: 7 }}
              wrapperCol= {{ span: 17}}
            >
                <LocaleProvider locale={zh_CN}> 
                 {
                  getFieldDecorator('time', {
                    // rules: [{
                      // required: true,
                      // message: '请输入活动时间段',
                    // }],
                    initialValue: [],
                  })(<RangePicker showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss"  getPopupContainer={() => document.getElementById('abc')}/>  )
                  }
                </LocaleProvider>
            </FormItem>
          </Col>
          
        </Row>
        <Row>
        <Col span={6}  id="status">
            <FormItem label={'楼盘状态'} 
            labelCol={{ span: 7 }}
            wrapperCol= {{ span: 15 }}
             
              // validateStatus={houseNameError ? 'error' : ''}
            >
              {
                getFieldDecorator('bfProjectStatus', {
                // initialValue: ProjectInformationList.lgProvinceName || '',
                rules: [{
                 
                 
                }],
              })(
                
                <Select showSearch optionFilterProp="title" 
                  getPopupContainer={() => document.getElementById('status')}
                  // style={{width:'100%',marginLeft:'50px'}}
                  // onChange={provinceChange}
                >
                <Option value={''} >全部</Option>
                  {
                  bfProjectStatus.map((v,i) => (
                  <Option title={v.name} key={v.status} value={v.status}>
                    {v.name}
                  </Option>
                ))}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}  id="activity">
            <FormItem label={'活动状态'} 
            labelCol={{ span: 7 }}
            wrapperCol= {{ span: 14 }}
             
              // validateStatus={houseNameError ? 'error' : ''}
            >
              {
                getFieldDecorator('activityStatus', {
                // initialValue: ProjectInformationList.lgProvinceName || '',
                rules: [{
  
                }],
              })(
                
                <Select showSearch optionFilterProp="title" 
                  getPopupContainer={() => document.getElementById('activity')}
                  // style={{width:'100%'}}
                  // onChange={provinceChange}
                >
                <Option value={''} >全部</Option>
                  {
                  activityStatus.map((v,i) => (
                  <Option title={v.name} key={v.status} value={v.status}>
                    {v.name}
                  </Option>
                ))}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'flex-start',paddingTop:'5px' }} span={8}>
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
