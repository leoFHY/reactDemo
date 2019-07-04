import React, { PureComponent } from 'react'
import {
    Table, Input, Button, Popconfirm, Form, Select, LocaleProvider, DatePicker
  } from 'antd';
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { deepCopy } from 'utils/copy'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment'
import 'moment/locale/zh-cn';
import './list.less'
  
  const FormItem = Form.Item
  const RangePicker = DatePicker.RangePicker;
  const { Option, OptGroup } = Select
  const EditableContext = React.createContext()
  
  const EditableRow = ({ form, index, ...props }) =>{ 
    // console.log(111111111111111111)
    return (
   
    <EditableContext.Provider value={form} >
      <tr {...props} />
    </EditableContext.Provider>
  
  )};
  
  const EditableFormRow = Form.create()(EditableRow);
  // @connect(({  Addhelanpais,loading, app ,bucket}) => ({  Addhelanpais,loading, app ,bucket}))
  class EditableCell extends React.Component {
    state = {
      editing: false,
      dateVisible:true
    }
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          this.input.focus();
        }
      });
    }
  
    save = (e) => {
      console.log(e)
      const { record, handleSave} = this.props;
      console.log(record)
      this.form.validateFields((error, values) => {
        console.log(values)
        if (error && error[e.currentTarget.id]) {

          return;
        }
        this.toggleEdit();
        console.log({ ...record, ...values })
        // return
        handleSave({ ...record, ...values });
      });
    }
    selectSave = (e) => {
      console.log(e)
      // e[0].split(',')
      const { record, handleSave } = this.props;
      console.log(record)
      this.form.validateFields((error, values) => {
        
        let string =  ''
        if(values.identityTypes.length) string = values.identityTypes.join(',')
        values.identityTypes = string
        console.log(values)
        if (error && error[e.currentTarget.id]) {
          return;
        }
        this.toggleEdit();
        console.log({ ...record, ...values })
        handleSave({ ...record, ...values });
      });
    }
    datesave = () => {

    }
    render() {
      const { dateVisible,editing } = this.state;
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        dateOk,
        dateChange,
        selectable,
        Addhelanpais,
        dispatch,
        ...restProps
      } = this.props;
        // console.log(Addhelanpais.downHelanpaisList)
        // console.log([...restProps])
        
        const datefocus = () => {
          this.setState({
            dateVisible:true
          })
        }
      
        return (
          <td {...restProps}>
            {(editable || selectable) ? (
              <EditableContext.Consumer>
                {(form) => {
                  this.form = form;
                  if(editable){
                    // console.log(editable,selectable)
                    // console.log(title)
                    // console.log('input框')
                  return (
                    editing ? (
                      <FormItem style={{ margin: 0 }}>
                        {form.getFieldDecorator(dataIndex, {
                          rules: [{
                            required: true,
                            message: `${title} is required.`,
                          }],
                          initialValue:
                            title==='活动时间段' || title==='身份类型'?

                              title==='活动时间段' ?
                                record.startDate === 'undefined' ?  '-- 至 --' : (record.startDate + ' 至 ' +record.endDate)
                                  
                              :
                              
                              title==='身份类型' && record.identityTypes  ?
                                  record.identityTypes.split(',') 
                              : '1'

                            :
                              record[dataIndex],
                        })(
                          
                          // if(title==='活动时间段'){

                          // }
                          
                          // title==='身份类型' || title === '活动时间段'
                          // 
                         
                            title === '身份类型' 
                            ?
                              <Select
                                ref={node => (this.input = node)}
                                onPressEnter={this.selectSave}
                                onBlur={this.selectSave}
                                style={{width:'100%'}}
                                mode="tags"
                                // onChange={handleChange}
                              >
                                <Option value='1'>
                                蓝光员工
                                </Option>
                                <Option value='2'>
                                业主／租户／商户
                                </Option>
                                <Option value='3' >
                                供应商
                                </Option>
                                <Option value='5' >
                                手牵手
                                </Option>
                              </Select> 
                            :
                              title === '活动时间段'
                              ?
                              <div>
                                <LocaleProvider locale={zh_CN}>
                                  <RangePicker 
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"  
                                    ref={node => (this.input = node)}
                                    // onPressEnter={this.save}
                                    // onBlur={this.save}
                                    // open = {dateVisible}
                                    onChange = { dateChange }
                                    onOk={() => dateOk(record)}
                                    // focus = {datefocus}
                                  />
                                </LocaleProvider>
                              </div>
                              :
                              <Input
                                ref={node => (this.input = node)}
                                onPressEnter={this.save}
                                onBlur={this.save}
                                // defaultValue = '1'
                              />
                        )}
                      </FormItem>
                    ) : (
                      <div
                        className="editable-cell-value-wrap"
                        style={{ paddingRight: 24 }}
                        onClick={this.toggleEdit}
                      >
                        {restProps.children}
                      </div>
                    )
                  )}
                 
            
                  }
                }
              </EditableContext.Consumer>
            ) : restProps.children}
            
          </td>
        );
      }
  }
  
  class EditableTable extends React.Component {
    constructor(props) {
      super(props);
      
  
      this.state = {
        display2:'block',
        display: 'none',
        dataSource: [],
        count: 2,
        
      };
    }
    
    render() {
      const { columns, Addhelanpais, dispatch ,pagination,onChange} = this.props
     
      const { downHelanpaisList } = Addhelanpais
      
      const dateChange = (date,dateString) => {
        
        this.setState({
          startDate: dateString[0],
          endDate:dateString[1]
        })
        
      }
      const dateOk = (values) => {
        
        let list = deepCopy(values)
        list.startDate = this.state.startDate
        list.endDate = this.state.endDate
        // console.log(list)
        let arr = deepCopy(Addhelanpais.downHelanpaisList)
        arr.map(v => {
          if(v.bfHouseDiscountId === list.bfHouseDiscountId || (v.houseId === list.houseId && v.bfProjectId === list.bfProjectId)){
            v.startDate = list.startDate
            v.endDate = list.endDate
          }
        })
        
        dispatch({
          type: 'Addhelanpais/savePageList',
          payload:arr
          
        })
      }
      const handleSave = (row) => {
       
        row.intervalDownPrice = row.intervalDownPrice - 0 || null
        row.intervalSecond = row.intervalSecond - 0 || null 
        row.minAmount =  row.minAmount - 0 || null
        row.money = row.money - 0 || null
        row.startAmount = row.startAmount - 0 || null

        const { dataSource } = this.props
       
        const newData = [...downHelanpaisList];
        
        const index = newData.findIndex(item => row.bfHouseDiscountId ? row.bfHouseDiscountId === item.bfHouseDiscountId : row.houseId === item.houseId);
        const item = newData[index];
        
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        
        dispatch({
          type:'Addhelanpais/savePageList',
          payload: newData
          
        })
        this.setState({ dataSource: newData });
        
      }
      
      const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
      };
      const columnsAdd = columns.map((col) => {
        if (!col.editable ) {
          return col;
        }
        return {
          ...col,
          onCell: record => { 
            
            return {
            record,
            selectable: col.selectable,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: handleSave,
            dateOk:dateOk,
            dateChange:dateChange
            
          }},
        };
      })
     
      return (
        <div>
          <Table
            
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={downHelanpaisList}
            rowKey={(record,i) => record.houseId} 
            scroll={{ x: 1700 }} 
            columns={columnsAdd}
            dispatch={ dispatch}
            Addhelanpais={Addhelanpais}
            // pagination={pagination}
            onChange = {onChange}

          />
        </div>
      );
    }
  }
  
  EditableTable.propTypes = {
    visible: PropTypes.bool,
    handleOk: PropTypes.func,
    handleCancel: PropTypes.func,
    // searchList: PropTypes.array,
  }
  export default EditableTable
  