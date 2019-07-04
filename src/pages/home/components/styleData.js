import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col,Card } from 'antd'
import classNames from 'classnames'
import styles from './index.less'
import { toThousands } from  'utils/copy'
const Cards = ({
  list
}) => {
  
  return (
    <Row className ={styles.box}>
  
       {
         list.map((item, i) => {
              return (
                <Col span={ i == 4 ? 4 : 5} key={i}>
                  <Card>
                      <div className ={styles.item}>
                        <div>
                          <span className ={styles.title}>{item.name || ''}</span>
                        <h2>{item.count ? `${item.count}` : 0}组</h2>
                        </div>
                        {
                          (i == 0 || i == 1 || i == 3) ? < div className = {
                            styles.pre
                          } >
                              <span>{i == 3 ? '邀请率' : '上线率'}</span>
                              <div>{item.shangXian || 0}%</div>
                            </div> : null
                        }
                        
                      </div>  
                      <div className ={styles.item}>
                        <span>7天活跃数</span>  
                      <div>{item.countSeven ? `${item.countSeven}` : 0}组</div> 
                      </div> 
                      <div className ={styles.item}>
                        <span>30天活跃数</span>  
                      <div>{item.countThirty ? `${item.countThirty}` : 0}组</div> 
                      </div>   
                      <div className ={styles.item}>
                        <span>认筹数</span>  
                      <div>{item.renchou ? `${item.renchou}` : 0}组</div> 
                      </div> 
                      <div className ={styles.item}>
                        <span>认购数</span>  
                      <div>{item.rengou ? `${item.rengou}` : 0}组</div> 
                      </div>     
                      <div className ={styles.item}>
                        <span>认购金额</span>  
                      <div>{toThousands(Math.round(item.rengouMoney/10000)) || 0}万元</div> 
                      </div>     
                  </Card> 
                </Col>  
                )
         }) 
       }
    </Row>
    
    
  )
}

Cards.propTypes = {
  list: PropTypes.array,
}

export default Cards
