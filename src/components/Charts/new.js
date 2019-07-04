import React from 'react'
import ReactEcharts from 'echarts-for-react'

class New extends React.Component {
  constructor(props) {
    super(props)
    this.timeTicket = null
    this.count = 51

    const option = {
        title : {
            text: '某地区蒸发量和降水量',
            subtext: '纯属虚构'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['蒸发量','降水量']
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'蒸发量',
                type:'bar',
                data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                
            },
            {
                name:'降水量',
                type:'bar',
                data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
               
            }
        ]
    }

    this.state = {
      option,
    }

    this.fetchNewDate = this.fetchNewDate.bind(this)
  }

  fetchNewDate() {
    let axisData = new Date().toLocaleTimeString().replace(/^\D*/, '')
    let { option } = this.state
    option.title.text = `Hello Echarts-for-react.${new Date().getSeconds()}`
    let data0 = option.series[0].data
    let data1 = option.series[1].data
    data0.shift()
    data0.push(Math.round(Math.random() * 1000))
    data1.shift()
    data1.push((Math.random() * 10 + 5).toFixed(1) - 0)

    option.xAxis[0].data.shift()
    option.xAxis[0].data.push(axisData)
    // option.xAxis[1].data.shift()
    // option.xAxis[1].data.push((this.count += 1))
    this.setState({ option })
  }

  componentDidMount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket)
    }
    this.timeTicket = setInterval(this.fetchNewDate, 1000)
  }

  componentWillUnmount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket)
    }
  }

  render() {
    
    return (
      <div>
          {/* <label> use React state to render dynamic chart</label> */}
          <ReactEcharts
            ref="echarts_react"
            option={this.state.option}
            style={{ height: 400 }}
          />
      </div>
    )
  }
}

export default New
