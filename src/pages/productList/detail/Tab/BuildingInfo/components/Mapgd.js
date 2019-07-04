import React , { Component }from 'react';
import { Form, Input,  Row, Col, Checkbox, Upload, message, Icon, Modal,LocaleProvider,DatePicker,Select   } from 'antd';
import PropTypes from 'prop-types'
import AddMultipleImage from 'components/Upload/AddMultipleImage.js'
import { deepCopy } from 'utils/copy'
import moment from 'moment'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import { Map, MouseTool, Marker} from 'react-amap';
import { SlowBuffer } from 'buffer';

// import './App.css';

// import "http://api.map.baidu.com/api?v=2.0&ak=MG7wAGY1yVDOlaNzEF9G6yH0GiRS3jPw"



const { RangePicker } = DatePicker
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};



// var map = new BMap.Map("allmap"); 
// map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设    置中心点坐标和地图级别
// map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
// map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
// map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
const layerStyle = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  position: 'absolute',
  top: '10px',
  left: '10px'
};


class APP extends React.Component{
  constructor(props){
    super(props);
    const self =this;
    this.state = {
      what: '最后标点为保存地点',
      num:100,
      visible:true
    };
    console.log(this.props.buildingInfo.ProjectInformationList.lgMapAddress)
    this.position = this.props.buildingInfo.ProjectInformationList.lgMapAddress
    this.lat = this.position.split(',')[1]
    this.lng = this.position.split(',')[0]
    if(!this.lat){
      console.log(1111111111111111)
      this.mapCenter = {
        longitude:'121.472026',
        latitude:'31.224222'
      }
    }else {
      this.mapCenter = {longitude:this.lng , latitude:this.lat};
    }
    
    this.amapEvents = {
      created: (mapInstance) => {
        // console.log('高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
        // console.log(mapInstance.getZoom());
        // console.log(mapInstance)
        // console.log(11111111)
        // console.log(mapInstance)
      },
      click: (tool) => {
        
        tool.target.clearMap()
        
      },
    };
    let removeObj = self.state.obj
    
    this.toolEvents = {
      created: (tool) => {
        tool.marker()
        self.tool = tool;  
      },
      click: (tool) => {
       
        tool.visible = false
       
      },
      draw({type,obj}) {
        // console.log(obj)
        
        // obj.G.visible = true
        self.setState({
          obj:obj
        })
        
        // console.log(type)
        self.drawWhat(obj);
        // console.log(self.state.obj)
        
      }
    }
    this.mapPlugins = ['ToolBar'];
    // this.mapCenter = {longitude: 120, latitude: 35};
  }

  drawWhat(obj) {
    // console.log(obj)
    let text = '';
    switch(obj.CLASS_NAME) {
      case 'AMap.Marker':
        text = `你标记坐标位置是 {${obj.getPosition()}}`;
        this.setState({
          lgMapAddress:obj.getPosition().lng.toString() + ',' + obj.getPosition().lat.toString()
        })
        this.props.dispatch({
          type:'buildingInfo/savelgMapAddress',
          payload:{
            data: obj.getPosition().lng.toString()  + ',' + obj.getPosition().lat.toString()
          }
        })
        break;
      default:
        text = '';
    }
    this.setState({
      what: text
    });
  }
  
  // drawMarker(){
  //   if (this.tool){
  //     this.tool.marker();
  //     this.setState({
  //       what: '准备绘制坐标点'
  //     });
  //   }
  // }
  
  render(){
    const { buildingInfo } = this.props
    
    // console.log(this.state.lgMapAddress)
    // console.log(buildingInfo.lgMapAddress)
    const YOUR_AMAP_KEY ="242c7b861218d46c2473c4b56470f039"
    const VERSION ="1.4.14"
    return <div>
      <div style={{width: '100%', height: 370}}>

        <Map 
          plugins={this.mapPlugins}
          center={this.mapCenter}
          position={this.mapCenter}
          events={this.amapEvents}
          version={VERSION}
          amapkey={YOUR_AMAP_KEY}
        >
          <MouseTool events={this.toolEvents}/>
          <Marker
            position={this.mapCenter}
            visible={this.state.visible}
            
          />
          <div style={layerStyle}>{this.state.what}</div>
        </Map>
       </div>
       
     </div>
  }
}
const Mapb= ({
  getFieldDecorator,
  bucket,
  dispatch,
  saveMultipleImgs,
  previewImage,
  previewVisible,
  filterDetail,
  saveUploadImgs,
  mediaImages,
  handleOk,
  buildingInfo,
  handleCancel,
  visible
}) => {
  // console.log(buildingInfo)
  // const fileName = 'buildingInfo/';
  const uploadList = {
    bucket,
    dispatch,
    saveMultipleImgs,
    previewImage,
    previewVisible,
    
  }

  // console.log(buildingInfo.lgMapAddress)
  return (
    <div 
      // style={{width:'100%',height:'42vw'}}
    >
        < Modal 
          // title={name}
          visible={visible}
          onOk={() => handleOk(buildingInfo.lgMapAddress)} 
          onCancel={handleCancel}
          okText = "确认"
          cancelText = "取消"
          maskClosable = {false}
          width = {700}
          height = {400}
          bodyStyle={{
            width:'90%',
            height:'100%'
          }}
          style ={{
            top:70
          }}
        >

          <div
            id='allmap'
             >
             
                <APP buildingInfo={buildingInfo} dispatch={dispatch} style={{width:'100%',height:'100%'}}/>
              {/* <Map amapkey={YOUR_AMAP_KEY} version={VERSION} > */}
              {/* </Map> */}

              
          </div>
        </Modal>
    </div>
  )
}
const Mapgd = Form.create()(Mapb);
Mapgd.propTypes = {
  resetValue: PropTypes.func,
  handleSubmit: PropTypes.func,
  filter: PropTypes.object,
}
export default Mapgd;