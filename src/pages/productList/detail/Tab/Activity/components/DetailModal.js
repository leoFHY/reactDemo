import React from 'react';
import { Modal, Card  } from 'antd';
import PropTypes from 'prop-types'
import styles from './index.less'
import { getValue } from 'utils/transformData'
const Detail = ({
    visible,
    onOk,
    onCancel,
    detailActivity
  }) => {
    const { detailData, typeList } = detailActivity
    const saleStatusList = {
      '0': '未卖出',
      '1': '已卖出',
    }
    const discountTypeList = {
      '1': '拍卖'
    }
  return(
    <div>
      <Modal title = "活动详情"
          visible={visible}
          onOk={onOk} 
          onCancel={onCancel}
          okText = "确认"
          cancelText = '取消'
          maskClosable = {false}
      >
        <Card title="活动信息" className = {styles.box} bordered = {false}>
             <div className = {styles.label}><span>优惠名称:</span><span className= { styles.span }>{detailData.specialOfferName || ''}</span></div> 
             <div className = {styles.label}><span>活动时间段:</span><span className= { styles.span }>{`${detailData.startDate}至${detailData.endDate}`}</span></div>    
             <div className = {styles.label}><span>优惠类型:</span><span className= { styles.span }>{discountTypeList[detailData.discountType] || ''}</span></div>    
             <div className = {styles.label}><span>优惠房源:</span><span className= { styles.span }>{detailData.houseName || ''}</span></div> 
             <div className = {styles.label}><span>起始价:</span><span className= { styles.span }>{(detailData.startAmount && `${detailData.startAmount}元`)|| ''}</span></div>    
             <div className = {styles.label}><span>底价:</span><span className= { styles.span }>{(detailData.minAmount && `${detailData.minAmount}元`) || ''}</span></div>       
        </Card>
        <Card title="活动结果" className = {styles.box} bordered = {false}>
             <div className = {styles.label}><span>拍卖结果:</span><span className= { styles.span }>{saleStatusList[detailData.saleStatus] || ''}</span></div> 
             <div className = {styles.label}><span>购房人:</span><span className= { styles.span }>{detailData.customerName || ''}</span></div>    
             <div className = {styles.label}><span>手机号:</span><span className= { styles.span }>{detailData.phone || ''}</span></div>    
             <div className = {styles.label}><span>购房人身份:</span>
              {
              detailData.type ? detailData.type.map((v,i) => {
                   return (
                     <span className= { styles.span } key={i}>
                      {getValue(v,typeList)} &nbsp;
                     </span>
                   )
               }) : null
              } 
             
           </div> 
             <div className = {styles.label}><span>购得金额:</span><span className= { styles.span }>{(detailData.money && `${detailData.money}元`) || ''}</span></div>    
        </Card>
      </Modal>
    </div>
  )
}


Detail.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
  filter: PropTypes.object,
}
export default Detail