import React from 'react'
// import ReactDOM from 'react-dom'
import { Modal, Form, Input, Select, Radio,Upload ,List,message,Icon,Row,Col,Checkbox } from 'antd'
import { multipleImageUploadFan, openFileUpload } from 'utils/ossUploadUtils'
import PropTypes from 'prop-types'
import { deepCopy } from 'utils/copy'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group


const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20 },
}


function handleChange(value) {

}
// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
const CreateModal = ({
    form: {
      getFieldDecorator,
      validateFieldsAndScroll,
      resetFields,
      // getFieldsError,
      // isFieldTouched,
      // getFieldError
    },
    visible,
    name,
    dispatch,
    handleOk,
    handleCancel,
    // HouseManagement,
    filterDetail,
    
  }) => {
    // console.log(listImg)
    // console.log(editList)
    const { modelHouseTypeList,  mainForce,propertyTypeList } = HouseManagement
    // const { dispatch, filterDetail,app } = this.props
    const imgsList = []
    // const listImg = [{
    //   uid:editList.houseTypeId,
    //   url:editList.houseTypePic
    // }]
    // console.log(listImg)
    const data= filterDetail.houseTypeList
  return(
    <div>
      
      <Modal title = "设定户型"
            visible={this.state.visible}
            onOk={() => handleOk(validateFieldsAndScroll,resetFields)}
            onCancel={() => handleCancel(resetFields)}
            okText = "确认"
            cancelText = "取消"
            maskClosable = {
              false
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={data}
              bordered="true"
              size="small"
              // grid={{ gutter: 5, column: 1 }}
              // 
              renderItem={
                (item)=> (
              <List.Item actions={[
                // <RadioGroup 
                // buttonStyle="solid"
                // //  onChange={this.onChange} value={this.state.value}
                // >
                  <Radio  value={item.houseTypeId} name="Radio" ></Radio>
                  
                // </RadioGroup>
              ]}
              style={{textAlign:'center',lineHeight:'center'}}
              >
                
                <List.Item.Meta
                  avatar={
                  // <img width={272} alt="logo" src={item.houseTypePic} />
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
                )}
              />
              {/* </Modal> */}
        <Form>
           
        </Form>
      </Modal>
    </div>
  )
}

const Create = Form.create()(CreateModal)
Create.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
  filter: PropTypes.object,
}
export default Create