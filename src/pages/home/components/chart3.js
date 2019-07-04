import React from 'react'
import ReactEcharts from 'echarts-for-react'
import {  Row, Col, Card,Form ,Input,LocaleProvider,DatePicker,Select } from 'antd'
import { GetMonth } from 'utils/copy'
import moment from 'moment'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option

const Chart3 = ({
    
    Ylist,
    dataList,
    lineChange,
    firststatus,
    graphstatus,
    dateChange,
    typeData,
    color,
    title,
    dateShow,
    barWidth,
    axisLabel}) => {
    // console.log(dataList)
    const date = new Date()
    const year = date.getFullYear()
    const list = dataList.dateList || []
    const startDate = list.length ? `${GetMonth(-2)}-${list[0]}` : ''
    const endDate = list.length ? `${year}-${list[list.length - 1]}` : ''
    const time = startDate ? `${startDate}~${endDate}` : ''
    const lineVisible = false
    
    const status = {
        firststatus:""
    }
    // console.log(dataList)
    const option = {
        title : {
            text: title,
            subtext: dateShow ? `统计时间：${time} | 近两月` : null
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'
            }
        },
       
        legend: {
            data: ['员工', '业主','供应商','蓝朋友','访客'],
            align: 'left',
            left: 170,
            itemWidth:14,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            name:"",
            type: 'category',
            data: dataList.dateList || [],
            // data:['周一','10-08','10-11','10-12','10-21','11-01','11-02','11-04','11-06','11-07','11-08'],
            axisLabel: axisLabel|| {} 
        },
        yAxis:  {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            name:"",
            // max:3000,
            scale: true,
        },
        
        series: [
            {
                name: '员工',
                type:  firststatus === "polyline"?"line":'bar' ,
            
                stack: firststatus === "polyline"?null:'总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                // data: [320, 302, 301, 334, 390, 330, 320],
                data:dataList.yuangong || []
            },
            {
                name: '业主',
                type:  firststatus === "polyline"?"line":'bar' ,
                stack: firststatus === "polyline"?null:'总量',
               
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data:dataList.yezhu || [],
                // data: [120, 132, 101, 134, 90, 230, 210],
               
            },
            {
                name: '供应商',
                type:  firststatus === "polyline"?"line":'bar' ,
                stack: firststatus === "polyline"?null:'总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data:dataList.gongying || [],
                // data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '蓝朋友',
                type: firststatus === "polyline"?"line":'bar' ,
                stack: firststatus === "polyline"?null:'总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data:dataList.lanpengyou || [],
                // data: [150, 212, 201, 154, 190, 330, 410]
            },
            {
                name: '访客',
                type:  firststatus === "polyline"?"line":'bar' ,
                stack: firststatus === "polyline"?null:'总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data:dataList.fangke || [],
                // data: [820, 832, 901, 934, 1290, 1330, 1320]
            },
        ]
    }
     
    
    return (
      <div>
          <Form>
          <Row gutter ={24} style={{ position:'relative' }}>
            <Col span={12} style={{  }}>
            </Col>
           
            {/* <Col span={4} style={{position:'absolute', textAlign:'right',paddingTop:'5px',borderRadius:'5px 5px'}}>
              日期
            </Col> */}
            <Col span={7} style={{ padding:'0' ,position:'absolute',right:'120px',top:'-6px',zIndex:999}}>
            <FormItem label={'日期'} 
              labelCol={{ span: 6 }}
              wrapperCol= {{ span: 18 }}
              id="abc"
            >
              <LocaleProvider locale={zh_CN}> 
                {/* {
                getFieldDecorator('time', {
                  initialValue: [],
                })( )
                } */}
                <RangePicker  
                    format="YYYY-MM-DD"  
                    getPopupContainer={() => document.getElementById('abc')}
                    onChange={dateChange}
                /> 
              </LocaleProvider>
            </FormItem>
            </Col>
            <Col span={2} style={{ padding:'0',position:'absolute',right:'35px',top:'0px',zIndex:999 }}>
              <InputGroup compact style={{width: '100%', borderRadius:'5px 5px'}}>
                <Select 
                    defaultValue="columnar"  
                    style={{ marginLeft:'10px',borderRadius:'5px 5px'}}
                    onChange={lineChange}
                >
                  <Option value="polyline">折线图</Option>
                  <Option value="columnar">柱状图</Option>
                </Select>
              </InputGroup>
            </Col>
          </Row>
          </Form>
          <ReactEcharts
            option={option}
            style={{ height: 400 }}
          />
      </div>
    )
 
}

export default Chart3
