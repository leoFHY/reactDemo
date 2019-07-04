import React, { PureComponent }  from 'react';
import { Tabs, Checkbox } from 'antd';
import { connect } from 'dva'
import PropTypes from 'prop-types'
import FloorInfo from './FloorInfo';
import HouseManagement from './HouseManagement'
import BuildingInfo from './BuildingInfo';
import BuildingInterpret from './BuildingInterpret';
import OperationLog from './OperationLog';
import HouseInfo from './HouseInfo';
import Preferential from './Preferential';
import HouseType from './HouseType';
import Activity from './Activity';
import Commission from './Commission'
import BuildingDynamic from './BuildingDynamic'
import styles from './index.less'
import { deepCopy } from 'utils/copy'
const TabPane = Tabs.TabPane

@connect(({HouseManagement,buildingInfo, filterDetail, loading, bucket,commission }) => ({HouseManagement,buildingInfo, filterDetail, loading, bucket,commission }))
class Tab extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
     isCheckedList: [],
     index: 1
    }
  }
  checkboxList(houseKey) {
    // return;

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
            item = Object.assign({
              checked: isChecked
            }, item)
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
        list: isCheckedList,
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
            item = Object.assign({
              checked: checked
            }, item)
            item.title = ( < div > < Checkbox checked = {
                checked
              }
              onChange = {
                () => this.checkboxList(houseKey)
              }
              /> {houseKey.substr(8)}</div > )
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
  checkboxOnChange = (data, key) => {
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
  openDetail(data, key) {
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
  render() {
    const { dispatch, filterDetail,buildingInfo } = this.props
    const { bfProjectId} = filterDetail
    // console.log(bfProjectId)
    const tabsChange = (key) => {
      this.setState({ index: key })
      let that = this
      if (key === '2'){
        this.props.dispatch({
          type: 'filterDetail/setDetailShow',
          payload: false
        })
        this.props.dispatch({
          type: 'filterDetail/clearColumns',
          payload: {},
        })
        this.props.dispatch({
          type: 'filterDetail/setHouseList',
          payload: {
            data: [],
            columns: [],
          },
        })
        dispatch({
          type: 'filterDetail/getBuildinglist',
          payload: {
            bfProjectId,
          },
          success: (id) => {
           dispatch({
              type: 'filterDetail/getHouseListByBuildingId',
              payload: {
                data: {
                  bfProjectId,
                  buildingId: id,
                },
                that,
              },
            })
          }
        })

      } else if (key === '8') {
        // 日志列表
        dispatch({
          type: 'filterDetail/getLoglist',
          payload: {
            data: {
              bfProjectId,
            }
          },
        })
      } else if (key === '1') { 
          // 楼栋信息列表
         dispatch({
            type: 'filterDetail/getPageList',
            payload: {
              bfProjectId,
            },
          })
          // 楼栋展示名称列表
          dispatch({
            type: 'filterDetail/getBuildingShowNameList',
            payload: {
              bfProjectId
            },
          })
          // oa楼栋名称列表
          dispatch({
            type: 'filterDetail/getOaBuildingNameList',
            payload: {
              bfProjectId,
            },
          })
          dispatch({
            type: 'filterDetail/saveFloorPage',
            payload: 1
          })
      } else if (key === '3') {
         // 富文本信息查询
         dispatch({
           type: 'filterDetail/getUeditorInfo',
           payload: {
             bfProjectId,
           },
         })

      } else if (key === '4') {
          // 楼盘信息查询
          dispatch({
            type: 'buildingInfo/searchProjectInfo',
            payload: {
              bfProjectId,
            },
            success:(data) => {
              // console.log(data)
              dispatch({
                type: 'buildingInfo/getProvince',
                payload: {
                },
              })
              dispatch({
                type: 'buildingInfo/getCity',
                payload: {
                  provinceId: data.lgProvinceName
                },
              })
              dispatch({
                type: 'buildingInfo/saveMediaImages',
                payload: {
                  data:data.fileList
                },
              })
              dispatch({
                type: 'buildingInfo/saveMediaImages1',
                payload: {
                  data: data.fileList1
                },
              })
              dispatch({
                type: 'buildingInfo/savelgMapAddress',
                payload: {
                  data:data.lgMapAddress
                },
              })

            }
          })
          // 标签列表查询
          dispatch({
            type: 'buildingInfo/getTagList',
            payload: {
              bfProjectId,
            },
          })
          
          // judge(record)
          // saveMultipleImgs([record.houseTypePic])
      } else if (key === '5') {
          // 优惠政策信息查询
          dispatch({
            type: 'filterDetail/getUeditorPreInfo',
            payload: {
              bfProjectId,
            },
          })
      } else if (key === '6') {
          // 优惠户型列表
          dispatch({
            type: 'filterDetail/houseTypeDiscountList',
            payload: {
              bfProjectId,
            },
          })
          dispatch({
            type: 'filterDetail/saveDiscountOnchangePage',
            payload: 1
          })
      } else if (key === '7') {
          // 优惠户型列表
          dispatch({
            type: 'detailActivity/getPageList',
            payload: {
              bfProjectId,
            },
          })
      } else if (key === '9') {
          console.log(bfProjectId)
          //户型名称列表
          dispatch({
            type: 'HouseManagement/gethouseTypeNameList',
            payload: {
              bfProjectId,
            },
          })
          //户型结构列表
          dispatch({
            type: 'HouseManagement/gethouseTypeStructureList',
            payload: {
              bfProjectId,
            },
          })
          dispatch({
            type: 'HouseManagement/getPageList',
            payload: {
              data:{bfProjectId},
              type: 'page',
            },
            // type:'page'
          })
          
      } else if (key === '10') {
          dispatch({
            type: 'commission/getInfo',
            payload: {
             bfProjectId
            },
          })
      } else if (key === '11') {
          dispatch({
            type: 'dynamic/getPageList',
            payload: {
             bfProjectId,
             pageNum: 1,
             pageSize: 10,
            },
          })
      }
      
    }
    
    return (
      <Tabs defaultActiveKey="1" onChange={ tabsChange } className={styles.bgtab} >
            <TabPane tab="楼栋信息" key="1" className={ styles.pad }>
                  <FloorInfo />
            </TabPane>
            <TabPane tab="户型管理" key="9" className={ styles.pad }>
                  <HouseManagement />
            </TabPane>
            <TabPane tab="房源信息" key="2" className={styles.pad}>
                  <HouseInfo  />
                  {/* <ShowInfo/> */}
            </TabPane>
            <TabPane tab="楼盘解读" key="3"  className={ styles.pad }>
                  <BuildingInterpret  ref={(BuildingInterpret)=>{this.interpret = BuildingInterpret;}}  />
            </TabPane>
            <TabPane tab="楼盘信息" key="4"  className={ styles.pad }>
                  <BuildingInfo />
            </TabPane>
            <TabPane tab="优惠政策" key="5"  className={ styles.pad }>
                  <Preferential />
            </TabPane>
            <TabPane tab="户型优惠" key="6"  className={ styles.pad }>
                  <HouseType />
            </TabPane>
            <TabPane tab="佣金信息" key="10"  className={ styles.pad }>
                  <Commission />
            </TabPane>
            <TabPane tab="楼盘动态" key="11"  className={ styles.pad }>
                  <BuildingDynamic />
            </TabPane>
            <TabPane tab="优惠活动" key="7"  className={ styles.pad }>
                  <Activity bfProjectId = {bfProjectId} />
            </TabPane>
            <TabPane tab="操作日志" key="8"  className={ styles.pad }>
                  <OperationLog />
            </TabPane>
          </Tabs>
    );
  } 
};

Tab.propTypes = {
  
}

export default Tab;
