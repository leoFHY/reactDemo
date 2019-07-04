import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Button, Form, Table, Modal, Select, Row, Col, Icon,message,Avatar,List,Skeleton ,Radio,Upload } from 'antd';
import ShowInfo from './components/ShowInfo'
import styles from './index.less'
import { deepCopy } from 'utils/copy'
const Option = Select.Option
const RadioGroup = Radio.Group
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18},
};
@connect(({ filterDetail, loading, bucket ,app}) => ({ filterDetail, loading, bucket ,app}))
class Info extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      bgColor: 0,
      previewVisible:false,
      value1:'',
      checked:false,
      iconStatus:'none',
      houseTypeId:''
    }
  }

  render() {
    const { dispatch, filterDetail,app } = this.props
    const { isCheckedList,bfProjectId, buildinglist , houseDetilList, detailShow, status,houseTypeId } = filterDetail
    const { getFieldDecorator, validateFieldsAndScroll, resetFields } = this.props.form
    const { user } = app
    const { loginName } = user
    const handelSave = () => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      if (isCheckedList.length){
        this.props.dispatch({
          type: "filterDetail/getHouseType",
          payload: {
            bfProjectId,
          },
          success: () => {
            this.setState({
              visible: true
            })
          }
        })
      } else {
        message.warning('请选择一个房号')
      }
      
       
    }
   const handelClick = (id,i) => {
      this.props.dispatch({
        type: 'filterDetail/clearColumns',
        payload: {},
      })
      this.props.dispatch({
        type: 'filterDetail/getHouseListByBuildingId',
        payload: {
          data: {
            bfProjectId,
            buildingId: id,
          },
        }
      })
      this.setState({
        bgColor : i
      })

   }

   const handleOk = (cbFn,rtFn) => {
     
       cbFn((err, values) => {
        //  console.log(values)
         if (!err) {
           let list = []
           isCheckedList.forEach(v=>{
             list.push(v.id)
           })
           values.houseIds = list
           values.bfProjectId = bfProjectId
           values.houseTypeId = this.state.houseTypeId
           values.loginName = loginName
           dispatch({
             type: 'filterDetail/setType',
             payload: {
               data: values,
             },
             success: () => {
               this.setState({
                 visible: false
               })
               rtFn && rtFn();
               dispatch({
                 type: 'filterDetail/getHouseListByBuildingId',
                 payload: {
                   data: {
                     bfProjectId,
                     buildingId: buildinglist[`${this.state.bgColor}`].buildingId,
                   },
                 },
               })
              
             }
           });
         }
       });
   }
   const handleCancel = rtFn => {
      rtFn && rtFn();
      this.setState({
        visible: false
      })
   }

   const previewCancel = () => {
    this.setState({
      previewVisible:false
    })
  }
   const data= filterDetail.houseTypeList
  //  console.log(data)
  const onChange1 = (e) => {
    // console.log('radio1 checked', e.target.value);
    this.setState({
      value1: e.target.value,
    });
  }
  const checked = (e) => {
    // console.log(e)
  }
  const radioClick = (e) =>　{
    // console.log(houseTypeId)
    //绑定index属性便于判断
    let index = e.target.index
    //将所有checked属性清空，所有不选中
    data.map(v => {
      if(v.checked){
        v.checked = null
      }
    })
    //点击添加check属性
    if(e.target.value === data[index].houseTypeId ){
      data[index].checked = true
      this.props.dispatch({
        type:'filterDetail/savehouseTypeList',
        payload:{
          data:data
        }
      })
      //保存选中的houseTypeId，用于确定按钮请求
      this.setState({
        houseTypeId:data[index].houseTypeId
      })
      // console.log(data[index].houseTypeId)
      
      
    }
  }
  const iconStyle = {fontSize:'20px',display:this.state.iconStatus}
    return (
      <Page>
         <div className = { styles.box }>
           所属楼栋：
           {
             filterDetail.buildinglist.map( (v,i) =>
              < span style = {
                {
                  backgroundColor: this.state.bgColor === i ? '#40a9ff' : '#fff',
                  color: this.state.bgColor === i ? '#fff' : 'rgba(153, 153, 153, 0.847058823529412)'
                }
              }
              key = {
                v.buildingId
              }
              onClick = {
                () => {
                  handelClick(v.buildingId, i)
                }
              } > {
                v.buildingName
              } </span>
            )
           }
         </div>
         {
           detailShow ? <ShowInfo list = {houseDetilList} dispatch = {this.props.dispatch}/> : null
         }
         
         <Button type="primary" onClick={() => handelSave()} style={{marginBottom: '20px'}}>设定户型</Button>
         <Table
            className="nowrap"
            bordered
            style={{ backgroundColor: '#fff' }}
            dataSource={this.props.filterDetail.houseList}
            columns={this.props.filterDetail.columns}
            pagination={false}
            rowKey={(record,i) => i}
            scroll={{ x: true }}
            style= {{width: '80%'}}
            // loading={this.props.loading}
          />
          <Modal title = "设定户型"
            visible={this.state.visible}
            onOk={() => handleOk(validateFieldsAndScroll,resetFields)}
            onCancel={() => handleCancel(resetFields)}
            okText = "确认"
            cancelText = "取消"
            maskClosable = {
              false
            }
            className = "houseInfo"
          >
            
            <Form>  
            <List
              itemLayout="horizontal"
              dataSource={data}
              bordered="true"
              size="small"
              
              // grid={{ gutter: 5, column: 1 }}
              // 
              renderItem={
                (item,i)=> { 
                  // console.log(item)
                  
            return(
              <List.Item actions={[
              
                <Radio  
                  value={item.houseTypeId} 
                 
                  checked={item.checked}
                  onChange = {radioClick}
                  index = {i} 
                >
                </Radio>
                
              ]}
              // onClick={radioClick}
              style={{position:'relative'}}
              >
                
              <List.Item.Meta
                style={{width:'80px'}}
                avatar={
                  <Upload
                    action={item.houseTypePic}
                    listType="picture-card"
                    fileList={
                    [{
                      uid: item.houseTypeId,
                      status:'done',
                      url: item.houseTypePic,
                    }]
                  }
                  onPreview = {
                    (file) => {
                      
                      this.setState({
                        previewImage: file.url || file.thumbUrl,
                        previewVisible: true,
                      })
                    }
                  }
                  showUploadList = {
                  {showRemoveIcon: false}
                  }
                >
                </Upload>
                }
                description={item.houseTypeName}
                />
            
              </List.Item>
              )}}
            />
          

            {/* <Form>
              <Row gutter={24}>
              
                <Col span={18} id="cityName">
                  <FormItem label={'设定户型'} {...formItemLayout}>
                    {
                      getFieldDecorator('houseTypeId', {
                      initialValue: '',
                    })(
                      
                        data.map(v => {
                          <Radio  
                          value={item.houseTypeName} 
                          // checked={ item.houseTypeName === "A户型"  ? true : false } 
                          
                        >
                        </Radio> 
                        })
                        
                      }
                    )}
                  </FormItem>
                </Col>
              </Row> 
            </Form> */}
            {/* <Form>
              <Row gutter={24}>
              
                <Col span={18} id="cityName">
                  <FormItem label={'设定户型'} {...formItemLayout}>
                    {
                      getFieldDecorator('houseTypeId', {
                      initialValue: '',
                    })(
                      <Select getPopupContainer={() => document.getElementById('cityName')} placeholder = "请选择">
                        {
                          filterDetail.houseTypeList.map((v, i) => (
                          <Option value={v.houseTypeId} key={v.houseTypeId}>
                            {v.houseTypeName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row> 
            </Form> */}

            </Form> 
          </Modal>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={previewCancel} maskClosable = {false}>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
      </Page>
    )
  }
}
const HouseInfo = Form.create()(Info);
HouseInfo.propTypes = {
  filterDetail: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default HouseInfo
