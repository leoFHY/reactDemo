import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less';
import { Col, Row, Card } from 'antd';
import Filter from './components/Filter';
import Chart1 from 'components/Charts/chart1';
import moment from 'moment';
import { getValue } from 'utils/transformData'
@connect(({ customer, loading }) => ({ customer, loading }))
class Project extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  render() {
    const { dispatch, customer } = this.props
    const { channelList, userAgeList, userHouseList,  userIdentityList,typeLists} = customer
    const chartColor = ['#4f9afe']
    const identityList = []
    if (userIdentityList && userIdentityList.identity && userIdentityList.identity) {
      userIdentityList.identity.forEach(v => {
          identityList.push(getValue(v, typeLists))
      });
    }
    const identityAxisLabel =  {  
                      interval: 0,  
                      formatter:function(value)  
                      {  
                          var ret = "";//拼接加\n返回的类目项  
                          var maxLength = 5;//每项显示文字个数  
                          var valLength = value.length;//X轴类目项的文字个数  
                          var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
                          if (rowN > 1)//如果类目项的文字大于3,  
                          {  
                              for (var i = 0; i < rowN; i++) {  
                                  var temp = "";//每次截取的字符串  
                                  var start = i * maxLength;//开始截取的位置  
                                  var end = start + maxLength;//结束截取的位置  
                                  //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                                  temp = value.substring(start, end) + "\n";  
                                  ret += temp; //凭借最终的字符串  
                              }  
                              return ret;  
                          }  
                          else {  
                              return value;  
                          }  
                      }
                  } 
    
    // 搜索   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          dispatch({
            type: 'customer/getUserDetail',
            payload: values,
            success: () => {
               dispatch({
                  type: 'customer/getUserBehaviorLog',
                  payload: {
                    userPhone: values.userPhone,
                    pageNum: 1,
                    pageSize: 10
                  },
               });
              router.replace({
                pathname: '/customer/detail',
                query: {
                  userPhone: values.userPhone,
                },
              })
            }
          });
        }
      });
    };
    // 重置
    const handleReset = cbFn => {
      cbFn && cbFn();
    };
    
    return (
      <Page className={styles.bg}>
      <Row>
         <Col span={12} style={{lineHeight:'40px'}} style={{color:'#999'}}>
            <span>更新时间:</span><span>{ moment().format('YYYY-MM-DD HH:mm:ss') }</span>
         </Col>
         <Col span={12}>
            <Filter handleSubmit={handleSubmit} resetValue={handleReset} />
         </Col>
      </Row>
      <Row>
         <Col span={12}>
            <Card>
               <Chart1 Xlist = {channelList && channelList.channelName } Ylist = {channelList.count || []} typeData = 'bar' title='各渠道来源情况' color = {chartColor} dateShow = {false} barWidth = {30}/>               
            </Card>
         </Col>
         <Col span={12} style = {{paddingLeft:'10px'}}>
            <Card>
               <Chart1 Xlist = {identityList} axisLabel={identityAxisLabel} Ylist = {userIdentityList.count || []} typeData = 'bar' title='各身份类型用户数' color = {chartColor} dateShow = {false}barWidth = {30}/>               
            </Card>
         </Col>
      </Row> 
      <Row style= {{marginTop: '20px'}}>  
         <Col span={12}>
            <Card>
               <Chart1 Xlist = {userAgeList && userAgeList.age} Ylist = {userAgeList.count || []} typeData = 'bar' title='用户年龄分布' color = {chartColor} dateShow = {false} barWidth = {30}/>              
            </Card>
         </Col>
         <Col span={12} style = {{paddingLeft:'10px'}}>
            <Card>
               <Chart1 Xlist = {userHouseList && userHouseList.houseNum} Ylist = {userHouseList.count || []} typeData = 'bar' title='拥有蓝光房源套数' color = {chartColor} dateShow = {false} barWidth = {30}/>              
            </Card>
         </Col>
      </Row>    
          
      </Page>
    )
  }
}

Project.propTypes = {
  filter: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Project
