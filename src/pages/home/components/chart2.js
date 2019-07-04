import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { GetMonth } from 'utils/copy'
const Chart1 = ({Xlist,Ylist,typeData,title,dateShow,barWidth}) => {
    const date = new Date;
    const year = date.getFullYear();
    const list = Xlist || []
    const startDate = list.length ? `${GetMonth(-2)}-${list[0]}` : '';
    const endDate = list.length ? `${year}-${list[list.length - 1]}` : '';
    const time = startDate ? `${startDate}~${endDate}` : ''
    const series = [],color = [],legendList = []
    Ylist = Ylist || []
    Ylist.map ((v,i)=>{
       series.push({
              name: v.channelName,
              type: typeData,
              barWidth: barWidth,
              data: v.countList || [],
       })
        const r = Math.round((Math.random()*255)).toString(16);
        const g = Math.round((Math.random()*255)).toString(16);
        const b = Math.round((Math.random()*255)).toString(16);
        const data  = "#"+r+g+b;
       color.push(data)
       legendList.push(v.channelName)
    })
    const option = {
        title : {
            text: title,
            subtext: dateShow ? `统计时间：${time} | 近两月` : null
        },
        color: color || [],
        tooltip : {
            trigger: 'axis'
        },
        legend:{
          data: legendList || []
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
                data: Xlist || []
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : series
    };
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
