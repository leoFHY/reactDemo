import React, { PureComponent } from 'react'
import { Form, Input,  Row, Col, Checkbox, DatePicker,LocaleProvider    } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import PropTypes from 'prop-types'
import { connect } from 'dva'
import '../index.less'
import Editor from 'public/react-umeditor/lib/editor'

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
@connect(({ filterDetail, loading, bucket }) => ({ filterDetail, loading, bucket }))
class Preferential extends PureComponent {
  // getFieldDecorator
    constructor(props) {
      super(props);
      this.state = {
        content: ""
      }
    }
    handleChange(content) {
      
      if (content) {
        let html = content.substr(0, 1)
        let data = ''
        if (!(html === '<')) {
          data = `<p>${content}</p>`
        } else {
          data = content
        }
       this.props.dispatch({
         type: 'filterDetail/savePreContent',
         payload: content

       })
        this.props.dispatch({
          type: 'filterDetail/savePreUeditorInfo',
          payload: data

        })
      }
    }
    getIcons() {
      var icons = [
        "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
        "paragraph fontfamily fontsize | superscript subscript | ",
        "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
        "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
        "horizontal date time  | image emotion spechars | inserttable"
      ]
      return icons;
    }
    
  componentDidMount() {
     
   
  }
 
  render() {
    const { dispatch,filterDetail,getFieldDecorator } = this.props
    const {
        preferentialInfo,
        preContent
      } = filterDetail
    var icons = this.getIcons();
    
    var count = 100;
    var editors = [];
    for (var i = 0; i < count; i++) {
      editors.push({
        icons: icons,
      })
    }
     
      const saveUeditorInfo = (content) => {
        if (content) {
          dispatch({
            type: 'filterDetail/savePreUeditorInfo',
            payload: content

          })
        }
      }
     
      return (
        <div>
          <Form>
            <Row gutter={24}>
              <Col span={16}>
                <FormItem label={'政策标题'} {...formItemLayout}>
                  {
                    getFieldDecorator('discountTitle', {
                      initialValue: preferentialInfo.discountTitle,
                    })( < Input placeholder = "政策标题" maxLength={14}/ > )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={16}>
                <FormItem label={'展示时间段'} {...formItemLayout} id="abc">
                  <LocaleProvider locale={zh_CN}>  
                    {
                      getFieldDecorator('time', {
                        initialValue: preferentialInfo.time || [],
                      })( 
                       <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"  getPopupContainer={() => document.getElementById('abc')}/> 
                        )
                    }
                 </LocaleProvider>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
                <Col span={16}>
                  <FormItem label={'政策内容'} {...formItemLayout}>
                      {/* <ReactUeditor
                      value={preferentialInfo.discountRemarks || ''}
                      ueditorPath="/ueditor"
                      plugins={['uploadImage', 'insertCode']}
                      onChange={(content) => saveUeditorInfo(content) }
                      // uploadImage={(e) => {
                      //   imageUpload(e, bucket, ReactUeditor)
                      // }}
                      beforeUpload={() => renewBucketData(dispatch)}
                      isManyImg={false}
                      dispatch={dispatch}
                      getUeditor={getUeditor}
                      style={{width:'100%',height:'400px'}}
                    /> */}
                   <Editor ref="editor"
                    className = 'box1'
                    icons={icons}
                    value={preContent || preferentialInfo.discountRemarks}
                    defaultValue={preferentialInfo.discountRemarks}
                    onChange={this.handleChange.bind(this)}
                    // plugins={plugins} 
                    style={{width:'100%',height:'400px'}}
                    />
                  </FormItem>
                </Col>
            </Row>
          </Form>
        </div>
      );
  }
   
};
const PreferentialView = Form.create()(Preferential);
PreferentialView.propTypes = {
  resetValue: PropTypes.func,
  handleSubmit: PropTypes.func,
  filter: PropTypes.object,
}
export default PreferentialView;
