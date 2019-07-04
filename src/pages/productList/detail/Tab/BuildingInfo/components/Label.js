import React from 'react';
import {  Input, Button  } from 'antd';
import PropTypes from 'prop-types'
import styles from '../index.less'


const Label = ({
  buildingInfo,
  dispatch
}) => {
  const { labelList, labelInfo } = buildingInfo

  const btClick = (id) => {
    let list = labelList[labelList.findIndex(v => v.tagId === id)]
    list.isChoose ? list.isChoose = 0 : list.isChoose = 1
    dispatch({
      type: 'buildingInfo/changeChoose',
      payload: {
        data: labelList
      },
    })
  }
  const addLabel = () =>{
     if(labelInfo){
         dispatch({
           type: 'buildingInfo/addLabel',
           payload: {
             tagName: labelInfo
           },
         })
     }
  }
  const changeLabel = (e) => {
     dispatch({
       type: 'buildingInfo/saveLabelInfo',
       payload: {
         data: e.target.value
       },
     })
  }
  return (
    <div>
      <div className = {styles.box}>
          {
            labelList.map((v,i) => (
              <span className = {v.isChoose? styles.bt :false} onClick = {() => btClick(v.tagId)} key = {v.tagId} >{v.tagName}</span>
            )
          )}
      </div>
      <div className = {styles.box}>
        <div className = {styles.name}>自定义: </div>
        <div>
          <Input  style = {{width:'200px'}} onChange = {(e) => changeLabel(e)} value = {labelInfo}/>
          <Button type="primary" onClick = {addLabel}>确定</Button>
        </div>
        
      </div>
    </div>
  );
};

Label.propTypes = {

}
export default Label;
