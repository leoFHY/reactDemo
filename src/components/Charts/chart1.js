import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { GetMonth } from 'utils/copy'
const Chart1 = ({Xlist,Ylist,typeData,color,title,dateShow,barWidth,axisLabel}) => {
    const date = new Date()
    const year = date.getFullYear()
    const list = Xlist || []
    const startDate = list.length ? `${GetMonth(-2)}-${list[0]}` : ''
    const endDate = list.length ? `${year}-${list[list.length - 1]}` : ''
    const time = startDate ? `${startDate}~${endDate}` : ''
    const option = {
        title : {
            text: title,
            subtext: dateShow ? `统计时间：${time} | 近两月` : null
        },
        color: color || [],
        tooltip : {
            trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data: Xlist || [],
                axisLabel: axisLabel|| {}  
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                // name:'蒸发量',
                type: typeData,
                barWidth: barWidth,
                data: Ylist || [],
            },
        ]
    }
    return (
      <div>
          <ReactEcharts
            option={option}
            style={{ height: 400 }}
          />
      </div>
    )
 
}

export default Chart1
