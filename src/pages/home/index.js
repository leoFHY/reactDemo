import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card,Form ,Input,LocaleProvider,DatePicker,Select} from 'antd'
import { Color } from 'utils'
import { Page } from 'components'
import Cards from './components/cards'
import Chart1 from 'components/Charts/chart1'
import Chart3 from './components/chart3'
import Chart2 from './components/chart2'
import StyleData from './components/styleData'
import styles from './index.less'
import moment from 'moment'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option

@connect(({ home, loading }) => ({
  home,
  loading,
}))
class Dashboard extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
     status:{
      firststatus:'',
      status2:'',
      status3:'',
      status4:'',
      status5:'',
      status6:'',
     }
    }
  }
  render() {
  
    const style = {
        margin: '20px 0',
        padding:'20px'
    };
    const { home, loading,dispatch } = this.props
    const { 
      userAddData, 
      userDayData, 
      userDailyRegisterData,
      userDailyVisitData,
      userDailyRenchouData,
      totalUserData,
      yesterdayAddList, 
      fourDetailData, 
      projectBrowseData, 
      projectCollectData, 
      totalUserBuyData, 
      userBuyData, 
      saveChannelUserAdd,
      channelUserAddData } = home
      
      //  console.log(userDailyRegisterData)
    const chartColor1 = ['rgba(228, 228, 228, 1)']
    const chartColor2 = ['#0099FF']

    const handleChange=(value) => {
      console.log(value)
    }
    const lineChange = (value) => {
      this.setState({
        status:{firststatus:value}
      })
    }
    const lineChange2 = (value) => {
      this.setState({
        status:{status2:value}
      })
    }
    const lineChange3 = (value) => {
      this.setState({
        status:{status3:value}
      })
    }
    const lineChange4 = (value) => {
      this.setState({
        status:{status4:value}
      })
    }
    const lineChange5 = (value) => {
      this.setState({
        status:{status5:value}
      })
    }
    const lineChange6 = (value) => {
      this.setState({
        status:{status6:value}
      })
    }
    
    const dateChange = (date,dateString) => {
        console.log(date,dateString)
        
       let startDate = dateString[0] || ''
       let endDate = dateString[1] || ''
       dispatch({
        type: 'home/getUserAdd',
        payload: {
          data: {
            startDate:startDate,
            endDate:endDate, 
          },
          
        },
      })
      
    }
    const dateChange2 = (date,dateString) => {
      console.log(date,dateString)
      
     let startDate = dateString[0] || ''
     let endDate = dateString[1] || ''
     dispatch({
      type: 'home/getUserDay',
      payload: {
        data: {
          startDate:startDate,
          endDate:endDate, 
        },
        
        },
      })
      
    }
    const dateChange3 = (date,dateString) => {
      
      console.log(date,dateString)
      
     let startDate = dateString[0] || ''
     let endDate = dateString[1] || ''
     dispatch({
      type: 'home/getUserDailyRegister',
      payload: {
        data: {
          startDate:startDate,
          endDate:endDate, 
        },
        
        },
      })
      
    }
    const dateChange4 = (date,dateString) => {
      let startDate = dateString[0] || ''
      let endDate = dateString[1] || ''
      dispatch({
        type: 'home/getUserDailyVisit',
        payload: {
          data: {
            startDate:startDate,
            endDate:endDate, 
          },
        
        },
      })
      
    }
    const dateChange5 = (date,dateString) => {
      let startDate = dateString[0] || ''
      let endDate = dateString[1] || ''
      dispatch({
        type: 'home/getUserDailyRenchou',
        payload: {
          data: {
            startDate:startDate,
            endDate:endDate, 
          },
        
        },
      })
      
    }
    const dateChange6 = (date,dateString) => {
      let startDate = dateString[0] || ''
      let endDate = dateString[1] || ''
      dispatch({
        type: 'home/getUserBuy',
        payload: {
          data: {
            startDate:startDate,
            endDate:endDate, 
          },
        
        },
      })
      
    }
    return (
      <Page
      >
        <div style={{marginBottom:'20px',color:'#999'}}>
          <span>更新时间:</span><span>{ moment().format('YYYY-MM-DD HH:mm:ss') }</span>
        </div>
        <Cards list ={ totalUserData } yesterdayAddList={yesterdayAddList} totalUserBuyData = { totalUserBuyData }/>
       <Card style={style}>
           <Chart3 
            lineChange={lineChange}
            firststatus = {this.state.status.firststatus}
            dateChange={dateChange} 
            dataList={userAddData}
            // Ylist = {userAddData.countList || []} 
            typeData 
            title='用户新增分日数据' 
            color = {chartColor2} 
            dateShow = {true} 
            barWidth = '100px'
          />
        </Card>

        <Card style={style}>
          <Chart3 
            lineChange={lineChange2}
            firststatus = {this.state.status.status2}
            dateChange={dateChange2} 
            dataList={userDayData}
            // Ylist = {userDayData.countList || []} 
            typeData 
            title='用户日活分日数据'
            color = {chartColor2} 
            dateShow = {true} 
            barWidth = ''
          />
        </Card>

        <Card style={style}>
          <Chart3 
            lineChange={lineChange3}
            firststatus = {this.state.status.status3}
            dateChange={dateChange3} 
            dataList={userDailyRegisterData}
            // Ylist = {userDailyRegisterData.countList || []} 
            typeData 
            title='意向客户登记分日数据'
            color = {chartColor2} 
            dateShow = {true} 
            barWidth = ''
          />
        </Card>
        <Card style={style}>
          <Chart3 
            lineChange={lineChange6}
            firststatus = {this.state.status.status6}
            dateChange={dateChange6} 
            dataList={userBuyData}
            typeData 
            title='用户认购分日数据'
            color = {chartColor2} 
            dateShow = {true} 
            barWidth = ''
          />
        </Card>
        <Row>
          <StyleData list = {fourDetailData}/>
        </Row>
        <Row className={styles.box}>
          <Col span={12}>
             <Card title = "7天楼盘浏览量前十" style = {{ minHeight: '400px'}}>
                {
                  projectBrowseData ?
                  projectBrowseData.map((v, i) => {
                     return (
                       <div className={styles.item} key={i}>
                        <p>
                          <span className={styles.sort}>{i+1}</span>
                          {v.bfProjectName || ''}
                        </p>
                        <p className={styles.right}>
                           {v.count || '0'} 次
                        </p>
                      </div>
                     )
                  }) : null      
                }
              </Card>
          </Col>
          <Col span={12}>
             <Card title = "历史楼盘收藏量前十" style = {{ minHeight: '400px'}}>
                {
                  projectCollectData ?
                  projectCollectData.map((v, i) => {
                     return (
                       <div className={styles.item} key={i}>
                        <p>
                          <span className={styles.sort}>{i+1}</span>
                          {v.bfProjectName || ''}
                        </p>
                        <p className={styles.right}>
                           {v.count || '0'} 次
                        </p>
                      </div>
                     )
                  }) : null      
                }
              </Card>
          </Col>
        </Row>
      </Page>
    )
  }
}

Dashboard.propTypes = {
  home: PropTypes.object,
  loading: PropTypes.object,
}

export default Dashboard
