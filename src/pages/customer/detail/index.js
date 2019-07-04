import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Col, Row, Card, Icon, Collapse, Pagination  } from 'antd';
import { getValue } from 'utils/transformData'
import styles from './index.less';
const Panel = Collapse.Panel;

@connect(({ customer, loading }) => ({ customer, loading }))
class Index extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    const { dispatch, customer } = this.props
    const { userDetailObj, userT, userBehaviorLogList, actionType, pagination, sexList } = customer
    const list = userDetailObj.userIdentity
    const identityList = list ? list.split(',') : []
    const recruitStatusList = userDetailObj.recruitStatusList ? userDetailObj.recruitStatusList : []
    const onChange = (page, pageSize) => {
      dispatch({
        type: 'customer/getUserBehaviorLog',
        payload: {
          userPhone: this.props.location.query.userPhone,
          pageNum: page,
          pageSize: pageSize
        },
      });
    }
    const marry= ['','未婚','已婚']
    return(
      <Page className = {styles.box}>
        <Row className = {styles.item}>
          <Col span={7}>
             <Card className = {styles.introduction} style = {{minHeight:'158px'}}>
             <div className = {styles.box} >
                 <div className = {styles.avatar} >
                    {
                      userDetailObj.avatarUrl ? <img src={userDetailObj.avatarUrl }  alt='头像'/> 
                      :  <div className = {styles.noPic}>暂无头像</div>
                    }
                    <h2>{userDetailObj.userName || ''}</h2>
                  
                      {  
                        identityList.length ?
                          identityList.map((v,i) => (
                            <span key = {i} style ={{whiteSpace:'nowrap',marginBottom:'5px'}}>{userT[parseInt(v)]}</span>
                          )) : '--'
                      }
                </div>
                <div className = {styles.info} style = {{marginLeft: '50px'}}>
                    <div className = {styles.label} style = {{marginTop:'0'}}><span>手机：</span><span>{userDetailObj.phone || '--'}</span></div> 
                    <div className = {styles.label} style = {{marginTop:'0'}}><span>来源渠道：</span><span>{userDetailObj.channel || '--'}</span></div>       
                </div> 
             </div>
              
             </Card>
          </Col>
          <Col span={17} style = {{paddingLeft:'10px'}}>
             <div className = {styles.card} style = {{minHeight:'158px'}}>
                <div className = {styles.title}>
                    <span></span>
                    <span>认筹情况</span>
                </div>
                <div className = {styles.content} style = {{maxHeight:'90px',overflowY:'scroll',paddingRight:'10px'}}>
                   {
                      recruitStatusList.length ?
                        recruitStatusList.map((v,i) => (
                          <div className = {styles.table1} key = {i} style={{paddingLeft:'15px'}}>
                                {v.projectName || '--'}
                                <span>{v.time || '--'}认筹</span>
                            </div> 
                        )) : <div style={{color:'#999',textAlign:'center'}}>-----------暂无数据------------</div>
                   }
                </div>
             </div>
          </Col>
        </Row>
        <Row className = {styles.item} style={{marginBottom: '0'}}>
          <Col span={7}>
             <Row className = {styles.card} style={{marginBottom:'15px'}}>
                <div className = {styles.title}>
                    <span></span>
                    <span>活跃情况</span>
                </div>
                <Row className = {styles.content}>
                   <Col span={15} className = {styles.login}>
                      <Col span={4} className = {styles.icon} style = {{left:'10px'}}>
                         <Icon type="clock-circle" />
                      </Col>
                      <Col span={20}>
                        <div>最近登录时间</div>
                        <div className = {styles.date}>{userDetailObj.loginTime || '--'}</div>
                      </Col>
                   </Col>
                   <Col span={9} className = {styles.login}>
                      <Col span={5} className = {styles.icon}>
                         <Icon type="ordered-list" />
                      </Col>
                      <Col span={19}>
                        <div>总登录次数</div>
                        <div className = {styles.date}>{userDetailObj.loginCount || 0 }次</div>
                      </Col>
                   </Col>
                </Row>
             </Row>
             <Row className = {styles.card}>
                <div className = {styles.title}>
                    <span></span>
                    <span>客户资料</span>
                </div>
                <Row className = {styles.content} style = {{marginLeft:'20px'}}>
                   <Collapse bordered={false} defaultActiveKey={['1']} className = {styles.list}>
                      {/* <div className = {styles.sub_title}>基本信息</div> */}
                      <Panel header = "基本信息" key="1" className = {styles.info}>
                          <div className = {styles.label}><span>姓名：</span><span>{userDetailObj.userName || '--'}</span></div> 
                          <div className = {styles.label}><span>婚姻状况：</span><span>{marry[parseInt(userDetailObj.maritalStatus)] || '--'}</span></div>
                          <div className = {styles.label}><span>手机号：</span><span>{userDetailObj.phone || '--'}</span></div> 
                          <div className = {styles.label}><span>性别：</span>
                          <span>
                            {getValue(userDetailObj.sex,sexList) || '--'}
                          </span></div>
                          <div className = {styles.label}><span>身份证号：</span><span>{userDetailObj.idCard || '--'}</span></div> 
                          <div className = {styles.label}><span>年龄：</span><span>{userDetailObj.age || '--'}</span></div>
                      </Panel>
                      {/* <div className = {styles.sub_title}>位置信息</div> */}
                      <Panel header = "位置信息" key="2" className = {styles.info}>
                          <div className = {styles.label}><span>现住城市：</span><span>{userDetailObj.nowCity || '--'}</span></div> 
                          <div className = {styles.label}><span>老家城市：</span><span>{userDetailObj.oldCity || '--'}</span></div>
                      </Panel>
                      {/* <div className = {styles.sub_title}>单位信息</div> */}
                      <Panel header = "单位信息" key="3" className = {styles.info}>
                          <div className = {styles.label}><span>公司：</span><span>{userDetailObj.company || '--'}</span></div> 
                          <div className = {styles.label}><span>部门：</span><span>{userDetailObj.department || '--'}</span></div>
                      </Panel>
                      {/* <div className = {styles.sub_title}>账号信息</div> */}
                      <Panel header = "账号信息" key="4" className = {styles.info}>
                          <div className = {styles.label}><span>OA账号：</span><span>{userDetailObj.oaAccount || '--'}</span></div> 
                          <div className = {styles.label}><span>微信ID：</span><span>{userDetailObj.wxId || '--'}</span></div>
                      </Panel>
                      {/* <div className = {styles.sub_title}>居住信息</div> */}
                      <Panel header = "居住信息" key="5" className = {styles.info}>
                          <div className = {styles.label}><span>居住小区：</span><span>{userDetailObj.livingQuarter || '--'}</span></div> 
                      </Panel>
                   </Collapse>
                </Row>
             </Row>
          </Col>
          <Col span={17} style = {{paddingLeft:'10px'}}>
            <div className = {styles.card} style = {{minHeight:'306px'}}>
                  <div className = {styles.title}>
                    <span></span>
                    <span>行为日志</span>
                  </div>
                  <div className = {styles.content} style = {{maxHeight:'220px',overflowY:'scroll',paddingRight:'10px'}}>
                    {
                        userBehaviorLogList.length ?
                          userBehaviorLogList.map((v, i) => (
                            <div className = {styles.table2} key = {i} >
                                <span>{i+1}</span>
                                <span>{v.time || '--'}</span>
                                <span>{getValue(v.actionType,actionType) || '--'}</span>
                                <span>{v.sourceName || '--'}</span>
                            </div> 
                          )) : <div style={{color:'#999',textAlign:'center'}}>-----------暂无数据------------</div>
                    }
                  </div>
                  {
                    userBehaviorLogList.length ?  <Pagination showQuickJumper onChange={onChange} defaultCurrent={pagination.pageNum} total={pagination.total} style={{textAlign:'center'}}/>
                    : null
                  }
            </div>
          </Col>
        </Row> 
      </Page>
    )
  }
}

Index.propTypes = {
  filter: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Index
