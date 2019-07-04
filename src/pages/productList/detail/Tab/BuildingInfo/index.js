import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Button, Collapse, Form, message  } from 'antd';
import AddInfo from './components/AddInfo'
import Label from './components/Label'
import Mapgd from './components/Mapgd'
import moment from 'moment'

const Panel = Collapse.Panel;

@connect(({ buildingInfo,filterDetail, loading, bucket, app }) => ({buildingInfo, filterDetail, loading, bucket, app }))
class Building extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visibleMap:false,
      city:"",
      mapOkList:null,
    }
  }

  render() {
    const { dispatch, filterDetail, app,buildingInfo } = this.props
    const { user } = app
    const { loginName } = user
    const { status } = filterDetail
    const { getFieldDecorator,setFieldsValue,validateFieldsAndScroll,getFieldValue,resetFields	 } = this.props.form;
    const { cityList,provinceList, ProjectInformationList, labelList } = buildingInfo
    const handelSave = cbFn => {
      if (status === '1') {
       
        message.warning('请下架商品后再操作')
        return
      }
      cbFn((err, values) => {
        
        let data = {}
        let city = []
        let province = []
        cityList.map(v => {if(values.city === v.id)  return city.push(v.name)})
        provinceList.map(v => { if(values.province === v.id) return province.push(v.name) })
        // console.log(city)
        if (!err) {
          if(buildingInfo.listImg.length){
            data.buildPic = buildingInfo.listImg[0].url || buildingInfo.projectInformation.fileList[0].url
          }
          if (buildingInfo.listImg1.length) {
            data.h5Pic = buildingInfo.listImg1[0].url || buildingInfo.projectInformation.fileList[0].url
          } else {
            data.h5Pic = ''
          }
          data.bfProjectId = filterDetail.bfProjectId
          data.lgMapAddress = buildingInfo.lgMapAddress
          data.loginName = loginName
          data.lgCityName = city[0] || values.city
          data.lgProvinceName = province[0] || values.province
          data.lgPropertyYears = values.lgPropertyYears
          data.lgOpenDate = values.lgOpenDate.format("YYYY-MM-DD HH:mm:ss")
          data.lgGiveDate = values.lgGiveDate.format("YYYY-MM-DD HH:mm:ss")
          data.lgMapAddress = values.lgMapAddress
          data.lgProjectType = values.lgProjectType.join(',')
          data.lgPropertyYears = values.lgPropertyYears
          data.lgSalesAddress = values.lgSalesAddress
          data.lgSalesPhone = values.lgSalesPhone
          data.lgUnitPrice = values.lgUnitPrice - 0
          data.bfSalesPhone = values.bfSalesPhone
          data.lgProjectAddress = values.lgProjectAddress
          
          // 标签
          let chooseList = labelList.filter(v => v.isChoose)
          let list = chooseList.map(v => {
            return v.tagId
          })
          let labelData = {}
          labelData.bfProjectId = filterDetail.bfProjectId
          labelData.tagIds = list
          dispatch({
            type: 'buildingInfo/pjInfoUpdate',
            payload: data,
            success:() => {
              dispatch({
                type: 'buildingInfo/updateLabel',
                payload: labelData,
              })
            }
          })
          

        }
      });
    }

    const provinceChange = (value) =>{
     
      dispatch({
        type: 'buildingInfo/getCity',
        payload:{provinceId:value} ,
      })
      
    }
    const iconClick = () => {
      
      this.setState({
        visibleMap:true
      })
    }
    const mapCancel = () => {
      this.setState({
        visibleMap:false
      })
    }
    // console.log(buildingInfo.lgMapAddress)
    // 
    const mapOk = (data) => {
   resetFields(`lgMapAddress`, [])
      let list  = {}
      // list[lgMapAddress] = data
      let {
        bfSalesPhone,
        buildPic,
        fileList,
        lgCityName,
        lgGiveDate,
        lgOpenDate,
        lgProjectAddress,
        lgProjectType,
        lgPropertyYears,
        lgProvinceName,
        lgSalesAddress,
        lgSalesPhone,
        lgUnitPrice,
        h5Pic,
        fileList1
        } = ProjectInformationList
        list = {
          bfSalesPhone,
          buildPic,
          fileList,
          lgCityName,
          lgGiveDate,
          lgMapAddress:data,
          lgOpenDate,
          lgProjectAddress,
          lgProjectType,
          lgPropertyYears,
          lgProvinceName,
          lgSalesAddress,
          lgSalesPhone,
          lgUnitPrice,
          h5Pic,
          fileList1
      }
      this.setState({
        mapOkList:list,
        visibleMap:false,
      })
      dispatch({
        type:'buildingInfo/saveProjectInformation',
        payload:{
          data:
            // ProjectInformationList
            list  
        }
        
      })
    }
    const checkChange = (values) => {
      
    }
    const openDateChange = (value) => {
     
      const a = moment(value, "YYYY-MM-DD HH:mm:ss")
     
    }
    const addressChange = (e) => {
    //   console.log(e.target.value)
    //    this.props.dispatch({
    //      type: 'buildingInfo/saveMap',
    //      payload: {
    //        lgMapAddress: e.target.value
    //      },
    //    })
    //  return
      if(this.state.mapOkList){
        // dispatch({
        //   type:'buildingInfo/saveProjectInformation',
        //   payload:{
        //     data:
        //       // ProjectInformationList
        //       this.state.mapOkList 
        //   }
        // })
      }
     
      
      
    }
    const {
      previewImage,
      previewVisible,
      deliveryItemId,
      
    } = filterDetail

    const { listImg, listImg1, previewShow, previewSrc} = buildingInfo
    
    // console.log(buildingInfo)
    // if(listImg.length){
      
    //   this.setState({
    //     buildPic:listImg[0].url
    //   })
    // }else{
    //   this.setState({
    //     buildPic:''
    //   })
    // }
    // console.log(this.state.buildPic)
    
    const contentList = {
      getFieldValue,
      getFieldDecorator, 
      setFieldsValue, 
      bucket: this.props.bucket,
      dispatch: this.props.dispatch,
      filterDetail: filterDetail,
      previewImage,
      provinceChange,
      previewVisible,
      buildingInfo,
      iconClick,
      deliveryItemId: deliveryItemId,
      checkChange,
      openDateChange,
      city:this.state.city,
      // picChange,
      saveMultipleImgs: (url) => {
       
          message.destroy()
          message.info('上传图片成功')
          let listImg = []
          listImg[0] = {}
          listImg[0].uid = 1
          listImg[0].url = url[0]
          this.props.dispatch({
            type: 'buildingInfo/saveMediaImages',
            payload: {
              data: listImg,
            },
          })
      },
      saveMultipleImgs1: (url) => {

        message.destroy()
        message.info('上传图片成功')
        let listImg = []
        listImg[0] = {}
        listImg[0].uid = 1
        listImg[0].url = url[0]
        this.props.dispatch({
          type: 'buildingInfo/saveMediaImages1',
          payload: {
            data: listImg,
          },
        })
      },
      buildPic:this.state.buildPic,
      listImg,
      listImg1,
      previewShow,
      previewSrc,
      addressChange
    }

    const MapList={
      visible : this.state.visibleMap,
      handleCancel:mapCancel,
      handleOk:mapOk,
      buildingInfo,
      dispatch: this.props.dispatch,
    }
    return (
      <Page>
         <Button type="primary" onClick={() => handelSave(validateFieldsAndScroll)} style={{marginBottom: '20px'}}>保存</Button>
         <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="添加信息" key="1">
              <AddInfo  { ...contentList } />
            </Panel>
            <Panel header="添加标签" key="2">
              < Label buildingInfo = {buildingInfo} dispatch = {this.props.dispatch} />
            </Panel> 
          </Collapse>
          <Mapgd {...MapList}></Mapgd>
      </Page>
    )
  }
}
const BuildingInfo = Form.create()(Building);
BuildingInfo.propTypes = {
  buildingInfo: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default BuildingInfo
