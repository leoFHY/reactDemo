import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import { router } from 'utils'
import { connect } from 'dva'
// import { Page } from 'components'
import './index.less';
// import styles from './index.less';
import { Checkbox } from 'antd';
import Header from './Tab/Header';
import Tab from './Tab/index';
import { deepCopy } from 'utils/copy'

@connect(({ filterDetail, filter, loading }) => ({ filterDetail, loading, filter }))
class Detail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount() {
    const bfProjectId = this.props.location.query.bfProjectId
    console.log(bfProjectId)
    const status = this.props.location.query.status
    this.props.dispatch({
      type: 'filterDetail/saveQuery',
      payload: {
        bfProjectId,
        status
      },
    })
     // 请求商品展示名称
     this.props.dispatch({
       type: 'filter/getShowProduct',
       payload: {},
     })
     // 楼栋信息列表
     this.props.dispatch({
       type: 'filterDetail/getPageList',
       payload: {
         bfProjectId,
       },
     })
     // 楼栋展示名称列表
     this.props.dispatch({
       type: 'filterDetail/getBuildingShowNameList',
       payload: {
         bfProjectId
       },
     })
     // oa楼栋名称列表
     this.props.dispatch({
       type: 'filterDetail/getOaBuildingNameList',
       payload: {
         bfProjectId,
       },
     })
     this.props.dispatch({
       type: 'filterDetail/saveFloorPage',
       payload: 1
     })
    // // 获取所属楼栋列表
    //  this.props.dispatch({
    //     type: 'filterDetail/clearColumns',
    //     payload: {},
    //   })
     
    //  this.props.dispatch({
    //   type: 'filterDetail/setHouseList',
    //   payload: {
    //     data: [],
    //     columns: [],
    //   },
    // })
    // this.props.dispatch({
    //   type: 'filterDetail/getBuildinglist',
    //   payload: {
    //     bfProjectId,
    //   },
    //   success: (id) =>{
    //     this.props.dispatch({
    //     type: 'filterDetail/getHouseListByBuildingId',
    //       payload: {
    //         data:{
    //           bfProjectId,
    //           buildingId: id,
    //         },
    //         that: this
    //       },
    //     })
    //   }
    // })

    // // 日志列表
    // this.props.dispatch({
    //   type: 'filterDetail/getLoglist',
    //   payload: {
    //     data:{
    //     bfProjectId,
    //     }
    //   },
    // })
    // // 楼栋信息列表
    // this.props.dispatch({
    //   type: 'filterDetail/getPageList',
    //   payload: {
    //       bfProjectId,
    //   },
    // })
    // // 楼栋展示名称列表
    // this.props.dispatch({
    //   type: 'filterDetail/getBuildingShowNameList',
    //   payload: {
    //       bfProjectId
    //   },
    // })
    // // oa楼栋名称列表
    // this.props.dispatch({
    //   type: 'filterDetail/getOaBuildingNameList',
    //   payload: {
    //        bfProjectId,
    //   },
    // })
    // 楼盘信息查询
    // this.props.dispatch({
    //   type: 'filterDetail/searchProjectInfo',
    //   payload: {
    //     bfProjectId,
    //   },
    // })
    // // 富文本信息查询
    // this.props.dispatch({
    //   type: 'filterDetail/getUeditorInfo',
    //   payload: {
    //     bfProjectId,
    //   },
    // })
    // // 优惠政策信息查询
    // this.props.dispatch({
    //   type: 'filterDetail/getUeditorPreInfo',
    //   payload: {
    //     bfProjectId,
    //   },
    // })
    // 关注和浏览
    this.props.dispatch({
      type: 'filterDetail/followBrowse',
      payload: {
        bfProjectId,
      },
    })
  }
  componentWillUnmount() {
    // this.props.dispatch({
    //   type: 'filterDetail/clearColumns',
    //   payload: {},
    // })
  }
  openDetail(data, key){
    let houseId = data[key].id
    this.props.dispatch({
      type: 'filterDetail/getHouseDetil',
      payload: {
        houseId,
      },
      success: () => {
        this.props.dispatch({
          type: 'filterDetail/setDetailShow',
          payload: true,
        })
      }
    })
  }
  checkboxList (houseKey) {
    const list = deepCopy(this.props.filterDetail.houseList)
    const columnsChecked = deepCopy(this.props.filterDetail.columnsChecked)
    
    let isCheckedList = deepCopy(this.props.filterDetail.isCheckedList)
    const isChecked = !columnsChecked[houseKey]
    list.forEach((v) => {
      Object.keys(v).forEach((key) => {
        if (key !== 'floor') {
          if (key === houseKey) {
            let item = v[key]
            // v = Object.assign({checked:''},v[key])
            item= Object.assign({checked:isChecked},item)
            // v[`${key}`] = item
            
            v[key].checked = isChecked
            if (isCheckedList.some(vItem => vItem.id === v[key].id)) {
              if (!isChecked) {
                isCheckedList = isCheckedList.filter(vItem => vItem.id !== v[key].id)
              }
            } else if (isChecked) {
              isCheckedList.push(item)
            }
          }
        }
      })
    })
    this.props.dispatch({
      type: 'filterDetail/changeList',
      payload: {
        list,
      },
    })
    
    
     this.props.dispatch({
       type: 'filterDetail/saveCheckedList',
       payload: {
         list:isCheckedList,
       },
     })
     
    this.titleChecked(houseKey, isChecked)
  }
  titleChecked = (houseKey, checked) => {
    const columns = this.props.filterDetail.columns
    const columnsChecked = deepCopy(this.props.filterDetail.columnsChecked)
    columnsChecked[houseKey] = checked
    columns.forEach((v) => {
      if (v.children) {
        v.children.forEach((item) => {
          if (item.key === `${houseKey}.id`) {
            // item.checked = checked
            item = Object.assign({checked:checked},item)
            item.title = (<div><Checkbox checked={checked} onChange={() => this.checkboxList(houseKey)} /> {houseKey.substr(8)}</div>)
          }
        })
      }
    })
    this.props.dispatch({
      type: 'filterDetail/changeColumns',
      payload: {
        list: columns,
        columnsChecked,
      },
    })
  }
  checkboxOnChange = (data, key) =>{
    let id = data[key].id
    let list = deepCopy(this.props.filterDetail.houseList)
    const isCheckedList = deepCopy(this.props.filterDetail.isCheckedList)
    let itemList = list.filter(v => v.floor === data.floor)
    itemList[0][key].checked = !itemList[0][key].checked
    let list2 = []
    this.props.dispatch({
      type: 'filterDetail/changeList',
      payload: {
        list,
      },
    })
    if (itemList[0][key].checked) {
      // 选中
      list2 = [...isCheckedList, data[key]]
    } else {
      // 移除
      list2 = isCheckedList.filter((item) => {
        return item.id !== data[key].id
      })
    }
    const listLen = list.filter(v => v[key]).length
    const chooseLen = list2.filter(v => v.houseKey === key).length
    this.titleChecked(key, listLen === chooseLen)
    this.props.dispatch({
      type: 'filterDetail/saveCheckedList',
      payload: {
        list: list2,
      },
    })
  }
  render() {
    const { filterDetail,dispatch,filter } = this.props
    const headerProps = {
      query: this.props.location.query,
    }
    return (
      <div>
          <Header {...headerProps} />
          <Tab dispatch = { dispatch } />
      </div>
    )
  }
}

Detail.propTypes = {
  filter: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Detail
