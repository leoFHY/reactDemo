import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types'
import styles from './index.less'


const Info = ({
 list,
 dispatch
}) => {
  return (
    <div className= { styles.info } >
        <div className = {styles.icon}>
            <Icon  type="double-right" onClick={() => {
            dispatch ({
              type: 'filterDetail/setDetailShow',
              payload: false
            })
          }} />
        </div>
       <h3>房源信息</h3>
       <div className = {styles.label}><span>房源号：</span><span className= { styles.span }>{list.houseNo}</span></div>    
       <div className = {styles.label}><span>楼栋：</span><span className= { styles.span }>{list.buildingName}</span></div>    
       <div className = {styles.label}><span>单元：</span><span className= { styles.span }>{list.unit}</span></div>    
       <div className = {styles.label}><span>楼层：</span><span className= { styles.span }>{list.floorNumber}</span></div>
       <div className = {styles.label}><span>户型名称：</span><span className= { styles.span }>{list.houseTypeName	}</span></div>    
       <div className = {styles.label}><span>户型结构：</span><span className= { styles.span }>{list.houseTypeDec}</span></div>    
       <div className = {styles.label}><span>建筑面积：</span><span className= { styles.span }>{list.floorArea}m<sup>2</sup></span></div>    
       <div className = {styles.label}><span>房源单价：</span><span className= { styles.span }>{`${list.unitPrice}元/`}m<sup>2</sup></span></div>
       <div className = {styles.label}><span>总房款：</span><span className= { styles.span }>{`${list.totalAmount}元`}</span></div>    
       <div className = {styles.label}><span>锁定状态：</span><span className= { styles.span }>{list.houseStatus === '1' ? '是 ' : '否'}</span></div>  
    </div>
  );
};
Info.propTypes = {
  resetValue: PropTypes.func,
  handleSubmit: PropTypes.func,
  filter: PropTypes.object,
}
export default Info;
