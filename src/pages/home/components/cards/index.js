import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col,Card } from 'antd'
import styles from './index.less'
import { toThousands } from  'utils/copy'
const Cards = ({
  list,
  yesterdayAddList,
  totalUserBuyData
}) => {
  // console.log(list)
  return (
    <div>
    <Row className={styles.box}  gutter={24}>
       {
         yesterdayAddList.map((item, i) => {
              return (
                <Col key={i} className={styles.card1} span={6}>
                  <Card className={styles.cards} >
                        <p>{item.name}</p>
                        <p className={styles.num}>{toThousands(item.count) || 0}</p>
                        <p className={styles.update}>昨日新增<span style = {{fontWeight: '400'}}>{item.todayCount || 0 }<b style = {{fontWeight: '650'}}>组</b></span></p>
                  </Card> 
                </Col>  
                )
         })
       }
       {/* {
         totalUserBuyData ?
          <Col key={3} className={styles.card}>
            <Card className={styles.cards} >
                  <p>总认购金额（万元）</p>
                  <p className={styles.num}>{toThousands(Math.round(totalUserBuyData.totalMoney/10000)) || 0}</p>
                  <p className={styles.update}>今日新增<span style = {{fontWeight: '400'}}>{toThousands(Math.round(totalUserBuyData.todayMoney/10000)) || 0 }<b style = {{fontWeight: '650'}}>万元</b></span></p>
            </Card> 
          </Col> : null
       } */}
        
    </Row>
    <Row className={styles.box} >
       {
         list.map((item, i) => {
              return (
                <Col key={i} className={styles.card} >
                  <Card className={styles.cards} >
                        <p>{item.name}</p>
                        <p className={styles.num}>{toThousands(item.count) || 0}</p>
                        <p className={styles.update}>今日新增<span style = {{fontWeight: '400'}}>{item.todayCount || 0 }<b style = {{fontWeight: '650'}}>组</b></span></p>
                  </Card> 
                </Col>  
                )
         })
       }
       {
         totalUserBuyData ?
          <Col key={3} className={styles.card}>
            <Card className={styles.cards} >
                  <p>总认购金额（万元）</p>
                  <p className={styles.num}>{toThousands(Math.round(totalUserBuyData.totalMoney/10000)) || 0}</p>
                  <p className={styles.update}>今日新增<span style = {{fontWeight: '400'}}>{toThousands(Math.round(totalUserBuyData.todayMoney/10000)) || 0 }<b style = {{fontWeight: '650'}}>万元</b></span></p>
            </Card> 
          </Col> : null
       }
        
    </Row>
    </div>
    
  )
}

Cards.propTypes = {
  list: PropTypes.array,
}

export default Cards
